// Minimal, dependency-free ANSI SGR -> HTML converter for the log viewer.
// Handles reset/bold/dim/italic/underline, the 16 standard + bright colors,
// xterm-256 (38;5;n / 48;5;n) and truecolor (38;2;r;g;b). Text is HTML-escaped
// first so log content (and emoji / unicode) renders safely and correctly.

const STD = [
  '#000000', '#cc0000', '#4e9a06', '#c4a000',
  '#3465a4', '#75507b', '#06989a', '#d3d7cf'
]
const BRIGHT = [
  '#555753', '#ef2929', '#8ae234', '#fce94f',
  '#729fcf', '#ad7fa8', '#34e2e2', '#eeeeec'
]

const escapeHtml = (s) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

// xterm-256 palette index -> hex
function color256(n) {
  if (n < 8) return STD[n]
  if (n < 16) return BRIGHT[n - 8]
  if (n >= 232) {
    const v = 8 + (n - 232) * 10
    return rgb(v, v, v)
  }
  const i = n - 16
  const steps = [0, 95, 135, 175, 215, 255]
  const r = steps[Math.floor(i / 36) % 6]
  const g = steps[Math.floor(i / 6) % 6]
  const b = steps[i % 6]
  return rgb(r, g, b)
}

const rgb = (r, g, b) => `#${[r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')}`

function freshState() {
  return { fg: null, bg: null, bold: false, dim: false, italic: false, underline: false }
}

function applyCodes(state, codes) {
  let i = 0
  while (i < codes.length) {
    const c = codes[i]
    if (c === 0 || Number.isNaN(c)) Object.assign(state, freshState())
    else if (c === 1) state.bold = true
    else if (c === 2) state.dim = true
    else if (c === 3) state.italic = true
    else if (c === 4) state.underline = true
    else if (c === 22) { state.bold = false; state.dim = false }
    else if (c === 23) state.italic = false
    else if (c === 24) state.underline = false
    else if (c >= 30 && c <= 37) state.fg = STD[c - 30]
    else if (c >= 90 && c <= 97) state.fg = BRIGHT[c - 90]
    else if (c >= 40 && c <= 47) state.bg = STD[c - 40]
    else if (c >= 100 && c <= 107) state.bg = BRIGHT[c - 100]
    else if (c === 39) state.fg = null
    else if (c === 49) state.bg = null
    else if (c === 38 || c === 48) {
      const isFg = c === 38
      const mode = codes[i + 1]
      if (mode === 5) {
        const col = color256(codes[i + 2])
        if (isFg) state.fg = col
        else state.bg = col
        i += 2
      } else if (mode === 2) {
        const col = rgb(codes[i + 2] || 0, codes[i + 3] || 0, codes[i + 4] || 0)
        if (isFg) state.fg = col
        else state.bg = col
        i += 4
      }
    }
    i += 1
  }
}

function styleFor(state) {
  const css = []
  if (state.fg) css.push(`color:${state.fg}`)
  if (state.bg) css.push(`background-color:${state.bg}`)
  if (state.bold) css.push('font-weight:600')
  if (state.dim) css.push('opacity:0.7')
  if (state.italic) css.push('font-style:italic')
  if (state.underline) css.push('text-decoration:underline')
  return css.join(';')
}

// Convert a single log line (which may contain ANSI escapes) to safe HTML.
export function ansiToHtml(input) {
  if (input === null || input === undefined) return ''
  const text = String(input)
  // eslint-disable-next-line no-control-regex
  const ansiRe = /\[([0-9;]*)m/g
  let html = ''
  let last = 0
  const state = freshState()

  const emit = (chunk) => {
    if (!chunk) return
    const style = styleFor(state)
    const safe = escapeHtml(chunk)
    html += style ? `<span style="${style}">${safe}</span>` : safe
  }

  let m
  while ((m = ansiRe.exec(text)) !== null) {
    emit(text.slice(last, m.index))
    const codes = m[1] === '' ? [0] : m[1].split(';').map((n) => parseInt(n, 10))
    applyCodes(state, codes)
    last = ansiRe.lastIndex
  }
  emit(text.slice(last))
  return html
}

// Strip ANSI escapes (used for plain-text search matching).
export function stripAnsi(input) {
  if (input === null || input === undefined) return ''
  // eslint-disable-next-line no-control-regex
  return String(input).replace(/\[[0-9;]*m/g, '')
}
