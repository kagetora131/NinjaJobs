import { useEffect, useRef, useState } from 'react'
import { FACTIONS } from '../data/factions.js'
import { NINJA_TYPE_MAP } from '../data/ninjaTypes.js'

// 分類(武家系/寺社系/庶民)による分類・説明はあえて出さない。内部分類名は
// ユーザーに一切見せない方針のため(詳細はCLAUDE.md 6章)。
const ALL_TYPE_IDS = FACTIONS.flatMap((faction) => faction.typeIds)
// 武士のみ低配点による自然発生的なレア職業(詳細はquestion-design skill)
const EXTREME_TYPE_IDS = new Set(['bushi'])

export default function TypeGallery({ lang, resultId }) {
  const isEn = lang === 'en'
  const [openId, setOpenId] = useState(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (openId && !dialog.open) dialog.showModal()
    if (!openId && dialog.open) dialog.close()
  }, [openId])

  const openType = openId ? NINJA_TYPE_MAP[openId] : null

  return (
    <section className="gallery">
      <h3 className="gallery__heading">
        <span className="gallery__heading-text">
          {isEn ? 'The Twelve Paths of the Shinobi' : '十二の忍びの道'}
        </span>
      </h3>

      <ul className="gallery__grid">
        {ALL_TYPE_IDS.map((typeId) => {
          const type = NINJA_TYPE_MAP[typeId]
          const isResult = typeId === resultId
          return (
            <li key={typeId}>
              <button
                type="button"
                className={`gallery__tile${isResult ? ' is-result' : ''}`}
                style={{ '--accent': type.accentColor }}
                onClick={() => setOpenId(typeId)}
                aria-haspopup="dialog"
              >
                <span className="gallery__thumb">
                  <img src={type.imagePath} alt="" loading="lazy" decoding="async" />
                  {EXTREME_TYPE_IDS.has(typeId) && (
                    <span className="gallery__extreme-badge">{isEn ? 'Ultra Rare' : '激レア'}</span>
                  )}
                  {isResult && <span className="gallery__badge">{isEn ? 'Your Path' : 'あなたの道'}</span>}
                </span>
                <span className={`gallery__tile-name${isEn ? ' gallery__tile-name--en' : ''}`}>
                  {isEn ? type.nameEn : type.name}
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <dialog
        ref={dialogRef}
        className="type-dialog"
        aria-labelledby="type-dialog-title"
        onClose={() => setOpenId(null)}
        onClick={(e) => {
          // 枠の外(背景)をタップしたら閉じる
          if (e.target === e.currentTarget) setOpenId(null)
        }}
      >
        {openType && (
          <div className="type-dialog__body washi" style={{ '--accent': openType.accentColor }}>
            <div className="type-dialog__frame">
              <img src={openType.imagePath} alt={openType.name} />
            </div>
            <h4 id="type-dialog-title" className="type-dialog__name">
              {isEn ? openType.nameEn : openType.name}
            </h4>
            <p className={`type-dialog__sub${isEn ? ' type-dialog__sub--epithet' : ''}`}>
              {isEn ? openType.epithetEn : openType.nameEn}
            </p>
            <p className="type-dialog__keyword">{isEn ? openType.keywordEn : openType.keyword}</p>
            <p className="type-dialog__desc">{isEn ? openType.descriptionEn : openType.description}</p>
            <button type="button" className="type-dialog__close" onClick={() => setOpenId(null)}>
              {isEn ? 'Close' : '閉じる'}
            </button>
          </div>
        )}
      </dialog>
    </section>
  )
}
