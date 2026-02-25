import React from 'react';
import { Clock, FileText, GitBranch, Lock, Globe, Scale } from 'lucide-react';

const principles = [
  {
    icon: Clock,
    title: 'Continuity Across Time',
    description: 'Artifacts persist across sessions and retain lineage. Nothing is ephemeral.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: FileText,
    title: 'Artifact-Centric Structure',
    description: 'Work exists as structured artifacts, not ephemeral messages or chat threads.',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    icon: GitBranch,
    title: 'Non-Destructive Evolution',
    description: 'Nothing is deleted. Evolution occurs through versioning, supersession, or fossilization.',
    color: 'from-purple-500 to-indigo-500',
  },
  {
    icon: Lock,
    title: 'Constraint Governance',
    description: 'Sealed constraints are binding and immutable. They shape what can emerge.',
    color: 'from-violet-500 to-purple-500',
  },
  {
    icon: Globe,
    title: 'Sovereign Field Model',
    description: 'Each Field has its own Steward and governance. No global canon exists.',
    color: 'from-fuchsia-500 to-violet-500',
  },
  {
    icon: Scale,
    title: 'Platform Neutrality',
    description: 'QUASANTUM hosts Fields but does not govern intellectual content within them.',
    color: 'from-pink-500 to-fuchsia-500',
  },
];

export default function Principles() {
  return (
    <section id="principles-section" className="py-24 px-4 sm:px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.06)_0%,transparent_50%)]" />
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-3 block">Core Invariants</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Architectural Principles</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            These invariants define the structural integrity of QUASANTUM. They are not features — they are foundational commitments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((p, i) => (
            <div
              key={p.title}
              className="group relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-slate-700 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <p.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{p.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{p.description}</p>
              <div className="absolute top-4 right-4 text-5xl font-black text-slate-800/30 select-none">
                {String(i + 1).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
