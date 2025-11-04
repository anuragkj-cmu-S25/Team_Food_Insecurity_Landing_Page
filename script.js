document.addEventListener('DOMContentLoaded', () => {
  const appsScriptUrl = window.NOURISHNET_APPSCRIPT_URL;

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Smooth scroll for CTA and nav
  document.querySelectorAll('[data-scroll-to], header .nav a, .footer-links a, .brand, .cta.ghost').forEach(el => {
    el.addEventListener('click', (e) => {
      const targetSel = el.getAttribute('data-scroll-to') || el.getAttribute('href');
      if (!targetSel || !targetSel.startsWith('#')) return;
      e.preventDefault();
      const target = document.querySelector(targetSel);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Reveal on scroll
  const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in');
    });
  }, { threshold: 0.18 });
  revealEls.forEach(el => revealObserver.observe(el));

  // Storyline progress
  const storyline = document.querySelector('.features .storyline');
  if (storyline) {
    const line = storyline.querySelector('.line .progress');
    const updateLine = () => {
      const rect = storyline.getBoundingClientRect();
      const viewH = window.innerHeight || document.documentElement.clientHeight;
      // Adjust calculation to work better on all screen sizes
      const scrolled = viewH - rect.top;
      const total = rect.height + viewH;
      const pct = Math.max(0, Math.min(1, scrolled / total));
      line && (line.style.height = (pct * 100).toFixed(1) + '%');
    };
    updateLine();
    window.addEventListener('scroll', updateLine, { passive: true });
    window.addEventListener('resize', updateLine);
  }

  // Card tilt micro-interaction
  const tiltEls = Array.from(document.querySelectorAll('.tilt'));
  tiltEls.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / (r.width / 2);
      const dy = (e.clientY - cy) / (r.height / 2);
      const rx = (-dy * 6).toFixed(2);
      const ry = (dx * 6).toFixed(2);
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    });
  });

  // Hero video play button
  const heroFrame = document.getElementById('heroFrame');
  const playDemo = document.getElementById('playDemo');
  if (playDemo) {
    playDemo.addEventListener('click', () => {
      const src = heroFrame?.getAttribute('data-src');
      if (heroFrame && src && !heroFrame.getAttribute('src')) {
        heroFrame.setAttribute('src', src);
        document.querySelector('.video-overlay')?.classList.add('is-playing');
        if (window.gtag) window.gtag('event', 'video_play', { section: 'hero' });
      } else {
        playDemo.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 600, easing: 'ease-out' });
      }
    });
  }

  // Forms
  const topForm = document.getElementById('interestForm');
  const bottomForm = document.getElementById('interestFormBottom');
  bindForm(topForm, appsScriptUrl);
  bindForm(bottomForm, appsScriptUrl);

  // Walkthrough: sync bento grid cards with mock screen (no timeline)
  const featureGrid = document.getElementById('featureGrid');
  const featureCards = Array.from(featureGrid ? featureGrid.querySelectorAll('.feature-card') : []);
  const screenLayers = Array.from(document.querySelectorAll('#mockScreen .screen-layer'));
  const activateKey = (key) => {
    if (!key) return;
    let changed = false;
    screenLayers.forEach(layer => {
      const on = layer.getAttribute('data-key') === key;
      if (on && !layer.classList.contains('active')) changed = true;
      layer.classList.toggle('active', on);
    });
    featureCards.forEach(card => card.classList.toggle('active', card.getAttribute('data-key') === key));
    if (changed && window.gtag) window.gtag('event', 'walkthrough_step', { key });
  };

  if (featureCards.length) {
    // Default to first card's key
    activateKey(featureCards[0].getAttribute('data-key'));
    // Intersection-based activation on scroll
    const featureObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const key = entry.target.getAttribute('data-key');
          activateKey(key);
        }
      });
    }, { threshold: 0.45, rootMargin: '-25% 0px -45% 0px' });
    featureCards.forEach(card => {
      featureObserver.observe(card);
      card.addEventListener('click', () => {
        const key = card.getAttribute('data-key');
        activateKey(key);
      });
    });
  }

  // Audience rotator: sequentially emphasize target personas
  const audienceWords = Array.from(document.querySelectorAll('.trust-row .aud'));
  if (audienceWords.length) {
    let idx = 0;
    const activate = (i) => {
      audienceWords.forEach((el, j) => el.classList.toggle('active', j === i));
    };
    activate(0);
    setInterval(() => {
      idx = (idx + 1) % audienceWords.length;
      activate(idx);
    }, 1600);
  }

  // Subtle parallax on blobs
  const blob1 = document.querySelector('.blob-1');
  const blob2 = document.querySelector('.blob-2');
  let mouseX = 0, mouseY = 0, sx = 0, sy = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
  });
  const raf = () => {
    sx += (mouseX - sx) * 0.04;
    sy += (mouseY - sy) * 0.04;
    if (blob1) blob1.style.transform = `translate(${sx * 18}px, ${sy * 12}px)`;
    if (blob2) blob2.style.transform = `translate(${sx * -22}px, ${sy * -14}px)`;
    requestAnimationFrame(raf);
  };
  raf();

  // Values ribbon interactions
  initValuesRibbon();
});

function bindForm(form, appsScriptUrl) {
  if (!form) return;
  const emailInput = form.querySelector('input[type="email"]');
  const nameInput = form.querySelector('input[name="name"]');
  const btn = form.querySelector('button');
  const msg = form.querySelector('.form-message') || document.getElementById('formMessage');

  // Local storage: prevent duplicate submits
  const KEY = 'nourishnet_email_registered';
  const NAME_KEY = 'nourishnet_user_name';
  const saved = localStorage.getItem(KEY);
  const savedName = localStorage.getItem(NAME_KEY);
  if (saved) {
    form.classList.add('submitted');
    if (emailInput) emailInput.value = saved;
    if (msg) { msg.textContent = 'Thanks! You’re already on the list.'; msg.classList.add('success'); }
  }
  if (savedName && nameInput) {
    nameInput.value = savedName;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const spamField = form.querySelector('.hp');
    if (spamField && spamField.value) return; // honeypot
    const name = (nameInput && nameInput.value || '').trim();
    const email = (emailInput && emailInput.value || '').trim();
    if (nameInput && name.length < 2) {
      if (msg) { msg.textContent = 'Please enter your name.'; msg.classList.add('error'); }
      nameInput?.focus();
      return;
    }
    if (!isValidEmail(email)) {
      if (msg) { msg.textContent = 'Please enter a valid email address.'; msg.classList.add('error'); }
      emailInput?.focus();
      return;
    }
    form.classList.add('is-loading');
    btn?.setAttribute('disabled', 'true');
    nameInput?.setAttribute('disabled', 'true');
    emailInput?.setAttribute('disabled', 'true');

    try {
      const fd = new FormData();
      if (nameInput) fd.append('name', name);
      fd.append('email', email);
      const res = await fetch(appsScriptUrl, { method: 'POST', body: fd, mode: 'cors' });
      if (!res.ok) throw new Error('Network error');
      const text = await res.text();
      if (msg) { msg.textContent = 'You’re in! We’ll reach out soon.'; msg.classList.remove('error'); msg.classList.add('success'); }
      localStorage.setItem(KEY, email);
      if (nameInput) localStorage.setItem(NAME_KEY, name);
      fireConfetti();
      if (window.gtag) window.gtag('event', 'form_submit', { form_location: form.id || 'unknown' });
    } catch (err) {
      if (msg) { msg.textContent = 'Something went wrong. Please try again in a moment.'; msg.classList.add('error'); }
      btn?.removeAttribute('disabled');
      nameInput?.removeAttribute('disabled');
      emailInput?.removeAttribute('disabled');
    } finally {
      form.classList.remove('is-loading');
    }
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function fireConfetti() {
  if (typeof confetti !== 'function') return;
  const defaults = { origin: { y: 0.8 }, zIndex: 30 };
  confetti({ ...defaults, particleCount: 60, spread: 60, scalar: 0.8, colors: ['#1f8a6b','#4dbb8f','#5aa8ff','#ffd39b'] });
  setTimeout(() => confetti({ ...defaults, particleCount: 40, spread: 70, startVelocity: 40, scalar: 0.9 }), 180);
}

function initValuesRibbon() {
  const row = document.getElementById('valuesRow');
  if (!row) return;
  const cards = Array.from(row.querySelectorAll('.value-card'));
  let idx = cards.findIndex(c => c.classList.contains('active')) || 0;

  const activate = (i) => {
    cards.forEach((c, j) => c.classList.toggle('active', j === i));
    const el = cards[i];
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    if (window.gtag) window.gtag('event', 'values_focus', { key: el?.getAttribute('data-key') || String(i) });
    idx = i;
  };

  cards.forEach((c, i) => c.addEventListener('click', () => activate(i)));

  let timer = setInterval(() => activate((idx + 1) % cards.length), 5000);
  row.addEventListener('pointerdown', () => { clearInterval(timer); });
}


