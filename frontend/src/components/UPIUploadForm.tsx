
'use client';

import React, { useState } from 'react';

export default function UPIUploadForm() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="bg-white/20 rounded-lg p-4 mb-2">
      <h2 className="font-semibold text-white mb-2">UPI/Credit Statement Upload</h2>
      {submitted ? (
        <div className="text-green-300">UPI statement uploaded! (mock: ₹1,00,000 balance)</div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
          <input type="file" className="block mb-2 text-white" />
          <button className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600" type="submit">Upload Statement</button>
        </form>
      )}
    </div>
  );
}
