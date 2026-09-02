/**
 * 共通6問。まずどの系統かを判定する。
 * scores は { 主系統: 2, 副系統: 1 }。配点は総当たりで出現率を測りながら調整済み(詳細はCLAUDE.md 7章)。
 * excludes は任意。「この選択をした場合、系統内の最終タイプ候補から除外するタイプID」の配列。
 * 系統別3問の選択肢にも同じ形で付けられる(汎用的な仕組み。詳細はCLAUDE.md 7章「除外フラグ」)。
 */
export const COMMON_QUESTIONS = [
  {
    id: 'c1',
    text: '任務を与えられた。まず何をする?',
    choices: [
      {
        id: 'c1a',
        text: '気配を殺し、遠間から標的を見定める',
        scores: { butou: 2, kyudo: 1 },
        // 正面から堂々と立ち合う「武士」とは信条が相容れないため、武闘系に
        // 決まった場合でも武士だけは最終候補から外す(修正依頼書「診断ロジック除外フラグ」)。
        excludes: ['bushi'],
      },
      { id: 'c1b', text: '人に紛れ、世間話から探りを入れる', scores: { shomin: 2, geino: 1 } },
      { id: 'c1c', text: 'まず心を静め、己を整える', scores: { kyudo: 2 } },
      { id: 'c1d', text: '皆の身体と備えを検める', scores: { iryo: 2 } },
    ],
  },
  {
    id: 'c2',
    text: '潜入先で怪しまれそうになった。どうする?',
    choices: [
      { id: 'c2a', text: '当たり前の顔で、その場の景色に成りきる', scores: { shomin: 2, kyudo: 1 } },
      { id: 'c2b', text: '大袈裟に笑い、芸を見せて気を逸らす', scores: { geino: 2 } },
      { id: 'c2c', text: '堂々と名乗り、正面から相対する', scores: { butou: 2 } },
      { id: 'c2d', text: '手当てを申し出て、役に立つ者として振る舞う', scores: { iryo: 2 } },
    ],
  },
  {
    id: 'c3',
    text: '休息の日、何をして過ごす?',
    choices: [
      { id: 'c3a', text: '山に入り、身を清めて鍛える', scores: { kyudo: 2 } },
      { id: 'c3b', text: '街へ出て、人と交わり噂を集める', scores: { shomin: 2, geino: 1 } },
      { id: 'c3c', text: '新しい芸や技を磨く', scores: { geino: 2 } },
      { id: 'c3d', text: '薬草を摘み、調合を試す', scores: { iryo: 2 } },
    ],
  },
  {
    id: 'c4',
    text: '大切にしている信条は?',
    choices: [
      { id: 'c4a', text: '己を律し、迷いを断つこと', scores: { kyudo: 2 } },
      { id: 'c4b', text: '果たすと決めたことを、必ず果たすこと', scores: { butou: 2 } },
      { id: 'c4c', text: '人を楽しませ、場を明るくすること', scores: { geino: 2, shomin: 1 } },
      { id: 'c4d', text: '実を取り、暮らしを立てること', scores: { shomin: 2, iryo: 1 } },
    ],
  },
  {
    id: 'c5',
    text: '初対面の相手には、どう接する?',
    choices: [
      { id: 'c5a', text: '多くを語らず、まず己を保つ', scores: { kyudo: 2 } },
      { id: 'c5b', text: '愛想よく、すぐに打ち解ける', scores: { shomin: 2, geino: 1 } },
      { id: 'c5c', text: '隙がないか、間合いを測る', scores: { butou: 2 } },
    ],
  },
  {
    id: 'c6',
    text: '仲間が窮地に陥った。どうする?',
    choices: [
      { id: 'c6a', text: '我が身を顧みず、助けに向かう', scores: { butou: 2, kyudo: 1 } },
      { id: 'c6b', text: '手当てをし、まず命を繋ぐ', scores: { iryo: 2 } },
      { id: 'c6c', text: '場を茶化して空気を変え、隙を作る', scores: { geino: 2 } },
      { id: 'c6d', text: '損得を計り、最も確実な手を打つ', scores: { shomin: 2, iryo: 1 } },
    ],
  },
]

/**
 * 系統が決まった後に出す専用3問。
 * choices の並びは SYSTEMS[].typeIds と同じ順(typeIndex として使う)。
 */
export const BRANCH_QUESTIONS = {
  // 虚無僧 / 出家 / 山伏
  kyudo: [
    {
      id: 'kyudo1',
      text: '修行の場に選ぶのは?',
      choices: [
        { id: 'kyudo1a', text: '人里離れた庵に、独り座す' },
        { id: 'kyudo1b', text: '市井に降り、人の中で行を積む' },
        { id: 'kyudo1c', text: '険しい峰を、己の足で歩き通す' },
      ],
    },
    {
      id: 'kyudo2',
      text: '心を鎮めるとき、頼りにするのは?',
      choices: [
        { id: 'kyudo2a', text: '一管の尺八と、深い静寂' },
        { id: 'kyudo2b', text: '経を誦し、祈りを捧げること' },
        { id: 'kyudo2c', text: '荒行と、法螺貝の響き' },
      ],
    },
    {
      id: 'kyudo3',
      text: 'お前にとって、悟りとは何だ?',
      choices: [
        { id: 'kyudo3a', text: '己の内にある、何もない場所' },
        { id: 'kyudo3b', text: '人を救う行いの中に見出すもの' },
        { id: 'kyudo3c', text: '自然と交わり、肉体で掴むもの' },
      ],
    },
  ],

  // 間者 / 刺客 / 武士
  butou: [
    {
      id: 'butou1',
      text: '標的を前にして、まず選ぶのは?',
      choices: [
        { id: 'butou1a', text: '泳がせて、背後の繋がりを辿る' },
        { id: 'butou1b', text: '気取られぬうちに、一息で断つ' },
        { id: 'butou1c', text: '名を名乗り、正面から立ち合う' },
      ],
    },
    {
      id: 'butou2',
      text: 'お前の任務が終わるのは、いつだ?',
      choices: [
        { id: 'butou2a', text: '知るべきことを、全て知った時' },
        { id: 'butou2b', text: '命じられた一事を、果たした時' },
        { id: 'butou2c', text: '己の筋を、通しきった時' },
      ],
    },
    {
      id: 'butou3',
      text: '闇の中で研ぎ澄ますのは?',
      choices: [
        { id: 'butou3a', text: '耳と眼' },
        { id: 'butou3b', text: '刃' },
        { id: 'butou3c', text: '己の心' },
      ],
    },
  ],

  // 猿楽師 / 放下師
  geino: [
    {
      id: 'geino1',
      text: '舞台で客を掴むなら、どちらだ?',
      choices: [
        { id: 'geino1a', text: '別人に成りきって魅せる' },
        { id: 'geino1b', text: '軽業と手妻で沸かせる' },
      ],
    },
    {
      id: 'geino2',
      text: 'お前の芸の本質は?',
      choices: [
        { id: 'geino2a', text: '面をつけ、心を隠すこと' },
        { id: 'geino2b', text: '身ひとつで、場を回すこと' },
      ],
    },
    {
      id: 'geino3',
      text: '素顔を見せるのは?',
      choices: [
        { id: 'geino3a', text: 'ほとんど誰にも見せぬ' },
        { id: 'geino3b', text: '隠さず、さらけ出す' },
      ],
    },
  ],

  // 薬師 / 薬屋
  iryo: [
    {
      id: 'iryo1',
      text: '薬を前にして、まず考えるのは?',
      choices: [
        { id: 'iryo1a', text: 'どう効くのか、その理' },
        { id: 'iryo1b', text: 'いくらで売れるか、その値' },
      ],
    },
    {
      id: 'iryo2',
      text: '銭のない病人が来た。どうする?',
      choices: [
        { id: 'iryo2a', text: '銭は要らぬ。まず治す' },
        { id: 'iryo2b', text: '出世払いだ。貸しにしておく' },
      ],
    },
    {
      id: 'iryo3',
      text: 'お前にとって、薬とは?',
      choices: [
        { id: 'iryo3a', text: '人を救うための術' },
        { id: 'iryo3b', text: '使いようで化ける品' },
      ],
    },
  ],

  // 常の形 / 商人
  shomin: [
    {
      id: 'shomin1',
      text: '人混みの中でのお前は?',
      choices: [
        { id: 'shomin1a', text: '誰の記憶にも残らぬ' },
        { id: 'shomin1b', text: '気づけば輪の中心にいる' },
      ],
    },
    {
      id: 'shomin2',
      text: 'お前が得意なのは?',
      choices: [
        { id: 'shomin2a', text: '何者でもない顔で、居続けること' },
        { id: 'shomin2b', text: '値を付け、話をまとめること' },
      ],
    },
    {
      id: 'shomin3',
      text: '銭について、どう思う?',
      choices: [
        { id: 'shomin3a', text: '困らぬ程度に、あればよい' },
        { id: 'shomin3b', text: '回してこそ、意味がある' },
      ],
    },
  ],
}

export const COMMON_COUNT = COMMON_QUESTIONS.length
export const BRANCH_COUNT = 3
export const TOTAL_QUESTIONS = COMMON_COUNT + BRANCH_COUNT
