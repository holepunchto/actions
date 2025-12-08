## Auto Review Requests with CODEOWNERS

Automatically require reviews from specific users when files matching a pattern are changed in a PR.

### Setup

1. Create a `CODEOWNERS` file in your repo (in `.github/`, `docs/`, or root):

```
# .github/CODEOWNERS
/src/billing/**  @alice @bob
*.sql            @john
```

2. Enable branch protection in **Settings → Branches**:
   - Add classic rule for your main branch
   - Enable **"Require a pull request before merging"**
   - Enable **"Require review from Code Owners"**

3. Add workflow

```yaml
name: PR Review Request
on:
  pull_request:
    types: [opened, synchronize]

permissions:
  pull-requests: write # to request reviews
  contents: read # to read CODEOWNERS

jobs:
  auto-review:
    uses: holepunchto/actions/.github/workflows/auto-review-request.yml@v1
```

See [GitHub CODEOWNERS docs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners) for full syntax.
