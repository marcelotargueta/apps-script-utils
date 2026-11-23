/*
 * File:           src/backend/utils/Utils_Render.ts
 * Description:    Render engine: builds the page from a Page_ template and the files it includes.
 * Description_pt: Motor de render: monta a página com o template Page_ e os arquivos que ele inclui.
 */

class Utils_Render {
  /**
   * @description Evaluates a frontend file with the given data and returns its HTML as text. Available in
   *              every template the engine evaluates, at any depth.
   * @param {string} filename - File name, without path or extension.
   * @param {ComponentProps} [props={}] - Data the file reads under props.
   * @returns {string} The evaluated HTML.
   *
   * @description_pt Avalia um arquivo do frontend com os dados recebidos e devolve o HTML como texto.
   *                 Disponível em todo template que o motor avalia, em qualquer profundidade.
   * @param_pt {string} filename - Nome do arquivo, sem caminho e sem extensão.
   * @param_pt {ComponentProps} [props={}] - Dados que o arquivo lê sob props.
   * @returns_pt {string} O HTML avaliado.
   */
  static include(filename: string, props: ComponentProps = {}): string {
    const template = HtmlService.createTemplateFromFile(
      filename,
    ) as DynamicTemplate;
    template.props = props;
    template.include = Utils_Render.include;
    return template.evaluate().getContent();
  }

  /**
   * @description Evaluates a Page_ template and returns the page ready to serve, with the title, the
   *              viewport meta tag and the frame policy applied.
   * @param {string} filename - Page_ file name, without path or extension.
   * @param {string} title - Page title.
   * @param {ComponentProps} [props={}] - Session payload the page reads under props.
   * @returns {GoogleAppsScript.HTML.HtmlOutput} The page the entry point returns.
   *
   * @description_pt Avalia um template Page_ e devolve a página pronta para servir, com o título, a meta
   *                 viewport e a política de frame aplicados.
   * @param_pt {string} filename - Nome do arquivo Page_, sem caminho e sem extensão.
   * @param_pt {string} title - Título da página.
   * @param_pt {ComponentProps} [props={}] - Carga de sessão que a página lê sob props.
   * @returns_pt {GoogleAppsScript.HTML.HtmlOutput} A página que a entrada devolve.
   */
  static renderPage(
    filename: string,
    title: string,
    props: ComponentProps = {},
  ): GoogleAppsScript.HTML.HtmlOutput {
    const template = HtmlService.createTemplateFromFile(
      filename,
    ) as DynamicTemplate;
    template.props = props;
    template.include = Utils_Render.include;
    return template
      .evaluate()
      .setTitle(title)
      .addMetaTag("viewport", "width=device-width, initial-scale=1")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
  }
}
