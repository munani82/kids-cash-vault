import React from 'react';
import { Trash2 } from 'lucide-react';

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
    <div className="w-full max-w-xl mx-auto px-5 py-3">
      <div className="toss-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-gray-900 dark:text-gray-100">
            입출금 내역
          </h3>
          <span className="text-xs text-gray-400 font-number">
            {kidTransactions.length}건
          </span>
        </div>

        {kidTransactions.length === 0 ? (
          <div className="py-10 text-center text-xs text-gray-400 font-medium">
            입출금 내역이 없습니다.
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {kidTransactions.map((tx) => {
              const isDeposit = tx.type === 'deposit';
              const dateStr = new Date(tx.date).toLocaleDateString('ko-KR', {
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={tx.id}
                  className="py-4 flex items-center justify-between group"
                >
                  <div>
                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                      <span>{isDeposit ? '입금' : '출금'}</span>
                      {tx.memo && tx.memo !== '맡긴 돈 (입금)' && tx.memo !== '찾은 돈 (출금)' && (
                        <span className="font-normal text-xs text-gray-500 dark:text-gray-400">
                          · {tx.memo}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 font-number mt-1">
                      {dateStr}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`text-base font-extrabold font-number ${
                        isDeposit
                          ? 'text-[#3182f6] dark:text-blue-400'
                          : 'text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      {isDeposit ? '+' : '-'}{Number(tx.amount).toLocaleString()}원
                    </div>

                    {isParentMode && (
                      <button
                        onClick={() => onDeleteTransaction(tx.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                        title="내역 삭제"
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
