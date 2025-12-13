/**
 * @file Server_Main.ts
 * @description Main Entry Point for the Web Application (doGet) and rendering utilities.
 */

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

type ComponentProps = Record<string, any>;

// -----------------------------------------------------------------------------
// PUBLIC API (Entry Points)
// -----------------------------------------------------------------------------

/**
 * Main entry point of the Web Application.
 * Renders the initial page (Index).
 *
 * @returns {GoogleAppsScript.HTML.HtmlOutput} The rendered HTML output.
 */
function doGet(): GoogleAppsScript.HTML.HtmlOutput {
  const template = HtmlService.createTemplateFromFile("Index");

  // Injects the 'include' helper into the root Index context
  (template as any).include = include;

  return template
    .evaluate()
    .setTitle("Modern GAS App")
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Renders a partial HTML component allowing data passing (props).
 *
 * @param {string} filename - Filename in the compiled root (e.g., "Component_Navbar").
 * @param {ComponentProps} props - (Optional) Object containing data for the component.
 * @returns {string} The processed HTML content.
 */
function include(filename: string, props: ComponentProps = {}): string {
  const template = HtmlService.createTemplateFromFile(filename);
  const dynamicTemplate = template as any;

  // Recursive Dependency Injection
  dynamicTemplate.include = include;

  // Props Injection
  if (props && typeof props === "object") {
    Object.assign(dynamicTemplate, props);
    dynamicTemplate.props = props;
    dynamicTemplate.locals = props;
  }

  return template.evaluate().getContent();
}

// -----------------------------------------------------------------------------
// EXPORTS (Global Scope Exposure)
// -----------------------------------------------------------------------------

(globalThis as any).doGet = doGet;
(globalThis as any).include = include;
