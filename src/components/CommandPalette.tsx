import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, CornerDownLeft, Download, Mail, Moon, Search, Sun } from 'lucide-react'
import { profile } from '../data/profile'
import { sections } from '../data/schema'
import { useScrollLock, useTheme } from '../lib/hooks'
import { cx } from './ui'

type Item = { id: string; label: string; hint: string; icon: React.ReactNode; run: () => void }

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const { theme, toggle } = useTheme()
  useScrollLock(open)

  const items = useMemo<Item[]>(() => {
    const go = (id: string) => () => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      onClose()
    }
    return [
      ...sections.map((s) => ({
        id: `go-${s.id}`,
        label: `Go to ${s.label}`,
        hint: 'Navigate',
        icon: <ArrowRight className="size-4" />,
        run: go(s.id),
      })),
      {
        id: 'theme',
        label: theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme',
        hint: 'Appearance',
        icon: theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />,
        run: () => {
          toggle()
          onClose()
        },
      },
      {
        id: 'print',
        label: 'Print / save resume as PDF',
        hint: 'Action',
        icon: <Download className="size-4" />,
        run: () => {
          onClose()
          setTimeout(() => window.print(), 200)
        },
      },
      {
        id: 'email',
        label: 'Email me',
        hint: 'Action',
        icon: <Mail className="size-4" />,
        run: () => {
          window.location.href = `mailto:${profile.email}`
          onClose()
        },
      },
    ]
  }, [onClose, theme, toggle])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((i) => i.label.toLowerCase().includes(q) || i.hint.toLowerCase().includes(q))
  }, [items, query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setCursor(0)
      // Wait for the enter animation before stealing focus.
      const t = setTimeout(() => inputRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => setCursor(0), [query])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => (c + 1) % Math.max(results.length, 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => (c - 1 + results.length) % Math.max(results.length, 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      results[cursor]?.run()
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="no-print fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            onKeyDown={onKeyDown}
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="glass relative w-full max-w-lg overflow-hidden rounded-2xl bg-elev/90 shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="size-4 shrink-0 text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to a section, toggle theme, print resume…"
                className="w-full bg-transparent py-4 text-sm outline-none placeholder:text-muted"
              />
              <kbd className="hidden shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted sm:block">
                ESC
              </kbd>
            </div>

            <ul className="max-h-80 overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-3 py-8 text-center text-sm text-muted">No matches for “{query}”</li>
              )}
              {results.map((item, i) => (
                <li key={item.id}>
                  <button
                    onMouseEnter={() => setCursor(i)}
                    onClick={item.run}
                    className={cx(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                      i === cursor ? 'bg-surface-hi text-fg' : 'text-muted',
                    )}
                  >
                    <span className={cx(i === cursor ? 'text-a3' : 'text-muted')}>{item.icon}</span>
                    <span className="flex-1 truncate">{item.label}</span>
                    <span className="font-mono text-[10px] uppercase tracking-wider opacity-60">{item.hint}</span>
                    {i === cursor && <CornerDownLeft className="size-3.5 text-a3" />}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
