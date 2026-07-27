import React, { useState } from 'react';
import { Lock, KeyRound, X, Check } from 'lucide-react';

export default function ParentPinModal({
  isOpen,
  correctPin,
  onClose,
  onSuccess
}) {
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleDigit = (digit) => {
    if (pinInput.length < 4) {
      const next = pinInput + digit;
      setPinInput(next);
      setErrorMsg('');

      if (next.length === 4) {
        if (next === correctPin) {
          onSuccess();
          setPinInput('');
        } else {
          setErrorMsg('비밀번호가 일치하지 않습니다. (기본: 1234)');
          setTimeout(() => setPinInput(''), 400);
        }
      }
    }
  };

  const handleDelete = () => {
    setPinInput(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-modal">
      <div className="glass-card max-w-xs w-full p-6 text-center relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 mx-auto flex items-center justify-center mb-3">
          <Lock className="w-6 h-6" />
        </div>

        <h3 className="font-extrabold text-lg text-gray-800 dark:text-gray-100">
          부모님 관리자 인증
        </h3>
        <p className="text-xs text-gray-400 mt-1 mb-4">
          PIN 번호 4자리를 입력해주세요 (기본: 1234)
        </p>

        {/* PIN Dots */}
        <div className="flex justify-center gap-3 mb-4">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full transition-all ${
                pinInput.length > idx
                  ? 'bg-purple-600 scale-110 shadow-md'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        {errorMsg && (
          <div className="text-xs text-rose-500 font-semibold mb-3 animate-bounce">
            {errorMsg}
          </div>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-2 max-w-[200px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleDigit(String(num))}
              className="w-14 h-14 rounded-2xl text-lg font-bold font-number bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 transition-all flex items-center justify-center active:scale-95 shadow-sm"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleDigit('0')}
            className="w-14 h-14 rounded-2xl text-lg font-bold font-number bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-600 transition-all flex items-center justify-center active:scale-95 shadow-sm"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-14 h-14 rounded-2xl text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-all flex items-center justify-center active:scale-95"
          >
            지우기
          </button>
        </div>
      </div>
    </div>
  );
}
