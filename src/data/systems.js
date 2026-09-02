/**
 * 12タイプを5つの系統に分ける。
 * 診断は「共通7問で系統を決め、その系統専用の3問で系統内のタイプを決める」2段構成。
 */
export const SYSTEMS = [
  {
    id: 'kyudo',
    name: '求道系',
    summary: '世を捨て、己の内なる道を求める者たち',
    typeIds: ['komuso', 'shukke', 'yamabushi'],
    branchWeights: [1, 1, 1],
  },
  {
    id: 'butou',
    name: '武闘系',
    summary: '任務を果たすため、刃と知略を執る者たち',
    typeIds: ['kanja', 'shikaku', 'bushi'],
    // 武士は「最もレアなタイプ」という設計意図のため票を軽くしてある。
    // 3問すべてで武士側を選び通した者だけが武士に至る。
    branchWeights: [2, 2, 1],
  },
  {
    id: 'geino',
    name: '芸能系',
    summary: '人目を引き、演じることを生業とする者たち',
    typeIds: ['sarugakushi', 'hokashi'],
    branchWeights: [1, 1],
  },
  {
    id: 'iryo',
    name: '医療系',
    summary: '薬と知識で、人の生き死にに関わる者たち',
    typeIds: ['kusushi', 'kusuriya'],
    branchWeights: [1, 1],
  },
  {
    id: 'shomin',
    name: '庶民系',
    summary: '市井に紛れ、当たり前の顔で生きる者たち',
    typeIds: ['tsunenokatachi', 'akindo'],
    branchWeights: [1, 1],
  },
]

export const SYSTEM_MAP = Object.fromEntries(SYSTEMS.map((s) => [s.id, s]))

/**
 * 系統が同点になった場合に勝つ順(先頭ほど強い)。
 * 「修正依頼書：カテゴリー出現バランス調整」により、目標は5系統均等ではなく
 * 「武闘系が最も出やすく、庶民・芸能・求道・医療の4系統は僅差」に変わった。
 * 全120通りの並びを総当たりし、武闘系が常に最多になる並びの中から
 * 残り4系統のspread(最大/最小)が最小になるものを選んでいる
 * (武闘系36.15% / 庶民17.58% / 芸能16.06% / 求道15.50% / 医療14.70%、
 * 残り4系統のspreadは1.196倍)。質問文・配点を変更するたびに同様の
 * 総当たりで見直すこと。
 */
export const SYSTEM_TIE_ORDER = ['butou', 'shomin', 'kyudo', 'iryo', 'geino']
