# 🎨 Styles Governance — Tailwind CSS v4+

This folder defines **how styling decisions are made** in this stack.

It does **not** provide a ready-made CSS solution.  
It provides **structure, rules, and intent**.

---

## ✔️ What this is

- A governance layer for **Tailwind CSS v4+**
- A curated system for style decisions
- A protection against inconsistent or improvised CSS
- A reference for humans **and** AI-assisted workflows

## ❌ What this is NOT

- A CSS framework
- A theme collection ready for production
- A place to blindly copy files from
- A substitute for design decisions

---

## 🧭 Layer Model

Styling in this stack is organized into **intentional layers**:

### 🧱 Base

Neutral, reusable, and institution-agnostic styles.

- Safe to copy into any new project
- Contains no branding or visual identity
- Changes rarely and deliberately

### 🎨 Themes

Examples of visual identity implementations.

- Institutional or product-oriented
- Always require review and adaptation
- Never meant to be used as-is

### 💡 References

Ideas, tokens, and inspiration.

- Color semantics
- Spacing or motion concepts
- Not production-ready CSS

---

## ⚠️ AI Usage Policy

AI-generated CSS is treated as **untrusted input**.

Before accepting any style:

- Verify **Tailwind CSS v4+ compatibility**
- Reject `tailwind.config.js` usage
- Reject deprecated or removed utility classes
- Prefer semantic tokens over raw values

> If a style cannot be clearly explained,  
> it does not belong here.

---

## 📌 Rule of Thumb

This folder exists to **reduce future decisions**,  
not to multiply them.

If a file increases ambiguity, it fails its purpose.

---

## 🔄 Evolution

This governance is expected to evolve organically.

New projects may introduce new patterns,  
but every addition must respect clarity, intent, and restraint.

---

<details>
<summary>🇧🇷 <b>Ler em Português</b> <i>(Clique para expandir)</i></summary>

## 🎨 Governança de Estilos — Tailwind CSS v4+

Esta pasta define **como as decisões de estilo são tomadas** nesta stack.

Ela **não** fornece uma solução CSS pronta.  
Ela fornece **estrutura, regras e intenção**.

### ✔️ O que isso é

- Uma camada de governança para **Tailwind CSS v4+**
- Um sistema curado para decisões de estilo
- Uma proteção contra CSS inconsistente ou improvisado
- Uma referência para fluxos de trabalho humanos **e** assistidos por IA

### ❌ O que isso NÃO é

- Um framework CSS
- Uma coleção de temas pronta para produção
- Um lugar para copiar arquivos cegamente
- Um substituto para decisões de design

### 🧭 Modelo de Camadas

A estilização nesta stack é organizada em **camadas intencionais**:

#### 🧱 Base

Estilos neutros, reutilizáveis e agnósticos a instituições.

- Seguro para copiar para qualquer novo projeto
- Não contém branding ou identidade visual
- Muda raramente e de forma deliberada

#### 🎨 Temas

Exemplos de implementações de identidade visual.

- Institucionais ou orientados a produtos
- Sempre exigem revisão e adaptação
- Nunca devem ser usados "como estão"

#### 💡 Referências

Ideias, tokens e inspiração.

- Semântica de cores
- Conceitos de espaçamento ou movimento
- Não é CSS pronto para produção

### ⚠️ Política de Uso de IA

O CSS gerado por IA é tratado como **entrada não confiável** (untrusted input).

Antes de aceitar qualquer estilo:

- Verifique a **compatibilidade com Tailwind CSS v4+**
- Rejeite o uso de `tailwind.config.js`
- Rejeite classes utilitárias depreciadas ou removidas
- Prefira tokens semânticos em vez de valores brutos

> Se um estilo não pode ser claramente explicado,  
> ele não pertence a este lugar.

### 📌 Regra Prática (Regra de Ouro)

Esta pasta existe para **reduzir decisões futuras**,  
não para multiplicá-las.

Se um arquivo aumenta a ambiguidade, ele falha em seu propósito.

### 🔄 Evolução

Espera-se que esta governança evolua organicamente.

Novos projetos podem introduzir novos padrões,  
mas cada adição deve respeitar a clareza, a intenção e a moderação.

</details>
