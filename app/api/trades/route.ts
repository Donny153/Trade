import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const trades = await prisma.trade.findMany({
      orderBy: {
        tradeday: "asc",
      },
    })

    // Convert to camelCase for frontend
    const formattedTrades = trades.map((trade) => ({
      contractName: trade.contractname,
      enteredAt: trade.enteredat,
      exitedAt: trade.exitedat,
      entryPrice: trade.entryprice,
      exitPrice: trade.exitprice,
      fees: trade.fees,
      pnl: trade.pnl,
      size: trade.size,
      type: trade.type,
      tradeDay: trade.tradeday,
      tradeDuration: trade.tradeduration
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
        contractname: data.contractName,
        enteredat: new Date(data.enteredAt),
        exitedat: new Date(data.exitedAt),
        entryprice: data.entryPrice,
        exitprice: data.exitPrice,
        fees: data.fees,
        pnl: data.pnl,
        size: data.size,
        type: data.type,
        tradeday: new Date(data.tradeDay),
        tradeduration: data.tradeDuration
      },
    })

    // Convert to camelCase for frontend
    const formattedTrade = {
      contractName: trade.contractname,
      enteredAt: trade.enteredat,
      exitedAt: trade.exitedat,
      entryPrice: trade.entryprice,
      exitPrice: trade.exitprice,
      fees: trade.fees,
      pnl: trade.pnl,
      size: trade.size,
      type: trade.type,
      tradeDay: trade.tradeday,
      tradeDuration: trade.tradeduration
    }

    return NextResponse.json(formattedTrade)
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

