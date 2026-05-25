import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const GINGER_BASE = process.env.NEXT_PUBLIC_GINGER_API_URL || "https://ginger.bitmappro.com";
const ACCOUNT_ENDPOINT = `${GINGER_BASE}/bac/eam/sale/user/detail`;

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ginger_access_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // Usually detail endpoints might need a UID or an empty body
    let body = "{}";
    try {
      const reqBody = await request.json();
      body = JSON.stringify(reqBody);
    } catch (e) {
      // Ignore if no body is passed
    }

    const gingerRes = await fetch(ACCOUNT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body,
    });

    const data = await gingerRes.json();

    if (!gingerRes.ok) {
      console.error("Ginger API Account Error:", gingerRes.status, data);
      return NextResponse.json(
        { success: false, error: data.error ?? data.message ?? "Failed to fetch account details", details: data, status: gingerRes.status },
        { status: gingerRes.status }
      );
    }

    // Ginger sometimes returns the payload directly at root, so we check both
    return NextResponse.json({
      success: true,
      data: data.data || data,
    });
  } catch (err) {
    console.error("Account API error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
