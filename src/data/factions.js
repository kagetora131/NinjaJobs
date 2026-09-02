/**
 * 12タイプを2つの陣営(目立つ/目立たない)に分ける。
 * 「忍者タイプ診断_新ロジック仕様書」に基づく2段階分岐方式:
 * 前半5問で陣営を決め、後半5問(その陣営の6タイプに対応する6択)でタイプを決める。
 *
 * typeIds の並び順が、その陣営の後半5問の選択肢A〜Fの並びと対応する
 * (index をそのままタイプの指定に使うため、順序がずれると別のタイプになる)。
 */
export const FACTIONS = [
  {
    id: 'medatsu',
    name: '目立つ陣営',
    summary: '目立つことこそが最良の隠れ蓑と心得る者たち',
    typeIds: ['hokashi', 'sarugakushi', 'akindo', 'kusuriya', 'yamabushi', 'bushi'],
    // 妥協のない極致(激レア)。後半5問すべてをこのタイプの選択肢で貫いた者だけが至る。
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
