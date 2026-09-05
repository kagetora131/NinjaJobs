import { useRef } from 'react'
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

/**
 * 英語版のtextEnに埋め込んだ改行(\n)を<br />に変換して描画する。
 * 日本語版のtextには\nを含めていないため、素通しでも見た目は変わらない。
 */
function withLineBreaks(text) {
  const lines = text.split('\n')
  return lines.map((line, i) => (
    <span key={i}>
      {line}
      {i < lines.length - 1 && <br />}
    </span>
  ))
}

export default function QuestionScreen({ lang, question, questionNumber, totalQuestions, onAnswer, onBack }) {
  const isEn = lang === 'en'

  // 「常に一番上を選ぶと必ず同じ結果になる」のを防ぐため、選択肢の表示順を
  // 問題ごとにシャッフルする。判定に使うのはchoiceオブジェクト自体(scores)
  // なので、表示順を変えても採点結果には影響しない。
  //
  // シャッフル結果はquestion.idをキーにこのコンポーネントの生存期間(=1回の
  // 診断セッション)を通じてキャッシュしており、「戻る」で同じ問題に再訪
  // しても並び順は変わらない(再訪のたびに並び替わると、選び直す時に
  // 前回どれを選んだか分かりにくくなるため)。「もう一度診断する」で
  // QuestionScreen自体が再マウントされた際はキャッシュもリセットされ、
  // 新しい診断では改めてランダムな順序になる。
  const shuffleCache = useRef(new Map())
  if (!shuffleCache.current.has(question.id)) {
    shuffleCache.current.set(question.id, shuffle(question.choices))
  }
  const shuffledChoices = shuffleCache.current.get(question.id)

  return (
    <div key={question.id} className="screen question-screen">
      <ProgressBar lang={lang} current={questionNumber} total={totalQuestions} />

      {/* 巻物に記された問い */}
      <div className="scroll">
        <div className="rod" aria-hidden="true" />
        <div className="scroll__body washi">
          <h2 className="scroll__question">
            {isEn ? withLineBreaks(question.textEn) : question.text}
          </h2>
        </div>
        <div className="rod" aria-hidden="true" />
      </div>

      {/* 木札に記された答え */}
      <ul className="choice-list">
        {shuffledChoices.map((choice) => (
          <li key={choice.id}>
            <button type="button" className="choice-button" onClick={() => onAnswer(choice)}>
              {isEn ? withLineBreaks(choice.textEn) : choice.text}
            </button>
          </li>
        ))}
      </ul>

      {onBack && (
        <button type="button" className="question-screen__back" onClick={onBack}>
          {isEn ? '← Return to the previous question' : '← 一つ前の問いに戻る'}
        </button>
      )}
    </div>
  )
}
