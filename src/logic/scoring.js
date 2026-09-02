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
 * 前半5問の回答から陣営を決める。
 * @param {string[]} axisAnswers 各問で選んだ選択肢の axis('medatsu'|'medatanai')の配列
 * @param {string} firstAxis 第1問で選んだ axis(同点時のタイブレークに使う)
 */
export function resolveFaction(axisAnswers, firstAxis) {
  const totals = { medatsu: 0, medatanai: 0 }
  for (const axis of axisAnswers) {
    totals[axis] += 2
  }

  if (totals.medatsu === totals.medatanai) {
    // 各問が必ずどちらか一方に+2する等ウェイト方式・5問(奇数)構成のため、
    // 理論上この同点は起こり得ない。それでも結果が出ない事態を避けるため、
    // 第1問の回答軸で決着させるフォールバックを用意しておく。
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
