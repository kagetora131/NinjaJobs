import ProgressBar from './ProgressBar.jsx'

export default function FactionQuestionScreen({
  question,
  faction,
  questionNumber,
  totalQuestions,
  onAnswer,
}) {
  return (
    <div key={question.id} className="screen question-screen">
      <ProgressBar current={questionNumber} total={totalQuestions} />

      <div className="scroll">
        <div className="rod" aria-hidden="true" />
        <div className="scroll__body washi">
          <h2 className="scroll__question">{question.text}</h2>
        </div>
        <div className="rod" aria-hidden="true" />
      </div>

      <ul className="choice-list">
        {question.choices.map((choice, index) => (
          <li key={choice.id}>
            <button
              type="button"
              className="choice-button"
              onClick={() => onAnswer(faction.typeIds[index])}
            >
              {choice.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
