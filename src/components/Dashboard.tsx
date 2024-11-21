import React, { useState } from 'react';
import { Token } from '../types/token';
import { NFT } from '../types/nft';
import { Coins, Image, TrendingUp, Clock, ArrowUpDown } from 'lucide-react';

interface DashboardProps {
  tokens: Token[];
  nfts: NFT[];
}

type SortOption = 'newest' | 'oldest' | 'name' | 'symbol';

export const Dashboard: React.FC<DashboardProps> = ({ tokens, nfts }) => {
  const [tokenSort, setTokenSort] = useState<SortOption>('newest');
  const [nftSort, setNftSort] = useState<SortOption>('newest');

  const sortItems = <T extends Token | NFT>(items: T[], sortOption: SortOption) => {
    return [...items].sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'oldest':
          return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
        case 'name':
          return a.name.localeCompare(b.name);
        case 'symbol':
          return a.symbol.localeCompare(b.symbol);
        default:
          return 0;
      }
    });
  };

  const SortSelect = ({ value, onChange }: { value: SortOption; onChange: (value: SortOption) => void }) => (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOption)}
      className="bg-black/20 border border-purple-500/30 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
    >
      <option value="newest">Newest First</option>
      <option value="oldest">Oldest First</option>
      <option value="name">Name (A-Z)</option>
      <option value="symbol">Symbol (A-Z)</option>
    </select>
  );

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Coins className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-purple-200">Total Tokens</p>
              <h3 className="text-2xl font-bold text-white">{tokens.length}</h3>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Image className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-purple-200">Total NFT Collections</p>
              <h3 className="text-2xl font-bold text-white">{nfts.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tokens Column */}
        <div className="space-y-6">
          {/* Recent Tokens */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">Recent Tokens</h2>
              </div>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>

            <div className="space-y-4">
              {tokens.slice(0, 3).map((token) => (
                <div key={token.address} className="flex items-center gap-4 p-4 bg-black/20 rounded-lg border border-purple-500/30">
                  {token.iconUrl ? (
                    <img src={token.iconUrl} alt={token.name} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Coins className="w-5 h-5 text-purple-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{token.name}</h3>
                    <p className="text-purple-200 text-sm">{token.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-200 text-sm">Supply</p>
                    <p className="text-white font-medium">{Number(token.initialSupply).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All Tokens */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Coins className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">All Tokens</h2>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-purple-400" />
                <SortSelect value={tokenSort} onChange={setTokenSort} />
              </div>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {sortItems(tokens, tokenSort).map((token) => (
                <div key={token.address} className="flex items-center gap-4 p-4 bg-black/20 rounded-lg border border-purple-500/30">
                  {token.iconUrl ? (
                    <img src={token.iconUrl} alt={token.name} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <Coins className="w-5 h-5 text-purple-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{token.name}</h3>
                    <p className="text-purple-200 text-sm">{token.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-200 text-sm">Supply</p>
                    <p className="text-white font-medium">{Number(token.initialSupply).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* NFTs Column */}
        <div className="space-y-6">
          {/* Recent NFTs */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">Recent NFT Collections</h2>
              </div>
              <TrendingUp className="w-5 h-5 text-purple-400" />
            </div>

            <div className="space-y-4">
              {nfts.slice(0, 3).map((nft) => (
                <div key={nft.address} className="flex items-center gap-4 p-4 bg-black/20 rounded-lg border border-purple-500/30">
                  <img 
                    src={nft.imageUrl} 
                    alt={nft.name} 
                    className="w-10 h-10 rounded-lg object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/40x40/8B5CF6/FFFFFF?text=' + nft.symbol;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{nft.name}</h3>
                    <p className="text-purple-200 text-sm">{nft.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-200 text-sm">Price</p>
                    <p className="text-white font-medium">{nft.mintPrice} MATIC</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* All NFTs */}
          <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Image className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">All NFT Collections</h2>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-purple-400" />
                <SortSelect value={nftSort} onChange={setNftSort} />
              </div>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {sortItems(nfts, nftSort).map((nft) => (
                <div key={nft.address} className="flex items-center gap-4 p-4 bg-black/20 rounded-lg border border-purple-500/30">
                  <img 
                    src={nft.imageUrl} 
                    alt={nft.name} 
                    className="w-10 h-10 rounded-lg object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/40x40/8B5CF6/FFFFFF?text=' + nft.symbol;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium truncate">{nft.name}</h3>
                    <p className="text-purple-200 text-sm">{nft.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-200 text-sm">Price</p>
                    <p className="text-white font-medium">{nft.mintPrice} MATIC</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};