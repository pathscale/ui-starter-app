import {
  existsSync,
  readFileSync,
  renameSync,
  unlinkSync,
  writeFileSync,
  rmSync,
} from "fs";
import { glob } from "glob";
import path from "path";

// Ensure paths resolve from project root, not scripts/
const ROOT = path.resolve(process.cwd(), ".");

const dist = path.join(ROOT, "dist");
const htmlPath = path.join(dist, "index.html");

// --- 1. Handle .br compressed files ---
const brFiles = glob
  .sync(path.join(dist, "static/**/*.br"))
  .filter((file) => !file.includes("/async/"));

brFiles.forEach((brFile) => {
  const originalFile = brFile.replace(".br", "");
  if (existsSync(originalFile)) unlinkSync(originalFile);
  renameSync(brFile, originalFile);
});

// --- 2. Rename main JS bundle to app.mjs ---
const mainJsFiles = glob.sync(path.join(dist, "static/js/index.*.js"));
if (mainJsFiles.length > 0) {
  const mainJsFile = mainJsFiles[0];
  const appMjsPath = path.join(dist, "static/js/app.mjs");

  if (existsSync(appMjsPath)) unlinkSync(appMjsPath);
  renameSync(mainJsFile, appMjsPath);
}

// --- 3. Rename main CSS bundle to app.scss ---
const mainCssFiles = glob.sync(path.join(dist, "static/css/index.*.css"));
if (mainCssFiles.length > 0) {
  const mainCssFile = mainCssFiles[0];
  const appScssPath = path.join(dist, "static/css/app.scss");

  if (existsSync(appScssPath)) unlinkSync(appScssPath);
  renameSync(mainCssFile, appScssPath);
}

// --- 4. Remove async chunk folder ---
try {
  rmSync(path.join(dist, "static/js/async"), { recursive: true, force: true });
  console.log("Removed async chunks directory after build");
} catch {
  console.warn("No async folder found, skipping async cleanup");
}

// --- 5. Update HTML references with version ---
const packageJson = JSON.parse(
  readFileSync(path.join(ROOT, "package.json"), "utf8")
);
let version = packageJson.version;

if (version.includes("$GITHUB_RUN_NUMBER")) {
  const buildNumber = process.env.GITHUB_RUN_NUMBER || "137";
  version = version.replace("$GITHUB_RUN_NUMBER", buildNumber);
}

if (existsSync(htmlPath)) {
  let html = readFileSync(htmlPath, "utf8");

  if (mainJsFiles.length > 0) {
    const mainJsFileShort = path.basename(mainJsFiles[0]);
    html = html.replace(
      new RegExp(mainJsFileShort, "g"),
      `app.mjs?v=${version}`
    );
  }

  if (mainCssFiles.length > 0) {
    const mainCssFileShort = path.basename(mainCssFiles[0]);
    html = html.replace(
      new RegExp(mainCssFileShort, "g"),
      `app.scss?v=${version}`
    );
  }

  writeFileSync(htmlPath, html);
}

console.log(`Cleanup completed. Version: ${version}`);
