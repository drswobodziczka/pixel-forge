# Project Principles

This document outlines the core principles and workflows followed by the PixelForge development team and AI agents.

## 1. No Ticket, No Work
Every task, bug fix, or feature request must have a corresponding GitHub Issue.
- If there is no ticket, do not start working.
- Reference the ticket in all relevant discussions and commits.

## 2. All Changes via PR
No changes are pushed directly to the `main` branch.
- Every change must go through a Pull Request (PR).
- PRs allow for review and verification before integration.

## 3. Concept Brainstorming
All new concepts and features must start with a brainstorming session involving an AI agent.
- Brainstorming results in a clear definition of the concept.
- The outcome must be finalized as a GitHub Issue in the current project.
- The issue must be assigned an appropriate label from the existing project labels.

## 4. Conventional Commits
All commit messages must follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.
- Use prefixes like `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`, `style:`.
- Example: `feat: add support for Recraft API`

## 5. Agent UI Testing
Every change to the User Interface (UI) MUST be tested by an AI agent.
- The agent must use browser tools to verify visual correctness and functional behavior.
- Evidence of testing should be documented in the walkthrough or PR description.
