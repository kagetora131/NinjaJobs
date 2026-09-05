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
//
// 英語版のフィールド(nameEn以外)について: 日本語版のname/keyword/description
// は一切変更していない(標準instruction「カード説明文には今後手を加えない」を
// 厳守)。英語版はすべて新規追加フィールドで、和風の世界観を保つため
// 「ローマ字名(nameEn) + 英語の一言添え名(epithetEn)」を併記する方式にした
// (例: 名前=Shikaku、添え名=The Assassin)。descriptionEn/keywordEnは
// 日本語のdescription/keywordを意訳したもので、直訳ではなく雰囲気を優先。
export const NINJA_TYPES = [
  {
    id: 'komuso',
    name: '虚無僧',
    nameEn: 'Komuso',
    epithetEn: 'The Hermit Monk',
    keyword: '隠遁・静寂・内省',
    keywordEn: 'Solitude · Silence · Introspection',
    description:
      '深編笠の内に己を隠し、余人の喧騒から距離を置く者。感情を面に出さず、ただ静かに物事の本質を見つめる。一人の時間こそが刃を研ぐ時間だと知っている。',
    descriptionEn:
      'He hides his face beneath a woven basket hat, keeping his distance from the clamor of others. He never lets emotion show, watching the true nature of things in silence. He knows that time spent alone is time spent sharpening the blade.',
    accentColor: '#5C7188',
    imagePath: komuso,
  },
  {
    id: 'shukke',
    name: '出家',
    nameEn: 'Shukke',
    epithetEn: 'The Renunciate',
    keyword: '悟り・無欲・奉仕',
    keywordEn: 'Enlightenment · Selflessness · Service',
    description:
      '欲も執着も脱ぎ捨て、ただ人のために動くことに喜びを見出す者。争いを好まぬが、その静けさは覚悟の裏返しでもある。見返りを求めぬ強さこそが、この者の忍術。',
    descriptionEn:
      'He has cast off both desire and attachment, finding his joy only in moving for the sake of others. He shuns conflict, though his stillness is a resolve of its own. Asking nothing in return is his true ninjutsu.',
    accentColor: '#C9821F',
    imagePath: shukke,
  },
  {
    id: 'yamabushi',
    name: '山伏',
    nameEn: 'Yamabushi',
    epithetEn: 'The Mountain Ascetic',
    keyword: '修行・忍耐・自然',
    keywordEn: 'Discipline · Endurance · Nature',
    description:
      '山野を駆け、己の肉体と精神を鍛え上げることに迷いはない。困難は避けるものではなく、越えるためにある。法螺の音とともに、いかなる苦行にも背を向けぬ強靭さを持つ。',
    descriptionEn:
      'He runs the mountains without a moment of hesitation, forging body and spirit into one. Hardship is not something to avoid, but something to overcome. To the sound of the conch-shell horn, he turns his back on no trial, however severe.',
    accentColor: '#5F7A52',
    imagePath: yamabushi,
  },
  {
    id: 'akindo',
    name: '商人',
    nameEn: 'Akindo',
    epithetEn: 'The Merchant',
    keyword: '社交・情報通・損得',
    keywordEn: 'Sociability · Information · Profit',
    description:
      '算盤片手に、人の懐にも心にも巧みに入り込む。交渉と駆け引きこそが得意の舞台であり、どんな相手からも欲しいものを引き出す弁舌を持つ。忍びにして、最も世渡り上手な男。',
    descriptionEn:
      'Abacus in hand, he slips deftly into both purses and hearts. Negotiation and maneuvering are the stage where he shines, his silver tongue drawing out what he wants from any mark. Among shinobi, none walks the world of men more skillfully.',
    accentColor: '#A8672E',
    imagePath: akindo,
  },
  {
    id: 'hokashi',
    name: '放下師',
    nameEn: 'Hokashi',
    epithetEn: 'The Street Performer',
    keyword: '芸・機転・身軽さ',
    keywordEn: 'Artistry · Wit · Agility',
    description:
      '祭りの喧騒に紛れ、軽業と機転で場をさらう。目立つことを恐れぬどころか、それを武器に変える。誰よりも身軽に、誰よりも鮮やかに、窮地さえも見世物に変えてしまう。',
    descriptionEn:
      'He slips into the roar of the festival crowd, stealing the scene with acrobatics and quick wit. Far from fearing attention, he turns it into a weapon. Lighter on his feet and more dazzling than anyone, he can turn even a crisis into a spectacle.',
    accentColor: '#D9622B',
    imagePath: hokashi,
  },
  {
    id: 'sarugakushi',
    name: '猿楽師',
    nameEn: 'Sarugakushi',
    epithetEn: 'The Masked Player',
    keyword: '二面性・演技・仮面',
    keywordEn: 'Duality · Performance · Masks',
    description:
      '面を替えるたびに、まったく別の人間として振る舞う。喜怒哀楽、悪鬼にも貴人にも成り代われるその演技力は、忍びの変装術の粋。素顔を見せる相手など、そう多くはない。',
    descriptionEn:
      'With every mask he dons, he becomes an entirely different person. Joy, rage, sorrow, delight — demon or noble, his command of performance is the pinnacle of the shinobi art of disguise. Few are ever shown his true face.',
    accentColor: '#5B4A78',
    imagePath: sarugakushi,
  },
  {
    id: 'tsunenokatachi',
    name: '常の形',
    nameEn: 'Tsunenokatachi',
    epithetEn: 'The Ordinary Form',
    keyword: '擬態・堅実・目立たなさ',
    keywordEn: 'Mimicry · Steadiness · Anonymity',
    description:
      '百姓のふりをして畑を耕し、旅人のふりをして道を行く。普段は誰の記憶にも残らぬほど平凡に振る舞い、いざという時にのみ牙を剥く。最も見破りにくい忍びの姿。',
    descriptionEn:
      'He tills the fields disguised as a farmer, walks the road disguised as a traveler. Ordinarily so unremarkable that no one recalls his face, he bares his fangs only when the moment demands it. His is the hardest disguise of all to see through.',
    accentColor: '#A68A5B',
    imagePath: tsunenokatachi,
  },
  {
    id: 'shikaku',
    name: '刺客',
    nameEn: 'Shikaku',
    epithetEn: 'The Assassin',
    keyword: '冷徹・単独・目的遂行',
    keywordEn: 'Ruthlessness · Solitude · Resolve',
    description:
      '月明かりの下、迷いなく標的へ肉薄する。感情よりも目的を優先し、成すべきことを成したなら振り返らない。単独行動を苦にせぬ、冷徹にして確実な忍びの刃。',
    descriptionEn:
      'Beneath the moonlight, he closes on his target without a moment of hesitation. Purpose comes before feeling, and once the deed is done, he never looks back. Untroubled by working alone, his is a blade both cold and certain.',
    accentColor: '#23262F',
    imagePath: shikaku,
  },
  {
    id: 'kanja',
    name: '間者',
    nameEn: 'Kanja',
    epithetEn: 'The Spy',
    keyword: '情報収集・洞察・裏工作',
    keywordEn: 'Intelligence · Insight · Subterfuge',
    description:
      '敵地の闇に潜み、噂と書状の裏に隠された真実を拾い上げる。事を構える前に、事の全てを知り尽くしておく慎重さがある。表舞台には立たず、しかし全てを動かす者。',
    descriptionEn:
      'He lurks in the darkness of enemy ground, gathering the truths hidden behind rumor and letter. Prudent to a fault, he learns everything there is to know before ever making his move. He never stands on the stage, yet it is he who moves everything upon it.',
    accentColor: '#3D4258',
    imagePath: kanja,
  },
  {
    id: 'bushi',
    name: '武士',
    nameEn: 'Bushi',
    epithetEn: 'The Samurai',
    keyword: '正義・名誉・正々堂々',
    keywordEn: 'Justice · Honor · Forthrightness',
    description:
      '搦め手より正面を選び、名を名乗って刃を交える。忍びでありながら、義と筋を通すことに誇りを置く。姑息な手段を嫌い、正々堂々を貫く不器用なまでの一本気。',
    descriptionEn:
      'He chooses the front gate over the back alley, giving his name before crossing blades. Shinobi though he is, he takes pride in honoring duty and righteousness. Scorning the cowardly path, he is stubbornly, almost clumsily, honest to the last.',
    accentColor: '#7A2530',
    imagePath: bushi,
  },
  {
    id: 'kusuriya',
    name: '薬屋',
    nameEn: 'Kusuriya',
    epithetEn: 'The Apothecary',
    keyword: '実利・商才・駆け引き',
    keywordEn: 'Pragmatism · Trade · Bargaining',
    description:
      '毒にも薬にもなる知識を天秤にかけ、常にリスクと実利を見極める。人の弱みにも足元にも目端が利き、抜け目のない商才で立ち回る。甘い笑みの裏に鋭い算段を隠す者。',
    descriptionEn:
      'He weighs knowledge that can heal or poison in equal measure, ever balancing risk against reward. Sharp-eyed to every weakness and opening, he moves with a shrewd merchant instinct. Behind his sweet smile lies a mind of cold calculation.',
    accentColor: '#8A7A3D',
    imagePath: kusuriya,
  },
  {
    id: 'kusushi',
    name: '薬師',
    nameEn: 'Kusushi',
    epithetEn: 'The Physician',
    keyword: '冷静・分析・専門知識',
    keywordEn: 'Composure · Analysis · Expertise',
    description:
      '薬箱を抱え、乱れた状況も冷静に分析して最善の一手を導く。己の武勇を誇るより、知識と技で仲間を支えることに存在意義を見出す。忍び集団の頭脳にして生命線。',
    descriptionEn:
      'Medicine chest in hand, he analyzes even the most chaotic situation to find the best course forward. He finds his worth not in claiming glory in battle, but in supporting his comrades through knowledge and skill. He is the brain — and the lifeline — of the shinobi band.',
    accentColor: '#565269',
    imagePath: kusushi,
  },
]

export const NINJA_TYPE_MAP = Object.fromEntries(
  NINJA_TYPES.map((type) => [type.id, type]),
)
