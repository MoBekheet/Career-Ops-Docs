import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import {
  Mail, ExternalLink, Briefcase, GraduationCap, Award,
  Code, Globe, Download, MapPin, Phone, Sun, Moon,
  ChevronRight, Users, Calendar
} from 'lucide-react'

const FloatingChat = lazy(() => import('./FloatingChat'))

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
    desc: 'Led a team of 3 developers in building a new version of the Saferoad vehicle tracking project using ReactJS, NextJS, Leaflet Map, and Firebase.',
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
    desc: 'Designed and developed responsive web pages from PSD designs. Managed front-end responsibilities for tourism, eCommerce, and accounting platforms.',
    highlights: [
      'Responsive design from PSD using HTML5, CSS3, JS, jQuery',
      'API integration and AJAX calls',
      'Multiple product verticals: travel, retail, finance',
    ],
    projects: ['Trio Travel', 'Factory Accounting System', 'Lapia Shopping (ReactJS)', 'Aoun Project (Flutter)', 'Meat Project (Flutter)'],
  },
]

const PROJECTS = [
  {
    title: 'Rasd ERP System',
    badge: 'Enterprise',
    badgeCurrent: true,
    desc: 'Full front-end leadership of a large-scale ERP system covering inventory management, sales, purchases, tax bills, and reporting. Built with Angular and Material UI.',
    tech: ['Angular', 'TypeScript', 'Material UI', 'SASS', 'RESTful API'],
    link: null,
  },
  {
    title: 'Sah Platform',
    badge: 'Real Estate',
    badgeCurrent: false,
    desc: 'Real estate portal and admin dashboard. Focused on user experience enhancements, performance optimization, and responsive design.',
    tech: ['Angular', 'TypeScript', 'Bootstrap', 'SASS'],
    link: null,
  },
  {
    title: 'Saferoad Vehicle Tracking',
    badge: 'Tracking',
    badgeCurrent: false,
    desc: 'Designed and implemented a new version of the vehicle tracking platform using ReactJS and NextJS. Integrated Leaflet Map for real-time geolocation and Firebase for data sync.',
    tech: ['ReactJS', 'NextJS', 'Leaflet Map', 'Firebase'],
    link: null,
  },
  {
    title: 'Trio Travel',
    badge: 'Tourism',
    badgeCurrent: false,
    desc: 'System for managing operations and workflow of tourism companies, with an integrated accounting module for financial tracking.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'PHP'],
    link: null,
  },
  {
    title: 'Lapia Shopping',
    badge: 'E-Commerce',
    badgeCurrent: false,
    desc: 'Designed and implemented a responsive shopping platform with product catalog, cart, and checkout flow using ReactJS.',
    tech: ['ReactJS', 'CSS3', 'JavaScript'],
    link: null,
  },
  {
    title: 'Factory Accounting System',
    badge: 'Finance',
    badgeCurrent: false,
    desc: 'System for managing financial operations in factories including invoicing, expenses, and production cost tracking.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'jQuery', 'PHP'],
    link: null,
  },
]

const TECH_CATEGORIES = [
  {
    name: 'Front-End',
    items: ['Angular', 'ReactJS', 'Next.js', 'TypeScript', 'JavaScript (ES6)', 'HTML5', 'CSS3', 'SASS'],
  },
  {
    name: 'UI Frameworks',
    items: ['Bootstrap', 'Material UI', 'Tailwind CSS', 'jQuery'],
  },
  {
    name: 'Back-End',
    items: ['PHP', 'Laravel', 'Lumen', 'RESTful API', 'Socket Programming'],
  },
  {
    name: 'Tools & DevOps',
    items: ['Git', 'GitHub', 'GitLab', 'Webpack', 'CI/CD', 'SOLID Principles', 'Design Patterns'],
  },
]

const SOFT_SKILLS = [
  'Team Leadership',
  'Code Reviews',
  'Sprint Planning',
  'Communication',
  'Problem Solving',
  'Mentoring',
  'Quick Learner',
  'Adaptability',
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

export default function App() {
  const { isDark, toggleTheme } = useTheme()
  const [activeSection, setActiveSection] = useState('')
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]')
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id)
        }
      },
      { rootMargin: '-40% 0px -50% 0px' }
    )
    sections.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{
        backgroundImage: 'radial-gradient(circle, hsl(var(--dot-grid)) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Nav controls */}
      <div className="fixed top-4 right-6 z-50 flex items-center gap-2">
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
              className={`px-3 py-1 rounded-full transition-colors ${activeSection === id ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {label}
            </button>
          ))}
        </nav>
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:border-primary/50 transition-colors"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-5 h-5 text-primary" /> : <Moon className="w-5 h-5 text-primary" />}
        </button>
      </div>

      {/* Hero */}
      <section ref={heroRef} id="hero" className="relative min-h-screen flex items-center py-24">
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ background: `hsl(var(--hero-orb-primary))`, animation: 'hero-glow 8s ease-in-out infinite' }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ background: `hsl(var(--hero-orb-accent))`, animation: 'hero-glow 8s ease-in-out 4s infinite' }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="badge px-3 py-1 bg-primary/10 text-primary border border-primary/20 mb-6 inline-block">
                  Senior Front-End Developer &amp; Team Lead
                </span>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                  Mahmoud{' '}
                  <span className="text-gradient-theme">Bekheet</span>
                </h1>
                <p className="text-lg text-muted-foreground mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  Giza, Egypt
                </p>
                <p className="text-base text-muted-foreground leading-relaxed mb-8">
                  5+ years building scalable web applications and leading front-end teams.
                  Expert in Angular, React, and TypeScript — specializing in enterprise ERP systems and SPAs.
                </p>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="mailto:mahmoud.bekheet63@gmail.com"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-medium hover:brightness-110 hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
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
                    href="tel:+201141763122"
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    +20 114 176 3122
                  </a>
                </div>
              </motion.div>
            </div>

            {/* Right: skills summary cards */}
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
                  desc: 'Deep experience in Angular and React for complex, data-heavy enterprise applications.',
                },
                {
                  icon: <Users className="w-5 h-5 text-accent" />,
                  title: 'Team Leader',
                  desc: 'Leads front-end teams — code reviews, mentoring, sprint planning, and delivery.',
                },
                {
                  icon: <Briefcase className="w-5 h-5 text-primary" />,
                  title: '5+ Years Experience',
                  desc: 'Across ERP systems, real estate portals, vehicle tracking, and e-commerce platforms.',
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
                {['Angular', 'React', 'TypeScript', 'Next.js', 'SASS', 'PHP'].map(skill => (
                  <span key={skill} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <button
              onClick={() => scrollTo('experience')}
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
            >
              <span className="text-xs">Scroll</span>
              <ChevronRight className="w-4 h-4 rotate-90" />
            </button>
          </motion.div>
        </div>
      </section>

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
                    <span className={`badge px-2 py-0.5 text-xs ${i < 2 ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
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

      {/* Tech Stack */}
      <section id="tech" className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <h2 className="font-display text-2xl font-semibold mb-10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Code className="w-5 h-5 text-primary" />
              </div>
              Tech Stack
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
      <section id="education" className="py-16 md:py-24">
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
                  <p className="text-sm text-muted-foreground mt-1">Academy of the Pharaohs</p>
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
              Open to senior front-end and team lead roles. Always happy to discuss interesting projects or opportunities.
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
                href="tel:+201141763122"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-primary/50 transition-colors duration-200 hover:bg-primary/5"
              >
                <Phone className="w-4 h-4" />
                +20 114 176 3122
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
