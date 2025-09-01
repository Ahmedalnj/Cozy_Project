import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser"; // your server-side auth function

export async function GET() {
  try {
    const user = await getCurrentUser(); // fetch user from session or token

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Only allow admin users
    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
