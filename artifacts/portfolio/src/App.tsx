import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, ExternalLink, Briefcase, GraduationCap, Award,
  Code, Globe, Download, MapPin, Phone, Sun, Moon,
  Calendar, List, Share2, Github, SkipForward, BadgeCheck,
  FolderGit2, Bot,
} from 'lucide-react'
import {
  SiAngular, SiReact, SiNextdotjs, SiTypescript, SiJavascript,
  SiHtml5, SiSass, SiTailwindcss, SiBootstrap, SiMui,
  SiJquery, SiPhp, SiLaravel, SiWebpack, SiGit, SiGitlab, SiGithub, SiRedux,
} from 'react-icons/si'

const FloatingChat = lazy(() => import('./FloatingChat'))

/* ─────────────────────────────────────────────────────── helpers ── */

function useHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}

/* ─────────────────────────────────────── BeamPill with particles ── */

const HEAL_PARTICLES = [
  { char: '+',  left: '10%', delay: '0s',   dur: '2.8s', size: '24px' },
  { char: '·',  left: '30%', delay: '0.6s', dur: '2.2s', size: '20px' },
  { char: '✦',  left: '55%', delay: '1.2s', dur: '3s',   size: '18px' },
  { char: '0',  left: '75%', delay: '0.3s', dur: '2.5s', size: '22px' },
  { char: '+',  left: '90%', delay: '1.8s', dur: '2.6s', size: '20px' },
  { char: '1',  left: '20%', delay: '2.1s', dur: '2.4s', size: '22px' },
  { char: '·',  left: '65%', delay: '0.9s', dur: '3.2s', size: '18px' },
  { char: '✦',  left: '45%', delay: '1.5s', dur: '2.7s', size: '20px' },
]

function BeamPill({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated()
  return (
    <span className={`relative inline-block pl-0 pr-0 ${hydrated ? 'beam-pill' : ''}`}>
      <span className="relative z-10">{children}</span>
      {hydrated && HEAL_PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute pointer-events-none select-none"
          style={{
            left: p.left,
            bottom: '50%',
            fontSize: p.size,
            color: '#4ade80',
            opacity: 0,
            animation: `heal-float ${p.dur} ease-out ${p.delay} infinite`,
          }}
          aria-hidden="true"
        >
          {p.char}
        </span>
      ))}
    </span>
  )
}

const HERO_STYLES_ID = 'hero-beam-styles'
function useHeroStyles() {
  useEffect(() => {
    if (document.getElementById(HERO_STYLES_ID)) return
    const style = document.createElement('style')
    style.id = HERO_STYLES_ID
    style.textContent = `
      @keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }
      @keyframes heal-float {
        0%   { opacity: 0; transform: translateY(0) scale(0.6); }
        12%  { opacity: 0.25; }
        40%  { opacity: 0.15; }
        100% { opacity: 0; transform: translateY(-65px) scale(0.2); }
      }
      @property --beam-angle {
        syntax: '<angle>';
        inherits: false;
        initial-value: 0deg;
      }
      @keyframes beam-spin {
        0%   { --beam-angle: 0deg; }
        100% { --beam-angle: 360deg; }
      }
      .beam-pill::before {
        content: '';
        position: absolute;
        inset: -2px -12px -2px -12px;
        border-radius: 9999px;
        padding: 2px;
        background: conic-gradient(
          from var(--beam-angle),
          transparent 0%,
          transparent 70%,
          rgba(74, 222, 128, 0.08) 75%,
          rgba(74, 222, 128, 0.25) 80%,
          rgba(74, 222, 128, 0.55) 86%,
          rgba(74, 222, 128, 0.85) 92%,
          #4ade80 96%,
          rgba(74, 222, 128, 0.4) 99%,
          transparent 100%
        );
        -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        animation: beam-spin 2.5s linear infinite;
      }
    `
    document.head.appendChild(style)
  }, [])
}

/* ──────────────────────────────────────────────── typewriter rotation (word-by-word delete) ── */

const GREETING_ROLES = [
  'Front-End Team Lead',
  'Angular Expert',
  'React Developer',
] as const

function useTypewriterRotation(
  roles: readonly string[],
  { typeSpeed = 80, deleteSpeed = 60, pauseAfterType = 2000, pauseAfterDelete = 300 } = {}
) {
  const [roleIndex, setRoleIndex] = useState(0)
  const [displayText, setDisplayText] = useState(roles[0])
  const [isDeleting, setIsDeleting] = useState(false)
  const currentRole = roles[roleIndex]

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    if (!isDeleting && displayText === currentRole) {
      timeout = setTimeout(() => setIsDeleting(true), pauseAfterType)
    } else if (isDeleting && displayText === '') {
      timeout = setTimeout(() => { setRoleIndex(i => (i + 1) % roles.length); setIsDeleting(false) }, pauseAfterDelete)
    } else if (isDeleting) {
      timeout = setTimeout(() => {
        const words = displayText.trimEnd().split(' '); words.pop()
        setDisplayText(words.length > 0 ? words.join(' ') + ' ' : '')
      }, deleteSpeed)
    } else {
      timeout = setTimeout(() => setDisplayText(currentRole.slice(0, displayText.length + 1)), typeSpeed)
    }
    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentRole, roles, typeSpeed, deleteSpeed, pauseAfterType, pauseAfterDelete])

  return { displayText, roleIndex }
}

/* ──────────────────────────────────────────────── story section typewriter ── */

const STORY_SEEN_KEY = 'mb-story-seen'
const STORY_CONTEXT = "8+ years building enterprise apps at scale."
const STORY_REFLECTIONS = ['Without burning out.', '...still shipping daily.']
const STORY_HOOK_LINES = [
  "One day, I led the team. Earned trust.",
  "What drives me goes further.",
  "Building systems that last.",
]
const STORY_SEEKING = [
  "I feel this is just the beginning.",
  "Bigger teams. Harder challenges. End-to-end.",
  "Ready for the next chapter.",
]
const STORY_NAV = [
  { icon: 'briefcase', label: 'My path',      href: '#experience' },
  { icon: 'folder',    label: 'What I build',  href: '#projects' },
  { icon: 'mail',      label: "Let's talk",    href: '#contact', highlight: true },
  { icon: 'bot',       label: 'Ask me',        href: '#chat' },
]

type StoryPhase = 'idle' | 'context' | 'pause-after-context' | 'reflection' | 'pause-before-delete' | 'deleting' | 'hook' | 'complete'

function StorySection() {
  const [phase, setPhase] = useState<StoryPhase>('idle')
  const [displayText, setDisplayText] = useState('')
  const [contextComplete, setContextComplete] = useState(false)
  const [currentReflection, setCurrentReflection] = useState(0)
  const [currentHookLine, setCurrentHookLine] = useState(0)
  const [completedHookLines, setCompletedHookLines] = useState<string[]>([])
  const [animationStarted, setAnimationStarted] = useState(false)
  const [complete, setComplete] = useState(false)
  const [skipped, setSkipped] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const skipToComplete = useCallback(() => {
    abortRef.current?.abort()
    setContextComplete(true)
    setCompletedHookLines(STORY_HOOK_LINES)
    setPhase('complete')
    setComplete(true)
    setSkipped(true)
    try { sessionStorage.setItem(STORY_SEEN_KEY, 'true') } catch {}
  }, [])

  useEffect(() => {
    try { if (sessionStorage.getItem(STORY_SEEN_KEY)) { skipToComplete(); return } } catch {}
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section || complete) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && phase === 'idle') { setPhase('context'); setAnimationStarted(true) }
    }, { threshold: 0.3 })
    io.observe(section)
    return () => io.disconnect()
  }, [phase, complete])

  const getDelay = useCallback((char: string) => {
    let d = 42
    if (/[.,!?;:]/.test(char)) d += 100 + Math.random() * 80
    else if (char === ' ') d += 15 + Math.random() * 20
    return Math.max(22, d + (Math.random() - 0.5) * 15)
  }, [])

  useEffect(() => {
    if (phase === 'idle' || phase === 'complete') return
    abortRef.current = new AbortController()
    const signal = abortRef.current.signal

    if (phase === 'context') {
      if (displayText === STORY_CONTEXT) {
        const t = setTimeout(() => { if (!signal.aborted) { setContextComplete(true); setPhase('pause-after-context') } }, 100)
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => { if (!signal.aborted) setDisplayText(STORY_CONTEXT.slice(0, displayText.length + 1)) }, getDelay(STORY_CONTEXT[displayText.length]))
      return () => clearTimeout(t)
    }
    if (phase === 'pause-after-context') {
      const t = setTimeout(() => { if (!signal.aborted) { setDisplayText(''); setPhase('reflection') } }, 800)
      return () => clearTimeout(t)
    }
    if (phase === 'reflection') {
      const cur = STORY_REFLECTIONS[currentReflection]
      if (displayText === cur) {
        const t = setTimeout(() => { if (!signal.aborted) setPhase('pause-before-delete') }, 600)
        return () => clearTimeout(t)
      }
      const t = setTimeout(() => { if (!signal.aborted) setDisplayText(cur.slice(0, displayText.length + 1)) }, getDelay(cur[displayText.length]))
      return () => clearTimeout(t)
    }
    if (phase === 'pause-before-delete') {
      const t = setTimeout(() => { if (!signal.aborted) setPhase('deleting') }, 400)
      return () => clearTimeout(t)
    }
    if (phase === 'deleting') {
      if (displayText === '') {
        if (currentReflection < STORY_REFLECTIONS.length - 1) { setCurrentReflection(r => r + 1); setPhase('reflection') }
        else { setPhase('hook') }
        return
      }
      const t = setTimeout(() => {
        if (signal.aborted) return
        const words = displayText.trimEnd().split(' '); words.pop()
        setDisplayText(words.length > 0 ? words.join(' ') + ' ' : '')
      }, 80 + Math.random() * 40)
      return () => clearTimeout(t)
    }
    if (phase === 'hook') {
      const line = STORY_HOOK_LINES[currentHookLine]
      if (displayText === line) {
        setCompletedHookLines(prev => { const n = [...prev]; n[currentHookLine] = line; return n })
        if (currentHookLine < STORY_HOOK_LINES.length - 1) {
          const t = setTimeout(() => { if (!signal.aborted) { setCurrentHookLine(l => l + 1); setDisplayText('') } }, 500)
          return () => clearTimeout(t)
        } else {
          const t = setTimeout(() => {
            if (!signal.aborted) { setPhase('complete'); setComplete(true); try { sessionStorage.setItem(STORY_SEEN_KEY, 'true') } catch {} }
          }, 600)
          return () => clearTimeout(t)
        }
      }
      const t = setTimeout(() => { if (!signal.aborted) setDisplayText(line.slice(0, displayText.length + 1)) }, getDelay(line[displayText.length]))
      return () => clearTimeout(t)
    }
  }, [phase, displayText, currentReflection, currentHookLine, getDelay])

  const showCursor = phase !== 'complete' && phase !== 'idle'

  const navScroll = (href: string) => {
    if (href === '#chat') { window.dispatchEvent(new Event('openChat')); return }
    const el = document.querySelector(href); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section ref={sectionRef} id="about" className="relative py-16 md:py-24">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 0%, hsl(var(--background)) 20%, hsl(var(--background)) 80%, transparent 100%)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
      <div className="relative z-10 max-w-5xl mx-auto px-6">
        <div className="relative pb-12">
          <div className="font-display text-lg md:text-2xl leading-relaxed text-center max-w-3xl mx-auto min-h-[7rem] md:min-h-[8rem]">
            {(phase === 'context' || contextComplete) && (
              <span className="md:block md:-mb-1">
                <span className={contextComplete && phase !== 'context' && phase !== 'pause-after-context' ? 'text-foreground/60' : ''}>
                  {phase === 'context' ? displayText : STORY_CONTEXT}
                </span>
                {(phase === 'context' || phase === 'pause-after-context') && showCursor && (
                  <span className="ml-0.5 inline-block text-primary" style={{ animation: 'blink 0.6s step-end infinite' }}>|</span>
                )}
              </span>
            )}
            {' '}
            {(phase === 'reflection' || phase === 'pause-before-delete' || phase === 'deleting') && (
              <p className="mb-1">
                <span className="text-gradient-theme">{displayText}</span>
                {showCursor && <span className="ml-0.5 inline-block text-primary" style={{ animation: 'blink 0.6s step-end infinite' }}>|</span>}
              </p>
            )}
            {(phase === 'hook' || phase === 'complete') && STORY_HOOK_LINES.map((line, idx) => {
              const isCurrent = idx === currentHookLine && phase === 'hook'
              const isDone = completedHookLines[idx] !== undefined
              const text = isDone ? completedHookLines[idx] : (isCurrent ? displayText : '')
              if (!text && !isCurrent) return null
              return (
                <span key={idx} className={idx > 0 ? 'md:block md:-mt-1' : ''}>
                  {idx > 0 && <span className="md:hidden"> </span>}
                  <span className={idx === STORY_HOOK_LINES.length - 1 && phase === 'complete' ? 'text-gradient-theme font-bold' : ''}>{text}</span>
                  {isCurrent && showCursor && <span className="ml-0.5 inline-block text-primary" style={{ animation: 'blink 0.6s step-end infinite' }}>|</span>}
                </span>
              )
            })}
          </div>
          <AnimatePresence>
            {animationStarted && !complete && (
              <motion.button
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                onClick={skipToComplete}
                className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm text-muted-foreground border border-border/50 bg-card backdrop-blur-sm hover:bg-primary/10 hover:border-primary/30 hover:text-foreground transition-colors duration-200"
              >
                <SkipForward className="w-3.5 h-3.5" /> Skip intro
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={complete ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          transition={skipped ? { duration: 0 } : { height: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }, opacity: { duration: 0.4, delay: 0.1 } }}
          style={{ overflow: 'hidden' }}
        >
          <div className="mt-6 text-center max-w-3xl mx-auto">
            {STORY_SEEKING.map((line, i) => (
              <motion.p key={i}
                initial={{ opacity: 0, y: 15 }} animate={complete ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: complete ? 0.3 + i * 0.2 : 0 }}
                className={i === 2 ? 'font-display text-lg md:text-2xl font-bold text-gradient-theme leading-snug' : i === 1 ? 'font-display text-lg md:text-2xl text-muted-foreground leading-snug' : 'font-display text-lg md:text-2xl font-bold text-foreground leading-snug'}
              >{line}</motion.p>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 15 }} animate={complete ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: complete ? 0.9 : 0 }}
            className="flex flex-wrap justify-center gap-3 mt-10 mb-12"
          >
            {STORY_NAV.map(item => {
              const icons: Record<string, React.ReactNode> = {
                briefcase: <Briefcase className="w-4 h-4" />,
                folder: <FolderGit2 className="w-4 h-4" />,
                mail: <Mail className="w-4 h-4" />,
                bot: <Bot className="w-4 h-4" />,
              }
              const isHl = 'highlight' in item && item.highlight
              return (
                <button key={item.href} onClick={() => navScroll(item.href)}
                  className={isHl
                    ? "flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-theme text-white border border-transparent hover:brightness-110 hover:shadow-xl hover:shadow-primary/30 transition-all duration-200 text-sm font-medium shadow-lg shadow-primary/25"
                    : "flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-sm font-medium"
                  }
                >
                  {icons[item.icon]}{item.label}
                </button>
              )
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────── LinkedIn SVG icon ── */

function LinkedInLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
    </svg>
  )
}

/* ───────────────────────────────────── AnimatedSection helper ── */

function useScrollInView(threshold = 0.1) {
  const [el, setEl] = useState<HTMLElement | null>(null)
  const [isInView, setIsInView] = useState(false)
  useEffect(() => {
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.disconnect() } },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [el, threshold])
  return { ref: setEl, isInView }
}

function AnimatedSection({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  const { ref, isInView } = useScrollInView()
  return (
    <motion.div
      ref={ref as React.RefCallback<HTMLDivElement>}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ──────────────────────────────────────────── theme toggle ── */

function useTheme() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return true
    const stored = localStorage.getItem('theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    document.documentElement.classList.toggle('light', !isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])
  const toggleTheme = useCallback(() => setIsDark(d => !d), [])
  return { isDark, toggleTheme }
}

/* ───────────────────────────────────── GridSnakes canvas bg ── */

const GRID = 24, SNAKE_COUNT = 3, SNAKE_LENGTH = 8, TICK_MS = 180
const DIRS: [number, number][] = [[1,0],[-1,0],[0,1],[0,-1]]

function GridSnakes() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return
    const resize = () => { canvas.width = parent.clientWidth; canvas.height = parent.clientHeight }
    resize()
    window.addEventListener('resize', resize)
    type Snake = { trail: [number,number][]; dir: [number,number] }
    const cols = () => Math.floor(canvas.width / GRID)
    const rows = () => Math.floor(canvas.height / GRID)
    const snakes: Snake[] = Array.from({ length: SNAKE_COUNT }, () => ({
      trail: [[Math.floor(Math.random() * 40), Math.floor(Math.random() * 20)]],
      dir: DIRS[Math.floor(Math.random() * 4)],
    }))
    const tick = () => {
      const c = cols(), r = rows()
      for (const snake of snakes) {
        if (Math.random() < 0.3) snake.dir = DIRS[Math.floor(Math.random() * 4)]
        const [hx, hy] = snake.trail[snake.trail.length - 1]
        let nx = hx + snake.dir[0], ny = hy + snake.dir[1]
        if (nx < 0) nx = c-1; if (nx >= c) nx = 0
        if (ny < 0) ny = r-1; if (ny >= r) ny = 0
        snake.trail.push([nx, ny])
        if (snake.trail.length > SNAKE_LENGTH) snake.trail.shift()
      }
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const snake of snakes) {
        for (let i = 0; i < snake.trail.length; i++) {
          const [gx, gy] = snake.trail[i]
          const alpha = ((i+1) / snake.trail.length) * 0.5
          ctx.beginPath()
          ctx.arc(gx*GRID + GRID/2, gy*GRID + GRID/2, 1.5, 0, Math.PI*2)
          ctx.fillStyle = `rgba(0,217,255,${alpha})`
          ctx.fill()
        }
      }
    }
    let interval: ReturnType<typeof setInterval> | null = null
    const start = () => { if (!interval) interval = setInterval(tick, TICK_MS) }
    const stop  = () => { if (interval) { clearInterval(interval); interval = null } }
    const io = new IntersectionObserver(entries => {
      entries[0].isIntersecting && document.visibilityState === 'visible' ? start() : stop()
    }, { threshold: 0 })
    io.observe(canvas)
    const onVis = () => document.visibilityState === 'visible' && canvas.getBoundingClientRect().top < window.innerHeight ? start() : stop()
    document.addEventListener('visibilitychange', onVis)
    return () => { stop(); io.disconnect(); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.6 }} />
}

/* ──────────────────────────────── sidebar TOC w/ progress ── */

const TOC_SECTIONS = [
  { id: 'hero',       label: 'Home' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects',   label: 'Projects' },
  { id: 'sharing',    label: 'Sharing' },
  { id: 'tech',       label: 'Skills & Stack' },
  { id: 'education',  label: 'Education' },
  { id: 'contact',    label: 'Contact' },
]

function HomeToc({ activeId }: { activeId: string }) {
  const [tocOpen, setTocOpen] = useState(false)
  const [visible, setVisible] = useState(false)
  const hydrated = useHydrated()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    setTocOpen(false)
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' })
  }, [])

  const activeIdx = TOC_SECTIONS.findIndex(s => s.id === activeId)
  const progressFrac = activeIdx >= 0 ? activeIdx / (TOC_SECTIONS.length - 1) : 0

  const tocNav = (
    <nav aria-label="Table of contents" className="relative">
      <div className="absolute left-[5.5px] top-[14px] w-px bg-border" style={{ height: 'calc(100% - 28px)' }} />
      <motion.div
        className="absolute left-[5.5px] top-[14px] w-px bg-primary origin-top"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: progressFrac }}
        style={{ height: 'calc(100% - 28px)' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
      <ul className="relative space-y-1">
        {TOC_SECTIONS.map((section, i) => {
          const isActive = activeId === section.id
          const isPast = i <= activeIdx
          return (
            <li key={section.id} className="flex items-center gap-3">
              <motion.span
                className={`relative z-10 w-3 h-3 rounded-full border-2 shrink-0 transition-colors duration-300 ${isActive ? 'border-primary bg-primary' : isPast ? 'border-primary/50 bg-card' : 'border-border bg-card'}`}
                animate={isActive ? { scale: [1,1.3,1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                style={isActive ? { boxShadow: '0 0 8px hsl(var(--primary) / 0.5)' } : {}}
              />
              <button
                onClick={() => scrollTo(section.id)}
                className={`text-left text-[13px] tracking-wide py-1 transition-all duration-300 ${isActive ? 'text-primary font-semibold translate-x-0.5' : isPast ? 'text-foreground/70' : 'text-muted-foreground/60 hover:text-foreground/80'}`}
              >
                {section.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )

  if (!hydrated) return null
  return (
    <AnimatePresence>
      {visible && (
        <>
          <motion.div key="toc-desktop" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.4 }} className="hidden xl:block fixed top-24 left-[max(1rem,calc(50%-44rem))] w-48 z-30">
            {tocNav}
          </motion.div>
          <motion.button key="toc-mobile-btn" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.3 }} onClick={() => setTocOpen(o => !o)} className="xl:hidden fixed bottom-24 left-6 z-40 w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center" aria-label="Toggle table of contents">
            <List className="w-5 h-5" />
          </motion.button>
          {tocOpen && (
            <>
              <div className="xl:hidden fixed inset-0 bg-background/60 backdrop-blur-sm z-40" onClick={() => setTocOpen(false)} />
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="xl:hidden fixed bottom-36 left-6 z-50 w-56 bg-card border border-border rounded-xl shadow-xl p-4">
                {tocNav}
              </motion.div>
            </>
          )}
        </>
      )}
    </AnimatePresence>
  )
}

/* ──────────────────────────────────────────── CV data ── */

const EXPERIENCE = [
  {
    period: 'Oct 2024 – Present', role: 'Front-End Team Lead', company: 'Tasheer | تأشير',
    location: 'Riyadh, Saudi Arabia', current: true,
    desc: "Lead the front-end team across Saudi Arabia's official digital government platforms — managing sprint planning, task estimation, and technical direction.",
    highlights: [
      'Drive code reviews and mentor team members on Angular best practices and scalable UI architecture',
      'Collaborate with backend, UX, and product teams for seamless delivery aligned with business objectives',
      'Responsible for performance optimization, accessibility, and multi-language support',
    ],
    projects: ['Nusuk Platform (Angular)', 'CRS — Central Reservation System (Angular)', 'Conkit Platform (Angular)'],
  },
  {
    period: 'Dec 2022 – Oct 2024', role: 'Front-End Team Lead', company: 'World of Systems & Software',
    location: 'Cairo, Egypt', current: false,
    desc: 'Led the front-end engineering team through full sprint cycles — from planning and estimation to delivery and code review.',
    highlights: [
      'Sprint planning, code reviews, performance standards, and knowledge-sharing sessions',
      'Mentored junior and mid-level developers on Angular patterns, RxJS, and clean code practices',
      'Led large-scale code refactoring to improve maintainability and reduce technical debt',
    ],
    projects: ['Rasd ERP System (Angular)', 'Sah Platform (Angular)'],
  },
  {
    period: 'Dec 2021 – Dec 2022', role: 'Senior Front-End Developer', company: 'World of Systems & Software',
    location: 'Cairo, Egypt', current: false,
    desc: 'Designed and built responsive UIs using Angular, TypeScript, SASS, Bootstrap, and Material UI.',
    highlights: [
      'Developed reusable component libraries with clean, maintainable code',
      'Handled API integration, unit testing, and cross-browser compatibility',
      'Built core ERP front-end modules: inventory management, sales, purchases, and reports',
    ],
    projects: ['Rasd ERP System (Angular)'],
  },
  {
    period: 'Sep 2021 – Dec 2021', role: 'Senior Front-End Developer', company: 'Scaleup Gurus',
    location: 'Cairo, Egypt', current: false,
    desc: 'Led a team of 3 developers in redesigning the Saferoad vehicle tracking platform.',
    highlights: [
      'Led 3-developer team in full platform redesign',
      'Real-time vehicle tracking with Leaflet Map integration',
      'Firebase integration for live data sync and improved performance',
    ],
    projects: ['Saferoad Vehicle Tracking (ReactJS / NextJS / Firebase)'],
  },
  {
    period: 'Sep 2019 – Oct 2021', role: 'Full-Stack Developer', company: 'Etolv Company',
    location: 'Doqi, Egypt', current: false,
    desc: 'Developed responsive web applications from PSD designs and managed front-end delivery across multiple concurrent projects.',
    highlights: [
      'Responsive design from PSD using HTML5, CSS3, JS, jQuery, Bootstrap',
      'Integrated RESTful APIs across tourism, eCommerce, and accounting platforms',
      'Mobile-first apps developed with Flutter for Saudi and Egyptian clients',
    ],
    projects: ['Trio Travel', 'Lapia Shopping (ReactJS)', 'Factory Accounting System', 'Meat Project (Flutter)', 'Aoun Project (Flutter)'],
  },
  {
    period: '2017 – 2019', role: 'Freelance Software Developer', company: 'Self-Employed',
    location: 'Egypt', current: false,
    desc: 'Delivered freelance web projects and developed two C# desktop applications for IT infrastructure management.',
    highlights: [
      'Built web projects using HTML, CSS, JavaScript, and Angular',
      'LAN Network Manager: desktop tool for monitoring/managing local networks via encrypted VPN',
      'Remote PC Controller: desktop app for remote control of computers over local network',
    ],
    projects: ['LAN Network Manager (C#)', 'Remote PC Controller (C#)'],
  },
]

const PROJECTS = [
  { title: 'Nusuk Platform', badge: 'Gov · Hajj & Umrah', featured: true, desc: "Saudi Arabia's official Hajj & Umrah digital platform — developed key front-end features to streamline pilgrim journey management, booking flows, and identity verification.", tech: ['Angular', 'TypeScript', 'SASS', 'RESTful API', 'Multi-language'] },
  { title: 'CRS — Central Reservation System', badge: 'Enterprise · Visa', featured: true, desc: 'Enterprise-level consular and visa management system — led front-end development covering complex form workflows, real-time API integration, and multi-language support.', tech: ['Angular', 'TypeScript', 'Material UI', 'SASS', 'i18n'] },
  { title: 'Rasd ERP System', badge: 'ERP', featured: false, desc: 'Full front-end leadership of a large-scale ERP covering inventory management, sales, purchases, tax billing, and financial reporting.', tech: ['Angular', 'TypeScript', 'Material UI', 'SASS'] },
  { title: 'Conkit Platform', badge: 'Operations', featured: false, desc: 'Internal operations and workflow management platform for Tasheer service centers — built responsive dashboards and administrative interfaces.', tech: ['Angular', 'TypeScript', 'Bootstrap', 'SASS'] },
  { title: 'Saferoad Vehicle Tracking', badge: 'Tracking', featured: false, desc: 'Redesigned vehicle tracking platform with ReactJS and NextJS. Integrated Leaflet Map for real-time geolocation and Firebase for live data sync.', tech: ['ReactJS', 'NextJS', 'Leaflet Map', 'Firebase'] },
  { title: 'Sah Platform', badge: 'Real Estate', featured: false, desc: 'Real estate portal and admin dashboard focused on UX enhancements, performance optimization, and responsive design.', tech: ['Angular', 'TypeScript', 'Bootstrap', 'SASS'] },
  { title: 'Lapia Shopping', badge: 'E-Commerce', featured: false, desc: 'Responsive e-commerce shopping platform with product catalog, cart, and checkout flow.', tech: ['ReactJS', 'CSS3', 'JavaScript'] },
  { title: 'Trio Travel', badge: 'Tourism', featured: false, desc: 'Tourism operations management system with an integrated accounting module for financial tracking.', tech: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'PHP'] },
]

const TECH_GROUPS = [
  {
    label: 'Front-End',
    items: [
      { name: 'Angular',     icon: <SiAngular className="text-red-500" /> },
      { name: 'React',       icon: <SiReact className="text-cyan-400" /> },
      { name: 'Next.js',     icon: <SiNextdotjs className="text-foreground" /> },
      { name: 'TypeScript',  icon: <SiTypescript className="text-blue-500" /> },
      { name: 'JavaScript',  icon: <SiJavascript className="text-yellow-400" /> },
      { name: 'HTML5',       icon: <SiHtml5 className="text-orange-500" /> },
      { name: 'CSS3',        icon: <span className="text-blue-400 font-bold text-[10px] leading-none">CSS</span> },
      { name: 'SASS',        icon: <SiSass className="text-pink-500" /> },
      { name: 'Tailwind',    icon: <SiTailwindcss className="text-cyan-400" /> },
    ],
  },
  {
    label: 'State Management',
    items: [
      { name: 'NgRx',            icon: <SiRedux className="text-purple-500" /> },
      { name: 'RxJS',            icon: <span className="text-pink-500 font-bold text-[10px] leading-none">Rx</span> },
      { name: 'Angular Signals', icon: <SiAngular className="text-red-400" /> },
    ],
  },
  {
    label: 'UI Frameworks',
    items: [
      { name: 'Bootstrap',    icon: <SiBootstrap className="text-purple-600" /> },
      { name: 'Material UI',  icon: <SiMui className="text-blue-500" /> },
      { name: 'jQuery',       icon: <SiJquery className="text-blue-400" /> },
    ],
  },
  {
    label: 'Back-End & Tools',
    items: [
      { name: 'PHP',       icon: <SiPhp className="text-indigo-400" /> },
      { name: 'Laravel',   icon: <SiLaravel className="text-red-500" /> },
      { name: 'Webpack',   icon: <SiWebpack className="text-blue-400" /> },
      { name: 'Git',       icon: <SiGit className="text-orange-600" /> },
      { name: 'GitHub',    icon: <SiGithub className="text-foreground" /> },
      { name: 'GitLab',    icon: <SiGitlab className="text-orange-400" /> },
    ],
  },
]

const SOFT_SKILLS = ['Team Leadership', 'Sprint Planning', 'Code Reviews', 'Mentoring', 'Problem Solving', 'Communication', 'Adaptability', 'Working Under Pressure']

const CERTIFICATIONS = [
  { year: '2019', title: 'Full Stack Development Track', org: 'One Million Arab Coders — Udacity' },
  { year: '2018', title: 'Full Stack (Angular & Laravel)', org: 'Route Academy' },
]

const SHARING_LINKS = [
  {
    platform: 'GitHub', handle: '@MoBekheet',
    url: 'https://github.com/MoBekheet',
    desc: 'Open-source projects and code samples. Explore repositories including this interactive portfolio.',
    icon: 'github', color: 'text-foreground',
    bg: 'bg-muted/50', border: 'border-border hover:border-primary/40',
  },
  {
    platform: 'LinkedIn', handle: 'Mahmoud Bekheet',
    url: 'https://www.linkedin.com/in/mahmoud-bekheet',
    desc: 'Professional network, recommendations, and career updates. Connect for opportunities.',
    icon: 'linkedin', color: 'text-[hsl(var(--linkedin))]',
    bg: 'bg-[hsl(var(--linkedin)/0.05)]',
    border: 'border-[hsl(var(--linkedin)/0.2)] hover:border-[hsl(var(--linkedin)/0.5)]',
  },
]

/* ─────────────────────────────────────────── main App ── */

export default function App() {
  const { isDark, toggleTheme } = useTheme()
  const [activeSection, setActiveSection] = useState('hero')
  const hydrated = useHydrated()
  const { displayText: roleText, roleIndex } = useTypewriterRotation(GREETING_ROLES)
  useHeroStyles()

  useEffect(() => {
    const SECTION_IDS = ['hero', 'experience', 'projects', 'sharing', 'tech', 'education', 'contact']
    const getActive = () => {
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) return 'contact'
      const refY = window.scrollY + window.innerHeight * 0.35
      let best = SECTION_IDS[0], bestDist = Infinity
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top + window.scrollY
        if (top <= refY) { const dist = refY - top; if (dist < bestDist) { bestDist = dist; best = id } }
      }
      return best
    }
    const onScroll = () => setActiveSection(getActive())
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--dot-grid)) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
    >
      {/* Theme toggle */}
      <div className="fixed top-4 right-6 z-50 animate-nav-fade-in">
        <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:border-primary/50 transition-colors" aria-label="Toggle theme">
          {isDark ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-primary" />}
        </button>
      </div>

      <HomeToc activeId={activeSection} />

      {/* ── Hero ── */}
      <header id="hero" className="relative overflow-hidden">
        <GridSnakes />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-accent/4 to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none hidden sm:block" style={{ backgroundColor: 'hsl(var(--hero-orb-primary))', animation: 'hero-glow 8s ease-in-out infinite' }} />
        <div className="absolute bottom-0 left-0 w-[550px] h-[550px] rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none hidden sm:block" style={{ backgroundColor: 'hsl(var(--hero-orb-accent))', animation: 'hero-glow 11s ease-in-out infinite reverse' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 w-full py-20 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col md:flex-row items-center gap-8 md:gap-12"
          >
            {/* Avatar — 3-layer glassmorphism */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="shrink-0"
            >
              <div className="relative w-40 h-40 md:w-48 md:h-48">
                {/* Layer 1: outer glow blur */}
                <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: 'linear-gradient(to bottom right, hsl(var(--gradient-from) / 0.3), hsl(var(--gradient-to) / 0.3))', filter: 'blur(20px)', transform: 'scale(1.1)' }} />
                {/* Layer 2: glassmorphism frame */}
                <div className="absolute inset-0 rounded-full" style={{ background: 'linear-gradient(to bottom right, rgba(255,255,255,0.18), rgba(255,255,255,0.04))', border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', backdropFilter: 'blur(4px)' }} />
                {/* Layer 3: gradient ring + photo */}
                <div className="absolute inset-2 rounded-full p-[2px]" style={{ background: 'linear-gradient(to bottom right, hsl(var(--gradient-from) / 0.5), hsl(var(--gradient-to) / 0.5))' }}>
                  <div className="w-full h-full rounded-full overflow-hidden">
                    <img src="/avatar.png" alt="Mahmoud Bekheet Ibrahim" className="w-full h-full object-cover" />
                  </div>
                </div>
                {/* BadgeCheck badge */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.6, type: 'spring', stiffness: 200 }}
                  className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full flex items-center justify-center shadow-xl border-2 border-background"
                  style={{ background: 'linear-gradient(to bottom right, hsl(var(--gradient-from)), hsl(var(--gradient-to)))' }}
                >
                  <BadgeCheck className="w-6 h-6 text-white" />
                </motion.div>
              </div>
            </motion.div>

            {/* Text */}
            <div className="text-center md:text-left">
              {/* Greeting */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-muted-foreground text-base mb-2"
              >
                Hi, I&apos;m{' '}
                <a href="https://github.com/MoBekheet" target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline">
                  @MoBekheet
                </a>
                ,
              </motion.p>

              {/* Title: typewriter first line (gradient) + 2 static lines */}
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight"
              >
                <span className="text-gradient-theme">{hydrated ? roleText : GREETING_ROLES[0]}</span>
                {hydrated && <span className="inline-block w-[3px] h-[0.85em] bg-primary ml-1 rounded-sm translate-y-[2px]" style={{ animation: 'blink 1s step-end infinite' }} />}
                <br />
                who ships enterprise apps,
                <br />
                with <BeamPill>Angular <span className="opacity-60">·</span> React <span className="opacity-60">·</span> TypeScript</BeamPill>
              </motion.h1>

              {/* Location */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1.5 mb-4"
              >
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                Giza, Egypt · Open to relocation
              </motion.p>

              {/* Role pills — active pill matches current roleIndex */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="flex flex-wrap gap-3 justify-center md:justify-start"
              >
                {(['Team Lead', 'Angular Expert'] as const).map((label, i) => (
                  <span key={label} className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                    hydrated && i === roleIndex
                      ? 'border border-[#20d6ee] bg-[#20d6ee]/15 text-foreground scale-105'
                      : 'border border-[#20d6ee]/30 bg-background/80 text-muted-foreground'
                  }`}>
                    {label}
                  </span>
                ))}
                <a
                  href="https://github.com/MoBekheet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                    hydrated && roleIndex === 2
                      ? 'border border-[#20d6ee] bg-[#20d6ee]/15 text-foreground scale-105'
                      : 'border border-[#20d6ee]/30 bg-background/80 text-muted-foreground'
                  }`}
                >
                  <Github className="w-3.5 h-3.5" />
                  @MoBekheet
                </a>
              </motion.div>

              {/* CTA nav — dot-separator style, mobile-friendly */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.65 }}
                className="flex flex-wrap items-center gap-1 justify-center md:justify-start mb-5 text-sm"
              >
                <span className="text-muted-foreground/40 select-none">·</span>
                <button
                  onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="px-3 py-1.5 rounded-full bg-muted/60 border border-border font-medium hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  My path
                </button>
                <span className="text-muted-foreground/40 select-none">·</span>
                <button
                  onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  className="px-3 py-1.5 rounded-full bg-muted/60 border border-border font-medium hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  What I build
                </button>
                <span className="text-muted-foreground/40 select-none">·</span>
                <a
                  href="mailto:mahmoud.bekheet63@gmail.com"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-theme text-white font-medium hover:brightness-110 hover:shadow-lg hover:shadow-primary/25 transition-all animate-incoming-pulse"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Let&apos;s talk
                </a>
                <span className="text-muted-foreground/40 select-none">·</span>
                <button
                  onClick={() => window.dispatchEvent(new Event('openChat'))}
                  className="px-3 py-1.5 rounded-full bg-muted/60 border border-border font-medium hover:border-primary/50 hover:bg-primary/5 transition-all"
                >
                  Ask me
                </button>
                <span className="text-muted-foreground/40 select-none">·</span>
              </motion.div>

              {/* Socials row */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.75 }}
                className="flex flex-wrap items-center gap-4 justify-center md:justify-start"
              >
                <a href="https://www.linkedin.com/in/mahmoud-bekheet" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <LinkedInLogo className="w-4 h-4" /> LinkedIn
                </a>
                <a href="https://github.com/MoBekheet" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Github className="w-4 h-4" /> GitHub
                </a>
                <a href="tel:+201202206788" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Phone className="w-4 h-4" /> +20 120 220 6788
                </a>
                <a href="#" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <Download className="w-4 h-4" /> CV
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── Story / Intro typewriter ── */}
      <StorySection />

      {/* ── Experience ── */}
      <section id="experience" className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="font-display text-2xl font-semibold mb-10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              Work Experience
            </h2>
          </AnimatedSection>
          <div className="space-y-4">
            {EXPERIENCE.map((job, i) => (
              <AnimatedSection key={i} delay={i * 0.07}>
                <div className={`p-6 rounded-2xl bg-card border transition-colors ${job.current ? 'border-primary/40 bg-primary/5' : 'border-border hover:border-primary/20'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-bold text-foreground">{job.role}</h3>
                        {job.current && (
                          <span className="badge px-2 py-0.5 bg-success/10 text-success flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-dot" />
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-primary font-medium text-sm mt-0.5">{job.company}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />{job.location}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-primary whitespace-nowrap flex items-center gap-1">
                      <Calendar className="w-3 h-3" />{job.period}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{job.desc}</p>
                  <ul className="space-y-1.5 mb-4">
                    {job.highlights.map((h, j) => (
                      <li key={j} className="text-xs text-muted-foreground flex gap-2">
                        <span className="text-primary mt-0.5 shrink-0">›</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {job.projects.map(p => (
                      <span key={p} className="px-2 py-0.5 rounded-md text-xs bg-muted text-muted-foreground">{p}</span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="projects" className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="font-display text-2xl font-semibold mb-10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <ExternalLink className="w-5 h-5 text-accent" />
              </div>
              Projects
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6">
            {PROJECTS.map((project, i) => (
              <AnimatedSection key={i} delay={i * 0.07}>
                <div className={`h-full p-6 rounded-2xl border transition-colors flex flex-col group ${project.featured ? 'bg-gradient-to-br from-accent/5 to-transparent border-accent/30 hover:border-accent/50' : 'bg-card border-border hover:border-primary/30'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display text-lg font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                    <span className={`badge px-2 py-0.5 text-xs whitespace-nowrap ml-2 ${project.featured ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>{project.badge}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{project.desc}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.tech.map(t => (
                      <span key={t} className="px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground">{t}</span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Sharing ── */}
      <section id="sharing" className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="font-display text-2xl font-semibold mb-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Share2 className="w-5 h-5 text-primary" />
              </div>
              Sharing
            </h2>
            <p className="text-sm text-muted-foreground mb-10 max-w-xl">
              Find my work, connect professionally, and follow my journey across platforms.
            </p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 gap-6">
            {SHARING_LINKS.map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className={`flex items-start gap-4 p-6 rounded-2xl border ${item.bg} ${item.border} transition-all hover:-translate-y-0.5 hover:shadow-lg group`}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-card border border-border group-hover:border-primary/30 transition-colors">
                    {item.icon === 'github' ? <Github className={`w-6 h-6 ${item.color}`} /> : <LinkedInLogo className={`w-6 h-6 ${item.color}`} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`font-display font-bold ${item.color}`}>{item.platform}</p>
                      <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-xs text-muted-foreground font-mono mb-2">{item.handle}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Skills & Stack ── */}
      <section id="tech" className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="font-display text-2xl font-semibold mb-10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Code className="w-5 h-5 text-primary" />
              </div>
              Skills &amp; Stack
            </h2>
          </AnimatedSection>

          {/* Tech groups with brand icons */}
          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {TECH_GROUPS.map((group, gi) => (
              <AnimatedSection key={group.label} delay={0.05 + gi * 0.07}>
                <div className="p-5 rounded-xl bg-card border border-border h-full">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">{group.label}</span>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {group.items.map(item => (
                      <span key={item.name} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs bg-muted text-foreground hover:bg-muted/80 transition-colors">
                        <span className="text-base leading-none">{item.icon}</span>
                        {item.name}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Languages + Soft Skills */}
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatedSection delay={0.1}>
              <div className="p-5 rounded-xl bg-card border border-border">
                <h3 className="font-display font-semibold mb-4 flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-primary" />
                  Languages
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Arabic</span>
                    <span className="text-sm text-primary font-medium">Native</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">English</span>
                    <span className="text-sm text-muted-foreground">Good</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <div className="p-5 rounded-xl bg-card border border-border">
                <h3 className="font-display font-semibold mb-4 text-sm">Soft Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {SOFT_SKILLS.map(skill => (
                    <span key={skill} className="px-3 py-1 rounded-full text-xs bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Education & Certs ── */}
      <section id="education" className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <AnimatedSection>
                <h2 className="font-display text-2xl font-semibold mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 text-primary" />
                  </div>
                  Education
                </h2>
              </AnimatedSection>
              <AnimatedSection delay={0.1}>
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <span className="text-xs font-mono text-primary">2014 – 2018</span>
                  <h3 className="font-display font-bold text-foreground mt-1">Bachelor of Information Systems</h3>
                  <p className="text-sm text-muted-foreground mt-1">Academy of the Pharaohs · Egypt</p>
                  <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-xs text-muted-foreground">
                      Graduation Project: <span className="text-foreground font-medium">eCommerce Website</span> — <span className="text-primary font-medium">Excellent</span>
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            </div>
            <div>
              <AnimatedSection>
                <h2 className="font-display text-2xl font-semibold mb-8 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Award className="w-5 h-5 text-accent" />
                  </div>
                  Certifications
                </h2>
              </AnimatedSection>
              <div className="space-y-1 rounded-xl overflow-hidden border border-border">
                {CERTIFICATIONS.map((cert, i) => (
                  <AnimatedSection key={i} delay={0.1 + i * 0.07}>
                    <div className={`flex items-center gap-4 p-4 ${i % 2 === 1 ? 'bg-muted/40' : 'bg-card'}`}>
                      <span className="text-sm font-mono text-accent font-medium">{cert.year}</span>
                      <div>
                        <p className="font-medium text-foreground text-sm">{cert.title}</p>
                        <p className="text-xs text-muted-foreground">{cert.org}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact Footer ── */}
      <footer id="contact" className="relative py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent 0%, hsl(var(--background)) 25%, hsl(var(--background)) 75%, transparent 100%)' }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Let&apos;s build something great</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Open to front-end team lead and senior roles. Always happy to discuss interesting projects or opportunities.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="mailto:mahmoud.bekheet63@gmail.com" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:brightness-110 hover:shadow-lg hover:shadow-primary/25 active:brightness-95 transition-all">
                <Mail className="w-4 h-4" />mahmoud.bekheet63@gmail.com
              </a>
              <a href="https://www.linkedin.com/in/mahmoud-bekheet" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-primary/50 transition-colors hover:bg-primary/5">
                <LinkedInLogo className="w-4 h-4" />LinkedIn<ExternalLink className="w-3 h-3" />
              </a>
              <a href="https://github.com/MoBekheet" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-primary/50 transition-colors hover:bg-primary/5">
                <Github className="w-4 h-4" />GitHub<ExternalLink className="w-3 h-3" />
              </a>
              <a href="tel:+201202206788" className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-primary/50 transition-colors hover:bg-primary/5">
                <Phone className="w-4 h-4" />+20 120 220 6788
              </a>
            </div>
          </AnimatedSection>
          <p className="mt-12 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Mahmoud Bekheet Ibrahim · Giza, Egypt
          </p>
        </div>
      </footer>

      <Suspense fallback={null}>
        <FloatingChat />
      </Suspense>
    </div>
  )
}
