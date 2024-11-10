import "../../../drizzle/envConfig";
import { db } from "../index";
import { ProductCategory } from "../schema";

async function seedProductCategory() {
  try {
    const productCategory = [
      {
        name: "Materi Pembelajaran",
        description:
          "Mencakup sumber daya penting seperti buku, alat pembelajaran khusus, dan tas untuk siswa.",
      },
      {
        name: "Pakaian",
        description:
          "Item pakaian seperti seragam dan pakaian bermerek untuk siswa yang mengikuti sesi bimbingan.",
      },
      {
        name: "Layanan Berlangganan",
        description:
          "Pembayaran berkala untuk layanan bimbingan bulanan, memberikan akses berkelanjutan ke sesi bimbingan.",
      },
      {
        name: "Penghargaan",
        description:
          "Item yang diberikan kepada siswa untuk merayakan pencapaian mereka, termasuk sertifikat, medali, dan piala.",
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
