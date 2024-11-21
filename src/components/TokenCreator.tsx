import React, { useState } from 'react';
import { useContract, useSDK, useAddress } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { Loader2, ImagePlus, AlertCircle, Flame, Lock } from 'lucide-react';

interface TokenCreatorProps {
  onTokenDeployed: (tokenData: any) => void;
}

export const TokenCreator: React.FC<TokenCreatorProps> = ({ onTokenDeployed }) => {
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    initialSupply: '',
    decimals: '18',
    iconUrl: '',
    description: '',
    website: '',
    isBurnable: true,
    isMintable: true,
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const sdk = useSDK();
  const address = useAddress();

  const FEE_AMOUNT = "10.0"; // 10.0 POL
  const FEE_RECIPIENT = "0xe99919afd85beBbadAa63B940b090328b6Ad3653";

  // Rest of the file remains exactly the same
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
      toast.success('Payment successful! You can now deploy your token.');
    } catch (error: any) {
      toast.error(`Payment failed: ${error.message}`);
    } finally {
      setIsPaying(false);
    }
  };

  const validateIconUrl = (url: string) => {
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

    if (formData.iconUrl && !validateIconUrl(formData.iconUrl)) {
      toast.error('Please enter a valid icon URL');
      return;
    }

    setIsDeploying(true);
    const deployPromise = async () => {
      try {
        const walletAddress = await sdk.wallet.getAddress();
        const contractAddress = await sdk.deployer.deployToken({
          name: formData.name,
          symbol: formData.symbol,
          primary_sale_recipient: walletAddress,
          platform_fee_recipient: walletAddress,
          platform_fee_basis_points: 0,
          burn_type: formData.isBurnable ? "burnable" : "none",
          mint_type: formData.isMintable ? "mintable" : "fixed",
        });

        const tokenContract = await sdk.getContract(contractAddress);
        await tokenContract.erc20.mint(formData.initialSupply);

        const tokenData = {
          address: contractAddress,
          name: formData.name,
          symbol: formData.symbol,
          initialSupply: formData.initialSupply,
          iconUrl: formData.iconUrl,
          description: formData.description,
          website: formData.website,
          isBurnable: formData.isBurnable,
          isMintable: formData.isMintable,
          timestamp: new Date().toISOString(),
        };

        onTokenDeployed(tokenData);
        setFormData({
          name: '',
          symbol: '',
          initialSupply: '',
          decimals: '18',
          iconUrl: '',
          description: '',
          website: '',
          isBurnable: true,
          isMintable: true,
        });
        setHasPaid(false);
        return tokenData;
      } catch (error: any) {
        throw new Error(error.message);
      } finally {
        setIsDeploying(false);
      }
    };

    toast.promise(deployPromise(), {
      loading: 'Deploying token...',
      success: (data) => `Successfully deployed ${data.name} token!`,
      error: (err) => `Failed to deploy: ${err.message}`,
    });
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Create New Token</h2>
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
                Token Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-purple-500/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="My Token"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Token Symbol
              </label>
              <input
                type="text"
                required
                value={formData.symbol}
                onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-purple-500/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="MTK"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Initial Supply
              </label>
              <input
                type="number"
                required
                value={formData.initialSupply}
                onChange={(e) => setFormData(prev => ({ ...prev, initialSupply: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-purple-500/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="1000000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Decimals
              </label>
              <input
                type="number"
                required
                value={formData.decimals}
                onChange={(e) => setFormData(prev => ({ ...prev, decimals: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-purple-500/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="18"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Token Icon URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={formData.iconUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, iconUrl: e.target.value }))}
                  className="w-full px-4 py-2 pl-10 rounded-lg bg-black/20 border border-purple-500/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com/icon.png"
                />
                <ImagePlus className="absolute left-3 top-2.5 w-4 h-4 text-purple-400" />
              </div>
              <p className="mt-1 text-xs text-purple-300">Optional: URL to your token's icon/logo</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-purple-500/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Describe your token's purpose"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">
                Website
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-black/20 border border-purple-500/30 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="https://yourproject.com"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBurnable}
                    onChange={(e) => setFormData(prev => ({ ...prev, isBurnable: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-black/40 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  <span className="ms-3 text-sm font-medium text-purple-200">Burnable</span>
                </label>
                <p className="mt-1 text-xs text-purple-300">Allow token burning</p>
              </div>

              <div className="flex-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isMintable}
                    onChange={(e) => setFormData(prev => ({ ...prev, isMintable: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-black/40 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  <span className="ms-3 text-sm font-medium text-purple-200">Mintable</span>
                </label>
                <p className="mt-1 text-xs text-purple-300">Allow additional minting</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4 mt-6">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-purple-200">Important Notes:</h4>
              <ul className="mt-2 text-sm text-purple-300 list-disc list-inside space-y-1">
                <li>Token will be deployed on the Polygon network</li>
                <li>Make sure you have enough MATIC for gas fees</li>
                <li>Token details cannot be modified after deployment</li>
                {formData.isBurnable && <li>Token holders will be able to burn their tokens</li>}
                {formData.isMintable && <li>Contract owner can mint additional tokens</li>}
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
            'Deploy Token'
          )}
        </button>
      </form>
    </div>
  );
};