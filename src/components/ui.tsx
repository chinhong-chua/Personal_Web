import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { useMagnetic } from '../lib/hooks'

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(' ')
}

/** Slides + fades children in as they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

export function SectionHeading({
  index,
  title,
  kicker,
}: {
  index: string
  title: string
  kicker?: string
}) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-xs tracking-[0.2em] text-a3">{index}</span>
        <div className="h-px flex-1 bg-line" />
      </div>
      <h2 className="mt-5 font-display text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">{title}</h2>
      {kicker && <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">{kicker}</p>}
    </Reveal>
  )
}

export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const { x, y, onPointerMove, onPointerLeave } = useMagnetic()
  return (
    <motion.div
      style={{ x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cx('inline-block', className)}
    >
      {children}
    </motion.div>
  )
}

export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        'inline-flex items-center rounded-full border border-line bg-surface px-3 py-1 font-mono text-[11px] tracking-wide text-muted',
        className,
      )}
    >
      {children}
    </span>
  )
}
