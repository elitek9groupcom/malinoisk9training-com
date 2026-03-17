/**
 * MALINOIS K9 TRAINING — script.js
 * Handles: navigation scroll, hamburger menu, scroll reveal,
 *          active nav links, back-to-top button, form UX
 */

(function () {
  'use strict';

  /* ─── ELEMENT REFS ─── */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const backToTop = document.getElementById('back-to-top');
  const contactForm = document.getElementById('contact-form');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const breedTags = document.querySelectorAll('.breed-tag');

  /* ═══════════════════════════════════════════
     NAVBAR — scroll & active state
  ═══════════════════════════════════════════ */
  function handleNavScroll() {
    const scrollY = window.scrollY;

    // Sticky background
    if (scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back-to-top visibility
    if (scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }

    // Active nav link based on section in view
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === currentSection) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run on load

  /* ═══════════════════════════════════════════
     HAMBURGER MENU
  ═══════════════════════════════════════════ */
  function toggleMenu() {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  function openMenu() {
    mobileMenu.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close menu when a mobile nav link is clicked
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close menu on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // Close menu when clicking outside (on overlay)
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      closeMenu();
    }
  });

  /* ═══════════════════════════════════════════
     SMOOTH SCROLL for anchor links
  ═══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;

      e.preventDefault();

      const navHeight = navbar.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    });
  });

  /* ═══════════════════════════════════════════
     BACK TO TOP BUTTON
  ═══════════════════════════════════════════ */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ═══════════════════════════════════════════
     SCROLL REVEAL — IntersectionObserver
  ═══════════════════════════════════════════ */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.12 }
  );

  // Add reveal class to elements we want to animate
  const revealSelectors = [
    '.about-header',
    '.about-left',
    '.about-right',
    '.about-drop-cap',
    '.stat-item',
    '.breed-text-col',
    '.programs-header',
    '.program-card',
    '.why-content-col',
    '.why-feature',
    '.testimonials-header',
    '.testimonial-card',
    '.cta-container',
    '.contact-info-col',
    '.contact-form-col'
  ];

  revealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      if (i === 1) el.classList.add('reveal-delay-1');
      if (i === 2) el.classList.add('reveal-delay-2');
      if (i === 3) el.classList.add('reveal-delay-3');
      revealObserver.observe(el);
    });
  });

  /* ═══════════════════════════════════════════
     BREED TAGS — interactive filter
  ═══════════════════════════════════════════ */
  breedTags.forEach(tag => {
    tag.addEventListener('click', function () {
      breedTags.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });

  /* ═══════════════════════════════════════════
     CONTACT FORM — basic client-side UX
  ═══════════════════════════════════════════ */
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = this.querySelector('#contact-submit-btn');
      const originalText = btn.textContent;

      // Visual feedback
      btn.textContent = 'SENDING…';
      btn.disabled = true;
      btn.style.opacity = '0.7';

      // Simulate async submission
      setTimeout(() => {
        btn.textContent = '✓ MESSAGE SENT';
        btn.style.background = '#4caf82';
        btn.style.borderColor = '#4caf82';
        btn.style.color = '#fff';

        // Reset after 3 seconds
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.opacity = '';
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.style.color = '';
          contactForm.reset();
        }, 3000);
      }, 1200);
    });
  }

  /* ═══════════════════════════════════════════
     NAVBAR LOGO — hide text on very small screens
  ═══════════════════════════════════════════ */
  function handleLogoResize() {
    const logoText = document.querySelector('.logo-text');
    if (!logoText) return;
    logoText.style.display = window.innerWidth < 380 ? 'none' : '';
  }

  window.addEventListener('resize', handleLogoResize, { passive: true });
  handleLogoResize();

})();
