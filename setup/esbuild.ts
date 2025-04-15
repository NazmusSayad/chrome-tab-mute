import { execSync } from 'child_process'
import esbuild from 'esbuild'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import archiver from './archiver'
import { IMAGES_DIR, OUTPUT_DIR, OUTPUT_IMAGES_DIR, PUBLIC_DIR } from './config'
import manifest from './manifest'

execSync('npx tsc --noEmit', { stdio: 'inherit' })

const isWatchMode = process.argv.includes('--watch')

fs.rmSync(OUTPUT_DIR, { recursive: true, force: true })
fs.mkdirSync(OUTPUT_DIR, { recursive: true })
fs.mkdirSync(path.join(OUTPUT_IMAGES_DIR), { recursive: true })

// Resize images
const sizes = [128]
const files = fs.readdirSync(IMAGES_DIR)
const pngFiles = files.filter((file) => file.endsWith('.png'))
for (const file of pngFiles) {
  const filePath = path.join(IMAGES_DIR, file)
  const image = sharp(filePath)

  for (const size of sizes) {
    const outputFileName = `${path.basename(file, '.png')}-${size}.png`
    const outputFilePath = path.join(OUTPUT_IMAGES_DIR, outputFileName)

    await image.resize(size, size).toFile(outputFilePath)
  }
}

// Copy Public Files
const publicFiles = fs.readdirSync(PUBLIC_DIR)
publicFiles.forEach((file) => {
  fs.copyFileSync(path.join(PUBLIC_DIR, file), path.join(OUTPUT_DIR, file))
})

// Copy manifest.json
fs.writeFileSync(
  path.join(OUTPUT_DIR, 'manifest.json'),
  JSON.stringify(manifest)
)

const esbuildCtx = await esbuild.context({
  entryPoints: ['./src/index.ts'],
  outfile: path.join(OUTPUT_DIR, 'index.js'),
  drop: isWatchMode ? [] : ['console', 'debugger'],
  bundle: true,
  target: 'es6',
  format: 'esm',
  platform: 'neutral',
  minify: !isWatchMode,
  sourcemap: isWatchMode,
})

if (isWatchMode) {
  await esbuildCtx.rebuild()
  console.log('Build completed')

  console.log('Watching for changes...')
  await esbuildCtx.watch()
} else {
  await esbuildCtx.rebuild()
  console.log('Build completed')

  await esbuildCtx.dispose()
  console.log('Build disposed')

  const archive = await archiver(
    OUTPUT_DIR,
    `chrome-extension-tab-mute-${manifest.version}.zip`
  )

  console.log(`✔️  Zipped ${archive.pointer()}bytes`)
}
