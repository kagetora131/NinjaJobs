/**
 * 12タイプを2つの陣営(目立つ/目立たない)に分ける。
 * 前半6問で陣営を決め、後半(グループ決定3問+最終1問)でタイプを決める。
 *
 * typeIds の並び順が、旧・後半5問(6択)時代の選択肢A〜Fの並びと対応していた名残。
 * 現在のグループ制でも、グループ内の並び順(typeIds)が最終2択の並びと対応する。
 */
export const FACTIONS = [
  {
    id: 'medatsu',
    name: '目立つ陣営',
    summary: '目立つことこそが最良の隠れ蓑と心得る者たち',
    typeIds: ['hokashi', 'sarugakushi', 'akindo', 'kusuriya', 'yamabushi', 'bushi'],
    // 妥協のない極致(激レア)。グループ決定3問すべてで武闘派閥を選び、
    // 最終問でも武士を選んだ場合のみ至る(BACK_GROUPS参照)。
    extremeTypeId: 'bushi',
  },
  {
    id: 'medatanai',
    name: '目立たない陣営',
    summary: '気配を消すことにこそ己の道を見出す者たち',
    typeIds: ['komuso', 'shukke', 'tsunenokatachi', 'kanja', 'shikaku', 'kusushi'],
    extremeTypeId: 'shikaku',
  },
]

export const FACTION_MAP = Object.fromEntries(FACTIONS.map((f) => [f.id, f]))

/**
 * タイプIDから、そのタイプが所属する陣営を逆引きする。
 * 前半の「純度」による差し替え(scoring.js の applyFrontPurityOverride)で、
 * 前半に判定した陣営(medatsu/medatanai)とは別の陣営のタイプに最終結果が
 * 差し替わることがあるため、結果画面には前半で判定した陣営IDをそのまま使わず、
 * 必ずこの関数で最終タイプの実際の所属陣営を求め直すこと
 * (でないと「目立つ陣営の忍び」なのに虚無僧が出る、といった矛盾が起こる)。
 * @param {string} typeId
 */
export function factionOfType(typeId) {
  return FACTIONS.find((f) => f.typeIds.includes(typeId))
}

/**
 * 各陣営の6タイプを3グループ(2タイプずつ)にまとめたもの。
 * 「似たタイプを1つの選択肢に統合して後半の選択肢数を減らす」ための単位。
 * グループ決定3問で最も選ばれたグループが確定し、最終1問(2択)で
 * グループ内のどちらのタイプかが決まる。
 *
 * typeIds の並び順が最終2択の選択肢A/Bの並びと対応する。
 * extremeTypeId を持つグループ(武闘派閥・忍び)だけが激レアの仕組みを持つ
 * (詳細はCLAUDE.md 7章)。
 */
export const BACK_GROUPS = {
  medatsu: [
    { id: 'geino', name: '芸能系', typeIds: ['sarugakushi', 'hokashi'] },
    { id: 'shobai', name: '商売系', typeIds: ['kusuriya', 'akindo'] },
    { id: 'butouha', name: '武闘派閥', typeIds: ['yamabushi', 'bushi'], extremeTypeId: 'bushi' },
  ],
  medatanai: [
    { id: 'kyudo', name: '求道系', typeIds: ['komuso', 'shukke'] },
    { id: 'shomin', name: '庶民系', typeIds: ['tsunenokatachi', 'kusushi'] },
    { id: 'shinobi', name: '忍び', typeIds: ['kanja', 'shikaku'], extremeTypeId: 'shikaku' },
  ],
}
