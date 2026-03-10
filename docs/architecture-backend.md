# Backend Templates (`templates/backend`)

This directory contains **backend templates** for Google Apps Script projects using the modern TypeScript-based stack.

Backend templates define **server-side architecture patterns**, entry points, and conventions that run exclusively in the Google Apps Script runtime.

They are intentionally **UI-agnostic** and may be used by:

- Full Web Applications (HTML + CSS + TS)
- Headless automations (cron jobs, triggers, data pipelines)
- API-style scripts (callable functions, integrations)

---

## What belongs in this folder

This folder should contain backend-related templates such as:

- **Server entry points**
  - `doGet`
  - `doPost`
  - callable global functions
- **HTML include helpers**
- **Automation-oriented servers**
- **API or service façades**
- **Reusable backend patterns**

Examples:

- `Server_Main.ts`
- `Server_Automation.ts`
- `Server_API.ts`

Each file here represents a **reference implementation**, not a mandatory runtime dependency.

---

## Design principles

Backend templates must follow these principles:

1. **TypeScript-first**
   - Strong typing
   - No `any` in public APIs
   - Interfaces and types preferred

2. **No runtime module system**
   - No `import/export` for logic
   - Only types may be imported
   - Global visibility compatible with GAS runtime

3. **Class-based architecture**
   - Static classes as namespaces
   - Predictable global exposure

4. **Explicit global exports**
   - GAS requires global functions (e.g. `doGet`)
   - Templates must clearly expose what GAS will execute

---

## Relationship with other template folders

### `templates/build/`

Defines **how the backend is compiled, flattened, and deployed**.
Backend templates assume a compatible build pipeline exists.

### `templates/frontend/`

Optional.
Backend templates **must not depend on frontend existence**.
They may support frontend rendering, but not require it.

---

## Usage philosophy

This folder is **not copied blindly** into projects.

Instead, it serves as:

- A **reference**
- A **starting point**
- A **validated architectural pattern**

Developers are encouraged to:

- Copy and adapt files consciously
- Keep documentation headers intact
- Evolve templates without breaking the mental model

---

## What this folder is NOT

- ❌ A framework
- ❌ A library
- ❌ A runtime dependency
- ❌ A one-size-fits-all solution

It is a **curated set of patterns** built from real-world usage.

---

## Next steps

- Document each backend template individually
- Provide `_pt.md` versions when the file is conceptual or architectural
- Keep implementation examples minimal and intentional

<details>
<summary>🇧🇷 <b>Ler em Português</b> <i>(Clique para expandir)</i></summary>

# Templates de Backend (`templates/backend`)

Este diretório contém **templates de backend** para projetos em Google Apps Script utilizando a stack moderna baseada em TypeScript.

Os templates de backend definem **padrões de arquitetura do servidor**, pontos de entrada e convenções que executam exclusivamente no runtime do Google Apps Script.

Eles são intencionalmente **agnósticos de UI** e podem ser utilizados por:

- Aplicações Web completas (HTML + CSS + TS)
- Automações sem interface (gatilhos, jobs, pipelines de dados)
- Scripts no estilo API (funções públicas, integrações)

---

## O que pertence a esta pasta

Esta pasta deve conter templates relacionados ao backend, tais como:

- **Pontos de entrada do servidor**
  - `doGet`
  - `doPost`
  - funções globais chamáveis
- **Helpers de include HTML**
- **Servidores orientados a automação**
- **Fachadas de API ou serviços**
- **Padrões reutilizáveis de backend**

Exemplos:

- `Server_Main.ts`
- `Server_Automation.ts`
- `Server_API.ts`

Cada arquivo aqui representa uma **implementação de referência**, não uma dependência obrigatória de runtime.

---

## Princípios de design

Os templates de backend devem seguir estes princípios:

1. **TypeScript em primeiro lugar**
   - Tipagem forte
   - Evitar `any` em APIs públicas
   - Preferência por interfaces e tipos explícitos

2. **Sem sistema de módulos em runtime**
   - Não utilizar `import/export` para lógica
   - Apenas tipos podem ser importados
   - Visibilidade global compatível com o runtime do GAS

3. **Arquitetura baseada em classes**
   - Classes estáticas como namespaces
   - Exposição global previsível

4. **Exports globais explícitos**
   - O GAS exige funções globais (ex: `doGet`)
   - Os templates devem deixar claro o que será executado pelo GAS

---

## Relação com outras pastas de templates

### `templates/build/`

Define **como o backend é compilado, achatado e publicado**.
Os templates de backend assumem a existência de um pipeline de build compatível.

### `templates/frontend/`

Opcional.
Os templates de backend **não devem depender da existência do frontend**.
Eles podem dar suporte à renderização, mas não exigir UI.

---

## Filosofia de uso

Esta pasta **não deve ser copiada cegamente** para projetos.

Ela serve como:

- **Referência**
- **Ponto de partida**
- **Padrão arquitetural validado**

Os desenvolvedores são incentivados a:

- Copiar e adaptar arquivos conscientemente
- Manter os cabeçalhos de documentação
- Evoluir os templates sem quebrar o modelo mental proposto

---

## O que esta pasta NÃO é

- ❌ Um framework
- ❌ Uma biblioteca
- ❌ Uma dependência de runtime
- ❌ Uma solução única para todos os casos

Ela é um **conjunto curado de padrões**, construído a partir de uso real.

---

## Próximos passos

- Documentar individualmente cada template de backend
- Criar versões `_pt.md` quando o arquivo for conceitual ou arquitetural
- Manter exemplos de implementação mínimos e intencionais

</details>
