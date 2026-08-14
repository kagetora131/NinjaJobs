export default function StartScreen({ onStart }) {
  return (
    <div className="screen start-screen">
      <p className="start-screen__eyebrow">忍びの道、見定めん</p>
      <h1 className="start-screen__title">忍者タイプ診断</h1>
      <p className="start-screen__lead">
        全10問の問いに答えよ。
        <br />
        虚無僧、出家、山伏、商人、刺客など、十二の忍びの道の中から、
        <br />
        お前の内に眠る本性を暴き出す。
      </p>
      <button type="button" className="btn-primary" onClick={onStart}>
        診断を始める
      </button>
    </div>
  )
}
