import { FACTIONS, FACTION_MAP } from '../data/factions.js'
import { BACK_QUESTIONS } from '../data/questions.js'

// 陣営やタイプを増減させた際の登録漏れは静かに壊れる(そのタイプが永久に出なくなる)ため、
// 開発時に検知する。
if (import.meta.env?.DEV) {
  for (const f of FACTIONS) {
    if (!f.typeIds.includes(f.extremeTypeId)) {
      throw new Error(`${f.id}: extremeTypeId「${f.extremeTypeId}」がtypeIdsに含まれていません`)
    }
    const q = BACK_QUESTIONS[f.id]
    if (!q) {
      throw new Error(`${f.id}: BACK_QUESTIONS に定義がありません`)
    }
    for (const question of q) {
      if (question.choices.length !== f.typeIds.length) {
        throw new Error(`${question.id}: 選択肢の数が ${f.id} のタイプ数と一致しません`)
      }
    }
  }
}

/**
 * 選択肢のscoresから、その選択肢が最も加点する軸を1つ返す。
 * 両軸に均等加点する「中立」の選択肢の場合は 'medatsu' を仮の代表値として返す
 * (前半1問目の同点タイブレークにのみ使う値のため、多少恣意的でも実害はない)。
 * @param {Record<string, number>} scores
 */
export function dominantAxis(scores) {
  return (scores.medatsu ?? 0) >= (scores.medatanai ?? 0) ? 'medatsu' : 'medatanai'
}

/**
 * 前半6問の回答から陣営を決める。
 * @param {Array<Record<string, number>>} answerScores 各問で選んだ選択肢の scores の配列
 * @param {string} firstAxis 第1問の回答の dominantAxis(同点時のタイブレークに使う)
 */
export function resolveFaction(answerScores, firstAxis) {
  const totals = { medatsu: 0, medatanai: 0 }
  for (const scores of answerScores) {
    for (const [axis, points] of Object.entries(scores)) {
      totals[axis] += points
    }
  }

  if (totals.medatsu === totals.medatanai) {
    // 両軸に加点する「中立」の選択肢を混ぜたことで、この同点は実際に起こりうる
    // (総当たりで実測済み。詳細はCLAUDE.md 7章)。結果が出ない事態を避けるため、
    // 第1問の回答軸で決着させる。
    return { factionId: firstAxis, totals }
  }

  return { factionId: totals.medatsu > totals.medatanai ? 'medatsu' : 'medatanai', totals }
}

/**
 * 後半5問の回答から最終タイプを決める。
 *
 * 陣営ごとに1タイプだけ「妥協のない極致」(激レア)が存在する。後半5問**すべて**を
 * その激レアタイプの選択肢で貫き通した場合のみ、結果が激レアタイプになる。
 * 1問でも他のタイプを選んだ時点でそのタイプは候補から完全に外れ、
 * 激レアタイプへの回答は「無効票」として扱われる(他のどのタイプにもカウントされない)。
 * 5問中4問だけ激レアタイプ、のような惜しい結果は存在しない、白か黒かの仕様。
 *
 * @param {string} factionId
 * @param {string[]} typeAnswers 各問で選んだ選択肢のtypeIdの配列(5つ)
 */
export function resolveType(factionId, typeAnswers) {
  const faction = FACTION_MAP[factionId]
  const extremeId = faction.extremeTypeId

  if (typeAnswers.every((id) => id === extremeId)) {
    return { typeId: extremeId, counts: null }
  }

  const counts = Object.fromEntries(faction.typeIds.map((id) => [id, 0]))
  for (const id of typeAnswers) {
    if (id === extremeId) continue // 無効票(このタイプは候補から外れているため)
    counts[id] += 1
  }

  const candidates = faction.typeIds.filter((id) => id !== extremeId)
  const best = Math.max(...candidates.map((id) => counts[id]))
  const tied = candidates.filter((id) => counts[id] === best)

  if (tied.length === 1) {
    return { typeId: tied[0], counts }
  }

  // 同点は「最後に選んだ側」を決め手にする。先頭固定にすると特定タイプが
  // 同点を総取りしてしまうため(これまでの分岐判定と同じ方針)。
  for (let i = typeAnswers.length - 1; i >= 0; i -= 1) {
    if (typeAnswers[i] !== extremeId && tied.includes(typeAnswers[i])) {
      return { typeId: typeAnswers[i], counts }
    }
  }

  return { typeId: tied[0], counts }
}
