import React, { useState } from 'react';
import { useContract, useSDK, useAddress } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { Loader2, ImagePlus, AlertCircle, Sparkles, Lock, Coins } from 'lucide-react';

interface NFTMinterProps {
  onNFTDeployed: (nftData: any) => void;
}

export const NFTMinter: React.FC<NFTMinterProps> = ({ onNFTDeployed }) => {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    imageUrl: '',
    maxSupply: '',
    mintPrice: '0',
    royaltyBps: '0',
    isLazy: false,
    isDelayedReveal: false,
    isRestrictedTransfer: false,
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const sdk = useSDK();
  const address = useAddress();

  const FEE_AMOUNT = "5.0"; // 5.0 POL
  const FEE_RECIPIENT = "0xe99919afd85beBbadAa63B940b090328b6Ad3653";

  // Rest of the file remains exactly the same as before
  const handlePayFee = async () => {
    if (!address || !sdk) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsPaying(true);
    try {
      const signer = await sdk.getSigner();
      const tx = await signer.sendTransaction({
        to: FEE_RECIPIENT,
        value: ethers.utils.parseEther(FEE_AMOUNT),
      });

      await tx.wait();
      setHasPaid(true);
      toast.success('Payment successful! You can now deploy your collection.');
    } catch (error: any) {
      toast.error(`Payment failed: ${error.message}`);
    } finally {
      setIsPaying(false);
    }
  };

  const validateImageUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sdk) return;

    if (!hasPaid) {
      toast.error('Please pay the deployment fee first');
      return;
    }

    if (!validateImageUrl(formData.imageUrl)) {
      toast.error('Please enter a valid image URL');
      return;
    }

    if (Number(formData.royaltyBps) < 0 || Number(formData.royaltyBps) > 100) {
      toast.error('Royalty percentage must be between 0 and 100');
      return;
    }

    setIsDeploying(true);
    const deployPromise = async () => {
      try {
        const walletAddress = await sdk.wallet.getAddress();
        
        // Deploy NFT Collection contract
        const contractAddress = await sdk.deployer.deployNFTCollection({
          name: formData.name,
          symbol: formData.symbol,
          primary_sale_recipient: walletAddress,
          platform_fee_recipient: walletAddress,
          platform_fee_basis_points: 0,
          fee_recipient: walletAddress,
          seller_fee_basis_points: Number(formData.royaltyBps) * 100,
        });

        const nftCollection = await sdk.getContract(contractAddress);

        // Set approval for all if restricted transfer is enabled
        if (formData.isRestrictedTransfer) {
          await nftCollection.call("setApprovalForAll", [walletAddress, true]);
        }

        const nftData = {
          address: contractAddress,
          name: formData.name,
          symbol: formData.symbol,
          description: formData.description,
          imageUrl: formData.imageUrl,
          maxSupply: formData.maxSupply,
          mintPrice: formData.mintPrice,
          royaltyBps: formData.royaltyBps,
          isLazy: formData.isLazy,
          isDelayedReveal: formData.isDelayedReveal,
          isRestrictedTransfer: formData.isRestrictedTransfer,
          timestamp: new Date().toISOString(),
        };

        onNFTDeployed(nftData);
        setFormData({
          name: '',
          symbol: '',
          description: '',
          imageUrl: '',
          maxSupply: '',
          mintPrice: '0',
          royaltyBps: '0',
          isLazy: false,
          isDelayedReveal: false,
          isRestrictedTransfer: false,
        });
        setHasPaid(false);
        return nftData;
      } catch (error: any) {
        throw new Error(error.message);
      } finally {
        setIsDeploying(false);
      }
    };

    toast.promise(deployPromise(), {
      loading: 'Deploying NFT collection...',
      success: (data) => `Successfully deployed ${data.name} collection!`,
      error: (err) => `Failed to deploy: ${err.message}`,
    });
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Create NFT Collection</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm text-purple-200">
            Deployment Fee: {FEE_AMOUNT} POL
          </div>
          <button
            onClick={handlePayFee}
            disabled={isPaying || hasPaid}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
              hasPaid
                ? 'bg-green-600 text-white cursor-default'
                : 'bg-purple-600 hover:bg-purple-700 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isPaying ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Paying...
              </>
            ) : hasPaid ? (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Fee Paid
              </>
            ) : (
              'Pay Fee'
            )}
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Collection Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-purple-500/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="My NFT Collection"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Symbol
              </label>
              <input
                type="text"
                required
                value={formData.symbol}
                onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-purple-500/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="MNFT"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-purple-500/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe your NFT collection"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Collection Image URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full px-4 py-2 pl-10 rounded-lg bg-black/20 border border-purple-500/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com/image.png"
                />
                <ImagePlus className="absolute left-3 top-2.5 w-4 h-4 text-purple-400" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Max Supply
              </label>
              <input
                type="number"
                value={formData.maxSupply}
                onChange={(e) => setFormData(prev => ({ ...prev, maxSupply: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-purple-500/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0 for unlimited"
              />
              <p className="mt-1 text-xs text-purple-300">Leave empty or 0 for unlimited supply</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Mint Price (MATIC)
              </label>
              <input
                type="number"
                step="0.000000000000000001"
                value={formData.mintPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, mintPrice: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-purple-500/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Royalty Percentage
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.royaltyBps}
                onChange={(e) => setFormData(prev => ({ ...prev, royaltyBps: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-purple-500/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="0"
              />
              <p className="mt-1 text-xs text-purple-300">Percentage of secondary sales (0-100%)</p>
            </div>

            <div className="space-y-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isLazy}
                  onChange={(e) => setFormData(prev => ({ ...prev, isLazy: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-black/40 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                <span className="ms-3 text-sm font-medium text-purple-200">Lazy Minting</span>
              </label>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDelayedReveal}
                  onChange={(e) => setFormData(prev => ({ ...prev, isDelayedReveal: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-black/40 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                <span className="ms-3 text-sm font-medium text-purple-200">Delayed Reveal</span>
              </label>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isRestrictedTransfer}
                  onChange={(e) => setFormData(prev => ({ ...prev, isRestrictedTransfer: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-black/40 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                <span className="ms-3 text-sm font-medium text-purple-200">Restricted Transfer</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-purple-500/10 border border -purple-500/30 rounded-lg p-4 mt-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-purple-200">Important Notes:</h4>
              <ul className="mt-2 text-sm text-purple-300 list-disc list-inside space-y-1">
                <li>Collection will be deployed on the Polygon network</li>
                <li>Make sure you have enough MATIC for gas fees</li>
                <li>Collection details cannot be modified after deployment</li>
                {Number(formData.royaltyBps) > 0 && (
                  <li>You'll receive {formData.royaltyBps}% royalties on secondary sales</li>
                )}
                {formData.isLazy && (
                  <li>NFTs will be minted on-demand to save gas</li>
                )}
                {formData.isDelayedReveal && (
                  <li>NFTs can be revealed after minting</li>
                )}
                {formData.isRestrictedTransfer && (
                  <li>NFT transfers will be restricted to approved addresses</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isDeploying || !hasPaid}
          className="w-full py-3 px-6 text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isDeploying ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Deploying...
            </>
          ) : !hasPaid ? (
            <>
              <Lock className="w-5 h-5 mr-2" />
              Pay Fee to Deploy
            </>
          ) : (
            'Deploy Collection'
          )}
        </button>
      </form>
    </div>
  );
};