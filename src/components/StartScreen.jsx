import { Shuriken, TitlePlate } from './decorations.jsx'
import Typeset from './Typeset.jsx'

// 1行ずつ区切って表示する(各行は狭い幅で折り返しても、行の長さをそろえて崩れないようにする)
const LEAD_JA = [
  '全十問の問いに答えよ。',
  '虚無僧、出家、山伏、商人、刺客——',
  '十二の忍びの道の中から、',
  '内に眠る本性を暴き出す。',
]
const LEAD_EN = [
  'Answer all ten questions.',
  'Komuso, Shukke, Yamabushi, Akindo, Shikaku —',
  'from the twelve paths of the shinobi,',
  'we shall uncover the nature sleeping within you.',
]

export default function StartScreen({ lang, onStart }) {
  const isEn = lang === 'en'

  return (
    <div className="screen start-screen">
      <Shuriken className="start-screen__watermark" />

      <div className="start-screen__inner">
        <p className="start-screen__eyebrow">
          {isEn ? 'Let your path be seen.' : '忍びの道、見定めん'}
        </p>

        <h1 className="start-screen__title">
          {isEn ? (
            <TitlePlate text="NINJA TYPE QUIZ" seal="忍" size="lg" horizontal />
          ) : (
            <TitlePlate text="忍者タイプ診断" seal="忍" size="lg" />
          )}
        </h1>

        <p className="start-screen__lead">
          {(isEn ? LEAD_EN : LEAD_JA).map((line) => (
            <span key={line} className="start-screen__lead-line">
              <Typeset lang={lang} text={line} variant="prose" />
            </span>
          ))}
        </p>

        <button type="button" className="btn-primary" onClick={onStart}>
          <Shuriken className="btn-primary__icon" />
          {isEn ? 'Begin the Trial' : '診断を始める'}
        </button>
      </div>
    </div>
  )
}
