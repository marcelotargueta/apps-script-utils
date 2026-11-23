# CONTRACT — {{MACHINE_NAME}}

## 0. Convenções de valor

- Texto vazio é `""`.
- Data de calendário é texto `YYYY-MM-DD`.
- Data e hora é texto ISO 8601 completo, no fuso do script.
- Número ausente é `null`; número que é chave, ausente, é `0`.
- Percentual é fração de 0 a 1.
- Booleano ausente é `null`.
- Nenhum valor é `Date`, `NaN` nem `undefined`.

## 1. Transporte

<!-- PROJECT: the authentication, by field name and never by value; with none, say there is none -->

- A URL é a da implantação do Web App, terminada em `/exec`.
- O GAS responde com redirecionamento, que o consumidor segue.
- O status HTTP é sempre 200: sucesso e falha se distinguem só pelo envelope.
- Requisição e resposta vão em JSON.
- Resposta que não é JSON é falha da plataforma, e o consumidor a trata como `UNEXPECTED_ERROR`.

## 2. Envelope

| Campo       | Tipo                     | Descrição                                  |
| ----------- | ------------------------ | ------------------------------------------ |
| `success`   | boolean                  | `true` quando a chamada teve sucesso       |
| `data`      | conforme a §6, ou `null` | Carga da chamada (§4); `null` na falha     |
| `errorCode` | string ou `null`         | Código do catálogo (§7); `null` no sucesso |

## 3. Vocabulário de domínio

<!-- PROJECT: a Conjunto | Valores table, one row per closed set of values; with none, Nenhum. -->

## 4. Formas de dados

<!-- PROJECT: one subsection per shape, with a Campo | Tipo | Descrição table -->

## 5. Formas de request

<!-- PROJECT: one subsection per request shape, with a Campo | Tipo | Descrição table; with none, Nenhum. -->

## 6. Superfície exposta

| Método HTTP | Request (§5) | Resposta (§4) | Códigos (§7) |
| ----------- | ------------ | ------------- | ------------ |

<!-- PROJECT: one row per function of the Receptor -->

## 7. Catálogo de erros

| Código                    | Quando acontece                                              | O que o consumidor faz                         |
| ------------------------- | ------------------------------------------------------------ | ---------------------------------------------- |
| `UNEXPECTED_ERROR`        | Qualquer falha que o código não prevê; o detalhe fica no log | <!-- PROJECT: what the consumer does on it --> |
| `MISSING_SCRIPT_PROPERTY` | Uma Script Property que o código lê está ausente ou vazia    | Nunca recebe                                   |

<!-- PROJECT: one row per other error code; a code that stays in the log says Nunca recebe in the last column -->
