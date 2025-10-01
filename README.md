# Exploratour

Monorepo do projeto **Exploratour**, contendo backend (Nodejs + Express + PostgreSQL) e frontend (Next.js).

---

## 📂 Estrutura do Projeto

```bash
exploratour/
 ├─ .husky               # Hooks de Git (commitlint)
 ├─ backend/             # API em Node.js + Express
 ├─ frontend/            # Aplicação em ReactJs
 │
 ├─ packages/            # Bibliotecas compartilhadas
 ├─ commitlint.config.js
 ├─ package.json         # Configurações globais
 └─ README.md
```

---

## 🚀 Tecnologias Principais

- **Backend:** Node.js, Express, PostgreSQL, node-pg-migrate
- **Frontend:** Next.js (React)
- **Testes:** Vitest
- **Padronização:** ESLint, Prettier, Commitlint (conventional commits)

---

## 🧹 Convenções de Commit

Este projeto segue o padrão **[Conventional Commits](https://www.conventionalcommits.org/)**.

O **commitlint** está configurado para validar mensagens automaticamente via **husky**.

---

## 📝 Licença

Este projeto está sob a licença MIT.
