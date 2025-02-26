"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback, useEffect } from "react"
import { subDays, endOfDay } from "date-fns"

export type Trade = {
  id?: number
  contractName: string
  enteredAt: Date
  exitedAt: Date
  entryPrice: number
  exitPrice: number
  fees: number
  pnl: number
  size: string
  type: string
  tradeDay: Date
  tradeDuration: string
}

type DateRange = {
  from: Date
  to: Date
}

type DashboardContextType = {
  trades: Trade[]
  isLoading: boolean
  dateRange: DateRange
  updateTrades: (newTrades: Trade[]) => Promise<void>
  deleteAllTrades: () => Promise<void>
  setDateRange: (range: DateRange) => void
  addTrade: (trade: Omit<Trade, "id">) => Promise<void>
  refreshTrades: () => Promise<void>
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [trades, setTrades] = useState<Trade[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: endOfDay(new Date()),
  })

  const refreshTrades = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/trades")
      if (!response.ok) {
        throw new Error("Failed to fetch trades")
      }
      const fetchedTrades = await response.json()

      // Ensure all dates are properly parsed
      const formattedTrades = fetchedTrades.map((trade: any) => ({
        ...trade,
        enteredAt: new Date(trade.enteredAt),
        exitedAt: new Date(trade.exitedAt),
        tradeDay: new Date(trade.tradeDay),
      }))

      setTrades(formattedTrades)
    } catch (error) {
      console.error("Error fetching trades:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    refreshTrades()
  }, [refreshTrades])

  // Refresh trades when date range changes
  useEffect(() => {
    refreshTrades()
  }, [refreshTrades])

  const updateTrades = useCallback(
    async (newTrades: Trade[]) => {
      try {
        const response = await fetch("/api/trades/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTrades),
        })
        if (!response.ok) {
          throw new Error("Failed to update trades")
        }
        await refreshTrades()
      } catch (error) {
        console.error("Error updating trades:", error)
      }
    },
    [refreshTrades],
  )

  const deleteAllTrades = useCallback(async () => {
    try {
      const response = await fetch("/api/trades", { method: "DELETE" })
      if (!response.ok) {
        throw new Error("Failed to delete trades")
      }
      setTrades([])
    } catch (error) {
      console.error("Error deleting trades:", error)
    }
  }, [])

  const addTrade = useCallback(
    async (trade: Omit<Trade, "id">) => {
      try {
        const response = await fetch("/api/trades", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(trade),
        })
        if (!response.ok) {
          throw new Error("Failed to add trade")
        }
        await refreshTrades()
      } catch (error) {
        console.error("Error adding trade:", error)
      }
    },
    [refreshTrades],
  )

  return (
    <DashboardContext.Provider
      value={{
        trades,
        isLoading,
        dateRange,
        updateTrades,
        deleteAllTrades,
        setDateRange,
        addTrade,
        refreshTrades,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider")
  }
  return context
}

