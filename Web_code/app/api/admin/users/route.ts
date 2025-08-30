// app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { getUsersForAdmin } from "@/app/actions/users.actions";

export async function GET() {
  const result = await getUsersForAdmin();

  if (!result.success) {
    return NextResponse.json({ error: result.message }, { status: 500 });
  }

  return NextResponse.json(result.data);
}
