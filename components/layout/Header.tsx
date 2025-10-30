
import React, { useState, useRef, useEffect } from 'react';
import type { ViewType, Notification } from '../../types';
import { SearchIcon, ChevronDownIcon, UserIcon } from '../shared/Icon';

interface HeaderProps {
  currentView: ViewType;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const viewTitles: Record<ViewType, string> = {
  dashboard: 'Readiness Dashboard',
  simulation: 'Audit Simulation Engine',
  findings: 'Non-Conformity Tracker',
  training: 'Role-Based Readiness Training',
  agent: 'Your Expert Audit Agent',
};

const mockNotifications: Notification[] = [
    { id: 1, text: 'New finding "MAJ-03" assigned to you.', time: '15m ago' },
    { id: 2, text: 'CAPA for "MIN-02" is due in 3 days.', time: '1h ago' },
    { id: 3, text: 'Documentation "BCP-01" was approved.', time: 'yesterday' },
];

export const Header: React.FC<HeaderProps> = ({ currentView, searchQuery, setSearchQuery }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-20 bg-white border-b border-gray-border flex items-center justify-between px-8 flex-shrink-0 z-10">
      <h2 className="text-2xl font-bold text-gray-800">{viewTitles[currentView]}</h2>
      
      <div className="flex items-center space-x-6">
        <div className="relative w-64">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search findings, documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-light border border-gray-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-light"
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative" ref={notificationsRef}>
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative focus:outline-none">
              <svg className="w-6 h-6 text-gray-500 hover:text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border border-gray-border overflow-hidden">
                <div className="p-3 font-bold text-gray-700 border-b">Notifications</div>
                <ul>
                  {mockNotifications.map(n => (
                    <li key={n.id} className="p-3 border-b hover:bg-gray-50 cursor-pointer">
                      <p className="text-sm text-gray-800">{n.text}</p>
                      <p className="text-xs text-gray-400">{n.time}</p>
                    </li>
                  ))}
                </ul>
                <div className="p-2 text-center bg-gray-light">
                  <a href="#" className="text-sm font-semibold text-brand-primary hover:underline">View All</a>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative" ref={userMenuRef}>
            <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center space-x-3 cursor-pointer focus:outline-none">
                <img src="https://i.pravatar.cc/40?u=jane-doe" alt="User Avatar" className="w-10 h-10 rounded-full" />
                <div>
                    <p className="font-semibold text-sm text-gray-dark text-left">Jane Doe</p>
                    <p className="text-xs text-gray-medium">Compliance Officer</p>
                </div>
                <ChevronDownIcon className={`w-4 h-4 text-gray-medium transition-transform ${showUserMenu ? 'rotate-180' : ''}`}/>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-border py-1">
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t mt-1 pt-1">Logout</a>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};