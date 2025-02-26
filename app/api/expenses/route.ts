import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      orderBy: {
        date: "desc",
      },
    })
    return NextResponse.json(expenses)
  } catch (error) {
    console.error("Error fetching expenses:", error)
    return NextResponse.json({ error: "Failed to fetch expenses", details: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log("Received expense data:", data)

    const expense = await prisma.expense.create({
      data: {
        date: new Date(data.date),
        type: data.type,
        amount: Number.parseFloat(data.amount),
        description: data.description,
      },
    })
    console.log("Created expense:", expense)
    return NextResponse.json(expense)
  } catch (error) {
    console.error("Error creating expense:", error)
    return NextResponse.json({ error: "Failed to create expense", details: error.message }, { status: 500 })
  }
}

