"use client"

import type React from "react"

import { useState } from "react"
import { useDashboard } from "@/context/dashboard-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AddTradeForm() {
  const { addTrade, refreshTrades } = useDashboard()
  const [formData, setFormData] = useState({
    contractName: "",
    enteredAt: "",
    exitedAt: "",
    entryPrice: "",
    exitPrice: "",
    fees: "",
    pnl: "",
    size: "",
    type: "long", // Default value
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const newData = { ...prev, [name]: value }

      // Automatically calculate PNL when prices change
      if (name === "entryPrice" || name === "exitPrice") {
        const entryPrice = Number.parseFloat(name === "entryPrice" ? value : prev.entryPrice) || 0
        const exitPrice = Number.parseFloat(name === "exitPrice" ? value : prev.exitPrice) || 0
        const size = Number.parseFloat(prev.size) || 1
        const fees = Number.parseFloat(prev.fees) || 0

        if (prev.type === "long") {
          newData.pnl = ((exitPrice - entryPrice) * size - fees).toString()
        } else {
          newData.pnl = ((entryPrice - exitPrice) * size - fees).toString()
        }
      }

      return newData
    })
  }

  const handleTypeChange = (value: string) => {
    setFormData((prev) => {
      const entryPrice = Number.parseFloat(prev.entryPrice) || 0
      const exitPrice = Number.parseFloat(prev.exitPrice) || 0
      const size = Number.parseFloat(prev.size) || 1
      const fees = Number.parseFloat(prev.fees) || 0

      // Recalculate PNL based on new type
      const pnl = value === "long" ? (exitPrice - entryPrice) * size - fees : (entryPrice - exitPrice) * size - fees

      return {
        ...prev,
        type: value,
        pnl: pnl.toString(),
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trade = {
      ...formData,
      enteredAt: new Date(formData.enteredAt),
      exitedAt: new Date(formData.exitedAt),
      entryPrice: Number.parseFloat(formData.entryPrice),
      exitPrice: Number.parseFloat(formData.exitPrice),
      fees: Number.parseFloat(formData.fees),
      pnl: Number.parseFloat(formData.pnl),
      tradeDay: new Date(formData.enteredAt),
      tradeDuration: "Manual",
    }
    await addTrade(trade)
    await refreshTrades() // Refresh the dashboard after adding a trade

    // Reset form
    setFormData({
      contractName: "",
      enteredAt: "",
      exitedAt: "",
      entryPrice: "",
      exitPrice: "",
      fees: "",
      pnl: "",
      size: "",
      type: "long",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Trade</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contractName">Contract Name</Label>
              <Input
                id="contractName"
                name="contractName"
                value={formData.contractName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <Select value={formData.type} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="long">Long</SelectItem>
                  <SelectItem value="short">Short</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="enteredAt">Entered At</Label>
              <Input
                id="enteredAt"
                name="enteredAt"
                type="datetime-local"
                value={formData.enteredAt}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="exitedAt">Exited At</Label>
              <Input
                id="exitedAt"
                name="exitedAt"
                type="datetime-local"
                value={formData.exitedAt}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="entryPrice">Entry Price</Label>
              <Input
                id="entryPrice"
                name="entryPrice"
                type="number"
                step="0.01"
                value={formData.entryPrice}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="exitPrice">Exit Price</Label>
              <Input
                id="exitPrice"
                name="exitPrice"
                type="number"
                step="0.01"
                value={formData.exitPrice}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="size">Size</Label>
              <Input
                id="size"
                name="size"
                type="number"
                step="0.01"
                value={formData.size}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="fees">Fees</Label>
              <Input
                id="fees"
                name="fees"
                type="number"
                step="0.01"
                value={formData.fees}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="pnl">P&L</Label>
              <Input
                id="pnl"
                name="pnl"
                type="number"
                step="0.01"
                value={formData.pnl}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <Button type="submit">Add Trade</Button>
        </form>
      </CardContent>
    </Card>
  )
}

