import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // اختبار متغيرات البيئة
    const secret = process.env.UPLOADTHING_SECRET;
    const token = process.env.UPLOADTHING_TOKEN;

    return NextResponse.json({
      success: true,
      hasSecret: !!secret,
      hasToken: !!token,
      secretLength: secret?.length || 0,
      tokenLength: token?.length || 0,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
