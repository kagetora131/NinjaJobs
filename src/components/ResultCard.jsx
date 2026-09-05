import { motion, useReducedMotion } from 'framer-motion'
import TypeGallery from './TypeGallery.jsx'

export default function ResultCard({ lang, ninjaType, onRetry }) {
  const reduceMotion = useReducedMotion()
  const isEn = lang === 'en'
  const d = (seconds) => (reduceMotion ? 0 : seconds)

  const scrollVariants = {
    hidden: { opacity: 0, scaleY: reduceMotion ? 1 : 0.35 },
    visible: {
      opacity: 1,
      scaleY: 1,
      transition: { duration: d(0.75), ease: [0.16, 1, 0.3, 1] },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    visible: { opacity: 1, y: 0, transition: { duration: d(0.55), delay: d(0.55) } },
  }

  // 毛筆で書かれるように左から現れる
  const titleVariants = {
    hidden: { clipPath: reduceMotion ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' },
    visible: {
      clipPath: 'inset(0 0% 0 0)',
      transition: { duration: d(0.9), delay: d(1.0), ease: 'easeInOut' },
    },
  }

  const bodyVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 8 },
    visible: { opacity: 1, y: 0, transition: { duration: d(0.5), delay: d(1.7) } },
  }

  // 落款印が「ポン」と押される
  const sealVariants = {
    hidden: { opacity: 0, scale: reduceMotion ? 1 : 2.2, rotate: reduceMotion ? -7 : -28 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: -7,
      transition: reduceMotion
        ? { duration: 0 }
        : { delay: 2.1, type: 'spring', stiffness: 340, damping: 13 },
    },
  }

  return (
    <div className="screen result-screen">
      <motion.div
        className="kakejiku"
        style={{ '--accent': ninjaType.accentColor }}
        initial="hidden"
        animate="visible"
        variants={scrollVariants}
      >
        <div className="rod rod--capped" aria-hidden="true" />

        <div className="kakejiku__body washi">
          <p className="result-card__eyebrow">
            {isEn ? 'Thy path of shinobi is —' : 'お前の忍びの道は――'}
          </p>

          <motion.div className="result-card__frame" variants={imageVariants}>
            <img className="result-card__image" src={ninjaType.imagePath} alt={ninjaType.name} />
          </motion.div>

          <motion.h2 className="result-card__title" variants={titleVariants}>
            {isEn ? ninjaType.nameEn : ninjaType.name}
          </motion.h2>
          <span className="result-card__title-en">
            {isEn ? ninjaType.epithetEn : ninjaType.nameEn}
          </span>

          <motion.div variants={bodyVariants}>
            <span className="result-card__keyword">
              {isEn ? ninjaType.keywordEn : ninjaType.keyword}
            </span>
            <p className="result-card__description">
              {isEn ? ninjaType.descriptionEn : ninjaType.description}
            </p>
          </motion.div>

          {/* 落款印(伝統的な忍者の印章の意匠のため、言語を問わず日本語の名の一部を使う) */}
          <motion.div className="result-card__seal" variants={sealVariants} aria-hidden="true">
            {ninjaType.name.slice(0, 2)}
          </motion.div>
        </div>

        <div className="rod rod--capped" aria-hidden="true" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: d(0.6), delay: d(2.4) }}
      >
        <TypeGallery lang={lang} resultId={ninjaType.id} />
      </motion.div>

      <div className="result-screen__actions">
        <button type="button" className="btn-secondary" onClick={onRetry}>
          {isEn ? 'Take the Trial Again' : 'もう一度診断する'}
        </button>
      </div>
    </div>
  )
}
