import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// Read env for the public API URL (available client‑side as well)
const GINGER_BASE = process.env.NEXT_PUBLIC_GINGER_API_URL || "https://ginger.bitmappro.com";

// The endpoint we need to hit (logout)
const GINGER_LOGOUT_ENDPOINT = `${GINGER_BASE}/bac/logout`;

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("ginger_access_token")?.value;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // 1️⃣ Forward the logout request to the real Ginger logout endpoint
    const gingerRes = await fetch(GINGER_LOGOUT_ENDPOINT, {
      method: "POST",
      headers,
    });

    const gingerData = await gingerRes.json().catch(() => ({}));

    if (!gingerRes.ok) {
      return NextResponse.json(
        { success: false, error: gingerData.error ?? "Logout failed on Ginger API" },
        { status: gingerRes.status }
      );
    }

    // 2️⃣ Return success
    const response = NextResponse.json({
      success: true,
      data: gingerData,
    });

    // Clear the cookie
    response.cookies.delete("ginger_access_token");

    return response;
  } catch (err) {
    console.error("Logout API error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
