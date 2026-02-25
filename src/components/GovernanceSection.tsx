import React from 'react';
import { Eye, Edit3, Shield, Users } from 'lucide-react';

const roles = [
  {
    role: 'OBSERVER',
    icon: Eye,
    color: 'from-slate-500 to-slate-600',
    permissions: ['View public artifacts', 'View public relations', 'View version history', 'Submit proposals'],
    restricted: ['Edit artifacts', 'Create artifacts', 'Modify constraints', 'Execute transitions'],
  },
  {
    role: 'CONTRIBUTOR',
    icon: Edit3,
    color: 'from-amber-500 to-orange-500',
    permissions: ['All Observer permissions', 'Create new artifacts', 'Edit own artifacts', 'Propose constraints'],
    restricted: ['Edit others\' artifacts', 'Seal constraints', 'Execute state transitions'],
  },
  {
    role: 'EDITOR',
    icon: Users,
    color: 'from-emerald-500 to-teal-500',
    permissions: ['All Contributor permissions', 'Edit any artifact', 'Create relations', 'Propose constraints'],
    restricted: ['Seal constraints', 'Execute state transitions', 'Integrate proposals'],
  },
  {
    role: 'STEWARD',
    icon: Shield,
    color: 'from-indigo-500 to-purple-500',
    permissions: ['All Editor permissions', 'Execute state transitions', 'Seal constraints', 'Integrate proposals', 'Manage field governance'],
    restricted: ['Delete artifacts (no one can)', 'Override platform invariants'],
  },
];

export default function GovernanceSection() {
  return (
    <section className="py-24 px-4 sm:px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(139,92,246,0.06)_0%,transparent_50%)]" />
      <div className="max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <span className="text-xs font-semibold tracking-widest uppercase text-purple-400 mb-3 block">Role-Based Authority</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Governance Model</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Each Field is governed by a role hierarchy. Authority flows from the Steward, who ensures structural integrity while enabling emergence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {roles.map(r => (
            <div key={r.role} className="p-5 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-slate-700 transition-all">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${r.color} flex items-center justify-center mb-4`}>
                <r.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-4">{r.role}</h3>

              <div className="mb-4">
                <span className="text-[10px] font-semibold tracking-widest uppercase text-emerald-400 mb-2 block">Can</span>
                <ul className="space-y-1.5">
                  {r.permissions.map(p => (
                    <li key={p} className="flex items-start gap-2 text-xs text-slate-400">
                      <div className="w-1 h-1 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[10px] font-semibold tracking-widest uppercase text-red-400 mb-2 block">Cannot</span>
                <ul className="space-y-1.5">
                  {r.restricted.map(p => (
                    <li key={p} className="flex items-start gap-2 text-xs text-slate-500">
                      <div className="w-1 h-1 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Lifecycle */}
        <div className="mt-16 p-8 rounded-2xl bg-slate-900/50 border border-slate-800/50">
          <h3 className="text-lg font-semibold text-white mb-6 text-center">Artifact State Lifecycle</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
            {[
              { state: 'DRAFT', color: 'bg-amber-500', desc: 'Work in progress' },
              { state: 'LIVE', color: 'bg-emerald-500', desc: 'Active and canonical' },
              { state: 'SUPERSEDED', color: 'bg-slate-500', desc: 'Replaced by successor' },
              { state: 'FOSSIL', color: 'bg-stone-500', desc: 'Permanently preserved' },
            ].map((s, i) => (
              <React.Fragment key={s.state}>
                <div className="text-center flex-shrink-0">
                  <div className={`w-14 h-14 rounded-full ${s.color} bg-opacity-20 flex items-center justify-center mx-auto mb-2 border-2 border-opacity-40`} style={{ borderColor: s.color === 'bg-amber-500' ? '#f59e0b' : s.color === 'bg-emerald-500' ? '#10b981' : s.color === 'bg-slate-500' ? '#64748b' : '#78716c' }}>
                    <div className={`w-4 h-4 rounded-full ${s.color}`} />
                  </div>
                  <div className="text-sm font-semibold text-white">{s.state}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{s.desc}</div>
                </div>
                {i < 3 && (
                  <div className="hidden sm:block w-16 h-px bg-gradient-to-r from-slate-700 to-slate-600 mx-2" />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              FOSSIL is irreversible. SUPERSEDED must link to a replacement. No state allows deletion.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
