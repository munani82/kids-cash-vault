import fs from 'fs';
import path from 'path';

const backupFilePath = path.resolve('primary_data', 'vault_original_data_backup.json');
const targetServicePath = path.resolve('src', 'services', 'firebase.js');

function restoreData(sowonChargedAmount = 0) {
  if (!fs.existsSync(backupFilePath)) {
    console.error('백업 파일을 찾을 수 없습니다.');
    return;
  }

  const raw = fs.readFileSync(backupFilePath, 'utf8');
  const data = JSON.parse(raw);

  if (sowonChargedAmount > 0) {
    const sowon = data.kids.find((k) => k.id === 'kid2');
    if (sowon) {
      sowon.balance += sowonChargedAmount;
      data.transactions.unshift({
        id: 'tx_sowon_charge_' + Date.now(),
        kidId: 'kid2',
        type: 'deposit',
        amount: sowonChargedAmount,
        memo: '소원이 용돈 충전 복원',
        date: new Date().toISOString()
      });
    }
  }

  console.log('복원 대상 데이터 확인 완료:', JSON.stringify(data, null, 2));
  return data;
}

const args = process.argv.slice(2);
const charge = args[0] ? parseInt(args[0], 10) : 0;
restoreData(charge);
