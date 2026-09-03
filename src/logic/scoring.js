import { FACTIONS, FACTION_MAP, BACK_GROUPS } from '../data/factions.js'
import { BACK_GROUP_QUESTIONS, BACK_FINAL_QUESTIONS } from '../data/questions.js'

// 陣営・グループ・タイプを増減させた際の登録漏れは静かに壊れる(そのタイプが
// 永久に出なくなる)ため、開発時に検知する。
if (import.meta.env?.DEV) {
  for (const f of FACTIONS) {
    const groups = BACK_GROUPS[f.id]
    if (!groups) {
      throw new Error(`${f.id}: BACK_GROUPS に定義がありません`)
    }

    const groupedTypeIds = groups.flatMap((g) => g.typeIds)
    const missing = f.typeIds.filter((id) => !groupedTypeIds.includes(id))
    if (missing.length) {
      throw new Error(`${f.id}: BACK_GROUPS に含まれないタイプがあります: ${missing.join(', ')}`)
    }
    if (!groups.some((g) => g.extremeTypeId === f.extremeTypeId)) {
      throw new Error(`${f.id}: extremeTypeId「${f.extremeTypeId}」を持つグループがありません`)
    }

    const groupQuestions = BACK_GROUP_QUESTIONS[f.id]
    if (!groupQuestions) {
      throw new Error(`${f.id}: BACK_GROUP_QUESTIONS に定義がありません`)
    }
    for (const q of groupQuestions) {
      if (q.choices.length !== groups.length) {
        throw new Error(`${q.id}: 選択肢の数が ${f.id} のグループ数と一致しません`)
      }
    }

    for (const group of groups) {
      const finalQ = BACK_FINAL_QUESTIONS[f.id]?.[group.id]
      if (!finalQ) {
        throw new Error(`${f.id}/${group.id}: BACK_FINAL_QUESTIONS に定義がありません`)
      }
      if (finalQ.choices.length !== group.typeIds.length) {
        throw new Error(`${finalQ.id}: 選択肢の数が ${group.id} のタイプ数と一致しません`)
      }
      if (group.extremeTypeId && !group.typeIds.includes(group.extremeTypeId)) {
        throw new Error(`${group.id}: extremeTypeId「${group.extremeTypeId}」がtypeIdsに含まれていません`)
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
 * グループ決定3問の回答からグループを決める。
 * 似たタイプ2つを1つの選択肢に統合しているため、後半の選択肢数を
 * 6→3(最終問のみ2)に減らせている(詳細はCLAUDE.md 6章)。
 *
 * @param {string} factionId
 * @param {number[]} groupPicks 各問で選んだ選択肢のindex(= BACK_GROUPS[faction] のindex)の配列(3つ)
 */
export function resolveGroup(factionId, groupPicks) {
  const groups = BACK_GROUPS[factionId]
  const counts = groups.map(() => 0)
  for (const pick of groupPicks) {
    counts[pick] += 1
  }

  const best = Math.max(...counts)
  const tied = counts.reduce((acc, v, i) => (v === best ? [...acc, i] : acc), [])

  let groupIndex = tied[0]
  if (tied.length > 1) {
    // 同点は「最後に選んだ側」を決め手にする(これまでの分岐判定と同じ方針)
    for (let i = groupPicks.length - 1; i >= 0; i -= 1) {
      if (tied.includes(groupPicks[i])) {
        groupIndex = groupPicks[i]
        break
      }
    }
  }

  // 3問すべてで同じグループを選び通したか(激レア判定に使う)
  const unanimous = groupPicks.every((pick) => pick === groupIndex)

  return { group: groups[groupIndex], unanimous }
}

/**
 * 最終1問の回答から、グループ内の2タイプのどちらになるかを決める。
 *
 * 武闘派閥(山伏/武士)・忍び(間者/刺客)には「妥協のない極致」(激レア)が
 * 1タイプずつ存在する。**グループ決定3問すべてでそのグループを選び通した上で、
 * 最終問でも激レア側を選んだ場合のみ**激レアタイプに至る。1問でも他グループを
 * 選んでいた場合(グループ自体は点数で押し切って確定したが選び通してはいない)は、
 * 最終問で激レア側を選んでも無効票として扱われ、グループ内のもう一方の
 * タイプに決まる(旧・後半5問時代の「全問一致でなければ無効票」という
 * 白か黒かの仕様を、グループ制のもとでもそのまま踏襲している)。
 *
 * @param {import('../data/factions.js').FACTIONS[number]} group resolveGroupが返したグループ
 * @param {boolean} groupUnanimous resolveGroupが返した「選び通したか」
 * @param {number} finalPickIndex 最終問で選んだ選択肢のindex(= group.typeIds のindex)
 */
export function resolveFinalType(group, groupUnanimous, finalPickIndex) {
  const pickedTypeId = group.typeIds[finalPickIndex]

  if (!group.extremeTypeId) {
    return pickedTypeId
  }

  if (pickedTypeId === group.extremeTypeId && groupUnanimous) {
    return group.extremeTypeId
  }

  return group.typeIds.find((id) => id !== group.extremeTypeId)
}

/**
 * 前半6問の回答から、目立つ/目立たないのどちらかに「純粋」だったか
 * (前半6問の中で一度も逆の軸に加点していないか)を判定する。
 * 中立の選択肢(両軸に加点)を1問でも選ぶと、どちらの純度も満たさなくなる。
 * @param {Array<Record<string, number>>} frontAnswerScores 前半6問で選んだ選択肢の scores の配列
 */
export function resolveFrontPurity(frontAnswerScores) {
  let hasMedatsu = false
  let hasMedatanai = false
  for (const scores of frontAnswerScores) {
    if ((scores.medatsu ?? 0) > 0) hasMedatsu = true
    if ((scores.medatanai ?? 0) > 0) hasMedatanai = true
  }
  return {
    pureMedatsu: hasMedatsu && !hasMedatanai,
    pureMedatanai: hasMedatanai && !hasMedatsu,
  }
}

/**
 * 前半6問の「純度」による最終タイプの上書き。
 *
 * - 武士は前半6問で一度でも「目立たない」に加点していたら、代わりに虚無僧になる
 * - 刺客は前半6問で一度でも「目立つ」に加点していたら、代わりに山伏になる
 *
 * 武士・刺客の2タイプを「2大レア職業」にするための仕組み。当初は間者にも
 * 同じ条件(不純なら商人に差し替え)を課していたが、後半で忍びグループに
 * 辿り着いた人の大半は前半が完全に一色ではない(6問すべてを1つの軸だけで
 * 貫く「純粋」な回答は少数派)ため、間者のほぼ全員が商人に飲み込まれて
 * 商人が全タイプ中最多(24.05%)になってしまった。間者への適用をやめて
 * 元の頻度に戻し、武士・刺客の2タイプだけをこの仕組みで際立たせている。
 *
 * 前半6問の判定(resolveFaction)・後半の激レア判定(resolveGroup/resolveFinalType)
 * とは独立した、最終結果に対する追加の上書きレイヤー。そのため後半で激レア条件
 * (グループ決定3問すべて選び通した上で最終問でも選ぶ)を満たしていても、前半が
 * 純粋でなければここで別のタイプに差し替わる。
 *
 * 差し替え先(虚無僧・山伏)は上書き元(武士・刺客)とは別の陣営に属することが
 * あるため、結果画面では必ず `factionOfType` で最終タイプの実際の所属陣営を
 * 求め直すこと(前半で判定した陣営IDをそのまま使わない)。
 *
 * @param {string} resultId resolveFinalTypeが返した結果
 * @param {Array<Record<string, number>>} frontAnswerScores 前半6問で選んだ選択肢の scores の配列
 */
export function applyFrontPurityOverride(resultId, frontAnswerScores) {
  const { pureMedatsu, pureMedatanai } = resolveFrontPurity(frontAnswerScores)

  if (resultId === 'bushi' && !pureMedatsu) return 'komuso'
  if (resultId === 'shikaku' && !pureMedatanai) return 'yamabushi'

  return resultId
}
