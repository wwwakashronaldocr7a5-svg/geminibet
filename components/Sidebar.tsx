
import React from 'react';
import { SPORTS_CONFIG } from '../constants';
import { SportType } from '../types';
import { ShieldCheck, User as UserIcon } from 'lucide-react';

interface SidebarProps {
  selectedSport: SportType | null;
  onSelectSport: (sport: SportType | null) => void;
  isAdminMode: boolean;
  onToggleAdmin: (isAdmin: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  selectedSport, 
  onSelectSport, 
  isAdminMode, 
  onToggleAdmin 
}) => {
  return (
    <div className="w-64 flex-shrink-0 bg-[#16191f] border-r border-[#262b35] hidden md:flex flex-col sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Admin Switcher */}
        <div className="p-1 bg-[#0f1115] rounded-xl border border-[#262b35] flex">
          <button 
            onClick={() => onToggleAdmin(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black transition-all ${
              !isAdminMode ? 'bg-yellow-400 text-black' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <UserIcon size={14} /> USER
          </button>
          <button 
            onClick={() => onToggleAdmin(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[10px] font-black transition-all ${
              isAdminMode ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <ShieldCheck size={14} /> ADMIN
          </button>
        </div>

        {!isAdminMode ? (
          <>
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Top Sports</h3>
              <nav className="space-y-1">
                <button
                  onClick={() => onSelectSport(null)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    selectedSport === null ? 'bg-yellow-400 text-black' : 'text-gray-300 hover:bg-[#262b35] hover:text-white'
                  }`}
                >
                  <span className="w-8 flex justify-center">🏆</span>
                  All Sports
                </button>
                {SPORTS_CONFIG.map((sport) => (
                  <button
                    key={sport.id}
                    onClick={() => onSelectSport(sport.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      selectedSport === sport.id ? 'bg-yellow-400 text-black' : 'text-gray-300 hover:bg-[#262b35] hover:text-white'
                    }`}
                  >
                    <span className="w-8 flex justify-center">{sport.icon}</span>
                    {sport.label}
                  </button>
                ))}
              </nav>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-xl text-black">
              <p className="font-bold text-sm">PROMO</p>
              <p className="text-xs font-semibold">Get 100% Bonus on your first deposit!</p>
              <button className="mt-2 w-full bg-black text-white py-1.5 rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors">
                CLAIM NOW
              </button>
            </div>
          </>
        ) : (
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Admin Panels</h3>
            <nav className="space-y-1">
              <button className="w-full flex items-center px-3 py-2 text-sm font-bold rounded-lg bg-[#262b35] text-white">
                <span className="w-8 flex justify-center">📊</span>
                Ledger
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-300 hover:bg-[#262b35] hover:text-white">
                <span className="w-8 flex justify-center">👥</span>
                Users
              </button>
              <button className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-300 hover:bg-[#262b35] hover:text-white">
                <span className="w-8 flex justify-center">🛠️</span>
                Settlements
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
