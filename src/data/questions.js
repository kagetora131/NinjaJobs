/**
 * 共通7問。「武家系/寺社系/庶民」の3分類を内部判定する(ユーザーには見せない)。
 * 「忍者タイプ診断_新ロジック仕様書」4章に基づき、忍者用語(任務・潜入・
 * 忍び込む等)を排し、一般的な職業適性診断風の文言にしてある。
 *
 * choices[].scores は { buke?, jisha?, shomin? } の3キーのみ持つ
 * (加点先の分類名。個々の値は+1/+2)。一部の選択肢はさらに shakou/kamoku
 * という裏スコアも持つ(数値、庶民に分岐した場合のみ最終判定で使用。
 * 6章・scoring.js参照)。
 */
export const COMMON_QUESTIONS = [
  {
    id: 'c1',
    text: '新しい仕事を任された。まず何をする?',
    choices: [
      { id: 'c1a', text: 'まず資料や過去の事例を調べ、確実な方法を考える', scores: { buke: 2 } },
      { id: 'c1b', text: '心を落ち着け、自分の調子を整えてから取りかかる', scores: { jisha: 2 } },
      { id: 'c1c', text: '周囲の人に話を聞き、必要な情報を集める', scores: { shomin: 2 }, shakou: 1 },
      { id: 'c1d', text: '必要になりそうな物や手順を、先に整えておく', scores: { buke: 1, shomin: 1 } },
    ],
  },
  {
    id: 'c2',
    text: '旅先で道に迷ったら、どうする?',
    choices: [
      { id: 'c2a', text: '地図や案内を確認し、確実な道を探す', scores: { buke: 2 } },
      { id: 'c2b', text: 'いったん立ち止まり、焦らず周囲の状況を見直す', scores: { jisha: 2 } },
      { id: 'c2c', text: '近くの人に声をかけ、道を教えてもらう', scores: { shomin: 2 }, shakou: 1 },
      { id: 'c2d', text: '周囲をよく観察し、自分で判断できる材料を集める', scores: { buke: 1, shomin: 1 }, kamoku: 1 },
    ],
  },
  {
    id: 'c3',
    text: '初対面の相手とは、どのように接する?',
    choices: [
      { id: 'c3a', text: '礼儀を大切にし、知識や誠実さで信頼を得る', scores: { buke: 2 } },
      { id: 'c3b', text: '必要以上に語らず、相手と静かな距離を保つ', scores: { jisha: 2 } },
      { id: 'c3c', text: '気軽に話しかけ、自然に打ち解ける', scores: { shomin: 2 }, shakou: 1 },
      { id: 'c3d', text: '相手の表情や様子をよく見てから、接し方を決める', scores: { buke: 1, shomin: 1 }, kamoku: 1 },
    ],
  },
  {
    id: 'c4',
    text: '困っている人を見かけたら、どうする?',
    choices: [
      { id: 'c4a', text: '状況を整理し、自分にできる現実的な助け方を考える', scores: { buke: 2 } },
      { id: 'c4b', text: 'まず相手の気持ちを落ち着かせ、安心できるようにする', scores: { jisha: 2 } },
      { id: 'c4c', text: '自分から声をかけ、できることがあれば手を貸す', scores: { shomin: 2 }, shakou: 1 },
      { id: 'c4d', text: '直接手を出す前に、何が必要なのかを見極める', scores: { buke: 1, shomin: 1 }, kamoku: 1 },
    ],
  },
  {
    id: 'c5',
    text: '贈り物を選ぶなら、どうする?',
    choices: [
      { id: 'c5a', text: '実用的で質の良いものを、じっくり吟味する', scores: { buke: 2 } },
      { id: 'c5b', text: '相手の無事や幸せを願えるものを選ぶ', scores: { jisha: 2 } },
      { id: 'c5c', text: '相手が喜ぶ姿を想像しながら、楽しんで選ぶ', scores: { shomin: 2 }, shakou: 1 },
      { id: 'c5d', text: '値段と価値の釣り合いを考え、長く使えるものを選ぶ', scores: { shomin: 1, buke: 1 } },
    ],
  },
  {
    id: 'c6',
    text: '思いがけないトラブルが起きた。どうする?',
    choices: [
      { id: 'c6a', text: '状況を整理し、筋道を立てて対処する', scores: { buke: 2 } },
      { id: 'c6b', text: '心を乱さず、まず落ち着いてから動く', scores: { jisha: 2 } },
      { id: 'c6c', text: '周囲と相談しながら、その場をうまく収める', scores: { shomin: 2 }, shakou: 1 },
      { id: 'c6d', text: 'その場で最も安全な方法を、素早く選ぶ', scores: { jisha: 1, shomin: 1 }, kamoku: 1 },
    ],
  },
  {
    id: 'c7',
    text: 'あなたが「仕事のできる人」だと思うのは、どんな人?',
    choices: [
      { id: 'c7a', text: '知識や技術を着実に積み重ねている人', scores: { buke: 2 } },
      { id: 'c7b', text: 'どんな状況でも、自分を律することのできる人', scores: { jisha: 2 } },
      { id: 'c7c', text: '周囲とうまく関係を築き、場をまとめられる人', scores: { shomin: 2 }, shakou: 1 },
      { id: 'c7d', text: '先回りして準備し、状況に応じて動ける人', scores: { buke: 1, shomin: 1 } },
    ],
  },
]

/**
 * 武家系(武士/虚無僧/薬師)の分岐後3問。武士は+1、虚無僧・薬師は+2という
 * 配点差により、3問合計で虚無僧・薬師(満点6)が武士(満点3)より自然に
 * 高得点になりやすく、武士が低配点だけで自然にレア化する(5章参照)。
 */
export const BUKE_QUESTIONS = [
  {
    id: 'buke_1',
    text: 'あなたが最も誇りに思うものは?',
    choices: [
      { id: 'buke_1a', text: '磨き上げた技術と、それを実際に役立てる力', scores: { bushi: 1 } },
      { id: 'buke_1b', text: '深い信念と、人を導く言葉', scores: { komuso: 2 } },
      { id: 'buke_1c', text: '積み重ねた知識と、冷静に物事を判断する力', scores: { kusushi: 2 } },
    ],
  },
  {
    id: 'buke_2',
    text: '迷いが生じたとき、何を拠り所にする?',
    choices: [
      { id: 'buke_2a', text: 'これまで積み重ねてきた経験と、自分の腕', scores: { bushi: 1 } },
      { id: 'buke_2b', text: '自分の信じるものと、揺るがぬ信念', scores: { komuso: 2 } },
      { id: 'buke_2c', text: '学んできた知識と、客観的に考える力', scores: { kusushi: 2 } },
    ],
  },
  {
    id: 'buke_3',
    text: '自分の価値を示すとしたら?',
    choices: [
      { id: 'buke_3a', text: '行動と実力で、結果を示す', scores: { bushi: 1 } },
      { id: 'buke_3b', text: '言葉や生き方で、人に何かを伝える', scores: { komuso: 2 } },
      { id: 'buke_3c', text: '知識や技術を用いて、人の役に立つ', scores: { kusushi: 2 } },
    ],
  },
]

/**
 * 寺社系(出家/山伏)の分岐後3問。
 */
export const JISHA_QUESTIONS = [
  {
    id: 'jisha_1',
    text: '自分を鍛えるなら、どんな方法を選ぶ?',
    choices: [
      { id: 'jisha_1a', text: '人の中に身を置き、自分を律する', scores: { shukke: 2 } },
      { id: 'jisha_1b', text: '静かな場所で心を整え、己と向き合う', scores: { shukke: 2 } },
      { id: 'jisha_1c', text: '厳しい環境に身を置き、己を鍛える', scores: { yamabushi: 2 } },
      { id: 'jisha_1d', text: '苦しいことから逃げず、最後までやり抜く', scores: { yamabushi: 2 } },
    ],
  },
  {
    id: 'jisha_2',
    text: '心を乱されそうなとき、どうする?',
    choices: [
      { id: 'jisha_2a', text: '静かに自分の心と向き合う', scores: { shukke: 2 } },
      { id: 'jisha_2b', text: '人の苦しみや自分の役割を思い返す', scores: { shukke: 2 } },
      { id: 'jisha_2c', text: '呼吸を整え、身体の感覚に意識を集中する', scores: { yamabushi: 2 } },
      { id: 'jisha_2d', text: 'あえて厳しい環境に身を置き、自分を奮い立たせる', scores: { yamabushi: 2 } },
    ],
  },
  {
    id: 'jisha_3',
    text: '「強い人」とは、どんな人だと思う?',
    choices: [
      { id: 'jisha_3a', text: '人のために、自分を律して行動できる人', scores: { shukke: 2 } },
      { id: 'jisha_3b', text: '欲や迷いに振り回されず、静かな心を保てる人', scores: { shukke: 2 } },
      { id: 'jisha_3c', text: '苦しい状況でも耐え抜き、前に進み続ける人', scores: { yamabushi: 2 } },
      { id: 'jisha_3d', text: '自分を鍛え続け、困難に立ち向かえる人', scores: { yamabushi: 2 } },
    ],
  },
]

/**
 * 庶民(常の形/商人/薬屋/間者/刺客/放下師/猿楽師)の分岐後3問。
 * クラスターによる事前分岐は行わず、7タイプを直接フラット得点制で判定する
 * (6章参照)。常の形は3問すべての選択肢Aとして毎回登場し、他の6タイプは
 * B/C/Dに主+2・従+1で振り分けられる。
 */
export const SHOMIN_QUESTIONS = [
  {
    id: 'shomin_1',
    text: '人前でのお前は?',
    choices: [
      { id: 'shomin_1a', text: '誰の記憶にも残らない、ごく普通の者', scores: { tsunenokatachi: 3 } },
      { id: 'shomin_1b', text: '商いの話で、自然と人の輪の中心にいる', scores: { akindo: 2, kusuriya: 1 } },
      { id: 'shomin_1c', text: '物静かで、多くを語らない', scores: { kanja: 2, shikaku: 1 } },
      { id: 'shomin_1d', text: '手品や芸で、人目を引きつける', scores: { hokashi: 2, sarugakushi: 1 } },
    ],
  },
  {
    id: 'shomin_2',
    text: 'お前が得意なのは?',
    choices: [
      { id: 'shomin_2a', text: '何者でもない顔で、居続けること', scores: { tsunenokatachi: 3 } },
      { id: 'shomin_2b', text: '効能を説き、薬を売り歩くこと', scores: { kusuriya: 2, akindo: 1 } },
      { id: 'shomin_2c', text: '気配を殺し、一息で事を成すこと', scores: { shikaku: 2, kanja: 1 } },
      { id: 'shomin_2d', text: '別人に成りきり、演じきること', scores: { sarugakushi: 2, hokashi: 1 } },
    ],
  },
  {
    id: 'shomin_3',
    text: '人からどう見られたい?',
    choices: [
      { id: 'shomin_3a', text: '特に何とも思われない、当たり前の者として', scores: { tsunenokatachi: 3 } },
      { id: 'shomin_3b', text: '良い品と良い話をもたらす者として', scores: { akindo: 2, kusuriya: 1 } },
      { id: 'shomin_3c', text: '何を考えているか分からない者として', scores: { kanja: 2, shikaku: 1 } },
      { id: 'shomin_3d', text: '笑いと驚きを届ける者として', scores: { hokashi: 2, sarugakushi: 1 } },
    ],
  },
]

export const BRANCH_QUESTIONS = {
  buke: BUKE_QUESTIONS,
  jisha: JISHA_QUESTIONS,
  shomin: SHOMIN_QUESTIONS,
}

export const COMMON_COUNT = COMMON_QUESTIONS.length
export const BRANCH_COUNT = 3
export const TOTAL_QUESTIONS = COMMON_COUNT + BRANCH_COUNT
