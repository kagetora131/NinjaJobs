import ProgressBar from './ProgressBar.jsx'

export default function QuestionScreen({ question, questionNumber, totalQuestions, onAnswer }) {
  return (
    <div key={question.id} className="screen question-screen">
      <ProgressBar current={questionNumber} total={totalQuestions} />
      <h2 className="question-screen__question">{question.text}</h2>
      <ul className="choice-list">
        {question.choices.map((choice) => (
          <li key={choice.id}>
            <button
              type="button"
              className="choice-button"
              onClick={() => onAnswer(choice)}
            >
              {choice.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
