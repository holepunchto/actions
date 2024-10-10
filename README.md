# Intro

Shared GitHub actions

## Usage

```
name: My Action

on:
  workflow_dispatch:

jobs:
  my-job-reuse-workflow:
    runs-on: ubuntu-latest
    uses: holepunchto/actions/.github/workflows/bump-deps.yml
    secrets: inherit

  my-job-reuse-step:
    runs-on: ubuntu-latest
    steps:
      - uses: holepunchto/actions/.github/steps/bump-deps@main
        with:
          use-create-pr: true
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - uses: holepunchto/actions/.github/steps/bump-versions@main
        with:
          use-create-pr: true
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          version: ${{ inputs.version }}
```

## License

Apache-2.0
