import type React from "react"
import Link from "next/link"
import { DateRangePicker } from "@/components/date-range-picker"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-semibold">
              Trading Dashboard
            </Link>
            <nav className="flex items-center space-x-6">
              <Link href="/expenses" className="text-sm font-medium transition-colors hover:text-primary">
                Expenses
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <DateRangePicker />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}

