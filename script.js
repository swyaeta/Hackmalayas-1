
document.addEventListener('DOMContentLoaded', () => {

  // BACKGROUND MUSIC + INTRO SCREEN
  const windSound = new Audio('./wind.mp3');
  const music = new Audio('./remain.mp3');

  windSound.volume = 0.7;
  music.volume = 0;
  music.loop = true;

  const introScreen = document.getElementById('intro-screen');

  if (introScreen) {
    introScreen.addEventListener('click', () => {

      const windPromise = windSound.play();
      const musicPromise = music.play();

      triggerWind();

      if (windPromise) {
        windPromise.catch(error => console.log('Wind sound:', error));
      }

      if (musicPromise) {
        musicPromise.catch(error => console.log('Background music:', error));
      }

      introScreen.style.opacity = '0';
      introScreen.style.pointerEvents = 'none';

      setTimeout(() => {
        windSound.pause();
        windSound.currentTime = 0;
        music.volume = 0.25;
      }, 3000);

      setTimeout(() => {
        introScreen.remove();
      }, 1500);
    });
  }


  // FAQ ACCORDION
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    if (!question) return;

    question.addEventListener('click', () => {
      const open = item.classList.contains('active');

      faqItems.forEach(faq => {
        faq.classList.remove('active');
      });

      if (!open) {
        item.classList.add('active');
      }
    });
  });


  // WIND ANIMATION
  function triggerWind() {
    const hero = document.querySelector('.hero-section');

    if (!hero) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.style.cssText = `
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10;
    `;

    hero.appendChild(canvas);

    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;

    const width = canvas.width;
    const height = canvas.height;

    const ribbons = [];
    const snow = [];

    for (let i = 0; i < 12; i++) {
      ribbons.push({
        x: Math.random() * width,
        y: Math.random() * height,
        length: Math.random() * 180 + 100,
        speed: Math.random() * 5 + 3,
        angle: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.3 + 0.1
      });
    }

    for (let i = 0; i < 100; i++) {
      snow.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: Math.random() * 8 + 4,
        size: Math.random() * 3 + 1
      });
    }

    let startTime = null;

    function animate(timestamp) {
      if (!startTime) startTime = timestamp;

      const elapsed = timestamp - startTime;

      ctx.clearRect(0, 0, width, height);

      const fade = Math.min(1, elapsed / 1000) *
        Math.max(0, 1 - elapsed / 5000);

      ribbons.forEach(r => {
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.quadraticCurveTo(
          r.x + r.length / 2,
          r.y - 30,
          r.x + r.length,
          r.y + r.angle * 100
        );

        ctx.strokeStyle = `rgba(255,255,255,${r.opacity * fade})`;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'white';
        ctx.stroke();
        ctx.shadowBlur = 0;

        r.x += r.speed;

        if (r.x > width + r.length) {
          r.x = -r.length;
          r.y = Math.random() * height;
        }
      });

      snow.forEach(p => {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.speed * 2, p.y + p.speed * 3);

        ctx.strokeStyle = `rgba(255,255,255,${fade * 0.8})`;
        ctx.lineWidth = p.size;
        ctx.stroke();

        p.x += p.speed;
        p.y += p.speed * 0.5;

        if (p.x > width) p.x = 0;
        if (p.y > height) p.y = 0;
      });

      if (elapsed < 5000) {
        requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    }

    requestAnimationFrame(animate);
  }


  // AMBIENT SNOW
  const snowToggle = document.querySelector('#snowToggle, .snow-toggle');

  let snowCanvas = null;
  let snowFrame = null;
  let snowResize = null;

  function startSnow() {
    if (snowCanvas) return;

    snowCanvas = document.createElement('canvas');

    snowCanvas.style.cssText = `
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 99;
    `;

    document.body.appendChild(snowCanvas);

    const ctx = snowCanvas.getContext('2d');

    function resize() {
      snowCanvas.width = window.innerWidth;
      snowCanvas.height = window.innerHeight;
    }

    resize();

    snowResize = resize;
    window.addEventListener('resize', resize);

    const flakes = [];

    for (let i = 0; i < 150; i++) {
      flakes.push({
        x: Math.random() * snowCanvas.width,
        y: Math.random() * snowCanvas.height,
        radius: Math.random() * 4 + 2.5,
        speed: Math.random() * 1.8 + 0.8,
        drift: Math.random() * 1 - 0.5,
        opacity: Math.random() * 0.4 + 0.6
      });
    }

    function draw() {
      if (!snowCanvas) return;

      ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);

      flakes.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        // NO GLOW EFFECT
        ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
        ctx.fill();

        p.y += p.speed;
        p.x += p.drift;

        if (p.y > snowCanvas.height + 10) {
          p.y = -10;
          p.x = Math.random() * snowCanvas.width;
        }

        if (p.x > snowCanvas.width + 10) p.x = -10;
        if (p.x < -10) p.x = snowCanvas.width + 10;
      });

      snowFrame = requestAnimationFrame(draw);
    }

    draw();
  }


  function stopSnow() {
    if (snowFrame) cancelAnimationFrame(snowFrame);

    if (snowResize) {
      window.removeEventListener('resize', snowResize);
      snowResize = null;
    }

    if (snowCanvas) snowCanvas.remove();

    snowCanvas = null;
    snowFrame = null;
  }


  // START SNOW AUTOMATICALLY
  startSnow();

  if (snowToggle) {
    snowToggle.classList.add('active');

    snowToggle.addEventListener('click', () => {
      snowToggle.classList.toggle('active');

      if (snowToggle.classList.contains('active')) {
        startSnow();
      } else {
        stopSnow();
      }
    });
  }


  // FROZEN HERO TITLE CLICK
  const frozenTitle = document.querySelector('.hero-title');

  if (frozenTitle) {
    frozenTitle.addEventListener('click', () => {
      frozenTitle.classList.toggle('frozen');
    });
  }

});
