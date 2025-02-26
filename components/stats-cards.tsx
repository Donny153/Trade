"use client"

import { DollarSign, LineChart, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboard } from "@/context/dashboard-context"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect } from "react"

export function StatsCards() {
  const { trades, isLoading, dateRange, refreshTrades } = useDashboard()

  useEffect(() => {
    refreshTrades()
  }, [refreshTrades])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[100px]" />
              <Skeleton className="mt-1 h-4 w-[140px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Ensure dates are properly parsed
  const filteredTrades = trades.filter((trade) => {
    const tradeDate = trade.tradeDay instanceof Date ? trade.tradeDay : new Date(trade.tradeDay)
    return tradeDate >= dateRange.from && tradeDate <= dateRange.to
  })

  const winningTrades = filteredTrades.filter((trade) => trade.pnl > 0)
  const losingTrades = filteredTrades.filter((trade) => trade.pnl < 0)

  const totalProfit = winningTrades.reduce((sum, trade) => sum + trade.pnl, 0)
  const totalLoss = Math.abs(losingTrades.reduce((sum, trade) => sum + trade.pnl, 0))
  const totalFees = filteredTrades.reduce((sum, trade) => sum + trade.fees, 0)

  const avgWinningTrade = winningTrades.length > 0 ? totalProfit / winningTrades.length : 0
  const avgLosingTrade = losingTrades.length > 0 ? totalLoss / losingTrades.length : 0
  const profitFactor = totalLoss > 0 ? (totalProfit / totalLoss).toFixed(2) : "∞"

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${totalProfit >= totalLoss ? "text-green-500" : "text-red-500"}`}>
            ${(totalProfit - totalLoss - totalFees).toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">Including ${totalFees.toFixed(2)} in fees</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
          <LineChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{profitFactor}</div>
          <p className="text-xs text-muted-foreground">Gross Profit / Gross Loss</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Winner</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">${avgWinningTrade.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">{winningTrades.length} winning trades</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Loser</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">${avgLosingTrade.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">{losingTrades.length} losing trades</p>
        </CardContent>
      </Card>
    </div>
  )
}

