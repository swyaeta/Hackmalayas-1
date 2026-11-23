document.addEventListener('DOMContentLoaded', () => {
  // 1. FAQ Accordion
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach((other) => other.classList.remove('active'));
      if (!isOpen) item.classList.add('active');
    });
  });

  // 2. Big Animated Crazy Mountain Wind (Runs strictly for 5 seconds at the start)
  function triggerCrazyWind() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;

    const existing = hero.querySelector('.crazy-wind-canvas');
    if (existing) existing.remove();

    const canvas = document.createElement('canvas');
    canvas.className = 'crazy-wind-canvas';
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '15'; // Above background, below text
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    hero.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let w = (canvas.width = hero.offsetWidth);
    let h = (canvas.height = hero.offsetHeight);

    const handleResize = () => {
      if (!canvas.parentNode) return;
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // 8 Big, dramatic aerodynamic wind ribbons (multi-layered gale)
    const streams = [
      { yRatio: 0.18, speed: 28, amp: 65, freq: 0.005, width: 9, progress: -350, length: 750, alpha: 0.75, swirl: 1.2 },
      { yRatio: 0.28, speed: 36, amp: 95, freq: 0.004, width: 14, progress: -600, length: 950, alpha: 0.9, swirl: 1.8 },
      { yRatio: 0.38, speed: 32, amp: 75, freq: 0.0045, width: 11, progress: -450, length: 850, alpha: 0.8, swirl: 1.5 },
      { yRatio: 0.50, speed: 40, amp: 110, freq: 0.0035, width: 18, progress: -800, length: 1100, alpha: 0.85, swirl: 2.2 },
      { yRatio: 0.62, speed: 34, amp: 85, freq: 0.004, width: 12, progress: -500, length: 900, alpha: 0.8, swirl: 1.6 },
      { yRatio: 0.74, speed: 38, amp: 100, freq: 0.0038, width: 15, progress: -700, length: 1000, alpha: 0.85, swirl: 2.0 },
      { yRatio: 0.84, speed: 30, amp: 60, freq: 0.005, width: 8, progress: -300, length: 700, alpha: 0.7, swirl: 1.3 },
      { yRatio: 0.45, speed: 44, amp: 120, freq: 0.003, width: 22, progress: -950, length: 1250, alpha: 0.7, swirl: 2.5 }
    ];

    // Swirling wind cyclonic vortices
    const vortices = [
      { x: -200, y: h * 0.32, vx: 22, radius: 85, angle: 0, vRot: 0.18 },
      { x: -500, y: h * 0.55, vx: 26, radius: 110, angle: 1.5, vRot: 0.22 },
      { x: -800, y: h * 0.42, vx: 24, radius: 95, angle: 3.0, vRot: 0.20 }
    ];

    // 190 Intense horizontal blizzard speed-streaks & powder needles
    const dustCount = 190;
    const dust = Array.from({ length: dustCount }, () => ({
      x: Math.random() * -w * 1.2,
      y: Math.random() * h * 0.9 + h * 0.05,
      speed: Math.random() * 22 + 24,
      size: Math.random() * 2.8 + 1.2,
      len: Math.random() * 45 + 20, // Long crazy speed streaks!
      alpha: Math.random() * 0.7 + 0.3,
      swirlOffset: Math.random() * 10 - 5
    }));

    const startTime = performance.now();
    const duration = 10000; // Strictly 5 seconds in the start only
    let animId = null;

    function render(now) {
      const elapsed = now - startTime;
      if (elapsed >= duration) {
        if (animId) cancelAnimationFrame(animId);
        window.removeEventListener('resize', handleResize);
        canvas.remove();
        return;
      }

      // Smooth intensity envelope: rapid roar-in, full crazy blizzard gale, then fast smooth fade-out
      let globalFade = 1;
      if (elapsed < 600) {
        globalFade = elapsed / 600;
      } else if (elapsed > 8000) {
        globalFade = Math.max(0, 1 - (elapsed - 8000) / 2000);
      }

      ctx.clearRect(0, 0, w, h);

      // 1. Render Big Crazy Wind Stream Ribbons
      for (const s of streams) {
        s.progress += s.speed;
        const headX = s.progress;
        const tailX = s.progress - s.length;
        const baseY = s.yRatio * h;

        if (tailX > w + 400) continue;

        ctx.save();
        ctx.beginPath();
        let first = true;
        const steps = 45;
        for (let i = 0; i <= steps; i++) {
          const ratio = i / steps;
          const px = tailX + (s.length * ratio);
          // Compound wave harmonics + turbulence swirl
          const py = baseY + 
            Math.sin(px * s.freq + elapsed * 0.006) * s.amp + 
            Math.cos(px * (s.freq * 1.8) + elapsed * 0.008) * (s.amp * 0.5) +
            Math.sin(ratio * Math.PI * s.swirl + elapsed * 0.01) * 35;

          if (first) {
            ctx.moveTo(px, py);
            first = false;
          } else {
            ctx.lineTo(px, py);
          }
        }

        const grad = ctx.createLinearGradient(tailX, baseY, headX, baseY);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(0.2, `rgba(215, 240, 255, ${s.alpha * globalFade * 0.4})`);
        grad.addColorStop(0.55, `rgba(255, 255, 255, ${s.alpha * globalFade})`);
        grad.addColorStop(0.85, `rgba(224, 246, 255, ${s.alpha * globalFade * 0.7})`);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(255, 255, 255, ${0.6 * globalFade})`;
        ctx.stroke();
        ctx.restore();
      }

      // 2. Render Swirling Cyclonic Eddies
      for (const v of vortices) {
        v.x += v.vx;
        v.angle += v.vRot;
        if (v.x < w + 200 && v.x > -250) {
          ctx.save();
          ctx.beginPath();
          ctx.arc(v.x, v.y + Math.sin(v.x * 0.005) * 40, v.radius, v.angle, v.angle + Math.PI * 1.3);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.45 * globalFade})`;
          ctx.lineWidth = 4;
          ctx.lineCap = 'round';
          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgba(200, 235, 255, ${0.5 * globalFade})`;
          ctx.stroke();
          ctx.restore();
        }
      }

      // 3. Render High-Speed Blizzard Streaks & Powder Needles
      for (const d of dust) {
        d.x += d.speed;
        d.y += Math.sin(d.x * 0.009) * 1.2 + d.swirlOffset;

        if (d.x > -100 && d.x < w + 200) {
          ctx.beginPath();
          ctx.moveTo(d.x - d.len, d.y);
          ctx.lineTo(d.x, d.y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${d.alpha * globalFade})`;
          ctx.lineWidth = d.size;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);
  }

  // Trigger crazy wind strictly for 5 seconds at the start!
  triggerCrazyWind();

  // 3. Ambient Snow Toggle (for background snowfall anytime)
  const snowToggle = document.getElementById('snowToggle');
  let snowCanvas = null;
  let snowFrameId = null;

  function startSnow() {
    snowCanvas = document.createElement('canvas');
    snowCanvas.style.position = 'fixed';
    snowCanvas.style.inset = '0';
    snowCanvas.style.pointerEvents = 'none';
    snowCanvas.style.zIndex = '99';
    document.body.appendChild(snowCanvas);

    const ctx = snowCanvas.getContext('2d');
    let w = (snowCanvas.width = window.innerWidth);
    let h = (snowCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      if (!snowCanvas) return;
      w = snowCanvas.width = window.innerWidth;
      h = snowCanvas.height = window.innerHeight;
    });

    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 1,
      v: Math.random() * 1.2 + 0.5,
      wind: Math.random() * 0.4 - 0.2
    }));

    function draw() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.y += p.v;
        p.x += p.wind;
        if (p.y > h) {
          p.y = -5;
          p.x = Math.random() * w;
        }
      }
      snowFrameId = requestAnimationFrame(draw);
    }
    draw();
  }

  function stopSnow() {
    if (snowFrameId) cancelAnimationFrame(snowFrameId);
    if (snowCanvas) {
      snowCanvas.remove();
      snowCanvas = null;
    }
  }

  if (snowToggle) {
    snowToggle.addEventListener('click', () => {
      const isActive = snowToggle.classList.toggle('active');
      if (isActive) {
        startSnow();
      } else {
        stopSnow();
      }
    });
  }
});
