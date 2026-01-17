
import React, { useState, useMemo } from 'react';
import { BetHistoryItem, BetStatus } from '../types';
import { CheckCircle2, XCircle, Clock, ChevronRight, Search, FilterX, Filter } from 'lucide-react';

interface BetHistoryProps {
  history: BetHistoryItem[];
  isOpen: boolean;
  onClose: () => void;
}

const StatusBadge: React.FC<{ status: BetStatus }> = ({ status }) => {
  switch (status) {
    case 'WON':
      return (
        <span className="flex items-center gap-1 text-green-500 font-bold text-[10px] uppercase">
          <CheckCircle2 size={12} /> WON
        </span>
      );
    case 'LOST':
      return (
        <span className="flex items-center gap-1 text-red-500 font-bold text-[10px] uppercase">
          <XCircle size={12} /> LOST
        </span>
      );
    default:
      return (
        <span className="flex items-center gap-1 text-yellow-400 font-bold text-[10px] uppercase">
          <Clock size={12} /> PENDING
        </span>
      );
  }
};

const BetHistory: React.FC<BetHistoryProps> = ({ history, isOpen, onClose }) => {
  const [statusFilter, setStatusFilter] = useState<BetStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = useMemo(() => {
    return history.filter(bet => {
      const matchesStatus = statusFilter === 'ALL' || bet.status === statusFilter;
      const matchesSearch = bet.selections.some(sel => 
        sel.homeTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sel.awayTeam.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bet.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return matchesStatus && matchesSearch;
    });
  }, [history, statusFilter, searchQuery]);

  const clearFilters = () => {
    setStatusFilter('ALL');
    setSearchQuery('');
  };

  const isFiltered = statusFilter !== 'ALL' || searchQuery !== '';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#16191f] w-full max-w-lg h-full border-l border-[#262b35] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-[#262b35] flex justify-between items-center bg-[#1a1d23]">
          <div>
            <h2 className="text-xl font-black italic uppercase">My <span className="text-yellow-400">Bet History</span></h2>
            <p className="text-xs text-gray-500 font-bold">Showing {filteredHistory.length} of {history.length} bets</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#262b35] rounded-full transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-4 bg-[#1a1d23] border-b border-[#262b35] space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {(['ALL', 'WON', 'LOST', 'PENDING'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                  statusFilter === status 
                    ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/10' 
                    : 'bg-[#262b35] text-gray-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
            
            {isFiltered && (
              <button 
                onClick={clearFilters}
                className="ml-auto flex items-center gap-1.5 text-[10px] font-black text-red-400 hover:text-red-300 transition-colors uppercase tracking-widest bg-red-400/10 px-3 py-1.5 rounded-lg"
              >
                <FilterX size={12} />
                Clear Filters
              </button>
            )}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={14} />
            <input 
              type="text"
              placeholder="Search by team or bet ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0f1115] border border-[#262b35] pl-9 pr-4 py-2 rounded-xl text-[11px] font-bold text-white focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-all placeholder:text-gray-700"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {filteredHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-50 px-8">
              <div className="w-16 h-16 bg-[#262b35] rounded-full flex items-center justify-center mb-4">
                {isFiltered ? <Filter size={32} /> : <Clock size={32} />}
              </div>
              <p className="text-sm font-bold">
                {isFiltered ? 'No bets match your filters.' : 'No bets placed yet.'}
              </p>
              <p className="text-xs">
                {isFiltered 
                  ? 'Try adjusting your search or status selection.' 
                  : 'Start betting to see your history here!'}
              </p>
              {isFiltered && (
                <button 
                  onClick={clearFilters}
                  className="mt-4 text-yellow-400 font-bold text-xs hover:underline uppercase tracking-widest"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            filteredHistory.map((bet) => (
              <div key={bet.id} className="bg-[#1a1d23] rounded-2xl border border-[#262b35] overflow-hidden group hover:border-gray-700 transition-all">
                <div className="p-4 border-b border-[#262b35] flex justify-between items-center bg-[#262b35]/30 group-hover:bg-[#262b35]/50 transition-colors">
                  <div className="text-[10px] text-gray-500 font-bold">
                    ID: {bet.id.slice(0, 8)} • {bet.placedAt.toLocaleDateString()}
                  </div>
                  <StatusBadge status={bet.status} />
                </div>
                
                <div className="p-4 space-y-3">
                  {bet.selections.map((sel, idx) => (
                    <div key={idx} className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{sel.homeTeam} vs {sel.awayTeam}</span>
                        <span className="text-[10px] text-yellow-400 font-bold uppercase tracking-tighter">
                          Selection: {sel.selection === '1' ? 'Home' : sel.selection === '2' ? 'Away' : 'Draw'}
                        </span>
                      </div>
                      <span className="font-mono text-sm font-bold text-gray-300">@{sel.odd.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-[#262b35]/50 grid grid-cols-3 gap-2 border-t border-[#262b35]">
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Total Odds</p>
                    <p className="font-mono font-bold text-white">{bet.totalOdds.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Stake</p>
                    <p className="font-mono font-bold text-white">₹{bet.totalStake.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Payout</p>
                    <p className={`font-mono font-bold ${bet.status === 'WON' ? 'text-green-500' : 'text-yellow-400'}`}>
                      ₹{bet.potentialPayout.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            )).reverse()
          )}
        </div>
      </div>
    </div>
  );
};

export default BetHistory;
