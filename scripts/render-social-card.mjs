import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = join(root, "assets/img/social-share-source.svg");
const backgroundPath = join(root, "assets/img/social-background.png");
const outputPath = join(root, "assets/img/social-share.png");
const renderDirectory = mkdtempSync(join(tmpdir(), "mylo-social-card-"));
const renderSource = join(renderDirectory, "social-share.svg");

try {
  const background = readFileSync(backgroundPath).toString("base64");
  const source = readFileSync(sourcePath, "utf8").replaceAll(
    "social-background.png",
    `data:image/png;base64,${background}`,
  );

  writeFileSync(renderSource, source);
  execFileSync("sips", ["-s", "format", "png", renderSource, "--out", outputPath], {
    stdio: "ignore",
  });
  console.log(`Rendered ${outputPath}`);
} finally {
  rmSync(renderDirectory, { recursive: true, force: true });
}
