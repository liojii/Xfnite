import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const paymentDetails = await prisma.paymentDetails.findUnique({
      where: { email },
    });

    return NextResponse.json({ success: true, data: paymentDetails });
  } catch (err) {
    console.error("GET Payment Details error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, payeeName, payeeUid, paymentMethod } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    const updated = await prisma.paymentDetails.upsert({
      where: { email },
      update: {
        payeeName,
        payeeUid,
        paymentMethod,
      },
      create: {
        email,
        payeeName,
        payeeUid,
        paymentMethod,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("POST Payment Details error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
