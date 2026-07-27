import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import KidSelector from './components/KidSelector';
import VaultDashboard from './components/VaultDashboard';
import TransactionHistory from './components/TransactionHistory';
import DepositWithdrawModal from './components/DepositWithdrawModal';
import ParentPinModal from './components/ParentPinModal';
import ChangePinModal from './components/ChangePinModal';
import { subscribeVaultData, saveVaultData, DEFAULT_VAULT_DATA } from './services/firebase';

export default function App() {
  const [vaultData, setVaultData] = useState(DEFAULT_VAULT_DATA);
  const [activeKidId, setActiveKidId] = useState('kid1');
  const [isParentMode, setIsParentMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Modals
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [changePinModalOpen, setChangePinModalOpen] = useState(false);
  const [depWithModal, setDepWithModal] = useState({ isOpen: false, mode: 'deposit' });

  // Pure Realtime Cloud Subscription
  useEffect(() => {
    const unsub = subscribeVaultData(vaultData.familyVaultId || 'my-family-vault', (cloudData) => {
      if (cloudData) {
        setVaultData(cloudData);
        if (!cloudData.kids.find(k => k.id === activeKidId) && cloudData.kids.length > 0) {
          setActiveKidId(cloudData.kids[0].id);
        }
      }
    });

    return () => unsub && unsub();
  }, []);

  // Toggle Dark mode class on body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const activeKid = (vaultData.kids || []).find(k => k.id === activeKidId) || vaultData.kids?.[0];

  // Handle Parent PIN Toggle
  const handleToggleParentMode = () => {
    if (isParentMode) {
      setIsParentMode(false);
    } else {
      setPinModalOpen(true);
    }
  };

  const handlePinSuccess = () => {
    setIsParentMode(true);
    setPinModalOpen(false);
  };

  // Change PIN Success
  const handleChangePinSuccess = async (newPin) => {
    const updatedVault = {
      ...vaultData,
      parentPin: newPin
    };
    setVaultData(updatedVault);
    await saveVaultData(updatedVault);
  };

  // Deposit or Withdraw submit
  const handleDepositWithdraw = async ({ type, amount, memo }) => {
    if (!activeKid) return;

    const delta = type === 'deposit' ? amount : -amount;
    const newBalance = Math.max(0, (activeKid.balance || 0) + delta);

    const updatedKids = vaultData.kids.map(k => {
      if (k.id === activeKidId) {
        return { ...k, balance: newBalance };
      }
      return k;
    });

    const newTx = {
      id: 'tx_' + Date.now(),
      kidId: activeKidId,
      type,
      amount,
      memo: memo || (type === 'deposit' ? '입금' : '출금'),
      date: new Date().toISOString()
    };

    const updatedVault = {
      ...vaultData,
      kids: updatedKids,
      transactions: [newTx, ...(vaultData.transactions || [])]
    };

    setVaultData(updatedVault);
    await saveVaultData(updatedVault);
  };

  // Delete Transaction (Parent Mode)
  const handleDeleteTransaction = async (txId) => {
    const targetTx = (vaultData.transactions || []).find(t => t.id === txId);
    if (!targetTx) return;

    if (!confirm('이 입출금 거래 내역을 삭제하시겠습니까? 잔액이 취소됩니다.')) return;

    const reverseDelta = targetTx.type === 'deposit' ? -targetTx.amount : targetTx.amount;

    const updatedKids = vaultData.kids.map(k => {
      if (k.id === targetTx.kidId) {
        return { ...k, balance: Math.max(0, (k.balance || 0) + reverseDelta) };
      }
      return k;
    });

    const updatedTxList = (vaultData.transactions || []).filter(t => t.id !== txId);

    const updatedVault = {
      ...vaultData,
      kids: updatedKids,
      transactions: updatedTxList
    };

    setVaultData(updatedVault);
    await saveVaultData(updatedVault);
  };

  // Add Kid Profile (Parent)
  const handleAddKid = async () => {
    const name = prompt('새 아이의 이름을 입력해주세요:');
    if (!name) return;

    const avatars = ['👧', '👦', '👶', '🐱', '🐶'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    const newKid = {
      id: 'kid_' + Date.now(),
      name,
      avatar: randomAvatar,
      balance: 0
    };

    const updatedVault = {
      ...vaultData,
      kids: [...(vaultData.kids || []), newKid]
    };

    setVaultData(updatedVault);
    setActiveKidId(newKid.id);
    await saveVaultData(updatedVault);
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Top Navbar */}
      <Navbar
        isParentMode={isParentMode}
        onToggleParentMode={handleToggleParentMode}
        onOpenChangePinModal={() => setChangePinModalOpen(true)}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
      />

      {/* Kid Selector Tabs */}
      <KidSelector
        kids={vaultData.kids || []}
        activeKidId={activeKidId}
        onSelectKid={setActiveKidId}
        isParentMode={isParentMode}
        onAddKid={handleAddKid}
      />

      {/* Vault Dashboard */}
      {activeKid && (
        <>
          <VaultDashboard
            kid={activeKid}
            isParentMode={isParentMode}
            onOpenDepositModal={() => setDepWithModal({ isOpen: true, mode: 'deposit' })}
            onOpenWithdrawModal={() => setDepWithModal({ isOpen: true, mode: 'withdraw' })}
          />

          {/* Simple Transaction History */}
          <TransactionHistory
            transactions={vaultData.transactions || []}
            activeKidId={activeKidId}
            isParentMode={isParentMode}
            onDeleteTransaction={handleDeleteTransaction}
          />
        </>
      )}

      {/* Modals */}
      <DepositWithdrawModal
        isOpen={depWithModal.isOpen}
        mode={depWithModal.mode}
        kidName={activeKid?.name || ''}
        onClose={() => setDepWithModal({ ...depWithModal, isOpen: false })}
        onSubmit={handleDepositWithdraw}
      />

      <ParentPinModal
        isOpen={pinModalOpen}
        correctPin={vaultData.parentPin || '1234'}
        onClose={() => setPinModalOpen(false)}
        onSuccess={handlePinSuccess}
      />

      <ChangePinModal
        isOpen={changePinModalOpen}
        currentPin={vaultData.parentPin || '1234'}
        onClose={() => setChangePinModalOpen(false)}
        onChangePinSuccess={handleChangePinSuccess}
      />
    </div>
  );
}
