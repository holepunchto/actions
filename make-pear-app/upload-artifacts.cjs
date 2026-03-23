const fs = require('fs')
const path = require('path')
const { DefaultArtifactClient } = require('@actions/artifact')

const artifact = new DefaultArtifactClient()

function listFilesRecursive (dir) {
  let results = []
  const list = fs.readdirSync(dir)

  for (const file of list) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    if (stat && stat.isDirectory()) {
      results = results.concat(listFilesRecursive(filePath))
    } else if (stat && stat.isFile()) {
      results.push(filePath)
    }
  }

  return results
}

async function main () {
  const runUrl = process.env.GITHUB_SERVER_URL && process.env.GITHUB_REPOSITORY && process.env.GITHUB_RUN_ID
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : null

  const artifactPath = './out/make'
  const artifactLinks = []

  for (const file of listFilesRecursive(artifactPath)) {
    const artifactName = path.basename(file)
    console.log(`Uploading artifact: ${artifactName} from ${file}`)

    const response = await artifact.uploadArtifact(artifactName, [file], artifactPath)
    if (runUrl && response && response.id) {
      artifactLinks.push(`<${runUrl}/artifacts/${response.id}|${artifactName}>`)
    } else if (runUrl) {
      artifactLinks.push(`<${runUrl}#artifacts|${artifactName}>`)
    }
  }

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(
      process.env.GITHUB_OUTPUT,
      `artifact-links<<EOF\n${artifactLinks.join('\n')}\nEOF\n`
    )
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
