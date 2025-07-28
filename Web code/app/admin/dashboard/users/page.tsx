import UsersTable from "@/app/admin/components/UsersTable";
import { PublicUser } from "@/app/types";
import prisma from "@/app/libs/prismadb";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
    },
  });

  const safeUsers: PublicUser[] = users.map((user) => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
  }));

  return (
    <div className="p-6 space-y-4">
      <UsersTable users={safeUsers} />
    </div>
  );
}
