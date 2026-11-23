# STANDARDS_FRONTEND_GAS — Mecânica do frontend em Google Apps Script

> Módulo de stack do `STANDARDS_CORE` para o frontend em Google Apps Script. Contém **regras**,
> nunca **fatos** de aplicação. O Parceiro lê este documento; nunca o edita.

## 1. Propósito & fronteira

Este documento dá a mecânica, no `HtmlService` do Google Apps Script, das regras do
`STANDARDS_CORE`. Detalha o CORE e nunca o contradiz; em conflito, vale o CORE (CORE §1). O que o
CORE já diz é ancorado, nunca repetido.

`Seção N` designa seção deste documento; `CORE §N`, seção do CORE; `TAILWIND §N`, seção do
`STANDARDS_TAILWIND`; `§N` depois do nome de um artefato (`CONTRACT` §7), seção do artefato.

**Não contém:** regra portável (CORE); fato de aplicação (CORE §1); comportamento do Parceiro,
que mora na instrução; mecânica do backend (`STANDARDS_BACKEND_GAS`); sintaxe de estilo e tokens
de tema (`STANDARDS_TAILWIND`).

Carrega este documento o Parceiro **Frontend**, junto com o CORE e o `STANDARDS_TAILWIND`. Vale
só para o perfil WebApp (CORE §9). O Parceiro Frontend não carrega o BACKEND: consome o backend
pelo `CONTRACT` (CORE §11).

## 2. Mecânica do runtime do cliente

Quatro traços do runtime moldam o frontend:

- **A página é montada no servidor.** O `HtmlService` avalia o template, resolve as inclusões e
  injeta os dados antes de enviar a página; o cliente recebe HTML pronto e só o manipula.
- **O cliente é JavaScript sem tipos.** O código de cliente vive em blocos `<script>` de arquivos
  `.html`, não passa pelo compilador e não enxerga os tipos do backend.
- **Os scripts de uma página dividem um escopo global único.** Não há sistema de módulos: um
  script alcança outro pelo nome global.
- **O build achata a árvore.** O build copia `src/` para a raiz de `app/`, sem pastas. A pasta
  existe só na fonte.

Esta seção dá as regras dos dois últimos. O primeiro rege a composição de página (Seção 5); o
segundo, o uso do `CONTRACT` (Seção 7).

### 2.1 Sem módulos

Nenhum arquivo do frontend contém `import`, `export` nem `<script type="module">`. A ordem em que
a página inclui os scripts é a ordem de dependência (Seção 5.2).

> porquê: fora de módulo, `import` e `export` são erro de sintaxe, e o script inteiro deixa de
> rodar.

### 2.2 Nome de arquivo único em todo `src/`

Dois arquivos de `src/`, do backend ou do frontend, nunca têm o mesmo nome, em pasta nenhuma e
qualquer que seja a extensão.

> porquê: o build achata a árvore, e o GAS não distingue arquivos pela extensão; dois arquivos de
> mesmo nome viram um conflito em `app/`.

## 3. Estrutura do frontend

O frontend ocupa duas pastas de `src/`, que existem só no WebApp: `frontend/`, com uma pasta por
papel, e `styles/`. A árvore é fechada: estas pastas, e nenhuma outra. Os arquivos entram nas
pastas pelo catálogo (Seção 4).

```text
src/
├── frontend/
│   ├── components/
│   ├── icons/
│   ├── pages/
│   ├── services/
│   ├── store/
│   └── ui/
└── styles/
    └── input.css
```

- As subpastas de `frontend/` são por papel, nunca por domínio.
- `styles/input.css` é a fonte do estilo; a sintaxe dele é do TAILWIND §3.
- `styles/output.css`, compilado do `input.css`, é gerado: nunca se edita e fica fora do Git. O
  build o converte em `app/Tailwind_CSS.html`.
- O Tailwind nunca se carrega por URL, como o CDN: chega à página só pelo `Tailwind_CSS`.

## 4. Catálogo de prefixos

Todo arquivo de código de `src/frontend/` é `.html` e segue `<Prefix>_<Name>` (CORE §3), com um prefixo
deste catálogo, e nenhum outro.

| Prefixo      | Pasta         | Camada (Seção 6) | Forma do arquivo                                       |
| ------------ | ------------- | ---------------- | ------------------------------------------------------ |
| `Page_`      | `pages/`      | Nenhuma          | Abre o documento; raiz de composição da tela (Seção 5) |
| `Component_` | `components/` | Nenhuma          | Só marcação, sem `<script>` (Seção 9)                  |
| `Icon_`      | `icons/`      | Nenhuma          | Só um `<svg>` (Seção 10.5)                             |
| `Store_`     | `store/`      | Store            | Só um bloco `<script>`                                 |
| `Service_`   | `services/`   | Service          | Só um bloco `<script>`                                 |
| `UI_`        | `ui/`         | UI               | Só um bloco `<script>`                                 |

- "Só" exclui tudo, menos o cabeçalho de arquivo (Seção 11).
- Os arquivos `Store_`, `Service_` e `UI_` de um mesmo domínio (CORE §3) levam o mesmo
  `<Name>`.
- Papel universal tem `<Name>` fixo: `Page_Index`, `Component_HeadSetup`, `Component_Fonts`,
  `Store_App`, `Service_RPC`, `UI_ErrorCatalog`, `UI_Init`. Todos nascem de template (Seção 12).

### 4.1 Nomes no escopo global

Cada arquivo de script põe no escopo global (Seção 2) só os nomes desta tabela e constantes em
`UPPER_SNAKE_CASE` (CORE §3).

| Arquivo          | Nome                                                                    |
| ---------------- | ----------------------------------------------------------------------- |
| `Store_<Name>`   | Um objeto, `store<Name>`, com o estado e os getters (Seção 6.3)         |
| `Service_RPC`    | O objeto `RPC` (Seção 7.1)                                              |
| `Service_<Name>` | Funções `service_<verbObject>` (Seção 7.2)                              |
| `UI_<Name>`      | Funções `ui_<verbObject>` e a inicialização `ui_init<Name>` (Seção 9.2) |

- `<verbObject>` em camelCase, começando pelo verbo.
- `ui_init<Name>` é chamada só pelo `UI_Init`.
- O `UI_Init` não põe nome no escopo: no carregamento, chama as `ui_init<Name>`.
- Levam JSDoc (CORE §6.4) o método `RPC.call`, as funções `service_<verbObject>`, `ui_<verbObject>`
  e `ui_init<Name>` e os getters dos `store<Name>`; nenhuma outra função leva.

## 5. Composição de página

A página é montada no servidor pelo motor de render, o `Utils_Render`: arquivo do backend que
nasce do template e nunca se altera. Ele oferece duas operações:

- **`renderPage`** recebe o nome de uma `Page_<Name>`, o título da página e a carga de sessão,
  e devolve a página pronta. É chamada pela entrada do backend e aplica, num ponto só, o título,
  a meta `viewport` e a política de frame.
- **`include`** recebe o nome de um arquivo do frontend e, quando há dado a passar, um objeto de
  dados; avalia o arquivo e devolve o HTML como texto. Está disponível em todo template que o motor
  avalia, em qualquer profundidade.

<!-- prettier-ignore -->
```html
<?!= include("<Prefix>_<Name>") ?>
<?!= include("<Prefix>_<Name>", { <field>: <value> }) ?>
```

- O arquivo é chamado pelo nome, sem caminho e sem extensão (Seção 2).
- `<?!= ?>`, que imprime sem escapar, só se usa com `include`. Todo dado impresso usa `<?= ?>`,
  que escapa.

### 5.1 Dado no template

Dentro de qualquer template, o dado injetado se lê só como `props.<field>`, nunca como `<field>`
solto.

> porquê: o motor entrega o dado só sob `props`, na página e no fragmento, e assim o template muda
> de lugar sem reescrita.

### 5.2 Ordem de inclusão

A `Page_` não contém `<script>`: todo script entra nela por `include` de um arquivo `Store_`,
`Service_` ou `UI_`, e só a `Page_` faz essa inclusão. A ordem é esta:

1. `Store_App`, que recebe a carga de sessão por `include("Store_App", props)`, depois os
   `Store_<Name>`;
2. `Service_RPC`;
3. os `Service_<Name>`;
4. `UI_ErrorCatalog`;
5. os `UI_<Name>`;
6. `UI_Init`, por último.

> porquê: o código que roda no carregamento só enxerga o que foi incluído antes dele (Seção 2.1).

## 6. Camadas do cliente

O código de cliente se divide em três camadas, uma por recurso:

- **`Store`** guarda estado: o dado que a aplicação mantém.
- **`Service`** fala com o backend.
- **`UI`** opera o DOM: trata evento, lê estado, chama serviço e desenha a tela.

`Component_` e `Icon_` não são camada: são marcação (Seção 9).

### 6.1 Quem toca cada recurso

Cada recurso tem um dono, e nenhum outro arquivo o toca.

| Recurso                              | Dono          |
| ------------------------------------ | ------------- |
| `google.script.run`                  | `Service_RPC` |
| DOM (`document`, elementos, eventos) | `UI_`         |
| Estado da aplicação                  | `Store_`      |

> porquê: a camada se confere sem ler a lógica; basta ver o que o arquivo toca.

### 6.2 Quem chama quem

Cada arquivo chama só o que esta tabela lhe dá.

| Arquivo                 | Pode chamar                       |
| ----------------------- | --------------------------------- |
| `UI_`                   | `UI_`, `Store_`, `Service_<Name>` |
| `Service_<Name>`        | `Service_RPC`                     |
| `Service_RPC`, `Store_` | Nenhum arquivo                    |

### 6.3 O que é estado

Todo valor que precisa durar além da chamada da função que o criou é estado e mora num `Store_`.
Fora de função, o `UI_` não declara `let` nem `var`: toda variável de `UI_` é local de função.

- Isso inclui o valor que dura uma só interação, como o callback guardado até a confirmação.
- Valor fixo, conhecido antes de o código rodar (mapa de tipo a classe, mapa de valor de domínio a rótulo), é
  constante do `UI_` que o usa, não estado. O mapa de erro é o `UI_ErrorCatalog` (Seção 8).
- O `Store_` contém só estado e getters que o derivam, sem efeito colateral.

### 6.4 De quem é o estado

| Estado                                | Mora em                                         |
| ------------------------------------- | ----------------------------------------------- |
| Carga de sessão (Seção 5)             | `Store_App`                                     |
| Lido por `UI_` de mais de um `<Name>` | `Store_App`                                     |
| Qualquer outro                        | `Store_<Name>`, com `<Name>` do `UI_` que o usa |

- `store<Name>` aparece só no `UI_<Name>` de mesmo `<Name>`; `storeApp`, em qualquer `UI_`.
- O `Store_<Name>` nasce com o primeiro estado do domínio.

## 7. Camada `Service_`

O `Service_` é a única fronteira do cliente com o backend. Tem duas formas: o `Service_RPC`, o
transporte único, e um `Service_<Name>` por domínio.

### 7.1 `Service_RPC`

O `Service_RPC` nasce do template (Seção 12) e nunca se altera. Expõe o objeto `RPC`, com um único
método, `call(functionName, ...args)`, que chama a função exposta pelo nome e devolve uma Promise:

- envelope com sucesso: resolve com `data`;
- envelope com falha: rejeita com `new Error(errorCode)`;
- falha de plataforma, quando a chamada não completa: rejeita com
  `new Error("UNEXPECTED_ERROR")`, e o detalhe vai para o console.

Todo erro chega ao chamador por um canal só, o `catch`, com o código em `error.message`
(Seção 8).

### 7.2 `Service_<Name>`

Um `Service_<Name>` expõe uma função livre `service_<verbObject>` para cada `public_<verbObject>`
do domínio, com o mesmo `<verbObject>`. O corpo é uma única chamada ao `RPC`:

```js
async function service_<verbObject>(<args>) {
  return await RPC.call('public_<verbObject>', <args>);
}
```

- Nunca objeto nem classe: o prefixo `service_` marca a camada.
- O `Service_<Name>` devolve o que o `RPC.call` devolve: não transforma, não guarda, não traduz.
- O `RPC.call` só recebe nome de função `public_`.

### 7.3 `CONTRACT`

O `docs/CONTRACT.d.ts` (CORE §11) é a fonte da superfície. O frontend nunca o carrega na página.

- Cada `Service_<Name>` corresponde a um sub-banner `/* --- API_<Name> --- */` do `CONTRACT` §6,
  com o mesmo `<Name>`.
- Função que não está declarada no `CONTRACT` §6 não se chama.
- O dado que um `service_<verbObject>` devolve tem a forma declarada no `CONTRACT` §4.

## 8. Erro no frontend

A lei do erro está no CORE §8. No frontend:

- Todo erro do backend chega ao `UI_` pelo `catch` da chamada ao `service_<verbObject>`, com o
  código em `error.message` (Seção 7.1).
- O `UI_` decide o que fazer comparando `error.message` com o código, nunca com a frase de tela
  (CORE §8.1).
- O código vira frase só no `UI_`, pelo `UI_ErrorCatalog`. `Store_` e `Service_` nunca traduzem.

### 8.1 `UI_ErrorCatalog`

O `UI_ErrorCatalog` é o catálogo de tradução do CORE §8.3: o ponto único que leva código a frase
de tela. Nasce do template (Seção 12); o projeto preenche só o mapa.

- O mapa tem uma entrada para cada código `"response"` do `CONTRACT` §7.
- A frase genérica do CORE §8.3 vem do template.

## 9. Componentes, eventos e slots

O `Component_` é marcação, incluída no servidor ou clonada pelo `UI_` (Seção 9.3). Na marcação,
três famílias de classe dividem o trabalho:

| Classe         | Papel            | Quem a lê                       |
| -------------- | ---------------- | ------------------------------- |
| `js-<action>`  | Gancho de evento | O ouvinte delegado do `UI_`     |
| `data-<field>` | Slot de conteúdo | O `UI_`, ao preencher           |
| Utilitários    | Aparência        | A folha de estilo (TAILWIND §6) |

- `<action>` e `<field>` em kebab-case.
- O `UI_` seleciona elemento só por `#id`, `.js-` ou `.data-`; nunca por classe utilitária nem por
  tag.
- O `input.css` nunca usa `.js-` nem `.data-` em seletor.
- O atributo `data-<field>="<value>"` não é slot: carrega dado do nó, como a identidade do
  registro, lido pelo ouvinte delegado.
- Nenhum `Page_`, `Component_` ou `Icon_` contém comentário além do cabeçalho (Seção 11) e do
  `PROJECT:` (CORE §15).

### 9.1 Sem comportamento na marcação

Nenhum `Page_`, `Component_` ou `Icon_` contém atributo de evento (`onclick`, `onchange`, todo
`on*`).

> porquê: o atributo de evento crava o nome de uma função global no fragmento e parte o
> comportamento entre a marcação e o `UI_`.

### 9.2 Delegação de evento

Todo `addEventListener` mora na função `ui_init<Name>` do `UI_<Name>`, que o `UI_Init` chama uma
vez. O ouvinte fica num contêiner com `id`, presente na página desde o servidor, e acha o alvo pela
classe `js-`:

```js
function ui_init<Name>() {
  document.getElementById("<container-id>").addEventListener("click", (event) => {
    const target = event.target.closest(".js-<action>");
    if (!target) return;
    ui_<verbObject>(target);
  });
}
```

Nenhum evento se liga por atribuição (`element.onclick = …`).

> porquê: o ouvinte no contêiner é ligado uma vez e alcança todo descendente, inclusive o clonado
> depois; o ligado no clone se perde no próximo render.

O ouvinte do `submit` sempre chama `event.preventDefault()`.

> porquê: no GAS, o envio padrão do formulário navega o iframe e deixa a página em branco.

### 9.3 Instância única e item repetido

- **Instância única** entra por `include` no servidor (Seção 5) e pode usar `id`.
- **Item repetido** é um `<template>` escrito só em `Component_`, que o `UI_` acha pelo `id`,
  clona e preenche pelos slots:

```js
const clone = document.getElementById("<template-id>").content.cloneNode(true);
clone.querySelector(".data-<field>").textContent = <value>;
container.appendChild(clone);
```

- O dado entra no slot por `textContent` ou por atributo.
- Nenhum `UI_` usa `innerHTML`, `outerHTML` nem `insertAdjacentHTML`; esvaziar contêiner é
  `replaceChildren()`.
- Dentro de `<template>`, nenhum `id`: todo ponto endereçável é classe `js-` ou `data-`.

> porquê: o clone duplica o `id`, e DOM com `id` repetido é inválido.

## 10. HTML, acessibilidade e ícones

### 10.1 Documento

- Só a `Page_` abre o documento: `<!DOCTYPE html>`, `<html lang="pt-BR">`, `<head>` e `<body>`.
- O `<head>` da `Page_` contém só o `include` do `Component_HeadSetup` (Seção 12). Nenhum arquivo
  declara `<title>` nem meta `viewport`: o `renderPage` os aplica (Seção 5).
- Filho direto do `<body>` é sempre `<header>`, `<nav>`, `<main>`, `<aside>` ou `<footer>`, seguidos
  dos `include` de script da Seção 5.2; toda `Page_` tem um único `<main>`.
- Bloco que abre com título (`<h2>` a `<h6>`) é `<section>` ou `<article>`.
- `<div>` e `<span>` são só contêiner de layout: sem título, sem classe `js-` e sem papel
  interativo.
- Tela é o conteúdo do `<main>` a que o usuário chega pela navegação. Modal, toast, formulário e
  todo elemento que surge sobre a tela ou dentro dela não são tela: pertencem à tela que os mostra.
- A casca é o que a página mostra em toda tela.

### 10.2 `id` e `name`

- `id` em kebab-case, só em instância única (Seção 9.3).
- Fora de `<template>`, o `for` do `<label>` repete o `id` do controle.
- O `name` do campo é chave do dado: o nome do campo no `CONTRACT` §5, em camelCase.

### 10.3 Teclado

- Elemento que dispara ação é `<button type="button">`, ou `type="submit"` em formulário;
  elemento que navega é `<a href>`. A classe `js-` só vai em `<button>`, `<a>`, `<form>`,
  `<input>`, `<select>` e `<textarea>`.
- `tabindex` só com valor `-1`, no elemento que recebe foco por código; nunca valor positivo.
- Todo elemento focável mostra foco visível; o indicador nunca se remove sem substituto (TAILWIND §8).
- Modal é `<dialog>`, aberto por `showModal()`; nenhum outro elemento leva `role="dialog"`.

### 10.4 Nome acessível e anúncio

- Campo de formulário: `<label for="<id>">`; dentro de `<template>`, o `<label>` envolve o campo.
- Botão ou link sem texto visível: `aria-label`.
- Região de instância única nomeada por título visível: `aria-labelledby`, com o `id` do título.
- Mensagem que surge em runtime (aviso, erro) entra numa região `aria-live="polite"` presente na
  página desde o servidor.

### 10.5 Ícones

- Todo ícone é `Icon_`, incluído pelo nome (Seção 5). Nenhum `<svg>` fora de `Icon_`, e nenhuma
  fonte de ícone, biblioteca externa de ícones, `<img>` de ícone ou emoji como ícone.
- O `<svg>` leva `aria-hidden="true"`; o nome acessível é do controle que o contém (Seção 10.4).

### 10.6 Permissão na tela

Controle que depende de permissão nasce com a classe `hidden`, no próprio controle, nunca no
contêiner. O `UI_` a remove quando o `storeApp` confirma a permissão (CORE §7.2).

## 11. Cabeçalho de arquivo

Todo arquivo de código de `src/frontend/` e o `styles/input.css` levam o cabeçalho do CORE §6.5; arquivo
sem ele está incompleto. No `.html`, o cabeçalho é um único bloco `<!-- -->`, na primeira linha
do arquivo; no `.css`, é um bloco `/* */`, também na primeira linha, com os mesmos campos:

```html
<!--
  File:           src/frontend/<folder>/<Prefix>_<Name>.html
  Description:    <what the file is, in English>
  Description_pt: <o que o arquivo é, em português>
-->
```

O cabeçalho não é JSDoc: os rótulos não levam `@`.

> porquê: o build achata a árvore (Seção 2); em `app/`, só o `File` diz em que pasta da fonte o
> arquivo mora.

## 12. Templates do frontend

Os arquivos de infraestrutura do frontend vêm do template nas categorias A e B do CORE §15.

| Arquivo                    | Categoria | O projeto preenche                                                                |
| -------------------------- | --------- | --------------------------------------------------------------------------------- |
| `Service_RPC.html`         | A         | Nada                                                                              |
| `Component_HeadSetup.html` | A         | Nada                                                                              |
| `Component_Fonts.html`     | B         | Os `<link>` que carregam as famílias de fonte                                     |
| `Store_App.html`           | B         | Os campos da carga de sessão (Seção 6.4)                                          |
| `UI_ErrorCatalog.html`     | B         | O mapa de código a frase (Seção 8.1)                                              |
| `UI_Init.html`             | B         | As chamadas às `ui_init<Name>` (Seção 4.1)                                        |
| `Page_Index.html`          | B         | As classes do `<body>`, a casca (Seção 10.1) e os `include` de script (Seção 5.2) |
| `input.css`                | B         | Os tokens de tema (TAILWIND §4) e as classes do `@layer components` (TAILWIND §6) |

- O `Component_HeadSetup` contém, nesta ordem, e nada mais: a meta `charset` UTF-8, o
  `<base target="_top">`, o `include` do `Component_Fonts` e o do `Tailwind_CSS` (Seção 3).

  > porquê: no GAS, a página roda num iframe; sem o `_top`, o link navega dentro do frame, e não
  > na aba.

- Arquivo de domínio (`Store_<Name>`, `Service_<Name>`, `UI_<Name>`, `Component_<Name>`,
  `Icon_<Name>`) e toda `Page_` além da `Page_Index` nunca vêm do template.

## 13. Design e construção

O frontend se faz em duas fases, nesta ordem. Nenhum arquivo de domínio de `src/frontend/`
(Seção 12) nasce antes de a fase de design fechar.

### 13.1 Design

A fase de design fecha com estas entregas, aprovadas juntas:

| Entrega                     | O que é                                 |
| --------------------------- | --------------------------------------- |
| `docs/GABARITO_<Nome>.html` | Uma peça do app, navegável e interativa |
| `src/styles/input.css`      | A versão inicial do estilo              |

- O Parceiro propõe a divisão em gabaritos, partindo de um por tela e um por modal, e o
  desenvolvedor decide. Depois, um gabarito só se divide ou se junta a pedido do desenvolvedor.
- `<Nome>` é o nome da peça aprovado na divisão, em português, em PascalCase, sem acento e sem
  espaço.
- O gabarito de tela traz a casca (Seção 10.1), igual em todos; o de modal traz só o `<dialog>`.
- A navegação entre os gabaritos se faz por link.

### 13.2 Construção

- A construção extrai os gabaritos um item por vez, nesta ordem: a casca da `Page_`
  (Seção 10.1), as classes compartilhadas no `input.css`, os `Component_`, e por fim a ligação no
  `UI_`.
- Na construção, a fonte da verdade visual são os componentes e o `input.css`; os gabaritos não se atualizam.
- O gabarito permanece inteiro enquanto houver o que extrair dele. Quando tudo o que ele mostra
  está na marcação (`Page_`, `Component_`, `Icon_`), é apagado num commit próprio do tipo `docs`
  (CORE §14).

### 13.3 Carga da tela

A página chega com a casca e a carga de sessão (Seção 6.4). O dado de domínio chega por RPC, nas
`ui_init<Name>`, depois que a casca aparece.

Enquanto o dado não chega, a região que o recebe mostra o estado de carregamento e nasce com
`aria-busy="true"` na marcação; o `UI_` remove o atributo quando desenha o dado ou a mensagem de
erro.

## 14. MANUAL

O `docs/MANUAL.md` ensina o usuário final a usar a aplicação. Escreve o Parceiro Frontend; o
desenvolvedor aprova (CORE §10).

### 14.1 Anatomia

Quatro seções, de numeração fixa; seção sem conteúdo declara "nenhum".

| §   | Seção               | Conteúdo                                     |
| --- | ------------------- | -------------------------------------------- |
| 1   | O que é             | Uma frase: a aplicação e para quem ela serve |
| 2   | Acesso              | Como entrar e quem pode                      |
| 3   | Telas               | Uma subseção por tela, na forma abaixo       |
| 4   | Perfis e permissões | O que cada papel vê e pode fazer             |

Cada tela do §3 tem esta forma:

```markdown
### <nome da tela, como aparece na tela>

**Para que serve:** <uma frase>

**O que mostra:** <o que o usuário vê>

**O que você pode fazer:**

- <ação> → <resultado>
```

### 14.2 Regras de conteúdo

- Linguagem do usuário, com os nomes que aparecem na tela; nunca nome de arquivo, função,
  componente, tabela ou código de erro.
- Só o que o usuário faz e vê; regra de negócio entra só quando explica um resultado na tela.
- Uma ação por linha, no formato `<ação> → <resultado>`.
- Sem imagem.

### 14.3 Ciclo de vida

- Nasce do template, vazio (CORE §10).
- O §3 tem uma subseção para cada tela `pronto` do `PROGRESS` §6 (Seção 15), com o nome da tela.
- Ao ficar pronta, a tela ganha a sua subseção; tela que muda tem a subseção corrigida no lugar.
- A fonte é a tela real, nunca a conversa.

## 15. PROGRESS no frontend

A forma do `PROGRESS` está no CORE §12. O Parceiro Frontend escreve só o que esta seção lhe dá.

### 15.1 Parte fixa

O Parceiro Frontend escreve só o §4, Superfície de uso, em uma tabela com uma linha por tela:

| Tela                                   | Página        | Domínios                        |
| -------------------------------------- | ------------- | ------------------------------- |
| `<nome da tela, como aparece na tela>` | `Page_<Name>` | `<Name>` dos `UI_` que a operam |

O nome da tela é o mesmo da subseção dela no `MANUAL` §3 (Seção 14).

### 15.2 Parte volátil

Nas subseções `Frontend` (CORE §12.4), o módulo é um destes, e nenhum outro:

- `Design`: as entregas da fase de design (Seção 13.1);
- `Infra`: os templates da Seção 12 e o `input.css`;
- uma tela, com o nome que tem no §4.
