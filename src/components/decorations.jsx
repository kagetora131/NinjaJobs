const SHURIKEN_PATH = 'M50 0 L61 39 L100 50 L61 61 L50 100 L39 61 L0 50 L39 39 Z'

export function Shuriken({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path d={SHURIKEN_PATH} fill="currentColor" />
      <circle cx="50" cy="50" r="9" fill="var(--color-sumi)" />
    </svg>
  )
}

/**
 * 12枚のイラストに共通する「白地に縦書きの題字＋朱の落款」の意匠をUIに流用する。
 */
export function TitlePlate({ text, seal, size = 'md' }) {
  return (
    <div className={`title-plate title-plate--${size}`}>
      <span className="title-plate__text">{text}</span>
      {seal && <span className="title-plate__seal">{seal}</span>}
    </div>
  )
}
