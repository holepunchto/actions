import fs from 'fs'
import path from 'path'
import * as core from '@actions/core'
import { DefaultArtifactClient } from '@actions/artifact'

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
  const artifactPath = core.getInput('path')
  const runUrl = core.getInput('run-url')

  const artifactLinks = []

  for (const file of listFilesRecursive(artifactPath)) {
    const artifactName = path.basename(file)
    core.info(`Uploading artifact: ${artifactName} from ${file}`)

    const response = await artifact.uploadArtifact(artifactName, [file], artifactPath)
    if (runUrl && response && response.id) {
      artifactLinks.push(`<${runUrl}/artifacts/${response.id}|${artifactName}>`)
    } else if (runUrl) {
      artifactLinks.push(`<${runUrl}#artifacts|${artifactName}>`)
    }
  }

  core.setOutput('artifact-links', artifactLinks.join('\n'))
}

main().catch((error) => {
  core.setFailed(error)
})
