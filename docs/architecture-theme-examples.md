# 🧪 Theme Examples — Exploratory & Educational

This document covers **isolated, experimental theme fragments**.
Examples are **not production-ready themes**. They exist to **explore ideas**, not to define standards.

## 🎯 Purpose

The examples layer exists to:

- experiment with design token strategies
- explore naming conventions
- compare alternative approaches
- document trade-offs and reasoning

Examples answer the question:

> “What are the possible ways to approach this?”

## 🧠 Case Study: Color Token Strategies

Colors are a common source of inconsistency. Here we compare two approaches:

### Strategy A — Scale-Based Tokens

A familiar approach inspired by traditional design systems (e.g., `--color-primary-100` to `--color-primary-900`).

- **Pros:** Familiar to designers, flexible for detailed UI states.
- **Cons:** Encourages visual guessing over semantic thinking, harder to refactor globally.

### Strategy B — Intent-Based Tokens

A semantic-first approach focused on meaning (e.g., `--color-primary`, `--color-primary-muted`).

- **Pros:** Strong semantic clarity, easier long-term maintenance, safer for accessibility.
- **Cons:** Less granular control, requires discipline.

**Design Takeaway:** Color tokens should describe **intent**, not appearance. If you need to remember _what a color looks like_ to use it, the token name is probably wrong.

## ❌ What Examples Are NOT

Examples must NOT:

- represent full visual identities
- be copied blindly into production
- override base usability rules

This is a **sandbox**, not a library.

---

<details>
<summary>🇧🇷 <b>Ler em Português</b> <i>(Clique para expandir)</i></summary>

## 🧪 Exemplos de Temas — Exploratório & Educacional

Este documento aborda **fragmentos de temas isolados e experimentais**.
Exemplos **não são temas prontos para produção**. Eles existem para **explorar ideias**, não para definir padrões.

### 🎯 Propósito

A camada de exemplos existe para:

- experimentar estratégias de design tokens
- explorar convenções de nomenclatura
- comparar abordagens alternativas
- documentar prós, contras e raciocínios

Exemplos respondem à pergunta:

> “Quais são as formas possíveis de abordar isso?”

### 🧠 Estudo de Caso: Estratégias de Tokens de Cor

As cores são uma fonte comum de inconsistência. Aqui comparamos duas abordagens:

#### Estratégia A — Tokens Baseados em Escala

Uma abordagem familiar inspirada em design systems tradicionais (ex: `--color-primary-100` a `--color-primary-900`).

- **Prós:** Familiar para designers, flexível para estados detalhados de UI.
- **Contras:** Encoraja "adivinhação visual" em vez de pensamento semântico, mais difícil de refatorar globalmente.

#### Estratégia B — Tokens Baseados em Intenção

Uma abordagem com foco semântico (ex: `--color-primary`, `--color-primary-muted`).

- **Prós:** Forte clareza semântica, manutenção de longo prazo mais fácil, mais seguro para acessibilidade.
- **Contras:** Menor controle granular, exige disciplina.

**Conclusão de Design:** Tokens de cor devem descrever **intenção**, não aparência. Se você precisa lembrar _como uma cor se parece_ para usá-la, o nome do token provavelmente está errado.

### ❌ O que Exemplos NÃO são

Exemplos NÃO devem:

- representar identidades visuais completas
- ser copiados cegamente para produção
- sobrescrever regras básicas de usabilidade

Este é um **sandbox** (ambiente de testes), não uma biblioteca.

</details>
