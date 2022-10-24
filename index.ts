import { detect } from '@antfu/ni'

async function test() {
  console.log(await detect({}))
}

test()
