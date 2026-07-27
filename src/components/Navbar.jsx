import React from 'react';
import { ShieldCheck, Lock, Moon, Sun } from 'lucide-react';

export default function Navbar({
  isParentMode,
  onToggleParentMode,
  darkMode,
  onToggleDarkMode
}) {
  return (
    <header className="w-full max-w-2xl mx-auto px-5 pt-6 pb-2">
      <div className="flex items-center justify-between">
        {/* App Title */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500 text-white font-black text-sm flex items-center justify-center shadow-sm">
            ₩
          </div>
          <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-gray-100">
            아이금고
          </span>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Parent Auth Toggle */}
          <button
            onClick={onToggleParentMode}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              isParentMode
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-300'
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
