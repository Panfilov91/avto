# GitHub Actions Workflows Documentation

This document describes the GitHub Actions workflows configured for this repository.

## Overview

This project uses two main GitHub Actions workflows:
1. **Deploy to GitHub Pages** - Automatic deployment on push to main
2. **Auto-merge PRs** (Optional) - Automatic PR merging with specific labels/tags

## Workflows

### 1. Deploy to GitHub Pages (`deploy.yml`)

**Trigger:** Push to `main` branch

**What it does:**
- Checks out the repository code
- Sets up Node.js environment (v18)
- Installs dependencies
- Builds the static bundle using `npm run build`
- **Verifies** that `dist/index.html` was generated successfully
- Uploads the artifact to GitHub Pages
- Deploys to GitHub Pages
- Creates a deployment summary with build time, commit SHA, and deployment URL

**Key Features:**
- ✅ Automatic index.html verification
- ✅ Concurrent deployment protection (only one deployment at a time)
- ✅ Deployment history tracking
- ✅ Status summary in GitHub Actions

**Permissions Required:**
- `contents: read` - Read repository contents
- `pages: write` - Write to GitHub Pages
- `id-token: write` - Create identity tokens for OIDC

**Build Process:**
The workflow runs `npm run build` which:
1. Bundles all CSS and JavaScript files into a single `dist/index.html`
2. Embeds all resources inline for offline functionality
3. Creates a self-contained bundle suitable for GitHub Pages

### 2. Auto-merge PRs (`auto-merge.yml`)

**Trigger:** Pull request events (opened, synchronized, reopened, labeled)

**Activation Criteria:**
- PR has the `auto-merge` label, OR
- PR title contains `[auto-merge]` prefix

**What it does:**
1. Checks if all PR checks have passed
2. Verifies the PR status
3. Merges the PR using squash merge strategy
4. Deletes the source branch after merge
5. Posts a success comment on the merged PR

**Permissions Required:**
- `contents: write` - Commit and push changes
- `pull-requests: write` - Manage pull requests

**How to Use:**
- Add `auto-merge` label to a PR, OR
- Use `[auto-merge]` prefix in PR title (e.g., `[auto-merge] Add new feature`)

### GitHub Pages Configuration

For the deployment workflow to work correctly, ensure:

1. **GitHub Pages Source**: Set to "GitHub Actions"
   - Go to repository Settings → Pages
   - Select "GitHub Actions" as the deployment source

2. **Repository URL**: https://panfilov91.github.io/avto/

3. **Branch Protection** (Optional but Recommended):
   - Protect the `main` branch
   - Require status checks before merging
   - Require pull requests for changes

## Environment

- **Node.js**: 18.x
- **Build Tool**: Node.js (native)
- **Runtime**: GitHub Actions (Ubuntu Latest)

## Troubleshooting

### Deployment fails with "index.html not found"
- Check that `npm run build` completes successfully
- Verify `build.js` is present and correct
- Ensure all required source files exist in the repository

### Workflow not triggering
- Verify the workflow file YAML syntax is correct
- Check that the branch matches the trigger condition
- Ensure workflows are enabled in repository settings

### Auto-merge not working
- Verify the PR has the `auto-merge` label or `[auto-merge]` in title
- Check that all status checks pass before trying to merge
- Ensure the workflow has proper permissions

## Deployment History

All deployments are tracked and visible in:
- GitHub Actions tab → Workflow runs
- GitHub Pages deployment history
- Each deployment includes: timestamp, commit SHA, and deployment URL

## Best Practices

1. **Always use feature branches** - Create PRs from feature branches to main
2. **Use meaningful commit messages** - Helps track changes in deployment history
3. **Tag auto-merge carefully** - Use `[auto-merge]` only when fully tested
4. **Monitor deployments** - Check GitHub Actions for any failures
5. **Test locally** - Run `npm run build` locally before pushing to main

## File Structure

```
.github/
  workflows/
    deploy.yml          # Main deployment workflow
    auto-merge.yml      # Optional auto-merge workflow
    deploy-pages.yml    # Legacy deployment workflow (kept for compatibility)
```

## Disabling Workflows

To temporarily disable a workflow:
1. Go to Actions tab
2. Select the workflow
3. Click "Disable workflow"

To permanently remove a workflow, delete the `.yml` file from `.github/workflows/`
