import { NextResponse } from "next/server";

const GINGER_BASE = process.env.NEXT_PUBLIC_GINGER_API_URL || "https://ginger.bitmappro.com";
const GINGER_SIGNUP_VALIDATE_ENDPOINT = `${GINGER_BASE}/bac/eam/koala/koala-user/user/signup-validate`;
const GINGER_SIGNUP_ENDPOINT = `${GINGER_BASE}/bac/eam/koala/koala-user/user/signup`;

import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function POST(request: Request) {
  try {
    const { 
      email, 
      username, 
      password, 
      password_conf, 
      referal_email, 
      imitation_code,
      contact = " ",
      occupied = " ",
      graduate_date = " ",
      action = "signup"
    } = await request.json();

    const payload = {
      contact,
      email,
      graduate_date,
      imitation_code,
      occupied,
      password,
      password_conf,
      payee_name: "",
      payee_uid: "",
      referal_email,
      username
    };

    if (action === "validate" || action === "signup") {
      // 1. Validate signup
      const validateRes = await fetch(GINGER_SIGNUP_VALIDATE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const validateDataText = await validateRes.text();
      let isError = !validateRes.ok;
      let errorMsg = "Validation failed";
      let parsed = null;

      try {
        parsed = JSON.parse(validateDataText);
        // Some APIs return 200 OK but with an error code inside JSON
        if (validateRes.ok && parsed && typeof parsed.code !== 'undefined' && parsed.code !== 0 && parsed.code !== 200) {
          isError = true;
        }
        
        if (isError) {
          if (parsed.msg) errorMsg = parsed.msg;
          else if (parsed.message) errorMsg = parsed.message;
          else if (parsed.error) errorMsg = parsed.error;
          else if (typeof parsed === 'string') errorMsg = parsed;
        }
      } catch (e) {
        if (isError) errorMsg = validateDataText || errorMsg;
      }

      if (isError) {
        if (typeof errorMsg === 'string') {
          errorMsg = errorMsg.replace(/^\(\d+\)\s*/, '');
        }
        return NextResponse.json(
          { success: false, error: errorMsg },
          { status: validateRes.ok ? 400 : validateRes.status }
        );
      }
      
      if (action === "validate") {
        return NextResponse.json({ success: true });
      }
    }

    // 2. Perform actual signup
    const signupRes = await fetch(GINGER_SIGNUP_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const signupDataText = await signupRes.text();
    let isSignupError = !signupRes.ok;
    let signupErrorMsg = "Signup failed";
    let signupParsed = null;

    try {
      signupParsed = JSON.parse(signupDataText);
      // Some APIs return 200 OK but with an error code inside JSON
      if (signupRes.ok && signupParsed && typeof signupParsed.code !== 'undefined' && signupParsed.code !== 0 && signupParsed.code !== 200) {
        isSignupError = true;
      }
      
      if (isSignupError) {
        if (signupParsed.msg) signupErrorMsg = signupParsed.msg;
        else if (signupParsed.message) signupErrorMsg = signupParsed.message;
        else if (signupParsed.error) signupErrorMsg = signupParsed.error;
        else if (typeof signupParsed === 'string') signupErrorMsg = signupParsed;
      }
    } catch (e) {
      if (isSignupError) signupErrorMsg = signupDataText || signupErrorMsg;
    }

    if (isSignupError) {
      if (typeof signupErrorMsg === 'string') {
        signupErrorMsg = signupErrorMsg.replace(/^\(\d+\)\s*/, '');
      }
      return NextResponse.json(
        { success: false, error: signupErrorMsg },
        { status: signupRes.ok ? 400 : signupRes.status }
      );
    }

    const responseData = signupParsed || {};

    // 3️⃣ SYNC user to local Postgres Database
    try {
      await prisma.user.upsert({
        where: { email: email },
        update: { name: username },
        create: {
          email: email,
          name: username,
          role: "Checker",
          status: "Active",
        }
      });
    } catch (dbErr) {
      console.error("Failed to sync user to local DB on signup:", dbErr);
      // Do not block signup if sync fails
    }

    return NextResponse.json({
      success: true,
      data: responseData,
    });

  } catch (err) {
    console.error("Register API error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
