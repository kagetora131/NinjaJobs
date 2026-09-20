// 「質問とポイントの割り振り」を確認するためのExcel一覧を、現在のソース
// (src/data/questions.js・ninjaTypes.js・logic/scoring.js)から生成する補助スクリプト。
// 質問文・点数・区分を変更するたびに再生成して、ユーザーに確認してもらう運用
// (CLAUDE.md 14章)。本番ビルドでは使わない。exceljsは実行するときだけ入れる:
//   npm i --no-save exceljs && node scripts/build-review-xlsx.mjs
// 変更前の出現率を履歴として残したいとき(ロジックを変える直前に実行):
//   node scripts/build-review-xlsx.mjs --snapshot "ラベル"
// 出力: プロジェクト直下の「忍者診断_質問とポイント一覧.xlsx」。既存のファイルに
// ユーザーの入力(違和感/確認メモ列)があれば、上書きする前に別名で残す。
import { register } from 'node:module'
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import ExcelJS from 'exceljs'

// .webpのimportをNodeで無効化(ninjaTypes.jsが画像をimportしているため)
register('data:text/javascript,' + encodeURIComponent(`export async function load(u,c,n){ if(u.endsWith('.webp')) return {format:'module',source:'export default ""',shortCircuit:true}; return n(u,c)}`))

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const SRC = (f) => new URL('file:///' + path.join(ROOT, 'src', f).replace(/\\/g, '/')).href
const OUT = path.join(ROOT, '忍者診断_質問とポイント一覧.xlsx')
const HISTORY_FILE = path.join(__dirname, 'review-xlsx-history.json')

const { COMMON_QUESTIONS, BRANCH_QUESTIONS } = await import(SRC('data/questions.js'))
const { FACTIONS } = await import(SRC('data/factions.js'))
const { NINJA_TYPES, NINJA_TYPE_MAP } = await import(SRC('data/ninjaTypes.js'))
const sc = await import(SRC('logic/scoring.js'))

const AXJA = { teiju: '定住', tokidoki: '時々', hyohaku: '転々' }
const FACJA = { buke: '武家系', jisha: '寺社系', shomin: '庶民' }
const TYPEJA = (id) => NINJA_TYPE_MAP[id].name
const L = 'ABCD'

// ---- 総当たり(等確率 / 実テスターの選択傾向) ----
const cart = (arrs) => arrs.reduce((acc, a) => acc.flatMap((x) => a.map((v) => [...x, v])), [[]])
// 実テスター22件(2026/9/20時点)の共通7問のA/B/C/D選択回数。有意ではない参考値。
const CHOICE_COUNTS = [[3, 4, 9, 6], [7, 4, 9, 2], [4, 4, 4, 10], [7, 2, 11, 2], [9, 0, 9, 4], [3, 9, 5, 5], [2, 5, 8, 7]]
const pE = CHOICE_COUNTS.map((a) => a.map((v) => (v + 1) / 26))
function run(weightFn) {
  const res = {}; let tot = 0; const cache = new Map()
  for (const ix of cart(Array(7).fill([0, 1, 2, 3]))) {
    const w = weightFn(ix); tot += w
    const ans = ix.map((i, q) => COMMON_QUESTIONS[q].choices[i])
    const { factionId, shakou, kamoku, axisWinner } = sc.resolveFaction(ans)
    const key = [factionId, shakou, kamoku, axisWinner].join('|')
    if (!cache.has(key)) {
      const d = {}; const combos = cart(BRANCH_QUESTIONS[factionId].map((q) => q.choices))
      for (const b of combos) { const r = sc.resolveFinalType(factionId, b, shakou, kamoku, axisWinner); d[r] = (d[r] || 0) + 1 / combos.length }
      cache.set(key, d)
    }
    for (const [t, v] of Object.entries(cache.get(key))) res[t] = (res[t] || 0) + w * v
  }
  return Object.fromEntries(Object.entries(res).map(([k, v]) => [k, (v / tot) * 100]))
}
const U = run(() => 1)
const E = run((ix) => ix.reduce((m, i, q) => m * pE[q][i], 1))
const round2 = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, +v.toFixed(2)]))

// ---- 履歴(出現率の推移) ----
const history = existsSync(HISTORY_FILE) ? JSON.parse(readFileSync(HISTORY_FILE, 'utf8')) : []
const snapArg = process.argv.indexOf('--snapshot')
if (snapArg > 0) {
  const label = process.argv[snapArg + 1]
  if (!label) throw new Error('--snapshot にはラベルを指定してください')
  history.push({ label, pct: round2(U) })
  writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2) + '\n')
  console.log(`履歴に追加: ${label}`)
}

// ---- 既存ファイルにユーザーの入力があれば別名で残す ----
async function preserveUserInput() {
  if (!existsSync(OUT)) return
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.readFile(OUT)
  const txt = (v) => (v == null ? '' : v.richText ? v.richText.map((r) => r.text).join('') : String(v.text ?? v))
  let hasInput = false
  for (const ws of wb.worksheets) {
    const head = Array.from(ws.getRow(1).values, (v) => txt(v).replace(/\n/g, ''))
    const cols = head.map((h, i) => (h.startsWith('違和感') || h.startsWith('確認メモ') ? i : -1)).filter((i) => i > 0)
    if (!cols.length) continue
    ws.eachRow((row, n) => { if (n > 1 && cols.some((c) => txt(row.getCell(c).value).trim() !== '')) hasInput = true })
  }
  if (!hasInput) return
  const d = new Date(), p = (n) => String(n).padStart(2, '0')
  const stamp = `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`
  const backup = OUT.replace(/\.xlsx$/, `_入力済み_${stamp}.xlsx`)
  copyFileSync(OUT, backup)
  console.log(`既存ファイルに入力があったため別名で保存: ${backup}`)
}
await preserveUserInput()

// ---- スタイル ----
const wb = new ExcelJS.Workbook()
wb.creator = 'Claude'
const HEAD = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1A1A22' } }
const AXFILL = { 定住: 'FFDCE9F7', 時々: 'FFFFF2CC', 転々: 'FFDFF0D8' }
const border = { top: { style: 'thin', color: { argb: 'FFBBBBBB' } }, left: { style: 'thin', color: { argb: 'FFBBBBBB' } }, bottom: { style: 'thin', color: { argb: 'FFBBBBBB' } }, right: { style: 'thin', color: { argb: 'FFBBBBBB' } } }
function sheet(name, columns, rows, opts = {}) {
  const ws = wb.addWorksheet(name, { views: [{ state: 'frozen', ySplit: 1, xSplit: opts.freezeX || 0 }] })
  ws.columns = columns.map((c) => ({ header: c.h, key: c.k, width: c.w }))
  const hr = ws.getRow(1)
  hr.height = 32
  hr.eachCell((cell) => { cell.fill = HEAD; cell.font = { bold: true, color: { argb: 'FFFFFFFF' } }; cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }; cell.border = border })
  for (const r of rows) {
    const row = ws.addRow(r)
    row.eachCell({ includeEmpty: true }, (cell, col) => {
      cell.border = border
      const def = columns[col - 1]
      cell.alignment = { vertical: 'top', wrapText: true, horizontal: def && def.center ? 'center' : 'left' }
      if (def && def.axis && AXFILL[cell.value]) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: AXFILL[cell.value] } }
    })
  }
  return ws
}

// ---- 1. 仕組み ----
{
  const ws = wb.addWorksheet('1_仕組みの説明')
  ws.columns = [{ width: 26 }, { width: 110 }]
  const d = new Date(), p = (n) => String(n).padStart(2, '0')
  const rows = [
    ['このファイルについて', '質問文とポイントの割り振りに違和感がないかを確認するための一覧です。データは現在のソースコード(questions.js / ninjaTypes.js)から直接作っており、実装と一致しています。各シートの右端の「違和感」「確認メモ」欄に、気になる点を自由に書き込んでください(入力があるファイルは、次回の更新時に別名で残します)。'],
    ['点数の上限', '質問に付ける全ての点数(分類点・社交性・寡黙さ・分岐後の各タイプの点)は3以下にしています(2026/9/21のユーザー方針)。'],
    ['診断の流れ', '共通7問に答える → 【武家系・寺社系・庶民】の点数で分類が決まる → 分類ごとの分岐後3問に答える → 分岐後3問の点数(＋加算)で最終タイプが決まる。全10問。'],
    ['分類の判定に使う点数', '共通7問の選択肢ごとの「武家系点・寺社系点・庶民点」を合計し、最高点の分類に進みます。同点は「第7問の回答→第1問の回答」の順で決めます。※分類名は画面には一切出しません。'],
    ['最終タイプの判定に使う点数', '分岐後3問の点数の合計に、次の加算を足して最高点のタイプにします。\n・社交性(shakou)/寡黙さ(kamoku)：庶民に進んだ場合のみ。社交性は 商人・薬屋・放下師・猿楽師 に、寡黙さは 間者・刺客 に、共通7問の合計を加算。常の形には、社交性と寡黙さの小さい方を加算(どちらにも偏らないほど有利)。\n・移動・定住ボーナス：下記。'],
    ['移動・定住(定住/時々/転々)', '共通7問で選んだ選択肢の区分を数え、最も多かった区分が「単独首位」のとき、その区分の職業に最終判定で +1 します(同点・区分付き選択肢なしならボーナスなし)。分類の判定には使いません。武士と刺客は区分なし(ボーナス対象外)。'],
    ['同点のとき', '分岐後は「問3の回答→問1の回答」の順で決めます(判定に使うのは選択肢の点数の中で最も高いタイプ。同点なら書かれた順の先頭)。武士だけは「同点では勝てない」特別ルールで、他の2タイプの合計を単独で上回ったときだけ武士になります。'],
    ['シートの見方', '・2_共通7問：全選択肢の分類点・社交性・寡黙さ・移動定住区分(色付き)\n・3〜5_分岐：分類ごとの分岐後3問と、各タイプへの点数\n・6_職業と区分：12タイプの分類・区分・現在の出現率\n・7_出現率の推移：調整前後の理論値と、実テスターの傾向で計算した参考値'],
    ['区分の色', '定住＝青、時々＝黄、転々＝緑(共通7問シートの「移動・定住」列)'],
    ['作成日時', `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}(その時点のソースコードの配点。scripts/build-review-xlsx.mjs で生成)`],
  ]
  rows.forEach((r) => {
    const row = ws.addRow(r)
    row.getCell(1).font = { bold: true }
    row.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEDE6D6' } }
    row.eachCell((c) => { c.alignment = { vertical: 'top', wrapText: true }; c.border = border })
  })
}

// ---- 2. 共通7問 ----
{
  const rows = []
  COMMON_QUESTIONS.forEach((q, qi) => q.choices.forEach((c, i) => {
    rows.push([qi + 1, q.text, L[i], c.text, c.scores.buke || '', c.scores.jisha || '', c.scores.shomin || '', c.shakou || '', c.kamoku || '', c.axis ? AXJA[c.axis] : 'なし', '', ''])
  }))
  sheet('2_共通7問', [
    { h: '問', k: 'q', w: 5, center: true }, { h: '質問文', k: 'qt', w: 30 }, { h: '選択肢', k: 'c', w: 7, center: true }, { h: '選択肢の文面', k: 't', w: 46 },
    { h: '武家系点', k: 'b', w: 9, center: true }, { h: '寺社系点', k: 'j', w: 9, center: true }, { h: '庶民点', k: 's', w: 9, center: true },
    { h: '社交性\n(shakou)', k: 'sh', w: 9, center: true }, { h: '寡黙さ\n(kamoku)', k: 'ka', w: 9, center: true },
    { h: '移動・定住\n区分', k: 'ax', w: 11, center: true, axis: true }, { h: '違和感\n(○/△/×)', k: 'ok', w: 10, center: true }, { h: '確認メモ', k: 'memo', w: 40 },
  ], rows, { freezeX: 4 })
}

// ---- 3〜5. 分岐 ----
const SHEETNAME = { buke: '3_分岐_武家系', jisha: '4_分岐_寺社系', shomin: '5_分岐_庶民' }
for (const f of FACTIONS) {
  const typeIds = f.typeIds
  const rows = []
  BRANCH_QUESTIONS[f.id].forEach((q, qi) => q.choices.forEach((c, i) => {
    rows.push([qi + 1, q.text, L[i], c.text, ...typeIds.map((t) => c.scores[t] || ''), '', ''])
  }))
  sheet(SHEETNAME[f.id], [
    { h: '問', k: 'q', w: 5, center: true }, { h: '質問文', k: 'qt', w: 30 }, { h: '選択肢', k: 'c', w: 7, center: true }, { h: '選択肢の文面', k: 't', w: 46 },
    ...typeIds.map((t) => ({ h: TYPEJA(t) + '\n点', k: t, w: 9, center: true })),
    { h: '違和感\n(○/△/×)', k: 'ok', w: 10, center: true }, { h: '確認メモ', k: 'memo', w: 40 },
  ], rows, { freezeX: 4 })
}

// ---- 6. 職業と区分 ----
{
  const facOf = Object.fromEntries(FACTIONS.flatMap((f) => f.typeIds.map((t) => [t, f.id])))
  const rows = NINJA_TYPES.map((t) => [t.name, t.nameEn, FACJA[facOf[t.id]], t.mobility ? AXJA[t.mobility] : 'なし', t.mobility ? '+1' : '対象外', +(U[t.id] * 1).toFixed(2), +(E[t.id] * 1).toFixed(2), ''])
  rows.sort((a, b) => b[5] - a[5])
  const ws = sheet('6_職業と区分', [
    { h: '職業', k: 'n', w: 10 }, { h: '英語名', k: 'e', w: 16 }, { h: '進む分類', k: 'f', w: 10, center: true },
    { h: '移動・定住\n区分', k: 'ax', w: 11, center: true, axis: true }, { h: 'ボーナス\n(区分が首位のとき)', k: 'b', w: 14, center: true },
    { h: '出現率(%)\n等確率の前提', k: 'u', w: 14, center: true }, { h: '出現率(%)\n実テスター傾向で計算(参考)', k: 'e2', w: 20, center: true }, { h: '確認メモ', k: 'm', w: 40 },
  ], rows)
  ws.addRow([])
  ws.addRow(['※出現率は共通7問4⁷×分岐後4³の総当たり(現行ロジック)。実テスター傾向は22件(n=22)の選択傾向で重み付けした参考値で、有意ではありません。寺社系の選択肢が実際にはあまり選ばれない傾向のため、出家・山伏が低く出ます。'])
  const axCount = { teiju: 0, tokidoki: 0, hyohaku: 0, none: 0 }
  COMMON_QUESTIONS.forEach((q) => q.choices.forEach((c) => { axCount[c.axis || 'none']++ }))
  ws.addRow([`共通7問の28選択肢の内訳：定住 ${axCount.teiju} ／ 時々 ${axCount.tokidoki} ／ 転々 ${axCount.hyohaku} ／ なし ${axCount.none}`])
}

// ---- 7. 出現率の推移 ----
{
  const cols = [{ h: '職業', k: 'n', w: 10 }]
  history.forEach((h, i) => cols.push({ h: h.label, k: 'h' + i, w: 20, center: true }))
  cols.push({ h: '現行', k: 'cur', w: 14, center: true }, { h: '現行・実テスター傾向\n(参考)', k: 'cure', w: 20, center: true })
  const rows = NINJA_TYPES.map((t) => [t.name, ...history.map((h) => h.pct[t.id] ?? ''), +U[t.id].toFixed(2), +E[t.id].toFixed(2)])
  rows.sort((a, b) => b[history.length + 1] - a[history.length + 1])
  const ws = sheet('7_出現率の推移', cols, rows)
  ws.addRow([])
  ws.addRow(['単位は%。履歴の列は scripts/review-xlsx-history.json に記録した過去の値(等確率の総当たり)、「現行」列は現在のコードを総当たりした値です。'])
}

await wb.xlsx.writeFile(OUT)
console.log('生成:', OUT)
