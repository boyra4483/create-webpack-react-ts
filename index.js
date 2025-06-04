#!/usr/bin/env node
import degit from "degit";
import fs from "fs/promises";
import path from "path";

async function main() {
  const projectName = process.argv[2];

  if (!projectName) {
    console.error("❌ Please specify a project name:");
    console.log("   npm create webpack-react-ts@latest your-app-name");
    process.exit(1);
  }

  console.log(`🚀 Creating a new project: ${projectName}`);

  const emitter = degit("boyra4483/webpack-react-ts", {
    cache: false,
    force: true,
    verbose: true,
  });

  try {
    await emitter.clone(projectName);
  } catch (error) {
    console.error("❌ Failed to clone template:", error);
    process.exit(1);
  }

  const projectPath = path.resolve(process.cwd(), projectName);

  try {
    await fs.rm(path.join(projectPath, ".git"), {
      recursive: true,
      force: true,
    });
  } catch (err) {}

  try {
    const pkgPath = path.join(projectPath, "package.json");
    const pkgRaw = await fs.readFile(pkgPath, "utf8");
    const pkg = JSON.parse(pkgRaw);
    pkg.name = projectName;
    await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2), "utf8");
  } catch (error) {
    console.error("❌ Failed to update package.json:", error);
  }

  console.log(`
    ✅ Done!
    cd ${projectName}
    npm install
    npm run server
    `);
}

main();
