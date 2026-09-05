import { Shuriken, TitlePlate } from './decorations.jsx'

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
          {isEn ? (
            <>
              Answer all ten questions.
              <br />
              Komuso, Shukke, Yamabushi, Akindo, Shikaku —
              <br />
              from the twelve paths of the shinobi,
              <br />
              we shall uncover the nature sleeping within you.
            </>
          ) : (
            <>
              全十問の問いに答えよ。
              <br />
              虚無僧、出家、山伏、商人、刺客——
              <br />
              十二の忍びの道の中から、
              <br />
              お前の内に眠る本性を暴き出す。
            </>
          )}
        </p>

        <button type="button" className="btn-primary" onClick={onStart}>
          <Shuriken className="btn-primary__icon" />
          {isEn ? 'Begin the Trial' : '診断を始める'}
        </button>
      </div>
    </div>
  )
}
