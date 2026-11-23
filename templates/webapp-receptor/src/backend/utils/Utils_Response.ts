/*
 * File:           src/backend/utils/Utils_Response.ts
 * Description:    Single point that builds the response envelope and, in the Receptor, the HTTP response.
 * Description_pt: Ponto único que monta o envelope de resposta e, no Receptor, a resposta HTTP.
 */

class Utils_Response {
  /**
   * @description Error codes that reach the consumer in the envelope.
   *
   * @description_pt Códigos de erro que chegam ao consumidor no envelope.
   */
  static readonly KNOWN_ERROR_CODES = [
    "UNEXPECTED_ERROR",
    // PROJECT: error codes that reach the consumer
  ] as const;

  /**
   * @description Runs the operation and returns its result in the envelope. A code from the known list
   *              leaves as errorCode; any other failure leaves as UNEXPECTED_ERROR, with the detail in the log.
   * @param {string} context - Name of the entry function that called, for the log.
   * @param {() => T} operation - Operation to run.
   * @returns {ServerResponse<T>} Envelope with data on success or errorCode on failure.
   *
   * @description_pt Executa a operação e devolve o resultado no envelope. Código da lista conhecida sai
   *                 como errorCode; qualquer outra falha sai como UNEXPECTED_ERROR, com o detalhe no log.
   * @param_pt {string} context - Nome da função de entrada que chamou, para o log.
   * @param_pt {() => T} operation - Operação a executar.
   * @returns_pt {ServerResponse<T>} Envelope com data no sucesso ou errorCode na falha.
   */
  static run<T>(context: string, operation: () => T): ServerResponse<T> {
    try {
      return { success: true, data: operation(), errorCode: null };
    } catch (error) {
      const code = error instanceof Error ? error.message : String(error);
      if (Utils_Response.isKnown(code)) {
        return { success: false, data: null, errorCode: code };
      }
      const stack = error instanceof Error ? error.stack : undefined;
      console.error(
        `[Utils_Response] UNEXPECTED_ERROR — ${context}: ${code}`,
        stack,
      );
      return { success: false, data: null, errorCode: "UNEXPECTED_ERROR" };
    }
  }

  /**
   * @description Runs the operation and returns the envelope as a JSON HTTP response, for the Receptor.
   * @param {string} context - Name of the entry function that called, for the log.
   * @param {() => T} operation - Operation to run.
   * @returns {GoogleAppsScript.Content.TextOutput} JSON response with the envelope.
   *
   * @description_pt Executa a operação e devolve o envelope como resposta HTTP em JSON, para o Receptor.
   * @param_pt {string} context - Nome da função de entrada que chamou, para o log.
   * @param_pt {() => T} operation - Operação a executar.
   * @returns_pt {GoogleAppsScript.Content.TextOutput} Resposta JSON com o envelope.
   */
  static runHttp<T>(
    context: string,
    operation: () => T,
  ): GoogleAppsScript.Content.TextOutput {
    return ContentService.createTextOutput(
      JSON.stringify(Utils_Response.run(context, operation)),
    ).setMimeType(ContentService.MimeType.JSON);
  }

  private static isKnown(code: string): code is ResponseErrorCode {
    return (Utils_Response.KNOWN_ERROR_CODES as readonly string[]).includes(
      code,
    );
  }
}
