import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Coins, Wallet, Gift, Eye, EyeOff } from 'lucide-react';

export default function VaultDashboard({
  kid,
  isParentMode,
  onOpenDepositModal,
  onOpenWithdrawModal
}) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  if (!kid) return null;

  const balance = kid.balance || 0;

  // Calculate currency bill & coin breakdown (5만원, 1만원, 5천원, 1천원, 500원, 100원)
  const calculateCurrencyBreakdown = (amount) => {
    let rem = amount;
    const b50 = Math.floor(rem / 50000); rem %= 50000;
    const b10 = Math.floor(rem / 10000); rem %= 10000;
    const b5 = Math.floor(rem / 5000); rem %= 5000;
    const b1 = Math.floor(rem / 1000); rem %= 1000;
    const c500 = Math.floor(rem / 500); rem %= 500;
    const c100 = Math.floor(rem / 100);

    return [
      { name: '5만원권', count: b50, color: 'bg-amber-100 text-amber-800 border-amber-300' },
      { name: '1만원권', count: b10, color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
      { name: '5천원권', count: b5, color: 'bg-orange-100 text-orange-800 border-orange-300' },
      { name: '1천원권', count: b1, color: 'bg-blue-100 text-blue-800 border-blue-300' },
      { name: '500원동전', count: c500, color: 'bg-gray-200 text-gray-800 border-gray-300' },
      { name: '100원동전', count: c100, color: 'bg-gray-100 text-gray-700 border-gray-300' }
    ].filter(item => item.count > 0);
  };

  const breakdownList = calculateCurrencyBreakdown(balance);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-3">
      {/* Main Glass Vault Card */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden bg-gradient-to-br from-white/90 via-purple-50/50 to-pink-50/50 dark:from-gray-800/90 dark:via-purple-950/30 dark:to-gray-900/90">
        {/* Background Decorative Circles */}
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-48 h-48 bg-pink-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          {/* Left info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl animate-piggy">{kid.avatar}</span>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                {kid.name}의 비밀 금고
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
                실시간 동기화 중 🟢
              </span>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
              부모님께 맡겨둔 총 현금 잔액
            </p>
            <div className="text-4xl md:text-5xl font-black font-number text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 dark:from-purple-400 dark:via-pink-400 dark:to-indigo-400 tracking-tight">
              ₩{balance.toLocaleString()}
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {isParentMode ? (
              <>
                <button
                  onClick={onOpenDepositModal}
                  className="flex-1 md:flex-none btn-gradient-primary flex items-center justify-center gap-2 text-sm"
                >
                  <ArrowDownLeft className="w-5 h-5" />
                  <span>돈 맡기기 (입금)</span>
                </button>
                <button
                  onClick={onOpenWithdrawModal}
                  className="flex-1 md:flex-none btn-gradient-secondary flex items-center justify-center gap-2 text-sm"
                >
                  <ArrowUpRight className="w-5 h-5" />
                  <span>돈 찾기 (출금)</span>
                </button>
              </>
            ) : (
              <div className="flex flex-col items-end gap-1">
                <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
                  🔒 자녀 조회 모드 (부모님만 입출금 가능)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Currency Visualizer Toggle */}
        <div className="mt-6 pt-5 border-t border-gray-200/60 dark:border-gray-700/60 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline"
            >
              <Coins className="w-4 h-4 text-purple-500" />
              <span>금고 속 실제 지폐/동전 구성을 볼까요?</span>
              {showBreakdown ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Currency Breakdown Pill Display */}
          {showBreakdown && (
            <div className="flex flex-wrap items-center gap-2 pt-2 animate-modal">
              {breakdownList.length === 0 ? (
                <div className="text-xs text-gray-400">금고가 비어있어요 🥲 첫 입금을 기다리는 중!</div>
              ) : (
                breakdownList.map((item, idx) => (
                  <div
                    key={idx}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold font-number flex items-center gap-1.5 shadow-sm ${item.color}`}
                  >
                    <span>💵 {item.name}</span>
                    <span className="bg-white/80 dark:bg-black/20 px-1.5 py-0.5 rounded-md">
                      {item.count}개
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
