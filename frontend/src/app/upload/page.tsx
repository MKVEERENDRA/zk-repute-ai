import UploadInstructions from '../../components/UploadInstructions';
import GitHubUploadForm from '../../components/GitHubUploadForm';
import UPIUploadForm from '../../components/UPIUploadForm';
import POAPFetcher from '../../components/POAPFetcher';
import ERC20Fetcher from '../../components/ERC20Fetcher';
import FarcasterInput from '../../components/FarcasterInput';
import LensInput from '../../components/LensInput';
import SocialGraphInput from '../../components/SocialGraphInput';
import ConnectWallet from '../../components/ConnectWallet';

export default function UploadPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#24243e] p-6">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur rounded-2xl shadow-2xl p-8 border border-white/20">
        <UploadInstructions />
        <h1 className="text-3xl font-extrabold text-white mb-4 drop-shadow-lg">Upload Data</h1>
        <div className="space-y-6">
          <GitHubUploadForm />
          <UPIUploadForm />
          <POAPFetcher />
          <ERC20Fetcher />
          <FarcasterInput />
          <LensInput />
          <SocialGraphInput />
          <ConnectWallet />
        </div>
        <button className="mt-8 w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold text-lg shadow-lg hover:scale-105 transition">Submit Data</button>
        {/* Mock preview/confirmation below */}
        <div className="mt-6 p-4 bg-white/20 rounded-lg text-white text-sm">
          <b>Preview:</b> Alice (GitHub: 88 commits, UPI: ₹1,00,000, POAPs: 4, ERC-20: USDC 500, Farcaster: active, Lens: engaged, Social: verified)
        </div>
      </div>
    </main>
  );
}
