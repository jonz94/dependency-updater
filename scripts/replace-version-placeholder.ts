import { dirname, join } from 'path'
import { sync as replaceSync } from 'replace-in-file'

async function main() {
  const { version } = await import('../package.json')

  const targetFilePath = join(dirname(__filename), '../dist/index.js')

  replaceSync({
    files: targetFilePath,
    from: '@VERSION_PLACEHOLDER@',
    to: version,
  })
}

main()
