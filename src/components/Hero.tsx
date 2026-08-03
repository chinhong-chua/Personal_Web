import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react'
import { ArrowDownRight, Circle, FileText, MapPin } from 'lucide-react'
import { profile, stats } from '../data/profile'
import { useCountUp, useInView } from '../lib/hooks'
import { Magnetic } from './ui'

/** Splits a word into per-character spans so it can stagger in. */
function SplitWord({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  return (
    <span className={className} aria-label={text}>
      {[...text].map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block"
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.9, delay: delay + i * 0.03, ease: [0.16, 1, 0.3, 1] }}
        >
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </span>
  )
}

function RotatingRole() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((n) => (n + 1) % profile.roles.length), 2600)
    return () => clearInterval(t)
  }, [])

  return (
    <span className="relative inline-flex h-[1.2em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="gradient-text whitespace-nowrap"
        >
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function Stat({
  value,
  suffix,
  decimals,
  label,
  index,
}: {
  value: number
  suffix: string
  decimals: number
  label: string
  index: number
}) {
  const { ref, inView } = useInView<HTMLDivElement>(0.5)
  const display = useCountUp(value, inView, decimals)

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1 + index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="border-l border-line pl-4"
    >
      <div className="font-display text-2xl font-semibold tabular-nums sm:text-3xl">
        {display}
        <span className="text-a3">{suffix}</span>
      </div>
      <div className="mt-1 text-[13px] text-muted">{label}</div>
    </motion.div>
  )
}

export function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 600], [0, 120])
  const opacity = useTransform(scrollY, [0, 420], [1, 0])

  return (
    <section id="home" className="relative flex min-h-svh items-center px-5 pb-20 pt-28 sm:px-8">
      <motion.div style={{ y, opacity }} className="mx-auto w-full max-w-7xl">
        {/* status */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass inline-flex items-center gap-2.5 rounded-full py-1.5 pl-2.5 pr-4"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-a3 opacity-70" />
            <span className="relative inline-flex size-2 rounded-full bg-a3" />
          </span>
          <span className="text-[13px] text-muted">{profile.status}</span>
        </motion.div>

        <h1 className="mt-8 font-display text-[clamp(2.75rem,10vw,8.5rem)] font-semibold leading-[0.92] tracking-[-0.03em]">
          <span className="block overflow-hidden">
            <SplitWord text={profile.hero.line1} delay={0.15} />
          </span>
          <span className="block overflow-hidden text-[clamp(2rem,6.6vw,5.5rem)] text-muted">
            <SplitWord text={profile.hero.line2} delay={0.3} />
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.8 }}
          className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
        >
          <div className="max-w-xl">
            <p className="font-display text-xl font-medium tracking-tight sm:text-2xl">
              <RotatingRole />
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted sm:text-base">{profile.tagline}</p>
            <p className="mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
              <MapPin className="size-3.5" />
              {profile.location}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Magnetic>
              <a
                href="#work"
                className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3.5 text-sm font-medium text-bg transition-transform active:scale-95"
              >
                View selected work
                <ArrowDownRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#resume"
                className="glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-colors hover:bg-surface-hi"
              >
                <FileText className="size-4" />
                Read the resume
              </a>
            </Magnetic>
          </div>
        </motion.div>

        <div className="mt-16 grid grid-cols-2 gap-6 sm:mt-20 md:grid-cols-4">
          {stats.map((s, i) => (
            <Stat key={s.label} {...s} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
          className="mt-14 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted"
        >
          <motion.span animate={{ y: [0, 5, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
            <Circle className="size-2 fill-current" />
          </motion.span>
          Scroll
        </motion.div>
      </motion.div>
    </section>
  )
}
