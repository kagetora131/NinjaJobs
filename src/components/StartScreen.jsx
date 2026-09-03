import { Shuriken, TitlePlate } from './decorations.jsx'

export default function StartScreen({ onStart }) {
  return (
    <div className="screen start-screen">
      <Shuriken className="start-screen__watermark" />

      <div className="start-screen__inner">
        <p className="start-screen__eyebrow">忍びの道、見定めん</p>

        <h1 className="start-screen__title">
          <TitlePlate text="忍者タイプ診断" seal="忍" size="lg" />
        </h1>

        <p className="start-screen__lead">
          全十一問の問いに答えよ。
          <br />
          虚無僧、出家、山伏、商人、刺客——
          <br />
          十二の忍びの道の中から、
          <br />
          お前の内に眠る本性を暴き出す。
        </p>

        <button type="button" className="btn-primary" onClick={onStart}>
          <Shuriken className="btn-primary__icon" />
          診断を始める
        </button>
      </div>
    </div>
  )
}
