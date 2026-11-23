
document.addEventListener('DOMContentLoaded', () => {

  // BACKGROUND MUSIC
  const windSound = new Audio('./wind.mp3');
  const music = new Audio('./remain.mp3');

  windSound.volume = 0.7;
  music.volume = 0;
  music.loop = true;

  let soundStarted = false;

  function startSounds() {
    if (soundStarted) return;

    soundStarted = true;

    windSound.currentTime = 0;
    windSound.play().catch(error => console.log(error));

    music.play().catch(error => console.log(error));

    triggerWind();

    setTimeout(() => {
      windSound.pause();
      windSound.currentTime = 0;

      music.currentTime = 0;
      music.volume = 0.25;
    }, 3000);
  }

  document.addEventListener('click', startSounds, { once: true });


  // FAQ ACCORDION
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    if (!question) return;

    question.addEventListener('click', () => {
      const open = item.classList.contains('active');

      faqItems.forEach(faq => faq.classList.remove('active'));

      if (!open) item.classList.add('active');
    });
  });


  // EXTREME HIMALAYAN WIND - FIRST 4s
  function triggerWind() {
    const hero = document.querySelector('.hero-section');

    if (!hero) return;

    const canvas = document.createElement('canvas');

    canvas.style.cssText = `
      position:absolute;
      inset:0;
      width:100%;
      height:100%;
      pointer-events:none;
      z-index:15;
    `;

    hero.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    function resize() {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    // HUGE WIND RIBBONS
    const wind = [];

    for (let i = 0; i < 14; i++) {
      wind.push({
        x: -Math.random() * 2000,
        y: Math.random(),
        speed: Math.random() * 35 + 25,
        size: Math.random() * 150 + 100,
        width: Math.random() * 30 + 15,
        length: Math.random() * 1500 + 1000
      });
    }

    // HUGE SWIRLING GUSTS
    const circles = [];

    for (let i = 0; i < 7; i++) {
      circles.push({
        x: -Math.random() * 1800,
        y: Math.random(),
        size: Math.random() * 150 + 100,
        angle: Math.random() * 6
      });
    }

    // FAST BLIZZARD SNOW
    const snow = [];

    for (let i = 0; i < 500; i++) {
      snow.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 45 + 25,
        length: Math.random() * 100 + 30,
        size: Math.random() * 3 + 1
      });
    }

    const start = performance.now();

    function draw(time) {
      const elapsed = time - start;

      if (elapsed >= 4000) {
        canvas.remove();
        window.removeEventListener('resize', resize);
        return;
      }

      const fade = elapsed < 500 ? elapsed / 500 :
        elapsed > 2500 ? (4000 - elapsed) / 1500 : 1;

      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // FULL SCREEN SNOWY HAZE
      ctx.fillStyle = `rgba(225,245,255,${fade * 0.55})`;
      ctx.fillRect(0, 0, w, h);

      // EXTRA WHITE BLIZZARD GUSTS
      const haze = ctx.createLinearGradient(0, 0, w, h);

      haze.addColorStop(0, `rgba(255,255,255,${fade * 0.25})`);
      haze.addColorStop(0.5, `rgba(220,240,255,${fade * 0.35})`);
      haze.addColorStop(1, `rgba(255,255,255,${fade * 0.25})`);

      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, w, h);

      // WIND RIBBONS
      wind.forEach(s => {
        s.x += s.speed;

        if (s.x - s.length > w) s.x = -s.length;

        ctx.beginPath();

        for (let i = 0; i <= 50; i++) {
          const x = s.x - s.length + i * s.length / 50;

          const y = s.y * h +
            Math.sin(x * 0.004 + elapsed * 0.008) * s.size +
            Math.cos(x * 0.008 + elapsed * 0.01) * 45;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        const gradient = ctx.createLinearGradient(s.x - s.length, 0, s.x, 0);

        gradient.addColorStop(0, 'rgba(255,255,255,0)');
        gradient.addColorStop(0.3, `rgba(255,255,255,${fade * 0.8})`);
        gradient.addColorStop(0.7, `rgba(220,245,255,${fade})`);
        gradient.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = s.width;
        ctx.lineCap = 'round';
        ctx.shadowBlur = 25;
        ctx.shadowColor = 'white';
        ctx.stroke();
      });

      // SWIRLING WIND
      circles.forEach(c => {
        c.x += 30;
        c.angle += 0.2;

        if (c.x > w + c.size) c.x = -c.size;

        ctx.beginPath();
        ctx.arc(c.x, c.y * h, c.size, c.angle, c.angle + Math.PI * 1.6);

        ctx.strokeStyle = `rgba(255,255,255,${fade * 0.9})`;
        ctx.lineWidth = 8;
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'white';
        ctx.stroke();
      });

      // FAST SNOW STREAKS
      snow.forEach(p => {
        p.x += p.speed;
        p.y += Math.sin(p.x * 0.01) * 2;

        ctx.beginPath();
        ctx.moveTo(p.x - p.length, p.y);
        ctx.lineTo(p.x, p.y);

        ctx.strokeStyle = `rgba(255,255,255,${fade})`;
        ctx.lineWidth = p.size;
        ctx.stroke();

        if (p.x > w + 100) {
          p.x = -100;
          p.y = Math.random() * h;
        }
      });

      requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
  }


  // AMBIENT SNOW TOGGLE
  const snowToggle = document.getElementById('snowToggle');

  let snowCanvas = null;
  let snowFrame = null;
  let snowResize = null;

  function startSnow() {
    snowCanvas = document.createElement('canvas');

    snowCanvas.style.cssText = `
      position:fixed;
      inset:0;
      width:100%;
      height:100%;
      pointer-events:none;
      z-index:99;
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

    for (let i = 0; i < 45; i++) {
      flakes.push({
        x: Math.random() * snowCanvas.width,
        y: Math.random() * snowCanvas.height,
        speed: Math.random() + 0.5
      });
    }

    function draw() {
      if (!snowCanvas) return;

      ctx.clearRect(0, 0, snowCanvas.width, snowCanvas.height);

      ctx.fillStyle = 'white';

      flakes.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fill();

        p.y += p.speed;
        p.x += 0.3;

        if (p.y > snowCanvas.height) {
          p.y = -5;
          p.x = Math.random() * snowCanvas.width;
        }
      });

      snowFrame = requestAnimationFrame(draw);
    }

    draw();
  }

  function stopSnow() {
    cancelAnimationFrame(snowFrame);

    if (snowResize) {
      window.removeEventListener('resize', snowResize);
      snowResize = null;
    }

    if (snowCanvas) snowCanvas.remove();

    snowCanvas = null;
  }

  if (snowToggle) {
    snowToggle.addEventListener('click', () => {
      snowToggle.classList.toggle('active');

      if (snowToggle.classList.contains('active')) {
        startSnow();
      } else {
        stopSnow();
      }
    });
  }


  // FROZEN HERO TITLE
  const title = document.querySelector('.hero-title');

  if (title) {
    title.onclick = () => {
      title.classList.add('break');

      setTimeout(() => {
        title.classList.toggle('normal');
        title.classList.remove('break');
      }, 500);
    };
  }

});
