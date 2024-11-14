import "../../../drizzle/envConfig";
import { db } from "../index";
import { MeetingPackage } from "../schema";

async function seedSubjects() {
  try {
    const programs = [
      {
        name: "4X",
        count: 4,
      },
      {
        name: "8X",
        count: 8,
      },
      {
        name: "12X",
        count: 12,
      },
    ];

    console.log("🌱 Seeding Meeting Package...");
    await db.insert(MeetingPackage).values(programs);
    console.log("✅ Meeting Package seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding meeting package:", error);
    process.exit(1);
  }
}

seedSubjects();
