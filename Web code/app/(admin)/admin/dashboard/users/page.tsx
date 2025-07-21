// app/admin/users/page.tsx
import UsersTable from "@/app/(admin)/admin/components/UsersTable";
import { PublicUser } from "@/app/types";
import prisma from "@/app/libs/prismadb"; // تأكد من مسار prisma الصحيح

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

  return (
    <div className="p-6 space-y-4">
      <UsersTable users={users as unknown as PublicUser[]} />
    </div>
  );
}
