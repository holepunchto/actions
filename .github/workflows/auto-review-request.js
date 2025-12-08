const fs = require('fs');

module.exports = async ({ github, context }) => {
  const codeownersPath = '.github/CODEOWNERS';
  if (!fs.existsSync(codeownersPath)) {
    console.log('No CODEOWNERS file found at .github/CODEOWNERS');
    return;
  }

  const codeownersContent = fs.readFileSync(codeownersPath, 'utf8');

  const rules = codeownersContent
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const parts = line.split(/\s+/);
      const pattern = parts[0];
      const owners = parts.slice(1).map(o => o.replace(/^@/, ''));
      return { pattern, owners };
    })
    .filter(rule => rule.owners.length > 0);

  if (rules.length === 0) {
    console.log('No rules found in CODEOWNERS');
    return;
  }

  console.log(`Parsed ${rules.length} CODEOWNERS rules`);

  const { data: files } = await github.rest.pulls.listFiles({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: context.payload.pull_request.number,
    per_page: 100
  });

  const changedFiles = files.map(f => f.filename);
  console.log(`Changed files: ${changedFiles.join(', ')}`);

  const matchedOwners = new Set();

  for (const file of changedFiles) {
    for (const rule of rules) {
      if (matchPattern(rule.pattern, file)) {
        rule.owners.forEach(owner => matchedOwners.add(owner));
        console.log(`File "${file}" matched pattern "${rule.pattern}" -> ${rule.owners.join(', ')}`);
      }
    }
  }

  function matchPattern(pattern, filePath) {
    if (pattern.endsWith('/')) {
      return filePath.startsWith(pattern) || filePath.startsWith(pattern.slice(0, -1) + '/');
    }

    let regex = pattern
      .replace(/\./g, '\\.')
      .replace(/\*\*/g, '{{GLOBSTAR}}')
      .replace(/\*/g, '[^/]*')
      .replace(/\{\{GLOBSTAR\}\}/g, '.*');

    if (!pattern.startsWith('/')) {
      regex = '(^|/)' + regex;
    } else {
      regex = '^' + regex.slice(1);
    }

    regex += '$';

    try {
      return new RegExp(regex).test(filePath);
    } catch (e) {
      console.log(`Invalid pattern "${pattern}": ${e.message}`);
      return false;
    }
  }

  if (matchedOwners.size === 0) {
    console.log('No matching owners found for changed files');
    return;
  }

  const prAuthor = context.payload.pull_request.user.login;
  const reviewers = [...matchedOwners].filter(r => r !== prAuthor);

  if (reviewers.length === 0) {
    console.log('All matched owners are the PR author, skipping');
    return;
  }

  console.log(`Requesting review from: ${reviewers.join(', ')}`);

  await github.rest.pulls.requestReviewers({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: context.payload.pull_request.number,
    reviewers: reviewers
  });
};
