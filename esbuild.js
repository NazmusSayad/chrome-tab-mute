import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import esbuild from 'esbuild'

const imagesDir = path.resolve('./images/icons')
const outputDir = path.resolve('./dist/images')

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const sizes = [16, 32, 48, 128]
const files = fs.readdirSync(imagesDir)
const pngFiles = files.filter((file) => file.endsWith('.png'))

for (const file of pngFiles) {
  const filePath = path.join(imagesDir, file)
  const image = sharp(filePath)

  for (const size of sizes) {
    const outputFileName = `${path.basename(file, '.png')}-${size}.png`
    const outputFilePath = path.join(outputDir, outputFileName)

    await image.resize(size, size).toFile(outputFilePath)
  }
}

esbuild.build({
  minify: true,
  bundle: true,
  entryPoints: ['./src/index.ts'],
  outfile: './dist/index.js',
  platform: 'neutral',
  target: 'ES2020',
  format: 'esm',
})
