const { spawnSync } = require('child_process')

const workspaces = process.env.WORKSPACES === 'true'
const includeWorkspaceRoot = process.env.INCLUDE_WORKSPACE_ROOT === 'true'
const tag = process.env.TAG || 'latest'

const npm = (args, options = {}) => spawnSync('npm', args, { stdio: 'inherit', ...options })
const query = npm(['query', workspaces ? '.workspace' : '.', '--json'], {
  encoding: 'utf8',
  stdio: 'pipe'
})

if (query.status !== 0) {
  process.stderr.write(query.stderr)
  process.exit(query.status || 1)
}

const packages = JSON.parse(query.stdout)
  .filter((pkg) => !pkg.private)
  .filter((pkg) => includeWorkspaceRoot || pkg.location !== '.')

for (const pkg of packages) {
  const spec = `${pkg.name}@${pkg.version}`
  const view = npm(['view', spec, 'version'], { stdio: 'ignore' })

  if (view.status === 0) {
    console.log(`Skipping already published ${spec}`)
    continue
  }

  console.log(`Publishing ${spec}`)
  const publish = npm(['publish', '--ignore-scripts', '--tag', tag, pkg.location])

  if (publish.status !== 0) process.exit(publish.status || 1)
}
