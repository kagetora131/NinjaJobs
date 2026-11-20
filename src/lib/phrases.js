// 表示専用の文字列整形(診断ロジックには一切関係しない)。
// スマホの狭い幅で、日本語は文節の途中、英語は「open / up」「a / shinobi」のような
// 語のまとまりの途中で改行されるのを防ぐ。CSSの`word-break: auto-phrase`はSafariが
// 未対応のため、全ブラウザで同じ結果になるよう、区切りの位置を自前で求めて
// <wbr>(日本語)・&nbsp;(英語)として埋め込む。

const HAN = /[\p{Script=Han}々〆ヶ]/u
const HIRA = /\p{Script=Hiragana}/u
const KATA = /[\p{Script=Katakana}ー]/u
const LATIN = /[A-Za-z0-9]/
const OPEN = '「『（([〈《【“‘'
const CLOSE = '」』）)]〉》】”’'
const STOP = '、。，．！？!?…'
// 漢字と漢字の間の1文字のひらがながこれなら「動詞の途中の送り仮名」とみなし、
// 「落ち着く」「入り込む」のような語の途中では切らない。助詞(は・が・を・に・の・な…)や
// 語の終わり(る・う・く…)の後ろは文節の切れ目。
const OKURIGANA = 'いきぎしじちぢひびぴみりえけげせぜねべぺめれ'
// 直後の名詞と離さない連体詞(「その場」「どんな状況」)
const PRENOMINAL = ['その', 'この', 'あの', 'どの', 'どんな', 'こんな', 'そんな', 'いかなる', 'あらゆる', 'ほんの']
// 「やり方」「過ごし方」のように、動詞の連用形に付く「方」
const KATA_PREV = 'しりみきちいえけれびぎ'
// 「」の中身がこの長さ以下なら1つのまとまりとして扱う
const BRACKET_MAX = 11

// 文節判定で切れてしまう複合語(ここに書いた語の内側では切らない)
const COMPOUNDS = ['振る舞']

function isContentStart(c) {
  return HAN.test(c) || KATA.test(c) || LATIN.test(c)
}

function hiraRunStart(chars, i) {
  let start = i - 1
  while (start > 0 && HIRA.test(chars[start - 1])) start -= 1
  return start
}

function isOkurigana(chars, i) {
  const start = hiraRunStart(chars, i)
  const before = chars[start - 1]
  return i - start === 1 && before !== undefined && HAN.test(before) && OKURIGANA.includes(chars[start])
}

function followsPrenominal(chars, i) {
  const run = chars.slice(hiraRunStart(chars, i), i).join('')
  return PRENOMINAL.some((word) => run.endsWith(word))
}

/**
 * 日本語の文を、行頭に来てよい単位(文節)に分ける。例:
 * 「厳しい道を仲間とともに歩み、一団として入り込む」
 *  → 厳しい道を / 仲間とともに / 歩み、 / 一団として / 入り込む
 */
export function splitJaPhrases(text) {
  const chars = [...text]
  const cuts = new Set()
  for (let i = 1; i < chars.length; i += 1) {
    const prev = chars[i - 1]
    const cur = chars[i]
    if ((STOP.includes(prev) || prev === '・') && !STOP.includes(cur) && !CLOSE.includes(cur)) {
      cuts.add(i)
    } else if (OPEN.includes(cur) && !OPEN.includes(prev)) {
      cuts.add(i)
    } else if (isContentStart(cur)) {
      if (CLOSE.includes(prev)) cuts.add(i)
      else if (HIRA.test(prev) && !isOkurigana(chars, i) && !followsPrenominal(chars, i)) {
        if (!(chars[i] === '方' && KATA_PREV.includes(prev))) cuts.add(i)
      }
    }
  }

  const opens = []
  chars.forEach((c, i) => {
    if (OPEN.includes(c)) opens.push(i)
    else if (CLOSE.includes(c) && opens.length > 0) {
      const o = opens.pop()
      if (i - o <= BRACKET_MAX) for (let k = o + 1; k <= i; k += 1) cuts.delete(k)
    }
  })

  for (const word of COMPOUNDS) {
    let from = text.indexOf(word)
    while (from !== -1) {
      for (let k = 1; k < [...word].length; k += 1) cuts.delete([...text.slice(0, from)].length + k)
      from = text.indexOf(word, from + 1)
    }
  }

  const phrases = []
  let last = 0
  for (const cut of [...cuts].sort((a, b) => a - b)) {
    phrases.push(chars.slice(last, cut).join(''))
    last = cut
  }
  phrases.push(chars.slice(last).join(''))

  // 句読点を除いて1字だけの文節(「者。」「下、」)は、単独で行頭に来ないよう前に合体させる。
  // 最後の文節が2字以下のときも同様(それ1つが次の行に落ちるのを防ぐ)
  const core = (s) => [...s].filter((c) => !STOP.includes(c) && !CLOSE.includes(c)).length
  const merged = []
  phrases.forEach((p, k) => {
    const isLast = k === phrases.length - 1
    if (merged.length > 0 && (core(p) <= 1 || (isLast && core(p) <= 2))) merged[merged.length - 1] += p
    else merged.push(p)
  })
  return merged
}

// 短い語のつなぎで作るまとまりの最大語数(長くしすぎると狭い幅で折り返せず、行が不揃いになる)
const MAX_CHUNK_WORDS = 3
// 改行されない空白(U+00A0)。ソース上で通常の空白と見分けがつくよう、文字コードで書く
const NBSP = String.fromCharCode(0xa0)

/**
 * 英語の語を、改行されにくいようノーブレークスペース(U+00A0)でつなぐ。
 * - 3文字以下の短い語(a / the / to / of / and / it …)は次の語とつなぐ(まとまりは3語まで)
 *   (例: "open up"の"open"ではなく、"a shinobi"・"to approach"のまとまりを保つ)
 * - 「—」「·」のように文字を含まない記号は前の語につなぐ
 * - 最後の2語はつなぐ(最後の行に1語だけ残さない)
 * 句読点(,.;:!?)で終わる語の後ろは、自然な切れ目なのでつながない。
 */
export function bindEnWords(text) {
  const words = text.split(/\s+/).filter(Boolean)
  let out = ''
  let run = 1 // いまのまとまりの語数
  for (let k = 0; k < words.length; k += 1) {
    if (k > 0) {
      const prev = words[k - 1]
      const cur = words[k]
      const letters = prev.replace(/[^A-Za-z']/g, '')
      const endsWithPunct = /[,.;:!?]$/.test(prev)
      const symbol = !/[A-Za-z0-9]/.test(cur)
      const short = !endsWithPunct && letters.length > 0 && letters.length <= 3 && run < MAX_CHUNK_WORDS
      const tail = k === words.length - 1 && words.length > 2
      const glue = symbol || short || tail
      out += glue ? NBSP : ' '
      if (!glue) run = 1
      else if (!symbol) run += 1
    }
    out += words[k]
  }
  return out
}
