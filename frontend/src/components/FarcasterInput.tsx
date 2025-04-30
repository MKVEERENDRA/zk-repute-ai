'use client';
import React, { useState } from 'react';

export default function FarcasterInput() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="bg-white/20 rounded-lg p-4 mb-2">
      <h2 className="font-semibold text-white mb-2">Farcaster Profile</h2>
      {submitted ? (
        <div className="text-green-300">Farcaster handle submitted! (mock: Activity found)</div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
          <input type="text" placeholder="Enter Farcaster handle..." className="block mb-2 px-2 py-1 rounded" />
          <button className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600" type="submit">Submit Handle</button>
        </form>
      )}
    </div>
  );
}
