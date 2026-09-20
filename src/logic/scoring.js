import { FACTIONS } from '../data/factions.js'
import { BRANCH_QUESTIONS } from '../data/questions.js'
import { NINJA_TYPE_MAP } from '../data/ninjaTypes.js'

const FACTION_KEYS = ['buke', 'jisha', 'shomin']

// 移動・定住軸(内部専用、画面には出さない)。共通7問で選んだ選択肢のaxisを数え、
// 単独首位の区分と同じmobilityを持つタイプに、最終判定で一律+AXIS_BONUSする。
// ボーナスを貯まった点数に比例させないのは、分岐後3問の素点を上回って
// 結果を塗り替えてしまわないようにするため。
const AXIS_KEYS = ['teiju', 'tokidoki', 'hyohaku']
const AXIS_BONUS = 2

// 分類・タイプを増減させた際の登録漏れは静かに壊れる(そのタイプが永久に
// 出なくなる)ため、開発時に検知する。
if (import.meta.env?.DEV) {
  for (const f of FACTIONS) {
    const questions = BRANCH_QUESTIONS[f.id]
    if (!questions) {
      throw new Error(`${f.id}: BRANCH_QUESTIONS に定義がありません`)
    }
    const scoredTypeIds = new Set(questions.flatMap((q) => q.choices.flatMap((c) => Object.keys(c.scores))))
    const missing = f.typeIds.filter((id) => !scoredTypeIds.has(id))
    if (missing.length) {
      throw new Error(`${f.id}: BRANCH_QUESTIONS で加点されないタイプがあります: ${missing.join(', ')}`)
    }
    // 武士(bushi)以外は必ずmobilityを持つ(付け忘れると軸ボーナスが静かに効かなくなる)
    const badMobility = f.typeIds.filter(
      (id) => id !== 'bushi' && !AXIS_KEYS.includes(NINJA_TYPE_MAP[id]?.mobility),
    )
    if (badMobility.length) {
      throw new Error(`${f.id}: mobility が未設定/不正なタイプがあります: ${badMobility.join(', ')}`)
    }
  }
}

/**
 * scoresオブジェクト(例: { buke: 1, shomin: 1 })の中で、最も加点の高い
 * キーを1つ返す(同点時は最初に見つかったキーを優先)。前半の同点タイブレーク
 * (第7問→第1問)、後半の同点タイブレーク(問3→問1)のどちらにも使う汎用関数。
 * @param {Record<string, number>} scores
 */
function dominantKey(scores) {
  let best = null
  let bestValue = -Infinity
  for (const [key, value] of Object.entries(scores)) {
    if (value > bestValue) {
      best = key
      bestValue = value
    }
  }
  return best
}

/**
 * 同点の候補(winners)から1つに絞り込む共通のタイブレーク処理。
 * 「最後の問の回答のdominantKey」→それでも決まらなければ「最初の問の回答の
 * dominantKey」の順で試すが、**どちらもwinnersに実在する候補でなければ
 * 採用しない**(ここを確認せずに返すと、tie-break対象から除外したはずの
 * タイプ(例: 武士)がdominantKeyの結果としてたまたま返ってきた場合に、
 * 除外を無視して復活してしまうバグになる。実際に武家系のD選択肢
 * (虚無僧+2, 薬師+2)を挟んだ3択中2択武士のケースで、武士を候補から除外した
 * はずなのに最終的に武士が返ってしまう不具合が発生していたため、この
 * 実在チェックを追加した)。どちらも実在しない場合は、winners配列の並び順
 * (呼び出し元のtypeIds順、= 決め打ちの優先順)で先頭のものを採用する。
 * @param {string[]} winners 同点で並んだ候補のtypeId配列
 * @param {Array<{scores: Record<string, number>}>} answers タイブレークの対象になった質問群の回答配列
 */
function breakTie(winners, answers) {
  const lastType = dominantKey(answers[answers.length - 1].scores)
  if (winners.includes(lastType)) return lastType

  const firstType = dominantKey(answers[0].scores)
  if (winners.includes(firstType)) return firstType

  return winners[0]
}

/**
 * 軸ボーナス: mobilityがaxisWinnerと一致するタイプの合計点に+AXIS_BONUSする。
 * axisWinnerがnull(同点・全て0)のときは何もしない。mobilityを持たない武士は
 * 常に対象外。totalsは呼び出し元のオブジェクトを直接更新する。
 * @param {Record<string, number>} totals
 * @param {string[]} typeIds
 * @param {string|null} axisWinner
 */
function applyAxisBonus(totals, typeIds, axisWinner) {
  if (!axisWinner) return
  for (const id of typeIds) {
    if (NINJA_TYPE_MAP[id].mobility === axisWinner) totals[id] += AXIS_BONUS
  }
}

/**
 * 共通7問の回答から「武家系/寺社系/庶民」を判定する。
 * (「忍者タイプ診断_新ロジック仕様書」4章)
 *
 * 1. buke/jisha/shomin それぞれの合計点を出し、最高得点の分類を採用
 * 2. 同点の場合は「第7問の回答」→それでも同点なら「第1問の回答」の順で
 *    タイブレークする(第1問だけで決めると影響が強くなりすぎるための変更)
 * 3. shakou/kamokuの累計値も同時に返す(庶民に分岐した場合のみ後半の
 *    判定で使う。武家系/寺社系に分岐した場合は使われない)
 * 4. 移動・定住軸のaxisWinnerも返す(選択肢のaxisごとに+1し、単独首位の区分。
 *    同点または全て0ならnull)。分類の判定そのものには使わず、最終タイプ判定
 *    (3分類共通)の軸ボーナスにだけ使う
 *
 * @param {Array<{scores: Record<string, number>, shakou?: number, kamoku?: number, axis?: string}>} commonAnswers 共通7問で選んだ選択肢の配列
 */
export function resolveFaction(commonAnswers) {
  const totals = { buke: 0, jisha: 0, shomin: 0 }
  let shakou = 0
  let kamoku = 0
  const axisCounts = { teiju: 0, tokidoki: 0, hyohaku: 0 }

  for (const answer of commonAnswers) {
    for (const key of FACTION_KEYS) {
      totals[key] += answer.scores[key] ?? 0
    }
    shakou += answer.shakou ?? 0
    kamoku += answer.kamoku ?? 0
    if (answer.axis) axisCounts[answer.axis] += 1
  }

  const max = Math.max(...FACTION_KEYS.map((key) => totals[key]))
  const winners = FACTION_KEYS.filter((key) => totals[key] === max)

  const factionId = winners.length === 1 ? winners[0] : breakTie(winners, commonAnswers)

  const axisMax = Math.max(...AXIS_KEYS.map((key) => axisCounts[key]))
  const axisLeaders = AXIS_KEYS.filter((key) => axisCounts[key] === axisMax)
  const axisWinner = axisMax > 0 && axisLeaders.length === 1 ? axisLeaders[0] : null

  return { factionId, totals, shakou, kamoku, axisWinner }
}

/**
 * 分岐後3問(寺社系)の回答から、フラット得点制で最終タイプを決める。
 * 同点は「問3(最後の問)」→「問1(最初の問)」の順でタイブレークする。
 *
 * 同点判定の前に、軸ボーナス(axisWinnerと同じmobilityのタイプに+2)を加算する。
 *
 * @param {string} factionId 'jisha'
 * @param {Array<{scores: Record<string, number>}>} branchAnswers 分岐後3問で選んだ選択肢の配列
 * @param {string|null} [axisWinner] resolveFactionが返した移動・定住軸の首位(なければnull)
 */
export function resolveBranchType(factionId, branchAnswers, axisWinner = null) {
  const typeIds = FACTIONS.find((f) => f.id === factionId).typeIds
  const totals = Object.fromEntries(typeIds.map((id) => [id, 0]))

  for (const answer of branchAnswers) {
    for (const [id, value] of Object.entries(answer.scores)) {
      totals[id] += value
    }
  }

  applyAxisBonus(totals, typeIds, axisWinner)

  const max = Math.max(...typeIds.map((id) => totals[id]))
  const winners = typeIds.filter((id) => totals[id] === max)

  return winners.length === 1 ? winners[0] : breakTie(winners, branchAnswers)
}

/**
 * 分岐後3問(武家系)の回答から、フラット得点制で最終タイプを決める。
 *
 * 武士(bushi)は+1、虚無僧(komuso)・薬師(kusushi)は+2という配点差により、
 * 3問合計の素点では武士が不利になりやすい設計だが、素直に「同点は問3→問1で
 * タイブレーク」を武士にも適用すると、際どい同点(例: 武士2問+他1問)でも
 * 武士が勝ててしまい、意図した「レアさ」が成立しない(総当たりで実測、
 * 全27通り中5通り=18.5%まで上振れすることを確認済み)。
 *
 * そのため武士だけは同点勝ちを許さない特別ルールにしている: 武士が結果に
 * なるのは「3問すべてで武士の選択肢を選び、素点が他の2タイプを単独で
 * 上回った場合」(全27通り中1通り=3.7%)のみ。同点に武士が含まれる場合は
 * 武士を候補から外し、残った候補で(必要なら問3→問1のタイブレークを経て)
 * 虚無僧/薬師のどちらかに決める。虚無僧・薬師同士の同点タイブレークは
 * これまで通り問3→問1。
 *
 * 軸ボーナスは虚無僧・薬師の合計にだけ加算される(武士はmobilityを持たず
 * 対象外)。武士は「素点が、ボーナス加算後の虚無僧・薬師の合計をどちらも
 * 単独で上回る」場合のみ勝つ(同点は従来通り武士が除外される)。
 *
 * @param {Array<{scores: Record<string, number>}>} branchAnswers 分岐後3問で選んだ選択肢の配列
 * @param {string|null} [axisWinner] resolveFactionが返した移動・定住軸の首位(なければnull)
 */
export function resolveBukeType(branchAnswers, axisWinner = null) {
  const typeIds = ['bushi', 'komuso', 'kusushi']
  const totals = Object.fromEntries(typeIds.map((id) => [id, 0]))

  for (const answer of branchAnswers) {
    for (const [id, value] of Object.entries(answer.scores)) {
      totals[id] += value
    }
  }

  applyAxisBonus(totals, typeIds, axisWinner)

  const max = Math.max(...typeIds.map((id) => totals[id]))
  let winners = typeIds.filter((id) => totals[id] === max)

  // 武士は同点勝ちできない(素点で単独最高点の場合のみ武士に至る)
  if (winners.length > 1 && winners.includes('bushi')) {
    winners = winners.filter((id) => id !== 'bushi')
  }

  return winners.length === 1 ? winners[0] : breakTie(winners, branchAnswers)
}

const SHAKOU_TYPE_IDS = ['akindo', 'kusuriya', 'hokashi', 'sarugakushi']
const KAMOKU_TYPE_IDS = ['kanja', 'shikaku']

/**
 * 庶民の分岐後3問の回答から、フラット得点制で最終タイプを決める。
 * 7タイプへの事前クラスター分岐は行わない(6章)。3問の合計得点に、共通7問
 * で貯まったshakou(社交的な選択肢を選んだ回数由来)/kamoku(寡黙な選択肢を
 * 選んだ回数由来)を加算してから最高得点を採用する。常の形は
 * 「目立ちたくない」という独自の動機を保つため、この加算の対象外。
 *
 * 同点は「問3(最後の問)」→「問1(最初の問)」の順でタイブレークする
 * (タイブレークの判定自体はshakou/kamoku加算前の生スコアの優劣で行う)。
 *
 * shakou/kamokuの加算の後に、軸ボーナス(axisWinnerと同じmobilityのタイプに+2)
 * も加算してから比較する。
 *
 * @param {Array<{scores: Record<string, number>}>} branchAnswers 分岐後3問で選んだ選択肢の配列
 * @param {number} shakou 共通7問で貯まったshakouの合計
 * @param {number} kamoku 共通7問で貯まったkamokuの合計
 * @param {string|null} [axisWinner] resolveFactionが返した移動・定住軸の首位(なければnull)
 */
export function resolveShominType(branchAnswers, shakou, kamoku, axisWinner = null) {
  const typeIds = FACTIONS.find((f) => f.id === 'shomin').typeIds
  const totals = Object.fromEntries(typeIds.map((id) => [id, 0]))

  for (const answer of branchAnswers) {
    for (const [id, value] of Object.entries(answer.scores)) {
      totals[id] += value
    }
  }

  for (const id of SHAKOU_TYPE_IDS) totals[id] += shakou
  for (const id of KAMOKU_TYPE_IDS) totals[id] += kamoku
  // 常の形(tsunenokatachi)にはshakou/kamokuを加算しない
  applyAxisBonus(totals, typeIds, axisWinner)

  const max = Math.max(...typeIds.map((id) => totals[id]))
  const winners = typeIds.filter((id) => totals[id] === max)

  return winners.length === 1 ? winners[0] : breakTie(winners, branchAnswers)
}

/**
 * 分類IDと分岐後3問の回答(+庶民の場合はshakou/kamoku)から最終タイプを決める、
 * App.jsx向けの窓口関数。
 * @param {string} factionId
 * @param {Array<{scores: Record<string, number>}>} branchAnswers
 * @param {number} shakou
 * @param {number} kamoku
 * @param {string|null} [axisWinner] resolveFactionが返した移動・定住軸の首位(なければnull)
 */
export function resolveFinalType(factionId, branchAnswers, shakou, kamoku, axisWinner = null) {
  if (factionId === 'shomin') {
    return resolveShominType(branchAnswers, shakou, kamoku, axisWinner)
  }
  if (factionId === 'buke') {
    return resolveBukeType(branchAnswers, axisWinner)
  }
  return resolveBranchType(factionId, branchAnswers, axisWinner)
}
