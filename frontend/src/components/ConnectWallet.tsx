'use client';

import React, { useState } from 'react';

export default function ConnectWallet() {
  const [connected, setConnected] = useState(false);
  return (
    <div>
      {connected ? (
        <span className="inline-block px-3 py-1 bg-green-500 text-white rounded-xl">0xAlice1234...abcd (mock)</span>
      ) : (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700"
          onClick={() => setConnected(true)}
        >
          Connect Wallet (mock)
        </button>
      )}
    </div>
  );
}
