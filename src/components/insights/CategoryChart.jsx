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
    <div className="rounded-xl border border-border-hairline bg-surface px-3 py-2 shadow-lg">
      <p className="font-body text-xs text-text-muted">{item.label}</p>
      <p className="font-heading text-sm font-semibold text-text-primary">
        {formatCurrency(item.total)}
      </p>
      <p className="font-body text-xs text-text-muted">{item.transactionCount} transactions</p>
    </div>
  )
}

export default function CategoryChart({ categories, loading }) {
  if (loading) {
    return (
      <div className="h-64 animate-pulse rounded-xl border border-border-hairline bg-canvas" />
    )
  }

  const chartData = categories
    .filter((item) => Number(item.total) > 0)
    .map((item) => ({
      key: item.category,
      label: item.category.charAt(0) + item.category.slice(1).toLowerCase(),
      total: Number(item.total),
      transactionCount: item.transactionCount,
    }))

  if (!chartData.length) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-border-hairline bg-canvas">
        <p className="font-body text-sm text-text-muted">No spending data for this month</p>
      </div>
    )
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: '#9A9CA5', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#9A9CA5', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `₹${value}`}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
          <Bar dataKey="total" radius={[6, 6, 0, 0]}>
            {chartData.map((entry) => (
              <Cell key={entry.key} fill={CHART_COLORS[entry.key] ?? CHART_COLORS.OTHER} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
