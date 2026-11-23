# STANDARDS_BACKEND_GAS — Mecânica do backend em Google Apps Script

> Módulo de stack do `STANDARDS_CORE` para o backend em Google Apps Script. Contém **regras**,
> nunca **fatos** de aplicação. O Parceiro lê este documento; nunca o edita.

---

## 1. Propósito & fronteira

Este documento dá a mecânica, no **Google Apps Script**, das regras do `STANDARDS_CORE`. Detalha o
CORE e nunca o contradiz; em conflito, vale o CORE (CORE §1). O que o CORE já diz é ancorado,
nunca repetido.

`Seção N` designa seção deste documento; `CORE §N`, seção do CORE; `§N` depois do nome de um
artefato (`CONTRACT` §7), seção do artefato.

**Não contém:** regra portável (CORE); fato de aplicação, que vive em `docs/` do projeto
(CORE §1); comportamento do Parceiro, que mora na instrução; mecânica do frontend
(`STANDARDS_FRONTEND_GAS`).

Carrega este documento o Parceiro **Backend**, junto com o CORE. O Parceiro Frontend não o
carrega: consome o backend pelo `CONTRACT` (CORE §11).

## 2. Mecânica do runtime GAS

Três traços do runtime moldam o backend; cada regra desta seção nasce de um deles.

- **Escopo global único.** Em execução não há módulos: depois do build, todos os arquivos vivem
  num só espaço de nomes, como se fossem concatenados.
- **O build achata a árvore.** O build copia `src/` para a raiz de `app/`, sem pastas, antes do
  envio pelo CLASP. A pasta existe só na fonte.
- **A plataforma chama pelo nome global.** O RPC, a implantação e os gatilhos alcançam uma função
  de nível superior pelo nome; método de classe não é alcançável assim.

### 2.1 Sem `import` nem `export`

Nenhum arquivo `.ts` ou `.d.ts` de `src/` contém `import` ou `export`, nem só de tipo. Os tipos
são globais, declarados em `src/types/` (Seção 9).

> porquê: um único `import` ou `export` faz o compilador tratar o arquivo como módulo e emitir
> sintaxe de módulo, que o GAS não executa. O arquivo quebra no build.

### 2.2 Lógica em classes estáticas

Todo arquivo `.ts` de `src/backend/` contém uma única classe estática, com o nome do arquivo. Toda
lógica mora nos métodos dela, chamados pelo nome qualificado (`DAO_<Name>.<method>(...)`). O
acoplamento entre arquivos se faz pelo nome global da classe.

### 2.3 Funções livres só na entrada

Função de nível superior só existe em arquivo `API_` ou `Server_` (Seção 5). Seu corpo é uma
única chamada ao método estático da classe do mesmo arquivo que faz o trabalho. O método tem o
nome da função, sem o `public_` quando ela o leva (Seção 6).

```ts
class Server_Main {
  static doGet(): GoogleAppsScript.HTML.HtmlOutput {
    return <Prefix>_<Name>.<method>();
  }
}

function doGet(): GoogleAppsScript.HTML.HtmlOutput {
  return Server_Main.doGet();
}
```

As funções de nível superior de cada perfil estão na Seção 3.

### 2.4 Nome de arquivo único em todo `src/`

Dois arquivos de `src/`, do backend ou do frontend, nunca têm o mesmo nome, em pasta nenhuma e
qualquer que seja a extensão.

> porquê: o build achata a árvore, e o GAS não distingue arquivos pela extensão; dois arquivos de
> mesmo nome viram um conflito em `app/`.

## 3. Perfis e funções de entrada

O perfil (CORE §9) decide quais funções de nível superior o projeto tem. O conjunto é fechado:
estas, e nenhuma outra. O perfil é o declarado no `PROGRESS` §1; nunca se deduz das funções.

| Função                | Perfil    | Arquivo       | Quem chama                                               |
| --------------------- | --------- | ------------- | -------------------------------------------------------- |
| `doGet`               | WebApp    | `Server_Main` | A implantação de Web App, ao abrir a página              |
| `public_<verbObject>` | WebApp    | `API_<Name>`  | O frontend, por RPC (Seção 6)                            |
| `doPost`, `doGet`     | Receptor  | `Server_Main` | O outro programa, pelo método declarado no `CONTRACT` §6 |
| `<verbObject>`        | Automação | `Server_Main` | Gatilho de tempo ou execução manual                      |

- O WebApp sempre tem `doGet`. O Receptor tem a função de cada método HTTP declarado no
  `CONTRACT` §6 (`doPost`, `doGet` ou as duas), e nenhuma além.
- Arquivo `API_` só existe no WebApp.
- A Automação não tem `doGet` nem `doPost`. Suas funções se chamam `<verbObject>`: camelCase,
  começando pelo verbo.
- O `Server_Main` nasce do template do perfil; o projeto preenche só o que a Seção 15.1 indica
  para o seu perfil.
- Entrada que a tabela não prevê, como um gatilho num WebApp, é caso não coberto e vai ao
  desenvolvedor (CORE §1).

## 4. Estrutura do projeto

O projeto nasce do template do seu perfil (Seção 15), com esta árvore. A raiz e o primeiro nível
de `src/` são fechados: estas pastas e estes arquivos, e nenhum outro. `src/backend/` tem uma
pasta por camada e cresce com o catálogo (Seção 5). Os arquivos de código entram nas pastas pelo
catálogo.

```text
<área>-<nome>-<papel>/
├── .clasp.json
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
├── README.md
├── build/
├── docs/
└── src/
    ├── appsscript.json
    ├── backend/
    │   ├── api/
    │   ├── controllers/
    │   ├── dao/
    │   └── utils/
    ├── types/
    │   └── index.d.ts
    ├── frontend/
    └── styles/
```

- `frontend/` e `styles/` existem só no WebApp; o conteúdo delas é do `STANDARDS_FRONTEND_GAS`.
- `src/backend/` nasce com as quatro pastas da árvore. Camada que o projeto passa a ter ganha a
  sua pasta: `storage/`, no projeto que grava arquivos binários; `mail/`, no que envia e-mail; e
  a de cada camada aprovada (Seção 5). Código de uma camada nunca mora na pasta de outra.
- As subpastas de `src/backend/` são por camada, nunca por domínio.
- `src/types/` recebe um `Types_<Name>.d.ts` por domínio e por template que traz tipo (Seção 9).
- Fora da árvore só existem os gerados, `app/` (saída do build) e `node_modules/`: nunca se
  editam e ficam fora do Git.
- `package-lock.json` é gerado pelo `npm install`: nunca se edita à mão e vai para o Git.
- `docs/` e `README.md` seguem o CORE §10.

### 4.1 Arquivos de config e build

| Arquivo                 | Perfil               | Papel                                                                       |
| ----------------------- | -------------------- | --------------------------------------------------------------------------- |
| `package.json`          | Todos                | Nome do pacote (nome de máquina, CORE §4), scripts e dependências do perfil |
| `tsconfig.json`         | Todos                | Compila `src/` para `app/`                                                  |
| `.clasp.json`           | Todos                | Liga `app/` ao projeto GAS                                                  |
| `.gitignore`            | Todos                | Exclui do Git os arquivos gerados e o `.clasp.json`                         |
| `build/build-webapp.js` | WebApp               | Build do WebApp                                                             |
| `build/build-auto.js`   | Receptor e Automação | Build sem tela                                                              |

O conteúdo de cada arquivo é o do template; o projeto preenche só os valores de identidade. O
Parceiro não altera arquivo de config: propõe a mudança, e o desenvolvedor decide.

## 5. Catálogo de prefixos

Todo arquivo de `src/backend/` e de `src/types/` segue `<Prefix>_<Name>` (CORE §3), com um prefixo
deste catálogo ou de uma camada aprovada no projeto.

| Prefixo       | Pasta          | Camada (CORE §7) | Contém                                                                                            |
| ------------- | -------------- | ---------------- | ------------------------------------------------------------------------------------------------- |
| `Server_`     | `api/`         | Entrada          | Só o `Server_Main`, com as funções de entrada da plataforma (Seção 3)                             |
| `API_`        | `api/`         | Entrada          | As funções `public_` chamadas por RPC (Seção 6)                                                   |
| `Controller_` | `controllers/` | Regra de negócio | Validação, cálculo, autorização e orquestração                                                    |
| `DAO_`        | `dao/`         | Acesso           | Leitura e escrita de dados estruturados (Seção 8)                                                 |
| `Storage_`    | `storage/`     | Acesso           | Leitura e escrita de arquivos binários                                                            |
| `Mail_`       | `mail/`        | Acesso           | Envio de e-mail                                                                                   |
| `Utils_`      | `utils/`       | Nenhuma          | Ferramenta usada por qualquer camada, sem decisão de regra nem acesso a recurso externo (Seção 7) |
| `Types_`      | `types/`       | Nenhuma          | Os tipos de um domínio ou de um template (Seção 9)                                                |

- Os arquivos `API_`, `Controller_` e `Types_` de um mesmo domínio (CORE §3) levam o mesmo
  `<Name>`.
- Lógica vai para um `Utils_` quando é uma regra só e uma correção nela deve chegar a todos os
  chamadores. Forma repetida sobre regras diferentes não se extrai; tamanho não é critério.
- Camada nova (CORE §7.3): o Parceiro propõe e nunca cria prefixo nem pasta. Aprovada pelo
  desenvolvedor, a camada ganha prefixo e pasta próprios, no padrão desta tabela, e é registrada
  no `PROGRESS` §1 (Seção 17.1).
- Ficam fora do catálogo só os arquivos de nome fixo da Seção 4: config, build,
  `appsscript.json` e `index.d.ts`.

## 6. Nomes das funções expostas

Toda função chamada por RPC se chama `public_<verbObject>`: o prefixo `public_` e o resto em
camelCase, começando pelo verbo (`public_getRecords`, `public_saveRecord`).

- Toda função de nível superior de arquivo `API_` leva `public_`; nenhuma outra função ou método
  o usa.
- Prefixo de arquivo (`API_`, `Server_`) nunca aparece em nome de função ou de método.
- Renomear uma `public_` é mudança de superfície: o `CONTRACT` é regenerado (CORE §11.4).

> porquê: no escopo achatado não há `export` que separe o exposto do interno (Seção 2); o nome é a
> única marca.

## 7. As camadas no GAS

O fluxo e o papel de cada camada estão no CORE §7. No GAS, a camada de um arquivo se confere por
duas tabelas fechadas: o serviço que ele chama (7.1) e os arquivos que ele chama (7.2).

### 7.1 Quem toca cada serviço

Cada serviço tem um dono, e nenhum outro arquivo o chama. **Recurso externo** é o serviço que lê
ou grava dado fora do script; os demais são da plataforma.

| Serviço                     | Tipo            | Dono                             |
| --------------------------- | --------------- | -------------------------------- |
| `SpreadsheetApp`            | Recurso externo | `DAO_`                           |
| BigQuery (serviço avançado) | Recurso externo | `DAO_`                           |
| `DriveApp`                  | Recurso externo | `Storage_`                       |
| `MailApp`, `GmailApp`       | Recurso externo | `Mail_`                          |
| `LockService`               | Plataforma      | `DAO_` (Seção 8.3)               |
| `Session`, identidade       | Plataforma      | Entrada (`Server_Main` e `API_`) |
| `Session`, fuso do script   | Plataforma      | Qualquer arquivo                 |
| `ScriptApp`                 | Plataforma      | `Server_Main`                    |
| `PropertiesService`         | Plataforma      | `Utils_Env` (Seção 10)           |
| `HtmlService`               | Plataforma      | `Utils_Render` (Seção 15.1)      |
| `ContentService`            | Plataforma      | `Utils_Response` (Seção 11.1)    |
| `console`, `Utilities`      | Plataforma      | Qualquer arquivo                 |

- Recurso externo fora da tabela (como `UrlFetchApp` ou `Jdbc`) não tem camada: exige camada nova
  (Seção 5).
- Serviço de plataforma fora da tabela é caso não coberto e vai ao desenvolvedor (CORE §1).

> porquê: a camada se confere sem ler a lógica; basta ver que serviço o arquivo chama.

### 7.2 Quem chama quem

Cada arquivo chama só o que esta tabela lhe dá; nenhuma chamada fora dela.

| Arquivo               | Pode chamar                                                       |
| --------------------- | ----------------------------------------------------------------- |
| `Server_Main`, `API_` | `Controller_`, `Utils_` e, só em leitura pura (CORE §7.1), `DAO_` |
| `Controller_`         | `DAO_`, `Storage_`, `Mail_`, `Utils_`                             |
| `DAO_`                | `Utils_`                                                          |
| `Storage_`, `Mail_`   | `Utils_`                                                          |
| `Utils_`              | `Utils_`                                                          |

- Camada aprovada no projeto (Seção 5) é chamada só pelo `Controller_` e chama só `Utils_`.
- A identidade de quem chama é lida na entrada, pela `Session`, e chega ao `Controller_` por
  parâmetro. Nunca vem do cliente como parâmetro da chamada.
- Operação que envolve arquivo e registro: o `Controller_` pede o arquivo ao `Storage_`, recebe a
  referência (id ou URL) e manda o `DAO_` gravar o registro com ela.

## 8. DAO

O `DAO_` é a fronteira com o dado bruto: tudo que sai dele já está na forma do código.

### 8.1 Fonte e nomes

- Cada fonte (aba, tabela ou view) tem um único `DAO_` dono; só ele a lê ou grava, e o nome dela
  aparece só nele, como valor (CORE §2).
- Nome de coluna (`snake_case`, em português) vira propriedade (`camelCase`, em inglês) uma vez,
  no `DAO_` dono.
- Coluna de planilha se acha pelo cabeçalho, nunca por índice fixo.

### 8.2 Leitura

O valor bruto sai convertido assim, e de nenhuma outra forma. Esta tabela é a fonte do
`CONTRACT` §0 (Seção 16).

| Valor bruto                 | Sai como                |
| --------------------------- | ----------------------- |
| Texto vazio                 | `""`                    |
| Data de calendário          | Texto `YYYY-MM-DD`      |
| Data e hora                 | Texto ISO 8601 completo |
| Número ausente              | `null`                  |
| Número que é chave, ausente | `0`                     |
| Percentual                  | Fração de 0 a 1         |
| Booleano ausente            | `null`                  |

- Nunca sai `Date`, `NaN` nem `undefined`.
- Data se converte no fuso do script (Seção 7.1), nunca em UTC.
- Vazio sai vazio: o `DAO_` nunca inventa valor substituto.
- Número sai cru: máscara, zero à esquerda e rótulo são da tela ou do `Controller_`.
- Coluna obrigatória ausente da fonte lança `MISSING_REQUIRED_COLUMN`; o `DAO_` declara quais
  colunas são obrigatórias.

### 8.3 Escrita

- O `DAO_` carimba o timestamp de auditoria; o tipo do input de escrita não tem os campos que o
  `DAO_` define.
- Escrita que exige unicidade roda sob `LockService`, no `DAO_`; lock não obtido lança
  `LOCK_TIMEOUT`.

## 9. Tipos e nomes

- Todo tipo e interface do backend é declarado em `src/types/`, sem `export` (Seção 2.1); nenhum
  arquivo `.ts` declara tipo. As regras de forma estão no CORE §5.
- Tipo de um só domínio mora no `Types_<Name>.d.ts` dele (Seção 5). Tipo usado por mais de um
  domínio mora no `index.d.ts`.
- Tipo que vem de template mora no `Types_<Name>.d.ts` do template, com o `<Name>` do arquivo que
  o usa (Seção 15), mesmo quando é usado por mais de um domínio.
- `id` é a identidade do próprio objeto; `<entity>Id` é a referência a outra entidade. O nome diz
  o papel do valor, nunca a coluna de origem.

### 9.1 Vocabulário de domínio

Conjunto fechado de valores que o código valida em runtime mora em `Utils_Domain`, como array
`as const`:

```ts
class Utils_Domain {
  static readonly <SET_NAME> = ["<value>", "<value>"] as const;
}
```

O tipo é derivado do array, em `src/types/`, nunca reescrito à mão:

```ts
type <SetName> = (typeof Utils_Domain.<SET_NAME>)[number];
```

O `CONTRACT` §3 sai destes arrays (Seção 16).

## 10. Cofre `Utils_Env`

`Utils_Env` é o único ponto de leitura da configuração do projeto. Nasce do template (Seção 15);
o projeto preenche só os getters.

- Todo id de recurso externo (planilha, pasta, projeto e dataset do BigQuery) e todo segredo
  (chave, token) mora nas Script Properties. Nenhum aparece como literal no código, em `docs/` ou
  no Git.
- Cada valor tem um getter estático em `UPPER_SNAKE_CASE`, com o mesmo nome da propriedade que lê:

```ts
static get <PROPERTY_NAME>(): string {
  return this.getRequiredProperty("<PROPERTY_NAME>");
}
```

- Todo getter lê pela `getRequiredProperty` do template: propriedade ausente ou vazia lança
  `MISSING_SCRIPT_PROPERTY`.

> porquê: propriedade esquecida falha na leitura, com o nome em mãos, e não três camadas adiante.

- `Utils_Env` guarda só o que vem das Script Properties. Nome de fonte fica no `DAO_` dono
  (Seção 8.1); vocabulário de domínio, no `Utils_Domain` (Seção 9.1).
- Os nomes das propriedades, nunca os valores, ficam no `PROGRESS` §5 (CORE §12).

## 11. Erro no GAS

A lei do erro está no CORE §8. No GAS:

- Lança-se sempre `new Error("<ERROR_CODE>")`: o `e.message` carrega só o código, nunca frase nem
  contexto.
- O contexto vai para o log, em inglês, logo antes do `throw`:

```ts
console.error(`[<Prefix>_<Name>] <ERROR_CODE> — <context>`);
throw new Error("<ERROR_CODE>");
```

- Do ponto de lançamento até a entrada, o código sobe sem ser trocado nem traduzido. Um `catch`
  fora do `Utils_Response` relança o mesmo erro; nunca lança outro código.

Quatro códigos são da arquitetura e existem em todo projeto que usa a peça que os lança:

| Código                    | Lançado por            | Chega ao consumidor |
| ------------------------- | ---------------------- | ------------------- |
| `UNEXPECTED_ERROR`        | `Utils_Response`       | Sim                 |
| `LOCK_TIMEOUT`            | `DAO_` (Seção 8.3)     | Sim                 |
| `MISSING_REQUIRED_COLUMN` | `DAO_` (Seção 8.2)     | Não: fica no log    |
| `MISSING_SCRIPT_PROPERTY` | `Utils_Env` (Seção 10) | Não: fica no log    |

### 11.1 `Utils_Response`

O `Utils_Response` é o ponto único que monta o envelope (CORE §8.2), no WebApp e no Receptor.
Nasce do template (Seção 15); o projeto preenche só a lista de códigos conhecidos.

- Todo método de `API_`, e o do Receptor no `Server_Main`, devolve o resultado pelo
  `Utils_Response`; nenhum monta o envelope à mão.
- No Receptor, o `Utils_Response` também monta a resposta HTTP (`ContentService`).
- A lista de códigos conhecidos é o conjunto dos códigos que chegam ao consumidor: os códigos de
  resposta do `CONTRACT` §7 (Seção 16).
- Erro cujo `e.message` está na lista sai com esse código; qualquer outro sai como
  `UNEXPECTED_ERROR`, com o detalhe no log. É assim que um código de log nunca chega ao envelope.
- Na Automação não há envelope: o erro chega ao registro de execução do GAS.

## 12. Cabeçalho de arquivo

Nos arquivos `.ts`, `.d.ts` e `.js`, o cabeçalho do CORE §6.5 é um único bloco `/* */`, na
primeira linha do arquivo:

```ts
/*
 * File:           src/backend/<folder>/<Prefix>_<Name>.ts
 * Description:    <what the file is, in English>
 * Description_pt: <o que o arquivo é, em português>
 */
```

O cabeçalho abre com `/*`, nunca com `/**`: `/**` é o JSDoc (CORE §6.4) e se liga à declaração
seguinte.

## 13. Identidade no GAS

Os dois nomes e os seus lugares estão no CORE §4. No GAS, o projeto na plataforma é o projeto
Apps Script; a pasta na nuvem é a pasta do projeto no Drive; o nome do pacote é o `name` do
`package.json`.

- Nenhum dos dois nomes leva ambiente nem versão.
- O título da página que o usuário vê é texto de tela, em português (CORE §2), e não um dos dois
  nomes.

## 14. Manifesto e implantação

### 14.1 Manifesto

- O `src/appsscript.json` nasce do template (Seção 15), igual nos três perfis.
- A fonte do manifesto é o projeto no GAS: implantação, serviços avançados e escopos mudam no
  editor online e são copiados para `src/appsscript.json`. O Parceiro nunca edita o manifesto no
  disco.

### 14.2 Implantação

- WebApp e Receptor se implantam como Web App, executando como o desenvolvedor, com acesso para
  qualquer pessoa com o link.
- Controle de acesso, quando existe, é feito pela aplicação e verificado no servidor (CORE §7.2).
- A implantação fica registrada no `PROGRESS` §1 (Seção 17.1).

## 15. Templates e biblioteca

Os templates e suas categorias, A e B, seguem o CORE §15.

### 15.1 Templates do backend

| Arquivo               | Categoria | Perfil               | O projeto preenche                                                               |
| --------------------- | --------- | -------------------- | -------------------------------------------------------------------------------- |
| `Server_Main.ts`      | B         | WebApp               | O título da página; opcionalmente, a carga de sessão (o `props` do `renderPage`) |
| `Server_Main.ts`      | B         | Receptor e Automação | As funções de entrada da tabela da Seção 3                                       |
| `Utils_Env.ts`        | B         | Todos                | Os getters (Seção 10)                                                            |
| `Utils_Response.ts`   | B         | WebApp e Receptor    | A lista de códigos conhecidos (Seção 11)                                         |
| `Types_Response.d.ts` | A         | WebApp e Receptor    | Nada                                                                             |
| `index.d.ts`          | B         | Todos                | Os tipos transversais (Seção 9)                                                  |
| `Utils_Render.ts`     | A         | WebApp               | Nada                                                                             |
| `Types_Render.d.ts`   | A         | WebApp               | Nada                                                                             |

- Os arquivos de config e build também vêm do template (Seção 4.1). JSON não aceita comentário e
  não leva `PROJECT:`: o `name` do `package.json` já vem preenchido, e o `scriptId` do
  `.clasp.json` nasce vazio e é preenchido pelo desenvolvedor ao ligar o projeto ao GAS. Projeto
  concluído tem zero `PROJECT:` e o `scriptId` preenchido.
- Arquivo de domínio (`API_`, `Controller_`, `DAO_`, `Storage_`, `Mail_`, `Types_` de domínio,
  `Utils_Domain`) nunca vem de template.

### 15.2 Biblioteca

A biblioteca guarda os templates que servem só a parte dos projetos. Diante de uma necessidade
coberta por um item, o Parceiro pede o arquivo ao desenvolvedor e não escreve outro.

A biblioteca não tem item.

- O item entra no projeto quando o Parceiro o pede, copiado da biblioteca; nunca na criação.
- A biblioteca cresce por decisão do desenvolvedor; o Parceiro não procura candidatos.

## 16. CONTRACT no GAS

A lei do `CONTRACT` está no CORE §11. No GAS, cada seção tem título fixo e sai de um lugar do
código, e só dele:

| §   | Título no `.d.ts`   | Título no `.md`        | Sai de                                                        |
| --- | ------------------- | ---------------------- | ------------------------------------------------------------- |
| 0   | `VALUE CONVENTIONS` | Convenções de valor    | A tabela de leitura do `DAO_` (Seção 8.2)                     |
| 1   | —                   | Transporte             | A implantação (Seção 14.2) e os pontos fixos da Seção 16.2    |
| 2   | `RESPONSE ENVELOPE` | Envelope               | O `Utils_Response` (Seção 11.1)                               |
| 3   | `DOMAIN VOCABULARY` | Vocabulário de domínio | Os arrays do `Utils_Domain` (Seção 9.1)                       |
| 4   | `DATA SHAPES`       | Formas de dados        | Os tipos de retorno das funções da §6, em `src/types/`        |
| 5   | `REQUEST SHAPES`    | Formas de request      | Os tipos dos parâmetros das funções da §6, em `src/types/`    |
| 6   | `PUBLIC SURFACE`    | Superfície exposta     | As funções `public_` (WebApp) ou as do Receptor (Seção 3)     |
| 7   | `ERROR CATALOG`     | Catálogo de erros      | Os `throw` do código e a lista do `Utils_Response` (Seção 11) |
| 8   | `OPERATION RULES`   | Regras de operação     | Os `Controller_` e os locks dos `DAO_`                        |

O template não traz o §8: quando ele se aplica (CORE §11.2), entra depois do §7, com o título desta
tabela. É a parte opcional do template (CORE §15).

Chamadas que devolvem formas diferentes têm tipos diferentes já no código (CORE §5): o `CONTRACT`
nunca descreve uma forma que não exista como tipo.

### 16.1 `CONTRACT.d.ts`

- Cada seção abre com um banner com o número e o título da tabela. Texto livre (o §0 e a seção sem
  conteúdo, que traz `None.` e `Nenhum.`) fica dentro do banner, em inglês e depois em português.
- Todo `type`, toda interface e todo `declare function` levam JSDoc bilíngue (CORE §6.4). Interface
  leva um `@property` e um `@property_pt` por campo, com o que o CORE §11.3 pede: unidade, formato,
  significado do `null` e ordenação.
- O arquivo se basta: toda forma citada é declarada nele, expandida, com o nome que tem em
  `src/types/`.
- O envelope é `ServerResponse<T, E>`, com os campos do CORE §8.2 e `errorCode` do tipo `E | null`.
- Cada função da §6 é um `declare function` com o nome e os parâmetros da `public_`, sob um
  sub-banner com o nome do arquivo `API_` de origem.
- O §7 declara cada código uma vez, em `ErrorCatalog`, incluídos os da arquitetura (Seção 11). O
  valor é `"response"` (chega ao envelope) ou `"log"` (fica só no log); o `@property` diz quando
  o código acontece.
- As chaves `"response"` do `ErrorCatalog` são a lista de códigos conhecidos do `Utils_Response`.
- `CommonErrorCode` reúne os códigos que toda chamada pode devolver e sempre inclui
  `UNEXPECTED_ERROR`. Cada função tem o seu tipo, `<VerbObject>ErrorCode`, só com chaves
  `"response"`.

```ts
/* ============================================================================
 * 2. RESPONSE ENVELOPE
 * ========================================================================== */

/**
 * @description <what the envelope is>
 * @property {boolean} success - <meaning>
 * @property {T | null} data - <meaning of null>
 * @property {E | null} errorCode - <meaning of null>
 *
 * @description_pt <o que é o envelope>
 * @property_pt {boolean} success - <significado>
 * @property_pt {T | null} data - <significado do null>
 * @property_pt {E | null} errorCode - <significado do null>
 */
interface ServerResponse<T, E> {
  success: boolean;
  data: T | null;
  errorCode: E | null;
}

/* ============================================================================
 * 4. DATA SHAPES
 * ========================================================================== */

/**
 * @description <what one object represents>
 * @property {<type>} <field> - <unit, format, meaning of null, order>
 *
 * @description_pt <o que um objeto representa>
 * @property_pt {<type>} <field> - <unidade, formato, significado do null, ordem>
 */
interface <ShapeName> {
  <field>: <type>;
}

/* ============================================================================
 * 6. PUBLIC SURFACE
 * ========================================================================== */

/* --- API_<Name> --- */

/**
 * @description <what the call does>
 * @param {<RequestName>} input - <what it carries>
 * @returns {ServerResponse<<ShapeName>[], <VerbObject>ErrorCode>} <what data carries>
 *
 * @description_pt <o que a chamada faz>
 * @param_pt {<RequestName>} input - <o que carrega>
 * @returns_pt {ServerResponse<<ShapeName>[], <VerbObject>ErrorCode>} <o que data carrega>
 */
declare function public_<verbObject>(
  input: <RequestName>,
): ServerResponse<<ShapeName>[], <VerbObject>ErrorCode>;

/* ============================================================================
 * 7. ERROR CATALOG
 * ========================================================================== */

/**
 * @description <what the catalog is>
 * @property {"response"} UNEXPECTED_ERROR - <when it happens>
 * @property {"response"} <RESPONSE_ERROR_CODE> - <when it happens>
 * @property {"log"} <LOG_ERROR_CODE> - <when it happens>
 *
 * @description_pt <o que é o catálogo>
 * @property_pt {"response"} UNEXPECTED_ERROR - <quando acontece>
 * @property_pt {"response"} <RESPONSE_ERROR_CODE> - <quando acontece>
 * @property_pt {"log"} <LOG_ERROR_CODE> - <quando acontece>
 */
interface ErrorCatalog {
  UNEXPECTED_ERROR: "response";
  <RESPONSE_ERROR_CODE>: "response";
  <LOG_ERROR_CODE>: "log";
}

/**
 * @description Error codes that every function of the PUBLIC SURFACE may return.
 *
 * @description_pt Códigos de erro que toda função da SUPERFÍCIE EXPOSTA pode devolver.
 */
type CommonErrorCode = "UNEXPECTED_ERROR";

/**
 * @description <codes that this call may return>
 *
 * @description_pt <códigos que esta chamada pode devolver>
 */
type <VerbObject>ErrorCode = CommonErrorCode | "<RESPONSE_ERROR_CODE>";
```

### 16.2 `CONTRACT.md`

- Cada seção é um título `## N. <título da tabela>`; seção sem conteúdo traz "Nenhum."
- Toda forma é uma tabela `Campo | Tipo | Descrição`, com a descrição nos termos do CORE §11.3.
- O §3 é uma tabela `Conjunto | Valores`.
- O §6 é uma tabela `Método HTTP | Request (§5) | Resposta (§4) | Códigos (§7)`, com uma linha
  por função do Receptor.
- O §7 é uma tabela `Código | Quando acontece | O que o consumidor faz`; código que fica só no
  log traz "Nunca recebe" na última coluna.
- O §1 declara a autenticação pelo nome do campo, nunca pelo valor (Seção 10), ou que ela não
  existe, e estes pontos do Web App do GAS, todos eles:
  - a URL é a da implantação, terminada em `/exec`;
  - o GAS responde com redirecionamento, que o consumidor segue;
  - o status HTTP é sempre 200: sucesso e falha se distinguem só pelo envelope;
  - requisição e resposta vão em JSON;
  - resposta que não é JSON é falha da plataforma, e o consumidor a trata como `UNEXPECTED_ERROR`.

## 17. PROGRESS no backend

A forma do `PROGRESS` está no CORE §12. O Parceiro Backend escreve só o que esta seção lhe dá.

### 17.1 Parte fixa

A parte fixa é preenchida com o que o desenvolvedor aprovou (CORE §12.3). Depois que o código
existe, cada linha confere com o lugar da última coluna; divergência é apontada ao desenvolvedor
(CORE §1).

| §   | O Parceiro Backend escreve                                                                                                                                                                                                        | Confere com                                 |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| 1   | As pastas, as contas (informadas pelo desenvolvedor), a implantação, o manifesto (escopos e serviços avançados) e as camadas aprovadas (prefixo, pasta e recurso). Os dois nomes e o perfil vêm preenchidos da criação do projeto | Seções 5, 13 e 14 e o `src/appsscript.json` |
| 2   | Uma subseção por fonte, na forma abaixo                                                                                                                                                                                           | Os `DAO_` (Seção 8)                         |
| 3   | As regras de negócio, com papéis, matriz de permissão e vocabulário de domínio                                                                                                                                                    | Os `Controller_` e o `Utils_Domain`         |
| 4   | Receptor: a remissão ao `CONTRACT`. Automação: cada função de gatilho e a sua agenda                                                                                                                                              | O `Server_Main`                             |
| 5   | Os nomes das Script Properties e como cada gatilho é instalado                                                                                                                                                                    | O `Utils_Env` e o `Server_Main`             |

No WebApp, o §4 é do Parceiro Frontend.

Cada fonte do §2 tem esta forma:

```markdown
### <nome da fonte>

DAO dono: `DAO_<Name>` · Grão: <o que uma linha representa>

| Coluna | Tipo bruto | Como chega |
| ------ | ---------- | ---------- |
```

### 17.2 Parte volátil

Nas subseções `Backend` (CORE §12.4), o módulo é um destes, e nenhum outro:

- `Infra`: o `Server_Main`, os `Utils_`, o `index.d.ts` e os arquivos de config e build;
- `Acesso`: os `DAO_`, os `Storage_`, os `Mail_` e os arquivos de camada aprovada;
- um domínio, com o `<Name>` dos seus arquivos `API_`, `Controller_` e `Types_` (Seção 5).
