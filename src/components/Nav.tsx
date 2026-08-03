import { motion, useScroll, useSpring } from 'motion/react'
import { Command, Moon, Sun } from 'lucide-react'
import { profile } from '../data/profile'
import { sections } from '../data/schema'
import { useActiveSection, useTheme } from '../lib/hooks'
import { cx } from './ui'

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 })
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="no-print fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-a1 via-a2 to-a3"
    />
  )
}

export function Nav({ onOpenPalette }: { onOpenPalette: () => void }) {
  const ids = sections.map((s) => s.id)
  const active = useActiveSection(ids)
  const { theme, toggle } = useTheme()

  return (
    <header className="no-print fixed inset-x-0 top-0 z-40">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <a
          href="#home"
          className="group flex items-center gap-2.5 font-display text-sm font-semibold tracking-tight"
        >
          <span className="relative grid size-8 place-items-center rounded-lg bg-gradient-to-br from-a1 to-a3 text-[13px] font-bold text-white shadow-lg shadow-a1/25">
            {profile.initials}
          </span>
          <span className="hidden transition-colors group-hover:text-a3 sm:inline">{profile.handle}</span>
        </a>

        {/* Section pills — the active one gets a shared-layout highlight */}
        <div className="glass hidden items-center gap-1 rounded-full p-1 md:flex">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={cx(
                'relative rounded-full px-3.5 py-1.5 text-[13px] transition-colors',
                active === s.id ? 'text-fg' : 'text-muted hover:text-fg',
              )}
            >
              {active === s.id && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-full bg-surface-hi"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative">{s.label}</span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPalette}
            className="glass flex items-center gap-2 rounded-full py-2 pl-3 pr-2.5 text-[13px] text-muted transition-colors hover:text-fg"
            aria-label="Open command palette"
          >
            <Command className="size-3.5" />
            <span className="hidden font-mono text-[11px] sm:inline">K</span>
          </button>
          <button
            onClick={toggle}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="glass grid size-9 place-items-center rounded-full text-muted transition-colors hover:text-fg"
          >
            <motion.span key={theme} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}>
              {theme === 'dark' ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </motion.span>
          </button>
        </div>
      </nav>
    </header>
  )
}
