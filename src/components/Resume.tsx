import { Award, Download, GraduationCap, Mail, Printer } from 'lucide-react'
import { certifications, education, jobs, profile, skills } from '../data/profile'
import { Reveal, SectionHeading } from './ui'

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line pt-6 print:pt-3.5">
      <h3 className="mb-5 font-mono text-[11px] uppercase tracking-[0.18em] text-muted print:mb-2.5 print:text-[8pt]">
        {title}
      </h3>
      {children}
    </div>
  )
}

/**
 * A print-ready document view of the same data that drives the rest of the
 * site. `window.print()` plus the @media print rules in index.css hide every
 * other section and reset the scroll-reveal state, so "Save as PDF" produces
 * a clean A4 document. The `print:` utilities below tighten the type scale —
 * screen sizes are far too large on paper.
 */
export function Resume() {
  return (
    <section id="resume" className="relative mx-auto max-w-5xl px-5 py-24 sm:px-8 md:py-32">
      <div className="no-print">
        <SectionHeading
          index="04 / Resume"
          title="The one-pager."
          kicker="Same content, document form. Print it or save it as a PDF straight from the browser — it renders as a clean A4 document, not a screenshot of this page."
        />

        <Reveal className="mb-10 flex flex-wrap gap-3">
          <button
            onClick={() => window.print()}
            className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3 text-sm font-medium text-bg transition-transform active:scale-95"
          >
            <Printer className="size-4" />
            Print / Save as PDF
          </button>

          {/* Becomes a real download the moment profile.resumeUrl is filled in. */}
          {profile.resumeUrl ? (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors hover:bg-surface-hi"
            >
              <Download className="size-4" />
              Download CV
            </a>
          ) : (
            <a
              href={`mailto:${profile.email}?subject=Resume%20request`}
              className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors hover:bg-surface-hi"
            >
              <Mail className="size-4" />
              Request the full CV
            </a>
          )}
        </Reveal>
      </div>

      <Reveal>
        <article className="glass rounded-3xl p-7 sm:p-12 print:p-0">
          {/* header */}
          <header className="flex flex-wrap items-start justify-between gap-6 border-b border-line pb-8 print:gap-3 print:pb-4">
            <div>
              <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl print:text-[20pt]">
                {profile.name}{' '}
                <span className="text-muted print:text-[14pt]">({profile.known})</span>
              </h3>
              <p className="mt-1.5 text-lg text-muted print:mt-0.5 print:text-[10.5pt]">{profile.role}</p>
            </div>
            <ul className="space-y-1 text-right font-mono text-[12px] text-muted print:space-y-0 print:text-[8.5pt]">
              <li>{profile.email}</li>
              <li>{profile.location}</li>
              {profile.socials
                .filter((s) => s.label === 'LinkedIn')
                .map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-a3">
                      {s.handle}
                    </a>
                  </li>
                ))}
            </ul>
          </header>

          <div className="mt-8 space-y-8 print:mt-4 print:space-y-3.5">
            <Block title="Profile">
              <p className="text-[15px] leading-relaxed text-muted print:text-[9.5pt] print:leading-[1.45]">
                {profile.bio[0]}
              </p>
            </Block>

            <Block title="Experience">
              <div className="space-y-7 print:space-y-3.5">
                {jobs.map((job) => (
                  <div key={job.company} className="print-keep">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="font-display text-base font-semibold print:text-[10.5pt]">
                        {job.role} <span className="text-muted">· {job.company}</span>
                      </h4>
                      <span className="font-mono text-[11px] text-muted print:text-[8.5pt]">
                        {job.period} · {job.location}
                      </span>
                    </div>
                    <ul className="mt-2.5 space-y-1.5 print:mt-1.5 print:space-y-1">
                      {job.points.map((p) => (
                        <li
                          key={p}
                          className="flex gap-2.5 text-[14px] leading-relaxed text-muted print:gap-2 print:text-[9pt] print:leading-[1.4]"
                        >
                          <span className="mt-2 size-1 shrink-0 rounded-full bg-a2 print:mt-[0.42rem]" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Block>

            <div className="grid gap-8 sm:grid-cols-2 print:gap-4">
              <Block title="Skills">
                <div className="space-y-4 print:space-y-2">
                  {skills.map((g) => (
                    <div key={g.group}>
                      <p className="text-[13px] font-medium print:text-[9pt]">{g.group}</p>
                      <p className="mt-1 text-[14px] leading-relaxed text-muted print:text-[9pt] print:leading-[1.4]">
                        {g.items.map((i) => i.name).join(' · ')}
                      </p>
                    </div>
                  ))}
                </div>
              </Block>

              <Block title="Education">
                {education.map((e) => (
                  <div key={e.school} className="flex gap-3">
                    <GraduationCap className="mt-0.5 size-4 shrink-0 text-a3" />
                    <div>
                      <p className="text-[14px] font-medium print:text-[9.5pt]">{e.degree}</p>
                      <p className="text-[13px] text-muted print:text-[9pt]">
                        {e.school} · {e.period}
                      </p>
                      {e.note && (
                        <p className="mt-1 text-[13px] leading-relaxed text-muted print:text-[9pt]">{e.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </Block>
            </div>

            <Block title="Certifications">
              <ul className="grid gap-2.5 sm:grid-cols-2 print:gap-1.5">
                {certifications.map((c) => (
                  <li key={c.name} className="flex gap-3 text-[14px] print:gap-2 print:text-[9pt]">
                    <Award className="mt-0.5 size-4 shrink-0 text-a2 print:size-3" />
                    <span>
                      {c.name}
                      {c.year && <span className="font-mono text-[12px] text-muted"> — {c.year}</span>}
                      {c.note && <span className="block text-[13px] text-muted">{c.note}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </Block>
          </div>
        </article>
      </Reveal>
    </section>
  )
}
