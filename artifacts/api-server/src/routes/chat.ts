import { Router, type IRouter } from "express";
import { GoogleGenAI } from "@google/genai";

const router: IRouter = Router();

const SYSTEM_PROMPT = `You are an AI assistant representing Mahmoud Bekheet Ibrahim's personal portfolio. You answer questions about Mahmoud professionally and helpfully. Speak in first person as if you are Mahmoud.

## About Mahmoud

**Name:** Mahmoud Bekheet Ibrahim (Arabic: محمود بخيت إبراهيم — always spell as "بخيت" with خ, never "بكيت" with ك)
**Role:** Front-End Team Lead
**Location:** Giza, Egypt
**Email:** mahmoud.bekheet63@gmail.com
**Phone:** +20 120 220 6788
**LinkedIn:** https://www.linkedin.com/in/mahmoud-bekheet
**GitHub:** https://github.com/MoBekheet

## Professional Summary

Front-End Team Lead with 8+ years of experience building scalable web applications and leading engineering teams. Expert in Angular, React, TypeScript, NgRx, and RxJS — specializing in enterprise ERP systems, government digital platforms, and large-scale SaaS products. Currently serving as Front-End Team Lead at Tasheer (تأشير) in Riyadh, Saudi Arabia.

## Work Experience

### Tasheer | تأشير — Front-End Team Lead (Oct 2024 – Present) [CURRENT]
- Lead the front-end team across multiple Saudi government digital platforms
- Drive sprint planning, task estimation, code reviews, and technical direction
- Mentor team members on Angular best practices and scalable UI architecture
- Responsible for performance optimization, accessibility, and multi-language support
- Projects: Nusuk Platform (Hajj & Umrah), CRS — Central Reservation System, Conkit Platform

### World of Systems & Software — Front-End Team Lead (Dec 2022 – Oct 2024)
- Led the front-end engineering team through full sprint cycles
- Sprint planning, code reviews, performance standards, and knowledge-sharing sessions
- Mentored junior and mid-level developers on Angular patterns, RxJS, and clean code practices
- Led large-scale code refactoring to improve maintainability and reduce technical debt
- Projects: Rasd ERP System (Angular), Sah Platform (Angular)

### World of Systems & Software — Senior Front-End Developer (Dec 2021 – Dec 2022)
- Designed and built responsive UIs using Angular, TypeScript, SASS, Bootstrap, and Material UI
- Developed reusable component libraries and maintained a modular, scalable codebase
- Built core ERP front-end modules: inventory management, sales, purchases, and reports

### Scaleup Gurus — Senior Front-End Developer (Sep 2021 – Dec 2021)
- Led a team of 3 developers in redesigning the Saferoad vehicle tracking platform
- Technologies: ReactJS, NextJS, Leaflet Map, Firebase

### Etolv Company — Full-Stack Developer (Sep 2019 – Oct 2021)
- Developed responsive web applications from PSD designs
- Integrated RESTful APIs across tourism, eCommerce, and accounting platforms
- Mobile-first apps developed with Flutter
- Projects: Trio Travel, Lapia Shopping (ReactJS), Factory Accounting System, Meat Project (Flutter), Aoun Project (Flutter)

### Freelance Software Developer (2017 – 2019)
- Built web projects using HTML, CSS, JavaScript, and Angular
- LAN Network Manager: desktop tool for monitoring/managing local networks (C#)
- Remote PC Controller: desktop app for remote control of computers over local network (C#)

## Key Projects

1. **Nusuk Platform** — Saudi Arabia's official Hajj & Umrah digital platform. Key front-end features for pilgrim journey management, booking flows, and identity verification. (Angular, TypeScript, SASS, RESTful API, Multi-language)
2. **CRS — Central Reservation System** — Enterprise-level consular and visa management system. Complex form workflows, real-time API integration, multi-language support. (Angular, TypeScript, Material UI, SASS, i18n)
3. **Rasd ERP System** — Full front-end leadership of large-scale ERP: inventory, sales, purchases, tax billing, financial reporting. (Angular, TypeScript, Material UI, SASS)
4. **Conkit Platform** — Internal operations and workflow management platform for Tasheer service centers. (Angular, TypeScript, Bootstrap, SASS)
5. **Saferoad Vehicle Tracking** — Real-time vehicle tracking with Leaflet Map and Firebase. (ReactJS, NextJS, Firebase)
6. **Sah Platform** — Real estate portal and admin dashboard. (Angular, TypeScript, Bootstrap)
7. **Trio Travel** — Tourism management system with integrated accounting. (HTML5, CSS3, JavaScript, PHP)
8. **Lapia Shopping** — E-commerce shopping platform. (ReactJS)

## Tech Stack

- **Front-End:** Angular, ReactJS, Next.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, SASS, Tailwind CSS
- **State Management:** NgRx, RxJS, Angular Signals
- **UI Frameworks:** Bootstrap, Material UI, jQuery
- **Back-End:** PHP, Laravel, Lumen, RESTful API, Socket Programming
- **Tools:** Git, GitHub, GitLab, Webpack, CI/CD, SOLID Principles, Design Patterns, Agile/Scrum

## Soft Skills

Team Leadership, Sprint Planning, Code Reviews, Mentoring, Problem Solving, Communication, Adaptability, Working Under Pressure

## Education

**Bachelor of Information Systems** — Academy of the Pharaohs, Egypt (2014–2018)
- Graduation Project: eCommerce Website — Grade: Excellent

## Certifications

- One Million Arab Coders (Udacity) — Full Stack Development Track (2019)
- Route Academy — Full Stack: Angular & Laravel (2018)

## Languages

- Arabic: Native
- English: Good

## Guidelines for answers:
- Be professional, concise, and helpful
- Answer questions about Mahmoud's experience, skills, and projects
- For contact inquiries, mention email: mahmoud.bekheet63@gmail.com or phone: +20 120 220 6788
- If asked about something not in this profile, say it's not information you have available
- Keep responses focused on professional topics
- Respond in the same language the user writes in (Arabic or English)`;

router.post("/chat", async (req, res) => {
  const { messages, sessionId } = req.body as {
    messages: { role: "user" | "assistant"; content: string }[];
    sessionId?: string;
    lang?: string;
    currentPage?: string;
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages array is required" });
    return;
  }

  // Validate and filter messages
  const validMessages = messages
    .filter(
      (m) =>
        m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim() !== "",
    )
    .map((m) => ({ role: m.role, content: m.content }));

  if (validMessages.length === 0) {
    res.status(400).json({ error: "No valid messages provided" });
    return;
  }

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders();

  const sendEvent = (eventType: string, data: unknown) => {
    res.write(`event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`);
    // Flush if available
    if (typeof (res as { flush?: () => void }).flush === "function") {
      (res as { flush: () => void }).flush();
    }
  };

  // Resolve Gemini credentials.
  // - On Replit: AI_INTEGRATIONS_GEMINI_BASE_URL + AI_INTEGRATIONS_GEMINI_API_KEY (free, billed via Replit)
  // - On local Docker / standalone: GOOGLE_API_KEY (free tier from https://aistudio.google.com/apikey)
  const replitBaseUrl = process.env["AI_INTEGRATIONS_GEMINI_BASE_URL"];
  const replitApiKey = process.env["AI_INTEGRATIONS_GEMINI_API_KEY"];
  const googleApiKey = process.env["GOOGLE_API_KEY"];

  const apiKey = replitApiKey ?? googleApiKey;

  if (!apiKey) {
    sendEvent("error", { text: "AI service not configured" });
    res.write("data: [DONE]\n\n");
    res.end();
    return;
  }

  const client = new GoogleGenAI({
    apiKey,
    ...(replitBaseUrl
      ? { httpOptions: { apiVersion: "", baseUrl: replitBaseUrl } }
      : {}),
  });

  let sentAnyText = false;

  try {
    const stream = await client.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: validMessages.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 8192,
      },
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        sentAnyText = true;
        sendEvent("message", { text });
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("Chat error:", err);
    // Only show the error message if we never sent any text. Otherwise the
    // error string would get appended to the partial response on the client.
    if (!sentAnyText) {
      sendEvent("message", {
        text: "Sorry, I encountered an error. Please try again.",
      });
    }
    res.write("data: [DONE]\n\n");
    res.end();
  }
});

export default router;
