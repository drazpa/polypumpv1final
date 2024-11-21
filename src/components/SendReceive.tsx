import React, { useState } from 'react';
import { useAddress, useSDK } from '@thirdweb-dev/react';
import { Token } from '../types/token';
import { NFT } from '../types/nft';
import { QRCodeSVG } from 'qrcode.react';
import { Send, QrCode, ArrowRight, Coins, Image as ImageIcon, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { ethers } from 'ethers';

interface SendReceiveProps {
  tokens: Token[];
  nfts: NFT[];
}

type AssetType = 'token' | 'nft';

export const SendReceive: React.FC<SendReceiveProps> = ({ tokens, nfts }) => {
  const address = useAddress();
  const sdk = useSDK();
  const [assetType, setAssetType] = useState<AssetType>('token');
  const [selectedAsset, setSelectedAsset] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!address || !sdk || !selectedAsset || !recipientAddress) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!ethers.utils.isAddress(recipientAddress)) {
      toast.error('Invalid recipient address');
      return;
    }

    setIsSending(true);
    try {
      const contract = await sdk.getContract(selectedAsset);

      if (assetType === 'token') {
        if (!amount || Number(amount) <= 0) {
          throw new Error('Please enter a valid amount');
        }
        await contract.erc20.transfer(recipientAddress, amount);
        toast.success('Tokens sent successfully!');
      } else {
        if (!tokenId) {
          throw new Error('Please enter a token ID');
        }
        await contract.erc721.transfer(recipientAddress, tokenId);
        toast.success('NFT sent successfully!');
      }

      // Reset form
      setRecipientAddress('');
      setAmount('');
      setTokenId('');
    } catch (error: any) {
      toast.error(`Failed to send: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success('Address copied to clipboard!');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Send Panel */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <Send className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Send</h2>
        </div>

        <div className="space-y-6">
          {/* Asset Type Selection */}
          <div className="flex items-center gap-4 p-4 bg-black/20 rounded-lg border border-purple-500/30">
            <button
              onClick={() => setAssetType('token')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
                assetType === 'token'
                  ? 'bg-purple-600 text-white'
                  : 'bg-black/20 text-purple-200 hover:text-white'
              }`}
            >
              <Coins className="w-4 h-4" />
              Tokens
            </button>
            <button
              onClick={() => setAssetType('nft')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${
                assetType === 'nft'
                  ? 'bg-purple-600 text-white'
                  : 'bg-black/20 text-purple-200 hover:text-white'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              NFTs
            </button>
          </div>

          {/* Asset Selection */}
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              Select {assetType === 'token' ? 'Token' : 'NFT Collection'}
            </label>
            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black/20 border border-purple-500/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Select...</option>
              {assetType === 'token'
                ? tokens.map((token) => (
                    <option key={token.address} value={token.address}>
                      {token.name} ({token.symbol})
                    </option>
                  ))
                : nfts.map((nft) => (
                    <option key={nft.address} value={nft.address}>
                      {nft.name} ({nft.symbol})
                    </option>
                  ))}
            </select>
          </div>

          {/* Recipient Address */}
          <div>
            <label className="block text-sm font-medium text-purple-200 mb-2">
              Recipient Address
            </label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-black/20 border border-purple-500/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="0x..."
            />
          </div>

          {/* Amount or Token ID */}
          {assetType === 'token' ? (
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-purple-500/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter amount"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Token ID
              </label>
              <input
                type="number"
                value={tokenId}
                onChange={(e) => setTokenId(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-purple-500/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter token ID"
              />
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={isSending || !selectedAsset || !recipientAddress}
            className="w-full py-3 px-6 text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSending ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                Send {assetType === 'token' ? 'Tokens' : 'NFT'}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Receive Panel */}
      <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <QrCode className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-semibold text-white">Receive</h2>
        </div>

        <div className="flex flex-col items-center justify-center space-y-6">
          {address ? (
            <>
              <div className="p-4 bg-white rounded-xl">
                <QRCodeSVG
                  value={address}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="w-full p-4 bg-black/20 rounded-lg border border-purple-500/30">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-purple-200 text-sm break-all">{address}</p>
                  <button
                    onClick={copyAddress}
                    className="flex-shrink-0 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm text-purple-200 bg-purple-500/10 p-4 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <p>
                  Share this address to receive tokens and NFTs on the Polygon network.
                  Make sure senders specify the correct token ID when sending NFTs.
                </p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3 text-purple-200">
              <AlertCircle className="w-5 h-5 text-purple-400" />
              <p>Please connect your wallet to view your receive address.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};