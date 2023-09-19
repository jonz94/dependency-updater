import { existsSync } from 'node:fs'

const detectPackageManager = () => {
  let currentPackageManager: string | null = null

  const lookupTable = new Map([
    ['npm', 'package-lock.json'],
    ['pnpm', 'pnpm-lock.yaml'],
    ['yarn', 'yarn.lock'],
  ])

  for (const [packageManager, lockFile] of lookupTable) {
    const doesExist = existsSync(lockFile)

    if (doesExist) {
      currentPackageManager = packageManager
      break
    }
  }

  return currentPackageManager
}

export { detectPackageManager }
