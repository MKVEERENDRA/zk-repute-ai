'use client';

import React from 'react';

type Props = {
  name: string;
  value: number | string;
  desc: string;
  color: string;
};

export default function ScoreCard({ name, value, desc, color }: Props) {
  return (
    <div className={`rounded-2xl shadow-lg p-6 text-white bg-gradient-to-br ${color} border border-white/20 backdrop-blur`}> 
      <h2 className="text-2xl font-bold mb-2 drop-shadow">{name}</h2>
      <div className="text-4xl font-extrabold mb-2 drop-shadow-glow">{value}</div>
      <div className="text-white/80 mb-1 text-sm">{desc}</div>
    </div>
  );
}
