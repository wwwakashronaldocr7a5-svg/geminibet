
import React, { useState, useEffect } from 'react';
import { BetSelection } from '../types';
import { X, Trash2, Wallet, Sparkles } from 'lucide-react';

interface BetSlipProps {
  selections: BetSelection[];
  onRemove: (matchId: string) => void;
  onClear: () => void;
  balance: number;
  onBetPlaced: (totalStake: number) => void;
}

const BetSlip: React.FC<BetSlipProps> = ({ selections, onRemove, onClear, balance, onBetPlaced }) => {
  const [stake, setStake] = useState<string>('100');
  const [placing, setPlacing] = useState(false);
  const [badgeAnimate, setBadgeAnimate] = useState(false);

  // Trigger badge animation when selections count changes
  useEffect(() => {
    if (selections.length > 0) {
      setBadgeAnimate(true);
      const timer = setTimeout(() => setBadgeAnimate(false), 300);
      return () => clearTimeout(timer);
    }
  }, [selections.length]);

  const totalOdds = selections.reduce((acc, sel) => acc * sel.odd, 1).toFixed(2);
  const potentialWinValue = parseFloat(stake || '0') * parseFloat(totalOdds);
  const potentialWin = potentialWinValue.toLocaleString('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2
  });

  const handlePlaceBet = () => {
    const stakeAmount = parseFloat(stake);
    if (isNaN(stakeAmount) || stakeAmount <= 0) return;
    if (stakeAmount > balance) {
      alert("Insufficient balance!");
      return;
    }

    setPlacing(true);
    setTimeout(() => {
      onBetPlaced(stakeAmount);
      setPlacing(false);
      onClear();
      alert("Bet placed successfully! Good luck!");
    }, 1500);
  };

  return (
    <div className="w-80 flex-shrink-0 bg-[#16191f] border-l border-[#262b35] hidden lg:flex flex-col sticky top-16 h-[calc(100vh-64px)]">
      <div className="p-4 border-b border-[#262b35] flex justify-between items-center bg-[#1a1d23]">
        <h2 className="font-bold text-lg flex items-center gap-2">
          Bet Slip
          <span className={`bg-yellow-400 text-black text-xs px-2 py-0.5 rounded-full transition-transform duration-300 ${badgeAnimate ? 'scale-125 font-black' : 'scale-100'}`}>
            {selections.length}
          </span>
        </h2>
        {selections.length > 0 && (
          <button 
            onClick={onClear} 
            className="text-gray-500 hover:text-red-400 transition-colors p-1 hover:bg-red-500/10 rounded-lg"
            title="Clear All"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
        {selections.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50 animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-[#262b35] rounded-full flex items-center justify-center border border-dashed border-gray-600">
              <Wallet size={32} />
            </div>
            <p className="text-sm font-medium">Your slip is empty.<br/><span className="text-xs text-gray-500">Select some odds to start!</span></p>
          </div>
        ) : (
          <div className="space-y-3">
            {selections.map((sel) => (
              <div 
                key={sel.matchId} 
                className="bg-[#262b35] p-3 rounded-lg border border-transparent hover:border-gray-600 transition-all relative animate-in fade-in slide-in-from-right-4 duration-300"
              >
                <button 
                  onClick={() => onRemove(sel.matchId)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-white p-1 hover:bg-white/5 rounded"
                >
                  <X size={14} />
                </button>
                <div className="pr-6">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Match Winner</span>
                    <div className="h-px flex-1 bg-gray-700/50"></div>
                  </div>
                  <p className="text-xs font-bold truncate text-white/90">{sel.homeTeam} vs {sel.awayTeam}</p>
                  <div className="flex justify-between items-end mt-2">
                    <div className="flex flex-col">
                      <span className="text-yellow-400 font-black text-xs uppercase italic">
                        {sel.selection === '1' ? 'Home' : sel.selection === '2' ? 'Away' : 'Draw'}
                      </span>
                    </div>
                    <span className="font-mono text-lg font-black text-white">
                      {sel.odd.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selections.length > 0 && (
        <div className="p-4 bg-[#1a1d23] border-t border-[#262b35] space-y-4 shadow-[0_-10px_20px_rgba(0,0,0,0.2)] animate-in slide-in-from-bottom duration-300">
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] text-gray-500 font-black uppercase tracking-widest">
              <span>Total Odds</span>
              <span className="text-white bg-[#262b35] px-2 py-0.5 rounded font-mono">{totalOdds}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-black text-gray-400 uppercase">Stake</span>
              <div className="relative group">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 text-xs font-black">₹</span>
                <input 
                  type="number"
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  className="bg-[#0f1115] text-right w-28 py-2 pl-6 pr-3 rounded-xl font-mono text-sm font-bold border border-[#262b35] focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="bg-yellow-400/5 border border-yellow-400/20 p-3 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles size={32} className="text-yellow-400" />
            </div>
            <div className="flex justify-between items-center relative z-10">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-yellow-400/60 uppercase tracking-widest">Potential Win</span>
                <span className={`text-xl font-black text-yellow-400 font-mono transition-all duration-300 ${badgeAnimate ? 'scale-105' : 'scale-100'}`}>
                  ₹{potentialWin}
                </span>
              </div>
            </div>
          </div>

          <button 
            disabled={placing}
            onClick={handlePlaceBet}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl ${
              placing 
                ? 'bg-yellow-600 cursor-not-allowed text-black/50' 
                : 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-yellow-400/10 hover:shadow-yellow-400/20 active:scale-[0.98]'
            }`}
          >
            {placing ? 'PROCESSSING...' : 'CONFIRM BET'}
          </button>
        </div>
      )}
    </div>
  );
};

export default BetSlip;
