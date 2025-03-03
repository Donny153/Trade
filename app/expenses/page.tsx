import { ExpensesDashboard } from "@/components/expenses-dashboard"

export default function ExpensesPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Expenses & Payouts</h2>
      </div>
      <ExpensesDashboard />
    </div>
  )
}

