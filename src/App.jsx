import { useState } from 'react'
import StartScreen from './components/StartScreen.jsx'
import QuestionScreen from './components/QuestionScreen.jsx'
import ResultCard from './components/ResultCard.jsx'
import { COMMON_QUESTIONS, BRANCH_QUESTIONS, COMMON_COUNT, TOTAL_QUESTIONS } from './data/questions.js'
import { NINJA_TYPE_MAP } from './data/ninjaTypes.js'
import { resolveFaction, resolveFinalType } from './logic/scoring.js'

const PHASE = { START: 'start', COMMON: 'common', BRANCH: 'branch', RESULT: 'result' }

/**
 * 「戻る」を安全に成立させるため、画面(phase)や分類・結果はすべて
 * 回答の配列(commonAnswers/branchAnswers)から毎回導出する。個別に
 * setPhase・setFactionId...のように命令的に管理すると、1問戻った時に
 * 導出済みの値(分類)が古いまま残ってズレる恐れがあるため。
 */
function deriveState(started, commonAnswers, branchAnswers) {
  if (!started) {
    return { phase: PHASE.START }
  }

  const commonDone = commonAnswers.length >= COMMON_QUESTIONS.length
  if (!commonDone) {
    return { phase: PHASE.COMMON }
  }

  const { factionId, shakou, kamoku } = resolveFaction(commonAnswers)

  const branchDone = branchAnswers.length >= BRANCH_QUESTIONS[factionId].length
  if (!branchDone) {
    return { phase: PHASE.BRANCH, factionId }
  }

  const resultId = resolveFinalType(factionId, branchAnswers, shakou, kamoku)
  return { phase: PHASE.RESULT, factionId, resultId }
}

export default function App() {
  const [started, setStarted] = useState(false)
  const [commonAnswers, setCommonAnswers] = useState([])
  const [branchAnswers, setBranchAnswers] = useState([])

  const { phase, factionId, resultId } = deriveState(started, commonAnswers, branchAnswers)

  function handleStart() {
    setCommonAnswers([])
    setBranchAnswers([])
    setStarted(true)
  }

  function handleCommonAnswer(choice) {
    setCommonAnswers((prev) => [...prev, choice])
  }

  function handleBranchAnswer(choice) {
    setBranchAnswers((prev) => [...prev, choice])
  }

  function handleRetry() {
    setStarted(false)
  }

  // 常に「1つ前の回答を取り消す」だけを行う。取り消した結果としてどの
  // 画面に戻るかはderiveStateが回答配列から自動的に導き出す。
  function handleBack() {
    if (phase === PHASE.BRANCH && branchAnswers.length > 0) {
      setBranchAnswers((prev) => prev.slice(0, -1))
    } else if (phase === PHASE.BRANCH || (phase === PHASE.COMMON && commonAnswers.length > 0)) {
      setCommonAnswers((prev) => prev.slice(0, -1))
    } else if (phase === PHASE.COMMON) {
      setStarted(false)
    }
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
          onBack={handleBack}
        />
      )}

      {phase === PHASE.BRANCH && factionId && (
        <QuestionScreen
          question={BRANCH_QUESTIONS[factionId][branchAnswers.length]}
          questionNumber={COMMON_COUNT + branchAnswers.length + 1}
          totalQuestions={TOTAL_QUESTIONS}
          onAnswer={handleBranchAnswer}
          onBack={handleBack}
        />
      )}

      {phase === PHASE.RESULT && resultId && (
        <ResultCard ninjaType={NINJA_TYPE_MAP[resultId]} onRetry={handleRetry} />
      )}
    </div>
  )
}
