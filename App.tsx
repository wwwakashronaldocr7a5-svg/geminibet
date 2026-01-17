
import React, { useState, useEffect, useCallback } from 'react';
import { Search, User, Menu, Bell, Clock, TrendingUp, History as HistoryIcon, RefreshCcw, ShieldAlert } from 'lucide-react';
import Sidebar from './components/Sidebar';
import BetSlip from './components/BetSlip';
import MatchCard from './components/MatchCard';
import TransactionsModal from './components/TransactionsModal';
import BetHistory from './components/BetHistory';
import ProfileModal from './components/ProfileModal';
import HeaderBalance from './components/HeaderBalance';
import AdminDashboard from './components/AdminDashboard';
import { MOCK_MATCHES } from './constants';
import { SportType, BetSelection, BetHistoryItem, Match, UserProfile, AdminStats, WithdrawalRequest, UserAccount } from './types';
import { fetchOddsUpdates } from './services/oddsService';

const App: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>(MOCK_MATCHES);
  const [selectedSport, setSelectedSport] = useState<SportType | null>(null);
  const [activeTab, setActiveTab] = useState<'LIVE' | 'UPCOMING'>('LIVE');
  const [selections, setSelections] = useState<BetSelection[]>([]);
  const [betHistory, setBetHistory] = useState<BetHistoryItem[]>([]);
  const [pendingWithdrawals, setPendingWithdrawals] = useState<WithdrawalRequest[]>([]);
  
  const [users, setUsers] = useState<UserAccount[]>([
    {
      id: 'USR-928172',
      fullName: 'Alex Smith',
      email: 'alex.smith@example.com',
      phone: '+91 98765 43210',
      oddsFormat: 'Decimal',
      language: 'English',
      memberSince: 'March 2024',
      balance: 12500.00,
      status: 'ACTIVE',
      isVerified: true,
      totalBets: 42,
      isAdmin: true,
      payoutLimit: 50000
    },
    {
      id: 'USR-112039',
      fullName: 'Rajesh Kumar',
      email: 'rajesh.k@gmail.com',
      phone: '+91 77228 11092',
      oddsFormat: 'Decimal',
      language: 'Hindi',
      memberSince: 'January 2024',
      balance: 42500.00,
      status: 'ACTIVE',
      isVerified: false,
      totalBets: 156,
      payoutLimit: 25000
    }
  ]);

  const currentUserId = 'USR-928172';
  const currentUser = users.find(u => u.id === currentUserId)!;
  
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminStats, setAdminStats] = useState<AdminStats>({
    totalVolume: 582400,
    grossProfit: 120500,
    totalPayouts: 98200,
    netRevenue: 1022300.00,
    activeUsers: 2,
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      setMatches(current => fetchOddsUpdates(current));
      setLastUpdated(new Date());
      setTimeout(() => setIsRefreshing(false), 800);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredMatches = matches.filter(m => {
    const sportMatch = selectedSport ? m.sport === selectedSport : true;
    const tabMatch = m.status === activeTab;
    return sportMatch && tabMatch;
  });

  const updateCurrentUserBalance = useCallback((delta: number) => {
    setUsers(prev => prev.map(u => 
      u.id === currentUserId ? { ...u, balance: u.balance + delta } : u
    ));
  }, [currentUserId]);

  const handleSelectOdd = (selection: BetSelection) => {
    setSelections(prev => {
      const existing = prev.find(s => s.matchId === selection.matchId);
      if (existing) {
        if (existing.selection === selection.selection) {
          return prev.filter(s => s.matchId !== selection.matchId);
        }
        return prev.map(s => s.matchId === selection.matchId ? selection : s);
      }
      return [...prev, selection];
    });
  };

  const handleBetPlaced = (stake: number) => {
    if (currentUser.status === 'SUSPENDED') return;

    const totalOdds = selections.reduce((acc, s) => acc * s.odd, 1);
    const potentialPayout = stake * totalOdds;
    
    const newBet: BetHistoryItem = {
      id: Math.random().toString(36).substring(2, 11).toUpperCase(),
      selections: [...selections],
      totalStake: stake,
      totalOdds: totalOdds,
      potentialPayout: potentialPayout,
      status: 'PENDING',
      placedAt: new Date(),
    };

    updateCurrentUserBalance(-stake);
    
    setAdminStats(prev => ({
      ...prev,
      totalVolume: prev.totalVolume + stake,
      netRevenue: prev.netRevenue + stake,
    }));

    setBetHistory(prev => [...prev, newBet]);

    const betId = newBet.id;
    setTimeout(() => {
      setBetHistory(currentHistory => 
        currentHistory.map(bet => {
          if (bet.id === betId && bet.status === 'PENDING') {
            const won = Math.random() > 0.5; // Simulate win/loss
            if (won) {
              updateCurrentUserBalance(bet.potentialPayout);
              setAdminStats(prev => ({
                ...prev,
                totalPayouts: prev.totalPayouts + bet.potentialPayout,
                netRevenue: prev.netRevenue - bet.potentialPayout,
              }));
              return { ...bet, status: 'WON' };
            } else {
              setAdminStats(prev => ({
                ...prev,
                grossProfit: prev.grossProfit + bet.totalStake,
              }));
              return { ...bet, status: 'LOST' };
            }
          }
          return bet;
        })
      );
    }, 5000);
  };

  const handleDeposit = (amount: number) => {
    updateCurrentUserBalance(amount);
  };

  const handleRequestWithdrawal = (amount: number, upiId?: string) => {
    if (amount > currentUser.payoutLimit) {
      alert(`LIMIT EXCEEDED: Your current withdrawal cap is ₹${currentUser.payoutLimit.toLocaleString()}. Contact support to increase limits.`);
      updateCurrentUserBalance(amount); // Refund balance if logic in TransactionsModal deducted it already
      return;
    }

    const newRequest: WithdrawalRequest = {
      id: Math.random().toString(36).substring(2, 11).toUpperCase(),
      userId: currentUserId,
      userName: currentUser.fullName,
      amount: amount,
      method: 'UPI',
      upiId: upiId,
      requestedAt: new Date(),
      status: 'PENDING'
    };

    setPendingWithdrawals(prev => [...prev, newRequest]);
  };

  // ADMIN CONTROLS
  const handleUpdateUserStatus = (id: string, status: 'ACTIVE' | 'SUSPENDED') => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
  };

  const handleUpdatePayoutLimit = (id: string, limit: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, payoutLimit: limit } : u));
  };

  const handleAdjustBalance = (id: string, amount: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, balance: u.balance + amount } : u));
    setAdminStats(prev => ({ ...prev, netRevenue: prev.netRevenue - amount }));
  };

  const handleApproveWithdrawal = (id: string) => {
    setPendingWithdrawals(prev => prev.map(req => 
      req.id === id ? { ...req, status: 'APPROVED', processedAt: new Date(), adminNotes: 'Processed successfully.' } : req
    ));
    const request = pendingWithdrawals.find(r => r.id === id);
    if (request) {
      setAdminStats(prev => ({
        ...prev,
        netRevenue: prev.netRevenue - request.amount
      }));
    }
  };

  const handleRejectWithdrawal = (id: string) => {
    const request = pendingWithdrawals.find(r => r.id === id);
    if (request) {
      setUsers(prev => prev.map(u => u.id === request.userId ? { ...u, balance: u.balance + request.amount } : u));
      setPendingWithdrawals(prev => prev.map(req => 
        req.id === id ? { ...req, status: 'REJECTED', processedAt: new Date(), adminNotes: 'Validation failed.' } : req
      ));
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#0f1115]">
      {!isAdminMode && currentUser.status === 'SUSPENDED' && (
        <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
           <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mb-6">
             <ShieldAlert size={64} />
           </div>
           <h1 className="text-4xl font-black italic uppercase text-white mb-2">Account <span className="text-red-500">Suspended</span></h1>
           <p className="text-gray-400 max-w-md">Your account is currently under administrative review for potential policy violations. Access to all betting markets and financial services is locked.</p>
           <button 
             onClick={() => setIsAdminMode(true)}
             className="mt-12 text-xs font-black text-gray-700 hover:text-white transition-colors uppercase tracking-widest border-b border-transparent hover:border-white"
           >
             Switch to Admin Mode (Dev Override)
           </button>
        </div>
      )}

      <header className="h-16 bg-[#16191f] border-b border-[#262b35] sticky top-0 z-50 flex items-center px-4 md:px-6 justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2 text-gray-400">
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 ${isAdminMode ? 'bg-red-500' : 'bg-yellow-400'} rounded-lg flex items-center justify-center font-black text-black transition-all shadow-[0_0_15px_rgba(0,0,0,0.3)]`}>
              {isAdminMode ? 'A' : 'G'}
            </div>
            <h1 className="text-xl font-black tracking-tighter hidden sm:block italic">
              GEMINI<span className={isAdminMode ? 'text-red-500' : 'text-yellow-400'}>{isAdminMode ? 'ADMIN' : 'BET'}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-[#262b35] rounded-full text-[10px] font-black text-gray-500 border border-white/5">
            <RefreshCcw size={12} className={`${isRefreshing ? 'animate-spin text-yellow-400' : ''}`} />
            <span>SYNCED {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
          </div>

          <HeaderBalance 
            balance={isAdminMode ? adminStats.netRevenue : currentUser.balance} 
            onClick={() => !isAdminMode && setIsTransactionModalOpen(true)} 
          />

          <div className="flex items-center gap-1 md:gap-2">
            {!isAdminMode && (
              <button onClick={() => setIsHistoryOpen(true)} className="p-2 text-gray-400 hover:text-yellow-400 transition-colors rounded-full hover:bg-[#262b35]">
                <HistoryIcon size={20} />
              </button>
            )}
            <button className="p-2 text-gray-400 hover:text-white transition-colors relative rounded-full hover:bg-[#262b35]">
              <Bell size={20} />
              <span className={`absolute top-2 right-2 w-2 h-2 ${isAdminMode ? 'bg-red-500' : 'bg-yellow-400'} rounded-full border-2 border-[#16191f]`}></span>
            </button>
            <button onClick={() => setIsProfileOpen(true)} className="flex items-center gap-2 bg-[#262b35] p-1.5 rounded-full hover:bg-gray-700 transition-colors ml-2 border border-white/5">
              <div className={`w-7 h-7 ${isAdminMode ? 'bg-red-500' : 'bg-yellow-400'} rounded-full flex items-center justify-center text-black font-black transition-colors`}>
                <User size={16} />
              </div>
              <span className="text-sm font-bold pr-2 hidden md:block text-white truncate max-w-[100px]">
                {isAdminMode ? 'System' : currentUser.fullName.split(' ')[0]}
              </span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        <Sidebar selectedSport={selectedSport} onSelectSport={setSelectedSport} isAdminMode={isAdminMode} onToggleAdmin={setIsAdminMode} />

        <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 space-y-8 overflow-y-auto">
          {isAdminMode ? (
            <AdminDashboard 
              stats={adminStats} 
              users={users}
              pendingWithdrawals={pendingWithdrawals}
              onApproveWithdrawal={handleApproveWithdrawal}
              onRejectWithdrawal={handleRejectWithdrawal}
              onUpdateUserStatus={handleUpdateUserStatus}
              onAdjustBalance={handleAdjustBalance}
              onUpdatePayoutLimit={handleUpdatePayoutLimit}
            />
          ) : (
            <>
              {/* Promo Banner */}
              <div className="relative h-56 md:h-64 rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#1a1d23] to-[#0f1115] border border-[#262b35] flex items-center p-8 md:p-12 shadow-2xl">
                <div className="relative z-10 max-w-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="bg-yellow-400 text-black text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-yellow-400/20">Live Intelligence</span>
                    <span className="text-yellow-400/80 font-black text-xs uppercase tracking-tighter">AI AGENT ONLINE</span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight uppercase italic text-white tracking-tighter">
                    Precision <span className="text-yellow-400">Trading</span> Engine
                  </h2>
                  <p className="text-gray-400 text-sm md:text-base mb-8 font-medium max-w-sm">
                    Leveraging Gemini 3 Flash for real-time risk assessment and high-velocity odds analytics.
                  </p>
                  <div className="flex items-center gap-4">
                    <button className="bg-yellow-400 text-black px-8 py-3 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-yellow-400/10">
                      EXPLORE MARKETS
                    </button>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="text-[10px] font-black text-gray-400 uppercase">Latency: 42ms</span>
                    </div>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-yellow-400/5 to-transparent flex items-center justify-center pointer-events-none overflow-hidden">
                   <TrendingUp size={300} className="text-yellow-400/10 rotate-12 -mr-20" />
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex bg-[#16191f] p-1.5 rounded-2xl border border-[#262b35] shadow-inner">
                  <button onClick={() => setActiveTab('LIVE')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${activeTab === 'LIVE' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/10' : 'text-gray-500 hover:text-white'}`}>
                    <Clock size={16} /> LIVE NOW
                  </button>
                  <button onClick={() => setActiveTab('UPCOMING')} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${activeTab === 'UPCOMING' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/10' : 'text-gray-500 hover:text-white'}`}>
                    UPCOMING
                  </button>
                </div>
                <div className="relative w-full sm:w-auto group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-yellow-400 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search league, team, or market..." 
                    className="w-full sm:w-72 bg-[#16191f] border border-[#262b35] pl-11 pr-5 py-3 rounded-2xl text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-yellow-400 focus:border-yellow-400 transition-all placeholder:text-gray-700 shadow-xl" 
                  />
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {filteredMatches.length > 0 ? (
                  filteredMatches.map(match => (
                    <MatchCard key={match.id} match={match} onSelect={handleSelectOdd} activeSelection={selections.find(s => s.matchId === match.id)?.selection} />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center space-y-4 opacity-50">
                    <div className="w-16 h-16 bg-[#16191f] rounded-full mx-auto flex items-center justify-center border border-[#262b35]">
                      <Search size={32} />
                    </div>
                    <p className="text-sm font-black uppercase tracking-widest">No active markets found</p>
                  </div>
                )}
              </div>
            </>
          )}
        </main>

        {!isAdminMode && (
          <BetSlip selections={selections} onRemove={(id) => setSelections(prev => prev.filter(s => s.matchId !== id))} onClear={() => setSelections([])} balance={currentUser.balance} onBetPlaced={handleBetPlaced} />
        )}
      </div>

      <TransactionsModal isOpen={isTransactionModalOpen} onClose={() => setIsTransactionModalOpen(false)} balance={currentUser.balance} onDeposit={handleDeposit} onRequestWithdrawal={handleRequestWithdrawal} />
      <BetHistory history={betHistory} isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} profile={currentUser} onUpdateProfile={(upd) => setUsers(prev => prev.map(u => u.id === currentUserId ? { ...u, ...upd } : u))} />
    </div>
  );
};

export default App;
