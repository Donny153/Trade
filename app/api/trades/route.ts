import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const trades = await prisma.trade.findMany({
      orderBy: {
        TradeDay: "asc",
      },
    })

    // Convert field names to lowercase for frontend consistency
    const formattedTrades = trades.map((trade) => ({
      contractName: trade.ContractName,
      enteredAt: new Date(trade.EnteredAt),
      exitedAt: new Date(trade.ExitedAt),
      entryPrice: trade.EntryPrice,
      exitPrice: trade.ExitPrice,
      fees: trade.Fees,
      pnl: trade.PnL,
      size: trade.Size,
      type: trade.Type,
      tradeDay: new Date(trade.TradeDay),
      tradeDuration: trade.TradeDuration
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
        ContractName: data.contractName,
        EnteredAt: new Date(data.enteredAt),
        ExitedAt: new Date(data.exitedAt),
        EntryPrice: data.entryPrice,
        ExitPrice: data.exitPrice,
        Fees: data.fees,
        PnL: data.pnl,
        Size: data.size,
        Type: data.type,
        TradeDay: new Date(data.tradeDay),
        TradeDuration: data.tradeDuration
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

