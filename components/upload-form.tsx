"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Eye, Trash2, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import Papa from "papaparse"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDashboard } from "@/context/dashboard-context"

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const { updateTrades, deleteAllTrades } = useDashboard()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const router = useRouter()

  const onSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!file) return

      try {
        setLoading(true)
        const text = await file.text()
        const result = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
        })
        const records = result.data as any[]

        // Transform records to match our Trade type
        const trades = records.map((record: any) => ({
          contractName: record.ContractName,
          enteredAt: new Date(record.EnteredAt),
          exitedAt: new Date(record.ExitedAt),
          entryPrice: Number.parseFloat(record.EntryPrice),
          exitPrice: Number.parseFloat(record.ExitPrice),
          fees: Number.parseFloat(record.Fees),
          pnl: Number.parseFloat(record.PnL),
          size: record.Size,
          type: record.Type,
          tradeDay: new Date(record.TradeDay),
          tradeDuration: record.TradeDuration,
        }))

        // Update trades in the database and local state
        await updateTrades(trades)

        // Reset form
        setFile(null)
        ;(event.target as HTMLFormElement).reset()
      } catch (error) {
        console.error("Error uploading file:", error)
      } finally {
        setLoading(false)
      }
    },
    [file, updateTrades],
  )

  const handleDelete = async () => {
    await deleteAllTrades()
    setIsDeleteDialogOpen(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Import Trades</CardTitle>
          <CardDescription>Upload your trading data in CSV format to update the dashboard</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={() => router.push("/preview")}>
            <Eye className="h-4 w-4" />
            <span className="sr-only">Preview sample data</span>
          </Button>
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete all trades</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete All Trades</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete all trades? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete All
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="flex items-center gap-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="csv">CSV File</Label>
            <Input
              id="csv"
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              disabled={loading}
            />
          </div>
          <Button type="submit" disabled={!file || loading} className="mt-auto">
            {loading ? (
              "Uploading..."
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

