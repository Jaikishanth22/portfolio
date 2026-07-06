/* ============================================================
   main.js — Portfolio Interactions
   GlowingEffect · Cursor · Scroll · Nav
   ============================================================ */

'use strict';

/* ── Helpers ── */
const qs  = (s, ctx = document) => ctx.querySelector(s);
const qsa = (s, ctx = document) => [...ctx.querySelectorAll(s)];

/* ============================================================
   THEME — default dark (user can toggle)
   ============================================================ */
const themeToggleBtn  = qs('#theme-toggle');
const themeIconEl     = qs('#theme-icon');

const SUN_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
</svg>`;

const MOON_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
</svg>`;

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('portfolio-theme', theme);
  if (themeIconEl) themeIconEl.innerHTML = theme === 'dark' ? SUN_SVG : MOON_SVG;
}

// Always start dark
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
applyTheme(savedTheme);

themeToggleBtn?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
const cursorDot  = qs('.cursor-dot');
const cursorRing = qs('.cursor-ring');

if (cursorDot && cursorRing) {
  let ringX = 0, ringY = 0;
  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';
  });

  // Smooth ring follow
  (function animateRing() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Hover state
  qsa('a, button, .skill-tag, .proj-btn, .contact-link').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hovering'));
  });

  document.addEventListener('mousedown', () => cursorRing.classList.add('clicking'));
  document.addEventListener('mouseup',   () => cursorRing.classList.remove('clicking'));

  // Hide on mobile
  document.addEventListener('touchstart', () => {
    cursorDot.style.display  = 'none';
    cursorRing.style.display = 'none';
  }, { once: true });
}

/* ============================================================
   GLOWING CARD EFFECT — GlowingEffect implementation in vanilla JS
   Tracks mouse angle → conic gradient border rotates with cursor
   Also tracks mouse position → inner spotlight follows mouse
   ============================================================ */
function initGlowingCards() {
  qsa('.glow-card').forEach(card => {
    let currentAngle   = 0;
    let targetAngle    = 0;
    let animFrameId    = null;
    let isHovering     = false;

    // Smooth angle interpolation (easeOutExpo)
    function lerpAngle(a, b, t) {
      let diff = ((b - a + 180) % 360) - 180;
      return a + diff * t;
    }

    function animateAngle() {
      if (!isHovering) return;
      currentAngle = lerpAngle(currentAngle, targetAngle, 0.08);
      card.style.setProperty('--glow-angle', currentAngle);
      animFrameId = requestAnimationFrame(animateAngle);
    }

    card.addEventListener('mouseenter', () => {
      isHovering = true;
      card.style.setProperty('--glow-active', '1');
      cancelAnimationFrame(animFrameId);
      animateAngle();
    });

    card.addEventListener('mouseleave', () => {
      isHovering = false;
      cancelAnimationFrame(animFrameId);
      card.style.setProperty('--glow-active', '0');
    });

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  * 0.5;
      const cy = rect.top  + rect.height * 0.5;

      // Mouse position relative to card (0–100%)
      const px = ((e.clientX - rect.left) / rect.width) * 100;
      const py = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mouse-x', px + '%');
      card.style.setProperty('--mouse-y', py + '%');

      // Angle from center of card to mouse
      const angleRad = Math.atan2(e.clientY - cy, e.clientX - cx);
      targetAngle = (angleRad * 180 / Math.PI) + 90;
    });
  });
}

initGlowingCards();

/* ============================================================
   NAVIGATION — scroll blur + active links
   ============================================================ */
const nav = qs('.nav');

window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 20);
  updateActiveNavLink();
}, { passive: true });

function updateActiveNavLink() {
  const sections = qsa('section[id]');
  const scrollY  = window.scrollY + 100;
  let current    = '';

  sections.forEach(sec => {
    if (sec.offsetTop <= scrollY) current = sec.id;
  });

  qsa('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
  });
}

/* ============================================================
   HAMBURGER
   ============================================================ */
const hamburger = qs('.nav-hamburger');
const drawer    = qs('.nav-drawer');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  drawer?.classList.toggle('open');
});

// Close drawer on link click
qsa('.nav-drawer .nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    drawer?.classList.remove('open');
  });
});

/* ============================================================
   SCROLL REVEAL — IntersectionObserver
   ============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

qsa('[data-reveal]').forEach(el => revealObserver.observe(el));

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
qsa('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = qs(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    hamburger?.classList.remove('open');
    drawer?.classList.remove('open');
  });
});

/* ============================================================
   RESUME MODAL (placeholder)
   ============================================================ */
const resumeLinks = qsa('.resume-link');

const modalBackdrop = document.createElement('div');
modalBackdrop.style.cssText = `
  position: fixed; inset: 0; z-index: 9990;
  background: rgba(5,5,10,0.88);
  backdrop-filter: blur(20px);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none;
  transition: opacity 0.35s cubic-bezier(0.16,1,0.3,1);
`;

const modalBox = document.createElement('div');
modalBox.style.cssText = `
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  border-top: 2px solid #82B4FF;
  border-radius: 24px;
  padding: 56px;
  max-width: 480px; width: 90%;
  text-align: center;
  transform: translateY(24px) scale(0.96);
  transition: transform 0.4s cubic-bezier(0.16,1,0.3,1);
  backdrop-filter: blur(20px);
  box-shadow: 0 32px 64px rgba(0,0,0,0.7), 0 0 0 1px rgba(130,180,255,0.08);
`;

modalBox.innerHTML = `
  <div style="font-family:'IBM Plex Mono',monospace;font-size:0.55rem;letter-spacing:0.14em;text-transform:uppercase;color:#82B4FF;margin-bottom:20px;">Resume</div>
  <h2 style="font-family:'Cormorant Garamond',serif;font-size:2rem;font-weight:400;letter-spacing:-0.02em;color:#F0F0EE;margin-bottom:12px;">Available on Request</h2>
  <p style="font-size:0.9375rem;color:#8B94A3;line-height:1.65;margin-bottom:32px;">Reach out directly and I'll send over the latest version.</p>
  <a href="mailto:jaikishanth206@gmail.com" style="
    display:inline-flex;align-items:center;gap:8px;
    background:rgba(130,180,255,0.1);
    color:#82B4FF;font-size:0.875rem;font-weight:500;
    padding:12px 28px;border-radius:9999px;
    border:1px solid rgba(130,180,255,0.25);
    backdrop-filter:blur(8px);
    transition:all 0.28s;
    text-decoration:none;
  " onmouseover="this.style.background='rgba(130,180,255,0.18)';this.style.transform='translateY(-2px)'"
     onmouseout="this.style.background='rgba(130,180,255,0.1)';this.style.transform='translateY(0)'">
    jaikishanth206@gmail.com →
  </a>
  <div style="margin-top:20px;">
    <button id="modal-close" style="
      background:transparent;border:1px solid rgba(255,255,255,0.1);
      color:#525A68;font-size:0.8125rem;padding:8px 20px;border-radius:9999px;
      cursor:pointer;transition:all 0.2s;font-family:'Inter',sans-serif;
    " onmouseover="this.style.borderColor='rgba(255,255,255,0.22)';this.style.color='#8B94A3'"
       onmouseout="this.style.borderColor='rgba(255,255,255,0.1)';this.style.color='#525A68'">
      Close
    </button>
  </div>
`;

modalBackdrop.appendChild(modalBox);
document.body.appendChild(modalBackdrop);

function openModal() {
  modalBackdrop.style.opacity = '1';
  modalBackdrop.style.pointerEvents = 'auto';
  modalBox.style.transform = 'translateY(0) scale(1)';
}

function closeModal() {
  modalBackdrop.style.opacity = '0';
  modalBackdrop.style.pointerEvents = 'none';
  modalBox.style.transform = 'translateY(24px) scale(0.96)';
}

resumeLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    openModal();
  });
});

qs('#modal-close')?.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', e => {
  if (e.target === modalBackdrop) closeModal();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

/* ============================================================
   ACTIVE ANIMATION SYSTEMS — Hero Right Composition & Chat
   ============================================================ */

// 1. Dynamic Counter Count-Up
function countUp(id, target, suffix = '', duration = 1500) {
  const el = qs(`#${id}`);
  if (!el) return;
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3); // cubic ease out
    const value = start + easeProgress * (target - start);
    
    if (suffix === '%') {
      el.textContent = value.toFixed(1) + suffix;
    } else {
      el.textContent = Math.floor(value).toLocaleString() + suffix;
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

// 2. Typewriter Text Switcher Animation (AI Chat Style)
const words = [
  "is coding... 💻",
  "designing Framer Motion springs... 🎨",
  "optimizing page speed 100/100... ⚡",
  "crafting tailwind layouts... 💎",
  "fetching client-side state... 🚀",
  "testing interactive layouts... ✨"
];
let wordIdx = 0;
let charIdx = 0;
let isDeleting = false;
const twText = qs('#hero-tw-text');

function type() {
  if (!twText) return;
  const currentWord = words[wordIdx];
  if (isDeleting) {
    twText.textContent = currentWord.substring(0, charIdx - 1);
    charIdx--;
  } else {
    twText.textContent = currentWord.substring(0, charIdx + 1);
    charIdx++;
  }

  let speed = isDeleting ? 30 : 60;

  if (!isDeleting && charIdx === currentWord.length) {
    speed = 2200; // Pause at end of phrase
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    wordIdx = (wordIdx + 1) % words.length;
    speed = 400; // Pause before typing next
  }

  setTimeout(type, speed);
}

// 3. Typing Code Stream (streaming lines code block)
const codeBody = qs('.fc-code-body');
const codeLines = [
  '<span class="code-kw">import</span> { motion } <span class="code-kw">from</span> <span class="code-str">"framer-motion"</span>;',
  '',
  '<span class="code-kw">export const</span> <span class="code-fn">Card</span> = () => {',
  '  <span class="code-kw">return</span> (',
  '    &lt;<span class="code-fn">motion.div</span>',
  '      <span class="code-str">whileHover</span>={{ scale: 1.05 }}',
  '      <span class="code-str">transition</span>={{ type: <span class="code-str">"spring"</span> }}',
  '    &gt;',
  '      &lt;<span class="code-fn">GlowingEffect</span> /&gt;',
  '    &lt;/<span class="code-fn">motion.div</span>&gt;',
  '  );',
  '};'
];

function streamCode() {
  if (!codeBody) return;
  codeBody.innerHTML = '';
  let lineIdx = 0;
  
  function addLine() {
    if (lineIdx < codeLines.length) {
      const lineDiv = document.createElement('div');
      lineDiv.className = 'code-tx';
      lineDiv.style.opacity = '0';
      lineDiv.style.transform = 'translateY(4px)';
      lineDiv.style.transition = 'all 0.3s ease';
      lineDiv.innerHTML = codeLines[lineIdx];
      codeBody.appendChild(lineDiv);
      
      // Force reflow
      lineDiv.offsetHeight;
      lineDiv.style.opacity = '1';
      lineDiv.style.transform = 'none';
      
      lineIdx++;
      setTimeout(addLine, 600);
    } else {
      setTimeout(streamCode, 5000); // restart loop after 5 seconds
    }
  }
  addLine();
}

// Custom Lighthouse Score Count-up
function countUpLighthouse() {
  const el = qs('.lh-score');
  if (!el) return;
  let start = 0;
  const target = 100;
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const value = start + easeProgress * (target - start);
    
    el.textContent = Math.floor(value);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }
  requestAnimationFrame(update);
}

// Initialize animations immediately
type();
streamCode();

// Delay count-up slightly for visual entry
setTimeout(() => {
  countUpLighthouse();
}, 800);

/* ============================================================
   MAGNETIC BUTTONS — subtle pull effect
   ============================================================ */
qsa('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width  / 2)) * 0.25;
    const dy = (e.clientY - (r.top  + r.height / 2)) * 0.25;
    btn.style.transform = `translate(${dx}px, ${dy}px) translateY(-2px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});
