import { NINJA_TYPES } from '../data/ninjaTypes.js'

/**
 * 同点時に勝つ順(先頭ほど強い)。
 * 定義順(=表示順)で決めると先頭の虚無僧ばかりが有利になり出現率が偏るため、
 * 出にくいタイプほど優先されるよう別途並べている。
 * 武士は「最もレアなタイプ」という設計意図のため、同点時は必ず最後に回す。
 */
const TIE_BREAK_ORDER = [
  'yamabushi',
  'sarugakushi',
  'kusuriya',
  'shikaku',
  'komuso',
  'hokashi',
  'tsunenokatachi',
  'kusushi',
  'kanja',
  'shukke',
  'akindo',
  'bushi',
]

// タイプを追加した際にTIE_BREAK_ORDERへの追記を忘れると、そのタイプが
// 永久に結果として出なくなる(静かに壊れる)ため、開発時に検知する。
if (import.meta.env?.DEV) {
  const missing = NINJA_TYPES.map((t) => t.id).filter((id) => !TIE_BREAK_ORDER.includes(id))
  if (missing.length) {
    throw new Error(`TIE_BREAK_ORDER に未登録のタイプがあります: ${missing.join(', ')}`)
  }
}

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

  let resultId = TIE_BREAK_ORDER[0]
  let best = -Infinity
  for (const typeId of TIE_BREAK_ORDER) {
    if (scores[typeId] > best) {
      best = scores[typeId]
      resultId = typeId
    }
  }

  return { resultId, scores }
}
