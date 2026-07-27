import React from 'react';
import { Plus } from 'lucide-react';

export default function KidSelector({
  kids,
  activeKidId,
  onSelectKid,
  isParentMode,
  onAddKid
}) {
  return (
    <div className="w-full max-w-2xl mx-auto px-5 py-3">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {kids.map((kid) => {
          const isActive = kid.id === activeKidId;
          return (
            <button
              key={kid.id}
              onClick={() => onSelectKid(kid.id)}
              className={`px-4 py-2.5 rounded-2xl font-bold text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100'
              }`}
            >
              <span>{kid.avatar || '👤'}</span>
              <span>{kid.name}</span>
              <span className="text-xs opacity-75 font-number">
                ₩{(kid.balance || 0).toLocaleString()}
              </span>
            </button>
          );
        })}

        {isParentMode && (
          <button
            onClick={onAddKid}
            className="p-2.5 rounded-2xl bg-gray-200/70 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold hover:bg-gray-300 transition-all whitespace-nowrap flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            <span>아이 추가</span>
          </button>
        )}
      </div>
    </div>
  );
}
