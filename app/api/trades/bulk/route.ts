import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Handle both direct array and wrapped object formats
    const tradesData = Array.isArray(body) ? body : body.trades || []
    
    if (!Array.isArray(tradesData) || tradesData.length === 0) {
      return NextResponse.json(
        { error: "Invalid input: expected non-empty array of trades" },
        { status: 400 }
      )
    }

    const formattedTrades = tradesData.map((trade: any) => ({
      ContractName: trade.contractName,
      EnteredAt: new Date(trade.enteredAt),
      ExitedAt: new Date(trade.exitedAt),
      EntryPrice: trade.entryPrice,
      ExitPrice: trade.exitPrice,
      Fees: trade.fees,
      PnL: trade.pnl,
      Size: trade.size,
      Type: trade.type,
      TradeDay: new Date(trade.tradeDay),
      TradeDuration: trade.tradeDuration
    }))

    const result = await prisma.trade.createMany({
      data: formattedTrades,
      skipDuplicates: true
    })

    // Convert the response to lowercase field names
    const formattedResult = {
      ...result,
      trades: formattedTrades.map(trade => ({
        contractName: trade.ContractName,
        enteredAt: trade.EnteredAt,
        exitedAt: trade.ExitedAt,
        entryPrice: trade.EntryPrice,
        exitPrice: trade.ExitPrice,
        fees: trade.Fees,
        pnl: trade.PnL,
        size: trade.Size,
        type: trade.Type,
        tradeDay: trade.TradeDay,
        tradeDuration: trade.TradeDuration
      }))
    }

    return NextResponse.json(formattedResult)
  } catch (error) {
    console.error("Error creating trades:", error)
    return NextResponse.json({ error: "Failed to create trades" }, { status: 500 })
  }
}

