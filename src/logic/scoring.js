import { SYSTEMS, SYSTEM_MAP, SYSTEM_TIE_ORDER } from '../data/systems.js'
import { COMMON_QUESTIONS, BRANCH_QUESTIONS } from '../data/questions.js'

// 系統やタイプを増減させた際の登録漏れは静かに壊れる(そのタイプが永久に出なくなる)ため、
// 開発時に検知する。
if (import.meta.env?.DEV) {
  const missing = SYSTEMS.map((s) => s.id).filter((id) => !SYSTEM_TIE_ORDER.includes(id))
  if (missing.length) {
    throw new Error(`SYSTEM_TIE_ORDER に未登録の系統があります: ${missing.join(', ')}`)
  }
  const allTypeIds = new Set(SYSTEMS.flatMap((s) => s.typeIds))
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

  // excludes(除外フラグ)の設定ミスを検知する。
  const allChoices = [
    ...COMMON_QUESTIONS.flatMap((q) => q.choices),
    ...Object.values(BRANCH_QUESTIONS).flat().flatMap((q) => q.choices),
  ]
  for (const choice of allChoices) {
    const excludeSet = new Set(choice.excludes ?? [])
    if (excludeSet.size === 0) continue

    for (const typeId of excludeSet) {
      if (!allTypeIds.has(typeId)) {
        throw new Error(`${choice.id}: excludes に未知のタイプID「${typeId}」があります`)
      }
    }
    // 1系統の全タイプを1つの選択で除外すると、常にフォールバック(除外を無視)が
    // 発動して除外フラグが実質無意味になるため、設定ミスとして検知する。
    const wiped = SYSTEMS.find((s) => s.typeIds.every((id) => excludeSet.has(id)))
    if (wiped) {
      throw new Error(`${choice.id}: excludes が ${wiped.id} の全タイプを含んでおり、常にフォールバックしてしまいます`)
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
 *
 * 除外フラグ(excludes)：特定の選択(例:「気配を断ち、忍び込む」)をした人物が、
 * 信条の相容れないタイプ(例:「武士」)に至るのは矛盾するため、そうした選択肢には
 * `excludes: ['bushi']` のように最終候補から外すタイプIDを持たせられる。
 * 得点計算そのものは変えず、**系統内で最終タイプを1つに絞り込む段階でのみ**適用する。
 * 除外した結果、系統内の候補が0件になる場合は矛盾を避けるため除外を無視する
 * (通常は起こらない。1つの系統の全タイプを除外するような矛盾した設定をしない限り)。
 *
 * @param {string} systemId
 * @param {number[]} picks 各分岐問で選んだ選択肢のindex(= typeIds のindex)
 * @param {string[]} [excludedTypeIds] それまでの全回答(共通問+分岐問)から集めた除外タイプID
 */
export function resolveType(systemId, picks, excludedTypeIds = []) {
  const system = SYSTEM_MAP[systemId]
  const points = system.typeIds.map(() => 0)

  for (const pick of picks) {
    points[pick] += system.branchWeights[pick]
  }

  const excluded = new Set(excludedTypeIds)
  const fullPool = system.typeIds.map((_, i) => i)
  const restrictedPool = fullPool.filter((i) => !excluded.has(system.typeIds[i]))
  const pool = restrictedPool.length > 0 ? restrictedPool : fullPool

  const best = Math.max(...pool.map((i) => points[i]))
  const tied = pool.filter((i) => points[i] === best)

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
