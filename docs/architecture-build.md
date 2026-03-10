# Build Pipeline – Google Apps Script

This folder contains the core build system used by the `apps-script-utils` stack.

The build pipeline is designed specifically for **Google Apps Script constraints**, prioritizing:

- deterministic output
- flat file structure
- compatibility with CLASP
- zero runtime dependencies

---

## Purpose

The build process converts a modern local development stack into a format that can be executed by the Google Apps Script runtime.

It is responsible for:

- Cleaning the distribution directory
- Compiling TypeScript to GAS-compatible JavaScript
- Flattening the output structure (HTML and JS)
- Injecting compiled Tailwind CSS as an inline HTML component

---

## Execution Flow

The build follows a strict and intentional order:

1. Clean the `app/` distribution directory
2. Compile all TypeScript sources
3. Copy `appsscript.json` to the distribution root
4. Recursively copy and flatten all HTML files
5. Move compiled JavaScript files to the root
6. Generate `Tailwind_CSS.html` with inline styles

Changing this order may break runtime behavior.

---

## Tailwind CSS Strategy

- Tailwind is compiled locally using the v4 CLI
- The output CSS is wrapped in a `<style>` tag
- A single component file is generated: Tailwind_CSS.html
- HTML files include it using:

```
<?!= include('Tailwind_CSS'); ?>
```

No CDN is used in production.

---

## Scope and Responsibilities

### This build does

- Prepare frontend and backend assets for GAS
- Guarantee a flat, CLASP-ready output
- Act as the single source of truth for the stack

### This build does not

- Bundle modules
- Manage environments (DEV / PROD)
- Validate Tailwind class semantics
- Support automation-only scripts (future build)

---

## Future Evolution

Planned (but not implemented yet):

- Dedicated build for automation-only projects (no HTML/CSS)
- Optional TypeScript rewrite of the build itself
- Test harness for validating build integrity

All changes must preserve backward compatibility.

---

## Important

This file documents **behavior and intent**.
For implementation details, refer directly to `build.js`.

<details>
<summary>🇧🇷 <b>Ler em Português</b> <i>(Clique para expandir)</i></summary>

# Pipeline de Build – Google Apps Script

Esta pasta contém o sistema central de build utilizado pela stack `apps-script-utils`.

O pipeline foi projetado especificamente para as restrições do **Google Apps Script**, priorizando:

- saída determinística
- estrutura de arquivos plana
- compatibilidade com CLASP
- ausência de dependências em runtime

---

## Objetivo

O processo de build converte uma stack moderna de desenvolvimento local em um formato executável pelo runtime do Google Apps Script.

Ele é responsável por:

- Limpar a pasta de distribuição
- Compilar TypeScript para JavaScript compatível com GAS
- Achatar a estrutura de arquivos (HTML e JS)
- Injetar o CSS do Tailwind compilado como componente HTML inline

---

## Por que um Build Customizado?

O Google Apps Script possui diversas limitações:

- Não há loader de módulos em runtime
- Não há suporte a includes HTML por caminho
- Bundlers como Webpack ou Vite não são suportados
- Os arquivos precisam existir em um namespace plano

Este build existe para **assumir essas limitaçõe**s, não para contorná-las.

---

## Fluxo de Execução

O build segue uma ordem rígida e intencional:

1. Limpeza da pasta `app/`
2. Compilação dos arquivos TypeScript
3. Cópia do `appsscript.json` para a raiz
4. Cópia recursiva e achatamento dos HTMLs
5. Movimentação dos JavaScript compilados para a raiz
6. Geração do `Tailwind_CSS.html` com CSS inline

Alterar essa ordem pode quebrar o comportamento em runtime.

---

## Estratégia de Tailwind CSS

- O Tailwind é compilado localmente usando a CLI v4
- O CSS final é encapsulado em uma tag `<style>`
- Um único componente é gerado: `Tailwind_CSS.html`
- Os HTMLs incluem esse componente via:

```
<?!= include('Tailwind_CSS'); ?>
```

Não utilizamos CDN em produção.

---

## Escopo e Responsabilidades

### Este build faz

- Preparar frontend e backend para o GAS
- Garantir saída compatível com CLASP
- Atuar como fonte única de verdade da stack

### Este build não faz

- Bundling de módulos
- Gerenciamento de ambientes (DEV / PROD)
- Validação semântica de classes Tailwind
- Suporte a automações sem frontend (build futuro)

---

## Evolução Futura

Planejado (ainda não implementado):

- Build dedicado para **automações puras**
- Possível reescrita do build em TypeScript
- Estrutura de testes para validação do pipeline

Qualquer evolução deve preservar compatibilidade retroativa.

---

### Importante

Este arquivo documenta **intenção e comportamento**.

Para detalhes de implementação, consulte diretamente o `build.js`.

</details>
