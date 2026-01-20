# Antigravity - Konfiguracja MCP & Workflows

> Notatki z nauki o Google Antigravity (Gemini CLI / Code Assist)

---

## 🔧 MCP Tools (Model Context Protocol)

### Filozofia Google
- **Otwarty standard** pozwalający modelom AI na integrację z zewnętrznymi narzędziami
- Rozszerzanie możliwości asystenta bez modyfikacji samego modelu
- Wspólna specyfikacja z Anthropic (Claude)

### Konfiguracja

**Lokalizacje plików:**
- `~/.gemini/settings.json` - globalna konfiguracja
- `.gemini/settings.json` - lokalna konfiguracja projektu

**Struktura:**
```json
{
  "mcpServers": {
    "nazwa-serwera": {
      "command": "npx",
      "args": ["-y", "nazwa-pakietu-mcp"],
      "env": {
        "API_KEY": "twoj-klucz"
      }
    }
  }
}
```

### Narzędzia wbudowane do obsługi MCP
- `list_resources` - listowanie zasobów z serwera MCP
- `read_resource` - odczyt konkretnego zasobu

---

## 📋 Workflows / Slash Commands

### Lokalizacja
```
.agent/workflows/nazwa-workflow.md
```

### Format pliku
```yaml
---
description: krótki opis workflow
---
1. Pierwszy krok
2. Drugi krok
// turbo
3. Trzeci krok (auto-run)
```

### Wywołanie
- `/nazwa-workflow` - slash command w chacie
- Lub poproszenie asystenta o wykonanie danego workflow

### Adnotacje specjalne

| Adnotacja | Działanie |
|-----------|-----------|
| `// turbo` | Auto-run następnego kroku (bez pytania użytkownika) |
| `// turbo-all` | Auto-run wszystkich kroków w workflow |

---

## 📁 Ważne lokalizacje konfiguracji

| Ścieżka | Przeznaczenie |
|---------|---------------|
| `.gemini/` | Lokalna konfiguracja projektu |
| `~/.gemini/` | Globalna konfiguracja użytkownika |
| `.agent/workflows/` | Workflows / slash commands |
| `GEMINI.md` | Instrukcje dla asystenta specyficzne dla projektu |

---

## 💡 Przydatne linki

- [MCP Specification](https://modelcontextprotocol.io/)
- [Gemini CLI Docs](https://github.com/google-gemini/gemini-cli)

---

*Ostatnia aktualizacja: 2026-01-21*
