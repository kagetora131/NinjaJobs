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
import { FACTION_MAP } from './data/factions.js'
import { resolveFaction, resolveGroup, resolveFinalType, dominantAxis } from './logic/scoring.js'

const PHASE = { START: 'start', FRONT: 'front', BACK_GROUP: 'back_group', BACK_FINAL: 'back_final', RESULT: 'result' }

export default function App() {
  const [phase, setPhase] = useState(PHASE.START)
  const [frontScores, setFrontScores] = useState([])
  const [factionId, setFactionId] = useState(null)
  const [groupPicks, setGroupPicks] = useState([])
  const [group, setGroup] = useState(null)
  const [groupUnanimous, setGroupUnanimous] = useState(false)
  const [resultId, setResultId] = useState(null)

  function handleStart() {
    setFrontScores([])
    setGroupPicks([])
    setFactionId(null)
    setGroup(null)
    setGroupUnanimous(false)
    setResultId(null)
    setPhase(PHASE.FRONT)
  }

  function handleFrontAnswer(choice) {
    const next = [...frontScores, choice.scores]

    if (next.length < FRONT_QUESTIONS.length) {
      setFrontScores(next)
      return
    }

    // 前半6問を終えた時点で陣営が決まり、以降はその陣営専用の問いに入る
    const { factionId: resolved } = resolveFaction(next, dominantAxis(next[0]))
    setFrontScores(next)
    setFactionId(resolved)
    setPhase(PHASE.BACK_GROUP)
  }

  function handleGroupAnswer(groupIndex) {
    const next = [...groupPicks, groupIndex]

    if (next.length < BACK_GROUP_COUNT) {
      setGroupPicks(next)
      return
    }

    // グループ決定3問を終えた時点でグループが決まり、最終1問に入る
    const { group: resolvedGroup, unanimous } = resolveGroup(factionId, next)
    setGroupPicks(next)
    setGroup(resolvedGroup)
    setGroupUnanimous(unanimous)
    setPhase(PHASE.BACK_FINAL)
  }

  function handleFinalAnswer(typeIndex) {
    const typeId = resolveFinalType(group, groupUnanimous, typeIndex)
    setResultId(typeId)
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
          question={FRONT_QUESTIONS[frontScores.length]}
          questionNumber={frontScores.length + 1}
          totalQuestions={TOTAL_QUESTIONS}
          onAnswer={handleFrontAnswer}
        />
      )}

      {phase === PHASE.BACK_GROUP && factionId && (
        <FactionQuestionScreen
          question={BACK_GROUP_QUESTIONS[factionId][groupPicks.length]}
          questionNumber={FRONT_QUESTIONS.length + groupPicks.length + 1}
          totalQuestions={TOTAL_QUESTIONS}
          onAnswer={handleGroupAnswer}
        />
      )}

      {phase === PHASE.BACK_FINAL && factionId && group && (
        <FactionQuestionScreen
          question={BACK_FINAL_QUESTIONS[factionId][group.id]}
          questionNumber={FRONT_QUESTIONS.length + BACK_GROUP_COUNT + 1}
          totalQuestions={TOTAL_QUESTIONS}
          onAnswer={handleFinalAnswer}
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
