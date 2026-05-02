import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, ExternalLink, Briefcase, GraduationCap, Award,
  Code, Globe, Download, MapPin, Phone, Sun, Moon,
  Users, Calendar, List, Share2, Github
} from 'lucide-react'

const FloatingChat = lazy(() => import('./FloatingChat'))

function useHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}

const HEAL_PARTICLES = [
  { char: '+',  left: '10%', delay: '0s',   dur: '2.8s', size: '15px' },
  { char: '·',  left: '30%', delay: '0.6s', dur: '2.2s', size: '13px' },
  { char: '✦',  left: '55%', delay: '1.2s', dur: '3s',   size: '12px' },
  { char: '0',  left: '75%', delay: '0.3s', dur: '2.5s', size: '14px' },
  { char: '+',  left: '90%', delay: '1.8s', dur: '2.6s', size: '13px' },
  { char: '1',  left: '20%', delay: '2.1s', dur: '2.4s', size: '14px' },
  { char: '·',  left: '65%', delay: '0.9s', dur: '3.2s', size: '12px' },
  { char: '✦',  left: '45%', delay: '1.5s', dur: '2.7s', size: '13px' },
]

function BeamPill({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const hydrated = useHydrated()
  return (
    <span className={`beam-pill badge px-3 py-1 bg-primary/10 text-primary border border-primary/20 mb-6 ${className}`}>
      {children}
      {hydrated && HEAL_PARTICLES.map((p, i) => (
        <span
          key={i}
          className="heal-particle"
          style={{
            left: p.left,
            fontSize: p.size,
            '--heal-delay': p.delay,
            '--heal-dur': p.dur,
          } as React.CSSProperties}
          aria-hidden="true"
        >
          {p.char}
        </span>
      ))}
    </span>
  )
}

const TYPING_WORDS = [
  'Front-End Team Lead',
  'Angular Expert',
  'React Developer',
  'TypeScript Engineer',
  'Sprint Planner',
]

function useTypingCycle(words: string[] = TYPING_WORDS, typeSpeed = 80, deleteSpeed = 40, pauseMs = 1800) {
  const [displayed, setDisplayed] = useState('')
  const [wordIdx, setWordIdx] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => setCursorVisible(v => !v), 530)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const current = words[wordIdx % words.length]
    let timeout: ReturnType<typeof setTimeout>

    if (!isDeleting && displayed === current) {
      timeout = setTimeout(() => setIsDeleting(true), pauseMs)
    } else if (isDeleting && displayed === '') {
      setIsDeleting(false)
      setWordIdx(i => (i + 1) % words.length)
    } else {
      timeout = setTimeout(() => {
        setDisplayed(isDeleting
          ? current.slice(0, displayed.length - 1)
          : current.slice(0, displayed.length + 1)
        )
      }, isDeleting ? deleteSpeed : typeSpeed)
    }

    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, wordIdx, words, typeSpeed, deleteSpeed, pauseMs])

  return { displayed, cursorVisible }
}

function TypewriterText({ className = '' }: { className?: string }) {
  const { displayed, cursorVisible } = useTypingCycle()
  return (
    <span className={`font-mono ${className}`}>
      {displayed}
      <span
        className="text-primary ml-0.5"
        style={{ opacity: cursorVisible ? 1 : 0, transition: 'opacity 0.1s' }}
      >|</span>
    </span>
  )
}

function LinkedInLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
    </svg>
  )
}

function useInView(threshold = 0.1) {
  const [el, setEl] = useState<HTMLElement | null>(null)
  const [isInView, setIsInView] = useState(false)
  useEffect(() => {
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsInView(true); observer.disconnect() }
    }, { threshold })
    observer.observe(el)
    return () => observer.disconnect()
  }, [el, threshold])
  return { ref: setEl, isInView }
}

function AnimatedSection({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  const { ref, isInView } = useInView()
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

const EXPERIENCE = [
  {
    period: 'Oct 2024 – Present',
    role: 'Front-End Team Lead',
    company: 'Tasheer | تأشير',
    location: 'Riyadh, Saudi Arabia',
    current: true,
    desc: 'Lead the front-end team across multiple digital government platforms — managing sprint planning, task estimation, and technical direction for Saudi Arabia\'s official digital services.',
    highlights: [
      'Drive code reviews and mentor team members on Angular best practices and scalable UI architecture',
      'Collaborate with backend, UX, and product teams for seamless delivery aligned with business objectives',
      'Responsible for performance optimization, accessibility, and multi-language support across all products',
    ],
    projects: ['Nusuk Platform (Angular)', 'CRS — Central Reservation System (Angular)', 'Conkit Platform (Angular)'],
  },
  {
    period: 'Dec 2022 – Oct 2024',
    role: 'Front-End Team Lead',
    company: 'World of Systems & Software',
    location: 'Cairo, Egypt',
    current: false,
    desc: 'Led the front-end engineering team through full sprint cycles — from planning and estimation to delivery and code review — across enterprise ERP systems and large-scale SaaS products.',
    highlights: [
      'Sprint planning, code reviews, performance standards, and knowledge-sharing sessions',
      'Mentored junior and mid-level developers on Angular patterns, RxJS, and clean code practices',
      'Led large-scale code refactoring to improve maintainability and reduce technical debt',
    ],
    projects: ['Rasd ERP System (Angular)', 'Sah Platform (Angular)'],
  },
  {
    period: 'Dec 2021 – Dec 2022',
    role: 'Senior Front-End Developer',
    company: 'World of Systems & Software',
    location: 'Cairo, Egypt',
    current: false,
    desc: 'Designed and built responsive UIs using Angular, TypeScript, SASS, Bootstrap, and Material UI. Developed reusable component libraries and maintained a modular, scalable codebase.',
    highlights: [
      'Developed reusable component libraries with clean, maintainable code',
      'Handled API integration, unit testing, and cross-browser compatibility',
      'Built core ERP front-end modules: inventory management, sales, purchases, and reports',
    ],
    projects: ['Rasd ERP System (Angular)'],
  },
  {
    period: 'Sep 2021 – Dec 2021',
    role: 'Senior Front-End Developer',
    company: 'Scaleup Gurus',
    location: 'Cairo, Egypt',
    current: false,
    desc: 'Led a team of 3 developers in redesigning the Saferoad vehicle tracking platform using ReactJS, NextJS, Leaflet Map, and Firebase.',
    highlights: [
      'Led 3-developer team in full platform redesign',
      'Real-time vehicle tracking with Leaflet Map integration',
      'Firebase integration for live data sync and improved performance',
    ],
    projects: ['Saferoad Vehicle Tracking (ReactJS / NextJS / Firebase)'],
  },
  {
    period: 'Sep 2019 – Oct 2021',
    role: 'Full-Stack Developer',
    company: 'Etolv Company',
    location: 'Doqi, Egypt',
    current: false,
    desc: 'Developed responsive web applications from PSD designs and managed front-end delivery across multiple concurrent projects in tourism, eCommerce, and finance domains.',
    highlights: [
      'Responsive design from PSD using HTML5, CSS3, JS, jQuery, Bootstrap',
      'Integrated RESTful APIs across tourism, eCommerce, and accounting platforms',
      'Mobile-first apps developed with Flutter for Saudi and Egyptian clients',
    ],
    projects: ['Trio Travel', 'Lapia Shopping (ReactJS)', 'Factory Accounting System', 'Meat Project (Flutter)', 'Aoun Project (Flutter)'],
  },
  {
    period: '2017 – 2019',
    role: 'Freelance Software Developer',
    company: 'Self-Employed',
    location: 'Egypt',
    current: false,
    desc: 'Delivered freelance web projects and developed two desktop applications in C# for IT infrastructure management for various clients.',
    highlights: [
      'Built web projects using HTML, CSS, JavaScript, and Angular',
      'LAN Network Manager: desktop tool for monitoring/managing local networks via encrypted VPN',
      'Remote PC Controller: desktop app for remote control of computers over local network',
    ],
    projects: ['LAN Network Manager (C#)', 'Remote PC Controller (C#)'],
  },
]

const PROJECTS = [
  {
    title: 'Nusuk Platform',
    badge: 'Gov · Hajj & Umrah',
    badgeCurrent: true,
    desc: "Saudi Arabia's official Hajj & Umrah digital platform — developed key front-end features to streamline pilgrim journey management, booking flows, identity verification, and service access for millions of global users.",
    tech: ['Angular', 'TypeScript', 'SASS', 'RESTful API', 'Multi-language'],
    link: null,
  },
  {
    title: 'CRS — Central Reservation System',
    badge: 'Enterprise · Visa',
    badgeCurrent: true,
    desc: 'Enterprise-level consular and visa management system — led front-end development covering complex form workflows, real-time API integration, and multi-language support.',
    tech: ['Angular', 'TypeScript', 'Material UI', 'SASS', 'i18n'],
    link: null,
  },
  {
    title: 'Rasd ERP System',
    badge: 'ERP',
    badgeCurrent: false,
    desc: 'Full front-end leadership of a large-scale ERP covering inventory management, sales, purchases, tax billing, and financial reporting.',
    tech: ['Angular', 'TypeScript', 'Material UI', 'SASS', 'RESTful API'],
    link: null,
  },
  {
    title: 'Conkit Platform',
    badge: 'Operations',
    badgeCurrent: false,
    desc: 'Internal operations and workflow management platform for Tasheer service centers — built responsive dashboards and administrative interfaces to support operational efficiency.',
    tech: ['Angular', 'TypeScript', 'Bootstrap', 'SASS'],
    link: null,
  },
  {
    title: 'Saferoad Vehicle Tracking',
    badge: 'Tracking',
    badgeCurrent: false,
    desc: 'Redesigned vehicle tracking platform with ReactJS and NextJS. Integrated Leaflet Map for real-time geolocation and Firebase for live data sync.',
    tech: ['ReactJS', 'NextJS', 'Leaflet Map', 'Firebase'],
    link: null,
  },
  {
    title: 'Sah Platform',
    badge: 'Real Estate',
    badgeCurrent: false,
    desc: 'Real estate portal and admin dashboard focused on UX enhancements, performance optimization, and responsive design.',
    tech: ['Angular', 'TypeScript', 'Bootstrap', 'SASS'],
    link: null,
  },
  {
    title: 'Lapia Shopping',
    badge: 'E-Commerce',
    badgeCurrent: false,
    desc: 'Responsive e-commerce shopping platform with product catalog, cart, and checkout flow.',
    tech: ['ReactJS', 'CSS3', 'JavaScript'],
    link: null,
  },
  {
    title: 'Trio Travel',
    badge: 'Tourism',
    badgeCurrent: false,
    desc: 'Tourism operations management system with an integrated accounting module for financial tracking.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'PHP'],
    link: null,
  },
]

const TECH_CATEGORIES = [
  {
    name: 'Front-End',
    items: ['Angular', 'ReactJS', 'Next.js', 'TypeScript', 'JavaScript (ES6+)', 'HTML5', 'CSS3', 'SASS', 'Tailwind CSS'],
  },
  {
    name: 'State Management',
    items: ['NgRx', 'RxJS', 'Angular Signals'],
  },
  {
    name: 'UI Frameworks',
    items: ['Bootstrap', 'Material UI', 'jQuery'],
  },
  {
    name: 'Back-End',
    items: ['PHP', 'Laravel', 'Lumen', 'RESTful API', 'Socket Programming'],
  },
  {
    name: 'Tools & DevOps',
    items: ['Git', 'GitHub', 'GitLab', 'Webpack', 'CI/CD', 'SOLID Principles', 'Design Patterns', 'Agile / Scrum'],
  },
]

const SOFT_SKILLS = [
  'Team Leadership',
  'Sprint Planning',
  'Code Reviews',
  'Mentoring',
  'Problem Solving',
  'Communication',
  'Adaptability',
  'Working Under Pressure',
]

const CERTIFICATIONS = [
  {
    year: '2019',
    title: 'Full Stack Development Track',
    org: 'One Million Arab Coders — Udacity',
  },
  {
    year: '2018',
    title: 'Full Stack (Angular & Laravel)',
    org: 'Route Academy',
  },
]

const SHARING_LINKS = [
  {
    platform: 'GitHub',
    handle: '@MoBekheet',
    url: 'https://github.com/MoBekheet',
    desc: 'Open-source projects and code samples. Explore my repositories including this interactive portfolio.',
    icon: 'github',
    color: 'text-foreground',
    bg: 'bg-muted/50',
    border: 'border-border hover:border-primary/40',
  },
  {
    platform: 'LinkedIn',
    handle: 'Mahmoud Bekheet',
    url: 'https://www.linkedin.com/in/mahmoud-bekheet',
    desc: 'Professional network, recommendations, and career updates. Connect with me for opportunities.',
    icon: 'linkedin',
    color: 'text-[hsl(var(--linkedin))]',
    bg: 'bg-[hsl(var(--linkedin)/0.05)]',
    border: 'border-[hsl(var(--linkedin)/0.2)] hover:border-[hsl(var(--linkedin)/0.5)]',
  },
]

const GRID = 24
const SNAKE_COUNT = 3
const SNAKE_LENGTH = 8
const TICK_MS = 180
const DIRS: [number, number][] = [[1, 0], [-1, 0], [0, 1], [0, -1]]

function GridSnakes() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return

    const resize = () => {
      canvas.width = parent.clientWidth
      canvas.height = parent.clientHeight
    }
    resize()
    window.addEventListener('resize', resize)

    type Snake = { trail: [number, number][]; dir: [number, number] }
    const cols = () => Math.floor(canvas.width / GRID)
    const rows = () => Math.floor(canvas.height / GRID)

    const snakes: Snake[] = Array.from({ length: SNAKE_COUNT }, () => {
      const x = Math.floor(Math.random() * cols())
      const y = Math.floor(Math.random() * rows())
      return { trail: [[x, y]], dir: DIRS[Math.floor(Math.random() * 4)] }
    })

    const tick = () => {
      const c = cols()
      const r = rows()
      for (const snake of snakes) {
        if (Math.random() < 0.3) {
          snake.dir = DIRS[Math.floor(Math.random() * 4)]
        }
        const [hx, hy] = snake.trail[snake.trail.length - 1]
        let nx = hx + snake.dir[0]
        let ny = hy + snake.dir[1]
        if (nx < 0) nx = c - 1
        if (nx >= c) nx = 0
        if (ny < 0) ny = r - 1
        if (ny >= r) ny = 0
        snake.trail.push([nx, ny])
        if (snake.trail.length > SNAKE_LENGTH) snake.trail.shift()
      }
      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const snake of snakes) {
        for (let i = 0; i < snake.trail.length; i++) {
          const [gx, gy] = snake.trail[i]
          const alpha = ((i + 1) / snake.trail.length) * 0.5
          ctx.beginPath()
          ctx.arc(gx * GRID + GRID / 2, gy * GRID + GRID / 2, 1.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(0, 217, 255, ${alpha})`
          ctx.fill()
        }
      }
    }

    let interval: ReturnType<typeof setInterval> | null = null
    const start = () => { if (!interval) interval = setInterval(tick, TICK_MS) }
    const stop = () => { if (interval) { clearInterval(interval); interval = null } }

    const io = new IntersectionObserver(
      entries => { entries[0].isIntersecting && document.visibilityState === 'visible' ? start() : stop() },
      { threshold: 0 },
    )
    io.observe(canvas)
    const onVisibility = () => {
      document.visibilityState === 'visible' && canvas.getBoundingClientRect().top < window.innerHeight ? start() : stop()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      stop()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.6 }} />
}

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
  const hasRevealed = useRef(false)
  const hydrated = useHydrated()

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 80) {
        setVisible(true)
        hasRevealed.current = true
      } else {
        setVisible(false)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    setTocOpen(false)
    const top = el.getBoundingClientRect().top + window.scrollY - 80
    requestAnimationFrame(() => { window.scrollTo({ top, behavior: 'smooth' }) })
  }, [])

  const activeIdx = TOC_SECTIONS.findIndex(s => s.id === activeId)
  const lastIdx = TOC_SECTIONS.length - 1
  const progressFrac = activeIdx >= 0 ? activeIdx / lastIdx : 0

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
                className={`relative z-10 w-3 h-3 rounded-full border-2 shrink-0 transition-colors duration-300 ${
                  isActive
                    ? 'border-primary bg-primary'
                    : isPast ? 'border-primary/50 bg-card'
                    : 'border-border bg-card'
                }`}
                animate={isActive ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                style={isActive ? { boxShadow: '0 0 8px hsl(var(--primary) / 0.5)' } : {}}
              />
              <button
                onClick={() => scrollToSection(section.id)}
                className={`text-left text-[13px] tracking-wide py-1 transition-all duration-300 ${
                  isActive
                    ? 'text-primary font-semibold translate-x-0.5'
                    : isPast ? 'text-foreground/70'
                    : 'text-muted-foreground/60 hover:text-foreground/80'
                }`}
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
          <motion.div
            key="toc-desktop"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="hidden xl:block fixed top-24 left-[max(1rem,calc(50%-44rem))] w-48 z-30"
          >
            {tocNav}
          </motion.div>

          <motion.button
            key="toc-mobile-btn"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            onClick={() => setTocOpen(o => !o)}
            className="xl:hidden fixed bottom-24 left-6 z-40 w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center"
            aria-label="Toggle table of contents"
          >
            <List className="w-5 h-5" />
          </motion.button>

          {tocOpen && (
            <>
              <div
                className="xl:hidden fixed inset-0 bg-background/60 backdrop-blur-sm z-40"
                onClick={() => setTocOpen(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="xl:hidden fixed bottom-36 left-6 z-50 w-56 bg-card border border-border rounded-xl shadow-xl p-4"
              >
                {tocNav}
              </motion.div>
            </>
          )}
        </>
      )}
    </AnimatePresence>
  )
}

export default function App() {
  const { isDark, toggleTheme } = useTheme()
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const SECTION_IDS = ['hero', 'experience', 'projects', 'sharing', 'tech', 'education', 'contact']

    const getActiveSection = () => {
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4) {
        return 'contact'
      }

      const refY = window.scrollY + window.innerHeight * 0.35

      let best = SECTION_IDS[0]
      let bestDist = Infinity

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.getBoundingClientRect().top + window.scrollY
        if (top <= refY) {
          const dist = refY - top
          if (dist < bestDist) {
            bestDist = dist
            best = id
          }
        }
      }
      return best
    }

    const onScroll = () => setActiveSection(getActiveSection())

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{
        backgroundImage: 'radial-gradient(circle, hsl(var(--dot-grid)) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Theme toggle */}
      <div className="fixed top-4 right-6 z-50 animate-nav-fade-in">
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:border-primary/50 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-primary" />}
        </button>
      </div>

      {/* Sidebar TOC */}
      <HomeToc activeId={activeSection} />

      {/* Hero */}
      <header id="hero" className="relative overflow-hidden min-h-screen flex items-center">
        <GridSnakes />

        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent pointer-events-none" />

        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none hidden sm:block"
          style={{ backgroundColor: 'hsl(var(--hero-orb-primary))', animation: 'hero-glow 8s ease-in-out infinite' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[550px] h-[550px] rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none hidden sm:block"
          style={{ backgroundColor: 'hsl(var(--hero-orb-accent))', animation: 'hero-glow 11s ease-in-out infinite reverse' }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 w-full py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <BeamPill className="inline-block">
                  Front-End Team Lead &amp; 8+ Years Experience
                </BeamPill>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                  Mahmoud{' '}
                  <span className="text-gradient-theme">Bekheet</span>
                </h1>
                <p className="text-lg text-primary font-medium mb-2 min-h-[1.75rem]">
                  <TypewriterText />
                </p>
                <p className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  Giza, Egypt
                </p>
                <p className="text-base text-muted-foreground leading-relaxed mb-8">
                  8+ years building scalable web applications and leading front-end teams.
                  Expert in Angular, React, and TypeScript — specializing in enterprise ERP systems,
                  government digital platforms, and large-scale SaaS products.
                </p>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="mailto:mahmoud.bekheet63@gmail.com"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:brightness-110 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200 animate-incoming-pulse"
                  >
                    <Mail className="w-4 h-4" />
                    Get in touch
                  </a>
                  <a
                    href="#"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border hover:border-primary/50 transition-colors duration-200 hover:bg-primary/5"
                  >
                    <Download className="w-4 h-4" />
                    Download CV
                  </a>
                </div>

                {/* Quick links */}
                <div className="flex flex-wrap items-center gap-4 mt-6">
                  <a
                    href="https://www.linkedin.com/in/mahmoud-bekheet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <LinkedInLogo className="w-4 h-4" />
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/MoBekheet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                  <a
                    href="tel:+201202206788"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    +20 120 220 6788
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Right: summary cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 gap-4"
            >
              {[
                {
                  icon: <Code className="w-5 h-5 text-primary" />,
                  title: 'Expert in SPAs & ERP',
                  desc: 'Deep experience in Angular and React for complex, data-heavy enterprise and government applications.',
                },
                {
                  icon: <Users className="w-5 h-5 text-accent" />,
                  title: 'Front-End Team Lead',
                  desc: 'Leads front-end teams — code reviews, mentoring, sprint planning, and delivery.',
                },
                {
                  icon: <Briefcase className="w-5 h-5 text-primary" />,
                  title: '8+ Years Experience',
                  desc: 'Across ERP systems, government platforms, real estate portals, vehicle tracking, and e-commerce.',
                },
              ].map((card, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    {card.icon}
                  </div>
                  <div>
                    <p className="font-display font-semibold text-foreground">{card.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">{card.desc}</p>
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap gap-2 mt-2">
                {['Angular', 'React', 'TypeScript', 'Next.js', 'NgRx', 'RxJS'].map(skill => (
                  <span key={skill} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

        </div>
      </header>

      {/* Experience */}
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
              <AnimatedSection key={i} delay={i * 0.08}>
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
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-primary whitespace-nowrap flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {job.period}
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
                      <span key={p} className="px-2 py-0.5 rounded-md text-xs bg-muted text-muted-foreground">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
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
                <div className={`h-full p-6 rounded-2xl border transition-colors flex flex-col group ${i < 2 ? 'bg-gradient-to-br from-accent/5 to-transparent border-accent/30 hover:border-accent/50' : 'bg-card border-border hover:border-primary/30'}`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display text-lg font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                    <span className={`badge px-2 py-0.5 text-xs whitespace-nowrap ml-2 ${i < 2 ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                      {project.badge}
                    </span>
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

      {/* Sharing */}
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
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-start gap-4 p-6 rounded-2xl border ${item.bg} ${item.border} transition-all hover:-translate-y-0.5 hover:shadow-lg group`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-card border border-border group-hover:border-primary/30 transition-colors`}>
                    {item.icon === 'github'
                      ? <Github className={`w-6 h-6 ${item.color}`} />
                      : <LinkedInLogo className={`w-6 h-6 ${item.color}`} />
                    }
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

      {/* Skills & Stack */}
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

          <div className="grid md:grid-cols-4 gap-8">
            <AnimatedSection delay={0.1}>
              <h3 className="font-display font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                Languages
              </h3>
              <div className="space-y-3 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Arabic</span>
                  <span className="text-sm text-primary font-medium">Native</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">English</span>
                  <span className="text-sm text-muted-foreground">Good</span>
                </div>
              </div>

              <h3 className="font-display font-semibold mb-4">Soft Skills</h3>
              <div className="flex flex-wrap gap-2">
                {SOFT_SKILLS.map(skill => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full text-sm bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="md:col-span-3">
              <h3 className="font-display font-semibold mb-4">Technology</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {TECH_CATEGORIES.map((cat, i) => (
                  <AnimatedSection key={cat.name} delay={0.1 + i * 0.05}>
                    <div className="p-4 rounded-xl bg-card border border-border">
                      <span className="text-xs font-medium text-primary uppercase tracking-wide">{cat.name}</span>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {cat.items.map(item => (
                          <span key={item} className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-muted text-foreground">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Education & Certifications */}
      <section id="education" className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Education */}
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
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-primary">2014 – 2018</span>
                  </div>
                  <h3 className="font-display font-bold text-foreground">Bachelor of Information Systems</h3>
                  <p className="text-sm text-muted-foreground mt-1">Academy of the Pharaohs · Egypt</p>
                  <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-xs text-muted-foreground">
                      Graduation Project:{' '}
                      <span className="text-foreground font-medium">eCommerce Website</span>
                      {' '}— <span className="text-primary font-medium">Excellent</span>
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            </div>

            {/* Certifications */}
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

      {/* Contact Footer */}
      <footer id="contact" className="relative py-16 md:py-24">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent 0%, hsl(var(--background)) 25%, hsl(var(--background)) 75%, transparent 100%)' }}
        />
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Let&apos;s build something great
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Open to front-end team lead and senior roles. Always happy to discuss interesting projects or opportunities.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="mailto:mahmoud.bekheet63@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:brightness-110 hover:shadow-lg hover:shadow-primary/25 active:brightness-95 transition-all duration-200"
              >
                <Mail className="w-4 h-4" />
                mahmoud.bekheet63@gmail.com
              </a>
              <a
                href="https://www.linkedin.com/in/mahmoud-bekheet"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-primary/50 transition-colors duration-200 hover:bg-primary/5"
              >
                <LinkedInLogo className="w-4 h-4" />
                LinkedIn
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
              <a
                href="https://github.com/MoBekheet"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-primary/50 transition-colors duration-200 hover:bg-primary/5"
              >
                <Github className="w-4 h-4" />
                GitHub
                <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
              <a
                href="tel:+201202206788"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-primary/50 transition-colors duration-200 hover:bg-primary/5"
              >
                <Phone className="w-4 h-4" />
                +20 120 220 6788
              </a>
            </div>
          </AnimatedSection>
          <p className="mt-12 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Mahmoud Bekheet Ibrahim · Giza, Egypt
          </p>
        </div>
      </footer>

      {/* Floating AI chatbot */}
      <Suspense fallback={null}>
        <FloatingChat />
      </Suspense>
    </div>
  )
}
