/*
 * File:           build/build-webapp.js
 * Description:    Build of the web app: compiles TypeScript, copies the manifest, flattens the scripts and the
 *                 HTML into app/ and turns the compiled CSS into Tailwind_CSS.html, stopping on a missing
 *                 manifest, a missing compiled CSS or a duplicate file name.
 * Description_pt: Build do web app: compila o TypeScript, copia o manifesto, achata os scripts e o HTML em app/
 *                 e converte o CSS compilado em Tailwind_CSS.html, parando se faltar o manifesto ou o CSS
 *                 compilado, ou se houver nome de arquivo duplicado.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const SRC_DIR = "src";
const DIST_DIR = "app";
const CSS_FILE = path.join(SRC_DIR, "styles", "output.css");
const CSS_COMPONENT = "Tailwind_CSS.html";

// GAS tells files apart by name only, so a .js and an .html with the same name also collide.
const usedNames = new Set();

console.log(`⚙️ Starting build (destination: /${DIST_DIR})...`);

function claimName(fileName, sourcePath) {
  const name = path.parse(fileName).name;
  if (usedNames.has(name)) {
    console.error(
      `❌ DUPLICATE_FILE_NAME — ${fileName} (${sourcePath}) collides with a file already at /${DIST_DIR}`,
    );
    throw new Error("DUPLICATE_FILE_NAME");
  }
  usedNames.add(name);
}

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
      } else if (item.isFile() && path.extname(item.name) === ".js") {
        claimName(item.name, currentPath);
        if (folder !== DIST_DIR) {
          fs.renameSync(currentPath, path.join(DIST_DIR, item.name));
          console.log(`🚚 JS moved: ${item.name}`);
        }
      }
    });
  }

  moveFilesToRoot(DIST_DIR);
}

function copyHtmlFiles(folder) {
  const items = fs.readdirSync(folder, { withFileTypes: true });

  items.forEach((item) => {
    const currentPath = path.join(folder, item.name);

    if (item.isDirectory()) {
      copyHtmlFiles(currentPath);
    } else if (item.isFile() && path.extname(item.name) === ".html") {
      claimName(item.name, currentPath);
      fs.copyFileSync(currentPath, path.join(DIST_DIR, item.name));
      console.log(`📄 HTML copied: ${item.name}`);
    }
  });
}

function generateCssComponent() {
  if (!fs.existsSync(CSS_FILE)) {
    console.error(
      `❌ CSS_NOT_FOUND — ${CSS_FILE} is missing; run npm run css first`,
    );
    throw new Error("CSS_NOT_FOUND");
  }
  claimName(CSS_COMPONENT, CSS_FILE);
  const css = fs.readFileSync(CSS_FILE, "utf-8");
  fs.writeFileSync(
    path.join(DIST_DIR, CSS_COMPONENT),
    `<style>\n${css}\n</style>\n`,
  );
  console.log(`🎨 CSS component generated: ${CSS_COMPONENT}`);
}

try {
  cleanDist();
  console.log("🔨 Compiling TypeScript...");
  execSync("npx tsc", { stdio: "inherit" });
  copyManifest();
  flattenJsFiles();
  copyHtmlFiles(SRC_DIR);
  generateCssComponent();
  console.log("🚀 Build finished.");
} catch (error) {
  console.error("❌ Build error:", error.message);
  process.exit(1);
}
