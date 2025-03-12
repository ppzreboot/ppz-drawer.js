// @ts-check

import { build, context } from 'esbuild'

main()

async function main() {
  // @ts-ignore
  var is_dev = process.argv[2] === 'dev'

  /** @type {import('esbuild').BuildOptions} */
  const opts = {
    entryPoints: ['demo/vanilla/main.ts'],
    outdir: 'demo/vanilla',
    bundle: true,
    logLevel: 'debug',
  }

  if (is_dev) {
    const ctx = await context(opts)
    await ctx.watch()
    await ctx.serve({
      servedir: 'demo',
    })
  } else
    build(opts)
}
