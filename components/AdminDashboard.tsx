
import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  ShieldAlert,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  ShieldOff,
  UserPlus,
  Coins,
  ArrowRightLeft,
  Calendar,
  Info,
  TrendingUp,
  Download,
  Search,
  Lock,
  History as HistoryIcon,
  Filter
} from 'lucide-react';
import { AdminStats, WithdrawalRequest, UserAccount } from '../types';

interface AdminDashboardProps {
  stats: AdminStats;
  users: UserAccount[];
  pendingWithdrawals: WithdrawalRequest[];
  onApproveWithdrawal: (id: string) => void;
  onRejectWithdrawal: (id: string) => void;
  onUpdateUserStatus: (id: string, status: 'ACTIVE' | 'SUSPENDED') => void;
  onAdjustBalance: (id: string, amount: number) => void;
  onUpdatePayoutLimit: (id: string, limit: number) => void;
}

const WEEKLY_DATA = [
  { day: 'Mon', volume: 120000, payouts: 95000, profit: 25000 },
  { day: 'Tue', volume: 150000, payouts: 110000, profit: 40000 },
  { day: 'Wed', volume: 90000, payouts: 95000, profit: -5000 },
  { day: 'Thu', volume: 210000, payouts: 140000, profit: 70000 },
  { day: 'Fri', volume: 180000, payouts: 120000, profit: 60000 },
  { day: 'Sat', volume: 280000, payouts: 200000, profit: 80000 },
  { day: 'Sun', volume: 250000, payouts: 180000, profit: 70000 },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  stats, 
  users, 
  pendingWithdrawals,
  onApproveWithdrawal,
  onRejectWithdrawal,
  onUpdateUserStatus,
  onAdjustBalance,
  onUpdatePayoutLimit
}) => {
  const [adjustmentAmount, setAdjustmentAmount] = useState<Record<string, string>>({});
  const [payoutLimitInput, setPayoutLimitInput] = useState<Record<string, string>>({});
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [personalPocket, setPersonalPocket] = useState(45000);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [settlementTab, setSettlementTab] = useState<'PENDING' | 'HISTORY'>('PENDING');

  const handleAdjust = (userId: string, isCredit: boolean) => {
    const val = parseFloat(adjustmentAmount[userId]);
    if (isNaN(val) || val <= 0) return;
    onAdjustBalance(userId, isCredit ? val : -val);
    setAdjustmentAmount({ ...adjustmentAmount, [userId]: '' });
  };

  const handleLimitUpdate = (userId: string) => {
    const val = parseFloat(payoutLimitInput[userId]);
    if (isNaN(val) || val < 0) return;
    onUpdatePayoutLimit(userId, val);
    setPayoutLimitInput({ ...payoutLimitInput, [userId]: '' });
  };

  const sweepProfits = () => {
    const profitToSweep = Math.floor(stats.grossProfit * 0.1);
    if (profitToSweep > 0) {
      setPersonalPocket(prev => prev + profitToSweep);
      alert(`Successfully swept ₹${profitToSweep.toLocaleString()} in platform fees to your personal wallet!`);
    }
  };

  const maxVal = Math.max(...WEEKLY_DATA.map(d => Math.abs(d.volume)));
  const houseMargin = ((stats.grossProfit / (stats.totalVolume || 1)) * 100).toFixed(1);

  const filteredUsers = users.filter(user => {
    const query = userSearchQuery.toLowerCase();
    return (
      user.fullName.toLowerCase().includes(query) ||
      user.id.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });

  const settlementQueue = pendingWithdrawals.filter(w => settlementTab === 'PENDING' ? w.status === 'PENDING' : w.status !== 'PENDING');

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">
            Admin <span className="text-yellow-400">Command Center</span>
          </h2>
          <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">Platform Control & Personal Treasury</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#1a1d23] px-4 py-3 rounded-2xl border border-yellow-400/20 flex flex-col items-end">
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Personal Profit Pocket</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-yellow-400 font-mono">₹{personalPocket.toLocaleString('en-IN')}</span>
              <button 
                onClick={sweepProfits}
                className="bg-yellow-400 text-black p-1 rounded-md hover:scale-110 active:scale-95 transition-all shadow-lg shadow-yellow-400/20"
                title="Sweep platform fees to personal wallet"
              >
                <TrendingUp size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#16191f] p-6 rounded-3xl border border-[#262b35] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Activity size={64} />
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">Total Bets Volume</p>
          <p className="text-3xl font-black font-mono">₹{stats.totalVolume.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-[#16191f] p-6 rounded-3xl border border-[#262b35] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ArrowUpRight size={64} className="text-green-500" />
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">House Gross Profit</p>
          <p className="text-3xl font-black font-mono text-green-500">₹{stats.grossProfit.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-[#16191f] p-6 rounded-3xl border border-[#262b35] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ArrowDownRight size={64} className="text-red-500" />
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase mb-2">Total User Payouts</p>
          <p className="text-3xl font-black font-mono text-red-500">₹{stats.totalPayouts.toLocaleString('en-IN')}</p>
        </div>

        <div className="bg-[#1a1d23] p-6 rounded-3xl border-2 border-yellow-400/30 relative overflow-hidden group shadow-lg shadow-yellow-400/5">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity text-yellow-400">
            <DollarSign size={64} />
          </div>
          <p className="text-xs font-bold text-yellow-400 uppercase mb-2">Treasury Balance (NW)</p>
          <p className={`text-3xl font-black font-mono`}>₹{stats.netRevenue.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Analytics Chart Section */}
      <div className="bg-[#16191f] rounded-3xl border border-[#262b35] p-6">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-black italic uppercase flex items-center gap-3">
            <BarChart3 size={20} className="text-yellow-400" />
            Financial Analytics
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end">
               <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">House Margin</span>
               <span className="text-sm font-black text-yellow-400">{houseMargin}%</span>
            </div>
          </div>
        </div>

        <div className="relative h-64 flex items-end justify-between gap-2 px-2 mt-4">
          {WEEKLY_DATA.map((data, idx) => {
            const heightPerc = (data.volume / maxVal) * 100;
            const profitPerc = (Math.abs(data.profit) / data.volume) * 100;
            const isLoss = data.profit < 0;

            return (
              <div 
                key={data.day} 
                className="flex-1 group relative flex flex-col items-center justify-end"
                onMouseEnter={() => setHoveredDay(idx)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <div 
                  style={{ height: `${heightPerc}%` }}
                  className="w-full max-w-[40px] bg-[#262b35] rounded-t-lg relative overflow-hidden transition-all duration-500 group-hover:bg-[#323842]"
                >
                  <div 
                    style={{ height: `${profitPerc}%` }}
                    className={`absolute bottom-0 left-0 right-0 ${isLoss ? 'bg-red-500' : 'bg-green-500'} opacity-80 transition-all duration-700`}
                  ></div>
                </div>
                <span className={`text-[10px] font-black mt-3 transition-colors ${hoveredDay === idx ? 'text-yellow-400' : 'text-gray-500'}`}>
                  {data.day.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Management System */}
      <div className="bg-[#16191f] rounded-3xl border border-[#262b35] overflow-hidden">
        <div className="p-6 border-b border-[#262b35] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#1a1d23]/50">
          <h3 className="font-black italic uppercase flex items-center gap-3">
            <Users size={20} className="text-yellow-400" />
            User Management Directory
          </h3>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
              <input 
                type="text" 
                placeholder="Search name, email, or ID..." 
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full bg-[#0f1115] border border-[#262b35] pl-9 pr-4 py-2 rounded-xl text-[10px] font-bold text-white focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-all placeholder:text-gray-700"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#1a1d23] text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-[#262b35]">
              <tr>
                <th className="px-6 py-4">User Identity</th>
                <th className="px-6 py-4">Status / Payout Limit</th>
                <th className="px-6 py-4">Wallet Balance</th>
                <th className="px-6 py-4">Financial Actions</th>
                <th className="px-6 py-4 text-right">Overrides</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262b35]">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-[#262b35]/30 transition-all">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${user.status === 'SUSPENDED' ? 'bg-gray-700' : 'bg-yellow-400'} rounded-full flex items-center justify-center text-black font-black text-xs`}>
                        {user.fullName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{user.fullName}</p>
                        <p className="text-[10px] text-gray-500 font-mono uppercase">{user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black w-fit ${
                        user.status === 'ACTIVE' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {user.status}
                      </span>
                      <div className="flex items-center gap-2">
                        <Lock size={12} className="text-gray-500" />
                        <span className="text-[10px] font-black text-gray-400">Limit: ₹{user.payoutLimit.toLocaleString()}</span>
                        <input 
                          type="number" 
                          placeholder="Update Limit"
                          value={payoutLimitInput[user.id] || ''}
                          onChange={(e) => setPayoutLimitInput({ ...payoutLimitInput, [user.id]: e.target.value })}
                          className="bg-transparent border-b border-[#262b35] text-[10px] font-mono w-20 focus:border-yellow-400 focus:outline-none"
                        />
                        <button onClick={() => handleLimitUpdate(user.id)} className="text-yellow-400 hover:text-white"><CheckCircle size={12} /></button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-mono font-black text-lg">₹{user.balance.toLocaleString('en-IN')}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <input 
                        type="number"
                        value={adjustmentAmount[user.id] || ''}
                        onChange={(e) => setAdjustmentAmount({ ...adjustmentAmount, [user.id]: e.target.value })}
                        placeholder="Amt"
                        className="bg-[#0f1115] border border-[#262b35] rounded-lg py-1 w-20 text-[10px] font-bold focus:outline-none focus:ring-1 focus:ring-yellow-400"
                      />
                      <button onClick={() => handleAdjust(user.id, true)} className="p-2 bg-green-500/10 text-green-500 rounded-lg"><Coins size={14} /></button>
                      <button onClick={() => handleAdjust(user.id, false)} className="p-2 bg-red-500/10 text-red-500 rounded-lg"><ShieldAlert size={14} /></button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => onUpdateUserStatus(user.id, user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE')} className="p-2 bg-gray-800 rounded-lg text-gray-400">
                      {user.status === 'ACTIVE' ? <ShieldOff size={16} /> : <CheckCircle size={16} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Financial Settlement Center */}
      <div className="bg-[#16191f] rounded-3xl border border-[#262b35] overflow-hidden">
        <div className="p-6 border-b border-[#262b35] flex justify-between items-center bg-[#1a1d23]/50">
          <h3 className="font-black italic uppercase flex items-center gap-3">
            <ArrowRightLeft size={20} className="text-yellow-400" />
            Settlement Center
          </h3>
          <div className="flex bg-[#0f1115] p-1 rounded-xl border border-[#262b35]">
            <button 
              onClick={() => setSettlementTab('PENDING')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${settlementTab === 'PENDING' ? 'bg-yellow-400 text-black' : 'text-gray-500'}`}
            >
              <Filter size={12} /> PENDING
            </button>
            <button 
              onClick={() => setSettlementTab('HISTORY')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${settlementTab === 'HISTORY' ? 'bg-yellow-400 text-black' : 'text-gray-500'}`}
            >
              <HistoryIcon size={12} /> HISTORY
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#1a1d23] text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-[#262b35]">
              <tr>
                <th className="px-6 py-4">Request Context</th>
                <th className="px-6 py-4">Method & VPA</th>
                <th className="px-6 py-4">Volume</th>
                <th className="px-6 py-4">{settlementTab === 'PENDING' ? 'Status' : 'Resolution'}</th>
                <th className="px-6 py-4 text-right">Actions / Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262b35]">
              {settlementQueue.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-600 italic text-sm">No {settlementTab.toLowerCase()} records in the ledger.</td>
                </tr>
              ) : (
                settlementQueue.map(req => (
                  <tr key={req.id} className="hover:bg-[#262b35]/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{req.userName}</span>
                        <span className="text-[10px] font-mono text-gray-500">#{req.id} • {req.requestedAt.toLocaleTimeString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-blue-400 uppercase">UPI Settlement</span>
                        <span className="text-xs font-mono text-gray-300">{req.upiId || 'Manual'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-mono font-black text-white">₹{req.amount.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      {req.status === 'PENDING' ? (
                        <span className="flex items-center gap-1 text-yellow-400 text-[10px] font-black uppercase tracking-widest animate-pulse"><Clock size={12}/> Reviewing</span>
                      ) : (
                        <div className="flex flex-col">
                          <span className={`text-[10px] font-black uppercase ${req.status === 'APPROVED' ? 'text-green-500' : 'text-red-500'}`}>
                            {req.status}
                          </span>
                          <span className="text-[9px] text-gray-600 font-bold uppercase">{req.processedAt?.toLocaleDateString()}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {req.status === 'PENDING' ? (
                        <div className="flex justify-end gap-2">
                          <button onClick={() => onRejectWithdrawal(req.id)} className="bg-red-500 text-white p-2 rounded-lg"><XCircle size={16} /></button>
                          <button onClick={() => onApproveWithdrawal(req.id)} className="bg-green-500 text-white p-2 rounded-lg"><CheckCircle size={16} /></button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end">
                          <span className="text-[9px] text-gray-500 italic max-w-[150px] truncate">{req.adminNotes}</span>
                          <button className="text-gray-600 hover:text-white mt-1"><ExternalLink size={12} /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
