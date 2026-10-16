import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatCurrency } from '../../utils/format'
import { CHART_COLORS } from '../../utils/transactions'

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null

  const item = payload[0].payload
  return (
    <div className="rounded-control border border-border-hairline bg-elevated px-3 py-2">
      <p className="font-body text-xs text-text-muted">{item.label}</p>
      <p className="font-heading text-sm font-semibold text-text-primary">
        {formatCurrency(item.total)}
      </p>
      <p className="font-body text-xs text-text-faint">{item.transactionCount} transactions</p>
    </div>
  )
}

export default function CategoryChart({ categories, loading }) {
  const chartData = useMemo(
    () =>
      (categories ?? [])
        .filter((item) => Number(item.total) > 0)
        .map((item) => ({
          key: item.category,
          label: item.category.charAt(0) + item.category.slice(1).toLowerCase(),
          total: Number(item.total),
          transactionCount: item.transactionCount,
        })),
    [categories],
  )

  if (loading) {
    return (
      <div
        className="h-60 animate-pulse rounded-panel bg-elevated/60"
        role="status"
        aria-label="Loading spending chart"
      />
    )
  }

  if (!chartData.length) {
    return (
      <div
        className="flex h-60 items-center justify-center rounded-panel border border-dashed border-border-strong bg-ink/40"
        role="status"
      >
        <p className="px-4 text-center font-body text-sm text-text-muted">
          No outgoing spend this month. Send money to see category insights.
        </p>
      </div>
    )
  }

  return (
    <div
      className="h-60 w-full sm:h-72"
      role="img"
      aria-label="Bar chart of outgoing spend by category"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(245,240,230,0.06)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: '#8E919C', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#8E919C', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `₹${value}`}
            width={48}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(245,240,230,0.03)' }} />
          <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {chartData.map((entry) => (
              <Cell key={entry.key} fill={CHART_COLORS[entry.key] ?? CHART_COLORS.OTHER} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
