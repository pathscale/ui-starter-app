import { existsSync, readFileSync, renameSync, rmSync, unlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { glob } from "glob";

const ROOT = path.resolve(process.cwd(), ".");
const dist = path.join(ROOT, "dist");
const htmlPath = path.join(dist, "index.html");

const mainJsFiles = glob.sync(path.join(dist, "static/js/index.*.js"));
if (mainJsFiles.length > 0) {
  const appMjsPath = path.join(dist, "static/js/app.mjs");
  if (existsSync(appMjsPath)) unlinkSync(appMjsPath);
  renameSync(mainJsFiles[0], appMjsPath);
}

const mainCssFiles = glob.sync(path.join(dist, "static/css/index.*.css"));
if (mainCssFiles.length > 0) {
  const appCssPath = path.join(dist, "static/css/app.css");
  if (existsSync(appCssPath)) unlinkSync(appCssPath);
  renameSync(mainCssFiles[0], appCssPath);
}

try {
  rmSync(path.join(dist, "static/js/async"), { recursive: true, force: true });
} catch {
  // no async folder — nothing to clean
}

const packageJson = JSON.parse(readFileSync(path.join(ROOT, "package.json"), "utf8"));
let version = packageJson.version;
if (version.includes("$GITHUB_RUN_NUMBER")) {
  version = version.replace("$GITHUB_RUN_NUMBER", process.env.GITHUB_RUN_NUMBER || "0");
}

if (existsSync(htmlPath)) {
  let html = readFileSync(htmlPath, "utf8");
  if (mainJsFiles.length > 0) {
    html = html.replace(new RegExp(path.basename(mainJsFiles[0]), "g"), `app.mjs?v=${version}`);
  }
  if (mainCssFiles.length > 0) {
    html = html.replace(new RegExp(path.basename(mainCssFiles[0]), "g"), `app.css?v=${version}`);
  }
  writeFileSync(htmlPath, html);
}

console.log(`Cleanup completed. Version: ${version}`);
