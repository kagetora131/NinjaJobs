import { Fragment } from 'react'
import { bindEnWords, splitJaPhrases } from '../lib/phrases.js'

const CLOSER_INSIDE = /[」』）)\]〉》】”’]./u

/**
 * 画面に出す文章を、スマホの狭い幅でも不自然な位置で改行されないよう整形して描画する。
 * 日本語は文節の切れ目に<wbr>、英語は語のまとまりの内側にノーブレークスペースを入れる
 * (求め方は`lib/phrases.js`)。文字そのものは変えないので、textContentは元の文と同じ。
 *
 * variant="short": 設問・選択肢のような短い文。英語は`\n`の位置を意味の区切りとして保つ
 *   (区切りごとのかたまりを、それぞれ行の長さをそろえて折り返す)。
 * variant="prose": 説明文のような長めの文章。
 */
export default function Typeset({ lang, text, variant = 'short' }) {
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
