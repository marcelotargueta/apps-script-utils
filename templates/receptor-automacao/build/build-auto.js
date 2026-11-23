/*
 * File:           build/build-auto.js
 * Description:    Build of the projects without a screen: compiles TypeScript, copies the manifest and
 *                 flattens the output into app/, stopping on a missing manifest or a duplicate file name.
 * Description_pt: Build dos projetos sem tela: compila o TypeScript, copia o manifesto e achata a saída
 *                 em app/, parando se faltar o manifesto ou se houver nome de arquivo duplicado.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const SRC_DIR = "src";
const DIST_DIR = "app";

console.log(`⚙️ Starting build (destination: /${DIST_DIR})...`);

function cleanDist() {
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR);
}

function copyManifest() {
  const manifestPath = path.join(SRC_DIR, "appsscript.json");
  if (!fs.existsSync(manifestPath)) {
    console.error(`❌ MANIFEST_NOT_FOUND — ${manifestPath} is missing`);
    throw new Error("MANIFEST_NOT_FOUND");
  }
  fs.copyFileSync(manifestPath, path.join(DIST_DIR, "appsscript.json"));
  console.log("📄 Manifest copied: appsscript.json");
}

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
          /* intentionally silent: a folder that is not empty stays */
        }
      } else if (
        item.isFile() &&
        path.extname(item.name) === ".js" &&
        folder !== DIST_DIR
      ) {
        const newPath = path.join(DIST_DIR, item.name);

        // renameSync overwrites an existing file without warning, so the collision is checked first.
        if (fs.existsSync(newPath)) {
          console.error(
            `❌ DUPLICATE_FILE_NAME — ${item.name} (${currentPath}) collides with a file already at /${DIST_DIR}`,
          );
          throw new Error("DUPLICATE_FILE_NAME");
        }

        fs.renameSync(currentPath, newPath);
        console.log(`🚚 JS moved: ${item.name}`);
      }
    });
  }

  moveFilesToRoot(DIST_DIR);
}

try {
  cleanDist();
  console.log("🔨 Compiling TypeScript...");
  execSync("npx tsc", { stdio: "inherit" });
  copyManifest();
  flattenJsFiles();
  console.log("🚀 Build finished.");
} catch (error) {
  console.error("❌ Build error:", error.message);
  process.exit(1);
}
