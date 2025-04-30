'use client';

import React, { useState } from 'react';

export default function GitHubUploadForm() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="bg-white/20 rounded-lg p-4 mb-2">
      <h2 className="font-semibold text-white mb-2">GitHub Verification</h2>
      {submitted ? (
        <div className="text-green-300">GitHub ZIP uploaded! (mock: 88 commits found)</div>
      ) : (
        <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
          <input type="file" className="block mb-2 text-white" />
          <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" type="submit">Upload ZIP</button>
        </form>
      )}
    </div>
  );
}
