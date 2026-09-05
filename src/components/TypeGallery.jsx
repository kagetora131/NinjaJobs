import { FACTIONS } from '../data/factions.js'
import { NINJA_TYPE_MAP } from '../data/ninjaTypes.js'

// 分類(武家系/寺社系/庶民)による分類・説明はあえて出さない。内部分類名は
// ユーザーに一切見せない方針のため(詳細はCLAUDE.md 6-7章)。
const ALL_TYPE_IDS = FACTIONS.flatMap((faction) => faction.typeIds)
// 武士のみ低配点による自然発生的なレア職業(詳細はCLAUDE.md 7章)
const EXTREME_TYPE_IDS = new Set(['bushi'])

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
                <p className="gallery__desc">{type.description}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
