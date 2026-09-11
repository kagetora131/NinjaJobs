import { useEffect, useState } from 'react'
import StartScreen from './components/StartScreen.jsx'
import QuestionScreen from './components/QuestionScreen.jsx'
import ResultCard from './components/ResultCard.jsx'
import { COMMON_QUESTIONS, BRANCH_QUESTIONS, COMMON_COUNT, TOTAL_QUESTIONS } from './data/questions.js'
import { NINJA_TYPE_MAP } from './data/ninjaTypes.js'
import { resolveFaction, resolveFinalType } from './logic/scoring.js'

const PHASE = { START: 'start', COMMON: 'common', BRANCH: 'branch', RESULT: 'result' }

// URLに ?lang=ja / ?lang=en があれば最優先(ホームページの表示言語のまま
// アプリを開けるようにするため)。無ければ端末の言語設定から判定し、
// 日本語以外なら英語をデフォルトにする(フランス語・スペイン語など
// 未対応言語の訪問者にも英語を表示するため)。
function detectInitialLang() {
  try {
    const urlLang = new URLSearchParams(window.location.search).get('lang')
    if (urlLang === 'ja' || urlLang === 'en') return urlLang
  } catch {
    // ignore
  }
  // ホームページの表示言語(同一オリジンのlocalStorageを共有)を端末の言語設定より優先する。
  try {
    const hpLang = window.localStorage.getItem('kagetora-lang')
    if (hpLang === 'ja' || hpLang === 'en') return hpLang
  } catch {
    // ignore
  }
  try {
    return navigator.language.toLowerCase().startsWith('ja') ? 'ja' : 'en'
  } catch {
    return 'ja'
  }
}

/**
 * 「戻る」を安全に成立させるため、画面(phase)や分類・結果はすべて
 * 回答の配列(commonAnswers/branchAnswers)から毎回導出する。個別に
 * setPhase・setFactionId...のように命令的に管理すると、1問戻った時に
 * 導出済みの値(分類)が古いまま残ってズレる恐れがあるため。
 */
function deriveState(started, commonAnswers, branchAnswers) {
  if (!started) {
    return { phase: PHASE.START }
  }

  const commonDone = commonAnswers.length >= COMMON_QUESTIONS.length
  if (!commonDone) {
    return { phase: PHASE.COMMON }
  }

  const { factionId, shakou, kamoku } = resolveFaction(commonAnswers)

  const branchDone = branchAnswers.length >= BRANCH_QUESTIONS[factionId].length
  if (!branchDone) {
    return { phase: PHASE.BRANCH, factionId }
  }

  const resultId = resolveFinalType(factionId, branchAnswers, shakou, kamoku)
  return { phase: PHASE.RESULT, factionId, resultId }
}

export default function App() {
  const [started, setStarted] = useState(false)
  const [commonAnswers, setCommonAnswers] = useState([])
  const [branchAnswers, setBranchAnswers] = useState([])
  const [lang, setLang] = useState(detectInitialLang)

  // ?lang= で開かれた場合、初期表示には反映済みなのでURLからは消しておく。
  useEffect(() => {
    try {
      const url = new URL(window.location.href)
      if (url.searchParams.has('lang')) {
        url.searchParams.delete('lang')
        window.history.replaceState(null, '', url.pathname + url.search + url.hash)
      }
    } catch {
      // ignore
    }
  }, [])

  const { phase, factionId, resultId } = deriveState(started, commonAnswers, branchAnswers)

  function handleStart() {
    setCommonAnswers([])
    setBranchAnswers([])
    setStarted(true)
  }

  function handleCommonAnswer(choice) {
    setCommonAnswers((prev) => [...prev, choice])
  }

  function handleBranchAnswer(choice) {
    setBranchAnswers((prev) => [...prev, choice])
  }

  function handleRetry() {
    setStarted(false)
  }

  // 常に「1つ前の回答を取り消す」だけを行う。取り消した結果としてどの
  // 画面に戻るかはderiveStateが回答配列から自動的に導き出す。
  function handleBack() {
    if (phase === PHASE.BRANCH && branchAnswers.length > 0) {
      setBranchAnswers((prev) => prev.slice(0, -1))
    } else if (phase === PHASE.BRANCH || (phase === PHASE.COMMON && commonAnswers.length > 0)) {
      setCommonAnswers((prev) => prev.slice(0, -1))
    } else if (phase === PHASE.COMMON) {
      setStarted(false)
    }
  }

  return (
    <div className="app-shell">
      {/* 言語切替は開始画面のみ。診断中に言語が変わると設問の並びや進行が
          分かりにくくなるため、開始前に選び切ってもらう(「もう一度診断する」で
          開始画面に戻れば再度切り替えられる)。 */}
      {phase === PHASE.START && (
        <button
          type="button"
          className="lang-toggle"
          onClick={() => setLang((prev) => (prev === 'ja' ? 'en' : 'ja'))}
        >
          {lang === 'ja' ? 'English' : '日本語'}
        </button>
      )}

      {phase === PHASE.START && <StartScreen lang={lang} onStart={handleStart} />}

      {phase === PHASE.COMMON && (
        <QuestionScreen
          lang={lang}
          question={COMMON_QUESTIONS[commonAnswers.length]}
          questionNumber={commonAnswers.length + 1}
          totalQuestions={TOTAL_QUESTIONS}
          onAnswer={handleCommonAnswer}
          onBack={handleBack}
        />
      )}

      {phase === PHASE.BRANCH && factionId && (
        <QuestionScreen
          lang={lang}
          question={BRANCH_QUESTIONS[factionId][branchAnswers.length]}
          questionNumber={COMMON_COUNT + branchAnswers.length + 1}
          totalQuestions={TOTAL_QUESTIONS}
          onAnswer={handleBranchAnswer}
          onBack={handleBack}
        />
      )}

      {phase === PHASE.RESULT && resultId && (
        <ResultCard lang={lang} ninjaType={NINJA_TYPE_MAP[resultId]} onRetry={handleRetry} />
      )}
    </div>
  )
}
