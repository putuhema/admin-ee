import { seedMeetingPackage } from "./meeting-package";
import { seedProudcts } from "./products";
import { seedPrograms } from "./programs";
import { seedProgramLevel } from "./programs-level";

async function main() {
  await Promise.all([
    seedMeetingPackage(),
    seedProudcts(),
    seedPrograms(),
    seedProgramLevel(),
  ]);
}

main();
