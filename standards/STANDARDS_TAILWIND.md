# STANDARDS_TAILWIND — Estilo em Tailwind CSS v4

> Módulo de stack do `STANDARDS_CORE` para o estilo em Tailwind CSS v4. Contém **regras**, nunca
> **fatos** de aplicação. O Parceiro lê este documento; nunca o edita.

## 1. Propósito & fronteira

Este documento dá as regras de estilo: a configuração, a forma do `input.css`, os tokens de tema
e o uso dos utilitários. Detalha o CORE e nunca o contradiz; em conflito, vale o CORE (CORE §1).
O que o CORE ou o `STANDARDS_FRONTEND_GAS` já dizem é ancorado, nunca repetido.

`Seção N` designa seção deste documento; `CORE §N`, seção do CORE; `FRONTEND §N`, seção do
`STANDARDS_FRONTEND_GAS`.

**Não contém:** regra portável (CORE); fato de aplicação, como os valores dos tokens de tema
(CORE §1); comportamento do Parceiro, que mora na instrução; mecânica do frontend: pastas,
marcação, cabeçalho de arquivo, entrega do CSS compilado e fases de design (`STANDARDS_FRONTEND_GAS`).

Carrega este documento o Parceiro **Frontend**, junto com o CORE e o `STANDARDS_FRONTEND_GAS`.
Vale só para o perfil WebApp (CORE §9).

## 2. Versão e configuração

O estilo usa Tailwind CSS v4. Toda a configuração mora no `input.css` (Seção 3).

- Nenhum arquivo `tailwind.config.*` no projeto.
- Nenhuma função `theme()`, que a v4 mantém só por compatibilidade com a v3.
- Nenhum utilitário que a v4 removeu:

| Removido                                                                                                            | Substituto                                     |
| ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `bg-opacity-*`, `text-opacity-*`, `border-opacity-*`, `divide-opacity-*`, `ring-opacity-*`, `placeholder-opacity-*` | Modificador de barra: `bg-<name>/<n>`          |
| `flex-shrink-*`, `flex-grow-*`                                                                                      | `shrink-*`, `grow-*`                           |
| `overflow-ellipsis`                                                                                                 | `text-ellipsis`                                |
| `decoration-slice`, `decoration-clone`                                                                              | `box-decoration-slice`, `box-decoration-clone` |

> porquê: na v4, classe que não existe não gera CSS nem erro; o build passa e o estilo some sem
> aviso.

## 3. O `input.css`

O `input.css` contém estes quatro blocos, nesta ordem, cada um uma vez só, e nada mais:

1. o cabeçalho (FRONTEND §11);
2. a linha `@import "tailwindcss";`;
3. o `@theme` (Seção 4), sem opção (`inline`, `static`);
4. o `@layer components` (Seção 6), que pode ficar vazio.

Diretiva fora da lista, como `@tailwind`, `@config` ou `@plugin`, não entra.

> porquê: estilo novo tem só dois lugares, o utilitário na marcação e a classe do
> `@layer components` (Seção 6); outra diretiva abriria um terceiro.

## 4. Tokens de tema

Token de tema é uma variável CSS declarada no `@theme`, e só nele. O nome começa por um namespace
de tema da v4 (`--color-*`, `--font-*`, `--text-*`, `--font-weight-*`, `--tracking-*`, `--leading-*`,
`--breakpoint-*`, `--container-*`, `--spacing-*`, `--radius-*`, `--shadow-*`, `--inset-shadow-*`,
`--drop-shadow-*`, `--blur-*`, `--perspective-*`, `--aspect-*`, `--ease-*`, `--animate-*`), e a v4
gera as classes da família a partir dele: `--color-<name>` gera `bg-<name>`, `text-<name>` e as
demais classes de cor. Variável sem namespace não gera classe e não entra no `@theme`. O valor do
token é literal, sem `var()`.

O token se usa pela classe que gera: `bg-<name>`, nunca `bg-(--color-<name>)` nem `bg-[var(--color-<name>)]`.
A sintaxe de parêntese, `<utility>-(--<name>)`, só se usa com variável definida em runtime (Seção 7).

## 5. Escala e valor arbitrário

Valor arbitrário, `<utility>-[<value>]`, nunca repete o valor de um token do tema, o padrão da v4 ou o
do `@theme`, e em utilitário que a v4 calcula por `var(--spacing)` nunca leva comprimento múltiplo de
`0.25rem`: `p-4`, nunca `p-[16px]`.

> porquê: na v4, espaçamento e tamanho aceitam qualquer múltiplo da escala (`mt-17`, `w-29`); quase
> todo valor tem classe, e o arbitrário só cabe no que a escala não alcança.

Toda cor é token do `@theme` do projeto (Seção 4), nunca valor arbitrário nem cor da paleta padrão
da v4. Ficam fora da regra só `transparent` e `current`, que não são cor de paleta.

> porquê: a cor aprovada no design mora no `@theme`; cor da paleta padrão é escolha visual fora
> dele.

## 6. Onde mora a aparência

A aparência mora em dois lugares: no utilitário, na marcação (FRONTEND §9), e na classe do
`@layer components`. Nenhum arquivo de `src/frontend/` contém `<style>` nem atributo `style`.

A mesma lista de dois ou mais utilitários, com ao menos um de cor (Seção 5), em qualquer ordem e
sem as classes `js-` e `data-`, em elementos de mais de um arquivo, vira classe do
`@layer components`; classe usada num só arquivo não entra lá, salvo a família cujo modificador o
`UI_` troca (Seção 7).

As classes do `@layer components` formam famílias, uma por padrão visual:

- a base, `.<base>`, com o que todo membro tem, e cujo nome nunca começa pelo de outra base seguido de `-`;
- os modificadores, `.<base>-<modifier>`, cada um só com o que varia, declarados depois da base;
- o elemento leva a base e no máximo um modificador: `class="<base> <base>-<modifier>"`.

Cada classe é um seletor de uma classe só e se define só por `@apply`, com os utilitários das
Seções 4 e 5. O nome, em kebab-case, nunca repete o de um utilitário que a v4 gera com o `@theme` do projeto.

## 7. Estado visual

O `UI_` muda a aparência só por estes meios:

| Meio               | Como                                                                                                                                                                                                                                                                                                                       |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Visibilidade       | Põe ou tira a classe `hidden` (FRONTEND §10.6), ou abre e fecha o `<dialog>` por `showModal()` e `close()` (FRONTEND §10.3)                                                                                                                                                                                                |
| Variação           | Troca o modificador de uma família (Seção 6), tirado de constante do `UI_` (FRONTEND §6.3)                                                                                                                                                                                                                                 |
| Estado do elemento | Põe ou tira atributo `aria-*`, ou `disabled` em `<button>`, `<input>`, `<select>` ou `<textarea>`; a classe reage pela variante `disabled:`, por `aria-<state>:`, com `<state>` um de `busy`, `checked`, `disabled`, `expanded`, `hidden`, `pressed`, `readonly`, `required`, `selected`, ou por `aria-[<state>=<value>]:` |
| Valor contínuo     | Define variável CSS por `style.setProperty("--<name>", <value>)`, consumida por parêntese (Seção 4)                                                                                                                                                                                                                        |

Fora desses meios, o `UI_` não mexe em classe nem em estilo: no `classList`, só `hidden` ou
constante de modificador; no `style`, só `setProperty("--<name>", …)`; nunca `className`, a
propriedade `hidden`, nem `setAttribute`, `removeAttribute` ou `toggleAttribute` de `class`,
`style` ou `hidden`. Nenhuma lista de classes usa a variante `data-*:`.

> porquê: a aparência mora na marcação e no `input.css` (FRONTEND §13.2); utilitário posto pelo
> JavaScript é aparência que nenhum dos dois mostra.

## 8. Foco visível

O foco se estiliza só por variante que termina em `focus-visible:` (`focus-visible:`, `group-focus-visible:`,
`peer-focus-visible:`); nenhuma outra variante com `focus` se usa (FRONTEND §10.3).

- O contorno do navegador se tira só com `outline-hidden`, nunca com `outline-none` nem `outline-0`.
- Quem leva `outline-hidden` leva junto, na mesma lista de classes ou na mesma classe do
  `@layer components`, o substituto `focus-visible:ring-<n>`, ou `focus-visible:outline-<n>`
  com `focus-visible:outline-<name>`.

> porquê: na v4, `outline-none` e `outline-0` tiram o contorno também no modo de alto contraste
> do sistema; `outline-hidden` o esconde só fora dele.
