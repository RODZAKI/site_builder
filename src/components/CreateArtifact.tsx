import React, { useState } from 'react';
import { useStore } from '../lib/store';
import type { ArtifactType, ArtifactVisibility } from '../lib/types';
import { createArtifact } from '../lib/services';

import { ArrowLeft, Save, FileText, BookOpen, Scroll, BookMarked, Library, Award, Globe, Eye, Lock } from 'lucide-react';

const types: { value: ArtifactType; label: string; icon: React.ElementType; desc: string }[] = [
  { value: 'NOTE', label: 'Note', icon: FileText, desc: 'Quick thought or observation' },
  { value: 'FRAGMENT', label: 'Fragment', icon: Scroll, desc: 'Partial idea or excerpt' },
  { value: 'ESSAY', label: 'Essay', icon: BookOpen, desc: 'Developed argument or exploration' },
  { value: 'CHAPTER', label: 'Chapter', icon: BookMarked, desc: 'Section of a larger work' },
  { value: 'TREATISE', label: 'Treatise', icon: Library, desc: 'Comprehensive formal treatment' },
  { value: 'CHARTER', label: 'Charter', icon: Award, desc: 'Governance document for the field' },
];

const visibilities: { value: ArtifactVisibility; label: string; icon: React.ElementType }[] = [
  { value: 'PRIVATE', label: 'Private', icon: Lock },
  { value: 'FIELD_ONLY', label: 'Field Only', icon: Eye },
  { value: 'PUBLIC', label: 'Public', icon: Globe },
];

export default function CreateArtifact() {
  const { selectedFieldId, fields, currentUser, setView } = useStore();
  const field = fields.find(f => f.id === selectedFieldId);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState<ArtifactType>('NOTE');
  const [visibility, setVisibility] = useState<ArtifactVisibility>('FIELD_ONLY');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!field || !currentUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    setError(null);

    try {
      const result = await createArtifact({
        field_id: selectedFieldId!,
        title: title.trim(),
        content: content.trim(),
        type,
        visibility,
      });

      console.log("CREATED:", result);

      const newId = result?.id;

      if (!newId) {
        throw new Error("No ID returned from Supabase");
      }

      setView('artifact-detail', selectedFieldId, newId);
    } catch (err: any) {
      console.error("CREATE FAILED:", err);
      setError(err.message || "Failed to create artifact");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => setView('field-detail', selectedFieldId)}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to {field.name}
        </button>

        <h1 className="text-2xl font-bold text-white mb-8">Create New Artifact</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Type selector */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Artifact Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {types.map(t => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    type === t.value
                      ? 'bg-indigo-500/10 border-indigo-500/30 ring-1 ring-indigo-500/30'
                      : 'bg-slate-900/40 border-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <t.icon className={`w-5 h-5 mb-1.5 ${type === t.value ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <div className={`text-sm font-medium ${type === t.value ? 'text-white' : 'text-slate-300'}`}>{t.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Visibility</label>
            <div className="flex gap-3">
              {visibilities.map(v => (
                <button
                  key={v.value}
                  type="button"
                  onClick={() => setVisibility(v.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all ${
                    visibility === v.value
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                      : 'bg-slate-900/40 border-slate-800/50 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <v.icon className="w-4 h-4" />
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              placeholder="Enter artifact title..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={16}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none font-mono leading-relaxed"
              placeholder="Write your artifact content here..."
            />
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-xl transition-colors"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Creating...' : 'Create Artifact'}
            </button>
            <span className="text-xs text-slate-500">Writes directly to Supabase</span>
          </div>
        </form>
      </div>
    </div>
  );
}