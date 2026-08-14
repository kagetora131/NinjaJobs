import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const srcDir = path.join(root, 'カード')
const outDir = path.join(root, 'src', 'assets', 'characters')

const FILE_TO_ID = {
  'Firefly_Gemini Flash_Komuso.png': 'komuso',
  'Firefly_Gemini Flash_Shukke.png': 'shukke',
  'Firefly_Gemini Flash_Yamabushi.png': 'yamabushi',
  'Firefly_Gemini Flash_Akindo.png': 'akindo',
  'Firefly_Gemini Flash_Hokashi.png': 'hokashi',
  'Firefly_Gemini Flash_Sarugakushi.png': 'sarugakushi',
  'Firefly_Gemini Flash_Tsunenokata.png': 'tsunenokatachi',
  'Firefly_Gemini Flash_Shikaku.png': 'shikaku',
  'Firefly_Gemini Flash_Kansha.png': 'kanja',
  'Firefly_Gemini Flash_Bushi.png': 'bushi',
  'Firefly_Gemini Flash_Kusuriya.png': 'kusuriya',
  'Firefly_Gemini Flash_Kususi.png': 'kusushi',
}

await mkdir(outDir, { recursive: true })

for (const [file, id] of Object.entries(FILE_TO_ID)) {
  const inputPath = path.join(srcDir, file)
  const outputPath = path.join(outDir, `${id}.webp`)
  await sharp(inputPath)
    .resize({ width: 900, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toFile(outputPath)
  console.log(`${file} -> ${path.relative(root, outputPath)}`)
}
