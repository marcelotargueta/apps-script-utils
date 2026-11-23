# STANDARDS_CORE — Regras portáveis da arquitetura

> Conhecimento fixo, comum a todos os Parceiros. Contém **regras**, nunca **fatos** de uma
> aplicação. O Parceiro lê este documento; nunca o edita.

## 1. Propósito & fronteira

Este documento reúne as regras de arquitetura que **não dependem** de stack nem de aplicação.
O que é específico de uma stack vive no **módulo de stack**; o que é específico de uma aplicação
não vive em Standard nenhum.

O teste de fronteira: **regra que sobrevive a uma troca de stack é deste documento; regra que muda
de forma ou deixa de existir na troca é do módulo de stack.**

A separação que governa tudo é **regra vs. fato**:

- **Regra** é portável: diz onde e como algo se faz, sem citar entidade, papel nem valor
  concreto.
- **Fato** é de uma aplicação: suas entidades, seus papéis, sua matriz de permissão, seus
  códigos de erro e as frases que os traduzem.

Daí as três camadas de conhecimento:

1. **Arquitetura** — estes Standards. Conhecimento fixo do Parceiro.
2. **Contexto do projeto** — entidades, papéis, matriz de permissão, vocabulário de domínio.
   Vive na pasta `docs/` de cada projeto (Seção 10) e é entregue ao Parceiro quando o projeto abre.
3. **Código** — a aplicação em si.

O Parceiro carrega a camada 1 sempre e a camada 2 quando recebe um projeto. Por isso o mesmo
Parceiro serve a qualquer aplicação: não carrega fato de nenhuma.

**Os Standards são soberanos** sobre o código e os artefatos do projeto:

- O módulo de stack detalha o `CORE` e nunca o contradiz; em conflito, vale o `CORE`.
- Onde o código ou um artefato diverge de um Standard, a divergência é apontada ao
  desenvolvedor, que decide. Nenhum dos lados é alterado sem essa decisão.
- Caso que nenhum Standard cobre é levado ao desenvolvedor; nunca se resolve por convenção
  inventada.

**O que nunca entra aqui:** qualquer fato, qualquer mecânica de stack e qualquer regra de
_comportamento_ do Parceiro (persona, ritmo de validação, formato de resposta), que mora na
**instrução** do Parceiro.

## 2. Idioma & comunicação

O código é escrito **inteiramente em inglês**: nomes de arquivo, variáveis, funções, classes,
tipos, comentários, logs internos e mensagens de commit do repositório de projeto (Seção 14).

> porquê: as palavras-chave da linguagem e as APIs que o código consome já são em inglês;
> misturar idiomas no código cria atrito de leitura.

Nome que pertence a um recurso externo (tabela, coluna, aba) mantém a grafia da fonte e aparece
no código só como **valor**, nunca como identificador.

A **documentação do código** (JSDoc, cabeçalhos de arquivo) é **bilíngue**: inglês primeiro,
português logo abaixo, com sufixo `_pt`. O formato está na Seção 6. O comentário dentro da
lógica (Seção 6.3) é só em inglês.

O `README.md` e os **artefatos de projeto em Markdown** (os `.md` de `docs/`) são escritos só em
português. O `CONTRACT.d.ts` é código e segue a regra do código.

O **texto que o usuário final lê** (telas, toasts, e-mails) e a **descrição de implantação**
são em português. O texto de tela é traduzido na fronteira de saída (Seção 8).

**Nunca misture idiomas dentro de um mesmo identificador**: `getUsuarioById` é proibido; ou
vira `getUserById`, ou o nome é repensado.

## 3. Nomenclatura & case

Identificadores seguem um case fixo por categoria, em qualquer linguagem da stack:

- **`camelCase`** para variáveis e funções (`userData`, `isValid`).
- **`PascalCase`** para classes, tipos e interfaces (`UserProfile`, `RecordInput`).
- **`UPPER_SNAKE_CASE`** para constantes (`MAX_ROWS`): valor fixo, de módulo, conhecido antes de
  o código rodar. Variável local que não muda não é constante.

Arquivos de código seguem **`<Prefix>_<Name>`**, com o nome em PascalCase e um **prefixo que
marca o papel do arquivo na arquitetura**: o papel fica legível antes de abrir o arquivo. O
prefixo vem do catálogo do módulo de stack; nenhum outro é usado.

Cada prefixo tem uma pasta, dada pelo catálogo: arquivo com prefixo fora da sua pasta é violação.
**Domínio** é um assunto do app.

O módulo de stack pode acrescentar um prefixo fixo a uma categoria de identificador; o restante
do nome segue o case desta seção.

## 4. Identidade do projeto

Todo projeto tem uma identidade formada por três termos, escritos sem acento e sem espaço:

- **Área:** quem encomenda o trabalho (órgão, empresa, entidade), em PascalCase; sigla mantém
  as maiúsculas.
- **Nome:** o nome do sistema, em português, em PascalCase; sigla mantém as maiúsculas.
- **Papel:** o que o programa é no sistema, numa palavra só, termo técnico em inglês, em
  PascalCase.

Os três termos são escolha do desenvolvedor. Deles derivam dois nomes, e só dois; os nomes são
calculados, nunca escolhidos:

| Nome                | Onde                                                     | Forma                                  |
| ------------------- | -------------------------------------------------------- | -------------------------------------- |
| **Título**          | Projeto na plataforma                                    | `<Área>_<Nome> - <Papel>`              |
| **Nome de máquina** | Pasta local, repositório, pasta na nuvem, nome do pacote | `<área>-<nome>-<papel>`, em kebab-case |

No Título, os únicos espaços são os dois que cercam o hífen do separador.

No nome de máquina, tudo vai em minúsculas. A Área e o Papel viram um segmento só cada. No Nome,
cada palavra vira um segmento, e cada sigla, um segmento só.

> porquê: com a Área num segmento só, o nome de máquina se lê por posição: o primeiro segmento é a
> Área, o último é o Papel e os do meio são o Nome.

Programas do mesmo sistema compartilham Área e Nome e diferem só no Papel.

## 5. Tipagem

Toda camada escrita em linguagem tipada é **fortemente tipada**: tipos explícitos para
parâmetros, retornos e estruturas de dados. O tipo é o contrato da forma do dado, verificado
antes de o código rodar.

- **Sem saída de escape:** nem `any`, nem diretiva que desliga a checagem (`@ts-ignore`,
  `@ts-nocheck`). Tipo de fato desconhecido é `unknown`, estreitado por checagem explícita.
- **Tipos nomeados:** forma que aparece em mais de uma assinatura ganha nome. O nome faz do tipo
  o ponto único de verdade sobre aquela forma.
- **Um tipo por forma:** formas distintas são tipos distintos, nunca um tipo com tudo opcional que
  cobre todas.
- **Conjunto fechado é união literal:** campo que aceita um conjunto fixo de valores tem esses
  valores no tipo, nunca `string`.
- **O tipo vem antes do código:** declara-se o tipo antes de escrever o código que o usa.

Quais camadas são tipadas é mecânica de stack. Quando uma camada é tipada e a outra não, o
`CONTRACT` carrega a forma expandida dos dados (Seção 11).

## 6. Disciplina de documentação

A documentação de cada arquivo ou função é o seu **contrato local**: descreve o que ele **é
hoje**, de dentro do próprio arquivo. As regras abaixo são critério de entrega, não de estilo.

### 6.1 Estado, nunca história

JSDoc e cabeçalhos descrevem o **estado atual**. Estão **proibidas** marcas de narrativa, nas
duas línguas: "alterado", "agora", "antes era", "refatorado para", "atualizado para";
"changed", "now", "previously", "refactored to", "updated to".

Quando o código muda, a doc muda **junto**, para descrever o novo estado. O "mudou de X para Y"
tem um lar só: a mensagem do commit (Seção 14).

> ⚠️ **EXEMPLO PRÁTICO**
>
> ❌ O cabeçalho narra a sessão de trabalho:
>
> ```
> Description: Refactored to use the new layout strictly.
> ```
>
> ✅ O cabeçalho descreve o que o arquivo é:
>
> ```
> Description: Main page layout: header, content area and footer.
> ```

### 6.2 Bilíngue completo é critério de entrega

Toda doc carrega o bloco em inglês **e** a versão `_pt` (Seção 2): uma tag `_pt` para cada tag
em inglês, na mesma ordem. Função ou arquivo sem as duas está **incompleto**.

### 6.3 Enxuto

Documenta-se **o necessário, não o óbvio**:

- **JSDoc** só no que outro código consome: função exportada ou exposta, membro público de
  classe (método, getter ou propriedade), ponto de entrada, tipo e interface nomeados. Lógica
  interna não leva JSDoc.
- Dentro da lógica, comentário apenas para um **porquê** não óbvio: uma decisão que o código
  sozinho não explica. Nunca para narrar o _o quê_, linha a linha, nem para citar parágrafo de
  Standard (`// CORE §7.2`).

  > porquê: a citação apodrece quando o Standard é renumerado, e o código precisa se explicar
  > sem ele.

### 6.4 Modelo de JSDoc

Bloco bilíngue, inglês primeiro, `_pt` logo abaixo. `@description` sempre; `@param` para cada
parâmetro; `@returns` quando há retorno.

```ts
/**
 * @description Validates the payload and persists a new record.
 * @param {RecordInput} input - Raw data received from the caller.
 * @returns {boolean} True when the record was written.
 *
 * @description_pt Valida o payload e persiste um novo registro.
 * @param_pt {RecordInput} input - Dados crus recebidos do chamador.
 * @returns_pt {boolean} Verdadeiro quando o registro foi gravado.
 */
```

### 6.5 Cabeçalho de arquivo

Todo arquivo de código-fonte carrega, no topo, um cabeçalho com três campos, nesta ordem. HTML
e folha de estilo também levam.

```
File:            <caminho do arquivo, a partir da raiz do projeto>
Description:     <o que o arquivo é, em inglês>
Description_pt:  <o que o arquivo é, em português>
```

As regras 6.1 e 6.2 valem para o cabeçalho.

- `File` usa `/` como separador, sem barra inicial e sem letra de unidade.
- Um bloco só: nenhum outro comentário repete `File` ou a descrição.
- O espaçamento entre rótulo e valor é livre.

> A sintaxe dos três campos em cada tipo de arquivo é mecânica de stack.

## 7. Arquitetura em camadas

A lógica de servidor se separa em três camadas, e a chamada flui numa direção só:
**entrada → regra de negócio → acesso**. Uma camada só chama a que vem depois dela, nunca a
anterior. O prefixo do arquivo (Seção 3) diz a que camada ele pertence.

- **Entrada (fronteira):** recebe a chamada do consumidor, captura a identidade de quem chama,
  delega e devolve o envelope (Seção 8.2). Não decide, não calcula, não toca dado.
- **Regra de negócio:** valida, calcula, **autoriza** e orquestra chamadas à camada de acesso.
  É onde mora a decisão. **Nunca** faz I/O direto; a identidade chega a ela por parâmetro.
- **Acesso:** a única camada que toca um recurso externo. Lê e grava, sem regra de negócio nem
  decisão de permissão. É nela que o nome da fonte vira o nome do código (Seção 2).

### 7.1 Quando a camada de regra é obrigatória

Leitura pura, sem permissão, filtro nem transformação, vai da entrada direto à camada de acesso,
sem uma camada de regra vazia só para repassar. A camada de regra é **obrigatória** em toda
escrita e em toda leitura com **autorização, filtragem ou transformação** do dado.

### 7.2 Autorização mora na regra de negócio

Decidir _quem pode o quê_ é responsabilidade exclusiva da camada de regra, nunca da entrada
(que só delega) nem da camada de acesso (que só faz I/O). A autorização é verificada no
servidor, em toda chamada exposta; esconder um controle na tela não é autorização.

### 7.3 Uma camada de acesso por recurso externo

Cada recurso externo tem uma **camada de acesso própria**, de I/O puro, e só ela toca a API
desse recurso. Os casos da arquitetura:

- **Dados estruturados** (registros, tabelas) → objeto de acesso a dados (DAO).
- **Arquivos binários** (uploads, mídia) → objeto de armazenamento (Storage), **separado** do DAO.
- **Mensagens enviadas** (e-mail) → objeto de envio (Mail), **separado** dos dois.

Uma camada nova só nasce quando as duas respostas são sim: é acesso a um serviço externo que
nenhuma camada cobre, e faz sentido confinar a API desse serviço num lugar só. Necessidade de
lógica não é camada: vai para a regra de negócio ou para um utilitário. O Parceiro propõe a
camada nova; criar é decisão do desenvolvedor.

> Nomes de arquivo, classes e as APIs que cada camada toca são mecânica de stack.

## 8. Contrato de erro

Um erro tem dois públicos: o **desenvolvedor**, que lê o log para diagnosticar, e o **usuário
final**, que lê uma mensagem na tela. O contrato separa os dois.

- **Erro interno** carrega um **código estável**, em inglês e em `UPPER_SNAKE_CASE`. O que se
  lança é só o **código**, nunca uma frase. O log pode acrescentar contexto, sempre em inglês, e
  nunca chega ao usuário.
- **Mensagem ao usuário** (tela, toast, e-mail) é **traduzida na fronteira de saída**, pelo
  consumidor do erro, nunca no ponto onde o erro é lançado.

### 8.1 Casar erro por código, nunca por string

Tratar um erro se faz **pelo código**, nunca comparando o texto da mensagem.

> porquê: o texto muda com revisão, tradução e ajuste de tom; o código é o que permanece.

### 8.2 Envelope de resposta

Toda chamada que atravessa a fronteira entre dois programas devolve o mesmo envelope, com os
três campos sempre presentes:

```ts
{
  success: boolean;
  data: T | null;
  errorCode: string | null;
}
```

- **Sucesso:** `success` é `true`, `data` traz a carga e `errorCode` é `null`.
- **Falha:** `success` é `false`, `data` é `null` e `errorCode` traz o código estável.

O envelope nunca carrega frase de usuário, só o código. Erro não previsto sai com o código
`UNEXPECTED_ERROR`: o detalhe vai para o log, nunca para o envelope. O envelope é montado num
**ponto único**, na camada de entrada (Seção 7), nunca à mão em cada chamada.

### 8.3 Catálogo de tradução

O catálogo que mapeia cada código à frase de tela é **fato** do projeto (Seção 1) e mora no
código do consumidor, num ponto único da sua fronteira de saída.

- Os códigos que cada chamada pode devolver são declarados no `CONTRACT` §7 (Seção 11); o
  catálogo tem uma entrada para cada um deles.
- Código sem entrada no catálogo cai numa frase genérica; nunca é exibido cru ao usuário.

## 9. Perfis de projeto

Todo projeto pertence a um de três perfis, definidos por duas perguntas: **tem tela**, usada por
uma pessoa? E **expõe endpoint**, chamado por outro programa?

| Perfil        | Tem tela | Expõe endpoint | Fronteira                            | CONTRACT        |
| ------------- | -------- | -------------- | ------------------------------------ | --------------- |
| **WebApp**    | Sim      | Não            | Backend ↔ frontend, no mesmo projeto | `CONTRACT.d.ts` |
| **Receptor**  | Não      | Sim            | Programa ↔ outro programa            | `CONTRACT.md`   |
| **Automação** | Não      | Não            | Nenhuma                              | Não tem         |

- A Automação roda por agendamento ou execução manual.
- Sistema que tem tela e também expõe endpoint são dois projetos: um WebApp e um Receptor.
- Chamar o endpoint de outro programa não muda o perfil: o consumidor lê o `CONTRACT` de quem expõe.
- O perfil não é o Papel do nome (Seção 4): o Papel diz o que o programa faz; o perfil, que
  fronteira ele tem.
- O perfil é declarado no `PROGRESS` §1 (Seção 12).

## 10. Artefatos de projeto

Todo projeto tem uma pasta `docs/` na raiz, com os **artefatos de projeto**. O conjunto é fechado:
`docs/` contém os arquivos desta tabela que cabem ao perfil do projeto (Seção 9), e nenhum outro.

| Artefato             | Perfil   | Quem escreve                                  | Regra                       |
| -------------------- | -------- | --------------------------------------------- | --------------------------- |
| `docs/PROGRESS.md`   | Todos    | O Parceiro em atividade                       | Seção 12                    |
| `docs/CONTRACT.d.ts` | WebApp   | O lado que expõe a superfície                 | Seção 11                    |
| `docs/CONTRACT.md`   | Receptor | O lado que expõe a superfície                 | Seção 11                    |
| `docs/INSIGHTS.md`   | Todos    | O Parceiro em atividade, a pedido             | Seção 13                    |
| `docs/MANUAL.md`     | WebApp   | O Parceiro Frontend                           | Módulo de stack do frontend |
| `docs/CASE.md`       | Todos    | Uma sessão sem Standards carregados, a pedido | Instrução do CASE           |

- Todo artefato nasce do template, vazio, junto com o projeto.
- Cada artefato é **um arquivo único, sempre no estado atual**. A evolução fica no Git; nunca há
  cópia versionada em disco (`v1`, `v2`, numeração). O `INSIGHTS` é o único que acumula (Seção 13).
- Só quem a tabela aponta escreve no artefato; os demais apenas leem.
- Conteúdo que precisa durar além da conversa vira arquivo em `docs/`; fora de arquivo, não é
  artefato.

A única exceção ao conjunto fechado são os arquivos temporários da fase de design,
`docs/GABARITO_<Nome>.html`, regidos pelo módulo de stack do frontend.

O `README.md` fica na raiz, fora de `docs/`: nasce pronto do template, e o projeto só preenche a
frase de apresentação.

## 11. CONTRACT

O `CONTRACT` é o espelho da fronteira entre dois programas: superfície exposta, forma dos dados e
erros. Não carrega regra de negócio. Existe nos perfis com fronteira, no arquivo que o perfil
determina (Seção 9).

### 11.1 Formato

| Arquivo         | Quem lê                                       | Forma                             |
| --------------- | --------------------------------------------- | --------------------------------- |
| `CONTRACT.d.ts` | O frontend do mesmo projeto                   | Só declarações de tipo, com JSDoc |
| `CONTRACT.md`   | Programa em outra linguagem ou outro processo | Markdown, com as formas em tabela |

### 11.2 Anatomia

Numeração fixa nos dois formatos. `§N` designa seção do artefato; `Seção N`, deste Standard.
Só o §1 e o §8 podem ser omitidos; os demais existem sempre e mantêm o número.

| §   | Seção                                                                                                                                      | Quando entra                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| 0   | Convenções de valor (`null`, datas, percentual, ids)                                                                                       | Sempre                                                          |
| 1   | Transporte (endpoint, autenticação, HTTP)                                                                                                  | Só no `CONTRACT.md`                                             |
| 2   | Envelope (Seção 8.2)                                                                                                                       | Sempre                                                          |
| 3   | Vocabulário de domínio: os conjuntos fechados de valores que um campo aceita                                                               | Sempre; sem conteúdo, declara "nenhum"                          |
| 4   | Formas de dados                                                                                                                            | Sempre                                                          |
| 5   | Formas de request                                                                                                                          | Sempre; sem conteúdo, declara "nenhum"                          |
| 6   | Superfície exposta                                                                                                                         | Sempre                                                          |
| 7   | Catálogo de erros: como o erro chega ao consumidor, que códigos ele recebe, que códigos ficam só no log e quais cada chamada pode devolver | Sempre; no `CONTRACT.md`, com a coluna "o que o consumidor faz" |
| 8   | Regras de operação (ordem, idempotência, recuperação)                                                                                      | Só quando as chamadas dependem de ordem ou podem se repetir     |

### 11.3 Regras de conteúdo

1. **Espelho exato.** Toda função exposta está no §6 e todo código de resposta lançado está no
   §7; nada consta no `CONTRACT` sem existir no código.
2. **Só o confirmado.** Nenhum marcador de pendência (`TODO`, `TBD`, `?`, "a confirmar"). Código
   de erro ainda não confirmado no código-fonte vai para o §7 do `PROGRESS` (Seção 12).
3. **O dado, nunca a tela.** A descrição de cada campo traz unidade, formato, significado do
   `null` e ordenação. Rótulo, posição de tela e agregação visual moram nos componentes do
   frontend.
4. **Recorte do código, não cópia.** Só o que atravessa a fronteira. Cada forma aparece
   expandida: todo campo com o seu tipo, nunca só o nome do tipo. Os tipos internos ficam no
   código.

### 11.4 Autoria e ciclo de vida

1. Escreve o Parceiro Backend do projeto que expõe a superfície; o consumidor nunca edita.
2. Nasce do template, com as seções numeradas.
3. É preenchido de uma vez, quando o desenvolvedor declara a superfície fechada; nunca aos poucos.
4. A fonte é o código, nunca a conversa.
5. Mudança de superfície (função exposta, forma que atravessa a fronteira ou código de erro) →
   regeneração inteira, do código, sobre o template. Nunca remendo.
6. Cada geração é um commit do tipo `docs` (Seção 14).

## 12. PROGRESS

O `PROGRESS` descreve o projeto: o que ele é e onde ele está. Existe em todo projeto.

### 12.1 Anatomia

Oito seções, de numeração fixa. Nenhuma é omitida; seção sem conteúdo declara "nenhum". `§N`
designa seção do artefato; `Seção N`, deste Standard.

| §   | Seção                    | Conteúdo                                                                                                                                                                                  |
| --- | ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|     | **Parte fixa**           | **O que o projeto é**                                                                                                                                                                     |
| 1   | Identidade               | Os dois nomes (Seção 4), o perfil (Seção 9), pastas, contas, implantação, manifesto e camadas de acesso aprovadas (Seção 7.3)                                                             |
| 2   | Fontes e modelo de dados | Fontes (abas, tabelas, views), grão (o que uma linha representa), campos com o tipo bruto (como o valor está gravado na fonte) e como o dado chega de fato (vazios, formatos irregulares) |
| 3   | Regras de negócio        | Inclui papéis, matriz de permissão e vocabulário de domínio                                                                                                                               |
| 4   | Superfície de uso        | Telas (WebApp), remissão ao `CONTRACT` (Receptor) ou gatilhos e agendas (Automação)                                                                                                       |
| 5   | Operação                 | Testar, implantar, configurar (nomes das propriedades de configuração, nunca os valores), agendar                                                                                         |
|     | **Parte volátil**        | **Onde o projeto está**                                                                                                                                                                   |
| 6   | Estado                   | O que funciona hoje, por módulo (camada, tela ou fluxo); nunca a lista de arquivos                                                                                                        |
| 7   | Pendências               | O que falta fazer ou confirmar, incluindo os itens não confirmados que saem do `CONTRACT`                                                                                                 |
| 8   | Próximo passo            | A próxima unidade de trabalho: o que fazer e em que módulo                                                                                                                                |

### 12.2 Regras de conteúdo

1. **Só fato do projeto.** Regra que valeria para qualquer projeto não entra.
2. **Nada que já tenha casa em outro lugar:** a lista de arquivos (o disco); as frases de erro (o
   código do consumidor) e os códigos (`CONTRACT` §7); a decisão visual (os componentes e a folha de
   estilo); o comportamento do Parceiro (a instrução).
3. **Onde o projeto está, nunca o que aconteceu na sessão.** Sem marcas de narrativa (Seção 6.1).

### 12.3 Autoria e ciclo de vida

1. O Parceiro em atividade propõe; o desenvolvedor aprova.
2. Nasce do template, com as oito seções numeradas.
3. **Parte fixa:** preenchida quando o desenvolvedor aprova identidade, dados e regras. Depois,
   corrigida no lugar, só quando um fato do projeto muda.
4. **Parte volátil:** cada Parceiro reescreve inteiras as suas subseções (Seção 12.4), sobre o
   template, no handoff e só no handoff. Nunca editada por cima da anterior.
5. A fonte é o estado real (o que o código tem e o que foi aprovado), nunca o relato da sessão.
6. Cada handoff é um commit (Seção 14).

### 12.4 Forma da parte volátil

Cada seção da parte volátil (§6, §7 e §8) se divide em subseções por Parceiro, com estes títulos:
`Backend` e, só no WebApp, `Frontend`. Cada Parceiro escreve só as suas.

- **§6 Estado:** tabela `Módulo | Estado`, com uma linha por módulo do projeto. O estado é um
  destes, e nenhum outro: `pronto`, `em construção`, `não iniciado`. O que conta como módulo, o
  Standard de stack do Parceiro define.
- **§7 Pendências:** tabela `Pendência | Módulo | Tipo`. A pendência é uma frase que diz o que
  falta, sem hipótese, opção nem justificativa. O tipo é `fazer` (trabalho por executar) ou
  `confirmar` (fato por verificar).
- **§8 Próximo passo:** uma frase, com o que fazer e em que módulo.
- O módulo citado no §7 e no §8 é um dos listados no §6 da mesma subseção.
- Subseção sem conteúdo declara "nenhum" (Seção 12.1).
- Nenhuma entrada cita data nem sessão (Seção 12.2).

## 13. INSIGHTS

O `INSIGHTS` registra as lições de engenharia do projeto, para pares técnicos. Existe em todo
projeto e nunca é apagado. É o **único artefato narrativo**, que conta o que aconteceu, e o
**único que acumula**: cada insight entra como seção nova, no fim, e as seções existentes nunca
são reescritas.

### 13.1 Anatomia

Uma abertura de um parágrafo, com o problema que o projeto enfrenta, escrita junto com o primeiro
insight. Depois, uma seção por insight, com quatro partes, nesta ordem e com estes rótulos:

1. **Título:** a lição, numa frase afirmativa. É o título da seção.
2. **O que parecia certo:** a abordagem ou a suposição adotada de início.
3. **O que aconteceu:** onde falhou, com o fato concreto.
4. **A lição:** a regra que ficou.

### 13.2 Regras de conteúdo e autoria

1. Escrito pelo Parceiro em atividade, **só a pedido do desenvolvedor**, nunca por iniciativa
   própria.
2. Cada insight se lê sozinho: sem remissão a outro insight.
3. A parte "A lição" vale fora do projeto: não cita arquivo, função nem entidade do projeto.
4. Código só quando o exemplo é a própria lição, em trecho de até 10 linhas.

## 14. Commits

A mensagem do commit é o único lar da história do projeto (Seção 6.1).

### 14.1 Formato

Conventional Commits: `tipo(escopo): descrição`.

- **Tipo:** um dos sete de 14.2, e nenhum outro. Sempre em inglês, em qualquer repositório,
  porque é palavra-chave.
- **Escopo:** opcional; a camada ou o módulo afetado, numa palavra, em minúsculas.
- **Descrição:** começa em minúscula, sem ponto final.
- **Primeira linha:** até 72 caracteres, com tipo e escopo incluídos.
- **Corpo:** opcional, abaixo da primeira linha, separado por uma linha em branco. É onde mora
  o porquê da mudança.

O idioma da descrição e do corpo segue o público do repositório:

| Repositório                                     | Idioma    | Descrição                                         |
| ----------------------------------------------- | --------- | ------------------------------------------------- |
| Projeto                                         | Inglês    | No imperativo (`add`, `fix`)                      |
| Arquitetura (Standards, instruções e templates) | Português | No presente do indicativo (`registra`, `corrige`) |

### 14.2 Tipos

| Tipo       | Quando                                                               |
| ---------- | -------------------------------------------------------------------- |
| `feat`     | Funcionalidade nova                                                  |
| `fix`      | Correção de defeito                                                  |
| `refactor` | Muda a estrutura sem mudar o comportamento                           |
| `docs`     | Só documentação: artefatos de projeto, README, JSDoc, Standards      |
| `build`    | Scripts de build, manifesto e arquivos de config                     |
| `test`     | Testes automatizados, novos ou alterados                             |
| `chore`    | Manutenção que não cabe nos outros: mover arquivos, ignorar arquivos |

- Não se usa `style`: mudança de classe de estilo é `feat` ou `fix`.
- Commit que toca código e documentação leva o tipo da mudança de código; `docs` é só para o
  commit que não toca código.

### 14.3 Granularidade

Um commit é uma **unidade de trabalho concluída e funcionando**: nem um por arquivo, nem um por
resposta do Parceiro. Fecha quando algo ficou pronto e o build passa.

O handoff também fecha um commit, mesmo com trabalho em aberto; o que ficou aberto é registrado
no `PROGRESS` §7 (Seção 12).

Dois testes de tamanho:

- Mensagem que precisa de "e" ligando coisas sem relação são dois commits.
- O que faria sentido desfazer como um pacote é um commit.

## 15. Templates e marcação de preenchimento

Os templates da arquitetura são a fonte única dos arquivos de infraestrutura: o projeto os
recebe copiados, nunca reescritos. Cada template é de uma de duas categorias:

- Categoria A: idêntico em todo projeto; o projeto nunca o altera.
- Categoria B: o projeto preenche só os pontos marcados com `PROJECT:` e as partes opcionais
  que o módulo de stack nomeia, e não altera o resto.

Mudança em template é decisão do desenvolvedor e se faz no template, nunca só no projeto.

Pasta que nasce vazia leva `.gitkeep`, que não segue o padrão `<Prefix>_<Name>` (Seção 3) nem
leva cabeçalho (Seção 6.5).

Cada ponto de um template que cabe ao projeto resolver leva um comentário que começa pela
palavra-chave `PROJECT:`, em maiúsculas, seguida do que o projeto põe ali, em inglês. O comentário
usa a sintaxe do tipo de arquivo; Markdown usa a do HTML.

```
// PROJECT: configuration getters of this project
<!-- PROJECT: font families of this app -->
```

- O ponto nasce vazio, nunca com exemplo de domínio.
- A marcação só vem do template; o projeto nunca cria uma.
- O projeto resolve cada marcação de um de dois modos: troca a marcação pelo seu trecho ou, quando
  não há o que pôr ali, apaga a marcação. Nos dois casos, a marcação sai do arquivo.
- As partes opcionais que o módulo de stack nomeia não levam marcação: cada uma entra quando a regra
  que a nomeia pede.
- A busca por `PROJECT:` lista os pontos por resolver. Um projeto só está concluído com zero
  ocorrências.
