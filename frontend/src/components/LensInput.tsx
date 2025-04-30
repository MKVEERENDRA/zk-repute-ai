'use client';
import React, { useState } from 'react';

export default function LensInput() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="bg-white/20 rounded-lg p-4 mb-2">
      <h2 className="font-semibold text-white mb-2">Lens Protocol</h2>
      {submitted ? (
        <div className="text-green-300">Lens handle submitted! (mock: Engagement found)</div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
          <input type="text" placeholder="Enter Lens handle..." className="block mb-2 px-2 py-1 rounded" />
          <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600" type="submit">Submit Handle</button>
        </form>
      )}
    </div>
  );
}
