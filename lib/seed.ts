const { PrismaClient } = require("@prisma/client");
const { hash } = require("bcrypt");

const prisma = new PrismaClient();

async function seed() {
  const hashedPassword = await hash("12345678", 10);
  await prisma.user.create({
    data: {
      email: "dummy@dummy.com",
      name: "Dummy user",
      password: hashedPassword,
    },
  });
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
