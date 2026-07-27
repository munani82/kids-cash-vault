import React, { useState } from 'react';
import { Target, Plus, CheckCircle, Trophy, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SavingGoals({
  kid,
  onAddGoal,
  onDeleteGoal,
  isParentMode
}) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [icon, setIcon] = useState('🎁');

  if (!kid) return null;

  const goals = kid.goals || [];
  const currentBalance = kid.balance || 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !targetAmount) return;

    onAddGoal(kid.id, {
      id: 'g_' + Date.now(),
      title,
      targetAmount: Number(targetAmount),
      icon
    });

    // Trigger celebration
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (e) {}

    setTitle('');
    setTargetAmount('');
    setShowAddModal(false);
  };

  const icons = ['🎮', '🧸', '🚲', '👟', '📚', '🎁', '📱', '🤖', '🎨'];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-3">
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-pink-500" />
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              {kid.name}의 저축 목표 (Wishlist)
            </h3>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-xs hover:bg-purple-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>새 목표 등록</span>
          </button>
        </div>

        {/* Goal list */}
        {goals.length === 0 ? (
          <div className="text-center py-8 bg-gray-50/50 dark:bg-gray-800/40 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
            <Trophy className="w-10 h-10 text-amber-400 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
              아직 등록된 저축 목표가 없어요!
            </p>
            <p className="text-xs text-gray-400 mt-1">
              사고 싶은 장난감이나 물건의 목표 금액을 정해보세요 🎯
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {goals.map((goal) => {
              const progress = Math.min(100, Math.round((currentBalance / goal.targetAmount) * 100));
              const isCompleted = currentBalance >= goal.targetAmount;

              return (
                <div
                  key={goal.id}
                  className="p-4 rounded-2xl bg-white/70 dark:bg-gray-800/70 border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl p-2 bg-purple-100 dark:bg-purple-900/40 rounded-2xl">
                        {goal.icon}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100">
                          {goal.title}
                        </h4>
                        <div className="text-xs font-number font-semibold text-gray-500 dark:text-gray-400">
                          목표: ₩{goal.targetAmount.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {isCompleted ? (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          달성 완료! 🎉
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold font-number">
                          {progress}% 달성
                        </span>
                      )}

                      {/* Parent or Kid Delete button */}
                      {(isParentMode || true) && (
                        <button
                          onClick={() => onDeleteGoal(kid.id, goal.id)}
                          className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 transition-all"
                          title="목표 삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isCompleted
                          ? 'bg-gradient-to-r from-emerald-400 to-green-500'
                          : 'bg-gradient-to-r from-purple-500 to-pink-500'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-modal">
          <div className="glass-card max-w-md w-full p-6 relative">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
              🎯 새로운 저축 목표 설정하기
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                  아이콘 선택
                </label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {icons.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIcon(ic)}
                      className={`text-2xl p-2 rounded-xl border ${
                        icon === ic
                          ? 'bg-purple-100 border-purple-500 dark:bg-purple-900/50'
                          : 'border-transparent'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                  목표 이름
                </label>
                <input
                  type="text"
                  placeholder="예: 닌텐도 게임칩, 곰인형"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                  목표 금액 (원)
                </label>
                <input
                  type="number"
                  placeholder="예: 30000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-number focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="btn-gradient-primary text-xs"
                >
                  목표 추가하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
