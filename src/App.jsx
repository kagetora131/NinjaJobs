import { useState } from 'react'
import StartScreen from './components/StartScreen.jsx'
import QuestionScreen from './components/QuestionScreen.jsx'
import BranchQuestionScreen from './components/BranchQuestionScreen.jsx'
import ResultCard from './components/ResultCard.jsx'
import {
  COMMON_QUESTIONS,
  BRANCH_QUESTIONS,
  BRANCH_COUNT,
  TOTAL_QUESTIONS,
} from './data/questions.js'
import { NINJA_TYPE_MAP } from './data/ninjaTypes.js'
import { SYSTEM_MAP } from './data/systems.js'
import { resolveSystem, resolveType } from './logic/scoring.js'

const PHASE = { START: 'start', COMMON: 'common', BRANCH: 'branch', RESULT: 'result' }

export default function App() {
  const [phase, setPhase] = useState(PHASE.START)
  const [commonAnswers, setCommonAnswers] = useState([])
  const [systemId, setSystemId] = useState(null)
  const [branchPicks, setBranchPicks] = useState([])
  const [resultId, setResultId] = useState(null)

  function handleStart() {
    setCommonAnswers([])
    setBranchPicks([])
    setSystemId(null)
    setResultId(null)
    setPhase(PHASE.COMMON)
  }

  function handleCommonAnswer(choice) {
    const next = [...commonAnswers, choice.scores]

    if (next.length < COMMON_QUESTIONS.length) {
      setCommonAnswers(next)
      return
    }

    // 共通問を終えた時点で系統が決まり、以降はその系統専用の問いに入る
    const { systemId: resolved } = resolveSystem(next)
    setCommonAnswers(next)
    setSystemId(resolved)
    setPhase(PHASE.BRANCH)
  }

  function handleBranchAnswer(choiceIndex) {
    const next = [...branchPicks, choiceIndex]

    if (next.length < BRANCH_COUNT) {
      setBranchPicks(next)
      return
    }

    const { typeId } = resolveType(systemId, next)
    setBranchPicks(next)
    setResultId(typeId)
    setPhase(PHASE.RESULT)
  }

  function handleRetry() {
    setPhase(PHASE.START)
  }

  return (
    <div className="app-shell">
      {phase === PHASE.START && <StartScreen onStart={handleStart} />}

      {phase === PHASE.COMMON && (
        <QuestionScreen
          question={COMMON_QUESTIONS[commonAnswers.length]}
          questionNumber={commonAnswers.length + 1}
          totalQuestions={TOTAL_QUESTIONS}
          onAnswer={handleCommonAnswer}
        />
      )}

      {phase === PHASE.BRANCH && systemId && (
        <BranchQuestionScreen
          question={BRANCH_QUESTIONS[systemId][branchPicks.length]}
          system={SYSTEM_MAP[systemId]}
          questionNumber={COMMON_QUESTIONS.length + branchPicks.length + 1}
          totalQuestions={TOTAL_QUESTIONS}
          onAnswer={handleBranchAnswer}
        />
      )}

      {phase === PHASE.RESULT && resultId && (
        <ResultCard
          ninjaType={NINJA_TYPE_MAP[resultId]}
          system={SYSTEM_MAP[systemId]}
          onRetry={handleRetry}
        />
      )}
    </div>
  )
}
