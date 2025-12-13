# ✨ Coding Standards & Architecture (Modern Stack)

Este documento define os padrões para o desenvolvimento profissional em Google Apps Script, utilizando **TypeScript, VS Code, Tailwind CSS v4 e Build System Automatizado**.

---

## 1️⃣ Princípios Fundamentais

### 1.1 Idioma (English First)

Todo o código e artefatos do projeto **devem** ser escritos em inglês.

- **Escopo:** Nomes de arquivos, variáveis, funções, classes, logs e commits.
- **Documentação (JSDoc):** Bilíngue. As tags principais (`@param`, `@returns`) em Inglês. Adicione tags com sufixo `_pt` para português.
- **Justificativa:** Consistência com a sintaxe JS/TS e APIs do Google.

### 1.2 Tipagem Forte (TypeScript)

Não utilizamos JavaScript puro (`.gs`) no backend. O código fonte é **TypeScript (`.ts`)**.

- Evite `any`. Use Interfaces e Tipos explícitos.
- O código é transpilado para JS compatível com GAS pelo script de build.

---

## 2️⃣ Estrutura de Diretórios e Build System

A arquitetura utiliza um pipeline de build local para transformar TypeScript e Tailwind CSS em arquivos compatíveis com o Google Apps Script.

### 2.1 Árvore de Arquivos

```text
project-root/
├── .clasp.json          # Config: "rootDir": "./app"
├── .gitignore           # Ignora /app, node_modules, output.css
├── package.json         # Scripts de automação (build, push, dev)
├── tsconfig.json        # Configuração TypeScript
├── build.js             # Script Node.js: Limpa -> Compila TS -> Flattening -> CSS Inline
├── app/                 # [DIST] Arquivos finais achatados (Upload via CLASP)
└── src/                 # [SOURCE] Código Fonte Real
    ├── appsscript.json  # Manifesto
    ├── styles/          # Estilização
    │   ├── input.css    # Configuração Tailwind (@theme)
    │   └── output.css   # [GERADO] CSS Compilado (Injetado no Build)
    ├── backend/         # Lógica do Servidor (.ts)
    │   ├── api/         # Entry Points
    │   ├── controllers/ # Lógica de Negócio
    │   └── ...
    └── frontend/        # Interface (.html)
        ├── pages/       # Telas Completas
        ├── components/  # Fragmentos (HeadSetup, Navbar)
        └── icons/       # [NOVO] SVGs Componentizados (Inline)
```

### 2.2 O Processo de Build (Flattening & Injection)

1. **TypeScript:** Transpilado para JS.
2. **CSS:** O Tailwind CLI compila `src/styles/input.css` para `output.css`.
3. **Injeção:** O script `build.js` lê o `output.css`, envolve em tags `<style>` e cria o arquivo `app/Tailwind_CSS.html`.
4. **Achatamento:** Todos os arquivos de `src` (HTMLs e JSs transpilados) são movidos para a raiz de `app`.

### 2.3 Automação (NPM Scripts)

O fluxo de desenvolvimento é controlado via `package.json`:

- `css`: Compila o Tailwind (`input.css` -> `output.css`).
- `build`: Roda `css` e depois executa `node build.js`.
- `push`: Executa `build` e sobe para o Google (`clasp push --force`).
- `dev`: Monitora alterações em `.ts`, `.html`, `.json`, `.css` e executa `push` automaticamente.

### 2.4 Estratégia de Estilização

- **Não usamos CDN** para o Tailwind em produção (performance e estabilidade).
- O CSS final é incluído nas páginas através do componente gerado:

`<?!= include('Tailwind_CSS'); ?>` (geralmente dentro do `Component_HeadSetup.html`).

## 3️⃣ Padrão para Backend (TypeScript)

### 3.1 Organização e Nomenclatura (`Prefix_PascalCase.ts`)

| Pasta (src/backend/) | Prefixo             | Descrição                                      | Exemplo                          |
| :------------------- | :------------------ | :--------------------------------------------- | :------------------------------- |
| `api/ `              | `API_` ou `Server_` | Entry points (`doGet`, `run`). Funções soltas. | `Server_Main.ts`, `API_Users.ts` |
| `controllers/`       | `Controller_`       | Regras de negócio (Classes Estáticas).         | `Controller_Budget.ts`           |
| `dao/`               | `DAO_`              | Acesso a dados (Sheets, Drive).                | `DAO_Sheets.ts`                  |
| `models/`            | `Model_`            | Interfaces e Types.                            | `Model_User.ts`                  |
| `utils/`             | `Utils_`            | Helpers genéricos.                             | `Utils_Date.ts`                  |

### 3.2 Arquitetura de Código (Sem Modules em Runtime)

Como não usamos Webpack, não podemos usar `import/export` para lógica (apenas para Tipos).

- **Lógica:** Use **Classes Estáticas** ou Namespaces. Elas são globais no GAS.
- **Entry Points:** Funções na pasta `api/` expostas ao Frontend.

#### Exemplo de Controller:

```typescript
// src/cackend/controller/Controller_User.ts
class Controller_User {
  static getUser(email: string): UserProfile {
    return DAO_Sheets.findRow(email); // Chama DAO globalmente
  }
}
```

#### Exemplo de API:

```TypeScript
// src/backend/api/API_User.ts
function public_getUserData(): UserProfile {
  return Controller_User.getUser(Session.getActiveUser().getEmail());
}
```

## 4️⃣ Padrão para Frontend (HTML)

### 4.1 Organização e Nomenclatura (`Prefix_PascalCase.html`)

| Pasta (`src/frontend/`) | Prefixo      | Descrição                 | Exemplo                 |
| :---------------------- | :----------- | :------------------------ | :---------------------- |
| `pages/`                | `Page_`      | Telas completas.          | `Page_Dashboard.html`   |
| `components/`           | `Component_` | Fragmentos reutilizáveis. | `Component_Navbar.html` |
| `(raiz)`                | n/a          | Entry point inicial.      | `Index.html`            |

### 4.2 Componentização (`include`)

Use a função helper `include` para compor telas.

- Chame sempre pelo **Nome do Arquivo** (sem caminhos).
- Passe dados via objeto de props.

```Html
<!-- Page_Dashboard.html -->
<!DOCTYPE html>
<html>
  <head>
    <?!= include('Component_HeadSetup'); ?>
  </head>
  <body>
    <?!= include('Component_Navbar', { user: props.user }); ?>
    <main class="p-4">
      <!-- Conteúdo -->
    </main>
  </body>
</html>
```

### 4.3 Configuração Obrigatória (`Component_HeadSetup.html`)

Todo projeto deve ter este arquivo injetando o` Tailwind_CSS`.

### 4.4 HTML Semântico e Acessibilidade (Obrigatório)

Evite a "Sopa de Divs". Use tags semânticas para melhor navegação e acessibilidade.

- **Estrutura:** `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.
- **Ações:** Botões são `<button>`, Links são `<a>`. Não use `<div>` clicável sem `role="button"`.
- **Formulários:** Todo input deve ter um `<label>` (ou `aria-label`).
- **Tailwind:** Utilize classes como `sr-only` para textos exclusivos de leitores de tela.

### 4.5 Sistema de Ícones (SVG Inline Componentizado)

Não utilizamos imagens externas ou Drive para ícones de UI.

1. **Origem:** Exporte do Figma/Material Symbols como SVG.
2. **Otimização:** Limpe o SVG (remova width/height fixos).
3. **Local:** Salve em `src/frontend/icons/Icon_Nome.html`.
4. **Estilo:** Use `fill="currentColor"` ou `stroke="currentColor"` no SVG para herdar a cor do texto do Tailwind.
5. **Uso:** `<?!= include('Icon_Save') ?>`

## 5️⃣ Convenções de Código

### 5.1 Estilo e Case

- **Variáveis/Funções:** `camelCase` (ex: `userData`, `isValid`).
- **Classes/Interfaces:** `PascalCase` (ex: `UserController`, `UserProfile`).
- **Constantes:** `UPPER_SNAKE_CASE` (ex: `MAX_ROWS`).
- **HTML IDs:** `kebab-case` (ex: `id="submit-btn"`).
- **HTML Classes:** Utilitários Tailwind (ex: `flex gap-2`). Classes JS com prefixo `js-` (ex: `js-action-save`).

### 5.2 Documentação (JSDoc Bilíngue)

Obrigatório para todas as funções públicas e métodos de classes.

```TypeScript
/**
 * Calculates the total buget based on current expenses.
 *
 * @param {number} taxRate - The applicable tax rate.
 * @returns {number} The final calculated value.
 *
 * @description_pt Calcula o orçamento total com base nas despesas atuais.
 * @param_pt {number} taxRate - A taxa de imposto aplicada.
 * @returns_pt {number} O valor final calculado
 */
function calculateBudget(taxRate: number): number { ... }
```

## 6️⃣ Nomenclatura de Repositórios

Para compatibilidade com Git/CLASP:

- **Google Project Name:** `Area_Product - AppName - ENV` (ex: `Fin_Budget - WebApp - PROD`)
- **GitHub/Folder Name:** `kebab-case` (ex: `fin-budget-webapp-prod`)

---

## 7️⃣ Configurações de Referência (Boilerplate)

Para garantir a reprodutibilidade do ambiente, utilize as configurações abaixo.

### 7.1 `package.json` (Scripts & Deps)

Os scripts de automação são padronizados para o fluxo de desenvolvimento contínuo.

```json
{
  "scripts": {
    "css": "npx @tailwindcss/cli -i ./src/styles/input.css -o ./src/styles/output.css",
    "css:watch": "npx @tailwindcss/cli -i ./src/styles/input.css -o ./src/styles/output.css --watch",
    "build": "npm run css && node build.js",
    "push": "npm run build && npx clasp push --force",
    "dev": "npx nodemon --watch src -e ts,html,json,css --exec \"npm run push\""
  },
  "devDependencies": {
    "@google/clasp": "^2.4.2",
    "@tailwindcss/cli": "^4.0.0",
    "@types/google-apps-script": "^1.0.83",
    "nodemon": "^3.1.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.3.3"
  }
}
```

### 7.2 `tsconfig.json` (Configuração TypeScript)

Garante a compilação correta para o runtime do Apps Script (ESNext).

```JSON
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["ESNext"],
    "module": "None",
    "moduleResolution": "Node",
    "strict": true,
    "noImplicitAny": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  },
  "include": ["src/**/*"]
}
```

### 7.3 `.clasp.json`

Aponta para a pasta de distribuição gerada.

```JSON
{
  "scriptId": "YOUR_SCRIPT_ID",
  "rootDir": "./app"
}
```
