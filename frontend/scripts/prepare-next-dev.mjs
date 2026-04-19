import { rm } from "fs/promises";
import path from "path";

const nextDir = path.join(process.cwd(), ".next");
const transientDirs = ["server", "static"];

for (const dir of transientDirs) {
  const target = path.join(nextDir, dir);

  try {
    await rm(target, { recursive: true, force: true });
    console.log(`Prepared ${target}`);
  } catch (error) {
    console.warn(`Unable to prepare ${target}:`, error);
  }
}
