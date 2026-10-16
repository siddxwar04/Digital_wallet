import SelectField from '../SelectField'
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
    <div className="rounded-panel border border-border-hairline bg-ink/50 p-4 sm:p-5">
      <div className="grid gap-4 md:grid-cols-3">
        <SelectField
          id="filter-category"
          label="Category"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">All categories</option>
          {TRANSACTION_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0) + cat.slice(1).toLowerCase().replace('_', ' ')}
            </option>
          ))}
        </SelectField>

        <div className="space-y-2">
          <label htmlFor="filter-from" className="block font-body text-sm font-medium text-text-muted">
            From
          </label>
          <TextInput
            id="filter-from"
            type="date"
            value={fromDate}
            onChange={(e) => onFromDateChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="filter-to" className="block font-body text-sm font-medium text-text-muted">
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
          className="focus-ring mt-4 font-body text-sm text-accent-gold hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
