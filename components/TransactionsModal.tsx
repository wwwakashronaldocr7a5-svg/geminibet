
import React, { useState } from 'react';
import { X, ArrowDownCircle, ArrowUpCircle, CheckCircle2, Loader2, QrCode, Smartphone, CreditCard } from 'lucide-react';

interface TransactionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onDeposit: (amount: number) => void;
  onRequestWithdrawal: (amount: number, upiId?: string) => void;
}

type Mode = 'DEPOSIT' | 'WITHDRAW';
type PaymentMethod = 'UPI' | 'CARD' | 'SCAN';

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];

const TransactionsModal: React.FC<TransactionsModalProps> = ({ isOpen, onClose, balance, onDeposit, onRequestWithdrawal }) => {
  const [mode, setMode] = useState<Mode>('DEPOSIT');
  const [method, setMethod] = useState<PaymentMethod>('UPI');
  const [amount, setAmount] = useState<string>('');
  const [upiId, setUpiId] = useState<string>('');
  const [status, setStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAction = () => {
    const numAmount = parseFloat(amount);
    setError(null);

    if (isNaN(numAmount) || numAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (mode === 'WITHDRAW' && numAmount > balance) {
      setError('Insufficient balance for withdrawal');
      return;
    }

    if (mode === 'DEPOSIT' && method === 'UPI' && !upiId.includes('@')) {
      setError('Please enter a valid UPI ID (e.g. user@bank)');
      return;
    }
    
    if (mode === 'WITHDRAW' && !upiId.includes('@')) {
       setError('Withdrawal requires a destination UPI ID');
       return;
    }

    setStatus('PROCESSING');

    setTimeout(() => {
      if (mode === 'DEPOSIT') {
        onDeposit(numAmount);
      } else {
        onRequestWithdrawal(numAmount, upiId);
      }
      
      setStatus('SUCCESS');
      
      setTimeout(() => {
        setStatus('IDLE');
        setAmount('');
        setUpiId('');
        onClose();
      }, 2500);
    }, 1500);
  };

  const formattedBalance = balance.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#16191f] w-full max-w-md rounded-3xl border border-[#262b35] shadow-2xl overflow-hidden relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10"
        >
          <X size={24} />
        </button>

        {status === 'SUCCESS' ? (
          <div className="p-12 flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center text-green-500 mb-2">
              {mode === 'DEPOSIT' ? <CheckCircle2 size={48} /> : <Loader2 size={48} className="animate-pulse" />}
            </div>
            <h2 className="text-2xl font-black italic uppercase">
              {mode === 'DEPOSIT' ? 'Deposit Success' : 'Request Sent'}
            </h2>
            <p className="text-gray-400 text-sm">
              {mode === 'DEPOSIT' 
                ? `₹${parseFloat(amount).toLocaleString('en-IN')} added instantly via ${method}` 
                : 'Withdrawal request sent to admin for approval. Funds are held in pending.'}
            </p>
            <div className="text-3xl font-mono font-bold text-yellow-400">
              ₹{parseFloat(amount).toLocaleString('en-IN')}
            </div>
          </div>
        ) : (
          <>
            <div className="p-6 pb-0">
              <div className="flex bg-[#0f1115] p-1 rounded-2xl border border-[#262b35] mb-6">
                <button 
                  onClick={() => { setMode('DEPOSIT'); setError(null); }}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    mode === 'DEPOSIT' ? 'bg-yellow-400 text-black' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <ArrowDownCircle size={18} />
                  DEPOSIT
                </button>
                <button 
                  onClick={() => { setMode('WITHDRAW'); setError(null); }}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                    mode === 'WITHDRAW' ? 'bg-yellow-400 text-black' : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <ArrowUpCircle size={18} />
                  WITHDRAW
                </button>
              </div>

              <div className="bg-[#1a1d23] rounded-2xl p-4 border border-[#262b35] mb-6">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Available Wallet Balance</p>
                <p className="text-2xl font-black font-mono">₹{formattedBalance}</p>
              </div>

              {mode === 'DEPOSIT' && (
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <button onClick={() => setMethod('UPI')} className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all ${method === 'UPI' ? 'bg-yellow-400/10 border-yellow-400 text-yellow-400' : 'bg-[#1a1d23] border-[#262b35] text-gray-500 hover:border-gray-600'}`}>
                    <Smartphone size={18} />
                    <span className="text-[10px] font-black uppercase">UPI ID</span>
                  </button>
                  <button onClick={() => setMethod('SCAN')} className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all ${method === 'SCAN' ? 'bg-yellow-400/10 border-yellow-400 text-yellow-400' : 'bg-[#1a1d23] border-[#262b35] text-gray-500 hover:border-gray-600'}`}>
                    <QrCode size={18} />
                    <span className="text-[10px] font-black uppercase">Scan QR</span>
                  </button>
                  <button onClick={() => setMethod('CARD')} className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all ${method === 'CARD' ? 'bg-yellow-400/10 border-yellow-400 text-yellow-400' : 'bg-[#1a1d23] border-[#262b35] text-gray-500 hover:border-gray-600'}`}>
                    <CreditCard size={18} />
                    <span className="text-[10px] font-black uppercase">Card</span>
                  </button>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-500">₹</span>
                  <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" disabled={status === 'PROCESSING'} className="w-full bg-[#0f1115] border border-[#262b35] rounded-2xl py-4 pl-10 pr-4 text-2xl font-bold font-mono focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all placeholder:text-gray-800" />
                </div>

                <div className="flex flex-wrap gap-2">
                  {PRESET_AMOUNTS.map(preset => (
                    <button key={preset} disabled={status === 'PROCESSING'} onClick={() => setAmount(preset.toString())} className="bg-[#262b35] hover:bg-[#323842] px-4 py-2 rounded-xl text-xs font-bold transition-all border border-transparent hover:border-yellow-400/30 text-gray-300">+₹{preset.toLocaleString('en-IN')}</button>
                  ))}
                </div>

                {(mode === 'WITHDRAW' || (mode === 'DEPOSIT' && method === 'UPI')) && (
                  <div className="pt-4 space-y-4 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 px-1">
                      <Smartphone size={16} className="text-gray-500" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        {mode === 'DEPOSIT' ? 'Source UPI ID' : 'Withdrawal Destination UPI ID'}
                      </span>
                    </div>
                    <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="Enter UPI ID (e.g. alex@okaxis)" disabled={status === 'PROCESSING'} className="w-full bg-[#0f1115] border border-[#262b35] rounded-xl py-3 px-4 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-all" />
                  </div>
                )}

                {error && <p className="text-red-500 text-[10px] font-black text-center uppercase tracking-widest bg-red-500/10 py-2 rounded-lg">{error}</p>}
              </div>
            </div>

            <div className="p-6">
              <button onClick={handleAction} disabled={status === 'PROCESSING'} className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${status === 'PROCESSING' ? 'bg-yellow-600 cursor-not-allowed text-black/50' : 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-lg shadow-yellow-400/20 active:scale-[0.98]'}`}>
                {status === 'PROCESSING' ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    PROCESSING...
                  </>
                ) : (
                  <>{mode === 'DEPOSIT' ? 'DEPOSIT NOW' : 'SUBMIT REQUEST'}</>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TransactionsModal;
