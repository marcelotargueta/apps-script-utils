const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// CONFIGURATION
const SRC_DIR = "src";
const DIST_DIR = "app";
// Assumption: You moved CSS to a dedicated folder.
// Ensure your Tailwind CLI outputs to: src/styles/output.css
const STYLES_DIR = path.join(SRC_DIR, "styles");

console.log(`🔄 Starting Professional Build (Destination: /${DIST_DIR})...`);

/**
 * Cleans the distribution directory.
 */
function cleanDist() {
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(DIST_DIR);
}

/**
 * Recursively copies HTML files to the root of DIST_DIR (Flattening).
 * @param {string} currentPath - Current directory path to scan.
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
 * Moves compiled JS files from subfolders to the root of DIST_DIR and cleans up empty folders.
 */
function flattenJsFiles() {
  function moveFilesToRoot(folder) {
    if (!fs.existsSync(folder)) return;
    const items = fs.readdirSync(folder, { withFileTypes: true });

    items.forEach((item) => {
      const currentPath = path.join(folder, item.name);

      if (item.isDirectory()) {
        moveFilesToRoot(currentPath);
        // Try to remove empty folder
        try {
          fs.rmdirSync(currentPath);
        } catch (e) {}
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
 * Reads the compiled Tailwind CSS and wraps it in a <style> tag
 * to be included as an HTML component in GAS.
 */
function generateTailwindComponent() {
  const cssInput = path.join(STYLES_DIR, "output.css");
  const cssDest = path.join(DIST_DIR, "Tailwind_CSS.html");

  if (fs.existsSync(cssInput)) {
    const cssContent = fs.readFileSync(cssInput, "utf-8");
    // Wrap raw CSS in style tags
    const htmlContent = `<style>\n${cssContent}\n</style>`;

    fs.writeFileSync(cssDest, htmlContent);
    console.log(`🎨 CSS Injected: Tailwind_CSS.html generated successfully!`);
  } else {
    console.warn(
      `⚠️ Warning: output.css not found at ${cssInput}. Did Tailwind CLI run?`
    );
  }
}

// --- MAIN EXECUTION ---
try {
  // 1. Clean
  cleanDist();

  // 2. Transpile TS
  console.log("🔨 Compiling TypeScript...");
  execSync("npx tsc", { stdio: "inherit" });

  // 3. Copy Manifest
  const manifestPath = path.join(SRC_DIR, "appsscript.json");
  if (fs.existsSync(manifestPath)) {
    fs.copyFileSync(manifestPath, path.join(DIST_DIR, "appsscript.json"));
  }

  // 4. Copy HTMLs
  copyHtmlRecursive(SRC_DIR);

  // 5. Flatten JS
  flattenJsFiles();

  // 6. Generate Inline CSS Component
  generateTailwindComponent();

  console.log("🚀 Build finished successfully!");
} catch (error) {
  console.error("❌ Build Error:", error.message);
  process.exit(1);
}
