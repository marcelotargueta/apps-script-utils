// File: templates/build/build-webapp.js
/**
 * @description Professional build pipeline for Google Apps Script projects using
 *              TypeScript and Tailwind CSS v4. This script is responsible for cleaning
 *              the distribution folder, compiling TypeScript, flattening the output
 *              structure, and injecting compiled Tailwind CSS as an inline HTML component
 *              compatible with GAS runtime.
 *
 * Responsibilities:
 * - Acts as the single source of truth for the build process
 * - Ensures GAS-compatible output (flat structure, no bundlers)
 * - Keeps frontend (HTML/CSS) and backend (TS) pipelines deterministic
 *
 * * Non-Responsibilities:
 * - Does NOT bundle modules (no Webpack / Rollup)
 * - Does NOT manage environments (DEV/PROD)
 * - Does NOT validate Tailwind semantics
 *
 * @description_pt Pipeline profissional de build para projetos Google Apps Script utilizando
 *                 TypeScript e Tailwind CSS v4. Este script é responsável por limpar a pasta
 *                 de distribuição, compilar TypeScript, achatar a estrutura de saída e injetar
 *                 o CSS compilado do Tailwind como um componente HTML inline compatível com
 *                 o runtime do GAS.
 *
 * Responsabilidades:
 * - Atua como a única fonte de verdade para o processo de build
 * - Garante saída compatível com GAS (estrutura achatada, sem bundlers)
 * - Mantém os pipelines de frontend (HTML/CSS) e backend (TS) determinísticos
 *
 * * Não-Responsabilidades:
 * - NÃO empacota módulos (sem Webpack / Rollup)
 * - NÃO gerencia ambientes (DEV/PROD)
 * - NÃO valida a semântica do Tailwind
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                                                              */
/* -------------------------------------------------------------------------- */

const SRC_DIR = "src";
const DIST_DIR = "app";
const STYLES_DIR = path.join(SRC_DIR, "styles");

console.log(`🔄 Starting Professional Build (Destination: /${DIST_DIR})...`);

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * @description Cleans the distribution directory by removing it entirely
 *              and recreating an empty folder.
 * @returns {void}
 *
 * @description_pt Limpa completamente a pasta de distribuição removendo-a
 *                 recursivamente e recriando uma pasta vazia.
 * @returns_pt {void}
 */
function cleanDist() {
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR);
}

/**
 * @description Recursively scans a directory and copies all HTML files
 *              into the root of the distribution folder (flattening).
 *              GAS does not support nested HTML includes by path,
 *              therefore all HTML files must exist at the root level.
 * @param {string} currentPath - Directory path to scan.
 * @returns {void}
 *
 * @description_pt Varre recursivamente um diretório e copia todos os arquivos HTML
 *                 para a raiz da pasta de distribuição (achatamento).
 *                 Isso é necessário porque o GAS não suporta includes por caminho.
 * @param_pt {string} currentPath - Caminho do diretório para escanear.
 * @returns_pt {void}
 */
function copyHtmlRecursive(currentPath) {
  const items = fs.readdirSync(currentPath, { withFileTypes: true });

  items.forEach((item) => {
    const srcPath = path.join(currentPath, item.name);

    if (item.isDirectory()) {
      copyHtmlRecursive(srcPath);
    } else if (item.isFile() && path.extname(item.name) === ".html") {
      const destPath = path.join(DIST_DIR, item.name);
      fs.copyFileSync(srcPath, destPath);
      console.log(`✅ HTML Copied: ${item.name}`);
    }
  });
}

/**
 * @description Moves compiled JavaScript files from nested folders
 *              into the root of the distribution directory.
 *              This step enforces a flat JS namespace, which is required
 *              by the Google Apps Script runtime.
 * @returns {void}
 *
 * @description_pt Move arquivos JavaScript compilados de subpastas
 *                 para a raiz da pasta de distribuição, garantindo
 *                 um namespace plano exigido pelo runtime do GAS.
 * @returns_pt {void}
 */
function flattenJsFiles() {
  function moveFilesToRoot(folder) {
    if (!fs.existsSync(folder)) return;

    const items = fs.readdirSync(folder, { withFileTypes: true });

    items.forEach((item) => {
      const currentPath = path.join(folder, item.name);

      if (item.isDirectory()) {
        moveFilesToRoot(currentPath);
        try {
          fs.rmdirSync(currentPath);
        } catch (e) {
          /* intentionally silent */
        }
      } else if (item.isFile() && path.extname(item.name) === ".js") {
        if (folder !== DIST_DIR) {
          const newPath = path.join(DIST_DIR, item.name);
          fs.renameSync(currentPath, newPath);
          console.log(`🚚 JS Moved: ${item.name}`);
        }
      }
    });
  }

  moveFilesToRoot(DIST_DIR);
}

/**
 * @description Generates an HTML component containing the compiled Tailwind CSS
 *              wrapped inside a <style> tag.
 *              This file is later included in GAS HTML templates using:
 *              <?!= include('Tailwind_CSS'); ?>
 * @returns {void}
 *
 * @description_pt Gera um componente HTML contendo o CSS compilado do Tailwind
 *                 encapsulado em uma tag <style>, permitindo inclusão direta
 *                 nos templates HTML do GAS.
 * @returns_pt {void}
 */
function generateTailwindComponent() {
  const cssInput = path.join(STYLES_DIR, "output.css");
  const cssDest = path.join(DIST_DIR, "Tailwind_CSS.html");

  if (fs.existsSync(cssInput)) {
    const cssContent = fs.readFileSync(cssInput, "utf-8");
    const htmlContent = `<style>\n${cssContent}\n</style>`;

    fs.writeFileSync(cssDest, htmlContent);
    console.log(`🎨 CSS Injected: Tailwind_CSS.html generated successfully!`);
  } else {
    console.warn(
      `⚠️ Warning: output.css not found at ${cssInput}. Did Tailwind CLI run?`,
    );
  }
}

/* -------------------------------------------------------------------------- */
/* MAIN EXECUTION FLOW                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Execution order is critical and must not be changed lightly:
 * 1. Clean dist
 * 2. Compile TypeScript
 * 3. Copy GAS manifest
 * 4. Copy and flatten HTML files
 * 5. Flatten compiled JavaScript
 * 6. Inject Tailwind CSS component
 */
try {
  // 1. Clean distribution directory
  cleanDist();

  // 2. Compile TypeScript sources
  console.log("🔨 Compiling TypeScript...");
  execSync("npx tsc", { stdio: "inherit" });

  // 3. Copy GAS manifest
  const manifestPath = path.join(SRC_DIR, "appsscript.json");
  if (fs.existsSync(manifestPath)) {
    fs.copyFileSync(manifestPath, path.join(DIST_DIR, "appsscript.json"));
  }

  // 4. Copy and flatten HTML templates
  copyHtmlRecursive(SRC_DIR);

  // 5. Flatten compiled JavaScript files
  flattenJsFiles();

  // 6. Generate Tailwind inline CSS component
  generateTailwindComponent();

  console.log("🚀 Build finished successfully!");
} catch (error) {
  console.error("❌ Build Error:", error.message);
  process.exit(1);
}
