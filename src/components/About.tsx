import { motion } from 'motion/react'
import { profile, skills, toolbelt } from '../data/profile'
import { Reveal, SectionHeading } from './ui'
import { useInView } from '../lib/hooks'

function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const { ref, inView } = useInView<HTMLDivElement>(0.4)
  return (
    <div ref={ref} className="group">
      <div className="flex items-baseline justify-between text-sm">
        <span className="transition-colors group-hover:text-a3">{name}</span>
        <span className="font-mono text-[11px] tabular-nums text-muted">{level}</span>
      </div>
      <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-surface-hi">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-a1 via-a2 to-a3"
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : {}}
          transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  )
}

/** Infinite tool marquee — duplicated once so the loop is seamless. */
function Toolbelt() {
  const row = [...toolbelt, ...toolbelt]
  return (
    <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <div className="animate-marquee flex w-max gap-3">
        {row.map((tool, i) => (
          <span
            key={i}
            className="glass whitespace-nowrap rounded-full px-4 py-2 font-mono text-[12px] text-muted"
          >
            {tool}
          </span>
        ))}
      </div>
    </div>
  )
}

export function About() {
  return (
    <section id="about" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
      <SectionHeading index="01 / About" title="Platforms, not features." />

      <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          {profile.bio.map((para, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className="mb-6 text-lg leading-[1.75] text-muted first:text-fg sm:text-xl">{para}</p>
            </Reveal>
          ))}

          <Reveal delay={0.24} className="mt-10">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Currently using</p>
            <Toolbelt />
          </Reveal>
        </div>

        <div className="space-y-10 lg:col-span-5">
          {skills.map((group, gi) => (
            <Reveal key={group.group} delay={0.1 + gi * 0.1}>
              <div className="glass rounded-2xl p-6">
                <h3 className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
                  {group.group}
                </h3>
                <div className="space-y-5">
                  {group.items.map((s, i) => (
                    <SkillBar key={s.name} {...s} delay={i * 0.08} />
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
