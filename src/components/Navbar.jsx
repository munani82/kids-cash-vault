import React from 'react';
import { ShieldCheck, Lock, Moon, Sun, KeyRound } from 'lucide-react';

export default function Navbar({
  isParentMode,
  onToggleParentMode,
  onOpenChangePinModal,
  darkMode,
  onToggleDarkMode
}) {
  return (
    <header className="w-full max-w-2xl mx-auto px-4 pt-5 pb-2">
      <div className="flex items-center justify-between">
        {/* App Title with Full-Fill 3D Piggy Bank App Icon */}
        <div className="flex items-center gap-3">
          <img
            src="/icon.png"
            alt="아이금고 3D 로고"
            className="w-10 h-10 rounded-2xl shadow-sm object-cover"
          />
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            아이금고
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Parent Change PIN */}
          {isParentMode && (
            <button
              onClick={onOpenChangePinModal}
              className="p-2 rounded-full bg-gray-200/80 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-300 transition-colors"
              title="비밀번호 변경"
            >
              <KeyRound className="w-4 h-4" />
            </button>
          )}

          {/* Parent Mode Toggle */}
          <button
            onClick={onToggleParentMode}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
              isParentMode
                ? 'bg-[#3182f6] text-white'
                : 'bg-gray-200/80 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-300'
            }`}
          >
            {isParentMode ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>부모님 관리중</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>부모 모드</span>
              </>
            )}
          </button>

          {/* Dark Mode */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-full bg-gray-200/80 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-300 transition-colors"
            title="다크모드"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
          </button>
        </div>
      </div>
    </header>
  );
}
