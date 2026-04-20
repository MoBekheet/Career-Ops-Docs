import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Loader2, Briefcase, Rocket, HelpCircle, Mail, ChevronDown } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const STORAGE_KEY = 'mahmoud-chat'
const GREETING = "Hi! I'm Mahmoud's AI assistant. Ask me anything about his experience, projects, or how to get in touch! 👋"

const PROMPTS = [
  { label: "What's his experience?", query: "Tell me about your work experience", icon: 'briefcase' },
  { label: "Key projects?", query: "What are your most important projects?", icon: 'rocket' },
  { label: "Tech stack?", query: "What technologies do you specialize in?", icon: 'help' },
  { label: "Get in touch", query: "How can I contact you?", icon: 'mail' },
]

function PromptIcon({ icon }: { icon: string }) {
  const map: Record<string, React.ElementType> = { briefcase: Briefcase, rocket: Rocket, help: HelpCircle, mail: Mail }
  const Icon = map[icon] || HelpCircle
  return <Icon className="w-3.5 h-3.5" aria-hidden="true" />
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isMobile
}

function autoCloseMarkdown(text: string): string {
  const boldCount = (text.match(/\*\*/g) || []).length
  if (boldCount % 2 === 1) text += '**'
  return text
}

function loadSession(): { messages: Message[]; sessionId: string; showPrompts: boolean } {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) {
      const data = JSON.parse(raw)
      if (Array.isArray(data.messages) && data.messages.length > 0) {
        const hasUser = data.messages.some((m: Message) => m.role === 'user')
        return { messages: data.messages, sessionId: data.sessionId, showPrompts: !hasUser }
      }
    }
  } catch { /* ignore */ }
  const sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
  return { messages: [{ role: 'assistant', content: GREETING }], sessionId, showPrompts: true }
}

function saveSession(messages: Message[], sessionId: string) {
  try {
    const clean = messages.filter(m => m.content !== '')
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages: clean, sessionId }))
  } catch { /* ignore */ }
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(() => typeof window !== 'undefined' && window.location.hash === '#chat')
  const [session] = useState(() => loadSession())
  const [messages, setMessages] = useState<Message[]>(session.messages)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [showPrompts, setShowPrompts] = useState(session.showPrompts)
  const [sessionId] = useState(session.sessionId)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const fullTextRef = useRef('')
  const drainPosRef = useRef(0)
  const isStreamingRef = useRef(false)
  const drainTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const abortRef = useRef<AbortController | null>(null)
  const isAtBottomRef = useRef(true)

  const isMobile = useIsMobile()
  const userMessageCount = messages.filter(m => m.role === 'user').length

  useEffect(() => {
    const onHash = () => { if (window.location.hash === '#chat') setIsOpen(true) }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    return () => { if (drainTimerRef.current) clearInterval(drainTimerRef.current) }
  }, [])

  useEffect(() => {
    const container = chatContainerRef.current?.querySelector('.chat-scroll')
    if (!container) return
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container as HTMLElement
      isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 40
    }
    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !isAtBottomRef.current) return
    messagesEndRef.current?.scrollIntoView({ behavior: isLoading || isStreaming ? 'instant' : 'smooth', block: 'end' })
  }, [messages, isLoading, isStreaming, isOpen])

  useEffect(() => {
    if (isOpen && !isMobile) setTimeout(() => inputRef.current?.focus(), 100)
  }, [isOpen, isMobile])

  useEffect(() => {
    if (!isLoading) saveSession(messages, sessionId)
  }, [messages, isLoading, sessionId])

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (isMobile && isOpen) {
      const scrollY = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${scrollY}px`
      return () => {
        document.body.style.overflow = ''
        document.body.style.position = ''
        document.body.style.width = ''
        document.body.style.top = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isMobile, isOpen])

  const startDrain = useCallback(() => {
    if (drainTimerRef.current) return
    drainTimerRef.current = setInterval(() => {
      const full = fullTextRef.current
      const pos = drainPosRef.current
      if (pos < full.length) {
        drainPosRef.current = pos + 1
        const currentText = full.slice(0, drainPosRef.current)
        setMessages(prev => {
          const msgs = [...prev]
          msgs[msgs.length - 1] = { role: 'assistant', content: currentText }
          return msgs
        })
      } else if (!isStreamingRef.current) {
        if (drainTimerRef.current) { clearInterval(drainTimerRef.current); drainTimerRef.current = null }
        setIsStreaming(false)
      }
    }, 12)
  }, [])

  const sendMessage = useCallback(async (messageText?: string) => {
    const text = messageText || input.trim()
    if (!text || isLoading) return
    setInput('')
    setShowPrompts(false)
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setIsLoading(true)

    fullTextRef.current = ''
    drainPosRef.current = 0
    isStreamingRef.current = false
    if (drainTimerRef.current) { clearInterval(drainTimerRef.current); drainTimerRef.current = null }
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      if (!navigator.onLine) throw new Error('offline')

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      const allMessages = [...messages, { role: 'user' as const, content: text }]
        .filter(m => !(m.role === 'assistant' && m.content === GREETING) && m.content !== '')

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ messages: allMessages, sessionId }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) throw new Error('No reader')

      let buffer = ''
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        let newlineIndex
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          const line = buffer.slice(0, newlineIndex).trim()
          buffer = buffer.slice(newlineIndex + 1)
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.text) {
                if (!isStreamingRef.current) { isStreamingRef.current = true; setIsStreaming(true) }
                fullText += data.text
                fullTextRef.current = fullText
                startDrain()
              }
            } catch { /* ignore */ }
          }
        }
      }

      isStreamingRef.current = false
      if (!fullText) {
        setMessages(prev => {
          const last = prev[prev.length - 1]
          if (last?.role === 'assistant' && last.content === '') {
            return [...prev.slice(0, -1), { role: 'assistant', content: "Sorry, I couldn't get a response. Please try again." }]
          }
          return prev
        })
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return
      const errorMsg = !navigator.onLine || (err instanceof Error && err.message === 'offline')
        ? "You appear to be offline. Please check your connection."
        : "Something went wrong. Please try again."
      fullTextRef.current = ''
      drainPosRef.current = 0
      if (drainTimerRef.current) { clearInterval(drainTimerRef.current); drainTimerRef.current = null }
      setIsStreaming(false)
      isStreamingRef.current = false
      setMessages(prev => {
        const last = prev[prev.length - 1]
        if (last?.role === 'assistant' && last.content === '') {
          return [...prev.slice(0, -1), { role: 'assistant', content: errorMsg }]
        }
        return [...prev, { role: 'assistant', content: errorMsg }]
      })
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages, sessionId, startDrain])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
        onClick={() => { if (isOpen) abortRef.current?.abort(); setIsOpen(!isOpen) }}
        className="fixed z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
        style={{
          bottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px) + 0.5rem)',
          right: 'max(1.5rem, env(safe-area-inset-right, 0px) + 0.5rem)',
        }}
        aria-label={isOpen ? 'Close chat' : 'Chat with Mahmoud AI'}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(to bottom right, hsl(var(--gradient-from)), hsl(var(--gradient-to)))' }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full"
            >
              {/* Avatar with initials */}
              <div className="w-full h-full rounded-full flex items-center justify-center font-display font-bold text-lg text-white"
                style={{ background: 'linear-gradient(135deg, hsl(var(--gradient-from)), hsl(var(--gradient-to)))' }}>
                MB
              </div>
              {/* Pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-primary"
                animate={{ scale: [1, 1.15, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              />
              {/* Online indicator */}
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-background rounded-full" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatContainerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Chat with Mahmoud AI"
            initial={isMobile ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
            animate={isMobile ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={isMobile ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.95 }}
            transition={isMobile ? { duration: 0.2 } : { type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed z-50 flex flex-col bg-card border-border shadow-2xl ${
              isMobile
                ? 'inset-0 h-dvh rounded-none border-0'
                : 'bottom-24 right-6 w-[360px] max-w-[calc(100vw-3rem)] h-[520px] max-h-[calc(100vh-8rem)] rounded-2xl border overflow-hidden'
            }`}
          >
            {/* Header */}
            <div
              className="p-4 border-b border-border flex items-center justify-between shrink-0"
              style={{
                background: 'linear-gradient(to right, hsl(var(--gradient-from) / 0.08), hsl(var(--gradient-to) / 0.08))',
                paddingTop: isMobile ? 'max(1rem, env(safe-area-inset-top, 0px))' : undefined,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm text-white shrink-0"
                  style={{ background: 'linear-gradient(135deg, hsl(var(--gradient-from)), hsl(var(--gradient-to)))' }}>
                  MB
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground text-sm">Mahmoud AI</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    Ask me anything
                  </p>
                </div>
              </div>
              {isMobile && (
                <button
                  onClick={() => { abortRef.current?.abort(); setIsOpen(false) }}
                  className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Messages */}
            <div className={`flex-1 overflow-y-auto p-4 space-y-4 chat-scroll ${isMobile ? 'pb-2' : ''}`}>
              {messages.map((message, i) =>
                message.role === 'assistant' && message.content === '' ? null : (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.04, 0.3) }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`px-4 py-2.5 rounded-2xl leading-relaxed max-w-[85%] ${
                      message.role === 'user'
                        ? 'text-white rounded-br-md text-sm'
                        : 'bg-muted text-foreground rounded-bl-md text-sm'
                    } ${isStreaming && i === messages.length - 1 && message.role === 'assistant' ? 'streaming-cursor' : ''}`}
                    style={message.role === 'user' ? {
                      background: 'linear-gradient(to bottom right, hsl(var(--gradient-from)), hsl(var(--gradient-to)))'
                    } : undefined}
                    >
                      {message.role === 'assistant' ? (
                        <ReactMarkdown
                          components={{
                            strong: ({ children }) => <strong className="font-semibold text-primary">{children}</strong>,
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            a: ({ href, children }) => (
                              <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:text-primary/80 transition-colors">
                                {children}
                              </a>
                            ),
                            ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                            li: ({ children }) => <li>{children}</li>,
                          }}
                        >
                          {isStreaming && i === messages.length - 1
                            ? autoCloseMarkdown(message.content)
                            : message.content}
                        </ReactMarkdown>
                      ) : (
                        message.content
                      )}
                    </div>
                  </motion.div>
                )
              )}

              {/* Quick prompts */}
              {showPrompts && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex flex-wrap gap-2 pt-1"
                >
                  {PROMPTS.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(prompt.query)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 hover:border-primary/40 active:bg-primary/30 transition-colors"
                    >
                      <PromptIcon icon={prompt.icon} />
                      {prompt.label}
                    </button>
                  ))}
                </motion.div>
              )}

              {/* Contact CTA after 2+ exchanges */}
              {userMessageCount >= 2 && !isLoading && !showPrompts && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="pt-1"
                >
                  <div className="p-3 rounded-xl border border-primary/20 text-center"
                    style={{ background: 'linear-gradient(to right, hsl(var(--gradient-from) / 0.07), hsl(var(--gradient-to) / 0.07))' }}>
                    <p className="text-xs font-medium text-foreground mb-2">Ready to connect directly?</p>
                    <a
                      href="mailto:mahmoud.bekheet63@gmail.com"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white text-xs font-medium hover:brightness-110 transition-all"
                      style={{ background: 'linear-gradient(to right, hsl(var(--gradient-from)), hsl(var(--gradient-to)))' }}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      mahmoud.bekheet63@gmail.com
                    </a>
                  </div>
                </motion.div>
              )}

              {/* Loading indicator */}
              {isLoading && messages[messages.length - 1]?.content === '' && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
                  <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
                    <span className="text-xs text-muted-foreground">Thinking…</span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border shrink-0"
              style={{ paddingBottom: isMobile ? 'max(1rem, env(safe-area-inset-bottom, 0px))' : undefined }}>
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about Mahmoud…"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-full bg-muted text-foreground text-sm placeholder:text-muted-foreground border border-border focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 disabled:opacity-50 transition-colors"
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white transition-all hover:brightness-110 active:brightness-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  style={{ background: 'linear-gradient(to bottom right, hsl(var(--gradient-from)), hsl(var(--gradient-to)))' }}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
