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
    │   ├── api/         # Entry Points (O Carteiro)
    │   ├── controllers/ # Regras de Negócio (O Cérebro)
    │   ├── dao/         # Acesso a Dados (O Braço Mecânico)
    │   └── utils/       # Helpers genéricos (ex: Utils_Env.ts)
    ├── frontend/        # Interface (.html)
    │   ├── pages/       # Telas Completas
    │   ├── components/  # Fragmentos (HeadSetup, Navbar)
    │   ├── store/       # SSU: Única fonte da verdade (Estado global e SSR)
    │   ├── services/    # SSU: Comunicação exclusiva com backend (RPC)
    │   ├── ui/          # SSU: Controladores de DOM, Eventos e Renders
    │   └── icons/       # SVGs Componentizados (Inline)
    └── types/           # Contratos e Tipagens globais (ex: index.d.ts)
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
| `utils/`             | `Utils_`            | Helpers genéricos.                             | `Utils_Date.ts`                  |

### 3.2 Arquitetura de Código (Sem Modules em Runtime)

Como não usamos Webpack, não podemos usar `import/export` para lógica (apenas para Tipos).

- **Lógica:** Use **Classes Estáticas** ou Namespaces. Elas são globais no GAS.
- **Entry Points:** Funções na pasta `api/` expostas ao Frontend.

### 3.3 A Tríade de Domínio (Separação de Responsabilidades)

Para garantir a escalabilidade e evitar refatorações destrutivas, o backend é estritamente dividido em três camadas para cada domínio. Todo fluxo de dados deve cruzar as camadas de forma unidirecional (API -> Controller -> DAO).

**1. A Camada API (Entry Point)**

- **Regra:** Apenas recebe a requisição do Frontend e delega.
- ❌ **Proibido:** Conter regras de negócio, cálculos ou acesso a banco de dados.

```typescript
// Exemplo: src/backend/api/API_User.ts
function public_saveUser(payload: UserDTO): boolean {
  return Controller_User.processNewUser(payload);
}
```

**2. A Camada Controller (Regra de Negócio)**

- **Regra:** Executa validações, orquestra lógica e chama os DAOs.
- ❌ **Proibido:** Acessar diretamente APIs do Google (`SpreadsheetApp`, `Jdbc`) para manipular dados.

```typescript
// Exemplo: src/backend/controllers/Controller_User.ts
class Controller_User {
  static processNewUser(payload: UserDTO): boolean {
    if (!payload.email) throw new Error("Email é obrigatório.");
    return DAO_User.insert(payload);
  }
}
```

**3. A Camada DAO (Acesso a Dados)**

- **Regra:** Acesso exclusivo ao banco de dados (Sheets, BigQuery, Firestore, etc.).
- ❌ **Proibido:** Conter lógica de negócio ou validações de permissão.

```typescript
// Exemplo: src/backend/dao/DAO_User.ts
class DAO_User {
  static insert(data: UserDTO): boolean {
    const sheet = SpreadsheetApp.openById(Utils_Env.dbId).getSheetByName(
      "Users",
    );
    sheet.appendRow([data.email, data.name]);
    return true;
  }
}
```

### 3.4 Gerenciamento de Segredos e IDs (O Cofre Tipado)

Nunca salve IDs de planilhas, tokens de API ou chaves secretas diretamente no código-fonte (Hardcoded). O projeto utiliza a arquitetura de "Cofre Tipado".

1. **Configuração:** Os valores reais são salvos manualmente no painel do Google Apps Script em _Configurações do Projeto > Propriedades do script_.
2. **Consumo:** Os valores são lidos através da classe `Utils_Env.ts`, que garante tipagem forte e validação de existência.

```typescript
// ✅ CORRETO:
const sheet = SpreadsheetApp.openById(Utils_Env.spreadsheetId);

// ❌ INCORRETO:
const sheet = SpreadsheetApp.openById("1abc123...");
```

## 4️⃣ Padrão para Frontend (Vanilla JS + Tailwind v4)

Para garantir escalabilidade e manutenção no ambiente engessado do `HtmlService`, o JavaScript do cliente (Frontend) DEVE obrigatoriamente seguir a arquitetura State-Service-UI (SSU). É expressamente **PROIBIDO** misturar chamadas de backend com manipulação de DOM no mesmo arquivo.

### 4.1 Organização de Arquivos (`Prefix_Nome.html`)

| Pasta (src/frontend/) | Prefixo      | Descrição                                        |
| :-------------------- | :----------- | :----------------------------------------------- |
| `pages/`              | `Page_`      | Telas completas da aplicação.                    |
| `components/`         | `Component_` | Templates HTML puros para clonagem ou inclusão.  |
| `store/`              | `Store_`     | Única Fonte da Verdade. Variáveis globais/SSR.   |
| `services/`           | `Service_`   | Comunicação pura com o Backend (`RPC.call()`).   |
| `ui/`                 | `UI_`        | Controladores de DOM, Event Listeners e Renders. |
| `icons/`              | `Icon_`      | SVGs inline estritamente componentizados.        |

**3. A Camada UI (UI_Dominio.html)**

- É o "Maestro" da tela. Ele busca os dados no `Service_`, salva no `Store_` (ou Cache Local), e renderiza o HTML.
- É responsável pelo feedback visual (Desabilitar botões, mostrar Spinners e Toasts).
- Favorece a clonagem de templates (`<template id="tmpl-card">`) ao invés de concatenação massiva de strings.

```JavaScript
// Exemplo do Fluxo Perfeito na UI:
async function carregarLista() {
   // 1. Feedback visual inicial
   mostrarSpinner();
   try {
      // 2. Delega a rede para o Service
      const dados = await Service_User.getUsers();
      // 3. Salva no Store/Cache
      STATE.users = dados;
      // 4. Renderiza a tela
      renderizarTabela(dados);
   } catch (e) {
      mostrarErro(e.message);
   } finally {
      esconderSpinner();
   }
}
```

### 4.2 A Tríade SSU (Regras Inegociáveis)

**1. A Camada Store (`Store_App.html`)**

- Armazena dados globais que precisam ser acessados por múltiplos componentes.
- Utiliza Server-Side Scriptlets (`<?= ?>`) para injeção inicial de dados (Performance).
- ❌ **Proibido:** Fazer qualquer manipulação de DOM (`document.getElementById`).

**2. A Camada Service (`Service_Dominio.html`)**

- Abstrai as chamadas de rede em `Promises`.
- ❌ **Proibido:** Conter lógica visual (spinners), tratar erros visualmente (toasts) ou alterar o DOM.

```javascript
// Exemplo Correto:
const Service_User = {
  getUsers: async () => await RPC.call("public_getUsers"),
};
```

### 4.3 Componentização (`include`)

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

### 4.4 Componentes Burros e Delegação de Eventos (Event Delegation)

A arquitetura proíbe terminantemente a criação de Single File Components (SFCs) com lógica acoplada no estilo de frameworks modernos. No ambiente Vanilla JS, os componentes são **exclusivamente visuais**.

- **Regra de Ouro (Dumb Components):** É **PROIBIDO** o uso de tags `<script>` dentro de qualquer arquivo `Component_*.html`. Eles devem conter apenas HTML semântico e classes Tailwind v4.
- **SSU Orientado a Domínio:** As camadas `Store_`, `Service_` e `UI_` pertencem a um **Domínio/Tela** (ex: `UI_WorkOrders`), **NUNCA** a um componente específico. Não crie `Service_CardWork` ou `UI_CardWork`.
- **Delegação de Eventos:** Para dar vida a componentes clonados ou injetados dinamicamente, a camada `UI_` do domínio ou um utilitário global (ex: `UI_Shared.html`) deve utilizar **Delegação de Eventos**. Adicione um único ouvinte global (`document.addEventListener`) escutando por `data-attributes` (ex: `data-action="save"`) ou classes prefixadas com `js-` (ex: `js-btn-save`).
- **Comunicação Segura:** Sob nenhuma hipótese um Componente pode invocar diretamente o backend (ex: `google.script.run`). Toda comunicação de rede flui obrigatoriamente pela camada `Service_` via `RPC.call()`.

### 4.5 Configuração Obrigatória (`Component_HeadSetup.html`)

Todo projeto deve ter este arquivo injetando o` Tailwind_CSS`.

### 4.6 HTML Semântico e Acessibilidade (Obrigatório)

Evite a "Sopa de Divs". Use tags semânticas para melhor navegação e acessibilidade.

- **Estrutura:** `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.
- **Ações:** Botões são `<button>`, Links são `<a>`. Não use `<div>` clicável sem `role="button"`.
- **Formulários:** Todo input deve ter um `<label>` (ou `aria-label`).
- **Tailwind:** Utilize classes como `sr-only` para textos exclusivos de leitores de tela.

### 4.7 Sistema de Ícones (SVG Inline Componentizado)

Não utilizamos imagens externas ou Drive para ícones de UI.

1. **Origem:** Exporte do Figma/Material Symbols como SVG.
2. **Otimização:** Limpe o SVG (remova width/height fixos).
3. **Local:** Salve em `src/frontend/icons/Icon_Nome.html`.
4. **Estilo:** Use `fill="currentColor"` ou `stroke="currentColor"` no SVG para herdar a cor do texto do Tailwind.
5. **Uso:** `<?!= include('Icon_Save') ?>`

### 4.8 Comunicação Frontend -> Backend (RPC)

Não utilizamos o método legado `google.script.run.withSuccessHandler()` diretamente nas páginas. A stack possui um envelopador moderno baseado em Promises.

- **Utilitário:** O arquivo `Script_RPC.html` deve ser incluído no frontend.
- **Vantagens:** Permite o uso de `async/await` e blocos `try/catch` nativos.

```html
<script>
  async function loadUser() {
    try {
      // ✅ CORRETO
      const user = await RPC.call("API_GetUserData", "email@test.com");
      console.log(user);
    } catch (error) {
      console.error(error);
    }
  }
</script>
```

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

### 5.3 Metadados e Cabeçalhos de Arquivos (Evitando Bugs de Parser)

Para garantir que nossos artefatos sejam copiados perfeitamente da documentação/IA para a IDE, seguimos regras estritas para cabeçalhos de arquivos:

- **Arquivos TS e CSS:** Devem conter o caminho e a descrição no topo do arquivo usando os comentários nativos da linguagem (`// File: ...` ou `/* File: ... */`).
- **Arquivos HTML (Exceção Crítica):** Devido ao uso intensivo de GAS Scriptlets (`<?!= ?>`), arquivos HTML **não devem** conter comentários de cabeçalho (``) no topo do arquivo. O código deve começar diretamente na primeira tag válida (`<base>`, `<div>`, `<section>`, etc.). Metadados sobre arquivos HTML devem existir apenas externamente (em commits, PRs ou documentação em texto).

## 6️⃣ Nomenclatura de Repositórios

Para compatibilidade com Git/CLASP:

- **Google Project Name:** `Area_Product - AppName - ENV` (ex: `Fin_Budget - WebApp - PROD`)
- **GitHub/Folder Name:** `kebab-case` (ex: `fin-budget-webapp-prod`)

---

## 7️⃣ Configurações de Referência (Boilerplate)

Os arquivos de fundação (`package.json` e `tsconfig.json`) são padronizados. Consulte a pasta `templates/config/` para obter as versões oficiais mais recentes.

### 7.1 `.clasp.json`

Aponta para a pasta de distribuição gerada.

```JSON
{
  "scriptId": "YOUR_SCRIPT_ID",
  "rootDir": "./app"
}
```
