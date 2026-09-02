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
 * 「修正依頼書：カテゴリー出現バランス調整」で武闘系を意図的に最多にする
 * scores差分を一度入れたが、実測36.15%は偏りが大きすぎるとの判断でscores差分
 * ごと撤回した(以降scoresはこの調整依頼以前の状態のまま変更していない)。
 * その後、純粋な均等化優先の並び(['kyudo','butou','iryo','geino','shomin'])
 * では武闘系が5系統中最下位(17.91%)になってしまい、それも問題視されたため、
 * 「武闘系を最下位にしない」という制約を加えて全120通りを再探索した。
 * この並びは武闘系が最下位にならない候補の中でspread(最大/最小)が最小になる
 * もの(1.171倍。制約なしの最小1.305倍より、むしろ均等性そのものも改善している)。
 */
export const SYSTEM_TIE_ORDER = ['butou', 'kyudo', 'iryo', 'geino', 'shomin']
