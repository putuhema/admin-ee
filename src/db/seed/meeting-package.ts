import "../../../drizzle/envConfig";
import { db } from "../index";
import { MeetingPackage } from "../schema";

export async function seedMeetingPackage() {
  try {
    const programs = [
      {
        name: "4X",
        count: 4,
        price: 50000,
      },
      {
        name: "8X",
        count: 8,
        price: 100000,
        discount: 10,
      },
      {
        name: "12X",
        count: 12,
        price: 150000,
        discount: 10,
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
