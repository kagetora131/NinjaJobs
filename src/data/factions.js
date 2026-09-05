/**
 * 3分類(武家系/寺社系/庶民)。共通7問の結果で内部的にどれか1つに決まるが、
 * 「忍者タイプ診断_新ロジック仕様書」1章の方針により、分類名はユーザーに
 * 見せる画面(質問文・進行中の表示・結果画面)には一切表示しない
 * (開発者向けの内部コード名としてのみ使う)。
 */
export const FACTIONS = [
  { id: 'buke', typeIds: ['bushi', 'komuso', 'kusushi'] },
  { id: 'jisha', typeIds: ['shukke', 'yamabushi'] },
  { id: 'shomin', typeIds: ['tsunenokatachi', 'akindo', 'kusuriya', 'kanja', 'shikaku', 'hokashi', 'sarugakushi'] },
]

export const FACTION_MAP = Object.fromEntries(FACTIONS.map((f) => [f.id, f]))

/**
 * タイプIDから、そのタイプが所属する分類を逆引きする(dev整合性チェック用)。
 * @param {string} typeId
 */
export function factionOfType(typeId) {
  return FACTIONS.find((f) => f.typeIds.includes(typeId))
}
