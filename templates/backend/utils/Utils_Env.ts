/*
 * File: src/backend/utils/Utils_Env.ts
 *
 * Description: Strongly typed wrapper for Google Apps Script PropertiesService.
 *              Acts as a central vault for Environment Variables and IDs.
 *
 * Description_pt: Wrapper fortemente tipado para o PropertiesService do GAS.
 *                 Atua como um cofre central para Variáveis de Ambiente e IDs.
 */

class Utils_Env {
  /**
   * Internal helper to fetch and validate properties.
   * Prevents silent failures if an ID is missing in the GAS dashboard.
   */
  private static getRequiredProperty(key: string): string {
    const value = PropertiesService.getScriptProperties().getProperty(key);
    if (!value) {
      throw new Error(
        `[CRITICAL] Missing Script Property: ${key}. Please add it in the GAS Project Settings.`,
      );
    }
    return value;
  }

  // ========================================================================
  // 🔐 TYPED GETTERS (Add your project-specific variables below)
  // ========================================================================

  /**
   * EXAMPLE: Main Database/Spreadsheet ID
   * Remova ou renomeie este getter conforme a necessidade do seu projeto atual.
   */
  static get exampleDatabaseId(): string {
    return this.getRequiredProperty("EXAMPLE_DATABASE_ID");
  }

  /**
   * EXAMPLE: External API Token
   */
  static get exampleApiToken(): string {
    return this.getRequiredProperty("EXAMPLE_API_TOKEN");
  }
}
