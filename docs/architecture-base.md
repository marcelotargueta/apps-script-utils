# 🧱 Base Styles — Tailwind CSS v4+

This folder contains **neutral, reusable, and brand-agnostic** style foundations.

Everything here is designed to be:

- copied safely into new projects
- stable over time
- independent from visual identity

If a style expresses _branding_, _personality_, or _visual opinion_,  
**it does not belong here**.

## 🎯 Purpose

The `base/` layer defines:

- global design tokens
- default typography rules
- neutral surfaces and layout primitives
- accessibility-safe defaults

Its goal is to **reduce decision-making**, not to express design.

## ✅ What BELONGS here

Examples of valid base concerns:

- Semantic color tokens (without branding)
  - `--color-surface`
  - `--color-text-primary`
- Default font family assignment
- Global background and text color
- Neutral radii and shadow primitives
- Accessibility-friendly contrast defaults

These rules should make **any UI usable**, not beautiful.

## ❌ What does NOT belong here

Hard exclusions:

- Brand colors
- Institutional palettes
- Product-specific spacing
- Decorative shadows
- Animations with personality
- Marketing-driven visual choices

Those belong in `themes/`, not here.

## 🧠 Design Rule

A good test:

> If you removed all files in `themes/`,  
> the application should still be **usable and readable**.

If removing `base/` breaks usability,  
this folder is doing its job.

## 🔄 Change Policy

Changes in `base/` must be:

- rare
- intentional
- reviewed carefully

Every modification here impacts **all future projects**.
Treat this folder as **infrastructure**, not decoration.

---

<details>
<summary>🇧🇷 <b>Ler em Português</b> <i>(Clique para expandir)</i></summary>

## 🧱 Estilos Base — Tailwind CSS v4+

Esta pasta contém fundações de estilo **neutras, reutilizáveis e agnósticas a marcas**.

Tudo aqui é projetado para ser:

- copiado com segurança para novos projetos
- estável ao longo do tempo
- independente de identidade visual

Se um estilo expressa _branding_, _personalidade_ ou _opinião visual_,  
**ele não pertence a este local**.

### 🎯 Propósito

A camada `base/` define:

- design tokens globais
- regras de tipografia padrão
- superfícies neutras e primitivas de layout
- padrões seguros para acessibilidade

Seu objetivo é **reduzir a tomada de decisões**, não expressar design.

### ✅ O que PERTENCE a este local

Exemplos de responsabilidades válidas da base:

- Tokens de cores semânticas (sem branding)
  - `--color-surface`
  - `--color-text-primary`
- Atribuição de família de fontes padrão
- Cor global de fundo e de texto
- Primitivas neutras de raios (bordas) e sombras
- Padrões de contraste amigáveis à acessibilidade

Estas regras devem tornar **qualquer UI usável**, não bonita.

### ❌ O que NÃO pertence a este local

Exclusões estritas:

- Cores de marca
- Paletas institucionais
- Espaçamentos específicos de produtos
- Sombras decorativas
- Animações com personalidade
- Escolhas visuais voltadas ao marketing

Esses itens pertencem a `themes/`, não aqui.

### 🧠 Regra de Design

Um bom teste:

> Se você removesse todos os arquivos em `themes/`,  
> a aplicação ainda deveria ser **usável e legível**.

Se remover a `base/` quebrar a usabilidade,  
esta pasta está cumprindo o seu papel.

### 🔄 Política de Mudança

Mudanças em `base/` devem ser:

- raras
- intencionais
- revisadas cuidadosamente

Cada modificação aqui impacta **todos os projetos futuros**.
Trate esta pasta como **infraestrutura**, não como decoração.

</details>
