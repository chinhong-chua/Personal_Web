import { useCallback, useEffect, useRef, useState } from 'react'
import { animate, useMotionValue, useSpring, useTransform } from 'motion/react'

/** Class-based light/dark toggle, persisted to localStorage. */
export function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  )

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* private mode */
    }
  }, [theme])

  const toggle = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])
  return { theme, toggle }
}

/** Tracks which section owns the viewport, for nav highlighting. */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState(ids[0])

  useEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el))
    if (!els.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    )

    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}

/** Pointer-driven 3D tilt. Spread `handlers` on the element, apply `style`. */
export function useTilt(max = 8) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 24, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 260, damping: 24, mass: 0.4 })

  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max])
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max])
  // Normalised pointer position (0–100%) for the card's local sheen.
  const glareX = useTransform(sx, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(sy, [-0.5, 0.5], ['0%', '100%'])

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect()
      x.set((e.clientX - r.left) / r.width - 0.5)
      y.set((e.clientY - r.top) / r.height - 0.5)
    },
    [x, y],
  )

  const onPointerLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return { rotateX, rotateY, glareX, glareY, onPointerMove, onPointerLeave }
}

/** Buttons that lean toward the cursor. */
export function useMagnetic(strength = 0.32) {
  const x = useSpring(0, { stiffness: 200, damping: 15 })
  const y = useSpring(0, { stiffness: 200, damping: 15 })

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const r = e.currentTarget.getBoundingClientRect()
      x.set((e.clientX - (r.left + r.width / 2)) * strength)
      y.set((e.clientY - (r.top + r.height / 2)) * strength)
    },
    [x, y, strength],
  )

  const onPointerLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return { x, y, onPointerMove, onPointerLeave }
}

/** Counts up once the element scrolls into view. */
export function useCountUp(target: number, inView: boolean, decimals = 0) {
  const [display, setDisplay] = useState('0')
  const started = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    })
    return () => controls.stop()
  }, [inView, target, decimals])

  return display
}

/** Fires once when the ref'd element first enters the viewport. */
export function useInView<T extends HTMLElement>(threshold = 0.3) {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

/** Locks body scroll while an overlay is open. */
export function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [locked])
}
