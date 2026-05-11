import "reflect-metadata";
import { AppDataSource } from "./config/database";
import { User } from "./entities/User";
import dotenv from "dotenv";

dotenv.config();

const seed = async () => {
  await AppDataSource.initialize();
  console.log("Database connected. Running seed...");

  const userRepository = AppDataSource.getRepository(User);

  // Avoid duplicate seeding
  const existing = await userRepository.count();
  if (existing > 0) {
    console.log("Users already seeded. Skipping.");
    await AppDataSource.destroy();
    return;
  }

  const users = userRepository.create([
    { name: "Marc Soussand", role: "Requester" },
    { name: "Yona Eisenberg", role: "Requester" },
    { name: "Irina Koltaniuk", role: "Requester" },
    { name: "Ilan Koskas", role: "Validator" },
    { name: "Laura Yair", role: "Validator" },
  ]);

  await userRepository.save(users);
  console.log(`Seeded ${users.length} users successfully.`);
  await AppDataSource.destroy();
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
