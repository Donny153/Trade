import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const trades = await request.json()

    const formattedTrades = trades.map((trade: any) => ({
      contractName: trade.contractName,
      enteredAt: new Date(trade.enteredAt).toISOString(),
      exitedAt: new Date(trade.exitedAt).toISOString(),
      entryPrice: Number.parseFloat(trade.entryPrice),
      exitPrice: Number.parseFloat(trade.exitPrice),
      fees: Number.parseFloat(trade.fees),
      pnl: Number.parseFloat(trade.pnl),
      size: trade.size,
      type: trade.type,
      tradeDay: new Date(trade.tradeDay).toISOString(),
      tradeDuration: trade.tradeDuration,
    }))

    const { data, error } = await supabase.from("trades").insert(formattedTrades)

    if (error) throw error

    return NextResponse.json({ message: "Trades added successfully" })
  } catch (error) {
    console.error("Error adding trades:", error)
    return NextResponse.json({ error: "Failed to add trades", details: error.message }, { status: 500 })
  }
}

