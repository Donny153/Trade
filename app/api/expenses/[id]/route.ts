import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabase.from("expenses").delete().eq("id", params.id)

    if (error) throw error

    return NextResponse.json({ message: "Expense deleted successfully" })
  } catch (error) {
    console.error("Error deleting expense:", error)
    return NextResponse.json({ error: "Failed to delete expense", details: error.message }, { status: 500 })
  }
}

