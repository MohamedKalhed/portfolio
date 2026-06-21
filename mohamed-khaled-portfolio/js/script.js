/* ============================================================
   PORTFOLIO – Mohamed Khaled
   script.js – All interactivity & animations
   ============================================================ */

'use strict';

/* ── Utility helpers ────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   1. LOADER
   ============================================================ */
(function initLoader() {
  const loader = $('#loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      // remove from DOM after transition
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, 1800);
  });
})();

/* ============================================================
   2. CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const dot  = $('#cursor-dot');
  const ring = $('#cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let rafId;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effects on interactive elements
  const hoverEls = 'a, button, .project-card, .cert-card, .info-card, input, textarea, .skill-category, .soft-skill-card';

  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverEls)) {
      document.body.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverEls)) {
      document.body.classList.remove('hovering');
    }
  });

  // Hide when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
})();

/* ============================================================
   3. SCROLL PROGRESS BAR
   ============================================================ */
(function initScrollProgress() {
  const bar = $('#scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ============================================================
   4. NAVBAR – scroll class + active links
   ============================================================ */
(function initNavbar() {
  const nav  = $('#navbar');
  const links = $$('.nav-link');
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');

  if (!nav) return;

  // Scrolled class
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);

    // Back to top
    const btn = $('#back-to-top');
    if (btn) btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  // Active nav link via Intersection Observer
  const sections = $$('section[id]');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObserver.observe(s));

  // Hamburger menu
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close on link click
    navLinks.addEventListener('click', e => {
      if (e.target.classList.contains('nav-link')) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      }
    });
  }
})();

/* ============================================================
   5. BACK TO TOP
   ============================================================ */
(function initBackToTop() {
  const btn = $('#back-to-top');
  if (!btn) return;

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   6. TYPING EFFECT
   ============================================================ */
(function initTyping() {
  const el = $('#typed-text');
  if (!el) return;

  const phrases = [
    'Data Analyst',
    'BI Specialist',
    'Excel Expert',
    'Power BI Developer',
    'SQL Analyst',
    'Business Intelligence',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let paused = false;

  function type() {
    if (paused) return;

    const phrase = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = phrase.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === phrase.length) {
        paused = true;
        setTimeout(() => { deleting = true; paused = false; tick(); }, 1800);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }

    tick();
  }

  function tick() {
    const speed = deleting ? 55 : 90;
    setTimeout(type, speed);
  }

  // Start after loader
  setTimeout(type, 2200);
})();

/* ============================================================
   7. SCROLL REVEAL (Intersection Observer)
   ============================================================ */
(function initScrollReveal() {
  const targets = $$('.reveal-up, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(t => observer.observe(t));
})();

/* ============================================================
   8. SKILL BARS (animate when visible)
   ============================================================ */
(function initSkillBars() {
  const fills = $$('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const width = el.dataset.width || 0;
        // Slight delay so the section reveal happens first
        setTimeout(() => { el.style.width = width + '%'; }, 200);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(f => observer.observe(f));
})();

/* ============================================================
   9. COUNTER ANIMATION (hero stats)
   ============================================================ */
(function initCounters() {
  const counters = $$('.stat-num[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1800;
        const step = Math.max(1, Math.ceil(target / (duration / 16)));
        let current = 0;

        const timer = setInterval(() => {
          current = Math.min(current + step, target);
          el.textContent = current;
          if (current >= target) clearInterval(timer);
        }, 16);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ============================================================
   10. CONTACT FORM (mailto fallback)
   ============================================================ */
(function initContactForm() {
  const sendBtn = $('#sendBtn');
  const success = $('#form-success');
  if (!sendBtn) return;

  sendBtn.addEventListener('click', () => {
    const name    = $('#name')?.value.trim();
    const email   = $('#email')?.value.trim();
    const subject = $('#subject')?.value.trim();
    const message = $('#message')?.value.trim();

    // Basic validation
    if (!name || !email || !message) {
      shake(sendBtn);
      return;
    }

    if (!isValidEmail(email)) {
      shake($('#email'));
      return;
    }

    // Build mailto link
    const mailSubject = encodeURIComponent(subject || `Portfolio Contact from ${name}`);
    const mailBody    = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );
    const mailto = `mailto:mohamedmohmoh1245@gmail.com?subject=${mailSubject}&body=${mailBody}`;

    window.location.href = mailto;

    // Show success
    if (success) {
      success.style.display = 'block';
      setTimeout(() => { success.style.display = 'none'; }, 5000);
    }

    // Reset form
    ['#name','#email','#subject','#message'].forEach(sel => {
      const el = $(sel);
      if (el) el.value = '';
    });
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shake(el) {
    if (!el) return;
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'shake 0.4s ease';
    el.addEventListener('animationend', () => { el.style.animation = ''; }, { once: true });
  }
})();

/* ============================================================
   11. SMOOTH SCROLL for anchor links
   ============================================================ */
(function initSmoothScroll() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    e.preventDefault();
    const target = $(link.getAttribute('href'));
    if (target) {
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
})();

/* ============================================================
   12. ADD SHAKE KEYFRAME DYNAMICALLY
   ============================================================ */
(function addShakeKeyframe() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20% { transform: translateX(-8px); }
      40% { transform: translateX(8px); }
      60% { transform: translateX(-5px); }
      80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);
})();

/* ============================================================
   13. PARALLAX – subtle orb movement on mouse
   ============================================================ */
(function initParallax() {
  const orbs = $$('.orb');
  if (!orbs.length) return;

  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 8;
      orb.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  }, { passive: true });
})();

/* ============================================================
   14. PROJECT CARD tilt effect
   ============================================================ */
(function initTilt() {
  // هنا بنجيب كل كروت المشاريع الحالية والمستقبلية في الصفحة
  const cards = document.querySelectorAll('.project-card, .cert-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width  / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -4;
      const rotY = ((x - cx) / cx) * 4;
      
      // شلنا الـ transition مؤقتاً أثناء حركة الماوس عشان الـ Tilt يبقا سريع ولحظي مع يدك
      card.style.transition = 'none';
      
      // نفس سطر الـ transform اللي أنت عايزه بالظبط بالـ translateY(-6px)
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      // أول ما الماوس يخرج بنرجع الـ transition عشان الكارت يرجع لمكانه الأصلي بنعومة
      card.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.5s ease';
      card.style.transform = '';
    });
  });
})();
/* ============================================================
   15. FOOTER year update
   ============================================================ */
(function updateYear() {
  const yearEl = document.querySelector('.footer-bottom p');
  if (yearEl) {
    const year = new Date().getFullYear();
    yearEl.textContent = `© ${year} Mohamed Khaled. Crafted with precision.`;
  }
})();