const path = require('path')
const { spawn } = require('child_process')

const certSha1 = process.env.WINDOWS_CERT_SHA1

if (!certSha1) {
  throw new Error('WINDOWS_CERT_SHA1 not set')
}

async function spawnPromise (
  name,
  args,
  options,
) {
  const fork = spawn(name, args, options)

  console.log(`Spawning ${name} with ${args}`)

  let stdout = ''
  let stderr = ''

  return new Promise((resolve) => {
    fork.stdout?.on('data', (data) => {
      console.log(`Spawn ${name} stdout: ${data}`)
      stdout += data
    })

    fork.stderr?.on('data', (data) => {
      console.log(`Spawn ${name} stderr: ${data}`)
      stderr += data
    })

    fork.on('close', (code) => {
      console.log(`Spawn ${name}: Child process exited with code ${code}`)
      resolve({ stdout, stderr, code })
    })
  })
}

module.exports = async function (filePath) {
  console.log(`Path to file to sign: ${filePath}`)

  const signToolPath = path.join('node_modules', '@electron', 'windows-sign', 'vendor', 'signtool.exe')

  const args = [
    'sign',
    '/tr', 'http://timestamp.digicert.com',
    '/td', 'sha256',
    '/fd', 'sha256',
    '/sha1', certSha1,
  ]

  console.log('Executing signtool with args', { args, filePath })
  const { code, stderr, stdout } = await spawnPromise(signToolPath, [...args, filePath], {
    env: process.env,
    cwd: process.cwd(),
  })

  if (code !== 0) {
    throw new Error(`Signtool exited with code ${code}. Stderr: ${stderr}. Stdout: ${stdout}`)
  }
}
