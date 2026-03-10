# Component_HeadSetup.html

This component defines the **canonical `<head>` structure** for Google Apps Script HTML applications using this stack.

It is intentionally **minimal and orchestral**, acting as a central integration point for mandatory system-level configuration and optional project-level extensions.

---

## Purpose

`Component_HeadSetup.html` exists to:

- Guarantee a correct and stable `<head>` configuration for GAS
- Centralize mandatory meta tags and runtime requirements
- Inject the compiled Tailwind CSS output
- Serve as a **controlled extension point** for project-specific `<head>` logic

It does **not** contain project decisions.

---

## Design Principles

### 1. Orchestration, not configuration

This component **does not define**:

- fonts
- favicons
- analytics
- SEO metadata
- project branding

Instead, it **includes** other components that may define those concerns.

---

### 2. GAS-first constraints

Google Apps Script imposes strict limitations on HTML rendering.

This component ensures:

- `<base target="_top">` is always present
- charset and viewport are correctly defined
- all CSS is injected inline (no external stylesheets at runtime)

---

### 3. Explicit extension via includes

Project-specific head logic must be injected via dedicated components, for example:

- `Component_Fonts.html`
- `Component_Favicons.html`
- `Component_Meta_Project.html`
- `Component_Head_Extensions.html`

These components are included directly by `Component_HeadSetup.html`.

This approach avoids silent coupling and keeps responsibilities explicit.

---

## Tailwind CSS Integration

Tailwind CSS is **not loaded via CDN**.

Instead:

- Tailwind is compiled locally using the v4 CLI
- The final CSS is injected inline via:

```html
<?!= include('Tailwind_CSS'); ?>
```

The `Tailwind_CSS.html` file is **generated automatically** by the build pipeline and must never be edited manually.

---

## What This Component Guarantees

- Valid `<head>` structure for GAS
- Stable integration point for system CSS
- Predictable place to extend head logic
- Reusability across multiple applications

---

## Modification Rules

- This file should change rarely
- New responsibilities should be added via includes
- Direct project decisions inside this file are discouraged

When in doubt: extract to a new component and include it.

## Related Components

- `Tailwind_CSS.html` (generated)
- `Component_Fonts.html` (optional)
- `Component_Favicons.html` (optional)
- `Component_Meta_Project.html` (optional)

<details>
<summary>🇧🇷 <b>Ler em Português</b> <i>(Clique para expandir)</i></summary>

# Component_HeadSetup.html

Este componente define a **estrutura canônica do `<head>`** para aplicações HTML em Google Apps Script que utilizam esta stack.

Ele é intencionalmente **mínimo e orquestrador**, atuando como um ponto central de integração para configurações obrigatórias do sistema e extensões opcionais específicas de cada projeto.

---

## Objetivo

O `Component_HeadSetup.html` existe para:

- Garantir uma configuração correta e estável do `<head>` no GAS
- Centralizar meta tags obrigatórias e requisitos de runtime
- Injetar o CSS compilado do Tailwind
- Servir como um **ponto de extensão controlado** para lógicas específicas de projeto no `<head>`

Ele **não contém decisões de projeto**.

---

## Princípios de Design

### 1. Orquestração, não configuração

Este componente **não define**:

- fontes
- favicons
- analytics
- metadados de SEO
- identidade visual do projeto

Em vez disso, ele **inclui** outros componentes responsáveis por essas decisões.

---

### 2. Prioridade às restrições do GAS

O Google Apps Script impõe limitações rígidas ao HTML.

Este componente garante que:

- `<base target="_top">` esteja sempre presente
- charset e viewport sejam corretamente definidos
- todo o CSS seja injetado inline (sem folhas externas em runtime)

---

### 3. Extensão explícita via includes

Lógicas específicas do `<head>` devem ser injetadas através de componentes dedicados, por exemplo:

- `Component_Fonts.html`
- `Component_Favicons.html`
- `Component_Meta_Project.html`
- `Component_Head_Extensions.html`

Esses componentes são incluídos diretamente pelo `Component_HeadSetup.html`.

Essa abordagem evita acoplamentos implícitos e mantém as responsabilidades explícitas.

---

## Integração com Tailwind CSS

O Tailwind CSS **não é carregado via CDN**.

Em vez disso:

- o Tailwind é compilado localmente usando a CLI v4
- o CSS final é injetado inline através de:

```html
<?!= include('Tailwind_CSS'); ?>
```

O arquivo `Tailwind_CSS.html` é gerado automaticamente pelo pipeline de build e nunca deve ser editado manualmente.

---

## O Que Este Componente Garante

- Estrutura válida de `<head>` para o GAS
- Ponto estável de integração do CSS do sistema
- Local previsível para extensão da lógica do `<head>`
- Reutilização entre múltiplas aplicações

---

## O Que Este Componente Não Garante

- Identidade visual
- Escolha tipográfica
- SEO completo
- Metadados específicos de projeto

Essas responsabilidades pertencem a **includes de nível de projeto**, não a este template.

## Regras de Modificação

- Este arquivo deve mudar **raramente**
- Novas responsabilidades devem ser adicionadas via includes
- Decisões diretas de projeto neste arquivo são desencorajadas

Em caso de dúvida: extraia para um novo componente e faça o include.

## Componentes Relacionados

- `Tailwind_CSS.html` (gerado)
- `Component_Fonts.html` (opcional)
- `Component_Favicons.html` (opcional)
- `Component_Meta_Project.html` (opcional)

</details>
