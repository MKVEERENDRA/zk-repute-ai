import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#24243e] p-6">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur rounded-2xl shadow-2xl p-8 border border-white/20 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-3 drop-shadow-lg">Prove your reputation privately with ZK + AI</h1>
        <div className="flex flex-col md:flex-row gap-4 justify-center my-8">
          <Link href="/upload">
            <button className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold text-lg w-full md:w-auto shadow-lg hover:scale-105 transition">Upload Data</button>
          </Link>
          <Link href="/generate-proofs">
            <button className="bg-gradient-to-r from-blue-500 via-cyan-500 to-green-400 text-white px-6 py-3 rounded-xl font-semibold text-lg w-full md:w-auto shadow-lg hover:scale-105 transition">Generate Proof</button>
          </Link>
          <Link href="/score-dashboard">
            <button className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold text-lg w-full md:w-auto shadow-lg hover:scale-105 transition">View Scores</button>
          </Link>
        </div>
        <div className="mt-8">
          <p className="text-lg text-white/80 mb-2">Let users prove their reputation (activity, creditworthiness, event presence, contributions) without revealing raw data.</p>
          <p className="text-white/60 text-sm">Scores are computed by an AI engine using on-chain + off-chain sources like GitHub, POAPs, UPI, ERC-20, social graphs, Farcaster, Lens, and event check-ins.</p>
        </div>
      </div>
    </main>
  );
}
