import { CATEGORY_STYLES } from '../../utils/transactions'

const icons = {
  TRANSFER: '↗',
  TOPUP: '+',
  FOOD: '◉',
  TRANSPORT: '◎',
  SHOPPING: '▢',
  BILLS: '≡',
  REQUEST: '↑',
}

export default function CategoryTag({ category }) {
  const style = CATEGORY_STYLES[category] ?? CATEGORY_STYLES.REQUEST
  const icon = icons[category] ?? '•'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border border-border-hairline px-2 py-0.5 text-[11px] font-medium ${style.bg} ${style.color}`}
    >
      <span aria-hidden="true">{icon}</span>
      {style.label}
    </span>
  )
}
