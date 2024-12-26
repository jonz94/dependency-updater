import { existsSync } from 'node:fs'

export type SupportedPackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun'
export type UpdateCommand = 'install' | 'add'

export function detectPackageManager() {
  let currentPackageManager: SupportedPackageManager | null = null

  const lookupTable: Record<string, SupportedPackageManager> = {
    'package-lock.json': 'npm',
    'pnpm-lock.yaml': 'pnpm',
    'yarn.lock': 'yarn',
    'bun.lockb': 'bun',
    'bun.lock': 'bun',
  } as const

  for (const [lockFile, packageManager] of Object.entries(lookupTable)) {
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
    bun: 'add',
  } as const satisfies Record<SupportedPackageManager, UpdateCommand>

  return updateCommandLookupTable[packageManager]
}

export function getDevDependencyFlag(packageManager: SupportedPackageManager) {
  return packageManager === 'bun' ? '-d' : '-D'
}
