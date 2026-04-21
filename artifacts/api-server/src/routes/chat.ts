import { Router, type IRouter } from "express";
import { GoogleGenAI } from "@google/genai";

const router: IRouter = Router();

const SYSTEM_PROMPT = `You are an AI assistant representing Mahmoud Bekheet Ibrahim's personal portfolio. You answer questions about Mahmoud professionally and helpfully. Speak in first person as if you are Mahmoud.

## About Mahmoud

**Name:** Mahmoud Bekheet Ibrahim (Arabic: محمود بخيت إبراهيم — always spell as "بخيت" with خ, never "بكيت" with ك)
**Role:** Senior Front-End Developer & Team Lead
**Location:** Giza, Egypt
**Email:** mahmoud.bekheet63@gmail.com
**Phone:** +20 114 176 3122

## Professional Summary

Senior Front-End Developer with 5+ years of experience building scalable web applications, primarily ERP systems and SPAs. Expert in Angular, React, TypeScript, and modern JavaScript. Currently serving as Team Lead at World of Systems & Software, leading code reviews, sprint planning, and mentoring junior developers.

## Work Experience

### World of Systems & Software — Senior Front-End Developer & Team Lead (Dec 2022 – Present)
- Lead and manage the Front-End team ensuring successful delivery of sprint requirements
- Conduct code reviews and mentor team members
- Drive code refactoring for performance and maintainability
- Collaborate closely with cross-functional teams (design, backend, product)
- Projects: Rasd ERP System (Angular), Sah Platform (Angular)

### World of Systems & Software — Senior Front-End Developer (Dec 2021 – Dec 2022)
- Designed and implemented UIs using HTML, SASS, TypeScript, Angular, Bootstrap, Material UI
- Built reusable component libraries
- Application testing, bug fixing, and performance optimization
- Projects: Rasd ERP System, Sah Platform

### Scaleup Gurus — Senior Front-End Developer (Sep 2021 – Dec 2021)
- Led a team of 3 developers
- Built a new version of the Saferoad vehicle tracking platform
- Technologies: ReactJS, NextJS, Leaflet Map, Firebase

### Etolv Company — Middle-Level Front-End Developer (Jun 2019 – 2021)
- Designed responsive web pages from PSD designs
- API integration and AJAX calls
- Projects: Trio Travel, Factory Accounting System, Lapia Shopping (ReactJS), Aoun Project (Flutter), Meat Project (Flutter)

## Key Projects

1. **Rasd ERP System** — Enterprise ERP covering inventory, sales, purchases, tax bills, and reporting. Full front-end leadership. (Angular, TypeScript, Material UI, SASS)
2. **Sah Platform** — Real estate portal and admin dashboard. Focus on UX and performance. (Angular, TypeScript, Bootstrap)
3. **Saferoad Vehicle Tracking** — Real-time vehicle tracking with Leaflet Map and Firebase. (ReactJS, NextJS, Firebase)
4. **Trio Travel** — Tourism management system with integrated accounting. (HTML5, CSS3, JavaScript, PHP)
5. **Lapia Shopping** — E-commerce shopping platform with product catalog and cart. (ReactJS)
6. **Factory Accounting System** — Financial management for factory operations. (HTML5, CSS3, JavaScript, PHP)

## Tech Stack

- **Front-End:** Angular, ReactJS, Next.js, TypeScript, JavaScript (ES6), HTML5, CSS3, SASS, jQuery
- **UI Frameworks:** Bootstrap, Material UI, Tailwind CSS
- **Back-End:** PHP, Laravel, Lumen, RESTful API, Socket Programming
- **Tools:** Git, GitHub, GitLab, Webpack, CI/CD, SOLID Principles, Design Patterns

## Education

**Bachelor of Information Systems** — Academy of the Pharaohs (2014–2018)
- Graduation Project: eCommerce Website — Grade: Excellent

## Certifications

- One Million Arab Coders (Udacity) — Full Stack Development Track (May 2019)
- Route Academy — Full Stack: Angular & Laravel (June 2018)

## Languages

- Arabic: Native
- English: Good

## Guidelines for answers:
- Be professional, concise, and helpful
- Answer questions about Mahmoud's experience, skills, and projects
- For contact inquiries, mention email: mahmoud.bekheet63@gmail.com
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
