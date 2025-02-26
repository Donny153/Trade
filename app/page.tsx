import { DashboardProvider } from "@/context/dashboard-context"
import { DashboardShell } from "@/components/dashboard-shell"
import { StatsCards } from "@/components/stats-cards"
import { TradeCharts } from "@/components/trade-charts"
import { TradeCalendar } from "@/components/trade-calendar"
import { UploadForm } from "@/components/upload-form"
import { AddTradeForm } from "@/components/add-trade-form"

export default function DashboardPage() {
  return (
    <DashboardProvider>
      <DashboardShell>
        <div className="flex flex-col gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <UploadForm />
            <AddTradeForm />
          </div>
          <StatsCards />
          <TradeCharts />
          <TradeCalendar />
        </div>
      </DashboardShell>
    </DashboardProvider>
  )
}

