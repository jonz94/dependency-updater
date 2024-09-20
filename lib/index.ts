import { spawnSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import prompts from 'prompts'
import { table, TableUserConfig } from 'table'
import { getCommandForWindows } from './get-command-for-windows'
import {
  detectPackageManager,
  getDevDependencyFlag,
  getUpdateCommand,
} from './package-manager'
import { getOptions } from './setup-options'

interface OutdatedPackagesJson {
  [packageName: string]: OutdatedPackageInfo
}

interface OutdatedPackageInfo {
  current: string
  latest: string
  wanted: string
}

const run = async () => {
  const options = getOptions()

  console.log('🚀 Running @jonz94/dependency-updater v@VERSION_PLACEHOLDER@')

  console.log('🔍 Checking for outdated packages...')

  const packageJsonContent = await readFile('package.json', 'utf-8')
  const packageJson = JSON.parse(packageJsonContent)
  const devDependencies = Object.keys(packageJson.devDependencies)

  const npmCommand =
    process.platform === 'win32' ? getCommandForWindows('npm') : 'npm'

  const resultOfNpmOutdated = spawnSync(npmCommand, ['outdated', '--json'])
  const outdatedPackagesJson = JSON.parse(
    resultOfNpmOutdated.stdout.toString(),
  ) as OutdatedPackagesJson

  const outdatedPackages = Object.keys(outdatedPackagesJson)

  const autoUpdatablePackages = Object.entries(outdatedPackagesJson)
    .filter(([_packageName, outdatedPackageInfo]) => {
      const { current, wanted } = outdatedPackageInfo

      return current !== wanted
    })
    .map(([packageName]) => packageName)

  if (outdatedPackages.length === 0 && autoUpdatablePackages.length === 0) {
    console.log(`🎉 Everything is up-to-date!`)
    process.exit(0)
  }

  if (outdatedPackages.length > 0 && autoUpdatablePackages.length === 0) {
    const manualUpdatePackages = outdatedPackages.filter(
      (packageName) => !autoUpdatablePackages.includes(packageName),
    )

    console.log(
      `🚧 There are ${manualUpdatePackages.length} package(s) need manually update!`,
    )

    const data = manualUpdatePackages.map((packageName) => {
      const { current, wanted, latest } = outdatedPackagesJson[packageName]

      return [packageName, current, wanted, latest]
    })

    const tableData = [['Package', 'Current', 'Wanted', 'Latest'], ...data]

    const tableConfig: TableUserConfig = {
      columns: [
        { alignment: 'left' },
        { alignment: 'right' },
        { alignment: 'right' },
        { alignment: 'right' },
      ],
      drawHorizontalLine: (index, size) => {
        return index === 0 || index === 1 || index === size
      },
    }

    console.log(table(tableData, tableConfig))

    process.exit(0)
  }

  console.log(
    `👀 There are ${autoUpdatablePackages.length} package(s) can be auto-updated!`,
  )

  const data = autoUpdatablePackages.map((packageName) => {
    const { current, wanted, latest } = outdatedPackagesJson[packageName]

    return [packageName, current, wanted, latest]
  })

  const tableData = [['Package', 'Current', 'Wanted', 'Latest'], ...data]

  const tableConfig: TableUserConfig = {
    columns: [
      { alignment: 'left' },
      { alignment: 'right' },
      { alignment: 'right' },
      { alignment: 'right' },
    ],
    drawHorizontalLine: (index, size) => {
      return index === 0 || index === 1 || index === size
    },
  }

  console.log(table(tableData, tableConfig))

  if (!options.yes) {
    const { shouldUpdateAllPackages } = await prompts({
      type: 'confirm',
      name: 'shouldUpdateAllPackages',
      message: ' Update all packages?',
      initial: true,
    })

    if (shouldUpdateAllPackages === false) {
      process.exit(0)
    }
  }

  const currentPackageManager = detectPackageManager()

  if (currentPackageManager === null) {
    console.warn('⚠️ Lock file not found! Cannot auto detect package manager.')

    const { shouldContinueByUsingNpm } = await prompts({
      type: 'confirm',
      name: 'shouldContinueByUsingNpm',
      message: 'Using npm to continuing upgrade process?',
      initial: false,
    })

    if (shouldContinueByUsingNpm === false) {
      process.exit(0)
    }
  }

  const packageManager = currentPackageManager ?? 'npm'
  const packageManagerCommand =
    process.platform === 'win32'
      ? getCommandForWindows(packageManager)
      : packageManager

  console.log(`📦 Using ${packageManager} to upgrade packages`)

  const updateCommand = getUpdateCommand(packageManager)

  autoUpdatablePackages.forEach((packageName) => {
    const { current: currentVersion, wanted: wantedVersion } =
      outdatedPackagesJson[packageName]

    console.log(`👍 Updating ${packageName} to ${wantedVersion}...`)

    const isDevDependency = devDependencies.includes(packageName)
    const devDependencyFlag = getDevDependencyFlag(packageManager)

    const args = isDevDependency
      ? [updateCommand, devDependencyFlag, `${packageName}@^${wantedVersion}`]
      : [updateCommand, `${packageName}@^${wantedVersion}`]

    spawnSync(packageManagerCommand, args)

    if (options.enableGitCommit) {
      const {
        emoji: emojiOption,
        gitCommitType: type,
        gitCommitVerb: verb,
        showFrom,
      } = options

      const emoji =
        emojiOption === true
          ? '👍 '
          : emojiOption && emojiOption !== ''
            ? `${emojiOption} `
            : ''
      const scope = isDevDependency ? 'dev-deps' : 'deps'
      const from = showFrom ? ` from ${currentVersion}` : ''
      const gitMessage = `${emoji}${type}(${scope}): ${verb} \`${packageName}\`${from} to ${wantedVersion}`

      spawnSync('git', ['add', '-A'])
      spawnSync('git', ['commit', '-m', gitMessage])
    }
  })

  console.log(`🎉 Everything is up-to-date!`)
}

if (require.main === module) {
  run().catch((error) => console.error(error))
}

export { run }
