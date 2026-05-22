import { NextResponse } from "next/server";

// Read env for the public API URL (available client‑side as well)
const GINGER_BASE = process.env.NEXT_PUBLIC_GINGER_API_URL || "https://ginger.bitmappro.com";

// The endpoint we need to hit (logout)
const GINGER_LOGOUT_ENDPOINT = `${GINGER_BASE}/bac/logout`;

export async function POST(request: Request) {
  try {
    // 1️⃣ Forward the logout request to the real Ginger logout endpoint
    // We send a POST request. Depending on Ginger's API, you might need to forward cookies/tokens here later.
    const gingerRes = await fetch(GINGER_LOGOUT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const gingerData = await gingerRes.json().catch(() => ({}));

    if (!gingerRes.ok) {
      return NextResponse.json(
        { success: false, error: gingerData.error ?? "Logout failed on Ginger API" },
        { status: gingerRes.status }
      );
    }

    // 2️⃣ Return success
    return NextResponse.json({
      success: true,
      data: gingerData,
    });
  } catch (err) {
    console.error("Logout API error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
