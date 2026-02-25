import React, { useState } from 'react';
import { useStore } from '../lib/store';
import {
  ArrowLeft, FileText, BookOpen, Scroll, BookMarked, Library, Award,
  GitBranch, Eye, Lock, Globe, User, Clock, Edit3, Save, X,
  ChevronDown, ChevronUp, Link2, Zap, AlertTriangle, ArrowRight, Minus, Shield
} from 'lucide-react';

const typeIcons: Record<string, React.ElementType> = {
  NOTE: FileText, FRAGMENT: Scroll, ESSAY: BookOpen, CHAPTER: BookMarked, TREATISE: Library, CHARTER: Award,
};

const stateColors: Record<string, string> = {
  DRAFT: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  LIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  SUPERSEDED: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  FOSSIL: 'bg-stone-500/10 text-stone-400 border-stone-500/20',
};

const relationColors: Record<string, string> = {
  SUPPORTS: 'text-emerald-400', CONTRADICTS: 'text-red-400', EXTENDS: 'text-blue-400',
  SUPERSEDES: 'text-amber-400', DERIVES_FROM: 'text-purple-400', PARALLELS: 'text-cyan-400',
};

export default function ArtifactDetail() {
  const {
    selectedFieldId, selectedArtifactId, artifacts, versions, relations, fields,
    setView, currentUser, currentRole, updateArtifact, addVersion
  } = useStore();

  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [showVersions, setShowVersions] = useState(false);
  const [showTransitions, setShowTransitions] = useState(false);

  const artifact = artifacts.find(a => a.id === selectedArtifactId);
  const field = fields.find(f => f.id === selectedFieldId);
  if (!artifact || !field) return null;

  const artifactVersions = versions.filter(v => v.artifact_id === artifact.id).sort((a, b) => b.version_number - a.version_number);
  const artifactRelations = relations.filter(r => r.from_artifact_id === artifact.id || r.to_artifact_id === artifact.id);

  const isSteward = currentRole === 'STEWARD' && currentUser?.id === field.steward_user_id;
  const canEdit = isSteward || currentRole === 'EDITOR' || (currentRole === 'CONTRIBUTOR' && currentUser?.id === artifact.original_author);
  const TypeIcon = typeIcons[artifact.type] || FileText;

  const startEditing = () => {
    setEditContent(artifact.content);
    setEditTitle(artifact.title);
    setEditing(true);
  };

  const saveEdit = () => {
    if (!editContent.trim()) return;
    const newVersionNum = (artifactVersions[0]?.version_number || 0) + 1;
    addVersion({
      id: `v-${Date.now()}`,
      artifact_id: artifact.id,
      version_number: newVersionNum,
      content_snapshot: `Edited: ${editTitle}`,
      edited_by: currentUser?.id || '',
      created_at: new Date().toISOString(),
      editor_name: currentUser?.display_name || 'Unknown',
    });
    updateArtifact(artifact.id, {
      title: editTitle,
      content: editContent,
      updated_at: new Date().toISOString(),
      version_count: newVersionNum,
    });
    setEditing(false);
  };

  const handleStateTransition = (newState: string) => {
    if (artifact.state === 'FOSSIL') return; // Irreversible
    updateArtifact(artifact.id, { state: newState as any, updated_at: new Date().toISOString() });
    setShowTransitions(false);
  };

  const availableTransitions = () => {
    const transitions: string[] = [];
    if (artifact.state === 'DRAFT') transitions.push('LIVE');
    if (artifact.state === 'LIVE') transitions.push('SUPERSEDED', 'FOSSIL');
    if (artifact.state === 'SUPERSEDED') transitions.push('FOSSIL');
    return transitions;
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back */}
        <button
          onClick={() => setView('field-detail', selectedFieldId)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to {field.name}
        </button>

        {/* Artifact header */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <TypeIcon className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">{artifact.type}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${stateColors[artifact.state]}`}>
                    {artifact.state}
                  </span>
                  <span className="text-xs text-slate-600 flex items-center gap-1">
                    {artifact.visibility === 'PUBLIC' ? <Globe className="w-3 h-3" /> : artifact.visibility === 'FIELD_ONLY' ? <Eye className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {artifact.visibility}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {canEdit && artifact.state !== 'FOSSIL' && !editing && (
                <button onClick={startEditing} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors">
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
              )}
              {isSteward && artifact.state !== 'FOSSIL' && (
                <div className="relative">
                  <button
                    onClick={() => setShowTransitions(!showTransitions)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg transition-colors"
                  >
                    <Shield className="w-3 h-3" /> Transition
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {showTransitions && (
                    <div className="absolute right-0 mt-1 w-40 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden z-10">
                      {availableTransitions().map(t => (
                        <button
                          key={t}
                          onClick={() => handleStateTransition(t)}
                          className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                        >
                          Transition to {t}
                          {t === 'FOSSIL' && <span className="text-red-400 ml-1">(irreversible)</span>}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {editing ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-2 text-lg font-semibold text-white focus:outline-none focus:border-indigo-500"
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={12}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 resize-none font-mono leading-relaxed"
              />
              <div className="flex items-center gap-2">
                <button onClick={saveEdit} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm rounded-lg transition-colors">
                  <Save className="w-4 h-4" /> Save (creates new version)
                </button>
                <button onClick={() => setEditing(false)} className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm rounded-lg transition-colors">
                  <X className="w-4 h-4" /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">{artifact.title}</h1>
              <div className="prose prose-invert prose-sm max-w-none">
                {artifact.content.split('\n\n').map((para, i) => {
                  if (para.startsWith('## ')) {
                    return <h2 key={i} className="text-lg font-semibold text-white mt-6 mb-3">{para.replace('## ', '')}</h2>;
                  }
                  if (para.startsWith('1. ') || para.startsWith('2. ') || para.startsWith('3. ')) {
                    return (
                      <div key={i} className="text-sm text-slate-300 leading-relaxed mb-2">
                        {para.split('\n').map((line, j) => {
                          const boldMatch = line.match(/\*\*(.*?)\*\*/);
                          if (boldMatch) {
                            return <p key={j} className="mb-1">{line.replace(/\*\*(.*?)\*\*/, '').trim()} <strong className="text-white">{boldMatch[1]}</strong>{line.split('**').pop()}</p>;
                          }
                          return <p key={j} className="mb-1">{line}</p>;
                        })}
                      </div>
                    );
                  }
                  return <p key={i} className="text-sm text-slate-300 leading-relaxed mb-4">{para}</p>;
                })}
              </div>
            </>
          )}

          {/* Meta */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {artifact.author_name}</span>
            <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" /> Version {artifact.version_count || 1}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Created {new Date(artifact.created_at).toLocaleDateString()}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Updated {new Date(artifact.updated_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Version history */}
        <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl overflow-hidden mb-6">
          <button
            onClick={() => setShowVersions(!showVersions)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-800/30 transition-colors"
          >
            <span className="text-sm font-semibold text-white flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-indigo-400" />
              Version History ({artifactVersions.length} versions)
            </span>
            {showVersions ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          {showVersions && (
            <div className="border-t border-slate-800">
              {artifactVersions.map((v, i) => (
                <div key={v.id} className={`flex items-start gap-4 p-4 ${i < artifactVersions.length - 1 ? 'border-b border-slate-800/50' : ''}`}>
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i === 0 ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'}`}>
                      v{v.version_number}
                    </div>
                    {i < artifactVersions.length - 1 && <div className="w-px h-full bg-slate-800 mt-1" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300">{v.content_snapshot}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span>{v.editor_name}</span>
                      <span>{new Date(v.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
              {artifactVersions.length === 0 && (
                <div className="p-4 text-center text-sm text-slate-500">No version history available.</div>
              )}
            </div>
          )}
        </div>

        {/* Relations */}
        {artifactRelations.length > 0 && (
          <div className="bg-slate-900/50 border border-slate-800/50 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-indigo-400" /> Relations ({artifactRelations.length})
            </h3>
            <div className="space-y-2">
              {artifactRelations.map(r => {
                const isFrom = r.from_artifact_id === artifact.id;
                const otherTitle = isFrom ? r.to_title : r.from_title;
                const otherId = isFrom ? r.to_artifact_id : r.from_artifact_id;
                return (
                  <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/30">
                    <span className={`text-xs font-medium ${relationColors[r.relation_type]}`}>
                      {isFrom ? r.relation_type : `${r.relation_type} (incoming)`}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <button
                      onClick={() => setView('artifact-detail', selectedFieldId, otherId)}
                      className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors truncate"
                    >
                      {otherTitle}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
