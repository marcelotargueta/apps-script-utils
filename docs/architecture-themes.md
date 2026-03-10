# 🎨 Themes — Visual Identity Layer

This folder contains **project- or institution-specific visual identity**.

Everything here is **intentional, opinionated, and contextual**.

Unlike `base/`, themes are **not meant to be reused blindly**.
They are starting points, not universal solutions.

---

## 🎯 Purpose

The `themes/` layer defines:

- brand and institutional colors
- visual tone and hierarchy
- expressive shadows and radii
- optional motion and emphasis
- UI personality

Themes answer the question:

> “How should this application feel?”

---

## ✅ What BELONGS here

Valid theme responsibilities include:

- Primary / secondary brand palettes
- Accent and highlight colors
- Institutional typography choices
- Decorative shadows and borders
- Motion tokens (where applicable)
- Density or spacing preferences

All theme tokens should be **semantic**, not descriptive.

Good:

- `--color-primary`
- `--color-accent`
- `--shadow-card`

Avoid:

- `--blue-500`
- `--border-dark`

---

## ❌ What does NOT belong here

Themes must NOT:

- redefine base usability rules
- break accessibility contrast requirements
- introduce layout logic
- override structural HTML behavior
- reimplement neutral tokens already defined in `base/`

Themes extend the base — they do not replace it.

---

## 🧠 Design Rule

A theme should be **removable**.

If deleting a theme:

- breaks the application → ❌ wrong
- removes personality only → ✅ correct

Themes decorate infrastructure;  
they must never become infrastructure.

---

## 🔄 Change Policy

Themes are expected to evolve.

However:

- changes should be deliberate
- names must remain semantic
- unused tokens should be removed

A theme is successful when its intent is obvious by reading its tokens.

<details>
<summary>🇧🇷 <b>Ler em Português</b> <i>(Clique para expandir)</i></summary>

# 🎨 Temas — Camada de Identidade Visual

Esta pasta contém a **identidade visual específica de cada projeto ou instituição**.

Tudo que existe aqui é **intencional, opinativo e contextual**.

Diferente da pasta `base/`, os temas **não devem ser reutilizados sem análise**.
Eles são pontos de partida, não soluções universais.

---

## 🎯 Propósito

A camada `themes/` define:

- cores institucionais e de marca
- tom visual e hierarquia
- sombras e raios expressivos
- movimento e ênfase (quando aplicável)
- personalidade da interface

Temas respondem à pergunta:

> “Como esta aplicação deve ser percebida?”

---

## ✅ O que PERTENCE aqui

Responsabilidades válidas de um tema:

- Paletas primária e secundária
- Cores de destaque (accent)
- Escolhas tipográficas institucionais
- Sombras e bordas decorativas
- Tokens de movimento
- Preferências de densidade ou espaçamento

Todos os tokens de tema devem ser **semânticos**, nunca descritivos.

Bom:

- `--color-primary`
- `--color-accent`
- `--shadow-card`

Evite:

- `--blue-500`
- `--border-dark`

---

## ❌ O que NÃO pertence aqui

Temas NÃO devem:

- redefinir regras básicas de usabilidade
- quebrar requisitos de contraste e acessibilidade
- introduzir lógica de layout
- sobrescrever comportamento estrutural do HTML
- reimplementar tokens neutros já definidos em `base/`

Temas estendem a base — não a substituem.

---

## 🧠 Regra de Design

Um tema deve ser **removível**.

Se ao remover um tema:

- a aplicação quebra → ❌ errado
- apenas a identidade visual some → ✅ correto

Temas decoram a infraestrutura;  
nunca devem se tornar a infraestrutura.

---

## 🔄 Política de Evolução

Temas são esperados evoluir com o projeto.

Ainda assim:

- mudanças devem ser conscientes
- nomes devem permanecer semânticos
- tokens não utilizados devem ser removidos

Um tema é bem-sucedido quando sua intenção é clara apenas lendo seus tokens.

</details>
