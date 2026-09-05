import { useMemo } from 'react'
import ProgressBar from './ProgressBar.jsx'

/**
 * Fisher-Yatesで配列をシャッフルする(元の配列は変更しない)。
 * @param {Array<T>} array
 */
function shuffle(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export default function QuestionScreen({ lang, question, questionNumber, totalQuestions, onAnswer, onBack }) {
  const isEn = lang === 'en'

  // 「常に一番上を選ぶと必ず同じ結果になる」のを防ぐため、選択肢の表示順を
  // 問題ごとにシャッフルする。判定に使うのはchoiceオブジェクト自体(scores)
  // なので、表示順を変えても採点結果には影響しない。question.idが同じ間は
  // 再レンダーしてもシャッフル順を保つ(選んでいる最中に順番が変わらないように)。
  const shuffledChoices = useMemo(() => shuffle(question.choices), [question.id])

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
        {shuffledChoices.map((choice) => (
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
