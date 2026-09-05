const KANJI_NUMERALS = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

export default function ProgressBar({ lang, current, total }) {
  const percent = Math.round((current / total) * 100)
  const isEn = lang === 'en'

  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-valuenow={current}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-label={isEn ? `Question ${current} of ${total}` : `全${total}問中${current}問目`}
    >
      <div className="progress-bar__label">
        <span className="progress-bar__kanji">
          {isEn ? `Question ${current}` : `第${KANJI_NUMERALS[current] ?? current}問`}
        </span>
        <span className="progress-bar__count">
          {current} / {total}
        </span>
      </div>
      <div className="progress-bar__track">
        <div className="progress-bar__fill" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
