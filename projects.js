// =========================================================
// PROJECTS PAGE
// Clock + reveal animation + project filter
// =========================================================

document.addEventListener("DOMContentLoaded", () => {

  // ===== CLOCK =====
  function updateClock(){
    const now = new Date();

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    const time = `${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${period}`;

    const date = now.toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric"
    });

    const clockTime = document.getElementById("clock-time");
    const clockDate = document.getElementById("clock-date");

    if (clockTime) clockTime.textContent = time;
    if (clockDate) clockDate.textContent = date.toUpperCase();
  }

  updateClock();
  setInterval(updateClock, 1000);


  // ===== REVEAL ANIMATION =====
  const revealElements = document.querySelectorAll(".reveal");

  revealElements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add("revealed");
    }, 80 + index * 70);
  });


  // ===== PROJECT FILTER =====
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");

  buttons.forEach(button => {
    button.addEventListener("click", () => {

      buttons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const filter = button.dataset.filter;

      cards.forEach(card => {
        const category = card.dataset.category;

        if (filter === "all" || category === filter) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });


  // ===== CURSOR SPARKLE =====
  // Tidak aktif pada perangkat sentuh.
  if (window.matchMedia("(pointer:fine)").matches) {

    let lastSparkle = 0;

    document.addEventListener("mousemove", event => {
      const now = Date.now();

      if (now - lastSparkle < 80) return;
      lastSparkle = now;

      const sparkle = document.createElement("span");

      sparkle.className = "cursor-sparkle";
      sparkle.textContent = Math.random() > 0.5 ? "✦" : "✧";

      sparkle.style.left = `${event.clientX}px`;
      sparkle.style.top = `${event.clientY}px`;
      sparkle.style.setProperty("--dx", `${Math.random() * 30 - 15}px`);

      document.body.appendChild(sparkle);

      setTimeout(() => {
        sparkle.remove();
      }, 900);
    });
  }

});
