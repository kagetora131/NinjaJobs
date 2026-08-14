// 10問・4択。選択肢ごとに { id: 加点 } の形でスコアを持つ(主タイプ+2点/副タイプ+1点)。
export const QUESTIONS = [
  {
    id: 'q1',
    text: '任務を与えられた。まず何をする?',
    choices: [
      { id: 'q1a', text: '物陰から静かに状況を観察する', scores: { komuso: 2, kanja: 1 } },
      { id: 'q1b', text: '明るく話しかけて情報を集める', scores: { akindo: 2, sarugakushi: 1 } },
      { id: 'q1c', text: 'とにかく行動し、正面から突破口を探す', scores: { bushi: 2, shikaku: 1 } },
      { id: 'q1d', text: '仲間の安全を優先し、計画を練る', scores: { kusushi: 2, shukke: 1 } },
    ],
  },
  {
    id: 'q2',
    text: '潜入先で怪しまれそうになったら?',
    choices: [
      { id: 'q2a', text: '気配を消し、その場に溶け込む', scores: { tsunenokatachi: 2, komuso: 1 } },
      { id: 'q2b', text: 'うまく笑って誤魔化す', scores: { sarugakushi: 2, akindo: 1 } },
      { id: 'q2c', text: '堂々と名乗り、正当な理由を主張する', scores: { bushi: 2, shukke: 1 } },
      { id: 'q2d', text: '素早くその場を離れ、姿をくらます', scores: { shikaku: 2, kanja: 1 } },
    ],
  },
  {
    id: 'q3',
    text: '仲間が窮地に陥った。どうする?',
    choices: [
      { id: 'q3a', text: '迷わず助けに向かう', scores: { bushi: 2, yamabushi: 1 } },
      { id: 'q3b', text: '状況を分析し、最善策を考える', scores: { kusushi: 2, kanja: 1 } },
      { id: 'q3c', text: '明るく振る舞い、場を和ませる', scores: { hokashi: 2, sarugakushi: 1 } },
      { id: 'q3d', text: 'こっそり裏から手を回す', scores: { kanja: 2, akindo: 1 } },
    ],
  },
  {
    id: 'q4',
    text: '休息日の過ごし方は?',
    choices: [
      { id: 'q4a', text: '一人静かに瞑想・修行する', scores: { shukke: 2, yamabushi: 1 } },
      { id: 'q4b', text: '街に出て人と交流し、噂話を集める', scores: { akindo: 2, sarugakushi: 1 } },
      { id: 'q4c', text: '薬草を摘み、体調を整える', scores: { kusushi: 2, kusuriya: 1 } },
      { id: 'q4d', text: '芸や新しい技を磨く', scores: { hokashi: 2, sarugakushi: 1 } },
    ],
  },
  {
    id: 'q5',
    text: '苦手なことは?',
    choices: [
      { id: 'q5a', text: '大勢の前で目立つこと', scores: { tsunenokatachi: 2, komuso: 1 } },
      { id: 'q5b', text: 'じっと待つこと', scores: { hokashi: 2, bushi: 1 } },
      { id: 'q5c', text: '人を騙すこと', scores: { bushi: 2, shukke: 1 } },
      { id: 'q5d', text: '損得を抜きにして動くこと', scores: { kusuriya: 2, akindo: 1 } },
    ],
  },
  {
    id: 'q6',
    text: '敵の懐へ忍び込む。どうやって入り込む?',
    choices: [
      { id: 'q6a', text: '物売りを装い、荷を担いで堂々と門をくぐる', scores: { akindo: 2, tsunenokatachi: 1 } },
      { id: 'q6b', text: '芸を披露して人目を引きつけ、その隙に紛れ込む', scores: { hokashi: 2, sarugakushi: 1 } },
      { id: 'q6c', text: '病人や怪我人の手当てを買って出て、内へ入る', scores: { kusushi: 2, kusuriya: 1 } },
      { id: 'q6d', text: '夜陰に紛れ、誰にも気づかれぬまま忍び込む', scores: { shikaku: 2 } },
    ],
  },
  {
    id: 'q7',
    text: '大切にしている信条は?',
    choices: [
      { id: 'q7a', text: '目的のためなら手段を選ばない', scores: { shikaku: 2, kanja: 1 } },
      { id: 'q7b', text: '義を貫き、正々堂々と生きる', scores: { bushi: 2 } },
      { id: 'q7c', text: '執着を捨て、心を平らかに保つ', scores: { shukke: 2, komuso: 1 } },
      { id: 'q7d', text: '人との縁と信頼を大事にする', scores: { akindo: 2, kusushi: 1 } },
    ],
  },
  {
    id: 'q8',
    text: '初対面の人への態度は?',
    choices: [
      { id: 'q8a', text: '様子を見て、多くを語らない', scores: { tsunenokatachi: 2, komuso: 1 } },
      { id: 'q8b', text: '愛想よく話しかける', scores: { akindo: 2, hokashi: 1 } },
      { id: 'q8c', text: '礼儀正しく丁寧に接する', scores: { shukke: 2, bushi: 1 } },
      { id: 'q8d', text: '相手の本音を注意深く見極める', scores: { kanja: 2, kusushi: 1 } },
    ],
  },
  {
    id: 'q9',
    text: '山や自然の中に入った時の行動は?',
    choices: [
      { id: 'q9a', text: '心身を鍛える修行の場にする', scores: { yamabushi: 2 } },
      { id: 'q9b', text: '薬草や有用な植物を探す', scores: { kusuriya: 2, kusushi: 1 } },
      { id: 'q9c', text: '景色を楽しみ、のんびり進む', scores: { tsunenokatachi: 2, shukke: 1 } },
      { id: 'q9d', text: '周囲を警戒し、隠れ場所を確認する', scores: { kanja: 2, shikaku: 1 } },
    ],
  },
  {
    id: 'q10',
    text: '最後に、自分を一言で表すなら?',
    choices: [
      { id: 'q10a', text: '「静」―― 気配を消す', scores: { komuso: 2, tsunenokatachi: 1 } },
      { id: 'q10b', text: '「技」―― 技巧を極める', scores: { hokashi: 2, sarugakushi: 1 } },
      { id: 'q10c', text: '「誠」―― 誠実に向き合う', scores: { bushi: 2, shukke: 1 } },
      { id: 'q10d', text: '「智」―― 知略で勝つ', scores: { kanja: 2, kusushi: 1 } },
    ],
  },
]
