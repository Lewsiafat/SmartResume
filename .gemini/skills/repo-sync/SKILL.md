---
name: repo-sync
description: Syncs GitHub repository list from 'ref_src/target_git_repos.md' to the landing page projects data ('src/data/projects.ts'). Use when new repositories are added to the source list or when a full synchronization is needed.
---

# Repo Sync Skill

This skill automates the synchronization between a Markdown repository list and the TypeScript data file used by the landing page.

## Workflow

1. **Detection**: Identify changes in `ref_src/target_git_repos.md`.
2. **Parsing**: Extract repository names, URLs, and SSH links.
3. **Execution**: Run the internal Python script to update `src/data/projects.ts`.
4. **Verification**: Confirm the projects list reflects the changes in the source file.

## Usage

When the user asks to "sync repositories" or "update project list", follow these steps:

1. Locate `ref_src/target_git_repos.md`.
2. Execute the sync script:
   ```bash
   python3 .agent/skills/repo-sync/repo-sync/scripts/sync_repos.py
   ```
3. Review `src/data/projects.ts` to ensure consistency.

## Resources

- **`scripts/sync_repos.py`**: The core logic for parsing and file patching.
