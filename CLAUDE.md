@AGENTS.md

# Claude Code notes

- Project skills are installed in `.claude/skills/<skill>/SKILL.md` and may be invoked explicitly with `/<skill-name>` or selected implicitly from their descriptions.
- Use the routing table imported from `AGENTS.md`; do not load all skills for every task.
- When a folder name and frontmatter `name` differ, use the frontmatter name shown in `SKILL.md` for explicit invocation. In particular, invoke `/vercel-react-best-practices` for the folder `.claude/skills/react-best-practices`.
- After adding or changing skills, start a new Claude Code session if they do not immediately appear.

