import { dirname, join } from 'path'
import { replaceInFileSync } from 'replace-in-file'

async function main() {
  const { version } = await import('../package.json')

  const targetFilePath = join(dirname(__filename), '../dist/index.js')

  replaceInFileSync({
    files: targetFilePath,
    from: '@VERSION_PLACEHOLDER@',
    to: version,
  })
}

main()
