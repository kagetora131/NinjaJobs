/**
 * 共通7問。「武家系/寺社系/庶民」の3分類を内部判定する(ユーザーには見せない)。
 * 「忍者タイプ診断_新ロジック仕様書」4章に基づき、忍者用語(任務・潜入・
 * 忍び込む等)を排し、一般的な職業適性診断風の文言にしてある。
 *
 * choices[].scores は { buke?, jisha?, shomin? } の3キーのみ持つ
 * (加点先の分類名。個々の値は+1/+2)。一部の選択肢はさらに shakou/kamoku
 * という裏スコアも持つ(数値、庶民に分岐した場合のみ最終判定で使用。
 * 6章・scoring.js参照)。
 *
 * textEn/choices[].textEn は英語版の文言(「忍者タイプ診断アプリ:英語版仕様書」
 * 準拠)。日本語版のtext/内部スコアは変更していない。英語版でも内部分類名
 * (buke/jisha/shomin)は画面に一切出さない方針は変わらないため、英訳も
 * スコアの意味を説明する言い回しにはしていない。
 */
export const COMMON_QUESTIONS = [
  {
    id: 'c1',
    text: '新しい仕事を任された。まず何をする?',
    textEn: "You've been given a new task at work. What do you do first?",
    choices: [
      {
        id: 'c1a',
        text: 'まず資料や過去の事例を調べ、確実な方法を考える',
        textEn: 'First, look into records and past cases to find a reliable approach.',
        scores: { buke: 2 },
      },
      {
        id: 'c1b',
        text: '心を落ち着け、自分の調子を整えてから取りかかる',
        textEn: 'Calm your mind and get yourself in the right state before starting.',
        scores: { jisha: 2 },
      },
      {
        id: 'c1c',
        text: '周囲の人に話を聞き、必要な情報を集める',
        textEn: 'Ask around and gather the information you need from others.',
        scores: { shomin: 2 },
        shakou: 1,
      },
      {
        id: 'c1d',
        text: '必要になりそうな物や手順を、先に整えておく',
        textEn: "Prepare the tools and steps you'll likely need, ahead of time.",
        scores: { buke: 1, shomin: 1 },
      },
    ],
  },
  {
    id: 'c2',
    text: '旅先で道に迷ったら、どうする?',
    textEn: 'You get lost while traveling. What do you do?',
    choices: [
      {
        id: 'c2a',
        text: '地図や案内を確認し、確実な道を探す',
        textEn: 'Check a map or signpost to find a reliable route.',
        scores: { buke: 2 },
      },
      {
        id: 'c2b',
        text: 'いったん立ち止まり、焦らず周囲の状況を見直す',
        textEn: 'Stop for a moment and calmly reassess your surroundings.',
        scores: { jisha: 2 },
      },
      {
        id: 'c2c',
        text: '近くの人に声をかけ、道を教えてもらう',
        textEn: 'Ask someone nearby to point you in the right direction.',
        scores: { shomin: 2 },
        shakou: 1,
      },
      {
        id: 'c2d',
        text: '周囲をよく観察し、自分で判断できる材料を集める',
        textEn: 'Observe your surroundings closely to gather clues you can judge from yourself.',
        scores: { buke: 1, shomin: 1 },
        kamoku: 1,
      },
    ],
  },
  {
    id: 'c3',
    text: '初対面の相手とは、どのように接する?',
    textEn: "How do you approach someone you're meeting for the first time?",
    choices: [
      {
        id: 'c3a',
        text: '礼儀を大切にし、知識や誠実さで信頼を得る',
        textEn: 'Value courtesy, earning trust through knowledge and sincerity.',
        scores: { buke: 2 },
      },
      {
        id: 'c3b',
        text: '必要以上に語らず、相手と静かな距離を保つ',
        textEn: 'Speak little, keeping a calm distance from the other person.',
        scores: { jisha: 2 },
      },
      {
        id: 'c3c',
        text: '気軽に話しかけ、自然に打ち解ける',
        textEn: 'Strike up an easy conversation and open up naturally.',
        scores: { shomin: 2 },
        shakou: 1,
      },
      {
        id: 'c3d',
        text: '相手の表情や様子をよく見てから、接し方を決める',
        textEn: 'Watch their expression and manner closely before deciding how to approach them.',
        scores: { buke: 1, shomin: 1 },
        kamoku: 1,
      },
    ],
  },
  {
    id: 'c4',
    text: '困っている人を見かけたら、どうする?',
    textEn: 'You see someone in trouble. What do you do?',
    choices: [
      {
        id: 'c4a',
        text: '状況を整理し、自分にできる現実的な助け方を考える',
        textEn: 'Assess the situation and think of a realistic way you can help.',
        scores: { buke: 2 },
      },
      {
        id: 'c4b',
        text: 'まず相手の気持ちを落ち着かせ、安心できるようにする',
        textEn: 'First, help them calm down so they feel safe.',
        scores: { jisha: 2 },
      },
      {
        id: 'c4c',
        text: '自分から声をかけ、できることがあれば手を貸す',
        textEn: "Approach them yourself and lend a hand if there's anything you can do.",
        scores: { shomin: 2 },
        shakou: 1,
      },
      {
        id: 'c4d',
        text: '直接手を出す前に、何が必要なのかを見極める',
        textEn: "Before stepping in, figure out exactly what's needed.",
        scores: { buke: 1, shomin: 1 },
        kamoku: 1,
      },
    ],
  },
  {
    id: 'c5',
    text: '贈り物を選ぶなら、どうする?',
    textEn: 'If you were choosing a gift, how would you go about it?',
    choices: [
      {
        id: 'c5a',
        text: '実用的で質の良いものを、じっくり吟味する',
        textEn: 'Carefully consider something practical and well-made.',
        scores: { buke: 2 },
      },
      {
        id: 'c5b',
        text: '相手の無事や幸せを願えるものを選ぶ',
        textEn: "Choose something that wishes for the other person's safety and happiness.",
        scores: { jisha: 2 },
      },
      {
        id: 'c5c',
        text: '相手が喜ぶ姿を想像しながら、楽しんで選ぶ',
        textEn: 'Imagine their delighted reaction and enjoy the choosing.',
        scores: { shomin: 2 },
        shakou: 1,
      },
      {
        id: 'c5d',
        text: '値段と価値の釣り合いを考え、長く使えるものを選ぶ',
        textEn: 'Weigh price against value, choosing something built to last.',
        scores: { shomin: 1, buke: 1 },
      },
    ],
  },
  {
    id: 'c6',
    text: '思いがけないトラブルが起きた。どうする?',
    textEn: 'An unexpected problem occurs. What do you do?',
    choices: [
      {
        id: 'c6a',
        text: '状況を整理し、筋道を立てて対処する',
        textEn: 'Sort out the situation and deal with it logically, step by step.',
        scores: { buke: 2 },
      },
      {
        id: 'c6b',
        text: '心を乱さず、まず落ち着いてから動く',
        textEn: 'Stay calm and collect yourself before acting.',
        scores: { jisha: 2 },
      },
      {
        id: 'c6c',
        text: '周囲と相談しながら、その場をうまく収める',
        textEn: 'Talk it over with those around you and smooth things over.',
        scores: { shomin: 2 },
        shakou: 1,
      },
      {
        id: 'c6d',
        text: 'その場で最も安全な方法を、素早く選ぶ',
        textEn: 'Quickly choose whatever is safest in the moment.',
        scores: { jisha: 1, shomin: 1 },
        kamoku: 1,
      },
    ],
  },
  {
    id: 'c7',
    text: 'あなたが「仕事のできる人」だと思うのは、どんな人?',
    textEn: "Who do you think of as 'good at their job'?",
    choices: [
      {
        id: 'c7a',
        text: '知識や技術を着実に積み重ねている人',
        textEn: 'Someone who steadily builds up knowledge and skill.',
        scores: { buke: 2 },
      },
      {
        id: 'c7b',
        text: 'どんな状況でも、自分を律することのできる人',
        textEn: 'Someone who can keep their composure no matter the situation.',
        scores: { jisha: 2 },
      },
      {
        id: 'c7c',
        text: '周囲とうまく関係を築き、場をまとめられる人',
        textEn: 'Someone who builds good relationships and brings people together.',
        scores: { shomin: 2 },
        shakou: 1,
      },
      {
        id: 'c7d',
        text: '先回りして準備し、状況に応じて動ける人',
        textEn: 'Someone who prepares ahead of time and adapts as things unfold.',
        scores: { buke: 1, shomin: 1 },
      },
    ],
  },
]

/**
 * 武家系(武士/虚無僧/薬師)の分岐後3問。武士は「服部半蔵のように、時間を
 * かけて信頼を勝ち取り武士として認められた者」というコンセプト(刀や兜など
 * 武士を直接示唆する表現は避け、"同じ相手・同じ関係にじっくり向き合う一貫性"
 * を識別軸にする)。4択に統一し、Dは虚無僧・薬師どちらにも寄らない
 * 「器用貧乏」枠(scores: { komuso: 1, kusushi: 1 })。武士は+1、虚無僧・薬師は
 * +2という配点差により、3問合計で虚無僧・薬師(満点6)が武士(満点3)より自然に
 * 高得点になりやすく、武士が低配点だけで自然にレア化する(5章参照)。
 */
export const BUKE_QUESTIONS = [
  {
    id: 'buke_1',
    text: '忍びとして潜入するなら、どのように?',
    textEn: 'If you were to infiltrate as a shinobi, how would you do it?',
    choices: [
      {
        id: 'buke_1a',
        text: '何度も通い、時間をかけて信頼を得てから中に入る',
        textEn: 'Visit again and again, earning trust over time before stepping inside.',
        scores: { bushi: 1 },
      },
      {
        id: 'buke_1b',
        text: '物静かに、心を落ち着けたまま歩み入る',
        textEn: 'Walk in quietly, keeping your heart calm and still.',
        scores: { komuso: 2 },
      },
      {
        id: 'buke_1c',
        text: '相手の様子を見極めながら、慎重に近づく',
        textEn: 'Approach carefully, reading the other person as you go.',
        scores: { kusushi: 2 },
      },
      {
        id: 'buke_1d',
        text: 'その場の状況に応じて、やり方を柔軟に変える',
        textEn: 'Adapt your approach flexibly to whatever the moment calls for.',
        scores: { komuso: 1, kusushi: 1 },
      },
    ],
  },
  {
    id: 'buke_2',
    text: '休みの日をどう過ごしますか?',
    textEn: 'How do you spend your days off?',
    choices: [
      {
        id: 'buke_2a',
        text: '決まった相手と、じっくり関係を築く時間に使う',
        textEn: 'Spend the time deepening a relationship with someone you already know well.',
        scores: { bushi: 1 },
      },
      {
        id: 'buke_2b',
        text: '静かに過ごし、心を整える時間に充てる',
        textEn: 'Spend it quietly, settling your mind.',
        scores: { komuso: 2 },
      },
      {
        id: 'buke_2c',
        text: '本を読んだり、調べ物をして過ごす',
        textEn: 'Spend it reading or looking into things.',
        scores: { kusushi: 2 },
      },
      {
        id: 'buke_2d',
        text: 'その日の気分で、過ごし方を変える',
        textEn: 'However the mood takes you that day.',
        scores: { komuso: 1, kusushi: 1 },
      },
    ],
  },
  {
    id: 'buke_3',
    text: '空いた時間に何を究めますか?',
    textEn: 'What do you devote your spare time to mastering?',
    choices: [
      {
        id: 'buke_3a',
        text: '人との信頼関係を、じっくり時間をかけて築くこと',
        textEn: 'Building trust with others, slowly and patiently, over time.',
        scores: { bushi: 1 },
      },
      {
        id: 'buke_3b',
        text: '己の内面や、人としての在り方',
        textEn: 'Your own inner self, and what it means to be a person.',
        scores: { komuso: 2 },
      },
      {
        id: 'buke_3c',
        text: '知識や、物事の理屈',
        textEn: 'Knowledge, and the reasoning behind things.',
        scores: { kusushi: 2 },
      },
      {
        id: 'buke_3d',
        text: 'その時々で、興味のあることを幅広く',
        textEn: 'Whatever happens to interest you at the time, broadly.',
        scores: { komuso: 1, kusushi: 1 },
      },
    ],
  },
]

/**
 * 寺社系(出家/山伏)の分岐後3問。七方出の変装ネタ(出家=托鉢僧、山伏=修験者)と、
 * 職業カードの視覚要素(数珠・袈裟、法螺貝・山)を反映した文言。
 */
export const JISHA_QUESTIONS = [
  {
    id: 'jisha_1',
    text: '忍びとして潜入するなら、どのように?',
    textEn: 'If you were to infiltrate as a shinobi, how would you do it?',
    choices: [
      {
        id: 'jisha_1a',
        text: '托鉢の僧を装い、里の中に紛れ込む',
        textEn: 'Disguise yourself as a begging monk and slip into the village.',
        scores: { shukke: 2 },
      },
      {
        id: 'jisha_1b',
        text: '経を唱えながら、寺社の一員として入り込む',
        textEn: "Chant sutras and enter as one of the temple's own.",
        scores: { shukke: 2 },
      },
      {
        id: 'jisha_1c',
        text: '山伏の姿で、堂々と山を越えて訪れる',
        textEn: 'Come openly over the mountain, dressed as a yamabushi.',
        scores: { yamabushi: 2 },
      },
      {
        id: 'jisha_1d',
        text: '法螺貝を吹き鳴らしながら、修行の一団として入り込む',
        textEn: 'Blow the conch-shell horn and enter as part of a band of ascetics.',
        scores: { yamabushi: 2 },
      },
    ],
  },
  {
    id: 'jisha_2',
    text: '心を乱されそうなとき、どうする?',
    textEn: 'When your mind is about to be shaken, what do you do?',
    choices: [
      {
        id: 'jisha_2a',
        text: '静かに読経し、自分の心と向き合う',
        textEn: 'Quietly chant a sutra and face your own heart.',
        scores: { shukke: 2 },
      },
      {
        id: 'jisha_2b',
        text: '人々の苦しみと、己の役目を思い返す',
        textEn: 'Recall the suffering of others, and your own purpose.',
        scores: { shukke: 2 },
      },
      {
        id: 'jisha_2c',
        text: '法螺貝を吹き鳴らし、呼吸を整える',
        textEn: 'Blow the conch-shell horn and steady your breathing.',
        scores: { yamabushi: 2 },
      },
      {
        id: 'jisha_2d',
        text: 'あえて厳しい山に分け入り、自分を奮い立たせる',
        textEn: 'Deliberately head into the harsh mountains to spur yourself on.',
        scores: { yamabushi: 2 },
      },
    ],
  },
  {
    id: 'jisha_3',
    text: '忍びとして「強さ」を示すなら?',
    textEn: 'If you were to show "strength" as a shinobi, how would you do it?',
    choices: [
      {
        id: 'jisha_3a',
        text: '数珠を手に、人のために己を律して動く',
        textEn: 'Prayer beads in hand, discipline yourself and act for others.',
        scores: { shukke: 2 },
      },
      {
        id: 'jisha_3b',
        text: '静かな読経で、欲や迷いに振り回されぬ心を示す',
        textEn: 'Show, through quiet chanting, a heart unmoved by desire or doubt.',
        scores: { shukke: 2 },
      },
      {
        id: 'jisha_3c',
        text: '法螺貝を吹き鳴らし、苦しい山道でも前に進み続ける',
        textEn: 'Blow the conch-shell horn and keep pressing on, even up the hardest mountain paths.',
        scores: { yamabushi: 2 },
      },
      {
        id: 'jisha_3d',
        text: '険しい岩場を歩き通し、鍛え抜いた身体で示す',
        textEn: 'Walk the sheerest cliffs to the end, showing a body forged through training.',
        scores: { yamabushi: 2 },
      },
    ],
  },
]

/**
 * 庶民(常の形/商人/薬屋/間者/刺客/放下師/猿楽師)の分岐後3問。
 * クラスターによる事前分岐は行わず、7タイプを直接フラット得点制で判定する
 * (6章参照)。常の形は3問すべての選択肢Aとして毎回登場し、他の6タイプは
 * B/C/Dに振り分けられる。
 *
 * 問1・問2は各ペア(商人/薬屋、間者/刺客、放下師/猿楽師)のどちらか一方が
 * 「主+2」・もう一方が「従+1」の配点だが、問3だけは主従を設けず両方に
 * +1ずつの均等配点にしてある(バランス修正。以前は問1・問2どちらも
 * 商人・間者・放下師が「主+2」を2回、薬屋・刺客・猿楽師が1回しか得られない
 * 構造だったため、総当たり検証で薬屋(1.14%)・刺客(0.33%)が武家系の
 * レアタイプである武士(1.4474%)より出現しにくいという逆転が発覚した。
 * 問3を均等配点にしたことで各ペアの3問合計が4点ずつに揃い、この逆転を解消)。
 *
 * 問3のCは、間者・刺客にもかかわらず一見「信仰心」を思わせる表現
 * (精神統一する)にすることで、寺社系の設問と紛らわしくし、選択肢から
 * 結果を逆算しにくくしている。
 */
export const SHOMIN_QUESTIONS = [
  {
    id: 'shomin_1',
    text: '忍びとして潜入するなら、どのように?',
    textEn: 'If you were to infiltrate as a shinobi, how would you do it?',
    choices: [
      {
        id: 'shomin_1a',
        text: '一般庶民になりきって、紛れ込む',
        textEn: 'Pass yourself off completely as an ordinary commoner and slip in.',
        scores: { tsunenokatachi: 3 },
      },
      {
        id: 'shomin_1b',
        text: '商いを口実に、堂々と入り込む',
        textEn: 'Use trade as your excuse, and walk in openly.',
        scores: { akindo: 2, kusuriya: 1 },
      },
      {
        id: 'shomin_1c',
        text: '誰にも気づかれず、静かに近づく',
        textEn: 'Approach quietly, unnoticed by anyone.',
        scores: { kanja: 2, shikaku: 1 },
      },
      {
        id: 'shomin_1d',
        text: '興行の許可を得て、人前で技を披露しながら近づく',
        textEn: 'Get permission to perform, and approach while showing off your skill in front of everyone.',
        scores: { hokashi: 2, sarugakushi: 1 },
      },
    ],
  },
  {
    id: 'shomin_2',
    text: '忍びとして、お前が得意なのは?',
    textEn: 'As a shinobi, what are you good at?',
    choices: [
      {
        id: 'shomin_2a',
        text: '何者でもない顔で、居続けること',
        textEn: 'Simply staying as a face that belongs to no one in particular.',
        scores: { tsunenokatachi: 3 },
      },
      {
        id: 'shomin_2b',
        text: '薬箱を開き、効能を説いて売り歩くこと',
        textEn: 'Opening your medicine chest, talking up its remedies, and peddling them.',
        scores: { kusuriya: 2, akindo: 1 },
      },
      {
        id: 'shomin_2c',
        text: '気配を断ち、一息で事を成すこと',
        textEn: 'Erasing your presence and finishing the job in a single breath.',
        scores: { shikaku: 2, kanja: 1 },
      },
      {
        id: 'shomin_2d',
        text: '面をつけ、別人に成りきり演じきること',
        textEn: 'Putting on a mask, becoming someone else, and playing the part all the way through.',
        scores: { sarugakushi: 2, hokashi: 1 },
      },
    ],
  },
  {
    id: 'shomin_3',
    text: '空いた時間に何を究めますか?',
    textEn: 'What do you devote your spare time to mastering?',
    choices: [
      {
        id: 'shomin_3a',
        text: '特に何かを究めようとは思わない',
        textEn: "Nothing in particular — you don't feel the need to master anything.",
        scores: { tsunenokatachi: 3 },
      },
      {
        id: 'shomin_3b',
        text: '物欲を高められるよう、豆知識を増やす',
        textEn: 'Bits of trivia that make people want things more.',
        scores: { akindo: 1, kusuriya: 1 },
      },
      {
        id: 'shomin_3c',
        text: '精神統一する',
        textEn: 'Focusing and settling your mind.',
        scores: { kanja: 1, shikaku: 1 },
      },
      {
        id: 'shomin_3d',
        text: '人を惹きつける技や、表現の仕方',
        textEn: 'Skills and ways of expressing yourself that draw people in.',
        scores: { hokashi: 1, sarugakushi: 1 },
      },
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
