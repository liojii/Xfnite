import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const GINGER_BASE = process.env.NEXT_PUBLIC_GINGER_API_URL || "https://ginger.bitmappro.com";
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
      return NextResponse.json(
        { success: false, error: gingerData.error ?? "Login failed" },
        { status: 401 }
      );
    }

    // 2️⃣ Store the access token securely in an HttpOnly cookie
    // Using cookies() from next/headers — the correct method for Next.js App Router
    if (gingerData?.credential?.access_token) {
      const cookieStore = await cookies();
      cookieStore.set({
        name: "ginger_access_token",
        value: gingerData.credential.access_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });
    }

    // 3️⃣ Return the success payload but STRIP the tokens to prevent XSS exposure
    const safeData = { ...gingerData };
    if (safeData.credential) {
      delete safeData.credential.access_token;
      delete safeData.credential.refresh_token;
    }

    return NextResponse.json({
      success: true,
      data: safeData,
    });

  } catch (err) {
    console.error("Login API error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
