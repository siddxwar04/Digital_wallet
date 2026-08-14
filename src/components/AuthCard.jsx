import { motion } from 'framer-motion'

export default function AuthCard({ title, subtitle, children }) {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm rounded-2xl border border-border-hairline bg-surface p-6"
      >
        <h1 className="font-heading text-2xl font-bold text-text-primary">{title}</h1>
        {subtitle && (
          <p className="mt-1 font-body text-sm text-text-muted">{subtitle}</p>
        )}
        <div className="mt-6">{children}</div>
      </motion.div>
    </div>
  )
}
