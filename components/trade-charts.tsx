"use client"

import { format, parseISO } from "date-fns"
import { useEffect } from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboard } from "@/context/dashboard-context"

export function TradeCharts() {
  const { trades, dateRange, refreshTrades } = useDashboard()

  useEffect(() => {
    refreshTrades()
  }, [refreshTrades])

  // Ensure dates are properly parsed
  const filteredTrades = trades.filter((trade) => {
    const tradeDate = trade.tradeDay instanceof Date ? trade.tradeDay : new Date(trade.tradeDay)
    return tradeDate >= dateRange.from && tradeDate <= dateRange.to
  })

  // Calculate daily P&L
  const dailyPnL = filteredTrades.reduce(
    (acc, trade) => {
      const tradeDate = trade.tradeDay instanceof Date ? trade.tradeDay : new Date(trade.tradeDay)
      const day = format(tradeDate, "yyyy-MM-dd")
      if (!acc[day]) {
        acc[day] = {
          wins: 0,
          losses: 0,
          pnl: 0,
          trades: 0,
        }
      }
      acc[day].pnl += trade.pnl - trade.fees
      acc[day].trades += 1
      if (trade.pnl > 0) acc[day].wins += 1
      else acc[day].losses += 1
      return acc
    },
    {} as Record<string, { wins: number; losses: number; pnl: number; trades: number }>,
  )

  // Calculate cumulative P&L
  let cumulative = 0
  const cumulativePnL = Object.entries(dailyPnL)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, data]) => {
      cumulative += data.pnl
      return {
        date: format(parseISO(date), "MM/dd"),
        value: cumulative,
      }
    })

  // Calculate win rates
  const totalWins = Object.values(dailyPnL).reduce((sum, day) => sum + day.wins, 0)
  const totalTrades = Object.values(dailyPnL).reduce((sum, day) => sum + day.trades, 0)
  const winRate = totalTrades > 0 ? (totalWins / totalTrades) * 100 : 0

  const profitableDays = Object.values(dailyPnL).filter((day) => day.pnl > 0).length
  const totalDays = Object.keys(dailyPnL).length
  const profitableDaysRate = totalDays > 0 ? (profitableDays / totalDays) * 100 : 0

  const pieData = [
    { name: "Winners", value: totalWins, color: "#10B981" },
    { name: "Losers", value: totalTrades - totalWins, color: "#EF4444" },
  ]

  const daysPieData = [
    { name: "Profitable", value: profitableDays, color: "#10B981" },
    { name: "Unprofitable", value: totalDays - profitableDays, color: "#EF4444" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Daily Net Cumulative P&L</CardTitle>
          <CardDescription>Your cumulative profit/loss over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumulativePnL}>
                <defs>
                  <linearGradient id="colorPnl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, "P&L"]} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={cumulativePnL[cumulativePnL.length - 1]?.value >= 0 ? "#10B981" : "#EF4444"}
                  fill="url(#colorPnl)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Winning % By Trades</CardTitle>
          <CardDescription>{winRate.toFixed(1)}% Win Rate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  minAngle={15}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Winning % By Days</CardTitle>
          <CardDescription>{profitableDaysRate.toFixed(1)}% Profitable Days</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={daysPieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  minAngle={15}
                >
                  {daysPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

