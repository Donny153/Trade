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
      contractname: trade.contractName,
      enteredat: new Date(trade.enteredAt),
      exitedat: new Date(trade.exitedAt),
      entryprice: trade.entryPrice,
      exitprice: trade.exitPrice,
      fees: trade.fees,
      pnl: trade.pnl,
      size: trade.size,
      type: trade.type,
      tradeday: new Date(trade.tradeDay),
      tradeduration: trade.tradeDuration
    }))

    const result = await prisma.trade.createMany({
      data: formattedTrades,
      skipDuplicates: true
    })

    // Convert back to camelCase for frontend
    const formattedResult = {
      ...result,
      trades: formattedTrades.map(trade => ({
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
    }

    return NextResponse.json(formattedResult)
  } catch (error) {
    console.error("Error creating trades:", error)
    return NextResponse.json({ error: "Failed to create trades" }, { status: 500 })
  }
}

