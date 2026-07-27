import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function DepositWithdrawModal({
  isOpen,
  mode, // 'deposit' or 'withdraw'
  kidName,
  onClose,
  onSubmit
}) {
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');

  if (!isOpen) return null;

  const isDeposit = mode === 'deposit';

  const quickAmounts = [5000, 10000, 50000, 100000];

  const handleAmountChange = (e) => {
    // Strip non-digits
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    if (!rawValue) {
      setAmount('');
    } else {
      setAmount(Number(rawValue).toLocaleString());
    }
  };

  const handleQuickAdd = (val) => {
    const rawCurrent = Number(amount.replace(/,/g, '')) || 0;
    const nextVal = rawCurrent + val;
    setAmount(nextVal.toLocaleString());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const rawNum = Number(amount.replace(/,/g, ''));
    if (!rawNum || rawNum <= 0) return;

    onSubmit({
      type: mode,
      amount: rawNum,
      memo: memo.trim()
    });

    setAmount('');
    setMemo('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs animate-toss-modal">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">
            {kidName}에게 {isDeposit ? '입금하기' : '출금하기'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick Add Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuickAdd(val)}
                className="py-2.5 rounded-xl text-xs font-bold font-number bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200"
              >
                +{val >= 10000 ? `${val / 10000}만원` : `${val / 1000}천원`}
              </button>
            ))}
          </div>

          {/* Amount input with thousand separator */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">
              금액
            </label>
            <div className="relative">
              <input
                type="text"
                inputMode="numeric"
                placeholder="0"
                value={amount}
                onChange={handleAmountChange}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xl font-bold font-number text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoFocus
              />
              <span className="absolute right-4 top-3.5 text-sm font-bold text-gray-400">원</span>
            </div>
          </div>

          {/* Memo input */}
          <div>
            <label className="block text-xs font-bold text-gray-400 mb-1">
              메모 (선택)
            </label>
            <input
              type="text"
              placeholder="예: 용돈, 세뱃돈, 간식 사먹음"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-4 rounded-2xl font-bold text-white text-base shadow-sm ${
                isDeposit
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isDeposit ? '입금 완료' : '출금 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
