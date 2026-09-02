import { useState } from 'react'
import StartScreen from './components/StartScreen.jsx'
import QuestionScreen from './components/QuestionScreen.jsx'
import FactionQuestionScreen from './components/FactionQuestionScreen.jsx'
import ResultCard from './components/ResultCard.jsx'
import { FRONT_QUESTIONS, BACK_QUESTIONS, BACK_COUNT, TOTAL_QUESTIONS } from './data/questions.js'
import { NINJA_TYPE_MAP } from './data/ninjaTypes.js'
import { FACTION_MAP } from './data/factions.js'
import { resolveFaction, resolveType } from './logic/scoring.js'

const PHASE = { START: 'start', FRONT: 'front', BACK: 'back', RESULT: 'result' }

export default function App() {
  const [phase, setPhase] = useState(PHASE.START)
  const [frontAxes, setFrontAxes] = useState([])
  const [factionId, setFactionId] = useState(null)
  const [backPicks, setBackPicks] = useState([])
  const [resultId, setResultId] = useState(null)

  function handleStart() {
    setFrontAxes([])
    setBackPicks([])
    setFactionId(null)
    setResultId(null)
    setPhase(PHASE.FRONT)
  }

  function handleFrontAnswer(choice) {
    const next = [...frontAxes, choice.axis]

    if (next.length < FRONT_QUESTIONS.length) {
      setFrontAxes(next)
      return
    }

    // 前半5問を終えた時点で陣営が決まり、以降はその陣営専用の問いに入る
    const { factionId: resolved } = resolveFaction(next, next[0])
    setFrontAxes(next)
    setFactionId(resolved)
    setPhase(PHASE.BACK)
  }

  function handleBackAnswer(typeId) {
    const next = [...backPicks, typeId]

    if (next.length < BACK_COUNT) {
      setBackPicks(next)
      return
    }

    const { typeId: resolvedType } = resolveType(factionId, next)
    setBackPicks(next)
    setResultId(resolvedType)
    setPhase(PHASE.RESULT)
  }

  function handleRetry() {
    setPhase(PHASE.START)
  }

  return (
    <div className="app-shell">
      {phase === PHASE.START && <StartScreen onStart={handleStart} />}

      {phase === PHASE.FRONT && (
        <QuestionScreen
          question={FRONT_QUESTIONS[frontAxes.length]}
          questionNumber={frontAxes.length + 1}
          totalQuestions={TOTAL_QUESTIONS}
          onAnswer={handleFrontAnswer}
        />
      )}

      {phase === PHASE.BACK && factionId && (
        <FactionQuestionScreen
          question={BACK_QUESTIONS[factionId][backPicks.length]}
          faction={FACTION_MAP[factionId]}
          questionNumber={FRONT_QUESTIONS.length + backPicks.length + 1}
          totalQuestions={TOTAL_QUESTIONS}
          onAnswer={handleBackAnswer}
        />
      )}

      {phase === PHASE.RESULT && resultId && (
        <ResultCard
          ninjaType={NINJA_TYPE_MAP[resultId]}
          faction={FACTION_MAP[factionId]}
          onRetry={handleRetry}
        />
      )}
    </div>
  )
}
