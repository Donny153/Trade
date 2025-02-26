"use client"

import { useState, useEffect } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  addMonths,
  subMonths,
  isWithinInterval,
} from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDashboard } from "@/context/dashboard-context"

export function TradeCalendar() {
  const { trades, dateRange, refreshTrades } = useDashboard()
  const [currentMonth, setCurrentMonth] = useState(dateRange.from)

  useEffect(() => {
    refreshTrades()
  }, [refreshTrades])

  useEffect(() => {
    setCurrentMonth(dateRange.from)
  }, [dateRange])

  // Safely parse trade dates and calculate daily P&L
  const dailyPnL = trades.reduce(
    (acc, trade) => {
      try {
        // Ensure we have a valid date
        const tradeDate = new Date(trade.tradeDay)
        if (isNaN(tradeDate.getTime())) {
          console.warn("Invalid trade date:", trade.tradeDay)
          return acc
        }

        const day = format(tradeDate, "yyyy-MM-dd")
        if (!acc[day]) {
          acc[day] = 0
        }
        acc[day] += trade.pnl - trade.fees
        return acc
      } catch (error) {
        console.error("Error processing trade:", error)
        return acc
      }
    },
    {} as Record<string, number>,
  )

  // Get all days in the current month
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get all positions within the date range
  const positions = trades
    .filter((trade) => {
      try {
        const date = new Date(trade.enteredAt)
        return !isNaN(date.getTime()) && isWithinInterval(date, { start: dateRange.from, end: dateRange.to })
      } catch {
        return false
      }
    })
    .sort((a, b) => {
      const dateA = new Date(a.enteredAt)
      const dateB = new Date(b.enteredAt)
      return dateB.getTime() - dateA.getTime()
    })

  const previousMonth = () => {
    const newMonth = subMonths(currentMonth, 1)
    if (newMonth >= dateRange.from) {
      setCurrentMonth(newMonth)
    }
  }

  const nextMonth = () => {
    const newMonth = addMonths(currentMonth, 1)
    if (startOfMonth(newMonth) <= dateRange.to) {
      setCurrentMonth(newMonth)
    }
  }

  const formatDate = (date: Date) => {
    try {
      return format(date, "MM/dd/yy")
    } catch {
      return "Invalid date"
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-[400px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>P&L</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>{formatDate(new Date(trade.enteredAt))}</TableCell>
                    <TableCell>{trade.contractName}</TableCell>
                    <TableCell>{trade.size}</TableCell>
                    <TableCell className={trade.pnl >= 0 ? "text-green-600" : "text-red-600"}>
                      {trade.pnl.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{format(currentMonth, "MMMM yyyy")}</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={previousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-px bg-muted text-center text-sm">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="bg-background p-2 font-medium">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-muted">
            {days.map((day, index) => {
              const dateKey = format(day, "yyyy-MM-dd")
              const pnl = dailyPnL[dateKey] || 0
              const hasTrading = pnl !== 0

              // Calculate the starting grid column for the first week
              const startingDay = index === 0 ? day.getDay() + 1 : undefined

              return (
                <div
                  key={day.toString()}
                  style={{ gridColumnStart: startingDay }}
                  className={`relative bg-background p-2 min-h-[100px] ${
                    !isSameMonth(day, currentMonth) ? "text-muted-foreground" : ""
                  }`}
                >
                  <div className="text-xs">{format(day, "d")}</div>
                  {hasTrading && (
                    <div
                      className={`mt-1 text-xs font-medium ${
                        pnl > 0
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      } p-1 rounded`}
                    >
                      {pnl > 0 ? "+" : ""}
                      {pnl.toFixed(2)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

