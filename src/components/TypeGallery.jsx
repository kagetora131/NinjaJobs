import { NINJA_TYPES } from '../data/ninjaTypes.js'

export default function TypeGallery({ resultId }) {
  return (
    <section className="gallery">
      <h3 className="gallery__heading">
        <span className="gallery__heading-text">十二の忍びの道</span>
      </h3>

      <ul className="gallery__list">
        {NINJA_TYPES.map((type) => {
          const isResult = type.id === resultId
          return (
            <li
              key={type.id}
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
