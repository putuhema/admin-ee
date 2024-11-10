import "../../../drizzle/envConfig";
import { db } from "../index";
import { ProductCategory } from "../schema";

async function seedProductCategory() {
  try {
    const productCategory = [
      {
        name: "Books",
        description:
          "Materials and textbooks required for various subjects and levels.",
      },
      {
        name: "Monthly Payments",
        description: "Monthly payment options for ongoing tutoring services.",
      },
      {
        name: "Specific Objects",
        description:
          "Items directly related to the tutoring process, including equipment and special learning tools.",
      },
      {
        name: "Bags",
        description:
          "Bags designed for students to carry materials and supplies to tutoring classes.",
      },
      {
        name: "Clothes",
        description:
          "Clothing items such as uniforms or branded attire for students attending tutoring sessions.",
      },
      {
        name: "Certificates",
        description:
          "Certificates awarded to students for achievements or completion of courses.",
      },
      {
        name: "Medals",
        description:
          "Medals presented to students as recognition of their accomplishments.",
      },
      {
        name: "Trophies",
        description:
          "Trophies awarded to students to celebrate notable achievements in their learning journey.",
      },
    ];

    console.log("🌱 Seeding Product Category...");
    await db.insert(ProductCategory).values(productCategory);
    console.log("✅ Product seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding product:", error);
    process.exit(1);
  }
}

seedProductCategory();
