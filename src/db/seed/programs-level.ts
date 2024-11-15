import "../../../drizzle/envConfig";
import { db } from "../index";
import { ProgramLevel, ProgramLevelInsert } from "../schema";

async function seedSubjects() {
  try {
    const programLevels: ProgramLevelInsert[] = [
      {
        programId: 1,
        name: "Level 1",
        price: 30000,
        isActive: true,
      },
      {
        programId: 1,
        name: "Level 2",
        price: 30000,
        isActive: true,
      },
      {
        programId: 1,
        name: "Level 3",
        price: 30000,
        isActive: true,
      },
      {
        programId: 1,
        name: "Level 4",
        price: 30000,
        isActive: true,
      },
      {
        programId: 1,
        name: "Level 5",
        price: 30000,
        isActive: true,
      },
      {
        programId: 1,
        name: "Level 6",
        price: 30000,
        isActive: true,
      },
      {
        programId: 1,
        name: "Level 7",
        price: 30000,
        isActive: true,
      },
      {
        programId: 1,
        name: "Level 8",
        price: 30000,
        isActive: true,
      },
      {
        programId: 2,
        name: "Level 1",
        price: 30000,
        isActive: true,
      },
      {
        programId: 2,
        name: "Level 2",
        price: 30000,
        isActive: true,
      },
      {
        programId: 2,
        name: "Level 3",
        price: 30000,
        isActive: true,
      },
      {
        programId: 2,
        name: "Level 4",
        price: 30000,
        isActive: true,
      },
      {
        programId: 2,
        name: "Level 5",
        price: 30000,
        isActive: true,
      },
      {
        programId: 2,
        name: "Level 6",
        price: 30000,
        isActive: true,
      },
      {
        programId: 2,
        name: "Level 7",
        price: 30000,
        isActive: true,
      },
      {
        programId: 2,
        name: "Level 8",
        price: 30000,
        isActive: true,
      },
      {
        programId: 3,
        name: "Level 1",
        price: 30000,
        isActive: true,
      },
      {
        programId: 3,
        name: "Level 2",
        price: 30000,
        isActive: true,
      },
      {
        programId: 3,
        name: "Level 3",
        price: 30000,
        isActive: true,
      },
      {
        programId: 3,
        name: "Level 4",
        price: 30000,
        isActive: true,
      },
      {
        programId: 3,
        name: "Level 5",
        price: 30000,
        isActive: true,
      },
      {
        programId: 3,
        name: "Level 6",
        price: 30000,
        isActive: true,
      },
      {
        programId: 3,
        name: "Level 7",
        price: 30000,
        isActive: true,
      },
      {
        programId: 3,
        name: "Level 8",
        price: 30000,
        isActive: true,
      },
      {
        programId: 4,
        name: "Level 1",
        price: 30000,
        isActive: true,
      },
      {
        programId: 4,
        name: "Level 2",
        price: 30000,
        isActive: true,
      },
      {
        programId: 4,
        name: "Level 3",
        price: 30000,
        isActive: true,
      },
      {
        programId: 4,
        name: "Level 4",
        price: 30000,
        isActive: true,
      },
      {
        programId: 4,
        name: "Level 5",
        price: 30000,
        isActive: true,
      },
      {
        programId: 4,
        name: "Level 6",
        price: 30000,
        isActive: true,
      },
      {
        programId: 4,
        name: "Level 7",
        price: 30000,
        isActive: true,
      },
      {
        programId: 4,
        name: "Level 8",
        price: 30000,
        isActive: true,
      },
      {
        programId: 5,
        name: "Level 1",
        price: 30000,
        isActive: true,
      },
      {
        programId: 5,
        name: "Level 2",
        price: 30000,
        isActive: true,
      },
      {
        programId: 5,
        name: "Level 3",
        price: 30000,
        isActive: true,
      },
      {
        programId: 5,
        name: "Level 4",
        price: 30000,
        isActive: true,
      },
      {
        programId: 5,
        name: "Level 5",
        price: 30000,
        isActive: true,
      },
      {
        programId: 5,
        name: "Level 6",
        price: 30000,
        isActive: true,
      },
      {
        programId: 5,
        name: "Level 7",
        price: 30000,
        isActive: true,
      },
      {
        programId: 5,
        name: "Level 8",
        price: 30000,
        isActive: true,
      },
      {
        programId: 6,
        name: "Level 1",
        price: 30000,
        isActive: true,
      },
      {
        programId: 6,
        name: "Level 2",
        price: 30000,
        isActive: true,
      },
      {
        programId: 6,
        name: "Level 3",
        price: 30000,
        isActive: true,
      },
      {
        programId: 6,
        name: "Level 4",
        price: 30000,
        isActive: true,
      },
      {
        programId: 6,
        name: "Level 5",
        price: 30000,
        isActive: true,
      },
      {
        programId: 6,
        name: "Level 6",
        price: 30000,
        isActive: true,
      },
      {
        programId: 6,
        name: "Level 7",
        price: 30000,
        isActive: true,
      },
      {
        programId: 6,
        name: "Level 8",
        price: 30000,
        isActive: true,
      },
      {
        programId: 7,
        name: "Level 1",
        price: 30000,
        isActive: true,
      },
      {
        programId: 7,
        name: "Level 2",
        price: 30000,
        isActive: true,
      },
      {
        programId: 7,
        name: "Level 3",
        price: 30000,
        isActive: true,
      },
      {
        programId: 7,
        name: "Level 4",
        price: 30000,
        isActive: true,
      },
      {
        programId: 7,
        name: "Level 5",
        price: 30000,
        isActive: true,
      },
      {
        programId: 7,
        name: "Level 6",
        price: 30000,
        isActive: true,
      },
      {
        programId: 7,
        name: "Level 7",
        price: 30000,
        isActive: true,
      },
      {
        programId: 7,
        name: "Level 8",
        price: 30000,
        isActive: true,
      },
      {
        programId: 8,
        name: "Level 1",
        price: 30000,
        isActive: true,
      },
      {
        programId: 8,
        name: "Level 2",
        price: 30000,
        isActive: true,
      },
      {
        programId: 8,
        name: "Level 3",
        price: 30000,
        isActive: true,
      },
      {
        programId: 8,
        name: "Level 4",
        price: 30000,
        isActive: true,
      },
      {
        programId: 8,
        name: "Level 5",
        price: 30000,
        isActive: true,
      },
      {
        programId: 8,
        name: "Level 6",
        price: 30000,
        isActive: true,
      },
      {
        programId: 8,
        name: "Level 7",
        price: 30000,
        isActive: true,
      },
      {
        programId: 8,
        name: "Level 8",
        price: 30000,
        isActive: true,
      },
      {
        programId: 9,
        name: "Level 1",
        price: 30000,
        isActive: true,
      },
      {
        programId: 9,
        name: "Level 2",
        price: 30000,
        isActive: true,
      },
      {
        programId: 9,
        name: "Level 3",
        price: 30000,
        isActive: true,
      },
      {
        programId: 9,
        name: "Level 4",
        price: 30000,
        isActive: true,
      },
      {
        programId: 9,
        name: "Level 5",
        price: 30000,
        isActive: true,
      },
      {
        programId: 9,
        name: "Level 6",
        price: 30000,
        isActive: true,
      },
      {
        programId: 9,
        name: "Level 7",
        price: 30000,
        isActive: true,
      },
      {
        programId: 9,
        name: "Level 8",
        price: 30000,
        isActive: true,
      },
      {
        programId: 10,
        name: "Level 1",
        price: 30000,
        isActive: true,
      },
      {
        programId: 10,
        name: "Level 2",
        price: 30000,
        isActive: true,
      },
      {
        programId: 10,
        name: "Level 3",
        price: 30000,
        isActive: true,
      },
      {
        programId: 10,
        name: "Level 4",
        price: 30000,
        isActive: true,
      },
      {
        programId: 10,
        name: "Level 5",
        price: 30000,
        isActive: true,
      },
      {
        programId: 10,
        name: "Level 6",
        price: 30000,
        isActive: true,
      },
      {
        programId: 10,
        name: "Level 7",
        price: 30000,
        isActive: true,
      },
      {
        programId: 10,
        name: "Level 8",
        price: 30000,
        isActive: true,
      },
    ];

    console.log("🌱 Seeding Levels...");
    await db.insert(ProgramLevel).values(programLevels);
    console.log("✅ Levels seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding levels:", error);
    process.exit(1);
  }
}

seedSubjects();