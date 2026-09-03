import { useState } from 'react'
import StartScreen from './components/StartScreen.jsx'
import QuestionScreen from './components/QuestionScreen.jsx'
import FactionQuestionScreen from './components/FactionQuestionScreen.jsx'
import ResultCard from './components/ResultCard.jsx'
import {
  FRONT_QUESTIONS,
  BACK_GROUP_QUESTIONS,
  BACK_FINAL_QUESTIONS,
  BACK_GROUP_COUNT,
  TOTAL_QUESTIONS,
} from './data/questions.js'
import { NINJA_TYPE_MAP } from './data/ninjaTypes.js'
import { factionOfType } from './data/factions.js'
import {
  resolveFaction,
  resolveGroup,
  resolveFinalType,
  applyFrontPurityOverride,
  dominantAxis,
} from './logic/scoring.js'

const PHASE = { START: 'start', FRONT: 'front', BACK_GROUP: 'back_group', BACK_FINAL: 'back_final', RESULT: 'result' }

/**
 * 「戻る」を安全に成立させるため、画面(phase)や陣営・グループ・結果は
 * すべて回答の配列(frontScores/groupPicks/finalPick)から毎回導出する。
 * 個別にsetPhase・setFactionId...のように命令的に管理すると、1問戻った時に
 * 導出済みの値(陣営やグループ)が古いまま残ってズレる恐れがあるため。
 */
function deriveState(started, frontScores, groupPicks, finalPick) {
  if (!started) {
    return { phase: PHASE.START }
  }

  const frontDone = frontScores.length >= FRONT_QUESTIONS.length
  if (!frontDone) {
    return { phase: PHASE.FRONT }
  }

  const { factionId } = resolveFaction(frontScores, dominantAxis(frontScores[0]))

  const groupDone = groupPicks.length >= BACK_GROUP_COUNT
  if (!groupDone) {
    return { phase: PHASE.BACK_GROUP, factionId }
  }

  const { group, unanimous } = resolveGroup(factionId, groupPicks)

  if (finalPick === null) {
    return { phase: PHASE.BACK_FINAL, factionId, group, unanimous }
  }

  const rawTypeId = resolveFinalType(group, unanimous, finalPick)
  // 前半6問が「目立つ/目立たない」どちらかに純粋でなかった場合、
  // 武士/刺客はここで別のタイプに差し替わる(詳細はscoring.js参照)
  const resultId = applyFrontPurityOverride(rawTypeId, frontScores)

  return { phase: PHASE.RESULT, factionId, group, unanimous, resultId }
}

export default function App() {
  const [started, setStarted] = useState(false)
  const [frontScores, setFrontScores] = useState([])
  const [groupPicks, setGroupPicks] = useState([])
  const [finalPick, setFinalPick] = useState(null)

  const { phase, factionId, group, resultId } = deriveState(started, frontScores, groupPicks, finalPick)

  function handleStart() {
    setFrontScores([])
    setGroupPicks([])
    setFinalPick(null)
    setStarted(true)
  }

  function handleFrontAnswer(choice) {
    setFrontScores((prev) => [...prev, choice.scores])
  }

  function handleGroupAnswer(groupIndex) {
    setGroupPicks((prev) => [...prev, groupIndex])
  }

  function handleFinalAnswer(typeIndex) {
    setFinalPick(typeIndex)
  }

  function handleRetry() {
    setStarted(false)
  }

  // 常に「1つ前の回答を取り消す」だけを行う。取り消した結果として
  // どの画面に戻るかはderiveStateが回答配列から自動的に導き出す。
  function handleBack() {
    if (phase === PHASE.RESULT) {
      setFinalPick(null)
    } else if (phase === PHASE.BACK_FINAL || (phase === PHASE.BACK_GROUP && groupPicks.length > 0)) {
      setGroupPicks((prev) => prev.slice(0, -1))
    } else if (phase === PHASE.BACK_GROUP || (phase === PHASE.FRONT && frontScores.length > 0)) {
      setFrontScores((prev) => prev.slice(0, -1))
    } else if (phase === PHASE.FRONT) {
      setStarted(false)
    }
  }

  return (
    <div className="app-shell">
      {phase === PHASE.START && <StartScreen onStart={handleStart} />}

      {phase === PHASE.FRONT && (
        <QuestionScreen
          question={FRONT_QUESTIONS[frontScores.length]}
          questionNumber={frontScores.length + 1}
          totalQuestions={TOTAL_QUESTIONS}
          onAnswer={handleFrontAnswer}
          onBack={handleBack}
        />
      )}

      {phase === PHASE.BACK_GROUP && factionId && (
        <FactionQuestionScreen
          question={BACK_GROUP_QUESTIONS[factionId][groupPicks.length]}
          questionNumber={FRONT_QUESTIONS.length + groupPicks.length + 1}
          totalQuestions={TOTAL_QUESTIONS}
          onAnswer={handleGroupAnswer}
          onBack={handleBack}
        />
      )}

      {phase === PHASE.BACK_FINAL && factionId && group && (
        <FactionQuestionScreen
          question={BACK_FINAL_QUESTIONS[factionId][group.id]}
          questionNumber={FRONT_QUESTIONS.length + BACK_GROUP_COUNT + 1}
          totalQuestions={TOTAL_QUESTIONS}
          onAnswer={handleFinalAnswer}
          onBack={handleBack}
        />
      )}

      {phase === PHASE.RESULT && resultId && (
        <ResultCard
          ninjaType={NINJA_TYPE_MAP[resultId]}
          // 前半純度による上書きで前半の陣営とは別の陣営のタイプになりうるため、
          // 表示する陣営は必ず最終タイプの実際の所属先から求め直す
          faction={factionOfType(resultId)}
          onRetry={handleRetry}
        />
      )}
    </div>
  )
}
