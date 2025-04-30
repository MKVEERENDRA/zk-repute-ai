'use client';

import React, { useState } from 'react';

const demoProofs: Record<string, string> = {
  GitHub: '{"proof": "0xabc123", "status": "valid"}',
  UPI: '{"proof": "0xdef456", "status": "valid"}',
  POAP: '{"proof": "0xpoap789", "status": "valid"}',
  'ERC-20': '{"proof": "0xerc20abc", "status": "valid"}',
  Social: '{"proof": "0xsocialxyz", "status": "valid"}'
};

export default function ZKProofGenerator() {
  const [source, setSource] = useState('GitHub');
  const [proof, setProof] = useState<string | null>(null);

  return (
    <div className="bg-white/20 rounded-lg p-4 mb-2 text-white">
      <label className="block mb-2 font-semibold">Data Source</label>
      <select
        className="mb-4 px-2 py-1 rounded text-black"
        value={source}
        onChange={e => setSource(e.target.value)}
      >
        {Object.keys(demoProofs).map(key => (
          <option key={key} value={key}>{key}</option>
        ))}
      </select>
      <button
        className="bg-green-500 px-4 py-2 rounded text-white font-bold hover:bg-green-600 ml-2"
        onClick={() => setProof(demoProofs[source])}
      >
        Generate ZK Proof
      </button>
      {proof && (
        <div className="mt-4 p-3 bg-black/40 rounded text-xs font-mono border border-green-500">
          {proof}
        </div>
      )}
    </div>
  );
}
