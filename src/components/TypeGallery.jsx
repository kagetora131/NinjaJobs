import { FACTIONS } from '../data/factions.js'
import { NINJA_TYPE_MAP } from '../data/ninjaTypes.js'

// 陣営(目立つ/目立たない)やグループ(芸能系・武闘派閥等)による分類・説明は
// あえて出さない。前半・後半で隠してきた軸をここで種明かししてしまうと、
// 診断の余韻を損なうため(詳細はCLAUDE.md 6章)。
const ALL_TYPE_IDS = FACTIONS.flatMap((faction) => faction.typeIds)
const EXTREME_TYPE_IDS = new Set(FACTIONS.map((faction) => faction.extremeTypeId))

export default function TypeGallery({ resultId }) {
  return (
    <section className="gallery">
      <h3 className="gallery__heading">
        <span className="gallery__heading-text">十二の忍びの道</span>
      </h3>

      <ul className="gallery__list">
        {ALL_TYPE_IDS.map((typeId) => {
          const type = NINJA_TYPE_MAP[typeId]
          const isResult = typeId === resultId
          const isExtreme = EXTREME_TYPE_IDS.has(typeId)
          return (
            <li
              key={typeId}
              className={`gallery__item${isResult ? ' is-result' : ''}`}
              style={{ '--accent': type.accentColor }}
            >
              <div className="gallery__thumb">
                <img src={type.imagePath} alt={type.name} loading="lazy" decoding="async" />
                {isResult && <span className="gallery__badge">あなたの道</span>}
              </div>

              <div className="gallery__text">
                <p className="gallery__name">
                  {type.name}
                  <span className="gallery__name-en">{type.nameEn}</span>
                  {isExtreme && <span className="gallery__extreme-badge">激レア</span>}
                </p>
                <p className="gallery__keyword">{type.keyword}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
