// particles.js — Molecule-like decorative shapes with nodes that avoid the mouse
(function () {
  // Respect user preference for reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const canvas = document.getElementById('bg-particles');
  if (!canvas || prefersReduced) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let DPR = Math.max(window.devicePixelRatio || 1, 1);

  // Configurable parameters
  const CONFIG = {
    BASE_DENSITY: 160000, // px^2 per molecule (smaller => more molecules)
    NODE_MIN: 3,
    NODE_MAX: 6,
    MOLECULE_RADIUS_MIN: 28,
    MOLECULE_RADIUS_MAX: 90,
    NODE_RADIUS_MIN: 3,
    NODE_RADIUS_MAX: 8,
    HUE_BASE: 190,
    HUE_SPREAD: 60,
    OUTLINE_ALPHA: 0.95,
    OUTLINE_SCALE: 0.08, // relative to node radius
    REPULSE_RADIUS_BASE: 120,
    REPULSE_FORCE: 0.45,
    DAMPING: 0.92
  };
  // Glow settings
  CONFIG.GLOW = {
    BASE_BLUR: 6,
    MAX_BLUR: 28,
    BASE_ALPHA: 0.06,
    MAX_ALPHA: 0.35
  };

  function resize() {
    DPR = Math.max(window.devicePixelRatio || 1, 1);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    canvas.width = Math.round(window.innerWidth * DPR);
    canvas.height = Math.round(window.innerHeight * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  window.addEventListener('resize', resize);
  resize();

  // Mouse / touch
  const pointer = { x: -9999, y: -9999, active: false };
  function onPointerMove(e) {
    if (e.touches && e.touches[0]) {
      pointer.x = e.touches[0].clientX;
      pointer.y = e.touches[0].clientY;
      pointer.active = true;
        // draw node base fill (no shadow)
        ctx.beginPath();
        ctx.fillStyle = `hsla(${this.hue},70%,88%,0.95)`;
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        // particles.js — Molecule-like decorative shapes with nodes that avoid the mouse
        (function () {
          // Respect user preference for reduced motion
          const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

          const canvas = document.getElementById('bg-particles');
          if (!canvas || prefersReduced) return;

          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          let DPR = Math.max(window.devicePixelRatio || 1, 1);

          // Configurable parameters
          const CONFIG = {
            BASE_DENSITY: 160000, // px^2 per molecule (smaller => more molecules)
            NODE_MIN: 3,
            NODE_MAX: 6,
            MOLECULE_RADIUS_MIN: 28,
            MOLECULE_RADIUS_MAX: 90,
            NODE_RADIUS_MIN: 3,
            NODE_RADIUS_MAX: 8,
            HUE_BASE: 190,
            HUE_SPREAD: 60,
            OUTLINE_ALPHA: 0.95,
            OUTLINE_SCALE: 0.08, // relative to node radius
            REPULSE_RADIUS_BASE: 120,
            REPULSE_FORCE: 0.45,
            DAMPING: 0.92
          };
          // Glow settings
          CONFIG.GLOW = {
            BASE_BLUR: 6,
            MAX_BLUR: 28,
            BASE_ALPHA: 0.06,
            MAX_ALPHA: 0.35
          };

          function resize() {
            DPR = Math.max(window.devicePixelRatio || 1, 1);
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';
            canvas.width = Math.round(window.innerWidth * DPR);
            canvas.height = Math.round(window.innerHeight * DPR);
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
          }

          window.addEventListener('resize', resize);
          resize();

          // Pointer state (mouse or touch)
          const pointer = { x: -9999, y: -9999, active: false };
          function onPointerMove(e) {
            if (e.touches && e.touches[0]) {
              pointer.x = e.touches[0].clientX;
              pointer.y = e.touches[0].clientY;
              pointer.active = true;
            } else {
              pointer.x = e.clientX;
              pointer.y = e.clientY;
              pointer.active = true;
            }
          }
          function onPointerEnd() { pointer.active = false; pointer.x = -9999; pointer.y = -9999; }
          window.addEventListener('mousemove', onPointerMove, { passive: true });
          window.addEventListener('touchstart', onPointerMove, { passive: true });
          window.addEventListener('touchmove', onPointerMove, { passive: true });
          window.addEventListener('touchend', onPointerEnd, { passive: true });
          window.addEventListener('mouseleave', onPointerEnd, { passive: true });

          // Molecule class
          class Molecule {
            constructor() { this.init(); }

            init() {
              this.nodeCount = CONFIG.NODE_MIN + Math.floor(Math.random() * (CONFIG.NODE_MAX - CONFIG.NODE_MIN + 1));
              this.radius = CONFIG.MOLECULE_RADIUS_MIN + Math.random() * (CONFIG.MOLECULE_RADIUS_MAX - CONFIG.MOLECULE_RADIUS_MIN);
              this.nodeRadius = CONFIG.NODE_RADIUS_MIN + Math.random() * (CONFIG.NODE_RADIUS_MAX - CONFIG.NODE_RADIUS_MIN);
              this.hue = CONFIG.HUE_BASE + Math.random() * CONFIG.HUE_SPREAD;

              // center position and velocity
              this.x = Math.random() * window.innerWidth;
              this.y = Math.random() * window.innerHeight;
              this.vx = (Math.random() - 0.5) * 0.25;
              this.vy = (Math.random() - 0.75) * 0.25;

              // nodes
              this.nodes = [];
              for (let i = 0; i < this.nodeCount; i++) {
                const angle = (Math.PI * 2 * i) / this.nodeCount + (Math.random() - 0.5) * 0.4;
                const dist = this.radius * (0.65 + Math.random() * 0.4);
                this.nodes.push({
                  angle,
                  restDist: dist,
                  x: this.x + Math.cos(angle) * dist,
                  y: this.y + Math.sin(angle) * dist,
                  vx: 0,
                  vy: 0,
                  phase: Math.random() * Math.PI * 2,
                  wobble: 0.06 + Math.random() * 0.12
                });
              }
            }

            update(dt) {
              // center drift
              this.x += this.vx * dt * 0.06;
              this.y += this.vy * dt * 0.06;

              // wrap
              if (this.x < -200) this.x = window.innerWidth + 200;
              if (this.x > window.innerWidth + 200) this.x = -200;
              if (this.y < -200) this.y = window.innerHeight + 200;
              if (this.y > window.innerHeight + 200) this.y = -200;

              const t = performance.now();
              for (let n of this.nodes) {
                const wob = 1 + Math.sin(n.phase + t * 0.002) * n.wobble;
                const restX = this.x + Math.cos(n.angle + Math.sin(t * 0.001 + n.phase) * 0.02) * (n.restDist * wob);
                const restY = this.y + Math.sin(n.angle + Math.cos(t * 0.001 + n.phase) * 0.02) * (n.restDist * wob);

                const sx = restX - n.x;
                const sy = restY - n.y;
                n.vx += sx * 0.002 * (dt * 0.06);
                n.vy += sy * 0.002 * (dt * 0.06);

                // pointer repulsion at node level
                if (pointer.active) {
                  const dx = n.x - pointer.x;
                  const dy = n.y - pointer.y;
                  const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
                  const repulseRadius = CONFIG.REPULSE_RADIUS_BASE + this.radius * 0.6;
                  if (dist < repulseRadius) {
                    const strength = (1 - dist / repulseRadius) * CONFIG.REPULSE_FORCE;
                    n.vx += (dx / dist) * strength * (dt * 0.06);
                    n.vy += (dy / dist) * strength * (dt * 0.06);
                  }
                }

                n.vx *= CONFIG.DAMPING;
                n.vy *= CONFIG.DAMPING;
                n.x += n.vx * dt * 0.06;
                n.y += n.vy * dt * 0.06;
              }
            }

            draw(ctx) {
              // compute glow strength from closest node
              let glowStrength = 0;
              if (pointer.active) {
                for (let n of this.nodes) {
                  const dx = n.x - pointer.x;
                  const dy = n.y - pointer.y;
                  const d = Math.sqrt(dx * dx + dy * dy) || 0.0001;
                  const radiusInfluence = CONFIG.REPULSE_RADIUS_BASE + this.radius * 0.6;
                  const s = 1 - Math.min(1, d / radiusInfluence);
                  if (s > glowStrength) glowStrength = s;
                }
              }
              glowStrength = Math.max(0, glowStrength);

              // molecule-level glow (radial gradient, 'lighter' composite)
              const glowAlpha = CONFIG.GLOW.BASE_ALPHA + (CONFIG.GLOW.MAX_ALPHA - CONFIG.GLOW.BASE_ALPHA) * glowStrength;
              const glowRadius = this.radius * (1.2 + 0.8 * glowStrength);
              const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, glowRadius);
              g.addColorStop(0, `hsla(${this.hue},85%,65%,${glowAlpha})`);
              g.addColorStop(0.6, `hsla(${this.hue},85%,60%,${glowAlpha * 0.35})`);
              g.addColorStop(1, `hsla(${this.hue},85%,55%,0)`);
              ctx.save();
              ctx.globalCompositeOperation = 'lighter';
              ctx.fillStyle = g;
              ctx.beginPath();
              ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();

              // polygon fill and stroke
              ctx.beginPath();
              for (let i = 0; i < this.nodes.length; i++) {
                const n = this.nodes[i];
                if (i === 0) ctx.moveTo(n.x, n.y);
                else ctx.lineTo(n.x, n.y);
              }
              ctx.closePath();
              ctx.fillStyle = `hsla(${this.hue},60%,15%,0.06)`;
              ctx.fill();

              ctx.beginPath();
              for (let i = 0; i < this.nodes.length; i++) {
                const n = this.nodes[i];
                if (i === 0) ctx.moveTo(n.x, n.y);
                else ctx.lineTo(n.x, n.y);
              }
              ctx.closePath();
              ctx.lineWidth = 1.2;
              ctx.strokeStyle = `hsla(${this.hue},70%,65%,0.5)`;
              ctx.stroke();

              // nodes: draw glow (radial gradient) then circle and outline
              for (let n of this.nodes) {
                const r = this.nodeRadius;
                const dx = n.x - pointer.x;
                const dy = n.y - pointer.y;
                const d = Math.sqrt(dx * dx + dy * dy) || 0.0001;
                const radiusInfluence = CONFIG.REPULSE_RADIUS_BASE + this.radius * 0.6;
                let localStrength = 0;
                if (pointer.active) localStrength = 1 - Math.min(1, d / radiusInfluence);

                // node glow gradient
                const nodeGlowRadius = r * (3 + 10 * localStrength);
                const gg = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, nodeGlowRadius);
                const nodeAlpha = CONFIG.GLOW.BASE_ALPHA * 0.9 + (CONFIG.GLOW.MAX_ALPHA - CONFIG.GLOW.BASE_ALPHA * 0.9) * localStrength;
                gg.addColorStop(0, `hsla(${this.hue},90%,72%,${nodeAlpha})`);
                gg.addColorStop(0.5, `hsla(${this.hue},85%,65%,${nodeAlpha * 0.45})`);
                gg.addColorStop(1, `hsla(${this.hue},80%,55%,0)`);
                ctx.save();
                ctx.globalCompositeOperation = 'lighter';
                ctx.fillStyle = gg;
                ctx.beginPath();
                ctx.arc(n.x, n.y, nodeGlowRadius, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();

                // node base fill
                ctx.beginPath();
                ctx.fillStyle = `hsla(${this.hue},70%,88%,0.95)`;
                ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
                ctx.fill();

                // outline
                ctx.lineWidth = Math.max(1, r * CONFIG.OUTLINE_SCALE);
                ctx.strokeStyle = `hsla(${this.hue},70%,45%,${CONFIG.OUTLINE_ALPHA})`;
                ctx.beginPath();
                ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
                ctx.stroke();
              }
            }
          }

          // Create molecules based on viewport
          let molecules = [];
          function initMolecules() {
            const area = Math.max(1, window.innerWidth * window.innerHeight);
            const count = Math.max(4, Math.round(area / CONFIG.BASE_DENSITY));
            molecules = [];
            for (let i = 0; i < count; i++) molecules.push(new Molecule());
          }

          initMolecules();
          window.addEventListener('resize', () => { initMolecules(); resize(); });

          // Animation
          let last = performance.now();
          function frame(now) {
            const dt = Math.min(40, now - last); // cap dt for stability
            last = now;
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            for (let m of molecules) {
              m.update(dt);
              m.draw(ctx);
            }

            requestAnimationFrame(frame);
          }

          requestAnimationFrame(frame);
        })();
