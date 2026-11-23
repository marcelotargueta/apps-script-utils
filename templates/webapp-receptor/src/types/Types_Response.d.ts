/*
 * File:           src/types/Types_Response.d.ts
 * Description:    Response envelope and the error codes it carries.
 * Description_pt: Envelope de resposta e os códigos de erro que ele carrega.
 */

/**
 * @description Error code that reaches the consumer: a code from the known list.
 *
 * @description_pt Código de erro que chega ao consumidor: um código da lista conhecida.
 */
type ResponseErrorCode = (typeof Utils_Response.KNOWN_ERROR_CODES)[number];

/**
 * @description Response envelope of every call that crosses the boundary between two programs.
 *
 * @description_pt Envelope de resposta de toda chamada que atravessa a fronteira entre dois programas.
 */
interface ServerResponse<T, E extends string = ResponseErrorCode> {
  success: boolean;
  data: T | null;
  errorCode: E | null;
}
