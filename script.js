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
  const heroVideo = document.getElementById('heroVideo');
  const playDemo = document.getElementById('playDemo');
  if (playDemo) {
    playDemo.addEventListener('click', async () => {
      try {
        if (heroVideo && heroVideo.querySelector('source')) {
          await heroVideo.play();
          document.querySelector('.video-overlay')?.classList.add('is-playing');
          if (window.gtag) window.gtag('event', 'video_play', { section: 'hero' });
        } else {
          // Pulse to indicate placeholder
          playDemo.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 600, easing: 'ease-out' });
        }
      } catch (err) {
        // Ignore autoplay errors
      }
    });
  }

  // Forms
  const topForm = document.getElementById('interestForm');
  const bottomForm = document.getElementById('interestFormBottom');
  bindForm(topForm, appsScriptUrl);
  bindForm(bottomForm, appsScriptUrl);

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
});

function bindForm(form, appsScriptUrl) {
  if (!form) return;
  const emailInput = form.querySelector('input[type="email"]');
  const btn = form.querySelector('button');
  const msg = form.querySelector('.form-message') || document.getElementById('formMessage');

  // Local storage: prevent duplicate submits
  const KEY = 'nourishnet_email_registered';
  const saved = localStorage.getItem(KEY);
  if (saved) {
    form.classList.add('submitted');
    if (emailInput) emailInput.value = saved;
    if (msg) { msg.textContent = 'Thanks! You’re already on the list.'; msg.classList.add('success'); }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const spamField = form.querySelector('.hp');
    if (spamField && spamField.value) return; // honeypot
    const email = (emailInput && emailInput.value || '').trim();
    if (!isValidEmail(email)) {
      if (msg) { msg.textContent = 'Please enter a valid email address.'; msg.classList.add('error'); }
      emailInput?.focus();
      return;
    }
    form.classList.add('is-loading');
    btn?.setAttribute('disabled', 'true');
    emailInput?.setAttribute('disabled', 'true');

    try {
      const fd = new FormData();
      fd.append('email', email);
      const res = await fetch(appsScriptUrl, { method: 'POST', body: fd, mode: 'cors' });
      if (!res.ok) throw new Error('Network error');
      const text = await res.text();
      if (msg) { msg.textContent = 'You’re in! We’ll reach out soon.'; msg.classList.remove('error'); msg.classList.add('success'); }
      localStorage.setItem(KEY, email);
      fireConfetti();
      if (window.gtag) window.gtag('event', 'form_submit', { form_location: form.id || 'unknown' });
    } catch (err) {
      if (msg) { msg.textContent = 'Something went wrong. Please try again in a moment.'; msg.classList.add('error'); }
      btn?.removeAttribute('disabled');
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


