import { rm } from "fs/promises";
import path from "path";

const target = path.join(process.cwd(), ".next");

try {
  await rm(target, { recursive: true, force: true });
  console.log(`Cleared ${target}`);
} catch (error) {
  console.warn("Unable to clear .next before build:", error);
}
