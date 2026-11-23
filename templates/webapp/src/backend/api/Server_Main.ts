/*
 * File:           src/backend/api/Server_Main.ts
 * Description:    Entry point of the web app: serves the application page.
 * Description_pt: Ponto de entrada do web app: serve a página da aplicação.
 */

class Server_Main {
  /**
   * @description Renders the application page with its title and session payload.
   * @returns {GoogleAppsScript.HTML.HtmlOutput} The rendered page.
   *
   * @description_pt Renderiza a página da aplicação com o título e a carga de sessão.
   * @returns_pt {GoogleAppsScript.HTML.HtmlOutput} A página renderizada.
   */
  static doGet(): GoogleAppsScript.HTML.HtmlOutput {
    // PROJECT: browser tab title of this app
    return Utils_Render.renderPage("Page_Index", "", {});
  }
}

/**
 * @description Web app entry point, called by the platform when the page is opened.
 * @returns {GoogleAppsScript.HTML.HtmlOutput} The rendered page.
 *
 * @description_pt Ponto de entrada do web app, chamado pela plataforma quando a página é aberta.
 * @returns_pt {GoogleAppsScript.HTML.HtmlOutput} A página renderizada.
 */
function doGet(): GoogleAppsScript.HTML.HtmlOutput {
  return Server_Main.doGet();
}
