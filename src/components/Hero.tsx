import React, { useEffect, useRef } from 'react';
import { useStore } from '../lib/store';
import { ArrowDown, Layers, GitBranch, Shield } from 'lucide-react';

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { setView } = useStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const nodes: { x: number; y: number; vx: number; vy: number; r: number }[] = [];
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    for (let i = 0; i < 60; i++) {
      nodes.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      nodes.forEach((n) => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > canvas.offsetWidth) n.vx *= -1;
        if (n.y < 0 || n.y > canvas.offsetHeight) n.vy *= -1;
      });

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[j].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(139, 92, 246, 0.4)';
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-indigo-950/30 to-slate-950" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12)_0%,transparent_70%)]" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-8">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span className="text-xs font-medium text-indigo-300 tracking-wide uppercase">Emergent Cognitive Commons</span>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tight mb-6">
          <span className="bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
            QUASANTUM
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
          Unlike conventional AI interfaces centered on conversational exchange, QUASANTUM provides a structured substrate for cumulative reasoning. Ideas persist here as versioned artifacts with lineage, state, and governance — rather than dissolving into chat history.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { icon: Layers, label: 'Sovereign Fields' },
            { icon: GitBranch, label: 'Versioned Artifacts' },
            { icon: Shield, label: 'Constraint Governance' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <Icon className="w-4 h-4 text-indigo-400" />
              <span className="text-sm text-slate-300">{label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => {
              const el = document.getElementById('fields-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
          >
            Explore Fields
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('principles-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-3.5 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold rounded-xl border border-slate-700 transition-all duration-200"
          >
            Read Principles
          </button>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 animate-bounce">
          <ArrowDown className="w-5 h-5 text-slate-600 mx-auto" />
        </div>
      </div>
    </section>
  );
}
