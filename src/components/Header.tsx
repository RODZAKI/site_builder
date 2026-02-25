import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { Search, Menu, X, ChevronDown, User, LogIn, Globe, Layers, BookOpen } from 'lucide-react';

export default function Header() {
  const { currentView, setView, searchQuery, setSearchQuery, currentUser, setCurrentUser, setCurrentRole, setModalOpen, fields, selectedFieldId } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const selectedField = fields.find(f => f.id === selectedFieldId);

  const handleLogin = () => {
    setCurrentUser({ id: 'u-001', display_name: 'Dr. Elara Voss', email: 'elara@example.com' });
    setCurrentRole('STEWARD');
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentRole(null);
    setUserMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('home')}>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-wider text-white">QUASANTUM</span>
            </div>
          </div>

          {/* Center nav - breadcrumb */}
          <nav className="hidden md:flex items-center gap-1 text-sm">
            <button
              onClick={() => setView('home')}
              className={`px-3 py-1.5 rounded-md transition-colors ${currentView === 'home' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <Globe className="w-4 h-4 inline mr-1.5" />
              Fields
            </button>
            {selectedField && (
              <>
                <ChevronDown className="w-3 h-3 text-slate-600 rotate-[-90deg]" />
                <button
                  onClick={() => setView('field-detail', selectedFieldId)}
                  className={`px-3 py-1.5 rounded-md transition-colors ${currentView === 'field-detail' ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                >
                  <BookOpen className="w-4 h-4 inline mr-1.5" />
                  {selectedField.name}
                </button>
              </>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className={`${searchOpen ? 'w-64' : 'w-0'} overflow-hidden transition-all duration-300`}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search artifacts..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-3 pr-8 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* User */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                {currentUser ? (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                    {currentUser.display_name.charAt(0)}
                  </div>
                ) : (
                  <User className="w-4 h-4" />
                )}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
                  {currentUser ? (
                    <>
                      <div className="px-4 py-3 border-b border-slate-800">
                        <p className="text-sm font-medium text-white">{currentUser.display_name}</p>
                        <p className="text-xs text-slate-400">{currentUser.email}</p>
                      </div>
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={handleLogin} className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2">
                        <LogIn className="w-4 h-4" />
                        Sign In as Steward
                      </button>
                      <button
                        onClick={() => {
                          setCurrentUser({ id: 'u-002', display_name: 'Marcus Chen', email: 'marcus@example.com' });
                          setCurrentRole('EDITOR');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Sign In as Editor
                      </button>
                      <button
                        onClick={() => {
                          setCurrentUser({ id: 'u-003', display_name: 'Aria Nakamura', email: 'aria@example.com' });
                          setCurrentRole('CONTRIBUTOR');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Sign In as Contributor
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl">
          <div className="px-4 py-3 space-y-1">
            <button onClick={() => { setView('home'); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">
              Fields
            </button>
            {selectedField && (
              <button onClick={() => { setView('field-detail', selectedFieldId); setMobileMenuOpen(false); }} className="block w-full text-left px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg">
                {selectedField.name}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
