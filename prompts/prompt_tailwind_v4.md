# 🔒 Tailwind CSS v4 — AI CONSTRAINT PROMPT

You are operating inside a **strict Tailwind CSS v4+ environment**.

This project **does NOT use**:

- `tailwind.config.js`
- CDN builds
- Tailwind v3 or earlier APIs
- Deprecated or removed utility classes

All styling is **CSS-first**, using the official Tailwind v4 syntax.

---

## ✅ ALLOWED PATTERNS (MANDATORY)

You MUST:

- Use `@import "tailwindcss";`
- Define design tokens using `@theme { ... }` inside `input.css`
- Prefer **semantic tokens** over raw values
- Assume the CSS will be **inlined** into HTML (Google Apps Script runtime)

### ✅ SYNTAX RULES FOR @THEME TOKENS

When consuming tokens defined in `@theme`, use the **native utility class syntax**. Do NOT use arbitrary value syntax with parentheses or square brackets for theme variables.

- **Correct:** `bg-primary`, `text-secondary`, `font-sans`, `shadow-card`
- **Incorrect:** `bg-(--color-primary)`, `text-[var(--color-secondary)]`

_(Note: Use arbitrary parentheses syntax like `w-(--my-dynamic-width)` ONLY for dynamic inline variables NOT defined in `@theme`.)_

### Example (VALID):

```css
@import "tailwindcss";

@theme {
  --color-primary: #13335a;
  --radius-box: 0.5rem;
}
```

# ❌ FORBIDDEN PATTERNS (HARD STOP)

You MUST NOT, under any circumstance:

- Mention or generate `tailwind.config.js`

- Use `extend`, `theme()`, or JS-based configuration

- Suggest CDN usage

- Use arbitrary brackets for standard scales (e.g., ❌ p-[16px] instead of ✅ p-4)

- Use or invent legacy utilities such as:
  - `bg-opacity-*`

  - `text-opacity-*`

  - `ring-opacity-*`

  - `divide-opacity-*`

- Assume Tailwind v3 documentation or behavior

If you are unsure whether a class exists in v4:

👉 **DO NOT USE IT**

---

# 🧠 DECISION RULE

When generating styles:

1. Prefer tokens defined in `@theme`.

2. Prefer semantic naming (`bg-surface`, not `bg-gray-100`).

3. Prefer clarity over cleverness.

4. Prefer fewer utilities over verbose compositions.

If a style cannot be clearly justified,

**do not generate it.**

---

# 🧪 SELF-VALIDATION (MANDATORY)

Before outputting any CSS or HTML with Tailwind classes, you MUST internally verify:

- Does this class exist in Tailwind CSS v4?

- Is this behavior CSS-first (not config-based)?

- Would this break if `tailwind.config.js` does not exist?

If any answer is uncertain:

👉 **revise before answering.**

---

# 🚨 FINAL RULE

This project values **correctness over completeness**.

It is acceptable to say:

> “This requires confirmation in Tailwind CSS v4 documentation.”

It is NOT acceptable to hallucinate utilities or APIs.

You are constrained by this document.
