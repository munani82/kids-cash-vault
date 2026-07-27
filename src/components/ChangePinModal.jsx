import React, { useState } from 'react';
import { X, Check } from 'lucide-react';

export default function ChangePinModal({
  isOpen,
  currentPin,
  onClose,
  onChangePinSuccess
}) {
  const [step, setStep] = useState(1); // 1: current pin, 2: new pin
  const [pinInput, setPinInput] = useState('');
  const [newPin, setNewPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleDigit = (digit) => {
    if (pinInput.length < 4) {
      const next = pinInput + digit;
      setPinInput(next);
      setErrorMsg('');

      if (next.length === 4) {
        if (step === 1) {
          if (next === currentPin) {
            setStep(2);
            setPinInput('');
          } else {
            setErrorMsg('현재 비밀번호가 일치하지 않습니다.');
            setTimeout(() => setPinInput(''), 400);
          }
        } else if (step === 2) {
          // New PIN confirmed
          onChangePinSuccess(next);
          alert('비밀번호가 성공적으로 변경되었습니다!');
          setStep(1);
          setPinInput('');
          onClose();
        }
      }
    }
  };

  const handleDelete = () => {
    setPinInput(prev => prev.slice(0, -1));
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-toss-modal">
      <div className="w-full max-w-xs p-6 bg-white dark:bg-gray-900 rounded-3xl text-center relative border border-gray-100 dark:border-gray-800 shadow-2xl">
        <button
          onClick={() => {
            setStep(1);
            setPinInput('');
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1 mt-2">
          비밀번호 변경
        </h3>
        <p className="text-xs text-gray-400 mb-5">
          {step === 1 ? '현재 비밀번호 4자리를 입력하세요' : '새로운 비밀번호 4자리를 입력하세요'}
        </p>

        {/* PIN Dots */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-3.5 h-3.5 rounded-full transition-all ${
                pinInput.length > idx
                  ? 'bg-blue-600 scale-110'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>

        {errorMsg && (
          <div className="text-xs text-red-500 font-bold mb-4">
            {errorMsg}
          </div>
        )}

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-2 max-w-[210px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleDigit(String(num))}
              className="w-14 h-14 rounded-2xl text-xl font-bold font-number text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-blue-50 transition-colors flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleDigit('0')}
            className="w-14 h-14 rounded-2xl text-xl font-bold font-number text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 active:bg-blue-50 transition-colors flex items-center justify-center"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-14 h-14 rounded-2xl text-xs font-bold text-gray-400 hover:text-gray-700 transition-colors flex items-center justify-center"
          >
            지우기
          </button>
        </div>
      </div>
    </div>
  );
}
