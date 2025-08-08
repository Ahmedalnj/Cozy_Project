import prisma from "@/app/libs/prismadb";

async function test() {
  try {
    const users = await prisma.user.findMany({ take: 1 });
    console.log("✅ Connection success!", users);
  } catch (error) {
    console.error("❌ Connection failed:", error);
  }
}

test();
