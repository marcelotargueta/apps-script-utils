# 🎨 UI ADD-ON PROMPT

## Frontend & UI Rules — Tailwind CSS v4 + GAS Scriptlets

> ⚠️ **IMPORTANTE — LEIA PRIMEIRO**  
> Este arquivo é um **PROMPT COMPLEMENTAR (ADD-ON)**.  
> Ele **NÃO substitui** e **NUNCA tem precedência** sobre:
>
> 1. `prompt_start.md` → Contrato-mestre (arquitetura, linguagem, formato)
> 2. `prompt_tailwind_v4.md` → Trava técnica de versão do Tailwind
>
> Use este prompt **APENAS** quando estiver gerando:
>
> - HTML
> - UI
> - Components
> - Pages
> - Scriptlets (`<? ?>`)
>
> Se houver conflito, **o prompt_start.md sempre vence**.

---

## 🧭 Contexto Técnico

- **CSS Engine:** Tailwind CSS **v4** (CLI, Build Local)
- **Design Tokens:** Definidos via `@theme` em `src/styles/input.css`
- **Runtime:** Google Apps Script (`HtmlService`)
- **Arquitetura:** HTML achatado (flattened) + includes globais

---

## 1️⃣ TAILWIND CSS v4 — REGRAS CRÍTICAS (NON-NEGOTIABLE)

### ✅ Definição no CSS (Design System)

Arquivo: `src/styles/input.css`

```css
@import "tailwindcss";

@theme {
  --color-primary: #13335a;
  --color-secondary: #42b9eb;
  --font-sans: "Montserrat", sans-serif;
  --shadow-card: 0 4px 6px rgb(0 0 0 / 0.1);
}
```

### ✅ Aplicação correta no HTML (Nativa do v4)

Quando variáveis são definidas no bloco `@theme` com os prefixos padrão (`--color-*`, `--font-*`, `--shadow-*`), o Tailwind v4 **automaticamente** cria as classes utilitárias.

Você DEVE usar a sintaxe nativa e limpa:

| Uso        | Exemplo Correto  |
| :--------- | :--------------- |
| Background | `bg-primary`     |
| Texto      | `text-secondary` |
| Fonte      | `font-sans`      |
| Sombra     | `shadow-card`    |

### ❌ NUNCA gere (Padrões Proibidos):

- `bg-[var(--color-primary)]` (Sintaxe legado do v3)
- `bg-(--color-primary)` (Uso incorreto de parênteses para variáveis já registradas no `@theme`)

_Nota: A sintaxe de parênteses `w-(--minha-var)` deve ser usada APENAS para variáveis inline arbitrárias que NÃO estão no `@theme`._

---

## 2️⃣ HTML SEMÂNTICO & ACESSIBILIDADE (OBRIGATÓRIO)

> 🚨 **Acessibilidade NÃO é opcional**.

Sempre respeite o item **4.4 — HTML Semântico e Acessibilidade** do
`CODING_STANDARDS.md`.

### Regras inegociáveis:

- Use tags semânticas:
  - `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- Nunca use `<div>` para ações interativas
- Ações devem ser `<button>`
- Links devem ser `<a>`
- Inputs **devem** ter `<label>` ou `aria-label`
- Use utilitários como `sr-only` quando necessário

Se gerar UI sem semântica ou A11y, **a resposta está incorreta**.

---

## 3️⃣ ÍCONES (SVG INLINE — PADRÃO OBRIGATÓRIO)

#### 🚫 NÃO crie ícones inline dentro de páginas ou componentes.

### Padrão correto:

1. Cada ícone é **um arquivo separado**
2. Local obrigatório:

```bash
src/frontend/icons/Icon_Name.html
```

3. SVG puro, limpo:
   - Sem `width` / `height` fixos

   - Use `fill="currentColor"` ou `stroke="currentColor"`

### Uso correto em páginas/componentes:

```html
<?!= include('Icon_Save') ?>
```

#### ❌ Nunca gere:

- `<svg>` direto dentro de `Page_*.html`
- ícones via `<img>`
- ícones externos / CDN / Drive

---

## 4️⃣ SCRIPTLETS & PROPS (GAS HTML)

### Acesso a dados

Sempre utilize o objeto `props`.

#### ✅ Correto:

```html
<?= props.title ?>
```

#### ⚠️ Evite:

```html
<?= title ?>
```

### Tipos de scriptlet

| Tag           | Uso                        |
| ------------- | -------------------------- |
| `<? ... ?>`   | Lógica (if / for)          |
| `<?= ... ?>`  | Print com escape (texto)   |
| `<?!= ... ?>` | Print raw (HTML / include) |

---

## 5️⃣ XEMPLO DE COMPONENTE CORRETO E ZERO GAMBIARRAS

_(Lembre-se da regra do `prompt_start`: sem comentários de nome de arquivo no código gerado)_

**File:** `src/frontend/components/Component_Card.html`

**Description:** Componente de cartão padrão da UI.

```html
<section class="p-6 rounded-xl bg-color-app-bg shadow-(--shadow-card)">
  <h2 class="text-xl font-(--font-sans) text-(--color-primary)">
    <?= props.title ?>
  </h2>

  <? if (props.isActive) { ?>
  <span class="text-success">Ativo</span>
  <? } ?>
</section>
```

- ✔️ Semântico e Acessível
- ✔️ Tailwind v4 limpo (sem parênteses para variáveis de tema)
- ✔️ Props explícitos
- ✔️ Sem comentários HTML sujos no topo

---

## 🧠 Regra Final para a IA

Quando este prompt estiver ativo:

- Você está **no modo UI**
- Você **complementa** o `prompt_start.md`
- Você **respeita** o `prompt_tailwind_v4.md`
- Você **NÃO improvisa sintaxe**
- Você **NÃO ignora acessibilidade**
- Você **NÃO cria atalhos**

Se houver dúvida, **pergunte antes de gerar código**.
