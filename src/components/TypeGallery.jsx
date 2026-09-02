import { FACTIONS } from '../data/factions.js'
import { NINJA_TYPE_MAP } from '../data/ninjaTypes.js'

export default function TypeGallery({ resultId }) {
  return (
    <section className="gallery">
      <h3 className="gallery__heading">
        <span className="gallery__heading-text">十二の忍びの道</span>
      </h3>

      {FACTIONS.map((faction) => (
        <div key={faction.id} className="gallery__group">
          <p className="gallery__group-name">{faction.name}</p>
          <p className="gallery__group-summary">{faction.summary}</p>

          <ul className="gallery__list">
            {faction.typeIds.map((typeId) => {
              const type = NINJA_TYPE_MAP[typeId]
              const isResult = typeId === resultId
              const isExtreme = typeId === faction.extremeTypeId
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
        </div>
      ))}
    </section>
  )
}
