import { existsSync } from 'node:fs'

export type SupportedPackageManager = 'npm' | 'pnpm' | 'yarn'
export type UpdateCommand = 'install' | 'add'

export function detectPackageManager() {
  let currentPackageManager: SupportedPackageManager | null = null

  const lookupTable: Record<SupportedPackageManager, string> = {
    npm: 'package-lock.json',
    pnpm: 'pnpm-lock.yaml',
    yarn: 'yarn.lock',
  } as const

  for (const [packageManager, lockFile] of Object.entries(lookupTable)) {
    const doesExist = existsSync(lockFile)

    if (doesExist) {
      currentPackageManager = packageManager as SupportedPackageManager
      break
    }
  }

  return currentPackageManager
}

export function getUpdateCommand(packageManager: SupportedPackageManager) {
  const updateCommandLookupTable = {
    npm: 'install',
    pnpm: 'add',
    yarn: 'add',
  } as const satisfies Record<SupportedPackageManager, UpdateCommand>

  return updateCommandLookupTable[packageManager]
}
