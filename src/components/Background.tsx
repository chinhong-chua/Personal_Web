import { useEffect } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'

/**
 * Fixed backdrop: dot grid, two drifting aurora blobs, and a spotlight
 * that follows the cursor. Purely decorative — hidden from AT.
 */
export function Background() {
  const mx = useMotionValue(-500)
  const my = useMotionValue(-500)
  const sx = useSpring(mx, { stiffness: 120, damping: 26, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 120, damping: 26, mass: 0.6 })

  useEffect(() => {
    // Skip the spotlight on touch devices — there's no cursor to follow.
    if (!window.matchMedia('(pointer: fine)').matches) return
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX)
      my.set(e.clientY)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [mx, my])

  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${sx}px ${sy}px, color-mix(in oklab, var(--a1) 22%, transparent), transparent 70%)`

  return (
    <div aria-hidden className="no-print pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* dot grid */}
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--fg) 18%, transparent) 1px, transparent 0)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 90% 60% at 50% 0%, #000 30%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 60% at 50% 0%, #000 30%, transparent 78%)',
        }}
      />

      {/* aurora */}
      <motion.div
        className="absolute -top-40 left-[8%] size-[38rem] rounded-full blur-[120px]"
        style={{ background: 'color-mix(in oklab, var(--a1) 38%, transparent)', opacity: 'var(--glow)' }}
        animate={{ x: [0, 90, -40, 0], y: [0, 60, 30, 0], scale: [1, 1.12, 0.95, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[4%] top-[22%] size-[32rem] rounded-full blur-[130px]"
        style={{ background: 'color-mix(in oklab, var(--a3) 32%, transparent)', opacity: 'var(--glow)' }}
        animate={{ x: [0, -70, 30, 0], y: [0, 50, -30, 0], scale: [1, 0.92, 1.1, 1] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* cursor spotlight */}
      <motion.div className="absolute inset-0 hidden md:block" style={{ background: spotlight }} />
    </div>
  )
}
