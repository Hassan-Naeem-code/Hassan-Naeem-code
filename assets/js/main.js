/* ==============================
   Hassan Naeem — Portfolio JS
   ============================== */

(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Nav: mobile toggle ---------- */
  const navToggle = $('#nav-toggle');
  const navMenu   = $('#nav-menu');

  if (navToggle && navMenu) {
    const setOpen = (open, { returnFocus = false } = {}) => {
      navMenu.classList.toggle('is-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      if (!open && returnFocus) navToggle.focus();
    };

    navToggle.addEventListener('click', () =>
      setOpen(!navMenu.classList.contains('is-open'))
    );
    $$('.nav__link', navMenu).forEach(link =>
      link.addEventListener('click', () => setOpen(false))
    );
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navMenu.classList.contains('is-open')) {
        setOpen(false, { returnFocus: true });
      }
    });
    document.addEventListener('click', e => {
      if (
        navMenu.classList.contains('is-open') &&
        !navMenu.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        setOpen(false);
      }
    });
  }

  /* ---------- Nav: shadow on scroll + back-to-top ---------- */
  const nav   = $('#nav');
  const toTop = $('#to-top');
  const onScroll = () => {
    nav?.classList.toggle('is-scrolled', window.scrollY > 20);
    toTop?.classList.toggle('is-visible', window.scrollY > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Nav: active link on scroll ---------- */
  const navLinks = $$('.nav__link');
  const linkMap  = new Map(
    navLinks.map(link => [link.getAttribute('href')?.slice(1), link])
  );

  const spy = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        const link = linkMap.get(e.target.id);
        if (!link || !e.isIntersecting) return;
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );
  $$('section[id]').forEach(s => spy.observe(s));

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('[data-reveal]');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) {
    revealEls.forEach(el => el.classList.add('is-visible'));
  } else {
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
    revealEls.forEach(el => revealer.observe(el));
  }
  // Printing should never produce blank, not-yet-revealed sections.
  window.addEventListener('beforeprint', () =>
    revealEls.forEach(el => el.classList.add('is-visible'))
  );

  /* ---------- Cursor glow ---------- */
  /* Eases toward the pointer and stops the rAF loop once it settles, so
     nothing runs while the mouse is idle. Skipped on touch and reduced motion. */
  const glow = $('#cursor-glow');
  if (glow && window.matchMedia('(pointer: fine)').matches && !reducedMotion.matches) {
    let tx = 0, ty = 0, cx = 0, cy = 0, running = false;

    const step = () => {
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) {
        requestAnimationFrame(step);
      } else {
        running = false;
      }
    };

    window.addEventListener('mousemove', e => {
      tx = e.clientX;
      ty = e.clientY;
      glow.style.opacity = '0.6';
      if (!running) {
        running = true;
        requestAnimationFrame(step);
      }
    }, { passive: true });
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

  /* ---------- Email link ---------- */
  /* The address is stored base64-encoded in data-email and turned into a
     mailto at runtime. This only deters naive HTML scrapers; it is not a
     secret. Without JS the links fall back to #contact. */
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
