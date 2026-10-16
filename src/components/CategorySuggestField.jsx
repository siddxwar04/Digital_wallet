import { useEffect, useRef } from 'react'
import FormField from './FormField'
import TextInput from './TextInput'
import { CategoryIcon } from './icons'
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
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          {isLoading ? (
            <span className="font-body text-xs text-text-muted">Detecting category…</span>
          ) : displayCategory ? (
            <span
              data-testid="category-tag"
              className={`inline-flex items-center gap-1.5 rounded-full border border-border-hairline px-2.5 py-1 text-xs font-medium ${tagClass}`}
            >
              <CategoryIcon category={displayCategory} className="h-3.5 w-3.5" />
              Category: {INSIGHT_LABELS[displayCategory] ?? displayCategory}
              {source && (
                <span className="font-normal text-text-muted">({source.toLowerCase()})</span>
              )}
            </span>
          ) : null}

          <select
            aria-label="Override category"
            value={selectedCategory ?? ''}
            onChange={(e) => overrideCategory(e.target.value)}
            disabled={disabled || isLoading}
            className="focus-ring field-control w-auto py-1.5 text-xs"
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
