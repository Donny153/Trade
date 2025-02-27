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
          contractName: data.contractName,
          enteredAt: new Date(data.enteredAt).toISOString(),
          exitedAt: new Date(data.exitedAt).toISOString(),
          entryPrice: Number.parseFloat(data.entryPrice),
          exitPrice: Number.parseFloat(data.exitPrice),
          fees: Number.parseFloat(data.fees),
          pnl: Number.parseFloat(data.pnl),
          size: data.size,
          type: data.type,
          tradeDay: new Date(data.tradeDay).toISOString(),
          tradeDuration: data.tradeDuration,
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

