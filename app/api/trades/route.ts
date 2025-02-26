import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const trades = await prisma.trade.findMany({
      orderBy: {
        tradeDay: "asc",
      },
    })

    // Convert date strings to Date objects
    const formattedTrades = trades.map((trade) => ({
      ...trade,
      enteredAt: new Date(trade.enteredAt),
      exitedAt: new Date(trade.exitedAt),
      tradeDay: new Date(trade.tradeDay),
    }))

    return NextResponse.json(formattedTrades)
  } catch (error) {
    console.error("Error fetching trades:", error)
    return NextResponse.json({ error: "Failed to fetch trades" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const trade = await prisma.trade.create({
      data: {
        ...data,
        enteredAt: new Date(data.enteredAt),
        exitedAt: new Date(data.exitedAt),
        tradeDay: new Date(data.tradeDay),
      },
    })
    return NextResponse.json(trade)
  } catch (error) {
    console.error("Error creating trade:", error)
    return NextResponse.json({ error: "Failed to create trade" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    await prisma.trade.deleteMany()
    return NextResponse.json({ message: "All trades deleted" })
  } catch (error) {
    console.error("Error deleting trades:", error)
    return NextResponse.json({ error: "Failed to delete trades" }, { status: 500 })
  }
}

