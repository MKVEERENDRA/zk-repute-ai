'use client';
import React, { useState } from 'react';

export default function SocialGraphInput() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="bg-white/20 rounded-lg p-4 mb-2">
      <h2 className="font-semibold text-white mb-2">Social Graph Verification</h2>
      {submitted ? (
        <div className="text-green-300">Social handle submitted! (mock: Twitter/LinkedIn verified)</div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
          <input type="text" placeholder="Enter Twitter/LinkedIn handle..." className="block mb-2 px-2 py-1 rounded" />
          <button className="bg-blue-400 text-white px-3 py-1 rounded hover:bg-blue-500" type="submit">Submit Handle</button>
        </form>
      )}
    </div>
  );
}
