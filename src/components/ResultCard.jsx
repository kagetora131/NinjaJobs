import { motion, useReducedMotion } from 'framer-motion'

export default function ResultCard({ ninjaType, onRetry }) {
  const reduceMotion = useReducedMotion()

  const cardVariants = {
    hidden: { opacity: 0, scale: reduceMotion ? 1 : 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: reduceMotion ? 0 : 0.6, ease: 'easeOut' },
    },
  }

  const imageVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.55, delay: reduceMotion ? 0 : 0.25 },
    },
  }

  const titleVariants = {
    hidden: { clipPath: reduceMotion ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' },
    visible: {
      clipPath: 'inset(0 0% 0 0)',
      transition: { duration: reduceMotion ? 0 : 0.85, delay: reduceMotion ? 0 : 0.7, ease: 'easeInOut' },
    },
  }

  const bodyVariants = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : 1.35 },
    },
  }

  const sealVariants = {
    hidden: { opacity: 0, scale: reduceMotion ? 1 : 1.8, rotate: reduceMotion ? -6 : -24 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: -6,
      transition: {
        delay: reduceMotion ? 0 : 1.7,
        duration: reduceMotion ? 0 : 0.4,
        type: reduceMotion ? 'tween' : 'spring',
        stiffness: 320,
        damping: 14,
      },
    },
  }

  return (
    <div className="screen result-screen">
      <motion.div
        className="result-card"
        style={{ '--accent': ninjaType.accentColor }}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        <motion.div className="result-card__frame" variants={imageVariants}>
          <img className="result-card__image" src={ninjaType.imagePath} alt={ninjaType.name} />
        </motion.div>

        <p className="result-card__eyebrow">お前の忍びの道は――</p>

        <motion.h2 className="result-card__title" variants={titleVariants}>
          {ninjaType.name}
        </motion.h2>
        <span className="result-card__title-en">{ninjaType.nameEn}</span>

        <motion.div variants={bodyVariants}>
          <span className="result-card__keyword">{ninjaType.keyword}</span>
          <p className="result-card__description">{ninjaType.description}</p>
        </motion.div>

        <motion.div className="result-card__seal" variants={sealVariants}>
          {ninjaType.name.slice(0, 2)}
        </motion.div>
      </motion.div>

      <div className="result-screen__actions">
        <button type="button" className="btn-secondary" onClick={onRetry}>
          もう一度診断する
        </button>
      </div>
    </div>
  )
}
