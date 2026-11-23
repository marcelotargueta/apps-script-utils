/*
 * File:           docs/CONTRACT.d.ts
 * Description:    Contract of the boundary between backend and frontend: value conventions, envelope, domain
 *                 vocabulary, shapes, public surface and error catalog.
 * Description_pt: Contrato da fronteira entre backend e frontend: convenções de valor, envelope, vocabulário de
 *                 domínio, formas, superfície exposta e catálogo de erros.
 */

/* ============================================================================
 * 0. VALUE CONVENTIONS
 *
 * - Empty text is "".
 * - A calendar date is text YYYY-MM-DD.
 * - A date and time is complete ISO 8601 text, in the script time zone.
 * - An absent number is null; an absent number that is a key is 0.
 * - A percentage is a fraction from 0 to 1.
 * - An absent boolean is null.
 * - No value is ever a Date, NaN or undefined.
 *
 * - Texto vazio é "".
 * - Data de calendário é texto YYYY-MM-DD.
 * - Data e hora é texto ISO 8601 completo, no fuso do script.
 * - Número ausente é null; número que é chave, ausente, é 0.
 * - Percentual é fração de 0 a 1.
 * - Booleano ausente é null.
 * - Nenhum valor é Date, NaN nem undefined.
 * ========================================================================== */

/* ============================================================================
 * 2. RESPONSE ENVELOPE
 * ========================================================================== */

/**
 * @description Envelope that every function of the PUBLIC SURFACE returns.
 * @property {boolean} success - true when the call succeeded.
 * @property {T | null} data - Payload of the call; null on failure.
 * @property {E | null} errorCode - Code from the ERROR CATALOG; null on success.
 *
 * @description_pt Envelope que toda função da SUPERFÍCIE EXPOSTA devolve.
 * @property_pt {boolean} success - true quando a chamada teve sucesso.
 * @property_pt {T | null} data - Carga da chamada; null na falha.
 * @property_pt {E | null} errorCode - Código do CATÁLOGO DE ERROS; null no sucesso.
 */
interface ServerResponse<T, E> {
  success: boolean;
  data: T | null;
  errorCode: E | null;
}

/* ============================================================================
 * 3. DOMAIN VOCABULARY
 * ========================================================================== */

// PROJECT: one type per closed set of values; with none, None. and Nenhum. inside the banner

/* ============================================================================
 * 4. DATA SHAPES
 * ========================================================================== */

// PROJECT: one interface per shape returned by the PUBLIC SURFACE, expanded

/* ============================================================================
 * 5. REQUEST SHAPES
 * ========================================================================== */

// PROJECT: one interface per request shape; with none, None. and Nenhum. inside the banner

/* ============================================================================
 * 6. PUBLIC SURFACE
 * ========================================================================== */

// PROJECT: one declare function per public_ function, under a sub-banner with its API_ file

/* ============================================================================
 * 7. ERROR CATALOG
 * ========================================================================== */

/**
 * @description Every error code of the surface: "response" reaches the envelope, "log" stays in the log.
 * @property {"response"} UNEXPECTED_ERROR - Any failure the code does not foresee; the detail stays in the log.
 * @property {"log"} MISSING_SCRIPT_PROPERTY - A Script Property the code reads is missing or empty.
 *
 * @description_pt Todo código de erro da superfície: "response" chega ao envelope, "log" fica só no log.
 * @property_pt {"response"} UNEXPECTED_ERROR - Qualquer falha que o código não prevê; o detalhe fica no log.
 * @property_pt {"log"} MISSING_SCRIPT_PROPERTY - Uma Script Property que o código lê está ausente ou vazia.
 */
interface ErrorCatalog {
  UNEXPECTED_ERROR: "response";
  MISSING_SCRIPT_PROPERTY: "log";
  // PROJECT: one key per code thrown by the code, with its @property and @property_pt in the JSDoc above
}

type CommonErrorCode = "UNEXPECTED_ERROR";

// PROJECT: one <VerbObject>ErrorCode type per function of the PUBLIC SURFACE
