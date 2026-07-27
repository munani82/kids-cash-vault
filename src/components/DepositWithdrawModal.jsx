import React, { useState } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DepositWithdrawModal({
  isOpen,
  mode, // 'deposit' or 'withdraw'
  kidName,
  onClose,
  onSubmit
}) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(mode === 'deposit' ? '용돈' : '장난감');
  const [memo, setMemo] = useState('');

  if (!isOpen) return null;

  const isDeposit = mode === 'deposit';

  const quickAmounts = [1000, 5000, 10000, 50000];

  const depositCategories = ['용돈', '세뱃돈', '심부름', '포상금', '선물', '기타'];
  const withdrawCategories = ['장난감', '간식/스낵', '학용품', '게임', '선물', '기타'];

  const categories = isDeposit ? depositCategories : withdrawCategories;

  const handleQuickAdd = (val) => {
    const current = Number(amount) || 0;
    setAmount(String(current + val));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) return;

    onSubmit({
      type: mode,
      amount: numAmount,
      category,
      memo: memo.trim() || (isDeposit ? '맡긴 돈 (입금)' : '찾은 돈 (출금)')
    });

    if (isDeposit) {
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }

    setAmount('');
    setMemo('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-modal">
      <div className="glass-card max-w-md w-full p-6 relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isDeposit
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
              }`}
            >
              {isDeposit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-800 dark:text-gray-100">
                {kidName} - {isDeposit ? '현금 맡기기 (입금)' : '현금 찾기 (출금)'}
              </h3>
              <p className="text-xs text-gray-400">부모님 입출금 처리 모달</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick Amount Buttons */}
          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1.5">
              빠른 금액 추가
            </label>
            <div className="grid grid-cols-4 gap-2">
              {quickAmounts.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => handleQuickAdd(val)}
                  className="py-2 rounded-xl text-xs font-bold font-number bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-all"
                >
                  +{val / 1000}천원
                </button>
              ))}
            </div>
          </div>

          {/* Input Amount */}
          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
              금액 입력 (원)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3 text-gray-400 font-bold font-number">₩</span>
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-lg font-bold font-number focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          {/* Category selection */}
          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1.5">
              카테고리 선택
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    category === cat
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Memo */}
          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
              메모 / 사유
            </label>
            <input
              type="text"
              placeholder={isDeposit ? '예: 설날 세뱃돈 받은 것' : '예: 유치원 앞 문방구 장난감'}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-bold text-white text-sm shadow-lg flex items-center justify-center gap-2 ${
                isDeposit
                  ? 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700'
                  : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isDeposit ? '입금 등록 완료' : '출금 처리 완료'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
