'use client';

import { useEffect, useRef } from 'react';

// Data network globe: a slowly turning sphere of nodes joined by arcs,
// with data packets travelling along the arcs. Drawn on a 2D canvas.
const NODE_COUNT = 72;
const NEIGHBOURS = 2; // each node links to its nearest neighbours
const HUB_EVERY = 9; // every Nth node is an orange hub
const PACKET_COUNT = 6;
const ARC_LIFT = 0.025; // how far arcs float above the sphere
const ARC_STEPS = 12;
const SPIN_SPEED = 0.12; // radians per second
const CREAM = '240, 227, 202';
const ORANGE = '255, 131, 3';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// Evenly spaced points on a unit sphere (Fibonacci lattice)
const spherePoints = (count) => {
  const golden = Math.PI * (3 - Math.sqrt(5));
  return Array.from({ length: count }, (_, i) => {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
  });
};

// Point along the great-circle arc from a to b, lifted slightly off the surface
const arcPoint = (a, b, t) => {
  const dot = clamp(a.x * b.x + a.y * b.y + a.z * b.z, -1, 1);
  const omega = Math.acos(dot);
  const s = Math.sin(omega);
  const k1 = s < 1e-6 ? 1 - t : Math.sin((1 - t) * omega) / s;
  const k2 = s < 1e-6 ? t : Math.sin(t * omega) / s;
  const lift = 1 + ARC_LIFT * Math.sin(Math.PI * t);
  return {
    x: (a.x * k1 + b.x * k2) * lift,
    y: (a.y * k1 + b.y * k2) * lift,
    z: (a.z * k1 + b.z * k2) * lift,
  };
};

// Each node links to its nearest neighbours; duplicate pairs are dropped
const buildLinks = (nodes) => {
  const seen = new Set();
  const links = [];
  nodes.forEach((a, i) => {
    nodes
      .map((b, j) => ({ j, d: (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2 }))
      .filter(({ j }) => j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, NEIGHBOURS)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!seen.has(key)) {
          seen.add(key);
          links.push([Math.min(i, j), Math.max(i, j)]);
        }
      });
  });
  return links;
};

// Spin around the vertical axis, then tilt around the horizontal axis
const rotate = (p, yaw, pitch) => {
  const cy = Math.cos(yaw);
  const sy = Math.sin(yaw);
  const x1 = p.x * cy + p.z * sy;
  const z1 = -p.x * sy + p.z * cy;
  const cp = Math.cos(pitch);
  const sp = Math.sin(pitch);
  return { x: x1, y: p.y * cp - z1 * sp, z: p.y * sp + z1 * cp };
};

const project = (p, center, radius) => ({
  x: center + p.x * radius,
  y: center - p.y * radius,
  depth: clamp((p.z + 1) / 2, 0, 1), // 0 = far side, 1 = facing the viewer
});

const DataGlobe = () => {
  const canvasRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const nodes = spherePoints(NODE_COUNT);
    const hubs = new Set(nodes.map((_, i) => i).filter((i) => i % HUB_EVERY === 4));
    const links = buildLinks(nodes);
    const linkArcs = links.map(([a, b]) =>
      Array.from({ length: ARC_STEPS + 1 }, (_, k) => arcPoint(nodes[a], nodes[b], k / ARC_STEPS))
    );
    const packets = Array.from({ length: PACKET_COUNT }, () => ({
      link: Math.floor(Math.random() * links.length),
      t: Math.random(),
      speed: 0.3 + Math.random() * 0.3,
    }));

    let size = 0;
    let center = 0;
    let radius = 0;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = Math.max(1, Math.min(rect.width, rect.height));
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      center = size / 2;
      radius = size * 0.4;
    };

    const tilt = { x: 0, y: 0 };
    let time = 0;

    const step = (dt) => {
      packets.forEach((pk) => {
        pk.t += pk.speed * dt;
        if (pk.t >= 1) {
          pk.t = 0;
          pk.link = Math.floor(Math.random() * links.length);
          pk.speed = 0.3 + Math.random() * 0.3;
        }
      });
    };

    const draw = (dt) => {
      time += dt;
      tilt.x += (pointer.current.x - tilt.x) * Math.min(1, dt * 3);
      tilt.y += (pointer.current.y - tilt.y) * Math.min(1, dt * 3);
      const yaw = time * SPIN_SPEED + tilt.x * 0.35;
      const pitch = 0.3 + tilt.y * 0.2;
      const view = (p) => project(rotate(p, yaw, pitch), center, radius);

      ctx.clearRect(0, 0, size, size);

      // Faint warm halo behind the globe
      const halo = ctx.createRadialGradient(center, center, 0, center, center, radius * 1.3);
      halo.addColorStop(0, `rgba(${ORANGE}, 0.1)`);
      halo.addColorStop(1, `rgba(${ORANGE}, 0)`);
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, size, size);

      // Orbit ring
      ctx.strokeStyle = `rgba(${CREAM}, 0.12)`;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      for (let k = 0; k <= 96; k++) {
        const a = (k / 96) * Math.PI * 2;
        const p = view({ x: Math.cos(a) * 1.22, y: 0, z: Math.sin(a) * 1.22 });
        if (k === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();

      // Arcs: brighter when they face the viewer
      ctx.lineWidth = 0.7;
      linkArcs.forEach((arc) => {
        const pts = arc.map(view);
        const depth = pts.reduce((sum, p) => sum + p.depth, 0) / pts.length;
        ctx.strokeStyle = `rgba(${CREAM}, ${0.025 + 0.24 * depth * depth})`;
        ctx.beginPath();
        pts.forEach((p, k) => {
          if (k === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.stroke();
      });

      // Nodes
      nodes.forEach((n, i) => {
        const p = view(n);
        ctx.beginPath();
        if (hubs.has(i)) {
          ctx.fillStyle = `rgba(${ORANGE}, ${0.4 + 0.6 * p.depth})`;
          ctx.arc(p.x, p.y, 1.3 + 1.5 * p.depth, 0, Math.PI * 2);
        } else {
          ctx.fillStyle = `rgba(${CREAM}, ${0.1 + 0.75 * p.depth * p.depth})`;
          ctx.arc(p.x, p.y, 0.6 + 1.1 * p.depth, 0, Math.PI * 2);
        }
        ctx.fill();
      });

      // Data packets travelling along the arcs
      ctx.globalCompositeOperation = 'lighter';
      packets.forEach((pk) => {
        const [a, b] = links[pk.link];
        const p = view(arcPoint(nodes[a], nodes[b], pk.t));
        if (p.depth < 0.3) return;
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 7);
        glow.addColorStop(0, `rgba(${ORANGE}, 0.9)`);
        glow.addColorStop(1, `rgba(${ORANGE}, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalCompositeOperation = 'source-over';
    };

    // The loop only runs while the globe is on screen
    let frameId = 0;
    let last = 0;
    let running = false;
    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      step(dt);
      draw(dt);
      frameId = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running || reduceMotion) return;
      running = true;
      last = performance.now();
      frameId = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frameId);
    };

    const onPointer = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.current = {
        x: clamp((e.clientX - (rect.left + rect.width / 2)) / rect.width, -1, 1),
        y: clamp((e.clientY - (rect.top + rect.height / 2)) / rect.height, -1, 1),
      };
    };
    window.addEventListener('mousemove', onPointer);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reduceMotion) draw(0);
    });
    resizeObserver.observe(canvas);
    const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    visibility.observe(canvas);

    resize();
    draw(0); // first frame; reduced motion keeps this still frame

    return () => {
      stop();
      visibility.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', onPointer);
    };
  }, []);

  return <canvas ref={canvasRef} className="block h-full w-full" aria-hidden="true" />;
};

export default DataGlobe;
