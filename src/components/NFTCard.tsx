import React from 'react';
import { ExternalLink, Copy, Globe, FileText, Sparkles, Lock, Coins, Plus, Loader2 } from 'lucide-react';
import { NFT } from '../types/nft';
import toast from 'react-hot-toast';

interface NFTCardProps {
  nft: NFT;
  onMint: (nft: NFT) => void;
  onBurn: (nft: NFT, tokenId: string) => void;
  onViewNFTs: (nft: NFT) => void;
  onPayFee: (nftAddress: string) => void;
  mintingState: boolean;
  burningState: boolean;
  tokenId: string;
  onTokenIdChange: (value: string) => void;
  isPaying: boolean;
  hasPaid: boolean;
  feeAmount: string;
}

export const NFTCard: React.FC<NFTCardProps> = ({
  nft,
  onMint,
  onBurn,
  onViewNFTs,
  onPayFee,
  mintingState,
  burningState,
  tokenId,
  onTokenIdChange,
  isPaying,
  hasPaid,
  feeAmount,
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const addToMetaMask = async () => {
    try {
      if (!window.ethereum) {
        throw new Error('MetaMask is not installed');
      }

      await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC721',
          options: {
            address: nft.address,
            symbol: nft.symbol,
            tokenId: '1',
            image: nft.imageUrl,
          },
        },
      });

      toast.success('NFT Collection added to MetaMask');
    } catch (error: any) {
      toast.error(`Failed to add to MetaMask: ${error.message}`);
    }
  };

  const shareOnTwitter = () => {
    const tweetText = encodeURIComponent(`Check out ${nft.name} (${nft.symbol})\n\nView on Polygonscan: https://polygonscan.com/token/${nft.address}\n\nMINTED at MagicMinter.com`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
  };

  return (
    <div className="bg-black/20 rounded-lg p-4 border border-purple-500/30 hover:border-purple-500/50 transition-all">
      <div className="flex items-start gap-4">
        <img
          src={nft.imageUrl}
          alt={`${nft.name} preview`}
          className="w-24 h-24 rounded-lg object-cover bg-purple-500/20"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://placehold.co/96x96/8B5CF6/FFFFFF?text=' + nft.symbol;
          }}
        />
        
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white">
                {nft.name} ({nft.symbol})
              </h3>
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-purple-200">
                  {formatAddress(nft.address)}
                </span>
                <button
                  onClick={() => copyToClipboard(nft.address)}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={`https://polygonscan.com/token/${nft.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              
              {nft.description && (
                <p className="mt-2 text-purple-200 text-sm">
                  {nft.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-3">
                {Number(nft.mintPrice) > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-200">
                    <Coins className="w-3 h-3 mr-1" />
                    {nft.mintPrice} MATIC
                  </span>
                )}
                {Number(nft.royaltyBps) > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-200">
                    <Coins className="w-3 h-3 mr-1" />
                    {nft.royaltyBps}% Royalty
                  </span>
                )}
                {nft.maxSupply && Number(nft.maxSupply) > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-200">
                    Max Supply: {nft.maxSupply}
                  </span>
                )}
                {nft.isLazy && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-200">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Lazy Minting
                  </span>
                )}
                {nft.isDelayedReveal && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-500/20 text-pink-200">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Delayed Reveal
                  </span>
                )}
                {nft.isRestrictedTransfer && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-200">
                    <Lock className="w-3 h-3 mr-1" />
                    Restricted Transfer
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4 mt-3">
                <a
                  href={`https://polygonscan.com/token/${nft.address}#code`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-purple-400 hover:text-purple-300"
                >
                  <FileText className="w-4 h-4 mr-1" />
                  Contract
                </a>
                <button
                  onClick={addToMetaMask}
                  className="flex items-center text-sm text-purple-400 hover:text-purple-300"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add to MetaMask
                </button>
                <button
                  onClick={() => onViewNFTs(nft)}
                  className="flex items-center text-sm text-purple-400 hover:text-purple-300"
                >
                  <Globe className="w-4 h-4 mr-1" />
                  View NFTs
                </button>
                <button
                  onClick={shareOnTwitter}
                  className="flex items-center text-sm text-purple-400 hover:text-purple-300"
                >
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Share
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-4">
                {!hasPaid && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onPayFee(nft.address)}
                      disabled={isPaying}
                      className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        isPaying
                          ? 'bg-purple-600/50 text-white cursor-not-allowed'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {isPaying ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Paying...
                        </>
                      ) : (
                        <>
                          <Coins className="w-4 h-4 mr-2" />
                          Pay {feeAmount} POL Fee
                        </>
                      )}
                    </button>
                  </div>
                )}

                <button
                  onClick={() => onMint(nft)}
                  disabled={mintingState || !hasPaid}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {mintingState ? (
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Mint NFT
                </button>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Token ID"
                    value={tokenId}
                    onChange={(e) => onTokenIdChange(e.target.value)}
                    className="w-24 px-3 py-2 text-sm bg-black/20 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={() => onBurn(nft, tokenId)}
                    disabled={burningState || !tokenId || !hasPaid}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {burningState ? (
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Burn NFT
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:items-end">
              <span className="text-purple-400 text-sm">
                {new Date(nft.timestamp).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};