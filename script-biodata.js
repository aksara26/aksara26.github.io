/* ===== hee's space — script.js ===== */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- jam & tanggal live ---------- */
function pad(n){ return n.toString().padStart(2, '0'); }

function updateClock(){
  const now = new Date();
  let h = now.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12; if (h === 0) h = 12;
  const timeStr = pad(h) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds()) + ' ' + ampm;

  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const dateStr = months[now.getMonth()] + ' ' + now.getDate() + ', ' + now.getFullYear();

  const timeEl = document.getElementById('clock-time');
  const dateEl = document.getElementById('clock-date');
  if (timeEl) timeEl.textContent = timeStr;
  if (dateEl) dateEl.textContent = dateStr;
}
updateClock();
setInterval(updateClock, 1000);

/* ---------- cek foto berhasil dimuat ---------- */
const portraitImg = document.querySelector('.portrait img');
const portraitBox = document.getElementById('portrait');
if (portraitImg && portraitBox) {
  portraitImg.addEventListener('load',  () => portraitBox.classList.add('has-img'));
  portraitImg.addEventListener('error', () => portraitBox.classList.remove('has-img'));
}

/* ---------- animasi masuk berurutan (stagger reveal) ---------- */
function runRevealAnimation(){
  const items = document.querySelectorAll('.reveal');
  if (prefersReducedMotion) {
    items.forEach(el => el.classList.add('revealed'));
    return;
  }
  items.forEach((el, i) => {
    setTimeout(() => el.classList.add('revealed'), i * 65);
  });
}
window.addEventListener('DOMContentLoaded', runRevealAnimation);

/* ---------- kelip bintang acak (twinkle) ---------- */
document.querySelectorAll('.twinkle').forEach(el => {
  if (prefersReducedMotion) return;
  const delay = (Math.random() * 2).toFixed(2);
  const duration = (1.8 + Math.random() * 1.4).toFixed(2);
  el.style.animation = `twinkle ${duration}s ease-in-out ${delay}s infinite`;
});

/* ---------- jejak kelip mengikuti kursor ---------- */
if (!prefersReducedMotion && window.matchMedia('(hover: hover)').matches) {
  const sparkleChars = ['&#10022;', '&#9733;', '&#9734;'];
  const sparkleColors = ['#f7a8c4', '#7ec8e3', '#cdb3ec', '#f4d35e'];
  let lastSpawn = 0;

  document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSpawn < 90) return; // throttle biar tidak berat
    lastSpawn = now;

    const el = document.createElement('span');
    el.className = 'cursor-sparkle';
    el.innerHTML = sparkleChars[Math.floor(Math.random() * sparkleChars.length)];
    el.style.left = e.clientX + 'px';
    el.style.top = e.clientY + 'px';
    el.style.color = sparkleColors[Math.floor(Math.random() * sparkleColors.length)];
    el.style.setProperty('--dx', (Math.random() * 30 - 15) + 'px');

    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  });
}
