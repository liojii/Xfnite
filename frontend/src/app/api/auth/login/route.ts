import { NextResponse } from "next/server";

// Read env for the public API URL (available client‑side as well)
const GINGER_BASE = process.env.NEXT_PUBLIC_GINGER_API_URL || "https://ginger.bitmappro.com";

// The endpoint we need to hit (login)
const GINGER_LOGIN_ENDPOINT = `${GINGER_BASE}/bac/login`;

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1️⃣ Forward credentials to the real Ginger login endpoint
    const gingerRes = await fetch(GINGER_LOGIN_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const gingerData = await gingerRes.json();

    if (!gingerRes.ok) {
      // Forward the error from Ginger to the front‑end
      return NextResponse.json(
        { success: false, error: gingerData.error ?? "Login failed" },
        { status: 401 }
      );
    }

    // 2️⃣ Return the success payload but STRIP the access token to prevent XSS exposure
    const safeData = { ...gingerData };
    if (safeData.credential) {
      // We only keep safe credentials (if any), removing sensitive tokens
      delete safeData.credential.access_token;
      delete safeData.credential.refresh_token;
    }

    const response = NextResponse.json({
      success: true,
      data: safeData,
    });

    // 3️⃣ Store the access token securely in an HttpOnly cookie
    if (gingerData?.credential?.access_token) {
      response.cookies.set({
        name: "ginger_access_token",
        value: gingerData.credential.access_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    return response;
  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
