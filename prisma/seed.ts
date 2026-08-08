import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { env } from "../src/config/env";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.admin.findFirst();

  if (existing) {
    console.log("Admin already exists.");
    return;
  }

  const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, 10);

  await prisma.admin.create({
    data: {
      username: env.ADMIN_USERNAME,
      password_hash: passwordHash,
    },
  });

  console.log("Admin created successfully.");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });