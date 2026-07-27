import React from 'react';
import { Plus, UserCheck } from 'lucide-react';

export default function KidSelector({
  kids,
  activeKidId,
  onSelectKid,
  isParentMode,
  onAddKid
}) {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-3">
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {kids.map((kid) => {
          const isActive = kid.id === activeKidId;
          return (
            <button
              key={kid.id}
              onClick={() => onSelectKid(kid.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all whitespace-nowrap shadow-sm border ${
                isActive
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-transparent shadow-lg scale-[1.02]'
                  : 'glass-card text-gray-700 dark:text-gray-200 border-gray-200/50 dark:border-gray-700/50 hover:bg-white/90 dark:hover:bg-gray-800'
              }`}
            >
              <span className="text-2xl">{kid.avatar}</span>
              <div className="text-left">
                <div className="text-sm font-bold flex items-center gap-1">
                  {kid.name}
                  {isActive && <UserCheck className="w-3.5 h-3.5 text-white/80" />}
                </div>
                <div
                  className={`text-xs font-number font-semibold ${
                    isActive ? 'text-purple-100' : 'text-purple-600 dark:text-purple-400'
                  }`}
                >
                  ₩{(kid.balance || 0).toLocaleString()}
                </div>
              </div>
            </button>
          );
        })}

        {/* Parent can add new kid */}
        {isParentMode && (
          <button
            onClick={onAddKid}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-purple-300 dark:border-purple-800/60 text-purple-600 dark:text-purple-400 font-medium text-xs hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>아이 추가</span>
          </button>
        )}
      </div>
    </div>
  );
}
