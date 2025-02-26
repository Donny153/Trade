import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const trades = await request.json()

    // Ensure dates are properly formatted for database
    const formattedTrades = trades.map((trade: any) => ({
      ...trade,
      enteredAt: new Date(trade.enteredAt),
      exitedAt: new Date(trade.exitedAt),
      tradeDay: new Date(trade.tradeDay),
    }))

    await prisma.trade.createMany({
      data: formattedTrades,
      skipDuplicates: true,
    })

    return NextResponse.json({ message: "Trades added successfully" })
  } catch (error) {
    console.error("Error adding trades:", error)
    return NextResponse.json({ error: "Failed to add trades" }, { status: 500 })
  }
}

