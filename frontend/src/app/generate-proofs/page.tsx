import React from 'react';
import ZKProofGenerator from '../../components/ZKProofGenerator';

export default function GenerateProofsPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#232526] via-[#414345] to-[#0f2027] p-6">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur rounded-2xl shadow-2xl p-8 border border-white/20">
        <h1 className="text-3xl font-extrabold text-white mb-4 drop-shadow-lg">Generate ZK Proofs</h1>
        <div className="mb-6 text-white text-opacity-80">
          Choose a data source to generate your proof:
        </div>
        <ZKProofGenerator />
        {/* Dummy zk-proof response (mock JSON) */}
        <div className="mt-8 p-4 bg-white/20 rounded-lg text-white text-sm">
          <b>Proof:</b> {'{"proof": "0xabc123...", "status": "valid"}'}
        </div>
      </div>
    </main>
  );
}
