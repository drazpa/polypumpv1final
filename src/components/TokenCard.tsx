import React from 'react';
import { ExternalLink, Copy, Globe, FileText, Flame, Coins, Plus, Loader2 } from 'lucide-react';
import { Token } from '../types/token';
import toast from 'react-hot-toast';

interface TokenCardProps {
  token: Token;
  onMint: (token: Token, amount: string) => void;
  onBurn: (token: Token, amount: string) => void;
  onPayFee: (tokenAddress: string) => void;
  mintingState: boolean;
  burningState: boolean;
  amount: string;
  onAmountChange: (value: string) => void;
  isPaying: boolean;
  hasPaid: boolean;
  feeAmount: string;
}

export const TokenCard: React.FC<TokenCardProps> = ({
  token,
  onMint,
  onBurn,
  onPayFee,
  mintingState,
  burningState,
  amount,
  onAmountChange,
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
          type: 'ERC20',
          options: {
            address: token.address,
            symbol: token.symbol,
            decimals: 18,
            image: token.iconUrl,
          },
        },
      });

      toast.success('Token added to MetaMask');
    } catch (error: any) {
      toast.error(`Failed to add to MetaMask: ${error.message}`);
    }
  };

  const shareOnTwitter = () => {
    const tweetText = encodeURIComponent(`Check out ${token.name} (${token.symbol})\n\nView on Polygonscan: https://polygonscan.com/token/${token.address}\n\nMINTED at MagicMinter.com`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
  };

  return (
    <div className="bg-black/20 rounded-lg p-4 border border-purple-500/30 hover:border-purple-500/50 transition-all">
      <div className="flex items-start gap-4">
        {token.iconUrl && (
          <img
            src={token.iconUrl}
            alt={`${token.name} icon`}
            className="w-12 h-12 rounded-full bg-purple-500/20 p-1"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://placehold.co/48x48/8B5CF6/FFFFFF?text=' + token.symbol;
            }}
          />
        )}
        
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white">
                {token.name} ({token.symbol})
              </h3>
              <div className="flex items-center mt-2 space-x-2">
                <span className="text-purple-200">
                  {formatAddress(token.address)}
                </span>
                <button
                  onClick={() => copyToClipboard(token.address)}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={`https://polygonscan.com/token/${token.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              
              {token.description && (
                <p className="mt-2 text-purple-200 text-sm">
                  {token.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-3">
                {Number(token.platformFee) > 0 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-200">
                    <Coins className="w-3 h-3 mr-1" />
                    {token.platformFee}% Fee
                  </span>
                )}
                {token.isBurnable && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-200">
                    <Flame className="w-3 h-3 mr-1" />
                    Burnable
                  </span>
                )}
                {token.isMintable && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-200">
                    <Coins className="w-3 h-3 mr-1" />
                    Mintable
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4 mt-3">
                {token.website && (
                  <a
                    href={token.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-purple-400 hover:text-purple-300"
                  >
                    <Globe className="w-4 h-4 mr-1" />
                    Website
                  </a>
                )}
                <a
                  href={`https://polygonscan.com/token/${token.address}#code`}
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
                      onClick={() => onPayFee(token.address)}
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

                {token.isMintable && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Amount"
                      value={amount}
                      onChange={(e) => onAmountChange(e.target.value)}
                      className="w-32 px-3 py-2 text-sm bg-black/20 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={() => onMint(token, amount)}
                      disabled={mintingState || !amount || !hasPaid}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {mintingState ? (
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4 mr-2" />
                      )}
                      Mint
                    </button>
                  </div>
                )}

                {token.isBurnable && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onBurn(token, amount)}
                      disabled={burningState || !amount || !hasPaid}
                      className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {burningState ? (
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Flame className="w-4 h-4 mr-2" />
                      )}
                      Burn
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col md:items-end">
              <span className="text-purple-200">
                Initial Supply: {Number(token.initialSupply).toLocaleString()}
              </span>
              <span className="text-purple-400 text-sm">
                {new Date(token.timestamp).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};