import { useMemo, useState } from 'react'
import { AnimatePresence, motion, useMotionTemplate } from 'motion/react'
import { ArrowUpRight, Building2, Lock, ShieldCheck, X } from 'lucide-react'
import type { Access, Project } from '../data/schema'
import { ACCESS_LABEL } from '../data/schema'
import { projects } from '../data/profile'
import { useScrollLock, useTilt } from '../lib/hooks'
import { Pill, Reveal, SectionHeading, cx } from './ui'

const FILTERS = ['All', 'Platform & Cloud', 'Reliability', 'AI Systems', 'Government'] as const

/** Most of this work lives behind an enterprise or government boundary — say so plainly. */
function AccessBadge({ access }: { access: Access }) {
  if (access === 'public') return null
  const Icon = access === 'restricted' ? ShieldCheck : Lock
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-a2/30 bg-a2/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-a2">
      <Icon className="size-3" />
      {ACCESS_LABEL[access]}
    </span>
  )
}

/** Deterministic gradient-mesh cover generated from the project's two stops. */
function Cover({ project, className }: { project: Project; className?: string }) {
  const [a, b] = project.cover
  return (
    <div
      className={cx('relative overflow-hidden', className)}
      style={{
        background: `radial-gradient(120% 120% at 20% 10%, ${a} 0%, transparent 55%),
                     radial-gradient(120% 120% at 85% 80%, ${b} 0%, transparent 55%),
                     linear-gradient(145deg, ${a}22, ${b}22)`,
      }}
    >
      <div
        className="absolute inset-0 opacity-25 mix-blend-overlay"
        style={{
          backgroundImage:
            'repeating-linear-gradient(115deg, transparent 0 6px, rgb(255 255 255 / 0.5) 6px 7px)',
        }}
      />
      <span className="absolute bottom-2 right-4 font-display text-6xl font-bold text-white/15">
        {project.id.slice(0, 2).toUpperCase()}
      </span>
    </div>
  )
}

function ProjectCard({ project, onOpen, index }: { project: Project; onOpen: () => void; index: number }) {
  const { rotateX, rotateY, glareX, glareY, onPointerMove, onPointerLeave } = useTilt(6)
  const glare = useMotionTemplate`radial-gradient(340px circle at ${glareX} ${glareY}, rgb(255 255 255 / 0.10), transparent 65%)`

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12, scale: 0.98 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className={cx('group', project.featured && 'md:col-span-2')}
      style={{ perspective: 1200 }}
    >
      <motion.button
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        onClick={onOpen}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="ring-conic glass relative flex h-full w-full flex-col overflow-hidden rounded-2xl text-left transition-shadow duration-500 hover:shadow-2xl hover:shadow-a1/10"
        aria-label={`Open case study: ${project.title}`}
      >
        <Cover
          project={project}
          className={cx('w-full shrink-0', project.featured ? 'h-52 md:h-64' : 'h-40')}
        />

        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mb-2 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                <Building2 className="size-3" />
                {project.org} · {project.year}
              </p>
              <h3 className="font-display text-xl font-semibold tracking-tight">{project.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{project.tagline}</p>
            </div>
            <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-line text-muted transition-all duration-300 group-hover:border-transparent group-hover:bg-fg group-hover:text-bg">
              <ArrowUpRight className="size-4" />
            </span>
          </div>

          {/* Headline metrics carry the weight where a live link can't */}
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {project.metrics.slice(0, project.featured ? 3 : 2).map((m) => (
              <div key={m.label}>
                <div className="gradient-text font-display text-lg font-semibold">{m.value}</div>
                <div className="text-[11px] leading-tight text-muted">{m.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
            <AccessBadge access={project.access} />
            {project.stack.slice(0, project.featured ? 4 : 2).map((s) => (
              <Pill key={s}>{s}</Pill>
            ))}
          </div>
        </div>

        {/* cursor sheen */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glare }}
        />
      </motion.button>
    </motion.article>
  )
}

function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  useScrollLock(Boolean(project))

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="fixed inset-0 z-[65] flex items-start justify-center overflow-y-auto p-4 sm:p-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onKeyDown={(e) => e.key === 'Escape' && onClose()}
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="glass relative my-8 w-full max-w-3xl overflow-hidden rounded-3xl bg-elev/95 shadow-2xl"
          >
            <Cover project={project} className="h-44 w-full sm:h-56" />

            <button
              onClick={onClose}
              autoFocus
              aria-label="Close"
              className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60"
            >
              <X className="size-4" />
            </button>

            <div className="p-6 sm:p-9">
              <div className="flex flex-wrap items-center gap-2">
                <Pill className="!text-a3">{project.category}</Pill>
                <Pill>{project.org}</Pill>
                <Pill>{project.year}</Pill>
                <Pill>{project.role}</Pill>
              </div>

              <h3 className="mt-5 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                {project.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">{project.summary}</p>

              <div className="mt-8 grid grid-cols-3 gap-3">
                {project.metrics.map((m) => (
                  <div key={m.label} className="rounded-xl border border-line bg-surface p-4">
                    <div className="gradient-text font-display text-xl font-semibold sm:text-2xl">{m.value}</div>
                    <div className="mt-1 text-[11px] leading-tight text-muted">{m.label}</div>
                  </div>
                ))}
              </div>

              <h4 className="mt-9 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">What I did</h4>
              <ul className="mt-4 space-y-3">
                {project.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-sm leading-relaxed text-muted">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-a3" />
                    {h}
                  </li>
                ))}
              </ul>

              <div className="mt-9 flex flex-wrap items-center gap-2 border-t border-line pt-6">
                {project.stack.map((s) => (
                  <Pill key={s}>{s}</Pill>
                ))}
              </div>

              {project.links?.length ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  {project.links.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-bg transition-transform active:scale-95"
                    >
                      {l.label}
                      <ArrowUpRight className="size-4" />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="mt-6 flex gap-3 rounded-xl border border-a2/25 bg-a2/[0.06] p-4">
                  {project.access === 'restricted' ? (
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-a2" />
                  ) : (
                    <Lock className="mt-0.5 size-4 shrink-0 text-a2" />
                  )}
                  <p className="text-[13px] leading-relaxed text-muted">
                    <span className="font-medium text-fg">{ACCESS_LABEL[project.access]}.</span>{' '}
                    {project.accessNote}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Work() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('All')
  const [open, setOpen] = useState<Project | null>(null)

  const visible = useMemo(
    () => (filter === 'All' ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  )

  return (
    <section id="work" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
      <SectionHeading
        index="02 / Work"
        title="Selected work."
        kicker="Most of this runs inside an enterprise or government boundary, so there are no demo links to click. What I can show is the architecture, the decisions, and what moved. Open any card for the full story."
      />

      <Reveal className="mb-10">
        <div className="glass inline-flex flex-wrap gap-1 rounded-full p-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cx(
                'relative rounded-full px-4 py-2 text-[13px] transition-colors',
                filter === f ? 'text-bg' : 'text-muted hover:text-fg',
              )}
            >
              {filter === f && (
                <motion.span
                  layoutId="filter-active"
                  className="absolute inset-0 rounded-full bg-fg"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{f}</span>
            </button>
          ))}
        </div>
      </Reveal>

      <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onOpen={() => setOpen(p)} />
          ))}
        </AnimatePresence>
      </motion.div>

      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </section>
  )
}
