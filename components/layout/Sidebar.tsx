import React from 'react';
import type { ViewType } from '../../types';
import { DashboardIcon, ChatIcon, FileWarningIcon, GraduationCapIcon, BrainCircuitIcon } from '../shared/Icon';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { id: 'simulation', label: 'Audit Simulation', icon: ChatIcon },
  { id: 'agent', label: 'Your Expert Audit Agent', icon: BrainCircuitIcon },
  { id: 'findings', label: 'Findings Tracker', icon: FileWarningIcon },
  { id: 'training', label: 'Training Paths', icon: GraduationCapIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <div className="w-64 bg-brand-primary text-white flex flex-col flex-shrink-0">
      <div className="h-20 flex items-center justify-center border-b border-blue-800">
        <h1 className="text-2xl font-extrabold tracking-wider">Nodaysoffai</h1>
      </div>
      <nav className="flex-1 px-4 py-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.id} className="relative">
              <button
                onClick={() => setCurrentView(item.id as ViewType)}
                className={`w-full flex items-center px-4 py-3 my-1 rounded-lg transition-colors duration-200 text-left ${
                  currentView === item.id
                    ? 'bg-brand-secondary text-white'
                    : 'text-blue-200 hover:bg-brand-secondary hover:text-white'
                }`}
              >
                <item.icon className="h-6 w-6 mr-4" />
                <span className="font-semibold">{item.label}</span>
              </button>
              {currentView === item.id && (
                <div className="absolute left-0 top-0 h-full w-1 bg-brand-light rounded-r-full"></div>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="px-4 py-6 border-t border-blue-800 text-center text-xs text-blue-300">
        <p>Nodaysoffai Co-Pilot &copy; 2024</p>
      </div>
    </div>
  );
};