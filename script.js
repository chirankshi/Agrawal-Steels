/* ================================================
   AGGARWAL STEELS – script.js
   Interactive behaviours & animations
   ================================================ */

'use strict';

// ===== ANNOUNCEMENT BAR =====
(function () {
  const bar = document.getElementById('announcementBar');
  const closeBtn = document.getElementById('closeAnnouncement');
  if (closeBtn && bar) {
    closeBtn.addEventListener('click', function () {
      bar.style.height = bar.offsetHeight + 'px';
      bar.style.overflow = 'hidden';
      bar.style.transition = 'height 0.3s ease, opacity 0.3s ease, padding 0.3s ease';
      requestAnimationFrame(function () {
        bar.style.height = '0';
        bar.style.padding = '0';
        bar.style.opacity = '0';
      });
      setTimeout(function () { bar.remove(); }, 320);
    });
  }
})();

// ===== NAVBAR SCROLL & HAMBURGER =====
(function () {
  var navbar = document.getElementById('navbar');
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');

  // Scroll effect
  window.addEventListener('scroll', function () {
    if (window.scrollY > 30) {
      navbar && navbar.classList.add('scrolled');
    } else {
      navbar && navbar.classList.remove('scrolled');
    }

    // Update active nav link based on scroll position
    updateActiveNav();

    // Scroll-to-top button visibility
    var scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      // Animate hamburger
      var spans = hamburger.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      }
    });

    // Close nav on link click
    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        var spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity = '';
        spans[2].style.transform = '';
      });
    });
  }

  function updateActiveNav () {
    var sections = ['home', 'products', 'about', 'why-us', 'journey', 'contact'];
    var scrollY = window.scrollY + 120;

    var current = 'home';
    sections.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) {
        current = id;
      }
    });

    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.classList.remove('active');
      var href = link.getAttribute('href');
      if (href === '#' + current) {
        link.classList.add('active');
      }
    });
  }
})();

// ===== SCROLL REVEAL ANIMATION =====
(function () {
  var revealElements = [];

  function init () {
    document.querySelectorAll(
      '.product-card, .why-card, .presence-card, .step-card, .mv-card, .milestone-item, .timeline-item, .partner-item'
    ).forEach(function (el) {
      el.classList.add('fade-in-up');
      revealElements.push(el);
    });
    checkReveal();
  }

  function checkReveal () {
    var windowBottom = window.scrollY + window.innerHeight;
    revealElements.forEach(function (el) {
      if (!el.classList.contains('visible')) {
        var elTop = el.getBoundingClientRect().top + window.scrollY;
        if (windowBottom > elTop + 60) {
          el.classList.add('visible');
        }
      }
    });
  }

  window.addEventListener('scroll', checkReveal, { passive: true });
  window.addEventListener('load', init);
})();

// ===== TIMELINE BAR ANIMATION =====
(function () {
  var animated = false;
  var timelineSection = document.getElementById('journey');

  function animateBars () {
    if (animated) return;
    var rect = timelineSection && timelineSection.getBoundingClientRect();
    if (rect && rect.top < window.innerHeight - 100) {
      animated = true;
      document.querySelectorAll('.timeline-bar').forEach(function (bar) {
        var targetHeight = bar.style.getPropertyValue('--bar-height') || '50%';
        bar.style.setProperty('--bar-height', '0%');
        setTimeout(function () {
          bar.style.setProperty('--bar-height', targetHeight);
          bar.style.height = targetHeight;
          bar.style.transition = 'height 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
        }, 100);
      });
    }
  }

  window.addEventListener('scroll', animateBars, { passive: true });
  window.addEventListener('load', animateBars);
})();

// ===== COUNTER ANIMATION =====
(function () {
  var countered = false;

  function animateCounter (el, target, suffix, duration) {
    var start = 0;
    var step = Math.ceil(target / (duration / 16));
    var timer = setInterval(function () {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      el.textContent = start + suffix;
    }, 16);
  }

  function checkCounters () {
    if (countered) return;
    var section = document.getElementById('journey');
    if (!section) return;
    var rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      countered = true;
      var nums = document.querySelectorAll('.milestone-num');
      nums.forEach(function (el) {
        var text = el.textContent.trim();
        var match = text.match(/^(\d+)(.*)$/);
        if (match) {
          animateCounter(el, parseInt(match[1]), match[2], 1500);
        }
      });
    }
  }

  window.addEventListener('scroll', checkCounters, { passive: true });
  window.addEventListener('load', checkCounters);
})();

// ===== CONTACT FORM =====
function handleFormSubmit (event) {
  event.preventDefault();
  var form = event.target;
  var btn = document.getElementById('btnSubmitForm');
  var success = document.getElementById('formSuccess');

  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Simulate sending (replace with actual API call)
  setTimeout(function () {
    form.reset();
    btn.textContent = 'Send Enquiry →';
    btn.disabled = false;
    if (success) {
      success.classList.remove('hidden');
      setTimeout(function () {
        success.classList.add('hidden');
      }, 5000);
    }
  }, 1500);
}

// ===== SMOOTH ANCHOR SCROLLING =====
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        var offset = 80;
        var targetPos = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });
})();

// ===== PRODUCT CARD HOVER TILT =====
(function () {
  document.querySelectorAll('.product-card').forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = ((y - centerY) / centerY) * 4;
      var rotateY = -((x - centerX) / centerX) * 4;
      card.style.transform = 'translateY(-6px) perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
    });

    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });
})();

// ===== PARTNERS HOVER =====
(function () {
  document.querySelectorAll('.partner-logo-box').forEach(function (box) {
    box.addEventListener('mouseenter', function () {
      this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
  });
})();

// ===== INIT PAGE =====
window.addEventListener('DOMContentLoaded', function () {
  // Trigger initial scroll events
  window.dispatchEvent(new Event('scroll'));
  console.log('%c🏗️ Aggarwal Steels Website Loaded', 'color: #f59e0b; font-size: 14px; font-weight: bold;');
});
