import { Fragment } from 'react'
import { bindEnWords, splitJaClauses, splitJaPhrases } from '../lib/phrases.js'

const CLOSER_INSIDE = /[」』）)\]〉》】”’]./u

function JaPhrases({ text }) {
  const phrases = splitJaPhrases(text)
  return (
    <span className="ja-phrased">
      {phrases.map((phrase, i) => (
        <Fragment key={i}>
          {i > 0 && <wbr />}
          {/* 閉じ括弧の直後はブラウザが切れ目とみなすため、「強さ」を のような文節は折り返さない */}
          {CLOSER_INSIDE.test(phrase) ? <span className="nobr">{phrase}</span> : phrase}
        </Fragment>
      ))}
    </span>
  )
}

/**
 * 画面に出す文章を、スマホの狭い幅でも不自然な位置で改行されないよう整形して描画する。
 * 日本語は文節の切れ目に<wbr>、英語は語のまとまりの内側にノーブレークスペースを入れる
 * (求め方は`lib/phrases.js`)。文字そのものは変えないので、textContentは元の文と同じ。
 *
 * variant="short": 設問・選択肢のような短い文。1行に収まらないときは、日本語は読点・句点の後ろ、
 *   英語は`\n`の位置(意味の区切り)で折り返す。区切りごとのかたまり(.clause)は、それぞれ
 *   行の長さをそろえて折り返す。maxClauseWidthは、日本語で1行に入る文字数の目安
 *   (これを超える区切りがあるときは区切らない。設問は文字が大きいので小さめにする)。
 * variant="prose": 説明文のような長めの文章。
 */
export default function Typeset({ lang, text, variant = 'short', maxClauseWidth = 18 }) {
  if (lang === 'en') {
    if (variant === 'prose') return bindEnWords(text)
    const clauses = text.split('\n')
    return clauses.map((clause, i) => (
      <Fragment key={i}>
        {i > 0 && ' '}
        <span className="clause">{bindEnWords(clause)}</span>
      </Fragment>
    ))
  }

  if (variant === 'short') {
    const clauses = splitJaClauses(text, maxClauseWidth)
    if (clauses.length > 1) {
      return clauses.map((clause, i) => (
        <span key={i} className="clause">
          <JaPhrases text={clause} />
        </span>
      ))
    }
  }
  return <JaPhrases text={text} />
}
