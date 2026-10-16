const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.75,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export function IconHome(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" />
    </svg>
  )
}

export function IconActivity(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 12h3.5l2-6 3 12 2.5-6H20" />
    </svg>
  )
}

export function IconSend(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h12" />
      <path d="m12 6 6 6-6 6" />
    </svg>
  )
}

export function IconAdd(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

export function IconRequest(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 19V5" />
      <path d="m6 11 6-6 6 6" />
    </svg>
  )
}

export function IconSignOut(props) {
  return (
    <svg {...base} {...props}>
      <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
      <path d="M15 12H8" />
      <path d="m12 8 4 4-4 4" />
    </svg>
  )
}

export function IconFood(props) {
  return (
    <svg {...base} {...props}>
      <path d="M8 4v7a2 2 0 0 0 2 2h0V4" />
      <path d="M12 4v16" />
      <path d="M16 4c1.5 1 2 2.5 2 5v2h-2" />
    </svg>
  )
}

export function IconTransport(props) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="7" width="16" height="9" rx="2" />
      <path d="M7 16v2M17 16v2M4 12h16" />
    </svg>
  )
}

export function IconShopping(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6 8h12l-1 11H7L6 8Z" />
      <path d="M9 8a3 3 0 0 1 6 0" />
    </svg>
  )
}

export function IconBills(props) {
  return (
    <svg {...base} {...props}>
      <path d="M7 4h10v16l-2-1.5L13 20l-2-1.5L9 20l-2-1.5V4Z" />
      <path d="M10 9h4M10 13h4" />
    </svg>
  )
}

export function IconTransfer(props) {
  return (
    <svg {...base} {...props}>
      <path d="M7 8h11l-3-3" />
      <path d="M17 16H6l3 3" />
    </svg>
  )
}

export function IconTopUp(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  )
}

export function IconCheck(props) {
  return (
    <svg {...base} {...props}>
      <path d="m5 12 5 5L20 7" />
    </svg>
  )
}

const CATEGORY_ICON = {
  TRANSFER: IconTransfer,
  TOPUP: IconTopUp,
  FOOD: IconFood,
  TRANSPORT: IconTransport,
  SHOPPING: IconShopping,
  BILLS: IconBills,
  REQUEST: IconRequest,
  TRANSFERS: IconTransfer,
  OTHER: IconActivity,
}

export function CategoryIcon({ category, className = 'h-4 w-4' }) {
  const Comp = CATEGORY_ICON[category] ?? IconActivity
  return <Comp className={className} />
}
