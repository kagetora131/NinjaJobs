import ProgressBar from './ProgressBar.jsx'

/**
 * 後半(グループ決定3問+最終1問)で共通して使う画面。
 * choices の各要素をクリックすると、その choices 配列内でのindexを onAnswer に渡す
 * (indexの意味はApp.jsx側の呼び出し方で決まる: グループ決定問ならグループのindex、
 * 最終問ならグループ内タイプのindex)。
 */
export default function FactionQuestionScreen({ question, questionNumber, totalQuestions, onAnswer, onBack }) {
  return (
    <div key={question.id} className="screen question-screen">
      <ProgressBar current={questionNumber} total={totalQuestions} />

      {onBack && (
        <button type="button" className="question-screen__back" onClick={onBack}>
          ← 一つ前の問いに戻る
        </button>
      )}

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
            <button type="button" className="choice-button" onClick={() => onAnswer(index)}>
              {choice.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
