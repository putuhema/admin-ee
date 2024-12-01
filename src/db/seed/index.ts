import { seedMeetingPackage } from "./meeting-package";
import { seedProudcts } from "./products";
import { seedPrograms } from "./programs";

async function main() {
  try {
    await Promise.all([seedMeetingPackage(), seedProudcts(), seedPrograms()]);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
}

main();
