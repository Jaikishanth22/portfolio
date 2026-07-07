import React, { useState, useEffect, useRef, useCallback } from 'react';
import GradientText from './components/ui/GradientText';
import LogoLoop from './components/ui/LogoLoop';
import Prism from './components/ui/Prism';
import { PixelCanvas } from './components/ui/pixel-logo-grid';
import FaultyTerminal from './components/ui/FaultyTerminal';

// Tech Icons
import {
  SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiNodedotjs,
  SiPostgresql, SiPython, SiCplusplus, SiJavascript, SiMongodb,
  SiDocker, SiGit, SiHtml5,
  SiAngular, SiPostman, SiVercel
} from 'react-icons/si';
import { FaJava, FaDatabase, FaCss3Alt } from 'react-icons/fa';
import { VscVscode } from 'react-icons/vsc';

const techLogos = [
  { node: <SiReact />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  { node: <SiNodedotjs />, title: "Node.js", href: "https://nodejs.org" },
  { node: <SiPostgresql />, title: "PostgreSQL", href: "https://www.postgresql.org" },
  { node: <SiPython />, title: "Python", href: "https://www.python.org" },
  { node: <SiCplusplus />, title: "C++", href: "https://isocpp.org" },
  { node: <SiJavascript />, title: "JavaScript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  { node: <SiMongodb />, title: "MongoDB", href: "https://www.mongodb.com" },
  { node: <SiDocker />, title: "Docker", href: "https://www.docker.com" },
  { node: <SiGit />, title: "Git", href: "https://git-scm.com" }
];

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('#home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [twText, setTwText] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  
  // Cursor (disabled)
  const mousePos = { x: 0, y: 0 };
  const ringPos = { x: 0, y: 0 };
  const isHovering = false;
  const isClicking = false;
  const setIsHovering = () => {};

  // Typewriter Config
  const words = [
    "is coding... 💻",
    "designing Framer Motion springs... 🎨",
    "optimizing page speed 100/100... ⚡",
    "crafting tailwind layouts... 💎",
    "fetching client-side state... 🚀",
    "testing interactive layouts... ✨"
  ];
  const wordIdxRef = useRef(0);
  const charIdxRef = useRef(0);
  const isDeletingRef = useRef(false);

  // Apply theme class
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Terminal Build Loop
  useEffect(() => {
    const logs = [
      "git push origin main",
      "connecting to build server...",
      "✓ 448 modules transformed.",
      "✓ running unit tests (32/32 passed)",
      "✓ compiling types...",
      "✓ running database migrations...",
      "✓ optimizing bundle sizes...",
      "🚀 deploy successful to production!",
      "server latency: 14ms",
      "monitoring active connection..."
    ];
    let currentLogIndex = 0;
    
    const timer = setInterval(() => {
      setTerminalLogs((prev) => {
        if (currentLogIndex >= logs.length) {
          currentLogIndex = 0;
          return [logs[0]];
        }
        const updated = [...prev, logs[currentLogIndex]];
        currentLogIndex++;
        if (updated.length > 5) {
          updated.shift();
        }
        return updated;
      });
    }, 2500);

    setTerminalLogs([logs[0]]);
    currentLogIndex = 1;

    return () => clearInterval(timer);
  }, []);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setNavScrolled(window.scrollY > 20);
      
      // Update active nav link
      const sections = document.querySelectorAll('section[id]');
      const scrollY = window.scrollY + 100;
      let current = '#home';
      
      sections.forEach(sec => {
        const top = (sec as HTMLElement).offsetTop;
        if (top <= scrollY) {
          current = `#${sec.id}`;
        }
      });
      setActiveLink(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Typewriter Loop
  useEffect(() => {
    let timer: number;
    
    const type = () => {
      const wordIdx = wordIdxRef.current;
      const charIdx = charIdxRef.current;
      const isDeleting = isDeletingRef.current;
      const currentWord = words[wordIdx];
      
      if (isDeleting) {
        setTwText(currentWord.substring(0, charIdx - 1));
        charIdxRef.current = charIdx - 1;
      } else {
        setTwText(currentWord.substring(0, charIdx + 1));
        charIdxRef.current = charIdx + 1;
      }
      
      let speed = isDeleting ? 30 : 60;
      
      if (!isDeleting && charIdxRef.current === currentWord.length) {
        speed = 2200;
        isDeletingRef.current = true;
      } else if (isDeleting && charIdxRef.current === 0) {
        isDeletingRef.current = false;
        wordIdxRef.current = (wordIdx + 1) % words.length;
        speed = 400;
      }
      
      timer = window.setTimeout(type, speed);
    };
    
    timer = window.setTimeout(type, 100);
    return () => clearTimeout(timer);
  }, []);



  // IntersectionObserver for scroll reveals
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    const revealElements = document.querySelectorAll('[data-reveal]');
    revealElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  // Magnetic button hook
  const handleMagneticMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const btn = e.currentTarget;
    const r = btn.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) * 0.25;
    const dy = (e.clientY - (r.top + r.height / 2)) * 0.25;
    btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
  };

  const handleMagneticLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.transform = '';
  };

  const SUN_SVG = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );

  const MOON_SVG = (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );

  return (
    <>
      {/* 🔮 Prism Background WebGL Canvas */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -2, pointerEvents: 'none', opacity: 0.18 }}>
        <Prism
          animationType="rotate"
          timeScale={0.12}
          height={3.0}
          baseWidth={5.0}
          scale={2.6}
          hueShift={0}
          colorFrequency={1.0}
          noise={0.2}
          glow={1.1}
        />
      </div>


      {/* ════════════════════════════════════════
           NAVIGATION
      ════════════════════════════════════════ */}
      <nav className={`nav ${navScrolled ? 'scrolled' : ''}`} role="navigation">
        <a className="nav-logo" href="#home" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>JK.</a>

        <div className="nav-right">
          <ul className="nav-links" role="list">
            <li><a className={`nav-link ${activeLink === '#home' ? 'active' : ''}`} href="#home" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>Home</a></li>
            <li><a className={`nav-link ${activeLink === '#about' ? 'active' : ''}`} href="#about" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>About</a></li>
            <li><a className={`nav-link ${activeLink === '#projects' ? 'active' : ''}`} href="#projects" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>Projects</a></li>
            <li><a className={`nav-link ${activeLink === '#experience' ? 'active' : ''}`} href="#experience" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>Experience</a></li>
            <li><a className={`nav-link ${activeLink === '#skills' ? 'active' : ''}`} href="#skills" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>Skills</a></li>
            <li><a className={`nav-link ${activeLink === '#contact' ? 'active' : ''}`} href="#contact" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>Contact</a></li>
          </ul>
          <a 
            className="nav-resume resume-link" 
            href="/resume.pdf" 
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setIsHovering(true)} 
            onMouseLeave={() => setIsHovering(false)}
          >
            Resume ↗
          </a>
          <button 
            className="theme-toggle" 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            onMouseEnter={() => setIsHovering(true)} 
            onMouseLeave={() => setIsHovering(false)}
          >
            <span>{theme === 'dark' ? SUN_SVG : MOON_SVG}</span>
          </button>
          <button 
            className={`nav-hamburger ${isMenuOpen ? 'open' : ''}`} 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <nav className={`nav-drawer ${isMenuOpen ? 'open' : ''}`}>
        <a className="nav-link" href="#home" onClick={() => setIsMenuOpen(false)}>Home</a>
        <a className="nav-link" href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
        <a className="nav-link" href="#projects" onClick={() => setIsMenuOpen(false)}>Projects</a>
        <a className="nav-link" href="#experience" onClick={() => setIsMenuOpen(false)}>Experience</a>
        <a className="nav-link" href="#skills" onClick={() => setIsMenuOpen(false)}>Skills</a>
        <a className="nav-link" href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
        <a 
          className="nav-resume resume-link" 
          href="/resume.pdf" 
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setIsMenuOpen(false)}
          style={{ marginTop: '8px', width: 'fit-content' }}
        >
          Resume ↗
        </a>
      </nav>

      {/* ════════════════════════════════════════
           HERO
      ════════════════════════════════════════ */}
      <section id="home" className="hero">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />

        <div className="hero-left">
          <span className="hero-label">
            <span className="hero-label-line" />
            Full Stack Developer · AI Enthusiast
          </span>

          {/* 🌟 GradientText integration for his name */}
          <h1 className="hero-name" style={{ fontFamily: "'Inter Tight', sans-serif", fontWeight: 800 }}>
            <span className="hero-name-wrap" style={{ display: 'inline-flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', overflow: 'visible' }}>
              <span 
                className="hero-name-line hero-name-gradient" 
                style={{ 
                  animationDelay: '0.28s',
                  fontWeight: 800 
                }}
              >
                Jai
              </span>
              <span 
                className="hero-name-line hero-name-gradient" 
                style={{ 
                  animationDelay: '0.40s',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  letterSpacing: '-0.04em'
                }}
              >
                Kishanth
              </span>
            </span>
          </h1>

          {/* Typewriter chip */}
          <div className="hero-tw-chip">
            <span className="tw-live-dot" />
            <span className="tw-prefix">→&nbsp;</span>
            <span className="tw-text">{twText}</span>
            <span className="tw-cursor" />
          </div>

          <p className="hero-tagline">
            Building digital products that are<br/>
            elegant, scalable and human&#8209;centered.
          </p>

          <p className="hero-bio">
            Computer Science Engineering student at SRM University, passionate about Full Stack Development, Artificial Intelligence, and creating meaningful digital experiences.
          </p>

          <div className="hero-ctas">
            <a 
              className="btn-primary magnetic" 
              href="#projects"
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              onMouseEnter={() => setIsHovering(true)} 
              onMouseLeave2={() => setIsHovering(false)}
            >
              View Selected Work
              <span className="btn-arrow">↗</span>
            </a>
            <a 
              className="btn-secondary magnetic resume-link" 
              href="/resume.pdf"
              download="Jai_Kishanth_Resume.pdf"
              onMouseMove={handleMagneticMove}
              onMouseLeave={handleMagneticLeave}
              onMouseEnter={() => setIsHovering(true)} 
              onMouseLeave2={() => setIsHovering(false)}
            >
              Download Resume
            </a>
          </div>
        </div>



        {/* Scroll indicator */}
        <div className="hero-scroll" aria-hidden="true">
          <span className="hero-scroll-text">Scroll</span>
          <div className="hero-scroll-line"></div>
        </div>
      </section>

      {/* 🚀 Horizontal LogoLoop Ticker */}
      <div className="section-divider" />
      <section className="tech-loop-section" style={{ padding: '36px 0', background: 'rgba(255,255,255,0.01)', overflow: 'hidden' }}>
        <LogoLoop
          logos={techLogos}
          speed={60}
          direction="left"
          logoHeight={30}
          gap={48}
          scaleOnHover
          fadeOut
          fadeOutColor="#05050a"
          ariaLabel="Technology stack ticker"
        />
      </section>
      <div className="section-divider" />

      {/* ════════════════════════════════════════
           ABOUT
      ════════════════════════════════════════ */}
      <section id="about" className="about">
        <span className="section-tag" data-reveal="fade">About Jai</span>
        <div className="about-inner">
          <div className="about-left" data-reveal="left">
            <h2 className="section-heading">
              Engineering<br/>
              excellence with<br/>
              thoughtful design.
            </h2>
            <blockquote className="about-quote">
              "Craftsmanship is not just how it looks, but how it is engineered at its foundation."
              <cite className="about-quote-attr">— Jai Kishanth</cite>
            </blockquote>
          </div>

          <div className="about-right" data-reveal="right">
            <div className="about-bio">
              <p>
                I am a <strong>Computer Science Engineering student</strong> at SRM Institute of Science and Technology, passionate about the intersection of elegant frontend user interfaces and high-performance backend systems.
              </p>
              <p>
                My focus lies in building intelligent digital products. Whether developing <strong>AI computer vision applications</strong> utilizing YOLOv8 or crafting <strong>type-safe React web applications</strong>, I strive for clean architecture and optimized codebases.
              </p>
              <p>
                I believe in engineering things "the right way" — paying attention to micro-interactions, responsive flows, fast rendering times, and clean UI components.
              </p>
            </div>

            {/* Sleek Minimalist Education Card */}
            <div className="edu-card" data-reveal="up" data-delay="2">
              <div className="edu-card-top">
                <div>
                  <h3 className="edu-uni-name">SRM Institute of Science &amp; Technology</h3>
                  <div className="edu-degree">Bachelor of Technology</div>
                  <div className="edu-field">Computer Science Engineering</div>
                </div>
                <span className="edu-period">2022 — 2026</span>
              </div>
              <div className="edu-card-divider" />
              <div className="edu-card-bottom" style={{ justifyContent: 'flex-end' }}>
                <span className="edu-status-pill">Pursuing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ════════════════════════════════════════
           PROJECTS
      ════════════════════════════════════════ */}
      <section id="projects" className="projects">
        <span className="section-tag" data-reveal="fade">Selected Projects</span>
        <div className="projects-inner">
          <div className="projects-header">
            <h2 className="section-heading" data-reveal="fade">Featured Work</h2>
            <span className="projects-count" data-reveal="fade">05 Projects</span>
          </div>

          <div className="projects-grid">
            {/* Project 1 */}
            <article className="project-card featured glow-card" data-reveal="scale">
              <div className="project-inner">
                <div className="project-img-wrap">
                  <img src="project-hospital.jpg" alt="AI Hospital Dashboard" />
                </div>
                <div className="project-content">
                  <span className="project-status status-featured">
                    <span className="project-status-dot" />
                    Featured
                  </span>
                  <h3 className="project-title">AI Hospital Management System</h3>
                  <p className="project-desc">
                    A comprehensive health-tech platform engineered to automate patient queues and streamline hospital workflows. Features high-uptime client dashboards and custom paginated API endpoints.
                  </p>
                  <div className="project-tech">
                    <span className="project-tech-tag">React</span>
                    <span className="project-tech-tag">Next.js</span>
                    <span className="project-tech-tag">TypeScript</span>
                    <span className="project-tech-tag">PostgreSQL</span>
                  </div>
                  <div className="project-actions">
                    <a className="proj-btn primary" href="https://github.com/Jaikishanth22/MED" target="_blank" rel="noopener noreferrer">Source Code</a>
                  </div>
                </div>
              </div>
            </article>

            {/* Project 2 */}
            <article className="project-card glow-card" data-reveal="up" data-delay="1">
              <div className="project-inner">
                <div className="project-img-wrap">
                  <img src="project-safety.jpg" alt="Industrial Safety" />
                </div>
                <div className="project-content">
                  <span className="project-status status-cv">
                    <span className="project-status-dot" />
                    Computer Vision
                  </span>
                  <h3 className="project-title">Industrial Safety Monitoring</h3>
                  <p className="project-desc">
                    An AI computer vision system designed to monitor workplace environments. Detects PPE compliance (helmets, vests) in real time using YOLOv8 models.
                  </p>
                  <div className="project-tech">
                    <span className="project-tech-tag">Python</span>
                    <span className="project-tech-tag">YOLOv8</span>
                    <span className="project-tech-tag">OpenCV</span>
                  </div>
                  <div className="project-actions">
                    <a className="proj-btn primary" href="https://github.com/Jaikishanth22/ppe-detection" target="_blank" rel="noopener noreferrer">Source Code</a>
                  </div>
                </div>
              </div>
            </article>

            {/* Project 3 */}
            <article className="project-card glow-card" data-reveal="up" data-delay="2">
              <div className="project-inner">
                <div className="project-img-wrap">
                  <img src="project-cinema.jpg" alt="Movie Ticket Booking" />
                </div>
                <div className="project-content">
                  <span className="project-status status-web">
                    <span className="project-status-dot" />
                    Web App
                  </span>
                  <h3 className="project-title">Movie Ticket Booking Platform</h3>
                  <p className="project-desc">
                    A dynamic web platform showcasing custom interactive seating layouts, ticket purchases, and a comprehensive movie listings catalog.
                  </p>
                  <div className="project-tech">
                    <span className="project-tech-tag">PHP</span>
                    <span className="project-tech-tag">HTML/CSS</span>
                    <span className="project-tech-tag">MySQL</span>
                  </div>
                  <div className="project-actions">
                    <a className="proj-btn primary" href="https://github.com/Jaikishanth22/online-movie-ticket-booking-" target="_blank" rel="noopener noreferrer">Source Code</a>
                  </div>
                </div>
              </div>
            </article>

            {/* Project 4 */}
            <article className="project-card glow-card" data-reveal="up" data-delay="3">
              <div className="project-inner">
                <div className="project-img-wrap">
                  <img src="project-mouse.jpg" alt="Virtual Mouse" />
                </div>
                <div className="project-content">
                  <span className="project-status status-cv">
                    <span className="project-status-dot" />
                    AI &amp; Vision
                  </span>
                  <h3 className="project-title">Gesture Virtual Mouse</h3>
                  <p className="project-desc">
                    A hands-free controller application utilizing MediaPipe hands models. Controls OS mouse movements and actions via real-time finger gestures.
                  </p>
                  <div className="project-tech">
                    <span className="project-tech-tag">Python</span>
                    <span className="project-tech-tag">MediaPipe</span>
                    <span className="project-tech-tag">PyAutoGUI</span>
                  </div>
                  <div className="project-actions">
                    <a className="proj-btn primary" href="https://github.com/Jaikishanth22/virtual-mouse" target="_blank" rel="noopener noreferrer">Source Code</a>
                  </div>
                </div>
              </div>
            </article>

            {/* Project 5 */}
            <article className="project-card glow-card" data-reveal="up" data-delay="1">
              <div className="project-inner">
                <div className="project-img-wrap">
                  <img src="project-finai.png" alt="finAI Dashboard" />
                </div>
                <div className="project-content">
                  <span className="project-status status-featured">
                    <span className="project-status-dot" />
                    SaaS Platform
                  </span>
                  <h3 className="project-title">finAI — Micro-Investing Platform</h3>
                  <p className="project-desc">
                    An AI-powered, full-stack micro-investing SaaS platform that automates round-up fractional investments and delivers context-aware financial advice.
                  </p>
                  <div className="project-tech">
                    <span className="project-tech-tag">Next.js</span>
                    <span className="project-tech-tag">TypeScript</span>
                    <span className="project-tech-tag">PostgreSQL</span>
                    <span className="project-tech-tag">Tailwind CSS</span>
                  </div>
                  <div className="project-actions">
                    <a className="proj-btn primary" href="https://github.com/Jaikishanth22/finAI" target="_blank" rel="noopener noreferrer">Source Code</a>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ════════════════════════════════════════
           EXPERIENCE
      ════════════════════════════════════════ */}
      <section id="experience" className="experience">
        <span className="section-tag" data-reveal="fade">Career Spine</span>
        <div className="experience-inner">
          <h2 className="section-heading" data-reveal="fade" style={{ marginBottom: '48px' }}>Experience</h2>
          
          <div className="timeline">
            {/* Experience Item */}
            <div className="timeline-item" data-reveal="up">
              <div className="timeline-left">
                <time className="timeline-period">MAY 2024 — JUL 2024</time>
              </div>
              <div className="timeline-spine">
                <span className="timeline-dot" />
              </div>
              <div className="timeline-right">
                <h3 className="timeline-role">Web Developer Intern</h3>
                <div className="timeline-company">SRM University (Medical Research Division)</div>
                <p className="timeline-desc">
                  Collaborated on the AI Hospital queue automation dashboard. Assisted in optimizing SQL query times, integrating state layers, and improving patient intake responsiveness.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* ════════════════════════════════════════
           SKILLS
      ════════════════════════════════════════ */}
      <section id="skills" className="skills">
        <span className="section-tag" data-reveal="fade">Core Competencies</span>
        <div className="skills-inner">
          <h2 className="section-heading" data-reveal="fade">Technical Stack</h2>
          
          <div className="skills-grid">
            {/* Skill Card 1 - Technical Stack */}
            <div className="skill-card glow-card" data-cat="blue" data-reveal="up" data-delay="1" style={{ position: 'relative', overflow: 'hidden' }}>
              <PixelCanvas colors={["#82B4FF", "#00D4B2", "rgba(255,255,255,0.01)"]} gap={6} speed={30} />
              <div className="skill-card-top">
                <div>
                  <h3 className="skill-uni-name">Technical Stack</h3>
                  <div className="skill-degree">Core programming, databases, &amp; frameworks</div>
                </div>
                <span className="skill-period">5 Technologies</span>
              </div>
              <div className="skill-card-divider" />
              <div className="skill-tags">
                <span className="skill-tag">
                  <FaJava style={{ color: '#f89820' }} />
                  <span>JAVA</span>
                </span>
                <span className="skill-tag">
                  <span style={{ display: 'inline-flex', gap: '3px', alignItems: 'center' }}>
                    <SiHtml5 style={{ color: '#e34f26' }} />
                    <FaCss3Alt style={{ color: '#1572b6' }} />
                  </span>
                  <span>html,css</span>
                </span>
                <span className="skill-tag">
                  <FaDatabase style={{ color: '#00758f' }} />
                  <span>SQL</span>
                </span>
                <span className="skill-tag">
                  <SiAngular style={{ color: '#dd0031' }} />
                  <span>ANGULAR JS</span>
                </span>
                <span className="skill-tag">
                  <SiReact style={{ color: '#61dafb' }} />
                  <span>React JS</span>
                </span>
              </div>
            </div>

            {/* Skill Card 2 - Developer Platforms */}
            <div className="skill-card glow-card" data-cat="teal" data-reveal="up" data-delay="2" style={{ position: 'relative', overflow: 'hidden' }}>
              <PixelCanvas colors={["#2DD4BF", "#0D9488", "rgba(255,255,255,0.01)"]} gap={6} speed={30} />
              <div className="skill-card-top">
                <div>
                  <h3 className="skill-uni-name">Developer Platforms</h3>
                  <div className="skill-degree">Collaboration, tools, &amp; hosting environments</div>
                </div>
                <span className="skill-period">5 Tools</span>
              </div>
              <div className="skill-card-divider" />
              <div className="skill-tags">
                <span className="skill-tag">
                  <SiGit style={{ color: '#f05032' }} />
                  <span>Git / GitHub</span>
                </span>
                <span className="skill-tag">
                  <VscVscode style={{ color: '#007acc' }} />
                  <span>VS Code</span>
                </span>
                <span className="skill-tag">
                  <SiDocker style={{ color: '#2496ed' }} />
                  <span>Docker</span>
                </span>
                <span className="skill-tag">
                  <SiPostman style={{ color: '#ff6c37' }} />
                  <span>Postman</span>
                </span>
                <span className="skill-tag">
                  <SiVercel style={{ color: '#ffffff' }} />
                  <span>Vercel</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* ════════════════════════════════════════
           CONTACT
      ════════════════════════════════════════ */}
      <section id="contact" className="contact">
        <div className="contact-inner">
          <h2 className="contact-heading" data-reveal="fade">
            Let's build<br/>
            something <em>extraordinary</em>.
          </h2>
          <p className="contact-sub" data-reveal="fade" data-delay="1">
            Always open to collaborations, innovative projects, or full-time opportunities. Reach out and let's start a conversation.
          </p>

          <div className="contact-links-grid" data-reveal="up" data-delay="2">
            <a className="contact-link" href="mailto:jaikishanth206@gmail.com" data-type="email" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              jaikishanth206@gmail.com
            </a>

            <a className="contact-link" href="tel:+917806887715" data-type="phone" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.6 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.5 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 5.58 5.58l.87-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.03z"/>
              </svg>
              +91 7806 887 715
            </a>

            <a className="contact-link" href="https://github.com/Jaikishanth22" target="_blank" rel="noopener noreferrer" data-type="github" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
              </svg>
              github.com/Jaikishanth22
            </a>

            <a className="contact-link" href="https://linkedin.com/in/jai-kishanth-4942aa343" target="_blank" rel="noopener noreferrer" data-type="linkedin" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              linkedin.com/in/jai-kishanth
            </a>

            <a className="contact-link" href="https://maps.google.com/?q=Chennai,India" target="_blank" rel="noopener noreferrer" data-type="location" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Chennai, India
            </a>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
           FOOTER
      ════════════════════════════════════════ */}
      <footer className="footer" role="contentinfo">
        <a className="footer-logo" href="#home" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>JK.</a>
        <p className="footer-copy">
          Designed &amp; built by Jai Kishanth<br/>
          Chennai, India · 2025
        </p>
      </footer>

      {/* Resume Modal */}
      <div 
        style={{
          position: 'fixed', inset: 0, zIndex: 9990,
          background: 'rgba(5,5,10,0.88)',
          backdropFilter: 'blur(20px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: isModalOpen ? 1 : 0,
          pointerEvents: isModalOpen ? 'auto' : 'none',
          transition: 'opacity 0.35s cubic-bezier(0.16,1,0.3,1)'
        }}
        onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false); }}
      >
        <div 
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderTop: '2px solid #82B4FF',
            borderRadius: '24px',
            padding: '56px',
            maxWidth: '480px', width: '90%',
            textAlign: 'center',
            transform: isModalOpen ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.96)',
            transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 32px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(130,180,255,0.08)'
          }}
        >
          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: '0.55rem', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#82B4FF', marginBottom: '20px' }}>Resume</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', fontWeight: 400, letterSpacing: '-0.02em', color: '#F0F0EE', marginBottom: '12px' }}>Available on Request</h2>
          <p style={{ fontSize: '0.9375rem', color: '#8B94A3', lineHeight: 1.65, marginBottom: '32px' }}>Reach out directly and I'll send over the latest version.</p>
          <a 
            href="mailto:jaikishanth206@gmail.com" 
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(130,180,255,0.1)',
              color: '#82B4FF', fontSize: '0.875rem', fontWeight: 500,
              padding: '12px 28px', borderRadius: '9999px',
              border: '1px solid rgba(130,180,255,0.25)',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.28s',
              textDecoration: 'none'
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(130,180,255,0.18)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(130,180,255,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            jaikishanth206@gmail.com →
          </a>
          <div style={{ marginTop: '20px' }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{
                background: 'transparent', border: '1px solid rgba(255,255,255,0.1)',
                color: '#525A68', fontSize: '0.8125rem', padding: '8px 20px', borderRadius: '9999px',
                cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Inter',sans-serif"
              }}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; e.currentTarget.style.color = '#8B94A3'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#525A68'; }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
