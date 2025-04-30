'use client';

import React, { useState } from 'react';

export default function POAPFetcher() {
  const [poapSubmitted, setPoapSubmitted] = useState(false);
  const [eventSubmitted, setEventSubmitted] = useState(false);
  return (
    <div className="bg-white/20 rounded-lg p-4 mb-2">
      <h2 className="font-semibold text-white mb-2">POAP/Event Presence</h2>
      {/* POAP */}
      {poapSubmitted ? (
        <div className="text-green-300 mb-2">POAPs fetched! (mock: 4 events found)</div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); setPoapSubmitted(true); }} className="mb-2">
          <input type="text" placeholder="Enter wallet address for POAPs..." className="block mb-2 px-2 py-1 rounded" />
          <button className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600" type="submit">Fetch POAPs</button>
        </form>
      )}
      {/* Web3 Event Check-ins */}
      {eventSubmitted ? (
        <div className="text-green-300">Event files uploaded! (mock: 2 events added)</div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); setEventSubmitted(true); }}>
          <input type="file" className="block mb-2 text-white" />
          <button className="bg-pink-400 text-white px-3 py-1 rounded hover:bg-pink-500" type="submit">Upload Event File</button>
        </form>
      )}
    </div>
  );
}
