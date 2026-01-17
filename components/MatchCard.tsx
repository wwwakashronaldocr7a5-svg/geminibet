
import React, { useState, useEffect, useRef } from 'react';
import { Match, BetSelection } from '../types';
import { Sparkles, Loader2, ChevronDown, ChevronUp, TrendingUp, TrendingDown, Goal } from 'lucide-react';
import { getMatchInsight } from '../services/geminiService';

interface MatchCardProps {
  match: Match;
  onSelect: (selection: BetSelection) => void;
  activeSelection?: string;
}

const OddButton: React.FC<{
  label: string;
  value: number;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, value, isActive, onClick }) => {
  const prevValue = useRef(value);
  const [trend, setTrend] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (value > prevValue.current) {
      setTrend('up');
      const timer = setTimeout(() => setTrend(null), 3000);
      prevValue.current = value;
      return () => clearTimeout(timer);
    } else if (value < prevValue.current) {
      setTrend('down');
      const timer = setTimeout(() => setTrend(null), 3000);
      prevValue.current = value;
      return () => clearTimeout(timer);
    }
    prevValue.current = value;
  }, [value]);

  return (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`group relative flex flex-col items-center p-2 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20 scale-[1.02]' 
          : 'bg-[#1a1d23] hover:bg-[#262b35] text-white'
      } ${trend === 'up' ? 'ring-1 ring-green-500/50' : trend === 'down' ? 'ring-1 ring-red-500/50' : ''}`}
    >
      <span className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isActive ? 'text-black/60' : 'text-gray-500'}`}>
        {label === '1' ? 'Home' : label === '2' ? 'Away' : 'Draw'}
      </span>
      <span className="font-mono font-black text-lg flex items-center gap-1 tabular-nums">
        {value.toFixed(2)}
        {trend === 'up' && <TrendingUp size={12} className="text-green-500" />}
        {trend === 'down' && <TrendingDown size={12} className="text-red-500" />}
      </span>
      {trend && (
        <div className={`absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping ${trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`}></div>
      )}
    </button>
  );
};

const MatchCard: React.FC<MatchCardProps> = ({ match, onSelect, activeSelection }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [showInsight, setShowInsight] = useState(false);
  
  const prevScore = useRef(match.score);
  const [scoringTeam, setScoringTeam] = useState<'home' | 'away' | null>(null);
  const [showGoalOverlay, setShowGoalOverlay] = useState(false);

  useEffect(() => {
    if (match.status !== 'LIVE' || !match.score) return;

    const homeChanged = match.score.home > (prevScore.current?.home ?? 0);
    const awayChanged = match.score.away > (prevScore.current?.away ?? 0);

    if (homeChanged || awayChanged) {
      const team = homeChanged ? 'home' : 'away';
      setScoringTeam(team);
      setShowGoalOverlay(true);
      
      const timer = setTimeout(() => {
        setScoringTeam(null);
        setShowGoalOverlay(false);
      }, 4000);

      prevScore.current = { ...match.score };
      return () => clearTimeout(timer);
    }
    prevScore.current = { ...match.score };
  }, [match.score, match.status]);

  const handleFetchInsight = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (insight) {
      setShowInsight(!showInsight);
      return;
    }
    setLoadingInsight(true);
    const data = await getMatchInsight(match);
    setInsight(data);
    setLoadingInsight(false);
    setShowInsight(true);
  };

  return (
    <div className="bg-[#16191f] rounded-3xl overflow-hidden border border-[#262b35] hover:border-gray-700 transition-all duration-300 relative group/card shadow-xl">
      {/* GOAL Overlay */}
      {showGoalOverlay && (
        <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-3xl">
          <div className="absolute inset-0 bg-green-500/20 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-in zoom-in duration-500 fill-mode-forwards">
            <div className="bg-green-500 text-white px-6 py-3 rounded-2xl font-black italic text-2xl shadow-[0_0_50px_rgba(34,197,94,0.5)] flex items-center gap-3 border-2 border-white/20 rotate-[-2deg]">
              <Goal size={32} className="animate-bounce" />
              {scoringTeam === 'home' ? 'HOME GOAL!' : 'AWAY GOAL!'}
            </div>
          </div>
          <div className="absolute inset-0">
             {[...Array(6)].map((_, i) => (
               <div key={i} className={`absolute h-1 w-1 bg-yellow-400 rounded-full animate-ping`} style={{ 
                 top: `${Math.random() * 100}%`, 
                 left: `${Math.random() * 100}%`,
                 animationDelay: `${i * 200}ms`
               }}></div>
             ))}
          </div>
        </div>
      )}

      <div className="p-5">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <span className="bg-[#262b35] text-[10px] font-black px-2.5 py-1 rounded-lg text-gray-400 uppercase tracking-tighter border border-white/5">
              {match.league}
            </span>
            <span className={`text-[10px] font-black flex items-center gap-1.5 ${match.status === 'LIVE' ? 'text-red-500' : 'text-gray-500'}`}>
              {match.status === 'LIVE' && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.5)]"></span>}
              {match.startTime}
            </span>
          </div>
          <button 
            onClick={handleFetchInsight}
            disabled={loadingInsight}
            className="flex items-center gap-1.5 text-[10px] font-black text-yellow-400 hover:text-white transition-all uppercase tracking-widest bg-yellow-400/5 hover:bg-yellow-400/20 px-3 py-1.5 rounded-full"
          >
            {loadingInsight ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
            AI INSIGHT
          </button>
        </div>

        {/* AI Insight Section */}
        {showInsight && insight && (
          <div className="mb-5 bg-yellow-400/5 border border-yellow-400/20 p-4 rounded-2xl text-[11px] leading-relaxed italic text-yellow-100/90 animate-in fade-in slide-in-from-top-2 duration-300 relative">
             <div className="absolute -top-2 left-4 w-4 h-4 bg-[#1a1d23] border-l border-t border-yellow-400/20 rotate-45"></div>
            {insight}
          </div>
        )}

        {/* Teams and Score */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="flex-1 flex flex-col items-center">
            <div className={`w-14 h-14 bg-[#262b35] rounded-3xl mb-3 flex items-center justify-center font-black text-2xl border transition-all duration-500 ${scoringTeam === 'home' ? 'border-green-500 scale-110 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'border-white/5 group-hover/card:border-yellow-400/30'}`}>
              {match.homeTeam.charAt(0)}
            </div>
            <span className="text-xs font-black text-center h-10 flex items-center leading-tight line-clamp-2 uppercase tracking-tight">{match.homeTeam}</span>
          </div>

          <div className="flex flex-col items-center px-6">
            {match.status === 'LIVE' ? (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-4 text-4xl font-black tabular-nums transition-all">
                  <span className={`transition-all duration-500 ${scoringTeam === 'home' ? 'text-green-500 scale-125' : 'text-white'}`}>
                    {match.score?.home}
                  </span>
                  <span className="text-gray-700 text-2xl">:</span>
                  <span className={`transition-all duration-500 ${scoringTeam === 'away' ? 'text-green-500 scale-125' : 'text-white'}`}>
                    {match.score?.away}
                  </span>
                </div>
                <div className="mt-2 bg-red-500/10 text-red-500 text-[9px] font-black px-2 py-0.5 rounded-full animate-pulse uppercase tracking-widest">Live Momentum</div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-gray-700 font-black text-2xl italic tracking-tighter opacity-50 uppercase">VS</span>
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col items-center">
            <div className={`w-14 h-14 bg-[#262b35] rounded-3xl mb-3 flex items-center justify-center font-black text-2xl border transition-all duration-500 ${scoringTeam === 'away' ? 'border-green-500 scale-110 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'border-white/5 group-hover/card:border-yellow-400/30'}`}>
              {match.awayTeam.charAt(0)}
            </div>
            <span className="text-xs font-black text-center h-10 flex items-center leading-tight line-clamp-2 uppercase tracking-tight">{match.awayTeam}</span>
          </div>
        </div>

        {/* Odds Section */}
        <div className="grid grid-cols-3 gap-3">
          <OddButton 
            label="1" 
            value={match.odds.homeWin} 
            isActive={activeSelection === '1'}
            onClick={() => onSelect({ matchId: match.id, selection: '1', odd: match.odds.homeWin, homeTeam: match.homeTeam, awayTeam: match.awayTeam })}
          />

          {match.odds.draw ? (
            <OddButton 
              label="X" 
              value={match.odds.draw} 
              isActive={activeSelection === 'X'}
              onClick={() => onSelect({ matchId: match.id, selection: 'X', odd: match.odds.draw!, homeTeam: match.homeTeam, awayTeam: match.awayTeam })}
            />
          ) : (
             <div className="bg-[#1a1d23]/50 border border-[#262b35] border-dashed rounded-xl flex items-center justify-center opacity-40">
               <span className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Locked</span>
             </div>
          )}

          <OddButton 
            label="2" 
            value={match.odds.awayWin} 
            isActive={activeSelection === '2'}
            onClick={() => onSelect({ matchId: match.id, selection: '2', odd: match.odds.awayWin, homeTeam: match.homeTeam, awayTeam: match.awayTeam })}
          />
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
