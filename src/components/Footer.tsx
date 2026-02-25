import React from 'react';
import { Layers, Github, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/50 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Layers className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-bold tracking-wider text-white">QUASANTUM</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              An Emergent Cognitive Commons. Built for the deliberate construction of shared thought over time.
            </p>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-slate-500">System operational</span>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {['Explore Fields', 'Create a Field', 'Submit Proposal', 'Public Artifacts', 'Governance Model'].map(item => (
                <li key={item}>
                  <button className="text-sm text-slate-500 hover:text-indigo-400 transition-colors">{item}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Principles */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-4">Principles</h4>
            <ul className="space-y-2.5">
              {['Continuity', 'Artifact-Centric', 'Non-Destructive', 'Constraint Governance', 'Sovereign Fields', 'Platform Neutrality'].map(item => (
                <li key={item}>
                  <button className="text-sm text-slate-500 hover:text-indigo-400 transition-colors">{item}</button>
                </li>
              ))}
            </ul>
          </div>

          {/* Governance */}
          <div>
            <h4 className="text-xs font-semibold tracking-widest uppercase text-slate-400 mb-4">Governance</h4>
            <ul className="space-y-2.5">
              {['Role Definitions', 'State Lifecycle', 'Constraint Rules', 'Proposal System', 'Visibility Model', 'Stewardship'].map(item => (
                <li key={item}>
                  <button className="text-sm text-slate-500 hover:text-indigo-400 transition-colors">{item}</button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs text-slate-600">
            <span>No engagement metrics.</span>
            <span>No trending.</span>
            <span>No ranking by popularity.</span>
          </div>
          <div className="text-xs text-slate-600">
            Emergence through relation, continuity, and stewardship.
          </div>
        </div>
      </div>
    </footer>
  );
}
