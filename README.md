# 🏭 Apps Script Modern Stack Utils

Este repositório é a **Base de Conhecimento e Infraestrutura** para o desenvolvimento profissional de soluções no Google Apps Script.

Ele define uma arquitetura moderna baseada em:

- **TypeScript** (Backend robusto e tipado)
- **Tailwind CSS v4** (Frontend moderno e estilizado via Build)
- **Node.js Build System** (Compilação, Achatamento e Injeção de CSS)
- **Acessibilidade & Semântica** (Padrões A11y)

---

## 🗂 Documentação Oficial

Não tente adivinhar. Siga os guias abaixo para manter o padrão da fábrica.

### 1. 🚀 Começando um Projeto

Para configurar o ambiente do zero (Scaffolding), instalar dependências e criar a estrutura de pastas:
👉 [![](https://img.shields.io/badge/Leia_o_SETUP.md-blue.svg)](SETUP.md)

### 2. 📏 Regras e Padrões

Para entender a nomenclatura, estrutura de arquivos, onde salvar ícones e como funciona o Build:
👉 [![](https://img.shields.io/badge/Leia_o_CODING__STANDARDS.md-orange.svg)](./CODING_STANDARDS.md)

### 3. 🤖 Inteligência Artificial

Para instanciar o "Consultor Sênior" na sua IA favorita, copie o Prompt Mestre:
👉 [![](https://img.shields.io/badge/Copie_o_prompt__start.txt-blueviolet.svg)](./prompts/prompt_start.txt)

### 4. 🎨 Regras de UI (Opcional)

Se precisar de ajuda específica com sintaxe do Tailwind v4 ou Scriptlets:
👉 [![](https://img.shields.io/badge/Copie_o_prompt__ui__rules.txt-blueviolet.svg)](./prompts/prompt_ui_rules.txt)

---

## ⚡ Fluxo de Trabalho (Resumo)

1.  **Develop:** `npm run dev` (Monitora TS/HTML/CSS e sobe automático).
2.  **Deploy:** `npm run push` (Build manual e upload).
3.  **Icons:** Salve SVGs em `src/frontend/icons/` e use `<?!= include('Icon_Name') ?>`.

---

## 📝 Padrão de Commits (Conventional Commits)

Mantenha o histórico limpo seguindo o padrão:

| Prefixo     | Uso                 | Exemplo                                   |
| :---------- | :------------------ | :---------------------------------------- |
| `feat:`     | Nova funcionalidade | `feat: setup initial build pipeline`      |
| `fix:`      | Correção de bug     | `fix: tailwind injection logic`           |
| `docs:`     | Documentação        | `docs: update coding standards`           |
| `chore:`    | Manutenção técnica  | `chore: update npm dependencies`          |
| `refactor:` | Melhoria de código  | `refactor: move icons to separate folder` |

---

## ⚠️ Nota Importante

Este repositório é uma **referência (Template/Knowledge Base)**.
Para novos projetos, **não clone este repo**. Crie uma pasta nova e siga o guia do **SETUP.md** para copiar apenas os arquivos de configuração necessários (`build.js`, `tsconfig.json`, etc).
