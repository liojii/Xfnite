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

    const currentIncome = await prisma.currentIncome.findUnique({
      where: { email },
    });

    const incomeHistory = await prisma.incomeHistory.findMany({
      where: { email },
      orderBy: { payoutDate: 'desc' },
    });

    return NextResponse.json({ 
      success: true, 
      data: {
        current: currentIncome,
        history: incomeHistory
      }
    });
  } catch (err) {
    console.error("GET Income error:", err);
    return NextResponse.json(
      { success: false, error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
