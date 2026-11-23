# DISCIPLINA_DE_ESCRITA — Como se redigem os Standards e as instruções

> A lei de **como** um Standard ou uma instrução se escreve, não do que contém. Vale para qualquer
> arquitetura e qualquer sessão. Governa o **texto do documento**, não a conversa de elaboração,
> onde a densidade é livre. Fora da anatomia, cada regra vale para os dois. Lê-se antes de escrever
> qualquer seção.

---

## 1. Anatomia do Standard

Uma arquitetura tem dois tipos de Standard: o **CORE**, com as regras que não dependem de stack
nem de aplicação, e o **módulo de stack**, com a mecânica dessas regras numa stack. Todo Standard
abre com a mesma estrutura, nesta ordem:

1. **Título:** `# <NOME_DO_ARQUIVO> — <o que o documento cobre>`.
2. **Cabeçalho em citação:** o que o documento é; que contém regras, nunca fatos de aplicação; e
   que o Parceiro o lê e nunca o edita.
3. **`## 1. Propósito & fronteira`**, com o conteúdo do seu tipo.

No CORE, o §1 traz, nesta ordem:

- o que o documento reúne e onde vive o resto: o específico de stack, no módulo; o específico de
  aplicação, em nenhum Standard;
- o teste de fronteira: a regra que sobrevive a uma troca de stack é do CORE; a que muda de forma
  ou deixa de existir é do módulo;
- a separação entre regra e fato e as camadas de conhecimento que decorrem dela;
- a soberania: os Standards prevalecem sobre o código e os artefatos, o módulo nunca contradiz o
  CORE, e a divergência ou o caso não coberto vai ao desenvolvedor;
- **O que nunca entra aqui:**, com fato, mecânica de stack e comportamento do Parceiro.

No módulo de stack, o §1 traz, nesta ordem:

- o que o documento dá e a relação com o CORE: detalha e nunca contradiz; em conflito, vale o
  CORE; o que o CORE já diz é ancorado, nunca repetido;
- a convenção de remissão: `Seção N` para seção deste documento, `<MÓDULO> §N` para seção de outro
  Standard e `§N` depois do nome de um artefato para seção do artefato;
- **Não contém:**, com o que fica de fora e, entre parênteses, o documento que o contém;
- quem carrega o documento, junto com que Standards, e para que perfis ele vale.

As seções seguintes são numeradas (`## N. Título`, `### N.M Título`).

> porquê: o Parceiro carrega vários Standards juntos. Com a mesma abertura em todos, ele acha o
> escopo de cada um e sabe a quem ceder em conflito sem ler o documento inteiro.

---

## 2. Anatomia da instrução

A instrução dá o comportamento de uma sessão: como ela trabalha com o desenvolvedor. Abre assim:

1. **Título:** `# INSTRUCAO_<NOME> — Conduta <de quem a carrega>`.
2. **Cabeçalho em citação:** que contém comportamento, nunca regra nem fato; onde vivem a regra
   (nos Standards carregados) e o fato (no `docs/` do projeto); e que prevalece sobre o
   comportamento padrão do modelo.
3. **`## 1. Papel`:** quem a sessão é e o que ela constrói ou escreve.

A instrução de Parceiro segue com `Ritmo` (o passo e a validação), `Resposta` (a forma da resposta
e das edições), `Sessão` (abertura, retomada, fechamento e handoff) e `Método` (os procedimentos
próprios do papel).

A sessão que não carrega Standard leva na instrução a regra do artefato que escreve, numa seção
com o nome dele, seguida de `Método` e `Entrega`; o cabeçalho diz que a instrução contém essa
regra.

---

## 3. A régua de cada seção

Toda seção segue **lei + porquê mínimo + jurisprudência só quando corrige**.

- **Lei primeiro, prosa curta.** A regra acionável abre o parágrafo, em 1–2 frases.
  O resto da seção a sustenta; não a adia.
- **`> porquê:` só quando a regra não é óbvia.** Uma a duas linhas, e só quando a lei
  decidiria errado sem ele: é o que deixa o Parceiro generalizar para um caso novo. Não
  é obrigatório em toda regra.
- **Não repetir outro Standard.** Onde a regra é dele, **âncora e segue** (`CORE §X`,
  `BACKEND §Y`) e nunca a reescreve. A âncora confere-se contra o texto real antes de usar.
- **Justificativa longa é exceção nomeada e rara.**

> porquê sobriedade é lei e não estilo: o Parceiro carrega vários Standards na mesma janela.
> Documento prolixo gasta o orçamento de contexto **carregando** a lei, e sobra pouco para
> **aplicá-la**. Texto enxuto é o que torna o módulo operável: a economia não é estética,
> é o que faz a lei caber junto do trabalho.

---

## 4. Jurisprudência só quando corrige

Código real entra **só** em bloco `⚠️ EXEMPLO PRÁTICO`, e **só** para um ❌→✅ que a
prosa sozinha não fixa. Exemplo que só ilustra uma regra já clara, ou que é de outra stack ou
camada, fica de fora.

> porquê o filtro: jurisprudência é cara em espaço e em atenção. Paga-se por ela quando
> corrige um erro que a prosa não previne; não se paga por decoração.

---

## 5. Placeholder neutro no corpo; nome real só na jurisprudência

A lei, no corpo, usa **placeholder neutro**: `<Prefix>_<Name>`, `<verbObject>`. Papel
**universal** (um por sistema) pode ser canônico, com nome fixo. **Nome de domínio**, o
assunto do app, aparece **só dentro de `⚠️`**, nunca no corpo.

> porquê o domínio fica fora do corpo: nome de domínio na lei lê-se como **requisito**,
> e o modelo o replica: campo fértil para alucinação. O placeholder ensina a **forma**
> sem prender o app. A grafia da convenção em discussão (um prefixo, um padrão de classe)
> não é nome de domínio e pode ficar.

---

## 6. Estado, nunca história

O Standard descreve o que a regra **é**, jamais o que mudou nela (CORE §6.1). Ficam fora do
texto: narrativa de sessão, meta-texto sobre o próprio documento e
**vocabulário-de-processo**, como "Decisão:", "Proposta:" e marcas decorativas (⚖️, ✨, ⚙️).
O documento é a lei vigente, não o registro de como se chegou a ela.

---

## 7. O bloco de código mostra a forma; a legenda explica

Dentro de um bloco de código:

- **Zero comentário que narre o _o quê_** (`// faz X`, `/* trata Y */`). O bloco exibe a forma;
  a explicação vive na prosa fora dele. (O comentário de **porquê** não óbvio é do CORE §6.3,
  no código real; no Standard, a prosa já o carrega.)
- **Zero frase em idioma de usuário:** a mensagem traduzida não entra no código, **nem como
  anti-exemplo**. O ❌ descreve-se na legenda, fora do bloco.
- **Rótulos ✅/❌ são legenda fora do bloco**, nunca comentário dentro.

> porquê a fronteira: o código carrega o que é do código (a forma, em inglês); a prosa carrega o
> que é da prosa (a explicação, o juízo, o idioma de tela). Misturar os dois, com comentário que
> narra ou frase de usuário no bloco, apaga a própria fronteira que o Standard ensina.

---

## 8. Mecânica conferida, regra com uso

- **Mecânica de plataforma entra conferida.** O comportamento de uma API ou de uma plataforma só
  vai para o texto depois de conferido na documentação oficial ou num teste; nunca de memória.
- **Regra entra com uso real.** A regra nasce de um caso que um projeto já viveu, nunca de uma
  previsão. O que ainda não tem uso fica de fora até ter.

> porquê: o Standard vale para todo projeto. Mecânica errada vira o mesmo defeito em todos, e regra
> sem uso é texto que o Parceiro carrega e aplica onde não cabe.

---

## 9. Calibre e varredura final

**Teto de prosa por seção:** a seção mecânica mais enxuta é o teto; nenhuma outra do mesmo tipo o
ultrapassa. **Títulos neutros.**

Antes de fechar o documento, varrer:

- **vocabulário-de-processo** purgado;
- **nome de domínio fora de `⚠️`** caçado e neutralizado;
- um único cabeçalho por peça, neutro.
