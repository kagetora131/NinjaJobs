/**
 * 前半5問(共通)。「目立つ/目立たない」の二択軸にのみ加点する。
 * 各問4択、目立つ+2の選択肢2つ／目立たない+2の選択肢2つで構成。
 * axis は 'medatsu'(目立つ) または 'medatanai'(目立たない)。
 */
export const FRONT_QUESTIONS = [
  {
    id: 'f1',
    text: 'どう潜入する?',
    choices: [
      { id: 'f1a', text: '大道芸や口上を使い、人目を集めながら入り込む', axis: 'medatsu' },
      { id: 'f1b', text: '商いのふりをして、愛想よく人前で立ち回る', axis: 'medatsu' },
      { id: 'f1c', text: '気配を断ち、闇に紛れて忍び込む', axis: 'medatanai' },
      { id: 'f1d', text: '何でもない顔で、誰の記憶にも残らぬように紛れ込む', axis: 'medatanai' },
    ],
  },
  {
    id: 'f2',
    text: '潜入先で怪しまれそうになった。どうする?',
    choices: [
      { id: 'f2a', text: '芸を見せたり大袈裟に笑って場を沸かせ、注目ごと逸らす', axis: 'medatsu' },
      { id: 'f2b', text: '堂々と名乗り、正面から向き合う', axis: 'medatsu' },
      { id: 'f2c', text: 'その場に溶け込み、気配を消す', axis: 'medatanai' },
      { id: 'f2d', text: '静かにその場を離れ、姿をくらます', axis: 'medatanai' },
    ],
  },
  {
    id: 'f3',
    text: '休息の日、何をして過ごす?',
    choices: [
      { id: 'f3a', text: '街に出て、人と交わり賑やかに過ごす', axis: 'medatsu' },
      { id: 'f3b', text: '新しい芸や技を人前で磨く', axis: 'medatsu' },
      { id: 'f3c', text: '一人静かに、心身を鍛える', axis: 'medatanai' },
      { id: 'f3d', text: '薬草を摘み、静かに調合を試す', axis: 'medatanai' },
    ],
  },
  {
    id: 'f4',
    text: '大切にしている信条は?',
    choices: [
      { id: 'f4a', text: '人を楽しませ、場を明るくすること', axis: 'medatsu' },
      { id: 'f4b', text: '己の名と誇りを、隠さず示すこと', axis: 'medatsu' },
      { id: 'f4c', text: '執着を捨て、心を平らかに保つこと', axis: 'medatanai' },
      { id: 'f4d', text: '気配を悟らせず、目的だけを果たすこと', axis: 'medatanai' },
    ],
  },
  {
    id: 'f5',
    text: '仲間が窮地に陥った。どうする?',
    choices: [
      { id: 'f5a', text: '場を茶化し、明るく振る舞って気を紛らわせる', axis: 'medatsu' },
      { id: 'f5b', text: '迷わず助けに向かい、多少の無茶も厭わない', axis: 'medatsu' },
      { id: 'f5c', text: 'こっそり裏から手を回し、悟られず解決する', axis: 'medatanai' },
      { id: 'f5d', text: '手当てをし、物静かに命を繋ぐ', axis: 'medatanai' },
    ],
  },
]

/**
 * 後半5問。陣営が確定した後に出す、その陣営の6タイプに対応する6択。
 * choices の並びは FACTIONS[].typeIds と同じ順(typeIndex としてそのまま使う)。
 * 選んだ分だけそのタイプに+1する(等ウェイト)。
 */
export const BACK_QUESTIONS = {
  // 放下師 / 猿楽師 / 商人 / 薬屋 / 山伏 / 武士(激レア)
  medatsu: [
    {
      id: 'medatsu1',
      text: '人前でお前が最も輝くのは、どんな時だ?',
      choices: [
        { id: 'medatsu1a', text: '芸や曲芸で沸かせる時' },
        { id: 'medatsu1b', text: '別人に成りきり、演じきる時' },
        { id: 'medatsu1c', text: '巧みな話で、取引をまとめる時' },
        { id: 'medatsu1d', text: '効能を説き、薬を売り歩く時' },
        { id: 'medatsu1e', text: '法螺貝を吹き鳴らし、山を歩く時' },
        { id: 'medatsu1f', text: '名を名乗り、刀を掲げる時' },
      ],
    },
    {
      id: 'medatsu2',
      text: 'お前の"目立ち方"の本質は?',
      choices: [
        { id: 'medatsu2a', text: '身ひとつで、場を回すこと' },
        { id: 'medatsu2b', text: '面をつけ、心を隠すこと' },
        { id: 'medatsu2c', text: '値を付け、話をまとめること' },
        { id: 'medatsu2d', text: '呼び込みの声で、人を集めること' },
        { id: 'medatsu2e', text: '荒行と法螺貝の響きで、存在を示すこと' },
        { id: 'medatsu2f', text: '隠す気など端からなく、堂々と生きること' },
      ],
    },
    {
      id: 'medatsu3',
      text: '人々から求められるのは何だ?',
      choices: [
        { id: 'medatsu3a', text: '笑いと驚き' },
        { id: 'medatsu3b', text: '忘れられぬ舞台' },
        { id: 'medatsu3c', text: '良い品と良い話' },
        { id: 'medatsu3d', text: '効く薬' },
        { id: 'medatsu3e', text: '山の知恵と力' },
        { id: 'medatsu3f', text: '義と正しさ' },
      ],
    },
    {
      id: 'medatsu4',
      text: '一番大切にしているものは?',
      choices: [
        { id: 'medatsu4a', text: '軽業と手妻の腕' },
        { id: 'medatsu4b', text: '芸の奥深さ' },
        { id: 'medatsu4c', text: '信頼と評判' },
        { id: 'medatsu4d', text: '薬と商いの才' },
        { id: 'medatsu4e', text: '鍛え上げた心身' },
        { id: 'medatsu4f', text: '己の筋を通しきること' },
      ],
    },
    {
      id: 'medatsu5',
      text: '素顔を見せるのは?',
      choices: [
        { id: 'medatsu5a', text: '求められれば、いつでも' },
        { id: 'medatsu5b', text: 'ほとんど誰にも見せぬ' },
        { id: 'medatsu5c', text: '商いの席では常に愛想よく' },
        { id: 'medatsu5d', text: '薬を売る時はいつも笑顔で' },
        { id: 'medatsu5e', text: '山にいる時だけ、素のまま' },
        { id: 'medatsu5f', text: '常に素顔のまま、隠さない' },
      ],
    },
  ],

  // 虚無僧 / 出家 / 常の形 / 間者 / 刺客(激レア) / 薬師
  medatanai: [
    {
      id: 'medatanai1',
      text: 'お前が一番心が休まるのは、どんな時だ?',
      choices: [
        { id: 'medatanai1a', text: '一管の尺八を吹き、静寂に包まれる時' },
        { id: 'medatanai1b', text: '経を誦し、祈りを捧げる時' },
        { id: 'medatanai1c', text: '誰にも気づかれず、日常に紛れている時' },
        { id: 'medatanai1d', text: '物事の裏側を、静かに読み解く時' },
        { id: 'medatanai1e', text: '気配を断ち、闇に溶け込む時' },
        { id: 'medatanai1f', text: '薬箱を前に、黙々と調合する時' },
      ],
    },
    {
      id: 'medatanai2',
      text: 'お前の"隠れ方"の本質は?',
      choices: [
        { id: 'medatanai2a', text: '深編笠の下で、心の内に籠ること' },
        { id: 'medatanai2b', text: '人を救う行いの中に、己を紛れさせること' },
        { id: 'medatanai2c', text: '何者でもない顔で、居続けること' },
        { id: 'medatanai2d', text: '耳と眼だけを、研ぎ澄ますこと' },
        { id: 'medatanai2e', text: '刃と共に、気配そのものを消すこと' },
        { id: 'medatanai2f', text: '言葉少なに、施しだけを行うこと' },
      ],
    },
    {
      id: 'medatanai3',
      text: '人からどう思われたいか?',
      choices: [
        { id: 'medatanai3a', text: '何も語らぬ、謎めいた者として' },
        { id: 'medatanai3b', text: '慎み深く、徳のある者として' },
        { id: 'medatanai3c', text: '記憶にも残らぬ、ただの人として' },
        { id: 'medatanai3d', text: '何を考えているか分からぬ者として' },
        { id: 'medatanai3e', text: '存在した痕跡すら残さぬ者として' },
        { id: 'medatanai3f', text: '物静かで頼れる者として' },
      ],
    },
    {
      id: 'medatanai4',
      text: '一番大切にしているものは?',
      choices: [
        { id: 'medatanai4a', text: '深い静寂と、内省の時間' },
        { id: 'medatanai4b', text: '執着を捨てた、平らかな心' },
        { id: 'medatanai4c', text: '誰にも踏み込まれない、日常' },
        { id: 'medatanai4d', text: '知るべきことを、全て知ること' },
        { id: 'medatanai4e', text: '命じられた一事を、必ず果たすこと' },
        { id: 'medatanai4f', text: '人を救うための、確かな理' },
      ],
    },
    {
      id: 'medatanai5',
      text: 'お前にとって"消える"とは?',
      choices: [
        { id: 'medatanai5a', text: '音を絶ち、心を無にすること' },
        { id: 'medatanai5b', text: '我を捨て、人のために生きること' },
        { id: 'medatanai5c', text: 'ただの人として、群れに紛れること' },
        { id: 'medatanai5d', text: '姿を見せず、真実だけを持ち帰ること' },
        { id: 'medatanai5e', text: '気配も、痕跡も、何一つ残さぬこと' },
        { id: 'medatanai5f', text: '名も告げず、ただ施しを行うこと' },
      ],
    },
  ],
}

export const FRONT_COUNT = FRONT_QUESTIONS.length
export const BACK_COUNT = 5
export const TOTAL_QUESTIONS = FRONT_COUNT + BACK_COUNT
