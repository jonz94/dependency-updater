import parseArgs from 'minimist'
import { argv } from 'node:process'

interface Options {
  yes: boolean | string
  emoji: boolean | string
  enableGitCommit: boolean
  gitCommitType: string
  gitCommitVerb: string
  showFrom: boolean
}

const defaultOptions: Options = {
  yes: false,
  emoji: false,
  enableGitCommit: true,
  gitCommitType: 'build',
  gitCommitVerb: 'update',
  showFrom: false,
}

const getOptions = () => {
  const {
    yes,
    emoji,
    enableGitCommit,
    gitCommitType,
    gitCommitVerb,
    showFrom,
  } = parseArgs(argv.slice(2), {
    alias: {
      'git-commit': 'enableGitCommit',
      'git-commit-type': 'gitCommitType',
      'git-commit-verb': 'gitCommitVerb',
      'show-from': 'showFrom',
    },
  }) as Partial<Options>

  return {
    ...defaultOptions,
    ...(yes !== undefined && { yes }),
    ...(emoji !== undefined && { emoji }),
    ...(enableGitCommit !== undefined && { enableGitCommit }),
    ...(typeof gitCommitType === 'string' && { gitCommitType }),
    ...(typeof gitCommitVerb === 'string' && { gitCommitVerb }),
    ...(showFrom !== undefined && { showFrom: showFrom !== false }),
  } as Options
}

export { getOptions }
