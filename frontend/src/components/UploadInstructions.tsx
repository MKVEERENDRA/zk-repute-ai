'use client';
import React, { useState } from 'react';

const steps = [
  {
    title: 'GitHub Verification',
    what: 'GitHub OAuth: Log in with your GitHub account to verify contributions. OR GitHub ZIP: Download your GitHub data (ZIP file) from GitHub’s personal data export and upload it here.',
    why: 'This will help us count your commits, repositories, and verify your contribution history.'
  },
  {
    title: 'UPI/Credit Statement Upload',
    what: 'UPI Statement: Upload a PDF or CSV file of your UPI transactions. Credit Statement: Alternatively, upload a PDF or CSV of your credit card or loan statements.',
    why: 'This lets us analyze your creditworthiness or balances for a more accurate Reputation score (e.g., CreditX).'
  },
  {
    title: 'POAP/Event Presence',
    what: 'Wallet Address: Enter your wallet address where POAP tokens are stored. Fetch POAPs: We will automatically fetch your POAPs based on the provided wallet address.',
    why: 'POAPs are digital badges showing attendance at Web3 events. More POAPs means a better event participation score.'
  },
  {
    title: 'ERC-20 Token Holdings',
    what: 'Wallet Address: Provide your wallet address to fetch and display your ERC-20 token holdings.',
    why: 'We scan your wallet for token holdings (like USDC, DAI, etc.), which helps determine your financial trustworthiness.'
  },
  {
    title: 'Farcaster Profile',
    what: 'Farcaster Handle: Provide your Farcaster handle.',
    why: 'We analyze your Farcaster account for social graph insights, activity, and contributions.'
  },
  {
    title: 'Lens Protocol',
    what: 'Lens Handle: Provide your Lens Protocol handle for social engagement tracking.',
    why: 'Lens is another decentralized social platform, and your handle helps track engagement and contributions.'
  },
  {
    title: 'Web3 Event Check-ins',
    what: 'Event Files: Upload any event-related PDFs or CSVs from Web3 events you attended.',
    why: 'This tracks your presence at Web3 events (like ETHGlobal, NFT conferences, etc.), boosting your reputation.'
  },
  {
    title: 'Social Graph Verification (Twitter, LinkedIn, etc.)',
    what: 'Social Media Handle: Enter the handle of your social media accounts (e.g., Twitter, LinkedIn, etc.).',
    why: 'This helps us verify your social presence and calculate your SybilGuard score (to prevent bad actors from gaming the system).'
  },
  {
    title: 'On-Chain Activity (Auto-detected)',
    what: 'Wallet Connection: Simply connect your wallet using a Web3 wallet (e.g., MetaMask or WalletConnect).',
    why: 'No need to upload anything—this is auto-detected from your connected wallet. We scan your on-chain activity like ETH transfers, contract interactions, and DeFi participation.'
  },
];

export default function UploadInstructions() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4 text-white drop-shadow">How to Upload & Connect Data</h2>
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div
            key={step.title}
            className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur shadow-lg hover:shadow-xl transition cursor-pointer"
            onClick={() => setOpen(open === idx ? null : idx)}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg text-cyan-300">{idx+1}. {step.title}</span>
              <span className="text-xl text-cyan-200">{open === idx ? '−' : '+'}</span>
            </div>
            {open === idx && (
              <div className="mt-2 text-white/90">
                <div className="mb-2"><b>What to upload:</b> <span className="text-white/80">{step.what}</span></div>
                <div><b>Why?</b> <span className="text-white/70">{step.why}</span></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
