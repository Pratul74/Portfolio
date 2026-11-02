import { useEffect, useRef } from "react";

const rand = (a, b) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const WORDS = ["RAMEN", "ARCADE", "24H", "CYBER", "NEON", "SYNTH", "PIXEL", "BAR", "NOODLE"];
const SIGN_COLORS = ["#ff4d2d", "#ffaa45", "#ff6b35"];
const WINDOW_TONES = ["#6e1d14", "#a82d1b", "#ffaa45"];
const CAR_COLORS = [
  { hex: "#ff4d2d", rgb: "255,77,45" },
  { hex: "#ffaa45", rgb: "255,170,69" },
  { hex: "#ff6b35", rgb: "255,107,53" },
];

function makeBuildings(canvasWidth, minH, maxH, widthRange, detailed) {
  const list = [];
  let x = -50;
  while (x < canvasWidth + 100) {
    const width = rand(widthRange[0], widthRange[1]);
    const height = rand(minH, maxH);
    const b = { x, width, height, windows: Math.random() > 0.2, grid: [], dots: [], cap: null, roof: "none", sign: null, ph: rand(0, 6.28) };

    if (detailed) {
      const rows = Math.floor(height / 18);
      const cols = Math.floor((width - 12) / 14);
      for (let r = 2; r < rows - 2; r++) {
        for (let c = 0; c < cols; c++) {
          if (Math.random() < 0.5) {
            const roll = Math.random();
            b.grid.push({ c, r, tone: roll < 0.1 ? 2 : roll < 0.45 ? 1 : 0, flick: Math.random() < 0.06, ph: rand(0, 6.28) });
          }
        }
      }
      if (height > 300 && width > 80) b.cap = { w: width * 0.6, h: rand(30, 60) };
      b.roof = pick(["tank", "ac", "ac", "pole", "none"]);
      if (width > 70 && Math.random() < 0.35) {
        b.sign = { word: pick(WORDS), color: pick(SIGN_COLORS), y: rand(50, Math.max(60, height * 0.5)), ph: rand(0, 6.28) };
      }
    } else {
      for (let wy = 10; wy < height - 10; wy += 12) {
        for (let wx = 6; wx < width - 8; wx += 10) {
          if (Math.random() < 0.18) b.dots.push({ x: wx, y: wy, hot: Math.random() < 0.15 });
        }
      }
    }
    list.push(b);
    x += width + Math.random() * 8;
  }
  return list;
}

function makeStar(w, h) {
  return { x: Math.random() * w, y: Math.random() * h * 0.55, size: Math.random() > 0.8 ? 2 : 1, alpha: Math.random(), speed: 0.005 + Math.random() * 0.02 };
}

function makePacket(w, h) {
  return {
    x: Math.random() * w,
    y: h - (Math.random() * 130 + 20),
    speed: 1 + Math.random() * 2.5,
    dir: Math.random() > 0.5 ? 1 : -1,
    size: 3,
    color: Math.random() > 0.3 ? "#ff4d2d" : "#ffaa45",
  };
}

function makeCar(w, h, anywhere) {
  const dir = Math.random() > 0.5 ? 1 : -1;
  return {
    x: anywhere ? Math.random() * w : dir > 0 ? -40 : w + 40,
    y: rand(h * 0.16, h * 0.52),
    speed: rand(0.7, 2.4),
    dir,
    color: pick(CAR_COLORS),
    ph: rand(0, 6.28),
  };
}

function makeEmber(w, h) {
  return { x: Math.random() * w, oy: h - rand(0, 150), life: Math.random(), speed: rand(0.002, 0.006), ph: rand(0, 6.28), rise: rand(80, 170) };
}

function makeTrace(x, h, baseY) {
  const pts = [
    [x, h + 10],
    [x, baseY + 60],
    [x + 30, baseY + 30],
    [x + 30, baseY],
  ];
  const lens = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    lens.push(l);
    total += l;
  }
  return { pts, lens, total, off: rand(0, 300), speed: rand(0.03, 0.07) };
}

function pointOnTrace(tr, d) {
  let rem = d;
  for (let i = 0; i < tr.lens.length; i++) {
    if (rem <= tr.lens[i]) {
      const t = rem / tr.lens[i];
      return [tr.pts[i][0] + (tr.pts[i + 1][0] - tr.pts[i][0]) * t, tr.pts[i][1] + (tr.pts[i + 1][1] - tr.pts[i][1]) * t];
    }
    rem -= tr.lens[i];
  }
  return null;
}

export default function Background({ scanlines = true }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    let bgBuildings = [];
    let fgBuildings = [];
    let stars = [];
    let packets = [];
    let cars = [];
    let embers = [];
    let traces = [];
    let chips = [];
    let blimp = null;
    let shoot = null;

    let skyGradient = null;
    let hazeGradient = null;
    let groundGlow = null;
    let moonHalo = null;
    let crtGlow = null;
    let moon = null;

    function buildMoon() {
      const S = 30;
      const P = 2;
      const m = document.createElement("canvas");
      m.width = S * P;
      m.height = S * P;
      const g = m.getContext("2d");
      const c = S / 2 - 0.5;
      const r = S / 2 - 1;
      const inside = (x, y) => Math.hypot(x - c, y - c) <= r;

      g.fillStyle = "#ff6b35";
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (inside(x, y)) g.fillRect(x * P, y * P, P, P);

      g.fillStyle = "#ff9a5c";
      for (let y = 0; y < S; y++) {
        for (let x = 0; x < S; x++) {
          const d = Math.hypot(x - c, y - c);
          if (d <= r && d > r - 1.6 && x < c) g.fillRect(x * P, y * P, P, P);
        }
      }

      g.fillStyle = "#d4491f";
      [[8, 9, 2.2], [11, 17, 3], [7, 21, 1.6], [14, 6, 1.6], [10, 13, 1.2]].forEach(([cx, cy, cr]) => {
        for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (inside(x, y) && Math.hypot(x - cx, y - cy) <= cr) g.fillRect(x * P, y * P, P, P);
      });

      g.globalCompositeOperation = "destination-out";
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (Math.hypot(x - (c + 6), y - (c - 3)) <= r - 0.5) g.fillRect(x * P, y * P, P, P);
      moon = m;
    }

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;

      const baseY = h - 160;

      skyGradient = ctx.createLinearGradient(0, 0, 0, h);
      skyGradient.addColorStop(0, "#090408");
      skyGradient.addColorStop(0.55, "#1d080c");
      skyGradient.addColorStop(0.8, "#2a0b0d");
      skyGradient.addColorStop(1, "#0c0406");

      hazeGradient = ctx.createLinearGradient(0, h * 0.4, 0, h);
      hazeGradient.addColorStop(0, "rgba(255,90,45,0)");
      hazeGradient.addColorStop(0.7, "rgba(255,90,45,0.10)");
      hazeGradient.addColorStop(1, "rgba(255,90,45,0)");

      groundGlow = ctx.createLinearGradient(0, baseY - 30, 0, baseY);
      groundGlow.addColorStop(0, "rgba(255,77,45,0)");
      groundGlow.addColorStop(1, "rgba(255,77,45,0.22)");

      const moonX = w * 0.3;
      const moonY = h * 0.15;
      moonHalo = ctx.createRadialGradient(moonX + 30, moonY + 30, 10, moonX + 30, moonY + 30, 150);
      moonHalo.addColorStop(0, "rgba(255,107,53,0.28)");
      moonHalo.addColorStop(1, "rgba(255,107,53,0)");

      crtGlow = ctx.createRadialGradient(88, h - 88, 6, 88, h - 88, 130);
      crtGlow.addColorStop(0, "rgba(255,77,45,0.22)");
      crtGlow.addColorStop(1, "rgba(255,77,45,0)");

      buildMoon();

      bgBuildings = makeBuildings(w, 120, 280, [40, 90], false);
      fgBuildings = makeBuildings(w, 200, 420, [60, 130], true);
      stars = Array.from({ length: 90 }, () => makeStar(w, h));
      packets = Array.from({ length: 40 }, () => makePacket(w, h));
      cars = Array.from({ length: Math.max(5, Math.round(w / 220)) }, () => makeCar(w, h, true));
      embers = Array.from({ length: 36 }, () => makeEmber(w, h));
      traces = [];
      for (let x = 20; x < w; x += 80) traces.push(makeTrace(x, h, baseY));

      chips = [];
      let cx = 340;
      while (cx < w - 60) {
        chips.push({ x: cx, y: baseY + rand(72, 100), w: rand(32, 48), h: rand(18, 24), ph: rand(0, 6.28), caps: Math.random() > 0.5 });
        cx += rand(180, 320);
      }

      blimp = { x: rand(0, w), y: h * 0.2, speed: 0.18 };
    }

    function onMouseMove(e) {
      targetX = (e.clientX / w - 0.5) * 40;
      targetY = (e.clientY / h - 0.5) * 20;
    }

    function onTouchMove(e) {
      if (e.touches.length > 0) {
        targetX = (e.touches[0].clientX / w - 0.5) * 40;
        targetY = (e.touches[0].clientY / h - 0.5) * 20;
      }
    }

    function drawRidge(color, baseOffset, amp1, amp2, f1, f2, phase) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(-60, h);
      for (let x = -60; x <= w + 60; x += 40) {
        const py = h - baseOffset + Math.sin(x * f1 + phase) * amp1 + Math.sin(x * f2 + phase) * amp2;
        ctx.lineTo(x, Math.floor(py));
      }
      ctx.lineTo(w + 60, h);
      ctx.closePath();
      ctx.fill();
    }

    function drawBlimp(now) {
      const b = blimp;
      b.x += b.speed;
      if (b.x > w + 100) b.x = -100;
      const x = Math.floor(b.x);
      const y = Math.floor(b.y + Math.sin(now / 1800) * 3);

      ctx.fillStyle = "#2a0c0e";
      ctx.fillRect(x + 6, y, 48, 2);
      ctx.fillRect(x + 2, y + 2, 56, 12);
      ctx.fillRect(x + 6, y + 14, 48, 2);
      ctx.fillStyle = "#3d110d";
      ctx.fillRect(x + 2, y + 10, 56, 4);
      ctx.fillStyle = "#54140d";
      ctx.fillRect(x - 6, y + 2, 8, 3);
      ctx.fillRect(x - 6, y + 11, 8, 3);
      ctx.fillStyle = "#1a0a0c";
      ctx.fillRect(x + 24, y + 16, 12, 4);
      ctx.fillStyle = "#ffaa45";
      ctx.fillRect(x + 26, y + 17, 2, 2);
      ctx.fillRect(x + 31, y + 17, 2, 2);

      ctx.fillStyle = "#090408";
      ctx.fillRect(x + 14, y + 4, 32, 7);
      ctx.fillStyle = Math.floor(now / 700) % 2 === 0 ? "#ff4d2d" : "#ffaa45";
      ctx.font = '10px "VT323", monospace';
      ctx.fillText(Math.floor(now / 700) % 2 === 0 ? "NEON" : "PLAY", x + 18, y + 10);

      ctx.fillStyle = Math.floor(now / 500) % 2 === 0 ? "#ff4d2d" : "#3d110d";
      ctx.fillRect(x + 58, y + 7, 3, 3);
    }

    function drawCar(c, now) {
      c.x += c.speed * c.dir;
      if (c.x > w + 60 || c.x < -60) Object.assign(c, makeCar(w, h, false));
      const x = Math.floor(c.x);
      const y = Math.floor(c.y + Math.sin(now / 900 + c.ph) * 1.5);

      for (let k = 1; k <= 4; k++) {
        ctx.fillStyle = `rgba(${c.color.rgb},${0.5 - k * 0.1})`;
        ctx.fillRect(c.dir > 0 ? x - k * 5 : x + 10 + (k - 1) * 5, y + 1, 5, 1);
      }
      ctx.fillStyle = "#2a0c0e";
      ctx.fillRect(x, y, 10, 3);
      ctx.fillStyle = "#54140d";
      ctx.fillRect(x + 3, y - 1, 4, 1);
      ctx.fillStyle = c.color.hex;
      ctx.fillRect(x + 2, y + 3, 6, 1);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(c.dir > 0 ? x + 9 : x, y + 1, 1, 1);
      if (Math.floor(now / 400 + c.ph) % 2 === 0) {
        ctx.fillStyle = "#ff2d2d";
        ctx.fillRect(c.dir > 0 ? x : x + 9, y + 1, 1, 1);
      }
    }

    function animate() {
      const now = Date.now();

      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      ctx.clearRect(0, 0, w, h);

      ctx.fillStyle = skyGradient;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.translate(mouseX * 0.1, mouseY * 0.1);

      for (const s of stars) {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0) s.speed = -s.speed;
        ctx.fillStyle = `rgba(255, 120, 90, ${Math.min(1, Math.abs(s.alpha))})`;
        ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
      }

      if (!shoot && Math.random() < 0.002) {
        shoot = { x: rand(w * 0.3, w * 0.95), y: rand(0, h * 0.25), vx: -rand(6, 9), vy: rand(2, 3.5), life: 0 };
      }
      if (shoot) {
        shoot.x += shoot.vx;
        shoot.y += shoot.vy;
        shoot.life += 0.02;
        const tx = shoot.x - shoot.vx * 7;
        const ty = shoot.y - shoot.vy * 7;
        const sg = ctx.createLinearGradient(shoot.x, shoot.y, tx, ty);
        sg.addColorStop(0, `rgba(255,220,200,${1 - shoot.life})`);
        sg.addColorStop(1, "rgba(255,120,90,0)");
        ctx.strokeStyle = sg;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(shoot.x, shoot.y);
        ctx.lineTo(tx, ty);
        ctx.stroke();
        if (shoot.life >= 1) shoot = null;
      }

      const moonX = w * 0.3;
      const moonY = h * 0.15;
      ctx.fillStyle = moonHalo;
      ctx.fillRect(moonX - 130, moonY - 130, 320, 320);
      ctx.drawImage(moon, moonX, moonY, 60, 60);
      ctx.restore();

      ctx.save();
      ctx.translate(mouseX * 0.15, mouseY * 0.15);
      drawRidge("#150609", 300, 60, 25, 0.005, 0.013, 1.7);
      ctx.restore();

      ctx.save();
      ctx.translate(mouseX * 0.25, mouseY * 0.25);
      drawRidge("#1c080b", 240, 50, 20, 0.008, 0.02, 0);
      ctx.restore();

      ctx.save();
      ctx.translate(mouseX * 0.3, mouseY * 0.3);
      drawBlimp(now);
      ctx.restore();

      ctx.save();
      ctx.translate(mouseX * 0.4, mouseY * 0.4);
      for (const b of bgBuildings) {
        const bx = Math.floor(b.x);
        const by = Math.floor(h - b.height);
        ctx.fillStyle = "#260a0d";
        ctx.fillRect(bx, by, Math.floor(b.width), Math.floor(b.height));
        ctx.fillStyle = "#3a1012";
        ctx.fillRect(bx, by, Math.floor(b.width), 2);

        for (const d of b.dots) {
          ctx.fillStyle = d.hot ? "#7a2518" : "#3a1010";
          ctx.fillRect(bx + d.x, by + d.y, 3, 4);
        }

        if (b.width > 70) {
          ctx.fillStyle = "#3d110d";
          ctx.fillRect(Math.floor(b.x + b.width / 2 - 2), Math.floor(h - b.height - 35), 4, 35);
          ctx.fillStyle = Math.floor(now / 900 + b.ph) % 2 === 0 ? "#ff4d2d" : "#3d110d";
          ctx.fillRect(Math.floor(b.x + b.width / 2 - 2), Math.floor(h - b.height - 38), 4, 3);
        }
      }
      ctx.restore();

      ctx.fillStyle = hazeGradient;
      ctx.fillRect(0, h * 0.4, w, h * 0.6);

      ctx.save();
      ctx.translate(mouseX * 0.55, mouseY * 0.55);
      for (const c of cars) drawCar(c, now);
      ctx.restore();

      ctx.save();
      ctx.translate(mouseX * 0.7, mouseY * 0.7);

      const tops = [];
      const beams = [];

      fgBuildings.forEach((b, idx) => {
        const bx = Math.floor(b.x);
        const bw = Math.floor(b.width);
        const bY = Math.floor(h - b.height);

        ctx.fillStyle = "#140507";
        ctx.fillRect(bx, bY, bw, Math.floor(b.height));
        ctx.strokeStyle = "#54140d";
        ctx.lineWidth = 2;
        ctx.strokeRect(bx, bY, bw, Math.floor(b.height));
        ctx.fillStyle = "#2a0c0e";
        ctx.fillRect(bx + 2, bY + 2, 2, Math.floor(b.height) - 4);
        ctx.fillStyle = "#7a2016";
        ctx.fillRect(bx, bY, bw, 2);

        let roofY = bY;
        let roofX = bx;
        let roofW = bw;
        if (b.cap) {
          const cw = Math.floor(b.cap.w);
          const ch = Math.floor(b.cap.h);
          const cx = Math.floor(b.x + (b.width - cw) / 2);
          ctx.fillStyle = "#1a0709";
          ctx.fillRect(cx, bY - ch, cw, ch);
          ctx.strokeStyle = "#54140d";
          ctx.strokeRect(cx, bY - ch, cw, ch);
          ctx.fillStyle = "#7a2016";
          ctx.fillRect(cx, bY - ch, cw, 2);
          ctx.fillStyle = "#8a2419";
          for (let wx = cx + 6; wx < cx + cw - 8; wx += 12) ctx.fillRect(wx, bY - ch + 10, 5, 3);
          roofY = bY - ch;
          roofX = cx;
          roofW = cw;
        }

        if (b.windows) {
          for (const g of b.grid) {
            if (g.flick && Math.sin(now / 260 + g.ph) > 0.55) continue;
            ctx.fillStyle = WINDOW_TONES[g.tone];
            ctx.fillRect(bx + 8 + g.c * 14, bY + g.r * 16, 6, 8);
          }
        }

        if (b.sign) {
          const s = b.sign;
          const sw = Math.min(bw - 10, s.word.length * 8 + 10);
          const sx = bx + Math.floor((bw - sw) / 2);
          const sy = bY + Math.floor(s.y);
          const on = Math.sin(now / 140 + s.ph) > -0.92;
          ctx.fillStyle = "#090408";
          ctx.fillRect(sx, sy, sw, 16);
          ctx.strokeStyle = on ? s.color : "#3d110d";
          ctx.lineWidth = 1;
          ctx.strokeRect(sx + 0.5, sy + 0.5, sw - 1, 15);
          if (on) {
            ctx.shadowColor = s.color;
            ctx.shadowBlur = 6;
          }
          ctx.fillStyle = on ? s.color : "#54140d";
          ctx.font = '14px "VT323", monospace';
          ctx.fillText(s.word, sx + 5, sy + 12);
          ctx.shadowBlur = 0;
        }

        
        if (b.roof === "tank") {
          const tx = roofX + Math.floor(roofW * 0.2);
          ctx.fillStyle = "#2a0c0e";
          ctx.fillRect(tx, roofY - 14, 14, 10);
          ctx.fillStyle = "#3d110d";
          ctx.fillRect(tx + 2, roofY - 17, 10, 3);
          ctx.fillRect(tx + 1, roofY - 4, 2, 4);
          ctx.fillRect(tx + 11, roofY - 4, 2, 4);
        } else if (b.roof === "ac") {
          const ax = roofX + Math.floor(roofW * 0.15);
          ctx.fillStyle = "#2a0c0e";
          ctx.fillRect(ax, roofY - 7, 12, 7);
          ctx.fillRect(ax + 16, roofY - 5, 9, 5);
          ctx.fillStyle = "#54140d";
          ctx.fillRect(ax + 2, roofY - 5, 8, 1);
          ctx.fillRect(ax + 2, roofY - 3, 8, 1);
        } else if (b.roof === "pole") {
          const px = roofX + Math.floor(roofW * 0.2);
          ctx.fillStyle = "#54140d";
          ctx.fillRect(px, roofY - 18, 2, 18);
          ctx.fillStyle = Math.floor(now / 700 + b.ph) % 2 === 0 ? "#ff2d2d" : "#3d110d";
          ctx.fillRect(px - 1, roofY - 21, 4, 3);
        }

        if (idx % 3 === 1) {
          const towerX = Math.floor(roofX + roofW * 0.65);
          const towerTopY = roofY - 60;

          ctx.fillStyle = "#ff4d2d";
          ctx.fillRect(towerX - 2, towerTopY, 4, 60);
          ctx.fillStyle = "#8a2419";
          for (let by = towerTopY + 10; by < roofY; by += 12) ctx.fillRect(towerX - 5, by, 10, 1);

          ctx.lineWidth = 2;
          for (let k = 0; k < 3; k++) {
            const phase = (now / 1100 + k / 3) % 1;
            const radius = 6 + phase * 24;
            ctx.strokeStyle = `rgba(255, 77, 45, ${(1 - phase) * 0.9})`;
            ctx.beginPath();
            ctx.arc(towerX, towerTopY, radius, -Math.PI * 0.75, -Math.PI * 0.25);
            ctx.stroke();
          }

          ctx.fillStyle = Math.floor(now / 300) % 2 === 0 ? "#ffffff" : "#ff4d2d";
          ctx.fillRect(towerX - 3, towerTopY - 3, 6, 6);
          tops.push({ x: towerX, y: towerTopY + 8 });
        }

        if (idx % 5 === 2) beams.push({ x: Math.floor(roofX + roofW * 0.5), y: roofY, ph: idx });
      });

      ctx.strokeStyle = "rgba(138,36,25,0.55)";
      ctx.lineWidth = 1;
      for (let i = 1; i < tops.length; i++) {
        const a = tops[i - 1];
        const c = tops[i];
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.quadraticCurveTo((a.x + c.x) / 2, Math.max(a.y, c.y) + Math.abs(c.x - a.x) * 0.12, c.x, c.y);
        ctx.stroke();
      }

      for (const bm of beams) {
        const ang = -Math.PI / 2 + Math.sin(now / 2200 + bm.ph) * 0.65;
        const len = 480;
        const spread = 0.06;
        const x1 = bm.x + Math.cos(ang - spread) * len;
        const y1 = bm.y + Math.sin(ang - spread) * len;
        const x2 = bm.x + Math.cos(ang + spread) * len;
        const y2 = bm.y + Math.sin(ang + spread) * len;
        const bg = ctx.createLinearGradient(bm.x, bm.y, (x1 + x2) / 2, (y1 + y2) / 2);
        bg.addColorStop(0, "rgba(255,170,69,0.28)");
        bg.addColorStop(1, "rgba(255,170,69,0)");
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.moveTo(bm.x, bm.y);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "#ffaa45";
        ctx.fillRect(bm.x - 2, bm.y - 3, 4, 3);
      }
      ctx.restore();

      ctx.save();
      ctx.translate(mouseX, mouseY);

      const baseHeight = 160;
      const baseY = h - baseHeight;

      ctx.fillStyle = groundGlow;
      ctx.fillRect(-60, baseY - 30, w + 120, 30);

      ctx.fillStyle = "#080305";
      ctx.fillRect(-60, baseY, w + 120, baseHeight + 60);
      ctx.strokeStyle = "#3d110d";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-60, baseY);
      ctx.lineTo(w + 60, baseY);
      ctx.stroke();

      ctx.strokeStyle = "#2d0d0d";
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 6]);
      ctx.beginPath();
      ctx.moveTo(-60, baseY + 112);
      ctx.lineTo(w + 60, baseY + 112);
      ctx.moveTo(-60, baseY + 126);
      ctx.lineTo(w + 60, baseY + 126);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.strokeStyle = "#8a2419";
      ctx.lineWidth = 1.5;
      for (const tr of traces) {
        ctx.beginPath();
        ctx.moveTo(tr.pts[0][0], tr.pts[0][1]);
        for (let i = 1; i < tr.pts.length; i++) ctx.lineTo(tr.pts[i][0], tr.pts[i][1]);
        ctx.stroke();
        ctx.fillStyle = "#ff4d2d";
        ctx.fillRect(tr.pts[3][0] - 2, baseY - 2, 5, 5);
        ctx.fillStyle = "#3d110d";
        ctx.fillRect(tr.pts[1][0] - 2, tr.pts[1][1] - 2, 4, 4);
      }

      for (const tr of traces) {
        const dist = (now * tr.speed + tr.off) % (tr.total + 160);
        for (let k = 0; k < 4; k++) {
          const p = pointOnTrace(tr, dist - k * 7);
          if (!p) continue;
          ctx.fillStyle = `rgba(255,170,69,${0.95 - k * 0.22})`;
          ctx.fillRect(Math.floor(p[0]) - 1, Math.floor(p[1]) - 1, 3, 3);
        }
      }

      for (const c of chips) {
        const cx = Math.floor(c.x);
        const cy = Math.floor(c.y);
        const cw = Math.floor(c.w);
        const ch = Math.floor(c.h);
        ctx.fillStyle = "#8a2419";
        for (let px = cx + 4; px < cx + cw - 4; px += 6) {
          ctx.fillRect(px, cy - 4, 2, 4);
          ctx.fillRect(px, cy + ch, 2, 4);
        }
        ctx.fillStyle = "#12060a";
        ctx.fillRect(cx, cy, cw, ch);
        ctx.strokeStyle = "#54140d";
        ctx.lineWidth = 1;
        ctx.strokeRect(cx + 0.5, cy + 0.5, cw - 1, ch - 1);
        ctx.fillStyle = "#3d110d";
        ctx.fillRect(cx + 3, cy + 3, 3, 3);
        ctx.fillStyle = Math.sin(now / 500 + c.ph) > 0 ? "#ff4d2d" : "#3d110d";
        ctx.fillRect(cx + cw - 7, cy + ch - 7, 4, 4);
        if (c.caps) {
          ctx.fillStyle = "#2a0c0e";
          ctx.fillRect(cx + cw + 12, cy + 4, 6, 12);
          ctx.fillRect(cx + cw + 22, cy + 4, 6, 12);
          ctx.fillStyle = "#ff6b35";
          ctx.fillRect(cx + cw + 12, cy + 4, 6, 2);
          ctx.fillRect(cx + cw + 22, cy + 4, 6, 2);
        }
      }

      for (const p of packets) {
        p.x += p.speed * p.dir;
        if (p.x > w + 10 || p.x < -10) Object.assign(p, makePacket(w, h));
        const px = Math.floor(p.x);
        const py = Math.floor(p.y);
        ctx.fillStyle = p.color;
        ctx.fillRect(px, py, p.size, p.size);
        ctx.globalAlpha = 0.4;
        ctx.fillRect(px - p.dir * 4, py, p.size, p.size);
        ctx.globalAlpha = 0.18;
        ctx.fillRect(px - p.dir * 8, py, p.size, p.size);
        ctx.globalAlpha = 1;
      }

      const crtX = 40;
      const crtY = h - 130;

      ctx.fillStyle = crtGlow;
      ctx.fillRect(crtX - 90, crtY - 80, 300, 260);

      ctx.fillStyle = "#1a0a0c";
      ctx.fillRect(crtX + 38, crtY + 85, 24, 8);
      ctx.fillRect(crtX + 24, crtY + 93, 52, 5);

      ctx.fillStyle = "#1a0a0c";
      ctx.fillRect(crtX, crtY, 110, 85);
      ctx.strokeStyle = "#ff4d2d";
      ctx.lineWidth = 2;
      ctx.strokeRect(crtX, crtY, 110, 85);
      ctx.fillStyle = "#080305";
      ctx.fillRect(crtX, crtY, 3, 3);
      ctx.fillRect(crtX + 107, crtY, 3, 3);
      ctx.fillRect(crtX, crtY + 82, 3, 3);
      ctx.fillRect(crtX + 107, crtY + 82, 3, 3);

      ctx.fillStyle = "#090408"; 
      ctx.fillRect(crtX + 8, crtY + 8, 80, 68);
      ctx.fillStyle = "rgba(255,77,45,0.07)";
      ctx.fillRect(crtX + 8, crtY + 8, 80, 68);
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      for (let sy = crtY + 9; sy < crtY + 76; sy += 4) ctx.fillRect(crtX + 8, sy, 80, 1);

      ctx.font = '14px "VT323", monospace';
      ctx.fillStyle = "#ff6b35";
      ctx.fillText("> RUN SYSTEM", crtX + 14, crtY + 26);
      ctx.fillStyle = "#8a2419";
      ctx.fillText("  LOAD OK", crtX + 14, crtY + 40);
      ctx.fillStyle = Math.floor(now / 400) % 2 === 0 ? "#ff4d2d" : "#3d110d";
      ctx.fillText("[ PLAY ]", crtX + 24, crtY + 60);
      ctx.fillStyle = Math.floor(now / 500) % 2 === 0 ? "#ff6b35" : "#090408";
      ctx.fillRect(crtX + 14, crtY + 64, 7, 8);

      ctx.fillStyle = "#8a2419";
      ctx.fillRect(crtX + 94, crtY + 16, 8, 8);
      ctx.fillRect(crtX + 94, crtY + 30, 8, 8);
      ctx.fillStyle = Math.floor(now / 1200) % 4 === 0 ? "#3d110d" : "#37d96b";
      ctx.fillRect(crtX + 96, crtY + 66, 4, 4);

      const kbX = crtX + 124;
      const kbY = h - 42;
      ctx.fillStyle = "#1a0a0c";
      ctx.fillRect(kbX, kbY, 74, 12);
      ctx.strokeStyle = "#54140d";
      ctx.lineWidth = 1;
      ctx.strokeRect(kbX + 0.5, kbY + 0.5, 73, 11);
      ctx.fillStyle = "#54140d";
      for (let kx = kbX + 3; kx < kbX + 70; kx += 6) {
        ctx.fillRect(kx, kbY + 3, 4, 2);
        ctx.fillRect(kx, kbY + 7, 4, 2);
      }

      const mx = kbX + 92;
      const my = h - 50;
      ctx.fillStyle = "#2a0c0e";
      ctx.fillRect(mx, my, 14, 16);
      ctx.fillStyle = "#54140d";
      ctx.fillRect(mx + 14, my + 4, 4, 2);
      ctx.fillRect(mx + 16, my + 4, 2, 8);
      ctx.fillRect(mx + 14, my + 10, 4, 2);
      ctx.fillStyle = "#ff6b35";
      ctx.fillRect(mx + 3, my + 5, 8, 2);
      for (let k = 0; k < 3; k++) {
        const life = ((now / 1600) + k / 3) % 1;
        ctx.fillStyle = `rgba(255,170,120,${(1 - life) * 0.5})`;
        ctx.fillRect(Math.floor(mx + 4 + k * 3 + Math.sin(life * 8 + k) * 2), Math.floor(my - 3 - life * 18), 2, 2);
      }

      for (const e of embers) {
        e.life += e.speed;
        if (e.life >= 1) Object.assign(e, makeEmber(w, h), { life: 0 });
        const ex = e.x + Math.sin(e.life * 6 + e.ph) * 8;
        const ey = e.oy - e.life * e.rise;
        ctx.fillStyle = `rgba(255,140,60,${Math.sin(e.life * Math.PI) * 0.7})`;
        ctx.fillRect(Math.floor(ex), Math.floor(ey), 2, 2);
      }

      ctx.restore();

      raf = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#090408]"
      >
        <canvas ref={canvasRef} className="block h-full w-full" />
      </div>

      {scanlines && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-40 opacity-80"
          style={{
            backgroundImage:
              "linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.4) 50%), linear-gradient(90deg, rgba(255,0,0,0.03), rgba(0,255,0,0.01), rgba(0,0,255,0.03))",
            backgroundSize: "100% 3px, 6px 100%",
          }}
        />
      )}
    </>
  );
}