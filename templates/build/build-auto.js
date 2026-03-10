// File: templates/build/build-auto.js

/*
 * @description Lightweight build pipeline for headless Google Apps Script projects
 *              (Automations, Triggers, APIs) using pure TypeScript.
 *              This script compiles TS, flattens the output, and prepares it for GAS
 *              without processing any HTML or CSS.
 *
 * @description_pt Pipeline leve de build para projetos headless em Google Apps Script
 *                 (Automações, Triggers, APIs) usando TypeScript puro.
 *                 Este script compila TS, achata a saída e a prepara para o GAS
 *                 sem processar nenhum HTML ou CSS.
 *
 * Responsibilities:
 * - Extremely fast transpilation for non-UI projects
 * - Ensures GAS-compatible output (flat structure)
 *
 * * Non-Responsibilities:
 * - Does NOT process, move, or inject HTML files
 * - Does NOT interact with Tailwind CSS
 *
 * Responsabilidades:
 * - Transpilação extremamente rápida para projetos sem interface (non-UI)
 * - Garante saída compatível com o GAS (estrutura achatada/flat)
 *
 * Não-Responsabilidades:
 * - NÃO processa, move ou injeta arquivos HTML
 * - NÃO interage com Tailwind CSS
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

/* -------------------------------------------------------------------------- */
/* CONFIGURATION                                                              */
/* -------------------------------------------------------------------------- */

const SRC_DIR = "src";
const DIST_DIR = "app";

console.log(`⚙️ Starting Automation Build (Destination: /${DIST_DIR})...`);

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
 * @description Moves compiled JavaScript files from nested folders
 *              into the root of the distribution directory.
 *              This enforces the flat JS namespace required by GAS.
 * @returns {void}
 *
 * @description_pt Move arquivos JavaScript compilados de subpastas
 *                 para a raiz da pasta de distribuição, garantindo
 *                 um namespace plano exigido pelo runtime do GAS.
 * @returns_pt {void}
 */
function flattenJsFiles() {
  /**
   * @description Recursively walks through directories to move files.
   * @param {string} folder - The directory path to scan.
   * @description_pt Percorre recursivamente os diretórios para mover arquivos.
   * @param_pt {string} folder - O caminho do diretório para escanear.
   */
  function moveFilesToRoot(folder) {
    if (!fs.existsSync(folder)) return;

    const items = fs.readdirSync(folder, { withFileTypes: true });

    items.forEach((item) => {
      const currentPath = path.join(folder, item.name);

      if (item.isDirectory()) {
        moveFilesToRoot(currentPath);
        // Remove empty folders after moving files
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

/* -------------------------------------------------------------------------- */
/* MAIN EXECUTION FLOW                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Execution order is optimized for backend-only speed:
 * 1. Clean dist
 * 2. Compile TypeScript
 * 3. Copy GAS manifest
 * 4. Flatten compiled JavaScript
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
    console.log(`📄 Manifest Copied: appsscript.json`);
  } else {
    console.warn(`⚠️ Warning: appsscript.json not found in ${SRC_DIR}.`);
  }

  // 4. Flatten compiled JavaScript files
  flattenJsFiles();

  console.log("🚀 Automation Build finished successfully!");
} catch (error) {
  console.error("❌ Build Error:", error.message);
  process.exit(1);
}
