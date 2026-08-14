export default function ProgressBar({ current, total }) {
  const percent = Math.round((current / total) * 100)

  return (
    <div className="progress-bar" role="progressbar" aria-valuenow={current} aria-valuemin={0} aria-valuemax={total}>
      <div className="progress-bar__label">
        <span>QUESTION</span>
        <span>{current} / {total}</span>
      </div>
      <div className="progress-bar__track">
        <div className="progress-bar__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
