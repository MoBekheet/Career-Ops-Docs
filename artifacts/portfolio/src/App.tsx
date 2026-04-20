import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, ExternalLink, Briefcase, GraduationCap, Award,
  Code, Globe, Download, MapPin, Phone, Sun, Moon,
  ChevronRight, Users, Calendar, BadgeCheck, FolderGit2,
  Sparkles, Github, Star, Network, ArrowUp, Bot,
  SkipForward,
} from 'lucide-react'

const FloatingChat = lazy(() => import('./FloatingChat'))

/* ─── Hydration guard ─── */
function useHydrated() {
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => setHydrated(true), [])
  return hydrated
}

/* ─── InView hook ─── */
function useInView(threshold = 0.12) {
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

/* ─── Animated section wrapper ─── */
function AnimatedSection({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  const { ref, isInView } = useInView()
  return (
    <motion.div
      ref={ref as React.RefCallback<HTMLDivElement>}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── BeamPill: floating heal particles ─── */
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

function BeamPill({ children, active = false }: { children: React.ReactNode; active?: boolean }) {
  const hydrated = useHydrated()
  return (
    <span
      className={`beam-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
        active
          ? 'bg-primary/15 text-primary border-primary/30'
          : 'bg-card/80 text-foreground border-border hover:border-primary/30'
      }`}
    >
      {children}
      {hydrated && active && HEAL_PARTICLES.map((p, i) => (
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

/* ─── Typewriter component ─── */
const ROLES = [
  'Senior Front-End Developer',
  'Team Lead & Mentor',
  'Angular & React Expert',
]

function TypewriterRoles() {
  const [roleIdx, setRoleIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const target = ROLES[roleIdx]
    if (paused) {
      const t = setTimeout(() => { setDeleting(true); setPaused(false) }, 1800)
      return () => clearTimeout(t)
    }
    if (!deleting && displayed.length < target.length) {
      const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 55)
      return () => clearTimeout(t)
    }
    if (!deleting && displayed.length === target.length) {
      setPaused(true)
      return
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30)
      return () => clearTimeout(t)
    }
    if (deleting && displayed.length === 0) {
      setDeleting(false)
      setRoleIdx(i => (i + 1) % ROLES.length)
    }
  }, [displayed, deleting, paused, roleIdx])

  return (
    <span className="text-gradient-theme font-display">
      {displayed}
      <span className="border-r-2 border-primary ml-0.5 animate-[cursor-blink_0.75s_step-end_infinite]" aria-hidden="true" />
    </span>
  )
}

/* ─── Theme hook ─── */
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

/* ─── LinkedIn SVG ─── */
function LinkedInLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
    </svg>
  )
}

/* ─── Section header (icon + label) ─── */
function SectionHeader({ icon, title, color = 'primary' }: {
  icon: React.ReactNode; title: string; color?: 'primary' | 'accent'
}) {
  return (
    <h2 className="font-display text-2xl font-semibold mb-10 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color === 'accent' ? 'bg-accent/10' : 'bg-primary/10'}`}>
        {icon}
      </div>
      {title}
    </h2>
  )
}

/* ─── DATA ─── */
const EXPERIENCE = [
  {
    period: 'Dec 2022 – Present',
    role: 'Senior Front-End Developer & Team Lead',
    company: 'World of Systems & Software',
    location: 'Egypt',
    current: true,
    desc: 'Lead and manage the Front-End team ensuring successful delivery of high-quality sprint requirements. Conduct code reviews, mentor team members, and drive continuous improvement.',
    highlights: [
      'Leading sprint planning and estimating project timelines',
      'Code refactoring for performance and maintainability',
      'Collaborating closely with cross-functional teams',
    ],
    projects: ['Rasd ERP System (Angular)', 'Sah Platform (Angular)'],
  },
  {
    period: 'Dec 2021 – Dec 2022',
    role: 'Senior Front-End Developer',
    company: 'World of Systems & Software',
    location: 'Egypt',
    current: false,
    desc: 'Designed and implemented user interfaces using HTML, SASS, TypeScript, Angular, Bootstrap, and Material UI. Built reusable code and libraries.',
    highlights: [
      'Built reusable component libraries',
      'Application testing, bug fixing, and performance optimization',
      'Delivered functional, user-friendly web pages',
    ],
    projects: ['Rasd ERP System', 'Sah Platform'],
  },
  {
    period: 'Sep 2021 – Dec 2021',
    role: 'Senior Front-End Developer',
    company: 'Scaleup Gurus',
    location: 'Egypt',
    current: false,
    desc: 'Led a team of 3 developers in building a new version of the Saferoad vehicle tracking project.',
    highlights: [
      'Led 3-developer team',
      'Real-time vehicle tracking with Leaflet Map',
      'Firebase integration for improved performance',
    ],
    projects: ['Saferoad Vehicle Tracking (ReactJS / NextJS)'],
  },
  {
    period: 'Jun 2019 – 2021',
    role: 'Middle-Level Front-End Developer',
    company: 'Etolv Company',
    location: 'Doqi, Egypt',
    current: false,
    desc: 'Designed and developed responsive web pages from PSD designs. Managed front-end for tourism, eCommerce, and accounting platforms.',
    highlights: [
      'Responsive design from PSD using HTML5, CSS3, JS, jQuery',
      'API integration and AJAX calls',
      'Multiple product verticals: travel, retail, finance',
    ],
    projects: ['Trio Travel', 'Factory Accounting System', 'Lapia Shopping (ReactJS)'],
  },
]

const PROJECTS = [
  {
    title: 'Rasd ERP System',
    badge: 'Enterprise',
    featured: true,
    desc: 'Full front-end leadership of a large-scale ERP system covering inventory, sales, purchases, tax bills, and reporting.',
    tech: ['Angular', 'TypeScript', 'Material UI', 'SASS', 'RESTful API'],
  },
  {
    title: 'Sah Platform',
    badge: 'Real Estate',
    featured: true,
    desc: 'Real estate portal and admin dashboard focused on UX enhancements, performance optimization, and responsive design.',
    tech: ['Angular', 'TypeScript', 'Bootstrap', 'SASS'],
  },
  {
    title: 'Saferoad Vehicle Tracking',
    badge: 'Tracking',
    featured: false,
    desc: 'New version of the vehicle tracking platform with real-time geolocation and Firebase data sync.',
    tech: ['ReactJS', 'NextJS', 'Leaflet Map', 'Firebase'],
  },
  {
    title: 'Trio Travel',
    badge: 'Tourism',
    featured: false,
    desc: 'System for managing tourism company operations with an integrated accounting module.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'PHP'],
  },
  {
    title: 'Lapia Shopping',
    badge: 'E-Commerce',
    featured: false,
    desc: 'Responsive shopping platform with product catalog, cart, and checkout flow.',
    tech: ['ReactJS', 'CSS3', 'JavaScript'],
  },
  {
    title: 'Factory Accounting System',
    badge: 'Finance',
    featured: false,
    desc: 'System for managing factory financial operations including invoicing and production cost tracking.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'PHP'],
  },
]

const TECH_CATEGORIES = [
  { name: 'Front-End', items: ['Angular', 'ReactJS', 'Next.js', 'TypeScript', 'JavaScript (ES6)', 'HTML5', 'CSS3', 'SASS'] },
  { name: 'UI Frameworks', items: ['Bootstrap', 'Material UI', 'Tailwind CSS', 'jQuery'] },
  { name: 'Back-End & API', items: ['PHP', 'Laravel', 'Lumen', 'RESTful API', 'Socket Programming'] },
  { name: 'Tools & DevOps', items: ['Git', 'GitHub', 'GitLab', 'Webpack', 'CI/CD', 'SOLID Principles'] },
]

const CERTIFICATIONS = [
  { year: '2019', title: 'Full Stack Development Track', org: 'One Million Arab Coders — Udacity' },
  { year: '2018', title: 'Full Stack (Angular & Laravel)', org: 'Route Academy' },
]

/* ─── MAIN APP ─── */
export default function App() {
  const { isDark, toggleTheme } = useTheme()
  const [activeSection, setActiveSection] = useState('')
  const [introVisible, setIntroVisible] = useState(true)
  const mainRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      (entries) => { for (const entry of entries) { if (entry.isIntersecting) setActiveSection(entry.target.id) } },
      { rootMargin: '-40% 0px -50% 0px' }
    )
    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const skipIntro = () => {
    setIntroVisible(false)
    setTimeout(() => scrollTo('experience'), 100)
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{
        backgroundImage: 'radial-gradient(circle, hsl(var(--dot-grid)) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* ─── Top-right controls ─── */}
      <div className="fixed top-4 right-6 z-50 flex items-center gap-2 animate-nav-fade-in">
        <nav className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-md border border-border text-sm">
          {[
            { id: 'experience', label: 'Experience' },
            { id: 'projects', label: 'Projects' },
            { id: 'tech', label: 'Tech Stack' },
            { id: 'contact', label: 'Contact' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`px-3 py-1 rounded-full transition-colors ${
                activeSection === id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-sm hover:border-primary/40 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-4 h-4 text-primary" /> : <Moon className="w-4 h-4 text-primary" />}
        </button>
      </div>

      {/* ─── HERO ─── */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center py-24 overflow-hidden">
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full blur-[120px]"
            style={{ background: 'hsl(var(--hero-orb-primary))', animation: 'hero-glow 8s ease-in-out infinite' }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px]"
            style={{ background: 'hsl(var(--hero-orb-accent))', animation: 'hero-glow 8s ease-in-out 4s infinite' }}
          />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-center gap-10 md:gap-16"
          >
            {/* Left: Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="shrink-0 relative"
            >
              {/* Gradient ring */}
              <div
                className="w-44 h-44 md:w-52 md:h-52 rounded-full p-[3px]"
                style={{ background: 'linear-gradient(135deg, hsl(var(--gradient-from)), hsl(var(--gradient-to)))' }}
              >
                <div className="w-full h-full rounded-full bg-muted overflow-hidden flex items-center justify-center">
                  {/* Placeholder avatar — replace with real photo */}
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="font-display font-bold text-5xl text-gradient-theme">MB</span>
                  </div>
                </div>
              </div>
              {/* Verified badge */}
              <div
                className="absolute bottom-2 right-2 w-9 h-9 rounded-full flex items-center justify-center border-2 border-background"
                style={{ background: 'linear-gradient(135deg, hsl(var(--gradient-from)), hsl(var(--gradient-to)))' }}
              >
                <BadgeCheck className="w-5 h-5 text-white" />
              </div>
            </motion.div>

            {/* Right: Text */}
            <div className="flex-1 text-center md:text-left">
              {/* Greeting */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="text-muted-foreground text-lg mb-2"
              >
                Hello, I'm{' '}
                <a
                  href="https://www.linkedin.com/in/mahmoud-bekheet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary font-semibold hover:underline"
                >
                  @mahmoud
                </a>
                ,
              </motion.p>

              {/* Typewriter role — BIG */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-2 min-h-[1.3em]"
              >
                <TypewriterRoles />
              </motion.div>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6 max-w-xl"
              >
                who builds enterprise-scale web applications
                <br className="hidden md:block" />
                with Angular, React &amp; TypeScript.
              </motion.p>

              {/* Pills */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="flex flex-wrap gap-2 justify-center md:justify-start mb-8"
              >
                <BeamPill active>Senior Dev</BeamPill>
                <BeamPill>Team Lead</BeamPill>
                <BeamPill>
                  <Star className="w-3.5 h-3.5 text-gold" />
                  5+ Years
                </BeamPill>
              </motion.div>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.65 }}
                className="flex flex-wrap gap-3 justify-center md:justify-start"
              >
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
              </motion.div>

              {/* Social quick links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap items-center gap-4 mt-5 justify-center md:justify-start"
              >
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
                  href="tel:+201141763122"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +20 114 176 3122
                </a>
                <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  Giza, Egypt
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll hint / Skip intro */}
          <AnimatePresence>
            {introVisible && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
              >
                <button
                  onClick={skipIntro}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/80 backdrop-blur-md border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  Skip to experience
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ─── EXPERIENCE ─── */}
      <section id="experience" className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <SectionHeader icon={<Briefcase className="w-5 h-5 text-primary" />} title="Work Experience" />
          </AnimatedSection>

          {/* Core competency pills */}
          <AnimatedSection delay={0.05} className="mb-12">
            <p className="text-muted-foreground text-sm mb-4">
              End-to-end ownership across{' '}
              <span className="text-foreground font-medium">architecture → implementation → delivery → mentoring</span>,
              working closely with product and design teams.
            </p>
            <div className="flex flex-wrap gap-2">
              {['SPA Development', 'ERP Systems', 'Code Reviews', 'Sprint Planning', 'Team Leadership', 'Performance Optimization', 'REST API Integration', 'CI/CD'].map(s => (
                <span key={s} className="px-2.5 py-1 rounded-full text-xs bg-primary/8 text-primary border border-primary/15 font-medium">{s}</span>
              ))}
            </div>
          </AnimatedSection>

          <div className="space-y-4">
            {EXPERIENCE.map((job, i) => (
              <AnimatedSection key={i} delay={i * 0.07}>
                <div className={`p-6 rounded-2xl border transition-all ${
                  job.current
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-border bg-card hover:border-primary/20'
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-display font-bold text-foreground">{job.role}</h3>
                        {job.current && (
                          <span className="badge px-2 py-0.5 bg-success/10 text-success text-xs flex items-center gap-1">
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
                    <span className="text-xs font-mono text-muted-foreground whitespace-nowrap flex items-center gap-1 shrink-0">
                      <Calendar className="w-3 h-3" />{job.period}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{job.desc}</p>

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

      {/* ─── PROJECTS ─── */}
      <section id="projects" className="py-20 md:py-28 bg-muted/20">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <SectionHeader icon={<FolderGit2 className="w-5 h-5 text-accent" />} title="Projects" color="accent" />
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-5">
            {PROJECTS.map((project, i) => (
              <AnimatedSection key={i} delay={i * 0.06}>
                <div className={`h-full p-5 rounded-2xl border transition-all flex flex-col group ${
                  project.featured
                    ? 'bg-gradient-to-br from-accent/5 to-transparent border-accent/25 hover:border-accent/45'
                    : 'bg-card border-border hover:border-primary/25'
                }`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-display font-bold group-hover:text-primary transition-colors">{project.title}</h3>
                    <span className={`badge px-2 py-0.5 text-xs shrink-0 ml-2 ${
                      project.featured ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'
                    }`}>
                      {project.badge}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 flex-1 leading-relaxed">{project.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {project.tech.map(t => (
                      <span key={t} className="px-2 py-0.5 rounded-md text-xs bg-muted text-muted-foreground">{t}</span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TECH STACK ─── */}
      <section id="tech" className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <SectionHeader icon={<Code className="w-5 h-5 text-primary" />} title="Tech Stack" />
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TECH_CATEGORIES.map((cat, i) => (
              <AnimatedSection key={i} delay={i * 0.07}>
                <div className="p-5 rounded-2xl bg-card border border-border hover:border-primary/20 transition-colors">
                  <h3 className="font-display font-semibold text-sm mb-4 text-primary">{cat.name}</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {cat.items.map(item => (
                      <span key={item} className="px-2 py-0.5 rounded-md text-xs bg-muted text-muted-foreground">{item}</span>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Languages + Soft Skills */}
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <AnimatedSection delay={0.1}>
              <div className="p-5 rounded-2xl bg-card border border-border">
                <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  Languages
                </h3>
                <div className="space-y-2">
                  {[{ lang: 'Arabic', level: 'Native', primary: true }, { lang: 'English', level: 'Good', primary: false }].map(l => (
                    <div key={l.lang} className="flex justify-between items-center">
                      <span className="text-sm">{l.lang}</span>
                      <span className={`text-sm font-medium ${l.primary ? 'text-primary' : 'text-muted-foreground'}`}>{l.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="p-5 rounded-2xl bg-card border border-border">
                <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-accent" />
                  Soft Skills
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {['Team Leadership', 'Code Reviews', 'Sprint Planning', 'Communication', 'Problem Solving', 'Mentoring', 'Quick Learner', 'Adaptability'].map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-md text-xs bg-muted text-muted-foreground">{s}</span>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Education + Certs */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <AnimatedSection delay={0.1}>
              <div className="p-5 rounded-2xl bg-card border border-border">
                <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-primary" />
                  Education
                </h3>
                <p className="font-medium text-foreground text-sm">Bachelor of Information Systems</p>
                <p className="text-primary text-xs mt-0.5">Academy of the Pharaohs</p>
                <p className="text-muted-foreground text-xs font-mono mt-1">2014 – 2018</p>
                <p className="text-muted-foreground text-xs mt-1">Graduation project: eCommerce website (Excellent)</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="p-5 rounded-2xl bg-card border border-border">
                <h3 className="font-display font-semibold text-sm mb-4 flex items-center gap-2">
                  <Award className="w-4 h-4 text-gold" />
                  Certifications
                </h3>
                <div className="space-y-3">
                  {CERTIFICATIONS.map((c, i) => (
                    <div key={i}>
                      <p className="text-sm font-medium text-foreground">{c.title}</p>
                      <p className="text-xs text-primary">{c.org}</p>
                      <p className="text-xs text-muted-foreground font-mono">{c.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─── CONTACT ─── */}
      <section id="contact" className="py-20 md:py-28 bg-muted/20">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <SectionHeader icon={<Mail className="w-5 h-5 text-primary" />} title="Let's Connect" />
          </AnimatedSection>

          <AnimatedSection delay={0.05} className="max-w-2xl">
            <p className="text-muted-foreground text-base leading-relaxed mb-8">
              Currently open to Senior Front-End Developer opportunities. If you have a challenging project or just want to say hi, I'd love to hear from you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href="mailto:mahmoud.bekheet63@gmail.com"
                className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">mahmoud.bekheet63@gmail.com</p>
                </div>
              </a>

              <a
                href="tel:+201141763122"
                className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border hover:border-primary/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">+20 114 176 3122</p>
                </div>
              </a>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://www.linkedin.com/in/mahmoud-bekheet"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:border-primary/40 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <LinkedInLogo className="w-4 h-4" />
                LinkedIn
              </a>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                Giza, Egypt
              </span>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-border/40 py-8 text-center text-muted-foreground text-sm">
        <p>© {new Date().getFullYear()} Mahmoud Bekheet Ibrahim · Built with React + TypeScript</p>
      </footer>

      {/* ─── AI Chat ─── */}
      <Suspense fallback={null}>
        <FloatingChat />
      </Suspense>

      {/* ─── Back to top ─── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 left-6 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors z-40 shadow-sm"
        aria-label="Back to top"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </div>
  )
}
