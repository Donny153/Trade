import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const trades = await request.json()

    const formattedTrades = trades.map((trade: any) => ({
      contractName: trade.contractName,
      enteredAt: new Date(trade.EnteredAt).toISOString(),
      exitedAt: new Date(trade.ExitedAt).toISOString(),
      entryPrice: Number.parseFloat(trade.EntryPrice),
      exitPrice: Number.parseFloat(trade.ExitPrice),
      fees: Number.parseFloat(trade.Fees),
      pnl: Number.parseFloat(trade.PnL),
      size: trade.Size,
      type: trade.Type,
      tradeDay: new Date(trade.TradeDay).toISOString(),
      tradeDuration: trade.TradeDuration,
    }))

    const { data, error } = await supabase.from("trades").insert(formattedTrades)

    if (error) throw error

    return NextResponse.json({ message: "Trades added successfully" })
  } catch (error) {
    console.error("Error adding trades:", error)
    return NextResponse.json({ error: "Failed to add trades", details: error.message }, { status: 500 })
  }
}

