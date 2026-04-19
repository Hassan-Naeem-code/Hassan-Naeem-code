/* ==============================
   Hassan Naeem — Portfolio JS
   ============================== */

(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Nav: mobile toggle ---------- */
  const navToggle = $('#nav-toggle');
  const navMenu   = $('#nav-menu');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('is-open');
    });
    $$('.nav__link', navMenu).forEach(link =>
      link.addEventListener('click', () => navMenu.classList.remove('is-open'))
    );
  }

  /* ---------- Nav: shadow on scroll ---------- */
  const nav = $('#nav');
  const onScroll = () => {
    nav?.classList.toggle('is-scrolled', window.scrollY > 20);

    const toTop = $('#to-top');
    toTop?.classList.toggle('is-visible', window.scrollY > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Nav: active link on scroll ---------- */
  const sections = $$('section[id]');
  const linkMap  = new Map(
    $$('.nav__link').map(link => [link.getAttribute('href')?.slice(1), link])
  );

  const spy = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        const link = linkMap.get(e.target.id);
        if (!link) return;
        if (e.isIntersecting) {
          $$('.nav__link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  sections.forEach(s => spy.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const revealer = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          revealer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  $$('[data-reveal]').forEach(el => revealer.observe(el));

  /* ---------- Typewriter ---------- */
  const tw = $('#typewriter');
  if (tw) {
    const phrases = [
      'production AI agents',
      'LLM-powered products',
      'RAG pipelines',
      'React Native apps',
      'full-stack web',
    ];
    let p = 0, c = 0, deleting = false;

    const tick = () => {
      const phrase = phrases[p];
      tw.textContent = phrase.slice(0, c);

      if (!deleting && c === phrase.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
      if (deleting && c === 0) {
        deleting = false;
        p = (p + 1) % phrases.length;
      }
      c += deleting ? -1 : 1;
      setTimeout(tick, deleting ? 40 : 80);
    };
    tick();
  }

  /* ---------- Cursor glow ---------- */
  const glow = $('#cursor-glow');
  if (glow && window.matchMedia('(pointer: fine)').matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', e => {
      tx = e.clientX;
      ty = e.clientY;
      glow.style.opacity = '0.6';
    });

    const animate = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(animate);
    };
    animate();
  }

  /* ---------- Skill-card spotlight ---------- */
  $$('.skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* ---------- Year ---------- */
  const yr = $('#year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Email obfuscation ---------- */
  /* Decodes base64 data-email attr into a real mailto at runtime, so
     HTML scrapers can't harvest the address. */
  $$('.email-link').forEach(el => {
    const encoded = el.dataset.email;
    if (!encoded) return;
    try {
      const email = atob(encoded);
      el.href = 'mailto:' + email;
      const label = el.querySelector('.email-link__text');
      if (label) label.textContent = email;
    } catch (e) {
      /* fail silently */
    }
  });
})();
