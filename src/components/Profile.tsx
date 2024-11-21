import React from 'react';
import { useAddress, useBalance, useSDK } from '@thirdweb-dev/react';
import { Token } from '../types/token';
import { NFT } from '../types/nft';
import { Wallet, Coins, Image, ExternalLink, Clock, Activity } from 'lucide-react';

interface ProfileProps {
  tokens: Token[];
  nfts: NFT[];
}

export const Profile: React.FC<ProfileProps> = ({ tokens, nfts }) => {
  const address = useAddress();
  const { data: balance } = useBalance();
  const sdk = useSDK();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
    }
  };

  const recentActivity = [...tokens, ...nfts]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl p-8 border border-purple-500/30">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-purple-500/20 rounded-full">
            <Wallet className="w-8 h-8 text-purple-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-white">{formatAddress(address || '')}</h2>
              <button
                onClick={copyAddress}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 flex items-center gap-4">
              <p className="text-purple-200">
                Balance: {balance?.displayValue || '0'} {balance?.symbol}
              </p>
              <a
                href={`https://polygonscan.com/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1"
              >
                View on Explorer
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Activity className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-purple-200">Total Deployments</p>
              <h3 className="text-2xl font-bold text-white">{tokens.length + nfts.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Coins className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-purple-200">Tokens Created</p>
              <h3 className="text-2xl font-bold text-white">{tokens.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Image className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-purple-200">NFT Collections</p>
              <h3 className="text-2xl font-bold text-white">{nfts.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
        </div>

        <div className="space-y-4">
          {recentActivity.map((item) => (
            <div
              key={item.address}
              className="flex items-center gap-4 p-4 bg-black/20 rounded-lg border border-purple-500/30"
            >
              {'imageUrl' in item ? (
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-10 h-10 rounded-lg object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/40x40/8B5CF6/FFFFFF?text=' + item.symbol;
                  }}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Coins className="w-5 h-5 text-purple-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">
                  {item.name} ({item.symbol})
                </h3>
                <p className="text-purple-200 text-sm">
                  {'imageUrl' in item ? 'NFT Collection' : 'Token'} Deployed
                </p>
              </div>
              <div className="text-right">
                <p className="text-purple-200 text-sm">
                  {new Date(item.timestamp).toLocaleDateString()}
                </p>
                <a
                  href={`https://polygonscan.com/address/${item.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors text-sm flex items-center gap-1 justify-end"
                >
                  View
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};