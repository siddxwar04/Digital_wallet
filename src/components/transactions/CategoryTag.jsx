import { CategoryIcon } from '../icons'
import { CATEGORY_STYLES } from '../../utils/transactions'

export default function CategoryTag({ category }) {
  const style = CATEGORY_STYLES[category] ?? CATEGORY_STYLES.REQUEST

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-border-hairline px-2 py-0.5 text-[11px] font-medium ${style.bg} ${style.color}`}
    >
      <CategoryIcon category={category} className="h-3.5 w-3.5" />
      {style.label}
    </span>
  )
}
