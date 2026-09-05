import ProgressBar from './ProgressBar.jsx'

export default function QuestionScreen({ lang, question, questionNumber, totalQuestions, onAnswer, onBack }) {
  const isEn = lang === 'en'

  return (
    <div key={question.id} className="screen question-screen">
      <ProgressBar lang={lang} current={questionNumber} total={totalQuestions} />

      {onBack && (
        <button type="button" className="question-screen__back" onClick={onBack}>
          {isEn ? '← Return to the previous question' : '← 一つ前の問いに戻る'}
        </button>
      )}

      {/* 巻物に記された問い */}
      <div className="scroll">
        <div className="rod" aria-hidden="true" />
        <div className="scroll__body washi">
          <h2 className="scroll__question">{isEn ? question.textEn : question.text}</h2>
        </div>
        <div className="rod" aria-hidden="true" />
      </div>

      {/* 木札に記された答え */}
      <ul className="choice-list">
        {question.choices.map((choice) => (
          <li key={choice.id}>
            <button type="button" className="choice-button" onClick={() => onAnswer(choice)}>
              {isEn ? choice.textEn : choice.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
