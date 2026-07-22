import { cp, mkdir, rm } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist/client", { recursive: true });
await mkdir("dist/server", { recursive: true });

for (const file of ["index.html", "styles.css", "script.js"]) {
  await cp(file, `dist/client/${file}`);
}
await cp("assets", "dist/client/assets", { recursive: true });
await cp("worker.js", "dist/server/index.js");
