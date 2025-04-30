import React from 'react';
import ScoreCard from '../../components/ScoreCard';
import ConnectWallet from '../../components/ConnectWallet';

const mockScores = [
  {
    name: 'ReputeX',
    value: 88,
    desc: 'Your overall Web3 credibility',
    color: 'from-cyan-400 via-blue-500 to-purple-500',
  },
  {
    name: 'CreditX',
    value: 85,
    desc: 'Financial trust from UPI/Credit',
    color: 'from-pink-500 via-red-500 to-yellow-500',
  },
  {
    name: 'ThriveX',
    value: 91,
    desc: 'Community presence (events, Lens, etc.)',
    color: 'from-green-400 via-lime-400 to-yellow-300',
  },
  {
    name: 'SybilGuardX',
    value: '✅ Human',
    desc: 'Sybil detection AI + zkGraph',
    color: 'from-indigo-500 via-purple-500 to-pink-500',
  },
];

export default function ScoreDashboardPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#232526] via-[#414345] to-[#0f2027] p-6">
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur rounded-2xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-3xl font-extrabold text-white mb-4 drop-shadow-lg">Score Dashboard</h1>
        <div className="flex justify-end mb-4">
          <ConnectWallet />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockScores.map((score) => (
            <ScoreCard key={score.name} {...score} />
          ))}
        </div>
        <div className="mt-8 flex flex-col items-center">
          <button className="py-3 px-8 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition mb-4">
            Mint Reputation NFT
          </button>
          <div className="p-3 bg-white/20 rounded-lg text-white text-sm">
            <b>Proof validation status:</b> Valid (mock)
          </div>
        </div>
      </div>
    </main>
  );
}
