import TextInput from '../TextInput'
import { TRANSACTION_CATEGORIES } from '../../utils/transactions'

export default function TransactionFilters({
  category,
  fromDate,
  toDate,
  onCategoryChange,
  onFromDateChange,
  onToDateChange,
  onClear,
}) {
  const hasFilters = category || fromDate || toDate

  return (
    <div className="rounded-2xl border border-border-hairline bg-surface p-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label htmlFor="filter-category" className="block font-body text-sm text-text-muted">
            Category
          </label>
          <select
            id="filter-category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="focus-ring w-full rounded-xl border border-border-hairline bg-canvas px-4 py-3 font-body text-sm text-text-primary focus:border-accent-gold/50"
          >
            <option value="">All categories</option>
            {TRANSACTION_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0) + cat.slice(1).toLowerCase().replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="filter-from" className="block font-body text-sm text-text-muted">
            From
          </label>
          <TextInput
            id="filter-from"
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="filter-to" className="block font-body text-sm text-text-muted">
            To
          </label>
          <TextInput
            id="filter-to"
            type="date"
            value={toDate}
            onChange={(e) => onToDateChange(e.target.value)}
          />
        </div>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={onClear}
          className="focus-ring mt-3 font-body text-sm text-accent-gold hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
