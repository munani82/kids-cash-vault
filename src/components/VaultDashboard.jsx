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
    <div className="w-full max-w-2xl mx-auto px-5 py-2">
      <div className="toss-card">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{kid.avatar || '👤'}</span>
            <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">
              {kid.name}의 현금 잔액
            </span>
          </div>
          <span className="text-xs text-gray-400 font-medium">
            실시간
          </span>
        </div>

        {/* Big Balance */}
        <div className="mb-6">
          <div className="text-4xl md:text-5xl font-black font-number text-gray-900 dark:text-white tracking-tight">
            {balance.toLocaleString()}원
          </div>
        </div>

        {/* Action Buttons */}
        {isParentMode ? (
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onOpenDepositModal}
              className="btn-toss-primary w-full justify-center"
            >
              입금하기
            </button>
            <button
              onClick={onOpenWithdrawModal}
              className="btn-toss-secondary w-full justify-center"
            >
              출금하기
            </button>
          </div>
        ) : (
          <div className="p-3 bg-gray-100 dark:bg-gray-800/60 rounded-xl text-center text-xs font-semibold text-gray-500 dark:text-gray-400">
            🔒 부모님이 현금을 보관 중입니다
          </div>
        )}
      </div>
    </div>
  );
}
