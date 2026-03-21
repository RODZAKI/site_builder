import React, { createContext, useContext, useState, useEffect } from 'react';
import { getFields } from '../lib/services';
import { useStore } from '../lib/store';

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const defaultAppContext: AppContextType = {
  sidebarOpen: false,
  toggleSidebar: () => {},
};

const AppContext = createContext<AppContextType>(defaultAppContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setFields } = useStore();

  useEffect(() => {
    getFields()
      .then((fields) => {
        setFields(fields);
      })
      .catch((err) => {
        console.error('Failed to load fields from Supabase:', err);
        setFields([]);
      });
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <AppContext.Provider value={{ sidebarOpen, toggleSidebar }}>
      {children}
    </AppContext.Provider>
  );
};