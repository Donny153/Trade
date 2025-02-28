import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabase.from("trades").select("*").order("enteredAt", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching trades:", error)
    return NextResponse.json({ error: "Failed to fetch trades", details: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { data: trade, error } = await supabase
      .from("trades")
      .insert([
        {
          contractName: data.ContractName,
          enteredAt: new Date(data.EnteredAt).toISOString(),
          exitedAt: new Date(data.ExitedAt).toISOString(),
          entryPrice: Number.parseFloat(data.EntryPrice),
          exitPrice: Number.parseFloat(data.ExitPrice),
          fees: Number.parseFloat(data.Fees),
          pnl: Number.parseFloat(data.PnL),
          size: data.Size,
          type: data.Type,
          tradeDay: new Date(data.TradeDay).toISOString(),
          tradeDuration: data.TradeDuration,
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json(trade[0])
  } catch (error) {
    console.error("Error creating trade:", error)
    return NextResponse.json({ error: "Failed to create trade", details: error.message }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const { error } = await supabase.from("trades").delete().neq("id", 0) // This will delete all records

    if (error) throw error

    return NextResponse.json({ message: "All trades deleted successfully" })
  } catch (error) {
    console.error("Error deleting all trades:", error)
    return NextResponse.json({ error: "Failed to delete all trades", details: error.message }, { status: 500 })
  }
}

