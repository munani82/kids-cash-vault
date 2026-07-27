import React from 'react';
import { History, ArrowDownLeft, ArrowUpRight, Trash2, Calendar } from 'lucide-react';

export default function TransactionHistory({
  transactions,
  activeKidId,
  isParentMode,
  onDeleteTransaction
}) {
  const kidTransactions = (transactions || [])
    .filter(t => t.kidId === activeKidId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-3">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              최근 입출금 내역 (Timeline)
            </h3>
          </div>
          <span className="text-xs text-gray-500 font-number">
            총 {kidTransactions.length}건
          </span>
        </div>

        {kidTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            아직 거래 내역이 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {kidTransactions.map((tx) => {
              const isDeposit = tx.type === 'deposit';
              const dateStr = new Date(tx.date).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-white/60 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 hover:bg-white dark:hover:bg-gray-800 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                        isDeposit
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isDeposit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
                          {tx.memo || (isDeposit ? '맡긴 돈 (입금)' : '찾은 돈 (출금)')}
                        </span>
                        {tx.category && (
                          <span
                            className={`badge-tag ${
                              isDeposit
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300'
                            }`}
                          >
                            {tx.category}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 font-number mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>{dateStr}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`text-base font-black font-number ${
                        isDeposit
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {isDeposit ? '+' : '-'}₩{Number(tx.amount).toLocaleString()}
                    </div>

                    {isParentMode && (
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 transition-all"
                        title="내역 취소/삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
