#!/usr/bin/env node
/**
 * Keeps the PROFILE_TS_B64 repo secret in sync with the local, gitignored
 * src/data/profile.ts.
 *
 * The deploy workflow builds from that secret, so editing profile.ts without
 * re-uploading it means CI silently keeps publishing the previous content.
 *
 * Secrets are write-only — you cannot read one back to compare. So alongside
 * the secret we publish the file's sha256 as a repo *variable*, which is
 * readable. That fingerprint is what this script diffs against, and what CI
 * checks after decoding, so a stale secret fails loudly instead of shipping
 * old content.
 *
 * Usage:  npm run sync:secret          (also runs from .githooks/pre-push)
 */

import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const FILE = 'src/data/profile.ts'
const SECRET = 'PROFILE_TS_B64'
const VARIABLE = 'PROFILE_TS_SHA256'

const run = (args, opts = {}) =>
  execFileSync('gh', args, { encoding: 'utf8', ...opts }).trim()

function main() {
  if (!existsSync(FILE)) {
    console.error(`✗ ${FILE} not found.`)
    console.error('  It is gitignored, so a fresh clone will not have it.')
    return 1
  }

  const contents = readFileSync(FILE)
  if (contents.length === 0) {
    console.error(`✗ ${FILE} is empty — refusing to overwrite the secret with nothing.`)
    return 1
  }

  let repo
  try {
    repo = run(['repo', 'view', '--json', 'nameWithOwner', '-q', '.nameWithOwner'])
  } catch {
    console.error('✗ Could not resolve the repo. Is `gh` authenticated and a remote set?')
    return 1
  }

  const sha = createHash('sha256').update(contents).digest('hex')

  // Missing variable (first run) is not an error — treat it as "out of sync".
  // stderr is discarded so gh's "not found" notice doesn't look like a failure.
  let published = ''
  try {
    published = run(['variable', 'get', VARIABLE, '--repo', repo], {
      stdio: ['pipe', 'pipe', 'ignore'],
    })
  } catch {
    published = ''
  }

  if (published === sha) {
    console.log(`✓ ${SECRET} is already current — ${FILE} @ ${sha.slice(0, 12)}`)
    return 0
  }

  run(['secret', 'set', SECRET, '--repo', repo], {
    input: contents.toString('base64'),
  })
  run(['variable', 'set', VARIABLE, '--repo', repo, '--body', sha])

  const what = published ? `${published.slice(0, 12)} → ${sha.slice(0, 12)}` : sha.slice(0, 12)
  console.log(`✓ Uploaded ${SECRET} (${contents.length} bytes) — ${what}`)
  return 0
}

process.exit(main())
