import { SYSTEMS, SYSTEM_MAP, SYSTEM_TIE_ORDER } from '../data/systems.js'
import { BRANCH_QUESTIONS } from '../data/questions.js'

// 系統やタイプを増減させた際の登録漏れは静かに壊れる(そのタイプが永久に出なくなる)ため、
// 開発時に検知する。
if (import.meta.env?.DEV) {
  const missing = SYSTEMS.map((s) => s.id).filter((id) => !SYSTEM_TIE_ORDER.includes(id))
  if (missing.length) {
    throw new Error(`SYSTEM_TIE_ORDER に未登録の系統があります: ${missing.join(', ')}`)
  }
  for (const s of SYSTEMS) {
    if (s.typeIds.length !== s.branchWeights.length) {
      throw new Error(`${s.id}: typeIds と branchWeights の数が一致しません`)
    }
    for (const q of BRANCH_QUESTIONS[s.id] ?? []) {
      if (q.choices.length !== s.typeIds.length) {
        throw new Error(`${q.id}: 選択肢の数が ${s.id} のタイプ数と一致しません`)
      }
    }
  }
}

/**
 * 共通問の回答から系統を決める。
 * @param {Array<Record<string, number>>} answerScores 選んだ選択肢の scores の配列
 */
export function resolveSystem(answerScores) {
  const scores = Object.fromEntries(SYSTEMS.map((s) => [s.id, 0]))

  for (const choiceScores of answerScores) {
    for (const [systemId, points] of Object.entries(choiceScores)) {
      scores[systemId] = (scores[systemId] ?? 0) + points
    }
  }

  let systemId = SYSTEM_TIE_ORDER[0]
  let best = -Infinity
  for (const id of SYSTEM_TIE_ORDER) {
    if (scores[id] > best) {
      best = scores[id]
      systemId = id
    }
  }

  return { systemId, scores }
}

/**
 * 系統内の分岐回答からタイプを決める。
 * @param {string} systemId
 * @param {number[]} picks 各分岐問で選んだ選択肢のindex(= typeIds のindex)
 */
export function resolveType(systemId, picks) {
  const system = SYSTEM_MAP[systemId]
  const points = system.typeIds.map(() => 0)

  for (const pick of picks) {
    points[pick] += system.branchWeights[pick]
  }

  const best = Math.max(...points)
  const tied = points.reduce((acc, v, i) => (v === best ? [...acc, i] : acc), [])

  if (tied.length === 1) {
    return { typeId: system.typeIds[tied[0]], points }
  }

  // 同点は「最後に選んだ側」を決め手にする。
  // 先頭固定にすると特定タイプだけが同点を総取りして出現率が跳ね上がるため。
  for (let i = picks.length - 1; i >= 0; i -= 1) {
    if (tied.includes(picks[i])) {
      return { typeId: system.typeIds[picks[i]], points }
    }
  }

  return { typeId: system.typeIds[tied[0]], points }
}
