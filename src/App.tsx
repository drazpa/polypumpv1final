import React, { useState } from 'react';
import { ConnectWallet, useAddress, useConnectionStatus } from "@thirdweb-dev/react";
import { TokenCreator } from './components/TokenCreator';
import { DeployedTokens } from './components/DeployedTokens';
import { NFTMinter } from './components/NFTMinter';
import { DeployedNFTs } from './components/DeployedNFTs';
import { Dashboard } from './components/Dashboard';
import { Profile } from './components/Profile';
import { SendReceive } from './components/SendReceive';
import { useDeployedContracts } from './hooks/useDeployedContracts';
import { Toaster } from 'react-hot-toast';
import { Coins, Wallet, Image, LayoutDashboard, User, Send } from 'lucide-react';

function App() {
  const address = useAddress();
  const connectionStatus = useConnectionStatus();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'tokens' | 'nfts' | 'profile' | 'send-receive'>('dashboard');
  const {
    tokens,
    nfts,
    addToken,
    addNFT,
    viewMode,
    setViewMode,
    sortOption,
    setSortOption,
    toggleTokenFavorite,
    toggleNFTFavorite,
  } = useDeployedContracts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <Toaster position="top-right" />
      
      <nav className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center">
              <Coins className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              <span className="ml-2 text-lg sm:text-xl font-bold text-white">MagicMinter</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {connectionStatus === "connected" && (
                <div className="hidden sm:flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                  <Wallet className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 mr-1.5 sm:mr-2" />
                  <span className="text-xs sm:text-sm text-purple-200">
                    {address?.slice(0, 4)}...{address?.slice(-4)}
                  </span>
                </div>
              )}
              <ConnectWallet 
                theme="dark"
                btnTitle="Connect"
                className="!bg-purple-600 !text-white !px-3 sm:!px-4 !py-1.5 sm:!py-2 !text-sm !rounded-lg"
              />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-12">
        {connectionStatus === "connected" ? (
          <>
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="inline-flex rounded-lg p-1 bg-purple-500/10 backdrop-blur-xl">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${
                    activeTab === 'dashboard'
                      ? 'bg-purple-600 text-white'
                      : 'text-purple-200 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <LayoutDashboard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Dashboard
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('tokens')}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${
                    activeTab === 'tokens'
                      ? 'bg-purple-600 text-white'
                      : 'text-purple-200 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Tokens
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('nfts')}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${
                    activeTab === 'nfts'
                      ? 'bg-purple-600 text-white'
                      : 'text-purple-200 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Image className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    NFTs
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('send-receive')}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${
                    activeTab === 'send-receive'
                      ? 'bg-purple-600 text-white'
                      : 'text-purple-200 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Send/Receive
                  </div>
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${
                    activeTab === 'profile'
                      ? 'bg-purple-600 text-white'
                      : 'text-purple-200 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Profile
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-6 sm:space-y-12">
              {activeTab === 'dashboard' ? (
                <Dashboard tokens={tokens} nfts={nfts} />
              ) : activeTab === 'tokens' ? (
                <>
                  <TokenCreator onTokenDeployed={addToken} />
                  <DeployedTokens
                    tokens={tokens}
                    viewMode={viewMode}
                    sortOption={sortOption}
                    onViewModeChange={setViewMode}
                    onSortOptionChange={setSortOption}
                    onToggleFavorite={toggleTokenFavorite}
                  />
                </>
              ) : activeTab === 'nfts' ? (
                <>
                  <NFTMinter onNFTDeployed={addNFT} />
                  <DeployedNFTs
                    nfts={nfts}
                    viewMode={viewMode}
                    sortOption={sortOption}
                    onViewModeChange={setViewMode}
                    onSortOptionChange={setSortOption}
                    onToggleFavorite={toggleNFTFavorite}
                  />
                </>
              ) : activeTab === 'send-receive' ? (
                <SendReceive tokens={tokens} nfts={nfts} />
              ) : (
                <Profile tokens={tokens} nfts={nfts} />
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-12 sm:py-20">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
              Welcome to MagicMinter
            </h2>
            <p className="text-purple-200 mb-8">
              Connect your wallet to start creating tokens and NFTs on Polygon Network
            </p>
            <ConnectWallet 
              theme="dark"
              btnTitle="Connect Wallet"
              className="!bg-purple-600 !text-white"
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;