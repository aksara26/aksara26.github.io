/* =========================================================
   ARYA WARTA — script.js
   Tanggal edisi, reveal, filter proyek, efek buka koran
   ========================================================= */

(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- tanggal edisi ---------- */
  const editionEl = document.getElementById('edition-date');
  if (editionEl) {
    const days = ['Ahad', 'Senen', 'Selasa', 'Rebo', 'Kemis', 'Jumat', 'Setu'];
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const now = new Date();
    editionEl.textContent =
      days[now.getDay()] + ', ' + now.getDate() + ' ' +
      months[now.getMonth()] + ' ' + now.getFullYear();
  }

  /* ---------- animasi reveal berurutan ---------- */
  const revealItems = Array.from(document.querySelectorAll('.reveal'));

  if (reducedMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const delay = Number(el.dataset.revealDelay || 0);
        window.setTimeout(function () { el.classList.add('is-in'); }, delay);
        observer.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach(function (el, i) {
      el.dataset.revealDelay = String(Math.min(i, 8) * 55);
      observer.observe(el);
    });
  }

  /* ---------- filter proyek ---------- */
  const filterButtons = Array.from(document.querySelectorAll('.filters [data-filter]'));
  const projectCards = Array.from(document.querySelectorAll('.projects-grid .project-card'));

  if (filterButtons.length && projectCards.length) {
    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        filterButtons.forEach(function (btn) { btn.classList.remove('active'); });
        button.classList.add('active');

        const filter = button.dataset.filter;

        projectCards.forEach(function (card) {
          const match = filter === 'all' || card.dataset.category === filter;
          card.classList.toggle('is-hidden', !match);
        });
      });
    });
  }

  /* ---------- filter kegiatan ---------- */
  const activityButtons = Array.from(document.querySelectorAll('.activity-filters [data-activity-filter]'));
  const activityPanels = Array.from(document.querySelectorAll('.activity-panel[data-activity]'));

  if (activityButtons.length && activityPanels.length) {
    function selectActivity(selected) {
      const selectedButton = activityButtons.find(function (button) {
        return button.dataset.activityFilter === selected;
      });
      if (!selectedButton) return;

      activityButtons.forEach(function (button) {
        const isActive = button === selectedButton;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
      });

      activityPanels.forEach(function (panel) {
        panel.hidden = panel.dataset.activity !== selected;
      });
    }

    activityButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        selectActivity(button.dataset.activityFilter);
      });
    });

    document.querySelectorAll('a[href="#perpustakaan"]').forEach(function (link) {
      link.addEventListener('click', function () {
        selectActivity('perpustakaan');
      });
    });

    window.addEventListener('hashchange', function () {
      selectActivity(window.location.hash.slice(1));
    });

    if (window.location.hash) selectActivity(window.location.hash.slice(1));
  }

  /* ---------- pratinjau foto ---------- */
  const lightboxTriggers = Array.from(document.querySelectorAll('[data-lightbox]'));

  if (lightboxTriggers.length) {
    const overlay = document.createElement('div');
    overlay.className = 'lightbox';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Pratinjau foto');
    overlay.setAttribute('aria-describedby', 'lightbox-caption');
    overlay.hidden = true;
    overlay.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Tutup pratinjau">&times;</button>' +
      '<figure class="lightbox-figure">' +
        '<img class="lightbox-img" alt="" decoding="async">' +
        '<figcaption class="lightbox-caption" id="lightbox-caption" hidden></figcaption>' +
      '</figure>';
    document.body.appendChild(overlay);

    const lightboxImg = overlay.querySelector('.lightbox-img');
    const lightboxCap = overlay.querySelector('.lightbox-caption');
    const lightboxClose = overlay.querySelector('.lightbox-close');
    const pageSheet = document.querySelector('.sheet');
    let lightboxReturn = null;

    function openLightbox(trigger) {
      const figure = trigger.closest('figure') || trigger.querySelector('figure');
      const caption = figure ? figure.querySelector('figcaption') : null;
      const thumb = trigger.querySelector('img');
      const source = trigger.getAttribute('href');

      lightboxImg.src = source;
      lightboxImg.alt = thumb ? thumb.alt : '';
      lightboxCap.textContent = caption
        ? caption.textContent.replace(/\s+/g, ' ').trim()
        : '';
      lightboxCap.hidden = !lightboxCap.textContent;
      lightboxReturn = trigger;
      overlay.hidden = false;
      document.documentElement.classList.add('lightbox-open');
      document.body.classList.add('lightbox-open');
      if (pageSheet) pageSheet.inert = true;
      lightboxClose.focus();
    }

    function closeLightbox() {
      if (overlay.hidden) return;
      overlay.hidden = true;
      document.documentElement.classList.remove('lightbox-open');
      document.body.classList.remove('lightbox-open');
      if (pageSheet) pageSheet.inert = false;
      lightboxImg.removeAttribute('src');
      if (lightboxReturn && typeof lightboxReturn.focus === 'function') {
        lightboxReturn.focus();
      }
    }

    lightboxTriggers.forEach(function (trigger) {
      trigger.setAttribute('aria-haspopup', 'dialog');
      trigger.addEventListener('click', function (event) {
        if (event.button !== 0) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        openLightbox(trigger);
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', function (event) {
      if (event.target === overlay) closeLightbox();
    });
    document.addEventListener('keydown', function (event) {
      if (overlay.hidden) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        closeLightbox();
      } else if (event.key === 'Tab') {
        event.preventDefault();
        lightboxClose.focus();
      }
    });
  }

  /* ---------- efek membuka/melipat koran ---------- */
  function isInternalLink(link) {
    if (!link) return false;
    if (link.target === '_blank' || link.hasAttribute('download')) return false;
    if (link.hasAttribute('data-lightbox')) return false;

    const href = link.getAttribute('href');
    if (!href) return false;
    if (href.charAt(0) === '#') return false;
    if (/^(https?:|mailto:|tel:|javascript:)/i.test(href)) return false;
    if (/\.(jpe?g|png|gif|webp|avif|svg)$/i.test(href)) return false;

    return true;
  }

  document.addEventListener('click', function (event) {
    if (event.defaultPrevented) return;
    if (event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const link = event.target.closest('a');
    if (!isInternalLink(link)) return;

    // Tanpa animasi: biarkan navigasi normal.
    if (reducedMotion) return;

    event.preventDefault();
    const destination = link.getAttribute('href');

    document.body.classList.add('is-turning');
    window.setTimeout(function () {
      window.location.href = destination;
    }, 430);
  });

  // Jika kembali lewat tombol back, pastikan halaman tidak tertinggal dalam keadaan gelap.
  window.addEventListener('pageshow', function () {
    document.body.classList.remove('is-turning');
  });
})();
