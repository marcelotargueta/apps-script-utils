// File: src/backend/api/Server_Main.ts
// Description: Main server entry point for GAS Web Applications.
// Description_pt: Ponto de entrada principal do servidor para Web Apps em Google Apps Script.

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

/**
 * @description Generic type used to pass data (props) to HTML templates.
 *
 * @description_pt Tipo genérico utilizado para passagem de dados (props)
 *                 para templates HTML.
 */
type ComponentProps = Record<string, any>;

// -----------------------------------------------------------------------------
// CLASS ARCHITECTURE
// -----------------------------------------------------------------------------

/**
 * @description Central server class responsible for:
 *              - WebApp entry point (doGet)
 *              - HTML rendering
 *              - Component inclusion with props support
 *
 *              This class acts as the main façade between
 *              the GAS runtime and the frontend layer.
 *
 * @description_pt Classe central do servidor responsável por:
 *                 - Ponto de entrada da WebApp (doGet)
 *                 - Renderização de HTML
 *                 - Inclusão de componentes com suporte a props
 *
 *                 Atua como a fachada principal entre
 *                 o runtime do GAS e a camada de frontend.
 */
class Server_Main {
  /**
   * @description Main entry point of the Web Application.
   *              Responsible for rendering the initial page.
   *
   *              The build process flattens all HTML files,
   *              therefore only the filename (without path)
   *              is required.
   *
   * @description_pt Ponto de entrada principal da Aplicação Web.
   *                 Responsável por renderizar a página inicial.
   *
   *                 O processo de build achata todos os arquivos HTML,
   *                 portanto apenas o nome do arquivo (sem caminho)
   *                 é necessário.
   *
   * @returns {GoogleAppsScript.HTML.HtmlOutput} Rendered HTML output.
   * @returns_pt {GoogleAppsScript.HTML.HtmlOutput} Saída HTML renderizada.
   */
  static doGet(): GoogleAppsScript.HTML.HtmlOutput {
    const template = HtmlService.createTemplateFromFile("Page_Index");

    // Injects the include helper into the root template context
    (template as any).include = Server_Main.include;

    return template
      .evaluate()
      .setTitle("Rio GIS System [DEV]")
      .addMetaTag("viewport", "width=device-width, initial-scale=1")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  /**
   * @description Renders a partial HTML component and allows
   *              data injection via props.
   *
   *              This helper enables component-based HTML
   *              composition in GAS, mimicking a basic
   *              templating system.
   *
   *              The function is recursive, allowing components
   *              to include other components.
   *
   * @description_pt Renderiza um componente HTML parcial e permite
   *                 a injeção de dados via props.
   *
   *                 Este helper possibilita a composição de HTML
   *                 baseada em componentes no GAS, simulando
   *                 um sistema simples de templates.
   *
   *                 A função é recursiva, permitindo que componentes
   *                 incluam outros componentes.
   *
   * @param {string} filename - HTML filename located at the compiled root.
   * @param_pt {string} filename - Nome do arquivo HTML localizado na raiz compilada.
   *
   * @param {ComponentProps} [props] - Optional data object passed to the component.
   * @param_pt {ComponentProps} [props] - Objeto opcional de dados passado ao componente.
   *
   * @returns {string} Processed HTML content.
   * @returns_pt {string} Conteúdo HTML processado.
   */
  static include(filename: string, props: ComponentProps = {}): string {
    const template = HtmlService.createTemplateFromFile(filename);

    const dynamicTemplate = template as any;

    // Recursive dependency injection
    dynamicTemplate.include = Server_Main.include;

    // Props injection
    if (props && typeof props === "object") {
      Object.assign(dynamicTemplate, props);
      dynamicTemplate.props = props;
      dynamicTemplate.locals = props;
    }

    return template.evaluate().getContent();
  }
}

// -----------------------------------------------------------------------------
// GLOBAL EXPORTS (GAS RUNTIME REQUIREMENT)
// -----------------------------------------------------------------------------

/**
 * @description Exposes the main doGet method to the global scope.
 *              This is required for Google Apps Script to
 *              recognize the WebApp entry point.
 *
 * @description_pt Expõe o método doGet principal para o escopo global.
 *                 Isso é necessário para que o Google Apps Script
 *                 reconheça o ponto de entrada da WebApp.
 *
 * @returns {GoogleAppsScript.HTML.HtmlOutput}
 * @returns_pt {GoogleAppsScript.HTML.HtmlOutput}
 */
function doGet() {
  return Server_Main.doGet();
}
