import { NINJA_TYPES } from '../data/ninjaTypes.js'

/**
 * @param {Array<Record<string, number>>} answerScores 各質問で選んだ選択肢のscoresオブジェクトの配列
 * @returns {{ resultId: string, scores: Record<string, number> }}
 */
export function calculateResult(answerScores) {
  const scores = Object.fromEntries(NINJA_TYPES.map((type) => [type.id, 0]))

  for (const choiceScores of answerScores) {
    for (const [typeId, points] of Object.entries(choiceScores)) {
      scores[typeId] = (scores[typeId] ?? 0) + points
    }
  }

  // 同点の場合はNINJA_TYPESの定義順(先頭)を優先する
  let resultId = NINJA_TYPES[0].id
  let best = -Infinity
  for (const type of NINJA_TYPES) {
    if (scores[type.id] > best) {
      best = scores[type.id]
      resultId = type.id
    }
  }

  return { resultId, scores }
}
