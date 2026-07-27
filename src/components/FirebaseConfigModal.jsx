import React, { useState } from 'react';
import { X, Database, Check, ExternalLink, HelpCircle } from 'lucide-react';
import { getSavedFirebaseConfig, saveFirebaseConfig } from '../services/firebase';

export default function FirebaseConfigModal({ isOpen, onClose }) {
  const currentCfg = getSavedFirebaseConfig() || {};
  const [apiKey, setApiKey] = useState(currentCfg.apiKey || '');
  const [authDomain, setAuthDomain] = useState(currentCfg.authDomain || '');
  const [projectId, setProjectId] = useState(currentCfg.projectId || '');
  const [storageBucket, setStorageBucket] = useState(currentCfg.storageBucket || '');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    if (!apiKey || !projectId) {
      alert('ApiKey와 ProjectId는 필수입니다.');
      return;
    }

    saveFirebaseConfig({
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim()
    });
  };

  const handleReset = () => {
    if (confirm('Firebase 설정을 초기화하고 브라우저 실시간 브로드캐스트 모드로 전환할까요?')) {
      saveFirebaseConfig(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-modal">
      <div className="glass-card max-w-lg w-full p-6 relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-gray-800 dark:text-gray-100">
                실시간 클라우드 DB (Firebase) 설정
              </h3>
              <p className="text-xs text-gray-400">온 가족 모바일 실시간 조회를 위한 클라우드 연동</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-200 space-y-1">
          <div className="font-bold flex items-center gap-1">
            <HelpCircle className="w-4 h-4 text-indigo-500" />
            <span>설정이 없어도 테스트가 가능합니다!</span>
          </div>
          <p>
            Firebase 설정 없이도 <strong>동일한 기기의 여러 탭/창 간에는 실시간으로 잔액 및 입출금이 100% 동기화</strong>됩니다.
            서로 다른 휴대폰에서 접속하려면 <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="underline font-bold text-indigo-600 dark:text-indigo-400">Firebase 무료 프로젝트</a> 연동값을 입력하세요.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
              apiKey
            </label>
            <input
              type="text"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
              projectId
            </label>
            <input
              type="text"
              placeholder="kids-cash-vault-123"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
              authDomain (선택)
            </label>
            <input
              type="text"
              placeholder="kids-cash-vault.firebaseapp.com"
              value={authDomain}
              onChange={(e) => setAuthDomain(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs font-bold text-rose-500 hover:underline"
            >
              설정 초기화
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                닫기
              </button>
              <button
                type="submit"
                className="btn-gradient-primary text-xs flex items-center gap-1"
              >
                <Check className="w-4 h-4" />
                <span>설정 저장 & 적용</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
