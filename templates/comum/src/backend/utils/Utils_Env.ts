/*
 * File:           src/backend/utils/Utils_Env.ts
 * Description:    Single reading point of the project configuration, kept in Script Properties.
 * Description_pt: Ponto único de leitura da configuração do projeto, guardada nas Script Properties.
 */

class Utils_Env {
  private static getRequiredProperty(key: string): string {
    const value = PropertiesService.getScriptProperties().getProperty(key);
    if (!value) {
      console.error(
        `[Utils_Env] MISSING_SCRIPT_PROPERTY — ${key} is missing or empty in Script Properties`,
      );
      throw new Error("MISSING_SCRIPT_PROPERTY");
    }
    return value;
  }

  // PROJECT: configuration getters of this project
}
