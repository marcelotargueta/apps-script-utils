// File: src/backend/api/Server_Main.ts

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type ComponentProps = Record<string, any>;

// -----------------------------------------------------------------------------
// CLASS ARCHITECTURE
// -----------------------------------------------------------------------------

class Server_Main {
  /**
   * Main entry point of the Web Application.
   * Renders the initial page (Page_Home).
   *
   * @description_pt Ponto de entrada principal da Aplicação Web. Renderiza a página inicial.
   *
   * @returns The rendered HTML output.
   * @returns_pt O objeto de saída HTML renderizado.
   */
  static doGet(): GoogleAppsScript.HTML.HtmlOutput {
    // Note: The build process will flatten the file name to just 'Page_Home'.
    const template = HtmlService.createTemplateFromFile("Page_Home");

    // Injects the 'include' helper into the root context
    (template as any).include = Server_Main.include;

    return template
      .evaluate()
      .setTitle("Rio GIS System [DEV]")
      .addMetaTag("viewport", "width=device-width, initial-scale=1")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  /**
   * Renders a partial HTML component allowing data passing (props).
   *
   * @description_pt Renderiza um componente HTML parcial permitindo a passagem de dados (props).
   *
   * @param filename - Filename in the compiled root (e.g., "Component_Navbar").
   * @param_pt Nome do arquivo na raiz compilada.
   * @param props - (Optional) Object containing data for the component.
   * @param_pt (Opcional) Objeto contendo dados para o componente.
   * @returns The processed HTML content.
   * @returns_pt O conteúdo HTML processado.
   */
  static include(filename: string, props: ComponentProps = {}): string {
    const template = HtmlService.createTemplateFromFile(filename);
    const dynamicTemplate = template as any;

    // Recursive Dependency Injection
    dynamicTemplate.include = Server_Main.include;

    // Props Injection
    if (props && typeof props === "object") {
      Object.assign(dynamicTemplate, props);
      dynamicTemplate.props = props;
      dynamicTemplate.locals = props;
    }

    return template.evaluate().getContent();
  }
}

// -----------------------------------------------------------------------------
// GLOBAL EXPORTS (GAS Runtime Requirement)
// -----------------------------------------------------------------------------

/**
 * Exposing the doGet to the global scope so GAS can trigger it.
 * @description_pt Expondo o doGet para o escopo global para o GAS acionar.
 */
function doGet() {
  return Server_Main.doGet();
}
