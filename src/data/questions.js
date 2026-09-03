/**
 * 前半6問(共通)。「目立つ/目立たない」の二択軸にのみ加点する。
 * 各問4択。choices[].scores は { medatsu?: 2, medatanai?: 2 } のように
 * 加点する軸を持つ。通常は片方だけに+2する単軸の選択肢だが、第4問Aのように
 * 両軸に+2する「中立」の選択肢を混ぜることもある(あからさまさを消すため)。
 *
 * 質問はできるだけ最後まで軸が読めないよう、以下の工夫をしている
 * (詳細はCLAUDE.md 6章):
 * - 選択肢は「目立つ/気配を消す」と直接言い切らず、具体的な行動の描写に留める
 * - 忍者の職務(任務・潜入)ばかりが続くと「適性診断」の構えが透けるため、
 *   日常の場面(贈り物選び)を挟んで毛色を変えている
 * - 一部の選択肢は両軸に加点する「中立」の選択肢にして、4択を機械的に
 *   2:2で読めないようにしている
 */
export const FRONT_QUESTIONS = [
  {
    id: 'f1',
    text: '任務を与えられた。まず何をする?',
    choices: [
      { id: 'f1a', text: '皆の前で役割を言い渡し、士気を高める', scores: { medatsu: 2 } },
      { id: 'f1b', text: '一人で黙々と、身支度と得物を整える', scores: { medatanai: 2 } },
      { id: 'f1c', text: 'まず情報を集めようと、あちこちに顔を出す', scores: { medatsu: 2 } },
      { id: 'f1d', text: '気配を殺し、誰にも知られぬ内に動き出す', scores: { medatanai: 2 } },
    ],
  },
  {
    id: 'f2',
    text: 'どう潜入する?',
    choices: [
      { id: 'f2a', text: '声をかけながら、堂々と門をくぐる', scores: { medatsu: 2 } },
      { id: 'f2b', text: '誰かの陰に紛れ、そっと敷地に入り込む', scores: { medatanai: 2 } },
      { id: 'f2c', text: '話題を振りまき、注意を逸らしながら進む', scores: { medatsu: 2 } },
      { id: 'f2d', text: '足音を殺し、闇と一つになって進む', scores: { medatanai: 2 } },
    ],
  },
  {
    id: 'f3',
    text: '初対面の相手には、どう接する?',
    choices: [
      { id: 'f3a', text: 'すぐに打ち解けるよう働きかける', scores: { medatsu: 2 } },
      { id: 'f3b', text: '多くを語らず、まず心の内で祈りを捧げる', scores: { medatanai: 2 } },
      { id: 'f3c', text: '友人になりきり、心を開かせる', scores: { medatsu: 2 } },
      { id: 'f3d', text: 'さりげなく様子を窺い、力になれることはないか考える', scores: { medatanai: 2 } },
    ],
  },
  {
    id: 'f4',
    text: '休息の日、何をして過ごす?',
    choices: [
      // 「目立つ」だけに寄りすぎず、瞑想は求道・修行どちらの気質にも通じるため中立
      { id: 'f4a', text: '瞑想して過ごす', scores: { medatsu: 2, medatanai: 2 } },
      { id: 'f4b', text: '人知れず、市中の噂の出所を探る', scores: { medatanai: 2 } },
      { id: 'f4c', text: '芸や技を、人前で磨く', scores: { medatsu: 2 } },
      { id: 'f4d', text: '薬草を摘み、静かに調合を試す', scores: { medatanai: 2 } },
    ],
  },
  {
    id: 'f5',
    text: '贈り物を選ぶなら、どうする?',
    choices: [
      { id: 'f5a', text: '皆で盛り上がれる、賑やかな品を選ぶ', scores: { medatsu: 2 } },
      { id: 'f5b', text: '相手の心にそっと寄り添う品を選ぶ', scores: { medatanai: 2 } },
      { id: 'f5c', text: '誰もが目を引く、とびきりの品を探す', scores: { medatsu: 2 } },
      { id: 'f5d', text: '誰にも気づかれぬよう、そっと届ける', scores: { medatanai: 2 } },
    ],
  },
  {
    id: 'f6',
    text: '潜入先で怪しまれそうになった。どうする?',
    choices: [
      { id: 'f6a', text: '大袈裟に笑い、芸を見せて気を逸らす', scores: { medatsu: 2 } },
      { id: 'f6b', text: 'その場に溶け込む', scores: { medatanai: 2 } },
      { id: 'f6c', text: '堂々と名乗り、正面から相対する', scores: { medatsu: 2 } },
      { id: 'f6d', text: '音もなく身を引き、姿をくらます', scores: { medatanai: 2 } },
    ],
  },
]

/**
 * 後半・グループ決定3問。陣営が確定した後に出す、3グループ(6タイプを
 * 2つずつまとめたもの)から1つに絞り込むための設問。
 * choices の並びは BACK_GROUPS[faction] と同じ順(groupIndexとしてそのまま使う)。
 * 選んだグループに+2する。似たタイプ2つを1つの選択肢に統合することで、
 * 後半の選択肢数を6→3(最終問のみ2)に減らしている。
 */
export const BACK_GROUP_QUESTIONS = {
  // 芸能系(猿楽師/放下師) / 商売系(薬屋/商人) / 武闘派閥(山伏/武士・激レア)
  medatsu: [
    {
      id: 'medatsu_g1',
      text: 'お前が最も"己"を出せるのは、どんな時だ?',
      choices: [
        { id: 'medatsu_g1a', text: '人前で、芸や役を演じきる時' },
        { id: 'medatsu_g1b', text: '駆け引きの末、取引をまとめる時' },
        { id: 'medatsu_g1c', text: '力を示し、堂々と名乗りを上げる時' },
      ],
    },
    {
      id: 'medatsu_g2',
      text: '人々から求められるのは何だ?',
      choices: [
        { id: 'medatsu_g2a', text: '笑いと、忘れられぬ舞台' },
        { id: 'medatsu_g2b', text: '良い品と、確かな信頼' },
        { id: 'medatsu_g2c', text: '力と、義のある生き方' },
      ],
    },
    {
      id: 'medatsu_g3',
      text: '一番大切にしているものは?',
      choices: [
        { id: 'medatsu_g3a', text: '磨き上げた芸の腕' },
        { id: 'medatsu_g3b', text: '商いの才と、人脈' },
        { id: 'medatsu_g3c', text: '鍛えた心身と、己の筋' },
      ],
    },
  ],

  // 求道系(虚無僧/出家) / 庶民系(常の形/薬師) / 忍び(間者/刺客・激レア)
  medatanai: [
    {
      id: 'medatanai_g1',
      text: 'お前が最も"己"を出せるのは、どんな時だ?',
      choices: [
        { id: 'medatanai_g1a', text: '静寂の中、心を澄ませる時' },
        { id: 'medatanai_g1b', text: '誰にも気づかれず、日常に紛れる時' },
        { id: 'medatanai_g1c', text: '物事の裏側を、静かに読み解く時' },
      ],
    },
    {
      id: 'medatanai_g2',
      text: '人からどう思われたいか?',
      choices: [
        { id: 'medatanai_g2a', text: '慎み深く、徳のある者として' },
        { id: 'medatanai_g2b', text: '記憶にも残らぬ、ただの人として' },
        { id: 'medatanai_g2c', text: '何を考えているか分からぬ者として' },
      ],
    },
    {
      id: 'medatanai_g3',
      text: '一番大切にしているものは?',
      choices: [
        { id: 'medatanai_g3a', text: '深い静寂と、平らかな心' },
        { id: 'medatanai_g3b', text: '誰にも踏み込まれない、日常' },
        { id: 'medatanai_g3c', text: '知るべきことを、全て知ること' },
      ],
    },
  ],
}

/**
 * 後半・最終1問。グループが確定した後に出す、そのグループ内の2タイプを
 * 決める最後の2択。BACK_GROUPS[faction][groupIndex].typeIds の順と対応する。
 *
 * 武闘派閥(山伏/武士)と忍び(間者/刺客)は、グループ決定3問すべてで
 * そのグループを選び通した上でこの最終問でも激レア側を選んだ場合のみ、
 * 激レアタイプ(武士/刺客)に至る(詳細はCLAUDE.md 7章)。
 */
export const BACK_FINAL_QUESTIONS = {
  medatsu: {
    geino: {
      id: 'medatsu_f_geino',
      text: '素顔を見せるのは?',
      choices: [
        { id: 'medatsu_f_geino_a', text: 'ほとんど誰にも見せぬ' }, // 猿楽師
        { id: 'medatsu_f_geino_b', text: '求められれば、いつでも' }, // 放下師
      ],
    },
    shobai: {
      id: 'medatsu_f_shobai',
      text: 'お前の"目立ち方"の本質は?',
      choices: [
        { id: 'medatsu_f_shobai_a', text: '呼び込みの声で、人を集めること' }, // 薬屋
        { id: 'medatsu_f_shobai_b', text: '値を付け、話をまとめること' }, // 商人
      ],
    },
    butouha: {
      id: 'medatsu_f_butouha',
      text: 'お前の"目立ち方"の本質は?',
      choices: [
        { id: 'medatsu_f_butouha_a', text: '荒行と法螺貝の響きで、存在を示すこと' }, // 山伏
        { id: 'medatsu_f_butouha_b', text: '隠す気など端からなく、堂々と生きること' }, // 武士(激レア)
      ],
    },
  },
  medatanai: {
    kyudo: {
      id: 'medatanai_f_kyudo',
      text: 'お前の"隠れ方"の本質は?',
      choices: [
        { id: 'medatanai_f_kyudo_a', text: '深編笠の下で、心の内に籠ること' }, // 虚無僧
        { id: 'medatanai_f_kyudo_b', text: '人を救う行いの中に、己を紛れさせること' }, // 出家
      ],
    },
    shomin: {
      id: 'medatanai_f_shomin',
      text: 'お前にとって"消える"とは?',
      choices: [
        { id: 'medatanai_f_shomin_a', text: 'ただの人として、群れに紛れること' }, // 常の形
        { id: 'medatanai_f_shomin_b', text: '名も告げず、ただ施しを行うこと' }, // 薬師
      ],
    },
    shinobi: {
      id: 'medatanai_f_shinobi',
      text: 'お前の"隠れ方"の本質は?',
      choices: [
        { id: 'medatanai_f_shinobi_a', text: '耳と眼だけを、研ぎ澄ますこと' }, // 間者
        { id: 'medatanai_f_shinobi_b', text: '刃と共に、気配そのものを消すこと' }, // 刺客(激レア)
      ],
    },
  },
}

export const FRONT_COUNT = FRONT_QUESTIONS.length
export const BACK_GROUP_COUNT = 3
export const BACK_FINAL_COUNT = 1
export const TOTAL_QUESTIONS = FRONT_COUNT + BACK_GROUP_COUNT + BACK_FINAL_COUNT
