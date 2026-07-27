import React from 'react';
import { Lock, Unlock, Moon, Sun, Database, ShieldAlert, Sparkles } from 'lucide-react';

export default function Navbar({
  isParentMode,
  onToggleParentMode,
  darkMode,
  onToggleDarkMode,
  onOpenFirebaseModal
}) {
  return (
    <header className="w-full max-w-4xl mx-auto px-4 pt-6 pb-2">
      <div className="glass-card px-6 py-4 flex items-center justify-between shadow-lg">
        {/* Logo & App Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-2xl shadow-md glow-effect">
            🐷
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent flex items-center gap-1.5">
              Kids Cash Vault
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {isParentMode ? '👑 부모님 관리자 모드' : '🎈 우리아이 실시간 디지털 금고'}
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          {/* Mode Badge / Button */}
          <button
            onClick={onToggleParentMode}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
              isParentMode
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20'
            }`}
          >
            {isParentMode ? (
              <>
                <Unlock className="w-4 h-4 text-amber-500" />
                <span>부모님 모드</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-indigo-500" />
                <span>자녀 모드</span>
              </>
            )}
          </button>

          {/* Firebase Settings */}
          <button
            onClick={onOpenFirebaseModal}
            title="실시간 클라우드 DB 설정"
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            title="다크 모드 전환"
            className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>
        </div>
      </div>
    </header>
  );
}
