import { PrismaClient } from "@prisma/client";

declare global {
  // نحفظه في global لتفادي إنشاء أكثر من اتصال في بيئة التطوير
  var prisma: PrismaClient | undefined;
}

const client = globalThis.prisma || new PrismaClient();

// نتأكد من الاتصال عند الإنشاء
async function initPrisma() {
  try {
    await client.$connect();
    console.log("✅ Prisma connected successfully");
  } catch (error) {
    console.error("❌ Failed to connect to Prisma:", error);
  }
}

initPrisma();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = client;
}

export default client;
