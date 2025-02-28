import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    const { data, error } = await supabase.from("expenses").select("*").order("date", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return NextResponse.json({ error: "Failed to fetch expenses", details: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const { data: expense, error } = await supabase
      .from("expenses")
      .insert([
        {
          date: new Date(data.date).toISOString(),
          type: data.type,
          amount: Number.parseFloat(data.amount),
          description: data.description,
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json(expense[0])
  } catch (error) {
    console.error("Error creating expense:", error)
    return NextResponse.json({ error: "Failed to create expense", details: error.message }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    const { error } = await supabase.from("expenses").delete().neq("id", 0) // This will delete all records

    if (error) throw error

    return NextResponse.json({ message: "All expenses deleted successfully" })
  } catch (error) {
    console.error("Error deleting all expenses:", error)
    return NextResponse.json({ error: "Failed to delete all expenses", details: error.message }, { status: 500 })
  }
}

