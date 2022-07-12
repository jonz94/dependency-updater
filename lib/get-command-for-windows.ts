import { sync } from 'command-exists'

const getCommandForWindows = (command: string) => {
  const possibleExtension = ['.exe', '.cmd', '.ps1']

  for (const extension of possibleExtension) {
    const fullCommand = `${command}${extension}`
    if (sync(fullCommand)) {
      return fullCommand
    }
  }

  throw new Error('command not found')
}

export { getCommandForWindows }
