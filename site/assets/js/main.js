/* JT's Contracting — interactions. No dependencies. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- year ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- sticky header state ---------- */
  var header = $('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-stuck', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- mobile drawer ---------- */
  var drawer = $('#drawer');
  if (drawer) {
    var lastFocus = null;
    var openNav = function () {
      lastFocus = document.activeElement;
      document.body.classList.add('nav-open');
      drawer.setAttribute('aria-hidden', 'false');
      $$('.burger').forEach(function (b) { b.setAttribute('aria-expanded', 'true'); });
      var first = $('a, button', drawer);
      if (first) first.focus();
    };
    var closeNav = function () {
      document.body.classList.remove('nav-open');
      drawer.setAttribute('aria-hidden', 'true');
      $$('.burger').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
      if (lastFocus) lastFocus.focus();
    };
    $$('.burger').forEach(function (b) { b.addEventListener('click', openNav); });
    $$('[data-close-nav]').forEach(function (b) { b.addEventListener('click', closeNav); });
    $$('a', drawer).forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) closeNav();
    });
  }

  /* ---------- scroll reveal ---------- */
  var revealables = $$('[data-reveal]');
  if (revealables.length) {
    if (!('IntersectionObserver' in window) || reduced) {
      revealables.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
          setTimeout(function () { el.classList.add('is-in'); }, delay);
          io.unobserve(el);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      revealables.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- count-up stats ---------- */
  var counters = $$('[data-count]');
  if (counters.length) {
    var run = function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (reduced) { el.textContent = target.toLocaleString(); return; }
      var dur = 1500, t0 = null;
      var tick = function (ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window)) {
      counters.forEach(run);
    } else {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { run(e.target); cio.unobserve(e.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* ---------- marquee: duplicate track for seamless loop ---------- */
  $$('.marquee').forEach(function (m) {
    var track = $('.marquee-track', m);
    if (!track) return;
    var clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    m.appendChild(clone);
  });

  /* ---------- before / after slider ---------- */
  $$('.ba').forEach(function (ba) {
    var range = $('.ba-range', ba);
    var set = function (v) {
      v = Math.max(0, Math.min(100, v));
      ba.style.setProperty('--pos', v + '%');
      if (range) range.value = v;
    };
    set(range ? parseFloat(range.value) : 50);

    var dragging = false;
    var fromEvent = function (e) {
      var rect = ba.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      return (x / rect.width) * 100;
    };
    var down = function (e) { dragging = true; set(fromEvent(e)); };
    var move = function (e) {
      if (!dragging) return;
      if (e.cancelable) e.preventDefault();
      set(fromEvent(e));
    };
    var up = function () { dragging = false; };

    ba.addEventListener('mousedown', down);
    ba.addEventListener('touchstart', down, { passive: true });
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('mouseup', up);
    window.addEventListener('touchend', up);
    if (range) range.addEventListener('input', function () { set(parseFloat(range.value)); });
  });

  /* ---------- gallery filter ---------- */
  var gallery = $('#gallery');
  if (gallery) {
    var tiles = $$('.tile', gallery);
    var chips = $$('[data-filter]');
    var count = $('[data-gallery-count]');
    /* runId guards against a previous filter's delayed hide landing after a newer one */
    var runId = 0;
    var apply = function (key) {
      var myRun = ++runId;
      var shown = 0;
      tiles.forEach(function (t) {
        var cats = (t.getAttribute('data-cat') || '').split(/\s+/);
        var match = key === 'all' || cats.indexOf(key) !== -1;
        if (match) shown++;
        t.classList.toggle('is-out', !match);
        if (match) {
          t.hidden = false;                     // show immediately, then fade in
        } else {
          setTimeout(function () {              // fade out first, then remove from flow
            if (myRun === runId) t.hidden = true;
          }, 300);
        }
      });
      if (count) count.textContent = shown;
    };
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
        apply(chip.getAttribute('data-filter'));
      });
    });
    if (count) count.textContent = tiles.length;

    /* ---------- lightbox ---------- */
    var lb = $('#lightbox');
    if (lb) {
      var lbImg = $('[data-lb-img]', lb);
      var lbTitle = $('[data-lb-title]', lb);
      var lbCat = $('[data-lb-cat]', lb);
      var lbNow = $('[data-lb-now]', lb);
      var lbTotal = $('[data-lb-total]', lb);
      var idx = 0, lbFocus = null;

      /* is-out flips synchronously with the filter, so it is the reliable source of truth */
      var visible = function () {
        return tiles.filter(function (t) { return !t.classList.contains('is-out'); });
      };

      var render = function () {
        var list = visible();
        if (!list.length) return;
        idx = (idx + list.length) % list.length;
        var t = list[idx];
        var img = $('img', t);
        lbImg.src = t.getAttribute('data-full') || img.currentSrc || img.src;
        lbImg.alt = img.alt;
        lbTitle.textContent = t.getAttribute('data-title') || '';
        lbCat.textContent = t.getAttribute('data-label') || '';
        lbNow.textContent = idx + 1;
        lbTotal.textContent = list.length;
      };
      var open = function (tile) {
        lbFocus = document.activeElement;
        idx = visible().indexOf(tile);
        render();
        lb.classList.add('is-open');
        lb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        $('.lb-close', lb).focus();
      };
      var close = function () {
        lb.classList.remove('is-open');
        lb.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lbFocus) lbFocus.focus();
      };
      var step = function (d) { idx += d; render(); };

      tiles.forEach(function (t) {
        t.addEventListener('click', function (e) { e.preventDefault(); open(t); });
      });
      $('.lb-close', lb).addEventListener('click', close);
      $('.lb-prev', lb).addEventListener('click', function () { step(-1); });
      $('.lb-next', lb).addEventListener('click', function () { step(1); });
      lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
      document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('is-open')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') step(-1);
        if (e.key === 'ArrowRight') step(1);
      });
    }
  }

  /* ---------- sticky mobile call bar (after hero) ---------- */
  var callbar = $('.callbar');
  if (callbar) {
    var show = function () { callbar.classList.toggle('is-in', window.scrollY > 380); };
    show();
    window.addEventListener('scroll', show, { passive: true });
  }

  /* ---------- forms (no backend wired yet — see README) ---------- */
  $$('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      if (form.getAttribute('action')) return;   // a real endpoint is wired — let it post
      /* No endpoint yet: always stop the default GET, otherwise an invalid submit
         navigates away and the visitor loses everything they typed. */
      e.preventDefault();
      if (!form.reportValidity()) return;        // show the browser's own messages
      var status = $('[data-form-status]', form);
      var btn = $('button[type="submit"]', form);
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      setTimeout(function () {
        if (status) {
          status.hidden = false;
          status.textContent = 'Thanks — your request is in. JT will get back to you within one business day.';
          status.focus();
        }
        form.reset();
        if (btn) { btn.disabled = false; btn.textContent = 'Send request'; }
      }, 600);
    });
  });
})();
