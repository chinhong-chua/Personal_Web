import { useRef, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { ChevronDown } from 'lucide-react'
import type { Job } from '../data/schema'
import { jobs } from '../data/profile'
import { Pill, SectionHeading, cx } from './ui'

function Entry({ job, index, defaultOpen }: { job: Job; index: number; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <motion.li
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="relative pl-10 sm:pl-14"
    >
      {/* node */}
      <span className="absolute left-0 top-2 grid size-7 place-items-center rounded-full border border-line bg-bg sm:left-1">
        <span
          className={cx(
            'size-2.5 rounded-full transition-colors',
            index === 0 ? 'bg-a3 shadow-[0_0_12px_var(--a3)]' : 'bg-muted',
          )}
        />
      </span>

      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="group w-full text-left"
      >
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="font-display text-xl font-semibold tracking-tight transition-colors group-hover:text-a3 sm:text-2xl">
            {job.company}
          </h3>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">{job.location}</span>
          <span className="ml-auto flex items-center gap-2 font-mono text-xs text-muted">
            {job.period}
            <ChevronDown className={cx('size-4 transition-transform duration-300', open && 'rotate-180')} />
          </span>
        </div>
        <p className="mt-1 text-[15px] text-muted">
          {job.role} · <span className="opacity-70">{job.blurb}</span>
        </p>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <ul className="mt-5 space-y-3">
              {job.points.map((p) => (
                <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-muted">
                  <span className="mt-2.5 size-1 shrink-0 rounded-full bg-a2" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              {job.stack.map((s) => (
                <Pill key={s}>{s}</Pill>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-8 h-px bg-line" />
    </motion.li>
  )
}

export function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 65%', 'end 55%'] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <section id="experience" className="relative mx-auto max-w-5xl px-5 py-24 sm:px-8 md:py-32">
      <SectionHeading
        index="03 / Experience"
        title="Where I've been."
        kicker="Seven years across enterprise payments, government systems and commerce. Click any role to expand what I actually shipped there."
      />

      <div ref={ref} className="relative">
        {/* scroll-linked spine */}
        <div className="absolute left-[13px] top-2 h-full w-px bg-line sm:left-[17px]">
          <motion.div
            style={{ scaleY }}
            className="h-full w-full origin-top bg-gradient-to-b from-a3 via-a1 to-transparent"
          />
        </div>

        <ul className="space-y-8">
          {jobs.map((job, i) => (
            <Entry key={job.company} job={job} index={i} defaultOpen={i === 0} />
          ))}
        </ul>
      </div>
    </section>
  )
}
