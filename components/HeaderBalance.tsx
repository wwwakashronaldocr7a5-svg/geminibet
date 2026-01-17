
import React, { useState, useEffect, useRef } from 'react';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

interface HeaderBalanceProps {
  balance: number;
  onClick: () => void;
}

const HeaderBalance: React.FC<HeaderBalanceProps> = ({ balance, onClick }) => {
  const [displayBalance, setDisplayBalance] = useState(balance);
  const [delta, setDelta] = useState<{ value: number; type: 'plus' | 'minus' } | null>(null);
  const [pulse, setPulse] = useState<'green' | 'red' | null>(null);
  const prevBalanceRef = useRef(balance);

  useEffect(() => {
    const prev = prevBalanceRef.current;
    if (balance !== prev) {
      const diff = balance - prev;
      setDelta({ 
        value: Math.abs(diff), 
        type: diff > 0 ? 'plus' : 'minus' 
      });
      setPulse(diff > 0 ? 'green' : 'red');

      // Animate the balance number
      const duration = 1000;
      const startTime = performance.now();
      
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuad = (t: number) => t * (2 - t);
        const currentVal = prev + diff * easeOutQuad(progress);
        
        setDisplayBalance(currentVal);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setDisplayBalance(balance);
        }
      };

      requestAnimationFrame(animate);

      // Reset feedback UI
      const timer = setTimeout(() => {
        setDelta(null);
        setPulse(null);
      }, 3000);

      prevBalanceRef.current = balance;
      return () => clearTimeout(timer);
    }
  }, [balance]);

  return (
    <div className="relative flex items-center">
      {/* Delta Indicator */}
      {delta && (
        <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 font-black text-sm whitespace-nowrap animate-in slide-in-from-top-2 fade-out duration-1000 fill-mode-forwards pointer-events-none ${
          delta.type === 'plus' ? 'text-green-500' : 'text-red-500'
        }`}>
          {delta.type === 'plus' ? '+' : '-'}₹{delta.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
        </div>
      )}

      <div 
        onClick={onClick}
        className={`hidden sm:flex items-center bg-[#262b35] rounded-full px-4 py-1.5 gap-2 border transition-all cursor-pointer group relative overflow-hidden ${
          pulse === 'green' ? 'border-green-500 bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 
          pulse === 'red' ? 'border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 
          'border-transparent hover:border-yellow-400/50 hover:bg-[#2c313a]'
        }`}
      >
        <Wallet size={16} className={`transition-all duration-300 ${
          pulse === 'green' ? 'text-green-500 scale-125' : 
          pulse === 'red' ? 'text-red-500 scale-125' : 
          'text-yellow-400 group-hover:scale-110'
        }`} />
        
        <span className="font-mono font-bold text-sm tabular-nums text-white min-w-[80px]">
          ₹{displayBalance.toLocaleString('en-IN', { 
            minimumFractionDigits: 2, 
            maximumFractionDigits: 2 
          })}
        </span>
        
        <div className="w-px h-3 bg-gray-600 mx-1"></div>
        
        <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
          pulse === 'green' ? 'text-green-500' : 
          pulse === 'red' ? 'text-red-500' : 
          'text-yellow-400'
        }`}>
          Top Up
        </span>

        {/* Shine effect on update */}
        {pulse && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1s_infinite] pointer-events-none"></div>
        )}
      </div>
      
      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default HeaderBalance;
