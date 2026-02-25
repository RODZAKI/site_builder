import React, { useEffect } from 'react';
import { useStore } from '../lib/store';
import { seedFields, seedArtifacts, seedConstraints, seedRelations, seedProposals, seedVersions, seedMemberships } from '../lib/seedData';
import Header from './Header';
import Hero from './Hero';
import Principles from './Principles';
import StatsSection from './StatsSection';
import FieldDashboard from './FieldDashboard';
import PublicArtifacts from './PublicArtifacts';
import GovernanceSection from './GovernanceSection';
import FieldDetail from './FieldDetail';
import ArtifactDetail from './ArtifactDetail';
import CreateArtifact from './CreateArtifact';
import CreateFieldModal from './CreateFieldModal';
import Footer from './Footer';

const AppLayout: React.FC = () => {
  const { currentView, setFields, setArtifacts, setConstraints, setRelations, setProposals, setVersions, setMemberships, fields } = useStore();

  useEffect(() => {
    // Load seed data on mount
    if (fields.length === 0) {
      setFields(seedFields);
      setArtifacts(seedArtifacts);
      setConstraints(seedConstraints);
      setRelations(seedRelations);
      setProposals(seedProposals);
      setVersions(seedVersions);
      setMemberships(seedMemberships);
    }
  }, []);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Header />
      <CreateFieldModal />

      {currentView === 'home' && (
        <>
          <Hero />
          <StatsSection />
          <FieldDashboard />
          <PublicArtifacts />
          <Principles />
          <GovernanceSection />
        </>
      )}

      {currentView === 'field-detail' && <FieldDetail />}
      {currentView === 'artifact-detail' && <ArtifactDetail />}
      {currentView === 'create-artifact' && <CreateArtifact />}

      <Footer />
    </div>
  );
};

export default AppLayout;
