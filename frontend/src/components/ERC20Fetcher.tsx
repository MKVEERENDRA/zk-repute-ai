'use client';
import React, { useState } from 'react';

export default function ERC20Fetcher() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="bg-white/20 rounded-lg p-4 mb-2">
      <h2 className="font-semibold text-white mb-2">ERC-20 Token Holdings</h2>
      {submitted ? (
        <div className="text-green-300">ERC-20 tokens fetched! (mock: USDC: 500, DAI: 200)</div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
          <input type="text" placeholder="Enter wallet address..." className="block mb-2 px-2 py-1 rounded" />
          <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600" type="submit">Fetch Tokens</button>
        </form>
      )}
    </div>
  );
}
