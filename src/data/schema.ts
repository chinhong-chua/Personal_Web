/**
 * Shared shape + non-personal constants.
 *
 * This file IS committed. `profile.ts` (the real content) is gitignored —
 * see `profile.example.ts` for the version that ships in the repo. Keeping
 * the types here means a fresh clone still typechecks, and the example and
 * the real file are guaranteed to stay structurally identical.
 */

export type Category = 'Platform & Cloud' | 'Reliability' | 'AI Systems' | 'Government'

/** Controls the badge shown in place of a demo link. */
export type Access = 'public' | 'internal' | 'restricted'

export const ACCESS_LABEL: Record<Access, string> = {
  public: 'Public',
  internal: 'Internal — no public link',
  restricted: 'Restricted — gov. system',
}

export type Social = { label: string; href: string; handle: string }

export type Profile = {
  name: string
  known: string
  initials: string
  handle: string
  /** Two lines of oversized display type in the hero. */
  hero: { line1: string; line2: string }
  role: string
  /** Rotates in the hero. Keep them short. */
  roles: string[]
  location: string
  status: string
  /**
   * Stored split so no literal `user@domain` string exists in any served
   * file — bulk harvesters regex the bundle for that pattern. Joined at
   * runtime into `email`.
   */
  emailUser: string
  emailDomain: string
  email: string
  /** Public link to a hosted CV. Empty string → mailto fallback. */
  resumeUrl: string
  tagline: string
  bio: string[]
  socials: Social[]
}

export type Stat = { value: number; suffix: string; decimals: number; label: string }

export type Project = {
  id: string
  title: string
  tagline: string
  year: string
  role: string
  org: string
  category: Category
  access: Access
  /** Shown on the card + modal to explain why there's no live link. */
  accessNote: string
  stack: string[]
  /** Two hex stops used for the card's generated cover art. */
  cover: [string, string]
  summary: string
  highlights: string[]
  metrics: { label: string; value: string }[]
  links?: { label: string; href: string }[]
  featured?: boolean
}

export type Job = {
  company: string
  role: string
  period: string
  location: string
  blurb: string
  points: string[]
  stack: string[]
}

export type SkillGroup = { group: string; items: { name: string; level: number }[] }
export type Education = { school: string; degree: string; period: string; note: string }
export type Certification = { name: string; year: string; note: string }

/** Nav / command-palette structure. Not personal data, so it lives here. */
export const sections = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'resume', label: 'Resume' },
  { id: 'contact', label: 'Contact' },
] as const

/** Assembles the address at runtime — never a literal in the bundle. */
export function joinEmail(p: Pick<Profile, 'emailUser' | 'emailDomain'>) {
  return [p.emailUser, p.emailDomain].join('@')
}
