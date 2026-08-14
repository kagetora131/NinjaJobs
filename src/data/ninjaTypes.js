import komuso from '../assets/characters/komuso.webp'
import shukke from '../assets/characters/shukke.webp'
import yamabushi from '../assets/characters/yamabushi.webp'
import akindo from '../assets/characters/akindo.webp'
import hokashi from '../assets/characters/hokashi.webp'
import sarugakushi from '../assets/characters/sarugakushi.webp'
import tsunenokatachi from '../assets/characters/tsunenokatachi.webp'
import shikaku from '../assets/characters/shikaku.webp'
import kanja from '../assets/characters/kanja.webp'
import bushi from '../assets/characters/bushi.webp'
import kusuriya from '../assets/characters/kusuriya.webp'
import kusushi from '../assets/characters/kusushi.webp'

// 12タイプの定義。配列の並び順は同点時の優先順位(先勝ち)としても使う。
export const NINJA_TYPES = [
  {
    id: 'komuso',
    name: '虚無僧',
    nameEn: 'Komuso',
    keyword: '隠遁・静寂・内省',
    description:
      '深編笠の内に己を隠し、余人の喧騒から距離を置く者。感情を面に出さず、ただ静かに物事の本質を見つめる。一人の時間こそが刃を研ぐ時間だと知っている。',
    accentColor: '#5C7188',
    imagePath: komuso,
  },
  {
    id: 'shukke',
    name: '出家',
    nameEn: 'Shukke',
    keyword: '悟り・無欲・奉仕',
    description:
      '欲も執着も脱ぎ捨て、ただ人のために動くことに喜びを見出す者。争いを好まぬが、その静けさは覚悟の裏返しでもある。見返りを求めぬ強さこそが、この者の忍術。',
    accentColor: '#C9821F',
    imagePath: shukke,
  },
  {
    id: 'yamabushi',
    name: '山伏',
    nameEn: 'Yamabushi',
    keyword: '修行・忍耐・自然',
    description:
      '山野を駆け、己の肉体と精神を鍛え上げることに迷いはない。困難は避けるものではなく、越えるためにある。法螺の音とともに、いかなる苦行にも背を向けぬ強靭さを持つ。',
    accentColor: '#5F7A52',
    imagePath: yamabushi,
  },
  {
    id: 'akindo',
    name: '商人',
    nameEn: 'Akindo',
    keyword: '社交・情報通・損得',
    description:
      '算盤片手に、人の懐にも心にも巧みに入り込む。交渉と駆け引きこそが得意の舞台であり、どんな相手からも欲しいものを引き出す弁舌を持つ。忍びにして、最も世渡り上手な男。',
    accentColor: '#A8672E',
    imagePath: akindo,
  },
  {
    id: 'hokashi',
    name: '放下師',
    nameEn: 'Hokashi',
    keyword: '芸・機転・身軽さ',
    description:
      '祭りの喧騒に紛れ、軽業と機転で場をさらう。目立つことを恐れぬどころか、それを武器に変える。誰よりも身軽に、誰よりも鮮やかに、窮地さえも見世物に変えてしまう。',
    accentColor: '#D9622B',
    imagePath: hokashi,
  },
  {
    id: 'sarugakushi',
    name: '猿楽師',
    nameEn: 'Sarugakushi',
    keyword: '二面性・演技・仮面',
    description:
      '面を替えるたびに、まったく別の人間として振る舞う。喜怒哀楽、悪鬼にも貴人にも成り代われるその演技力は、忍びの変装術の粋。素顔を見せる相手など、そう多くはない。',
    accentColor: '#5B4A78',
    imagePath: sarugakushi,
  },
  {
    id: 'tsunenokatachi',
    name: '常の形',
    nameEn: 'Tsunenokatachi',
    keyword: '擬態・堅実・目立たなさ',
    description:
      '百姓のふりをして畑を耕し、旅人のふりをして道を行く。普段は誰の記憶にも残らぬほど平凡に振る舞い、いざという時にのみ牙を剥く。最も見破りにくい忍びの姿。',
    accentColor: '#A68A5B',
    imagePath: tsunenokatachi,
  },
  {
    id: 'shikaku',
    name: '刺客',
    nameEn: 'Shikaku',
    keyword: '冷徹・単独・目的遂行',
    description:
      '月明かりの下、迷いなく標的へ肉薄する。感情よりも目的を優先し、成すべきことを成したなら振り返らない。単独行動を苦にせぬ、冷徹にして確実な忍びの刃。',
    accentColor: '#23262F',
    imagePath: shikaku,
  },
  {
    id: 'kanja',
    name: '間者',
    nameEn: 'Kanja',
    keyword: '情報収集・洞察・裏工作',
    description:
      '敵地の闇に潜み、噂と書状の裏に隠された真実を拾い上げる。事を構える前に、事の全てを知り尽くしておく慎重さがある。表舞台には立たず、しかし全てを動かす者。',
    accentColor: '#3D4258',
    imagePath: kanja,
  },
  {
    id: 'bushi',
    name: '武士',
    nameEn: 'Bushi',
    keyword: '正義・名誉・正々堂々',
    description:
      '搦め手より正面を選び、名を名乗って刃を交える。忍びでありながら、義と筋を通すことに誇りを置く。姑息な手段を嫌い、正々堂々を貫く不器用なまでの一本気。',
    accentColor: '#7A2530',
    imagePath: bushi,
  },
  {
    id: 'kusuriya',
    name: '薬屋',
    nameEn: 'Kusuriya',
    keyword: '実利・商才・駆け引き',
    description:
      '毒にも薬にもなる知識を天秤にかけ、常にリスクと実利を見極める。人の弱みにも足元にも目端が利き、抜け目のない商才で立ち回る。甘い笑みの裏に鋭い算段を隠す者。',
    accentColor: '#8A7A3D',
    imagePath: kusuriya,
  },
  {
    id: 'kusushi',
    name: '薬師',
    nameEn: 'Kusushi',
    keyword: '冷静・分析・専門知識',
    description:
      '薬箱を抱え、乱れた状況も冷静に分析して最善の一手を導く。己の武勇を誇るより、知識と技で仲間を支えることに存在意義を見出す。忍び集団の頭脳にして生命線。',
    accentColor: '#565269',
    imagePath: kusushi,
  },
]

export const NINJA_TYPE_MAP = Object.fromEntries(
  NINJA_TYPES.map((type) => [type.id, type]),
)
