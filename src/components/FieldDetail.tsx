import React, { useState } from 'react';
import { useStore } from '../lib/store';
import ArtifactCard from './ArtifactCard';
import {
  ArrowLeft, Shield, Users, FileText, Lock, Globe, Plus, Filter, Search,
  ChevronDown, Eye, GitBranch, BookOpen, Scroll, BookMarked, Library, Award,
  Link2, AlertTriangle, ArrowRight, Minus, Zap, User, Send, CheckCircle, XCircle, ExternalLink
} from 'lucide-react';

const typeOptions = ['ALL', 'NOTE', 'FRAGMENT', 'ESSAY', 'CHAPTER', 'TREATISE', 'CHARTER'];
const stateOptions = ['ALL', 'DRAFT', 'LIVE', 'SUPERSEDED', 'FOSSIL'];

const relationColors: Record<string, string> = {
  SUPPORTS: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  CONTRADICTS: 'text-red-400 bg-red-500/10 border-red-500/20',
  EXTENDS: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  SUPERSEDES: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  DERIVES_FROM: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  PARALLELS: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
};

const relationIcons: Record<string, React.ElementType> = {
  SUPPORTS: Zap,
  CONTRADICTS: AlertTriangle,
  EXTENDS: ArrowRight,
  SUPERSEDES: ArrowRight,
  DERIVES_FROM: GitBranch,
  PARALLELS: Minus,
};

type Tab = 'artifacts' | 'constraints' | 'relations' | 'proposals' | 'members';

export default function FieldDetail() {
  const store = useStore();
  const {
    selectedFieldId, fields, artifacts, constraints, relations, proposals, memberships,
    setView, currentUser, currentRole, updateProposal, setConstraints, addProposal,
    artifactTypeFilter, setArtifactTypeFilter,
    artifactStateFilter, setArtifactStateFilter,
    searchQuery, setSearchQuery, setModalOpen
  } = store;


  const [tab, setTab] = useState<Tab>('artifacts');
  const [proposalForm, setProposalForm] = useState({ name: '', email: '', content: '', artifactId: '' });
  const [proposalSubmitted, setProposalSubmitted] = useState(false);

  const field = fields.find(f => f.id === selectedFieldId);
  if (!field) return null;

  const fieldArtifacts = artifacts.filter(a => a.field_id === selectedFieldId);
  const fieldConstraints = constraints.filter(c => c.field_id === selectedFieldId);
  const fieldRelations = relations.filter(r => {
    return fieldArtifacts.some(a => a.id === r.from_artifact_id || a.id === r.to_artifact_id);
  });
  const fieldProposals = proposals.filter(p => p.field_id === selectedFieldId);
  const fieldMembers = memberships.filter(m => m.field_id === selectedFieldId);

  const filteredArtifacts = fieldArtifacts.filter(a => {
    if (artifactTypeFilter !== 'ALL' && a.type !== artifactTypeFilter) return false;
    if (artifactStateFilter !== 'ALL' && a.state !== artifactStateFilter) return false;
    if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const isSteward = currentRole === 'STEWARD' && currentUser?.id === field.steward_user_id;

  const handleProposalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proposalForm.name || !proposalForm.email || !proposalForm.content) return;
    const newProposal = {
      id: `p-${Date.now()}`,
      field_id: selectedFieldId!,
      linked_artifact_id: proposalForm.artifactId || undefined,
      display_name: proposalForm.name,
      email: proposalForm.email,
      content: proposalForm.content,
      status: 'UNREVIEWED' as const,
      created_at: new Date().toISOString(),
    };
    addProposal(newProposal);
    setProposalForm({ name: '', email: '', content: '', artifactId: '' });
    setProposalSubmitted(true);
  };


  const tabs: { key: Tab; label: string; count: number; icon: React.ElementType }[] = [
    { key: 'artifacts', label: 'Artifacts', count: fieldArtifacts.length, icon: FileText },
    { key: 'constraints', label: 'Constraints', count: fieldConstraints.length, icon: Lock },
    { key: 'relations', label: 'Relations', count: fieldRelations.length, icon: Link2 },
    { key: 'proposals', label: 'Proposals', count: fieldProposals.length, icon: Send },
    { key: 'members', label: 'Members', count: fieldMembers.length, icon: Users },
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Back */}
        <button onClick={() => setView('home')} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Fields
        </button>

        {/* Field header */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                  field.mode === 'SHARED' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {field.mode === 'SHARED' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  {field.mode}
                </span>
                {field.participant_visibility === 'ALL_PARTICIPANTS_PUBLIC' && (
                  <span className="text-xs text-slate-500 flex items-center gap-1"><Eye className="w-3 h-3" /> Public participants</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">{field.name}</h1>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-white">{field.steward_display_name}</span>
                    <Shield className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-xs text-indigo-400">Steward</span>
                  </div>
                  {field.steward_bio && <p className="text-xs text-slate-500 mt-0.5">{field.steward_bio}</p>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{fieldArtifacts.length}</div>
                <div className="text-xs">Artifacts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{fieldConstraints.length}</div>
                <div className="text-xs">Constraints</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{fieldRelations.length}</div>
                <div className="text-xs">Relations</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2 border-b border-slate-800/50">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                tab === t.key
                  ? 'text-indigo-400 bg-indigo-500/10 border-b-2 border-indigo-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${tab === t.key ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-500'}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === 'artifacts' && (
          <div>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search artifacts..."
                  className="w-full bg-slate-900/50 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <select
                value={artifactTypeFilter}
                onChange={(e) => setArtifactTypeFilter(e.target.value)}
                className="bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                {typeOptions.map(t => <option key={t} value={t}>{t === 'ALL' ? 'All Types' : t}</option>)}
              </select>
              <select
                value={artifactStateFilter}
                onChange={(e) => setArtifactStateFilter(e.target.value)}
                className="bg-slate-900/50 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                {stateOptions.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All States' : s}</option>)}
              </select>
              {(isSteward || currentRole === 'EDITOR' || currentRole === 'CONTRIBUTOR') && (
                <button
                  onClick={() => setView('create-artifact', selectedFieldId)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" /> New Artifact
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredArtifacts.map(a => <ArtifactCard key={a.id} artifact={a} />)}
            </div>
            {filteredArtifacts.length === 0 && (
              <div className="text-center py-12 text-slate-500">No artifacts match your filters.</div>
            )}
          </div>
        )}

        {tab === 'constraints' && (
          <div className="space-y-4">
            {fieldConstraints.map(c => (
              <div key={c.id} className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/50">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-indigo-400" />
                    <h4 className="text-sm font-semibold text-white">{c.title}</h4>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                    c.status === 'SEALED'
                      ? 'bg-red-500/10 text-red-400 border-red-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {c.status === 'SEALED' ? <Lock className="w-3 h-3 mr-1" /> : null}
                    {c.status}
                  </span>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed mb-3">{c.content}</p>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>By {c.creator_name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] ${c.visibility === 'PUBLIC' ? 'text-teal-400' : 'text-slate-500'}`}>
                      {c.visibility}
                    </span>
                    {isSteward && c.status === 'PROVISIONAL' && (
                      <button
                        onClick={() => {
                          const idx = constraints.findIndex(x => x.id === c.id);
                          if (idx >= 0) {
                            const updated = [...constraints];
                            updated[idx] = { ...updated[idx], status: 'SEALED' };
                            useStore.getState().setConstraints(updated);
                          }
                        }}
                        className="px-2 py-0.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded text-[10px] font-medium transition-colors"
                      >
                        Seal Constraint
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {fieldConstraints.length === 0 && (
              <div className="text-center py-12 text-slate-500">No constraints defined for this field.</div>
            )}
          </div>
        )}

        {tab === 'relations' && (
          <div>
            {/* Relation graph visualization */}
            <div className="mb-6 p-6 rounded-xl bg-slate-900/40 border border-slate-800/50">
              <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-indigo-400" /> Relation Map
              </h3>
              <div className="relative min-h-[300px]">
                {/* Simple node visualization */}
                <svg className="w-full h-[300px]" viewBox="0 0 800 300">
                  {/* Draw relations as lines */}
                  {fieldRelations.map((r, i) => {
                    const fromIdx = fieldArtifacts.findIndex(a => a.id === r.from_artifact_id);
                    const toIdx = fieldArtifacts.findIndex(a => a.id === r.to_artifact_id);
                    if (fromIdx < 0 || toIdx < 0) return null;
                    const cols = Math.min(fieldArtifacts.length, 6);
                    const fromX = ((fromIdx % cols) + 0.5) * (800 / cols);
                    const fromY = (Math.floor(fromIdx / cols) + 0.5) * 120 + 30;
                    const toX = ((toIdx % cols) + 0.5) * (800 / cols);
                    const toY = (Math.floor(toIdx / cols) + 0.5) * 120 + 30;
                    const color = r.relation_type === 'SUPPORTS' ? '#34d399' : r.relation_type === 'CONTRADICTS' ? '#f87171' : r.relation_type === 'EXTENDS' ? '#60a5fa' : r.relation_type === 'SUPERSEDES' ? '#fbbf24' : r.relation_type === 'DERIVES_FROM' ? '#a78bfa' : '#22d3ee';
                    return (
                      <line key={r.id} x1={fromX} y1={fromY} x2={toX} y2={toY} stroke={color} strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray={r.relation_type === 'CONTRADICTS' ? '4,4' : 'none'} />
                    );
                  })}
                  {/* Draw artifact nodes */}
                  {fieldArtifacts.map((a, i) => {
                    const cols = Math.min(fieldArtifacts.length, 6);
                    const cx = ((i % cols) + 0.5) * (800 / cols);
                    const cy = (Math.floor(i / cols) + 0.5) * 120 + 30;
                    const stateColor = a.state === 'LIVE' ? '#34d399' : a.state === 'DRAFT' ? '#fbbf24' : a.state === 'SUPERSEDED' ? '#94a3b8' : '#78716c';
                    return (
                      <g key={a.id} className="cursor-pointer" onClick={() => setView('artifact-detail', selectedFieldId, a.id)}>
                        <circle cx={cx} cy={cy} r="20" fill={stateColor} fillOpacity="0.15" stroke={stateColor} strokeWidth="1.5" />
                        <circle cx={cx} cy={cy} r="4" fill={stateColor} />
                        <text x={cx} y={cy + 32} textAnchor="middle" className="text-[9px] fill-slate-400" style={{ fontSize: '9px' }}>
                          {a.title.length > 20 ? a.title.substring(0, 20) + '...' : a.title}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Relation list */}
            <div className="space-y-3">
              {fieldRelations.map(r => {
                const RelIcon = relationIcons[r.relation_type] || Link2;
                return (
                  <div key={r.id} className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${relationColors[r.relation_type]}`}>
                      <RelIcon className="w-3 h-3" />
                      {r.relation_type}
                    </span>
                    <button
                      onClick={() => setView('artifact-detail', selectedFieldId, r.from_artifact_id)}
                      className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors truncate max-w-[200px]"
                    >
                      {r.from_title}
                    </button>
                    <ArrowRight className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    <button
                      onClick={() => setView('artifact-detail', selectedFieldId, r.to_artifact_id)}
                      className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors truncate max-w-[200px]"
                    >
                      {r.to_title}
                    </button>
                  </div>
                );
              })}
              {fieldRelations.length === 0 && (
                <div className="text-center py-12 text-slate-500">No relations in this field yet.</div>
              )}
            </div>
          </div>
        )}

        {tab === 'proposals' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Proposal list */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Existing Proposals</h3>
              <div className="space-y-3">
                {fieldProposals.map(p => {
                  const statusColor = p.status === 'UNREVIEWED' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : p.status === 'REJECTED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : p.status === 'LINKED' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                  return (
                    <div key={p.id} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-white">{p.display_name}</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusColor}`}>
                          {p.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2 leading-relaxed">{p.content}</p>
                      {p.linked_artifact_title && (
                        <span className="text-[10px] text-indigo-400 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" /> Linked to: {p.linked_artifact_title}
                        </span>
                      )}
                      {isSteward && p.status === 'UNREVIEWED' && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-800">
                          <button
                            onClick={() => updateProposal(p.id, { status: 'LINKED' })}
                            className="px-2 py-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded text-xs transition-colors"
                          >
                            Link
                          </button>
                          <button
                            onClick={() => updateProposal(p.id, { status: 'INTEGRATED' })}
                            className="px-2 py-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 rounded text-xs transition-colors"
                          >
                            Integrate
                          </button>
                          <button
                            onClick={() => updateProposal(p.id, { status: 'REJECTED' })}
                            className="px-2 py-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded text-xs transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
                {fieldProposals.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-sm">No proposals yet.</div>
                )}
              </div>
            </div>

            {/* Submit proposal */}
            <div>
              <h3 className="text-sm font-semibold text-white mb-4">Submit a Proposal</h3>
              <form onSubmit={handleProposalSubmit} className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/50 space-y-4">
                {proposalSubmitted && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                    <CheckCircle className="w-4 h-4" /> Proposal submitted successfully.
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={proposalForm.name}
                    onChange={(e) => setProposalForm({ ...proposalForm, name: e.target.value })}
                    required
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Email (private)</label>
                  <input
                    type="email"
                    value={proposalForm.email}
                    onChange={(e) => setProposalForm({ ...proposalForm, email: e.target.value })}
                    required
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Link to Artifact (optional)</label>
                  <select
                    value={proposalForm.artifactId}
                    onChange={(e) => setProposalForm({ ...proposalForm, artifactId: e.target.value })}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">None</option>
                    {fieldArtifacts.filter(a => a.visibility === 'PUBLIC').map(a => (
                      <option key={a.id} value={a.id}>{a.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Proposal Content</label>
                  <textarea
                    value={proposalForm.content}
                    onChange={(e) => setProposalForm({ ...proposalForm, content: e.target.value })}
                    required
                    rows={4}
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                    placeholder="Describe your proposal..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Submit Proposal
                </button>
              </form>
            </div>
          </div>
        )}

        {tab === 'members' && (
          <div>
            {field.participant_visibility === 'ALL_PARTICIPANTS_PUBLIC' || isSteward ? (
              <div className="space-y-3">
                {fieldMembers.map(m => {
                  const roleColor = m.role === 'STEWARD' ? 'text-indigo-400 bg-indigo-500/10' : m.role === 'EDITOR' ? 'text-emerald-400 bg-emerald-500/10' : m.role === 'CONTRIBUTOR' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-400 bg-slate-500/10';
                  return (
                    <div key={m.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                          {m.user_id === 'u-001' ? 'EV' : m.user_id === 'u-002' ? 'MC' : m.user_id === 'u-003' ? 'AN' : 'JR'}
                        </div>
                        <span className="text-sm text-white">
                          {m.user_id === 'u-001' ? 'Dr. Elara Voss' : m.user_id === 'u-002' ? 'Marcus Chen' : m.user_id === 'u-003' ? 'Aria Nakamura' : 'Prof. Julian Reeves'}
                        </span>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleColor}`}>
                        {m.role}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Lock className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-500">Participant list is visible to the Steward only.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
