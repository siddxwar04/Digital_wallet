import { useEffect, useRef } from 'react'
import FormField from './FormField'
import TextInput from './TextInput'
import { useDebouncedCategorize } from '../hooks/useDebouncedCategorize'
import { INSIGHT_CATEGORIES, INSIGHT_LABELS, INSIGHT_TAG_COLORS } from '../utils/categories'

export default function CategorySuggestField({
  description,
  onDescriptionChange,
  onCategoryChange,
  disabled = false,
  id = 'description',
}) {
  const { predictedCategory, selectedCategory, isLoading, source, overrideCategory } =
    useDebouncedCategorize(description)

  const lastSent = useRef(null)

  useEffect(() => {
    if (selectedCategory !== lastSent.current) {
      lastSent.current = selectedCategory
      onCategoryChange?.(selectedCategory)
    }
  }, [selectedCategory, onCategoryChange])

  const displayCategory = selectedCategory ?? predictedCategory
  const tagClass = displayCategory
    ? INSIGHT_TAG_COLORS[displayCategory] ?? INSIGHT_TAG_COLORS.OTHER
    : ''

  return (
    <FormField label="Description" id={id}>
      <TextInput
        id={id}
        placeholder="Zomato order, Uber ride…"
        value={description}
        onChange={(e) => onDescriptionChange(e.target.value)}
        disabled={disabled}
      />

      {(description.trim() || displayCategory) && (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {isLoading ? (
            <span className="font-body text-xs text-text-muted">Detecting category…</span>
          ) : displayCategory ? (
            <span
              data-testid="category-tag"
              className={`inline-flex items-center rounded-full border border-border-hairline px-2.5 py-0.5 text-xs font-medium ${tagClass}`}
            >
              Category: {INSIGHT_LABELS[displayCategory] ?? displayCategory}
              {source && (
                <span className="ml-1.5 font-normal text-text-muted">({source.toLowerCase()})</span>
              )}
            </span>
          ) : null}

          <select
            aria-label="Override category"
            value={selectedCategory ?? ''}
            onChange={(e) => overrideCategory(e.target.value)}
            disabled={disabled || isLoading}
            className="focus-ring rounded-lg border border-border-hairline bg-canvas px-2 py-1 font-body text-xs text-text-primary focus:border-accent-gold/50"
          >
            <option value="" disabled>
              Override…
            </option>
            {INSIGHT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {INSIGHT_LABELS[cat]}
              </option>
            ))}
          </select>
        </div>
      )}
    </FormField>
  )
}
