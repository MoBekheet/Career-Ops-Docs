import { motion } from "framer-motion";
import { Download, Mail, MapPin, Phone, Github, Linkedin, ExternalLink, Moon, Sun } from "lucide-react";
import { SiAngular, SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiHtml5, SiSass, SiJquery, SiBootstrap, SiMui, SiTailwindcss, SiPhp, SiLaravel, SiWebpack, SiGit, SiGitlab, SiGithub } from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/theme-provider";

export default function Home() {
  const { theme, setTheme } = useTheme();
  
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-primary">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-mono font-bold text-xl tracking-tighter">MB<span className="text-primary">.</span></span>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-32 pb-24 space-y-32">
        {/* Hero Section */}
        <section className="min-h-[70vh] flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="flex flex-col md:flex-row items-center gap-12"
          >
            <div className="flex-1 space-y-6">
              <motion.div {...fadeInUp} className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary font-mono mb-4">
                Senior Front-End Developer & Team Lead
              </motion.div>
              <motion.h1 {...fadeInUp} className="text-5xl md:text-7xl font-extrabold tracking-tight">
                Architecting <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Enterprise Scale</span> <br />
                Web Applications.
              </motion.h1>
              <motion.p {...fadeInUp} className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                I am Mahmoud Bekheet Ibrahim. With over 5 years of experience, I lead teams and build robust, scalable ERP systems and dynamic web applications.
              </motion.p>
              <motion.div {...fadeInUp} className="flex flex-wrap gap-4 pt-4">
                <Button size="lg" className="h-12 px-8 font-semibold" asChild>
                  <a href="#experience">View Experience</a>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 font-semibold" asChild>
                  <a href="#"><Download className="mr-2 h-4 w-4" /> Download CV</a>
                </Button>
              </motion.div>
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex-1 flex justify-center md:justify-end"
            >
              <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full border-4 border-border/50 p-2 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full -z-10" />
                <img src="/avatar.png" alt="Mahmoud Bekheet Ibrahim" className="w-full h-full object-cover rounded-full" />
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Professional Summary & Objective */}
        <motion.section 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid md:grid-cols-2 gap-12"
        >
          <motion.div variants={fadeInUp} className="space-y-4">
            <h2 className="text-3xl font-bold border-b-2 border-primary/20 pb-2 inline-block">Professional Summary</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Senior Front-End Developer with extensive experience in ERP systems. Proficient in HTML5, CSS3, JavaScript, TypeScript, Angular, ReactJS, and NextJS. Strong background in cross-browser compatibility, responsive design, and SPA development. Experienced in integrating APIs and automation tools.
            </p>
          </motion.div>
          <motion.div variants={fadeInUp} className="space-y-4">
            <h2 className="text-3xl font-bold border-b-2 border-primary/20 pb-2 inline-block">Objective</h2>
            <p className="text-muted-foreground leading-relaxed text-lg">
              Seeking a Senior Front-End Developer position to leverage expertise in ERP systems and Angular to deliver scalable web applications. 5+ years of experience, excels in leading teams, enhancing code quality, and thriving in dynamic environments.
            </p>
          </motion.div>
        </motion.section>

        {/* Experience */}
        <section id="experience">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold">Work Experience</motion.h2>
            
            <div className="relative border-l border-border/50 ml-4 md:ml-0 space-y-12 pb-8">
              
              <motion.div variants={fadeInUp} className="relative pl-8 md:pl-12">
                <div className="absolute w-4 h-4 bg-primary rounded-full -left-[8.5px] top-1.5 ring-4 ring-background" />
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                      <div>
                        <CardTitle className="text-2xl text-primary">Senior Front-End Developer & Team Lead</CardTitle>
                        <CardDescription className="text-lg mt-1 font-medium text-foreground">World of Systems & Software</CardDescription>
                      </div>
                      <Badge variant="secondary" className="w-fit text-sm font-mono">Dec 2022 – Present</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="list-disc list-outside ml-5 text-muted-foreground space-y-2">
                      <li>Lead and manage Front-End team, ensuring successful delivery of sprint requirements</li>
                      <li>Conduct code reviews, share knowledge, mentor team members</li>
                      <li>Perform code refactoring to improve maintainability and performance</li>
                      <li>Collaborate with cross-functional teams for project deliverables</li>
                      <li>Sprint planning, estimating project timelines</li>
                    </ul>
                    <div className="pt-4 space-y-2">
                      <p className="font-semibold">Key Projects:</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Rasd ERP System</Badge>
                        <Badge variant="outline">Sah Platform</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp} className="relative pl-8 md:pl-12">
                <div className="absolute w-4 h-4 bg-muted-foreground rounded-full -left-[8.5px] top-1.5 ring-4 ring-background" />
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                      <div>
                        <CardTitle className="text-2xl">Senior Front-End Developer</CardTitle>
                        <CardDescription className="text-lg mt-1 font-medium text-foreground">World of Systems & Software</CardDescription>
                      </div>
                      <Badge variant="secondary" className="w-fit text-sm font-mono">Dec 2021 – Dec 2022</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="list-disc list-outside ml-5 text-muted-foreground space-y-2">
                      <li>Designed and implemented UIs using HTML, SASS, TypeScript, Angular, Bootstrap, Material UI</li>
                      <li>Built reusable code and libraries</li>
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp} className="relative pl-8 md:pl-12">
                <div className="absolute w-4 h-4 bg-muted-foreground rounded-full -left-[8.5px] top-1.5 ring-4 ring-background" />
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                      <div>
                        <CardTitle className="text-2xl">Senior Front-End Developer</CardTitle>
                        <CardDescription className="text-lg mt-1 font-medium text-foreground">Scaleup Gurus</CardDescription>
                      </div>
                      <Badge variant="secondary" className="w-fit text-sm font-mono">Sep 2021 – Dec 2021</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="list-disc list-outside ml-5 text-muted-foreground space-y-2">
                      <li>Led a team of 3 developers on Saferoad vehicle tracking project</li>
                    </ul>
                    <div className="pt-4 space-y-2">
                      <p className="font-semibold">Key Projects:</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Saferoad Vehicle Tracking (ReactJS, NextJS, Leaflet Map, Firebase)</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp} className="relative pl-8 md:pl-12">
                <div className="absolute w-4 h-4 bg-muted-foreground rounded-full -left-[8.5px] top-1.5 ring-4 ring-background" />
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                      <div>
                        <CardTitle className="text-2xl">Middle-Level Front-End Developer</CardTitle>
                        <CardDescription className="text-lg mt-1 font-medium text-foreground">Etolv Company</CardDescription>
                      </div>
                      <Badge variant="secondary" className="w-fit text-sm font-mono">June 2019 – 2021</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="list-disc list-outside ml-5 text-muted-foreground space-y-2">
                      <li>Responsive web pages from PSD designs using HTML5, CSS3, JavaScript, jQuery, Bootstrap</li>
                    </ul>
                    <div className="pt-4 space-y-2">
                      <p className="font-semibold">Key Projects:</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">Trio Travel</Badge>
                        <Badge variant="outline">Meat Project (Flutter)</Badge>
                        <Badge variant="outline">Aoun Project (Flutter)</Badge>
                        <Badge variant="outline">Factory Accounting System</Badge>
                        <Badge variant="outline">Lapia Shopping (ReactJS)</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

            </div>
          </motion.div>
        </section>

        {/* Skills */}
        <section>
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold">Technical Arsenal</motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              <motion.div variants={fadeInUp}>
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-xl">Frontend Ecosystem</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 text-sm font-medium"><SiAngular className="text-red-600" /> Angular</div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 text-sm font-medium"><SiReact className="text-cyan-400" /> ReactJS</div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 text-sm font-medium"><SiNextdotjs className="text-foreground" /> NextJS</div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 text-sm font-medium"><SiTypescript className="text-blue-500" /> TypeScript</div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 text-sm font-medium"><SiJavascript className="text-yellow-400" /> JavaScript (ES6)</div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 text-sm font-medium"><SiHtml5 className="text-orange-500" /> HTML5</div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 text-sm font-medium"><span className="text-blue-600 font-bold text-xs">CSS</span> CSS3</div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 text-sm font-medium"><SiSass className="text-pink-500" /> SASS</div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 text-sm font-medium"><SiJquery className="text-blue-400" /> jQuery</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-xl">UI Frameworks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 text-sm font-medium"><SiTailwindcss className="text-cyan-400" /> Tailwind CSS</div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 text-sm font-medium"><SiMui className="text-blue-500" /> Material UI</div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 text-sm font-medium"><SiBootstrap className="text-purple-600" /> Bootstrap</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <CardTitle className="text-xl">Backend & Tools</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 text-sm font-medium"><SiPhp className="text-indigo-400" /> PHP</div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 text-sm font-medium"><SiLaravel className="text-red-500" /> Laravel / Lumen</div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 text-sm font-medium"><SiWebpack className="text-blue-400" /> Webpack</div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 text-sm font-medium"><SiGit className="text-orange-600" /> Git</div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 text-sm font-medium">RESTful API</div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 text-sm font-medium">CI/CD</div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/50 text-sm font-medium">SOLID Principles</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

            </div>
          </motion.div>
        </section>

        {/* Education & Certifications */}
        <section>
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-12"
          >
            <div className="space-y-6">
              <motion.h2 variants={fadeInUp} className="text-3xl font-bold">Education</motion.h2>
              <motion.div variants={fadeInUp}>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Bachelor of Information Systems</CardTitle>
                    <CardDescription className="text-base text-foreground">Academy of the Pharaohs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2 font-mono text-sm">2014 – 2018</p>
                    <p className="text-muted-foreground">Graduation Project: eCommerce website (Grade: Excellent)</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
            <div className="space-y-6">
              <motion.h2 variants={fadeInUp} className="text-3xl font-bold">Certifications</motion.h2>
              <motion.div variants={fadeInUp} className="space-y-4">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg">Route Academy</CardTitle>
                    <CardDescription>Full Stack (Angular, Laravel) — June 2018</CardDescription>
                  </CardHeader>
                </Card>
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader className="py-4">
                    <CardTitle className="text-lg">One Million Arab Coders - Udacity</CardTitle>
                    <CardDescription>Full Stack Development Track — May 2019</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Contact */}
        <section id="contact">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl font-bold">Let's Connect</motion.h2>
            <motion.p variants={fadeInUp} className="text-lg text-muted-foreground">
              Currently seeking a Senior Front-End Developer position. Whether you have a question or just want to say hi, I'll try my best to get back to you!
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
              <a href="mailto:mahmoud.bekheet63@gmail.com" className="flex items-center justify-center gap-3 p-4 rounded-lg bg-card/50 border border-border/50 hover:border-primary/50 transition-colors">
                <div className="p-3 bg-primary/10 text-primary rounded-full"><Mail className="h-6 w-6" /></div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground font-medium">Email</p>
                  <p className="font-semibold">mahmoud.bekheet63@gmail.com</p>
                </div>
              </a>
              <a href="tel:+201141763122" className="flex items-center justify-center gap-3 p-4 rounded-lg bg-card/50 border border-border/50 hover:border-primary/50 transition-colors">
                <div className="p-3 bg-primary/10 text-primary rounded-full"><Phone className="h-6 w-6" /></div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground font-medium">Phone</p>
                  <p className="font-semibold">+201141763122</p>
                </div>
              </a>
            </motion.div>

            <motion.div variants={fadeInUp} className="flex items-center justify-center gap-4 pt-8">
              <Button variant="outline" size="icon" className="rounded-full h-12 w-12" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="outline" size="icon" className="rounded-full h-12 w-12" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <div className="flex items-center gap-2 text-muted-foreground ml-4">
                <MapPin className="h-4 w-4" />
                <span>Giza, Egypt</span>
              </div>
            </motion.div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-8 mt-12 text-center text-muted-foreground">
        <p>© {new Date().getFullYear()} Mahmoud Bekheet Ibrahim. All rights reserved.</p>
      </footer>
    </div>
  );
}
