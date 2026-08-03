import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Check, Copy, Eye, Loader2, Send } from 'lucide-react'
import { profile } from '../data/profile'
import { Magnetic, Reveal, SectionHeading } from './ui'

type Status = 'idle' | 'sending' | 'sent'

export function Contact() {
  const [status, setStatus] = useState<Status>('idle')
  const [copied, setCopied] = useState(false)
  const [revealed, setRevealed] = useState(false)

  // Prototype only — no backend. Swap for your form endpoint (Formspree,
  // Resend, a route handler…) and keep the same status transitions.
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setTimeout(() => setStatus('sent'), 1100)
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked */
    }
  }

  const field =
    'w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-a3/60 focus:bg-surface-hi'

  return (
    <section id="contact" className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 md:py-32">
      <SectionHeading
        index="05 / Contact"
        title="Get in touch."
        kicker="Always happy to talk platform architecture, reliability practice, or agentic engineering systems. Email gets the fastest reply."
      />

      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Reveal>
            {/* Click-to-reveal: the address isn't rendered until a human asks
                for it, and it's assembled at runtime so no literal
                user@domain string exists in the served bundle. */}
            <button
              onClick={revealed ? copyEmail : () => setRevealed(true)}
              aria-label={revealed ? 'Copy email address' : 'Reveal email address'}
              className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-line bg-surface p-5 text-left transition-colors hover:bg-surface-hi"
            >
              <div className="min-w-0">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Email</p>
                <div className="mt-1 h-7 overflow-hidden">
                  <AnimatePresence mode="wait" initial={false}>
                    {revealed ? (
                      <motion.p
                        key="addr"
                        initial={{ y: '100%', opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="truncate font-display text-lg font-medium"
                      >
                        {profile.email}
                      </motion.p>
                    ) : (
                      <motion.p
                        key="hidden"
                        exit={{ y: '-100%', opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="font-display text-lg font-medium text-muted"
                      >
                        Click to reveal
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors group-hover:text-a3">
                <AnimatePresence mode="wait" initial={false}>
                  {!revealed ? (
                    <motion.span key="eye" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                      <Eye className="size-4" />
                    </motion.span>
                  ) : copied ? (
                    <motion.span key="ok" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                      <Check className="size-4 text-a3" />
                    </motion.span>
                  ) : (
                    <motion.span key="copy" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                      <Copy className="size-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </button>
          </Reveal>

          <div className="mt-4 space-y-2">
            {profile.socials
              .filter((s) => s.label !== 'Email')
              .map((s: { label: string; href: string; handle: string }, i: number) => (
                <Reveal key={s.label} delay={0.06 * i}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between rounded-xl border border-line px-5 py-4 transition-colors hover:border-transparent hover:bg-surface-hi"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-display font-medium">{s.label}</span>
                      <span className="font-mono text-[12px] text-muted">{s.handle}</span>
                    </span>
                    <ArrowUpRight className="size-4 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-a3" />
                  </a>
                </Reveal>
              ))}
          </div>
        </div>

        <Reveal delay={0.1} className="lg:col-span-7">
          <form onSubmit={submit} className="glass rounded-2xl p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                  Name
                </span>
                <input required placeholder="Ada Lovelace" className={field} />
              </label>
              <label className="block">
                <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                  Email
                </span>
                <input required type="email" placeholder="ada@company.com" className={field} />
              </label>
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
                What are you building?
              </span>
              <textarea required rows={5} placeholder="A role, a platform problem, a rough idea…" className={field} />
            </label>

            <div className="mt-6 flex items-center gap-4">
              <Magnetic>
                <button
                  type="submit"
                  disabled={status !== 'idle'}
                  className="inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-medium text-bg transition-transform active:scale-95 disabled:opacity-60"
                >
                  {status === 'sending' && <Loader2 className="size-4 animate-spin" />}
                  {status === 'sent' && <Check className="size-4" />}
                  {status === 'idle' && <Send className="size-4" />}
                  {status === 'idle' ? 'Send message' : status === 'sending' ? 'Sending…' : 'Message sent'}
                </button>
              </Magnetic>

              <AnimatePresence>
                {status === 'sent' && (
                  <motion.p
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[13px] text-muted"
                  >
                    Prototype form — wire it to your endpoint.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="no-print border-t border-line">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-8 sm:px-8">
        <p className="font-mono text-[12px] text-muted">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p className="font-mono text-[12px] text-muted">
          React 19 · Tailwind v4 · Motion — press{' '}
          <kbd className="rounded border border-line px-1.5 py-0.5">⌘K</kbd>
        </p>
      </div>
    </footer>
  )
}
