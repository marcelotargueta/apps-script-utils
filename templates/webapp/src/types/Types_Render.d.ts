/*
 * File:           src/types/Types_Render.d.ts
 * Description:    Types of the render engine.
 * Description_pt: Tipos do motor de render.
 */

/**
 * @description Data a template receives from the render engine and reads under props.
 *
 * @description_pt Dados que um template recebe do motor de render e lê sob props.
 */
type ComponentProps = Record<string, unknown>;

/**
 * @description GAS HtmlTemplate open to the fields the render engine assigns before evaluation.
 *
 * @description_pt HtmlTemplate do GAS aberto aos campos que o motor de render atribui antes de avaliar.
 */
type DynamicTemplate = GoogleAppsScript.HTML.HtmlTemplate &
  Record<string, unknown>;
