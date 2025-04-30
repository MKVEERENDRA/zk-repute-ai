import React from 'react';

const contributors = [
  {
    name: 'Alice',
    wallet: '0xAlice1234...abcd',
    score: 88,
    area: 'StarkNet',
    project: 'ETHGlobal',
    zkStamp: '✅',
  },
  {
    name: 'Bob',
    wallet: '0xBob5678...efgh',
    score: 35,
    area: 'None',
    project: 'None',
    zkStamp: '❌',
  },
];

export default function ExploreProjectsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Explore Projects</h1>
        <p className="mb-6 text-gray-600">View trustworthy contributors (mock data):</p>
        <div className="mb-4 flex gap-4">
          <input className="border px-2 py-1 rounded" placeholder="Search by GitHub username or wallet..." />
          <select className="border px-2 py-1 rounded">
            <option>Sort by Score</option>
            <option>Sort by Area</option>
            <option>Sort by Project</option>
          </select>
        </div>
        <table className="w-full bg-white rounded shadow">
          <thead>
            <tr className="border-b">
              <th className="py-2">Wallet</th>
              <th>Score</th>
              <th>Area</th>
              <th>Project</th>
              <th>zkStamp</th>
            </tr>
          </thead>
          <tbody>
            {contributors.map((c) => (
              <tr key={c.wallet} className="text-center border-b last:border-b-0">
                <td className="py-2 font-mono text-xs">{c.wallet}</td>
                <td>{c.score}</td>
                <td>{c.area}</td>
                <td>{c.project}</td>
                <td>{c.zkStamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
