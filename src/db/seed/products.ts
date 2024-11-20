import "../../../drizzle/envConfig";
import { db } from "../index";
import { Product, ProductInsert } from "../schema";

export async function seedProudcts() {
  try {
    const products = [
      {
        name: "Math Workbook",
        price: 75000,
        description:
          "A comprehensive workbook for mastering basic math skills.",
        type: "book",
        stockQuantity: 20,
        status: "active",
      },

      {
        name: "English Grammar Guide",
        price: 90000,
        description:
          "A detailed guide for learning English grammar with exercises.",
        type: "book",
        stockQuantity: 15,
        status: "active",
      },

      {
        name: "Whiteboard Markers",
        price: 30000,
        description: "Pack of 5 colorful markers for writing on whiteboards.",
        type: "accessory",
        stockQuantity: 25,
        status: "active",
      },

      {
        name: "Student Planner",
        price: 45000,
        description:
          "A planner to help students organize their study schedule.",
        type: "stationery",
        stockQuantity: 30,
        status: "active",
      },

      {
        name: "Geometry Set",
        price: 40000,
        description:
          "A set containing a compass, protractor, and ruler for geometry lessons.",
        type: "tool",
        stockQuantity: 18,
        status: "active",
      },

      {
        name: "Science Experiment Kit",
        price: 120000,
        description:
          "A kit with tools and instructions for basic science experiments.",
        type: "kit",
        stockQuantity: 8,
        status: "active",
      },

      {
        name: "Notebook",
        price: 20000,
        description:
          "A 200-page lined notebook for note-taking during lessons.",
        type: "stationery",
        stockQuantity: 50,
        status: "active",
      },

      {
        name: "Calculator",
        price: 85000,
        description: "A scientific calculator for advanced math students.",
        type: "tool",
        stockQuantity: 12,
        status: "active",
      },

      {
        name: "Art Supplies Set",
        price: 60000,
        description:
          "A set of colored pencils, markers, and sketchbook for art classes.",
        type: "kit",
        stockQuantity: 10,
        status: "active",
      },

      {
        name: "Flashcards Pack",
        price: 35000,
        description:
          "A pack of 100 flashcards for vocabulary and quick learning.",
        type: "tool",
        stockQuantity: 40,
        status: "active",
      },
    ] as ProductInsert[];

    console.log("🌱 Seeding Products Package...");
    await db.insert(Product).values(products);
    console.log("✅ Products Package seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
}
