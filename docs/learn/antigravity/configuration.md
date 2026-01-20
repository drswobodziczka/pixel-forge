# Configuring Antigravity Agent

## 1. Global Configuration
You can configure global behaviors for the Antigravity agent by editing the following file:
- **`~/.gemini/GEMINI.md`**
    - This file acts as a global system prompt appendix.
    - Use it to set high-level preferences (e.g., "Always speak Polish", "Prefer functional programming", "Never use Tailwind unless asked").

## 2. Project-Specific Configuration
To configure Antigravity for a specific project, creates a `.agent` directory in your project root.

### Workflows
- **Location**: `.agent/workflows/`
- **Format**: Markdown files (`.md`) with YAML frontmatter.
- **Usage**: Define step-by-step procedures for common tasks (e.g., `deploy.md`, `test.md`).
- **Example**:
  ```markdown
  ---
  description: How to deploy to production
  ---
  1. Run `npm test`
  2. Run `npm run build`
  ```

## 3. Importing from `~/.ai-central`
If you maintain a central repository of rules and workflows (like `~/.ai-central`), you can "import" them into your current project by copying them:

### Copying Rules
Append rules from your central repo to your global or project config:
```bash
cat ~/.ai-central/rules/my-rule.md >> ~/.gemini/GEMINI.md
```

### Copying Workflows
Copy specific workflows to your project's agent folder:
```bash
mkdir -p .agent/workflows
cp ~/.ai-central/workflows/useful-workflow.md .agent/workflows/
```

> **Note**: Antigravity currently relies on file presence in standard locations. Symlinking `~/.gemini/GEMINI.md` to a file in `~/.ai-central` is also a valid power-user strategy to keep config version-controlled.
