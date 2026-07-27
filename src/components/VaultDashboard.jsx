import React from 'react';

export default function VaultDashboard({
  kid,
  isParentMode,
  onOpenDepositModal,
  onOpenWithdrawModal
}) {
  if (!kid) return null;

  const balance = kid.balance || 0;

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-2">
      <div className="toss-card">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{kid.avatar || '👤'}</span>
            <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">
              {kid.name}의 현금 잔액
            </span>
          </div>
          <span className="text-xs text-gray-400 font-medium">
            실시간
          </span>
        </div>

        {/* Big Balance */}
        <div className="my-4">
          <div className="text-4xl md:text-5xl font-extrabold font-number text-gray-900 dark:text-white tracking-tight">
            {balance.toLocaleString()}<span className="text-2xl font-bold ml-1 text-gray-800 dark:text-gray-200">원</span>
          </div>
        </div>

        {/* Action Buttons */}
        {isParentMode ? (
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button
              onClick={onOpenDepositModal}
              className="w-full py-3.5 rounded-2xl bg-[#3182f6] text-white font-bold text-base hover:bg-[#1b64da] active:scale-[0.98] transition-all shadow-xs"
            >
              입금하기
            </button>
            <button
              onClick={onOpenWithdrawModal}
              className="w-full py-3.5 rounded-2xl bg-[#e8f3ff] dark:bg-blue-950/40 text-[#3182f6] dark:text-blue-400 font-bold text-base hover:bg-blue-100 active:scale-[0.98] transition-all"
            >
              출금하기
            </button>
          </div>
        ) : (
          <div className="mt-4 p-3.5 bg-gray-100 dark:bg-gray-800/80 rounded-2xl text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
            🔒 부모님이 현금을 보관 중입니다
          </div>
        )}
      </div>
    </div>
  );
}
