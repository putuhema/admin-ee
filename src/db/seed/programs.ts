import "../../../drizzle/envConfig";
import { db } from "../index";
import { Program } from "../schema";

async function seedSubjects() {
  try {
    const programs = [
      {
        name: "abama",
        description:
          "ABAMA adalah program untuk memperkuat dasar membaca dan menulis bagi siswa, membantu meningkatkan kemampuan literasi mereka.",
      },
      {
        name: "calistung",
        description:
          "Calistung mencakup keterampilan dasar membaca, menulis, dan berhitung untuk membangun fondasi pembelajaran yang kuat bagi siswa.",
      },
      {
        name: "mathe",
        description:
          "Program Matematika ini dirancang untuk memperdalam pemahaman siswa terhadap konsep matematika dasar hingga menengah.",
      },
      {
        name: "prisma",
        description:
          "Prisma adalah program yang difokuskan pada pengembangan keterampilan pemecahan masalah dan logika matematika.",
      },
      {
        name: "private",
        description:
          "Program les privat memberikan pembelajaran yang disesuaikan dengan kebutuhan individu siswa untuk mencapai hasil optimal.",
      },
      {
        name: "english basic",
        description:
          "English Basic adalah kursus bahasa Inggris dasar yang berfokus pada pengenalan tata bahasa, kosakata, dan percakapan sederhana.",
      },
      {
        name: "english elementary",
        description:
          "English Elementary dirancang untuk memperkuat keterampilan dasar bahasa Inggris, mencakup tata bahasa dan percakapan sehari-hari.",
      },
      {
        name: "english ski&efc",
        description:
          "Program English SKI & EFC berfokus pada peningkatan keterampilan komunikasi dalam bahasa Inggris dengan materi yang interaktif.",
      },
      {
        name: "lkom",
        description:
          "LKom adalah program literasi komputer yang mengajarkan siswa tentang penggunaan komputer dasar dan keterampilan teknologi informasi.",
      },
      {
        name: "cermat",
        description:
          "Cermat adalah program yang membantu siswa untuk berpikir kritis dan meningkatkan kemampuan analisis dalam berbagai bidang studi.",
      },
    ];

    console.log("🌱 Seeding Programs...");
    await db.insert(Program).values(programs);
    console.log("✅ Program seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding programs:", error);
    process.exit(1);
  }
}

seedSubjects();
