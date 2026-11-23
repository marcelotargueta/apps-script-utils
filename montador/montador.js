/*
 * File:           montador/montador.js
 * Description:    Creates a project folder from templates/: validates the identity terms, computes the machine
 *                 name and the title, copies comum/ and every folder that has the profile in its name, replaces
 *                 the markers, installs the dependencies, runs the build and makes the first commit, and reports
 *                 dependencies with a newer published version. Stops before writing on an invalid term, a
 *                 repeated path, a leftover marker or an existing project folder, and removes the folder when
 *                 the install, the build or Git fails.
 * Description_pt: Cria a pasta de um projeto a partir de templates/: valida os termos de identidade, calcula o
 *                 nome de máquina e o título, copia comum/ e toda pasta que tem o perfil no nome, troca os
 *                 marcadores, instala as dependências, roda o build e faz o primeiro commit, e informa as
 *                 dependências com versão mais nova publicada. Para antes de gravar se houver termo inválido,
 *                 caminho repetido, marcador sobrando ou pasta de projeto já existente, e apaga a pasta se a
 *                 instalação, o build ou o Git falhar.
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const TEMPLATES_DIR = path.join(__dirname, "..", "templates");
const CONFIG_FILE = path.join(__dirname, "montador.config.json");
const COMMON_FOLDER = "comum";
const PROFILES = {
  webapp: "WebApp",
  receptor: "Receptor",
  automacao: "Automação",
};
const TERM_PATTERN = /^[A-Z][A-Za-z]*$/;
const WORD_PATTERN = /[A-Z]+(?![a-z])|[A-Z][a-z]*/g;
const MARKER_OPENING = "{{";
const PROJECT_MARK = "PROJECT:";
const FIRST_COMMIT_MESSAGE = "chore: create project from templates";
const FAILURE_DETAIL_LINES = 5;

function stop(code, detail) {
  console.error(`❌ ${code} — ${detail}`);
  throw new Error(code);
}

function readArgs() {
  const args = process.argv.slice(2);
  if (args.length !== 4) {
    stop(
      "INVALID_ARGUMENTS",
      "usage: node montador/montador.js <Area> <Name> <Role> <Profile>",
    );
  }
  const [area, name, role, profile] = args;
  return { area, name, role, profile };
}

function validateTerm(label, value) {
  if (!TERM_PATTERN.test(value)) {
    stop(
      "INVALID_TERM",
      `${label} "${value}" must be PascalCase letters, without accents or spaces`,
    );
  }
}

function toProfileSegment(value) {
  const segment = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  if (!Object.hasOwn(PROFILES, segment)) {
    stop(
      "INVALID_PROFILE",
      `"${value}" is not one of: ${Object.values(PROFILES).join(", ")}`,
    );
  }
  return segment;
}

function toMachineName(area, name, role) {
  const nameWords = name.match(WORD_PATTERN).map((word) => word.toLowerCase());
  return [area.toLowerCase(), ...nameWords, role.toLowerCase()].join("-");
}

function readDestination() {
  if (!fs.existsSync(CONFIG_FILE)) {
    stop(
      "CONFIG_NOT_FOUND",
      `create ${CONFIG_FILE} with {"destination": "<folder where projects are created>"}`,
    );
  }
  let destination;
  try {
    ({ destination } = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8")));
  } catch (error) {
    stop("INVALID_CONFIG", `${CONFIG_FILE} is not valid JSON`);
  }
  if (
    typeof destination !== "string" ||
    !fs.existsSync(destination) ||
    !fs.statSync(destination).isDirectory()
  ) {
    stop(
      "DESTINATION_NOT_FOUND",
      `"destination" in ${CONFIG_FILE} is not an existing folder`,
    );
  }
  return destination;
}

function selectFolders(profile) {
  return fs
    .readdirSync(TEMPLATES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter(
      (folder) =>
        folder === COMMON_FOLDER || folder.split("-").includes(profile),
    )
    .sort();
}

function collectFiles(folders) {
  const files = new Map();

  function walk(folder, base) {
    fs.readdirSync(base, { withFileTypes: true }).forEach((entry) => {
      const fullPath = path.join(base, entry.name);
      if (entry.isDirectory()) {
        walk(folder, fullPath);
        return;
      }
      const relativePath = path
        .relative(path.join(TEMPLATES_DIR, folder), fullPath)
        .split(path.sep)
        .join("/");
      if (files.has(relativePath)) {
        stop(
          "DUPLICATE_PATH",
          `${relativePath} exists in ${files.get(relativePath).folder}/ and ${folder}/`,
        );
      }
      files.set(relativePath, {
        folder,
        content: fs.readFileSync(fullPath, "utf8"),
      });
    });
  }

  folders.forEach((folder) => walk(folder, path.join(TEMPLATES_DIR, folder)));
  return files;
}

function fillMarkers(files, markers) {
  const leftovers = [];
  files.forEach((file, relativePath) => {
    Object.entries(markers).forEach(([marker, value]) => {
      file.content = file.content.replaceAll(marker, value);
    });
    if (file.content.includes(MARKER_OPENING)) leftovers.push(relativePath);
  });
  if (leftovers.length > 0) {
    stop(
      "LEFTOVER_MARKER",
      `"${MARKER_OPENING}" left in ${leftovers.join(", ")}`,
    );
  }
}

function writeProject(projectDir, files) {
  if (fs.existsSync(projectDir)) {
    stop("PROJECT_EXISTS", `${projectDir} already exists`);
  }
  files.forEach((file, relativePath) => {
    const target = path.join(projectDir, ...relativePath.split("/"));
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, file.content, "utf8");
  });
}

function removeProject(projectDir) {
  try {
    fs.rmSync(projectDir, { recursive: true, force: true, maxRetries: 3 });
    return "the project folder was removed";
  } catch (error) {
    return `the project folder could not be removed: delete ${projectDir}`;
  }
}

// A failure after the first write removes the folder: the project is created complete or not at all.
function run(projectDir, code, command) {
  try {
    return execSync(`${command} 2>&1`, { cwd: projectDir, stdio: "pipe" })
      .toString()
      .trim();
  } catch (error) {
    const reason = (String(error.stdout || "").trim() || error.message)
      .split(/\r?\n/)
      .slice(-FAILURE_DETAIL_LINES)
      .join("\n   ");
    stop(code, `${command}\n   ${reason}\n   (${removeProject(projectDir)})`);
  }
}

function findOutdated(projectDir) {
  let output;
  try {
    output = execSync("npm outdated --json", {
      cwd: projectDir,
      stdio: "pipe",
    }).toString();
  } catch (error) {
    // npm outdated exits with 1 when it finds outdated packages, and the report is still on stdout.
    output = error.stdout ? error.stdout.toString() : "";
  }
  try {
    const report = JSON.parse(output);
    if (report.error) return null;
    return Object.entries(report).map(
      ([name, info]) => `${name} ${info.current} → ${info.latest}`,
    );
  } catch (error) {
    return null;
  }
}

function finishProject(projectDir) {
  console.log("📦 Installing dependencies...");
  run(projectDir, "NPM_INSTALL_FAILED", "npm install --no-audit --no-fund");
  const outdated = findOutdated(projectDir);
  console.log("🔨 Building...");
  run(projectDir, "BUILD_FAILED", "npm run build");
  run(projectDir, "GIT_FAILED", "git init -b main");
  run(projectDir, "GIT_FAILED", "git add -A");
  run(projectDir, "GIT_FAILED", `git commit -m "${FIRST_COMMIT_MESSAGE}"`);
  const commit = run(projectDir, "GIT_FAILED", "git rev-parse --short HEAD");
  return { commit, outdated };
}

function countProjectMarks(files) {
  let count = 0;
  files.forEach((file) => {
    count += file.content.split(PROJECT_MARK).length - 1;
  });
  return count;
}

try {
  const { area, name, role, profile } = readArgs();
  validateTerm("Area", area);
  validateTerm("Name", name);
  validateTerm("Role", role);
  const profileSegment = toProfileSegment(profile);
  const destination = readDestination();

  const machineName = toMachineName(area, name, role);
  const title = `${area}_${name} - ${role}`;
  const projectDir = path.join(destination, machineName);
  const folders = selectFolders(profileSegment);

  console.log(
    `⚙️ Assembling ${machineName} (profile: ${PROFILES[profileSegment]})...`,
  );

  // Everything is checked in memory before the first write, so a stop never leaves a half-built project.
  const files = collectFiles(folders);
  fillMarkers(files, {
    "{{MACHINE_NAME}}": machineName,
    "{{PROJECT_TITLE}}": title,
    "{{PROFILE}}": PROFILES[profileSegment],
  });
  writeProject(projectDir, files);
  console.log(`📁 Templates copied: ${folders.join(", ")}`);
  const { commit, outdated } = finishProject(projectDir);

  console.log(`✅ Project created: ${projectDir}`);
  console.log(`   Machine name:  ${machineName}`);
  console.log(`   Title:         ${title}`);
  console.log(`   Files:         ${files.size}`);
  console.log(`   PROJECT: left: ${countProjectMarks(files)}`);
  console.log(`   First commit:  ${commit} ${FIRST_COMMIT_MESSAGE}`);

  if (outdated === null) {
    console.log("⚠️ Could not check for newer dependency versions");
  } else if (outdated.length > 0) {
    console.log("⚠️ Newer versions available (template unchanged):");
    outdated.forEach((line) => console.log(`   ${line}`));
  } else {
    console.log("   Dependencies:  latest published versions");
  }
} catch (error) {
  console.error("❌ Montador error:", error.message);
  process.exit(1);
}
