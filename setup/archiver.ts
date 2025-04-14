import archiver from 'archiver'
import fs from 'fs'

export default function (src: string, out: string): Promise<archiver.Archiver> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(out)
    const archive = archiver('zip', { zlib: { level: 9 } })

    output.on('close', () => resolve(archive))
    archive.on('error', (err) => reject(err))

    archive.pipe(output)
    archive.directory(src, false)
    archive.finalize()
  })
}
