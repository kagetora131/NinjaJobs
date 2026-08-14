import { useState } from 'react'
import StartScreen from './components/StartScreen.jsx'
import QuestionScreen from './components/QuestionScreen.jsx'
import ResultCard from './components/ResultCard.jsx'
import { QUESTIONS } from './data/questions.js'
import { NINJA_TYPE_MAP } from './data/ninjaTypes.js'
import { calculateResult } from './logic/scoring.js'

const PHASE = { START: 'start', QUESTION: 'question', RESULT: 'result' }

export default function App() {
  const [phase, setPhase] = useState(PHASE.START)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answerScores, setAnswerScores] = useState([])
  const [resultId, setResultId] = useState(null)

  function handleStart() {
    setQuestionIndex(0)
    setAnswerScores([])
    setPhase(PHASE.QUESTION)
  }

  function handleAnswer(choice) {
    const nextAnswers = [...answerScores, choice.scores]

    if (questionIndex + 1 < QUESTIONS.length) {
      setAnswerScores(nextAnswers)
      setQuestionIndex(questionIndex + 1)
      return
    }

    const { resultId: id } = calculateResult(nextAnswers)
    setResultId(id)
    setPhase(PHASE.RESULT)
  }

  function handleRetry() {
    setPhase(PHASE.START)
  }

  return (
    <div className="app-shell">
      {phase === PHASE.START && <StartScreen onStart={handleStart} />}

      {phase === PHASE.QUESTION && (
        <QuestionScreen
          question={QUESTIONS[questionIndex]}
          questionNumber={questionIndex + 1}
          totalQuestions={QUESTIONS.length}
          onAnswer={handleAnswer}
        />
      )}

      {phase === PHASE.RESULT && resultId && (
        <ResultCard ninjaType={NINJA_TYPE_MAP[resultId]} onRetry={handleRetry} />
      )}
    </div>
  )
}
