import { useSyncExternalStore, useCallback } from 'react';
import type { AppView, Field, Artifact, Constraint, Relation, Proposal, ArtifactVersion, FieldMembership } from './types';

interface AppState {
  currentView: AppView;
  selectedFieldId: string | null;
  selectedArtifactId: string | null;
  fields: Field[];
  artifacts: Artifact[];
  constraints: Constraint[];
  relations: Relation[];
  proposals: Proposal[];
  versions: ArtifactVersion[];
  memberships: FieldMembership[];
  artifactTypeFilter: string;
  artifactStateFilter: string;
  searchQuery: string;
  modalOpen: string | null;
  currentUser: { id: string; display_name: string; email: string } | null;
  currentRole: string | null;
}

const initialState: AppState = {
  currentView: 'home',
  selectedFieldId: null,
  selectedArtifactId: null,
  fields: [],
  artifacts: [],
  constraints: [],
  relations: [],
  proposals: [],
  versions: [],
  memberships: [],
  artifactTypeFilter: 'ALL',
  artifactStateFilter: 'ALL',
  searchQuery: '',
  modalOpen: null,
  currentUser: null,
  currentRole: null,
};

let state = { ...initialState };
const listeners = new Set<() => void>();

function emitChange() {
  listeners.forEach(l => l());
}

function setState(partial: Partial<AppState>) {
  state = { ...state, ...partial };
  emitChange();
}

function getState(): AppState {
  return state;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// Hook
export function useStore(): AppState & {
  setView: (view: AppView, fieldId?: string | null, artifactId?: string | null) => void;
  setFields: (fields: Field[]) => void;
  setArtifacts: (artifacts: Artifact[]) => void;
  setConstraints: (constraints: Constraint[]) => void;
  setRelations: (relations: Relation[]) => void;
  setProposals: (proposals: Proposal[]) => void;
  setVersions: (versions: ArtifactVersion[]) => void;
  setMemberships: (memberships: FieldMembership[]) => void;
  addArtifact: (artifact: Artifact) => void;
  updateArtifact: (id: string, updates: Partial<Artifact>) => void;
  addConstraint: (constraint: Constraint) => void;
  addRelation: (relation: Relation) => void;
  addProposal: (proposal: Proposal) => void;
  updateProposal: (id: string, updates: Partial<Proposal>) => void;
  addVersion: (version: ArtifactVersion) => void;
  setArtifactTypeFilter: (f: string) => void;
  setArtifactStateFilter: (f: string) => void;
  setSearchQuery: (q: string) => void;
  setModalOpen: (m: string | null) => void;
  setCurrentUser: (u: { id: string; display_name: string; email: string } | null) => void;
  setCurrentRole: (r: string | null) => void;
} {
  const snapshot = useSyncExternalStore(subscribe, getState, getState);

  return {
    ...snapshot,
    setView: (view, fieldId = null, artifactId = null) =>
      setState({ currentView: view, selectedFieldId: fieldId, selectedArtifactId: artifactId }),
    setFields: (fields) => setState({ fields }),
    setArtifacts: (artifacts) => setState({ artifacts }),
    setConstraints: (constraints) => setState({ constraints }),
    setRelations: (relations) => setState({ relations }),
    setProposals: (proposals) => setState({ proposals }),
    setVersions: (versions) => setState({ versions }),
    setMemberships: (memberships) => setState({ memberships }),
    addArtifact: (artifact) => setState({ artifacts: [...getState().artifacts, artifact] }),
    updateArtifact: (id, updates) =>
      setState({ artifacts: getState().artifacts.map(a => a.id === id ? { ...a, ...updates } : a) }),
    addConstraint: (constraint) => setState({ constraints: [...getState().constraints, constraint] }),
    addRelation: (relation) => setState({ relations: [...getState().relations, relation] }),
    addProposal: (proposal) => setState({ proposals: [...getState().proposals, proposal] }),
    updateProposal: (id, updates) =>
      setState({ proposals: getState().proposals.map(p => p.id === id ? { ...p, ...updates } : p) }),
    addVersion: (version) => setState({ versions: [...getState().versions, version] }),
    setArtifactTypeFilter: (f) => setState({ artifactTypeFilter: f }),
    setArtifactStateFilter: (f) => setState({ artifactStateFilter: f }),
    setSearchQuery: (q) => setState({ searchQuery: q }),
    setModalOpen: (m) => setState({ modalOpen: m }),
    setCurrentUser: (u) => setState({ currentUser: u }),
    setCurrentRole: (r) => setState({ currentRole: r }),
  };
}

// Static access for non-component code
useStore.getState = getState;
useStore.setState = setState;
