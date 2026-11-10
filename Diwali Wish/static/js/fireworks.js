/**
 * ============================================================================
 * 🎆 DIWALI FIREWORKS & SPARKLE PARTICLES ENGINE (Optimized 60/120 FPS)
 * Ultra-smooth Canvas Physics: Zero shadowBlur lag, GPU composited
 * ============================================================================
 */

class DiwaliFireworks {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d', { alpha: true });

    this.width = window.innerWidth;
    this.height = window.innerHeight;
    // Cap DPR to 1.25 on high-res displays to eliminate scroll paint stutter
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.25);

    this.rockets = [];
    this.particles = [];
    this.petals = [];
    this.sparklers = [];

    this.isAutoMode = true;
    this.isSparklerMode = false;
    this.autoInterval = null;
    this.isRunning = false;

    // Auspicious Festive Color Palettes
    this.palettes = [
      ['#FFD700', '#FFA500', '#FF4500', '#FFF4BD'], // Golden Sun
      ['#FF1493', '#FF69B4', '#9400D3', '#E6E6FA'], // Radiant Rose & Purple
      ['#00FF7F', '#7FFF00', '#00FFFF', '#ADFF2F'], // Emerald Sparkle
      ['#FF3300', '#FF9900', '#FFFF00', '#FFCC00'], // Marigold Fire
      ['#00E5FF', '#1DE9B6', '#FFFFFF', '#76FF03']  // Celestial Cyan
    ];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    // Interactive canvas clicks
    window.addEventListener('click', (e) => {
      if (e.target.closest('button, input, textarea, a, .diya-item, .preset-pill, .control-btn, .share-btn')) return;
      this.launchRocketTo(e.clientX, e.clientY);
    });

    // Sparkler cursor tracking
    window.addEventListener('mousemove', (e) => {
      if (this.isSparklerMode) {
        this.addSparkler(e.clientX, e.clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (this.isSparklerMode && e.touches.length > 0) {
        const touch = e.touches[0];
        this.addSparkler(touch.clientX, touch.clientY);
      }
    }, { passive: true });

    this.start();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = Math.floor(this.width * this.dpr);
    this.canvas.height = Math.floor(this.height * this.dpr);
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.loop();
    this.startAutoFireworks();
  }

  startAutoFireworks() {
    if (this.autoInterval) clearInterval(this.autoInterval);
    this.autoInterval = setInterval(() => {
      if (!this.isAutoMode) return;
      const startX = this.width * (0.15 + Math.random() * 0.7);
      const targetX = startX + (Math.random() - 0.5) * 180;
      const targetY = this.height * (0.12 + Math.random() * 0.45);
      this.launchRocket(startX, this.height, targetX, targetY);
    }, 2200);
  }

  toggleAutoMode() {
    this.isAutoMode = !this.isAutoMode;
    return this.isAutoMode;
  }

  toggleSparklerMode() {
    this.isSparklerMode = !this.isSparklerMode;
    return this.isSparklerMode;
  }

  launchRocketTo(targetX, targetY) {
    const startX = targetX + (Math.random() - 0.5) * 80;
    this.launchRocket(startX, this.height, targetX, targetY);
  }

  launchRocket(sx, sy, tx, ty) {
    if (window.soundEngine) {
      window.soundEngine.playRocketLaunch();
    }

    const angle = Math.atan2(ty - sy, tx - sx);
    const distance = Math.hypot(tx - sx, ty - sy);
    const speed = 9 + Math.random() * 3;

    this.rockets.push({
      x: sx,
      y: sy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      targetX: tx,
      targetY: ty,
      trail: [],
      distanceTraveled: 0,
      totalDistance: distance
    });
  }

  explodeRocket(x, y) {
    if (window.soundEngine) {
      window.soundEngine.playFireworkBurst(1.0);
    }

    const palette = this.palettes[Math.floor(Math.random() * this.palettes.length)];
    // Optimized particle count for buttery 60-120fps scrolling
    const particleCount = 45 + Math.floor(Math.random() * 30);
    const burstType = Math.random();

    for (let i = 0; i < particleCount; i++) {
      let speed, angle;

      if (burstType < 0.6) {
        angle = (Math.PI * 2 / particleCount) * i + (Math.random() - 0.5) * 0.2;
        speed = 2.2 + Math.random() * 5.5;
      } else if (burstType < 0.85) {
        angle = Math.random() * Math.PI * 2;
        speed = 1.5 + Math.random() * 4.0;
      } else {
        angle = (Math.PI * 2 / particleCount) * i;
        speed = (i % 2 === 0) ? 5.0 : 2.8;
      }

      const color = palette[Math.floor(Math.random() * palette.length)];

      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: color,
        decay: 0.014 + Math.random() * 0.016,
        gravity: 0.08,
        friction: 0.965,
        size: 2.2 + Math.random() * 1.8
      });
    }
  }

  // Grand Celebration Barrage (When all 5 diyas are lit)
  triggerGrandCelebration() {
    for (let i = 0; i < 7; i++) {
      setTimeout(() => {
        const tx = this.width * (0.15 + (i / 6) * 0.7);
        const ty = this.height * (0.15 + Math.random() * 0.35);
        this.launchRocket(tx + (Math.random() - 0.5) * 60, this.height, tx, ty);
      }, i * 300);
    }

    this.triggerPetalShower(50);
  }

  triggerPetalShower(count = 50) {
    const petalColors = ['#FFA500', '#FFD700', '#FF4500', '#FF6347', '#FF8C00'];
    for (let i = 0; i < count; i++) {
      this.petals.push({
        x: Math.random() * this.width,
        y: -20 - Math.random() * 200,
        vx: (Math.random() - 0.5) * 1.2,
        vy: 1.2 + Math.random() * 1.8,
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 3,
        size: 8 + Math.random() * 10,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        opacity: 0.85
      });
    }
  }

  addSparkler(x, y) {
    if (window.soundEngine && Math.random() < 0.25) {
      window.soundEngine.playSparkler();
    }

    for (let i = 0; i < 3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.0 + Math.random() * 3.5;
      this.sparklers.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: Math.random() > 0.5 ? '#FFF4BD' : '#FFD700',
        size: 1.8 + Math.random() * 1.2,
        decay: 0.04 + Math.random() * 0.04
      });
    }
  }

  loop() {
    requestAnimationFrame(() => this.loop());

    // Fast clear with fade trail
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Use hardware-accelerated lighter blend mode (glows without costly shadowBlur!)
    this.ctx.globalCompositeOperation = 'lighter';

    // 1. Update & Render Rockets
    for (let i = this.rockets.length - 1; i >= 0; i--) {
      const r = this.rockets[i];
      r.x += r.vx;
      r.y += r.vy;
      r.distanceTraveled += Math.hypot(r.vx, r.vy);

      r.trail.push({ x: r.x, y: r.y });
      if (r.trail.length > 5) r.trail.shift();

      this.ctx.beginPath();
      this.ctx.strokeStyle = '#FFA500';
      this.ctx.lineWidth = 2;
      for (let t = 0; t < r.trail.length; t++) {
        const pt = r.trail[t];
        if (t === 0) this.ctx.moveTo(pt.x, pt.y);
        else this.ctx.lineTo(pt.x, pt.y);
      }
      this.ctx.stroke();

      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.beginPath();
      this.ctx.arc(r.x, r.y, 2.2, 0, Math.PI * 2);
      this.ctx.fill();

      if (r.distanceTraveled >= r.totalDistance || r.y <= r.targetY || r.vy >= 0) {
        this.explodeRocket(r.x, r.y);
        this.rockets.splice(i, 1);
      }
    }

    // 2. Update & Render Firework Particles (Optimized batch rendering)
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 3. Update & Render Sparklers
    for (let i = this.sparklers.length - 1; i >= 0; i--) {
      const s = this.sparklers[i];
      s.x += s.vx;
      s.y += s.vy;
      s.alpha -= s.decay;

      if (s.alpha <= 0) {
        this.sparklers.splice(i, 1);
        continue;
      }

      this.ctx.globalAlpha = s.alpha;
      this.ctx.fillStyle = s.color;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // 4. Update & Render Petals
    this.ctx.globalCompositeOperation = 'source-over';
    for (let i = this.petals.length - 1; i >= 0; i--) {
      const pt = this.petals[i];
      pt.y += pt.vy;
      pt.x += pt.vx + Math.sin(pt.y * 0.02) * 1.0;
      pt.rotation += pt.vRot;

      if (pt.y > this.height + 25) {
        this.petals.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(pt.x, pt.y);
      this.ctx.rotate(pt.rotation * Math.PI / 180);
      this.ctx.fillStyle = pt.color;
      this.ctx.globalAlpha = pt.opacity;

      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, pt.size * 0.5, pt.size, 0, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
    this.ctx.globalAlpha = 1.0;
  }
}

window.DiwaliFireworks = DiwaliFireworks;
