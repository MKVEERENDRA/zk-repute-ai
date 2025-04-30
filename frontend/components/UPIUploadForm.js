// frontend/components/UPIUploadForm.js
import React, { useState } from 'react';

export default function UPIUploadForm() {
  const [transactions, setTransactions] = useState([]);
  const [balanceHistory, setBalanceHistory] = useState([]);
  const [scoreData, setScoreData] = useState(null);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

  // Parse CSV or JSON
  const parseFile = async (file) => {
    setFileName(file.name);
    const text = await file.text();
    if (file.name.endsWith('.json')) {
      try {
        const json = JSON.parse(text);
        setTransactions(json.transactions || json); // support both {transactions:[]} and []
        if (json.balanceHistory) setBalanceHistory(json.balanceHistory);
      } catch (e) {
        setError('Invalid JSON file');
      }
    } else if (file.name.endsWith('.csv')) {
      // Simple CSV parser for UPI txns: to,amount,date\n...
      const rows = text.trim().split(/\r?\n/);
      const txns = rows.slice(1).map(line => {
        const [to, amount, date] = line.split(',');
        return { to, amount: Number(amount), date };
      });
      setTransactions(txns);
    } else {
      setError('Unsupported file type');
    }
  };

  // Manual balance history input
  const handleBalanceInput = (e) => {
    const arr = e.target.value.split(',').map(Number).filter(x => !isNaN(x));
    setBalanceHistory(arr);
  };

  // Call backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setScoreData(null);
    try {
      const res = await fetch('/api/upi/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactions, balanceHistory })
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setScoreData(data);
    } catch (err) {
      setError('Failed to fetch score');
    }
  };

  return (
    <div style={{ background: '#fff2', borderRadius: 10, padding: 16 }}>
      <h3 className="text-xl font-bold mb-2 text-white">UPI Statement Upload</h3>
      <form onSubmit={handleSubmit}>
        <label className="block text-white mb-1">Upload UPI Statement (.csv or .json):<br />
          <input type="file" accept=".csv,.json" onChange={e => parseFile(e.target.files[0])} />
        </label>
        {fileName && <div className="text-white/80">File: {fileName}</div>}
        <label className="block text-white mb-1 mt-2">
          Balance History (comma separated, optional):<br />
          <input type="text" placeholder="2500,2400,2100..." onChange={handleBalanceInput} className="w-full rounded p-1" />
        </label>
        <button type="submit" disabled={!transactions.length} className="mt-2 py-1 px-4 rounded bg-indigo-500 text-white font-semibold hover:bg-indigo-600">Get UPI Score</button>
      </form>
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {scoreData && (
        <div style={{ marginTop: 16 }}>
          <h4>Score: <span style={{ color: scoreData.fairScore > 70 ? 'green' : scoreData.fairScore > 40 ? 'orange' : 'red' }}>{scoreData.fairScore || scoreData.score}</span></h4>
          <div style={{ background: '#eee', borderRadius: 6, height: 18, width: '100%', margin: '8px 0' }}>
            <div style={{ width: `${scoreData.fairScore || scoreData.score}%`, background: '#4caf50', height: 18, borderRadius: 6 }} />
          </div>
          <ul className="text-white/90">
            <li>Transaction Count: {scoreData.totalTxns}</li>
            <li>Volume: ₹{scoreData.totalVolume}</li>
            <li>Txn Frequency: {scoreData.txnFrequency?.toFixed(2)}</li>
            <li>Stable Balance Score: {scoreData.stableBalanceScore?.toFixed(2)}</li>
            <li>Recurring Pattern Score: {scoreData.recurringPatternScore}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
