import React, { useState } from 'react';
import { NFTCard } from './NFTCard';
import { ViewControls } from './ViewControls';
import { Pagination } from './Pagination';
import { NFTModal } from './NFTModal';
import { useNFTContract } from '../hooks/useNFTContract';
import { NFT } from '../types/nft';

interface DeployedNFTsProps {
  nfts: NFT[];
  viewMode: 'grid' | 'list';
  sortOption: 'newest' | 'oldest' | 'name' | 'symbol';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onSortOptionChange: (option: 'newest' | 'oldest' | 'name' | 'symbol') => void;
  onToggleFavorite: (address: string) => void;
}

export const DeployedNFTs: React.FC<DeployedNFTsProps> = ({
  nfts,
  viewMode,
  sortOption,
  onViewModeChange,
  onSortOptionChange,
  onToggleFavorite,
}) => {
  const [tokenIds, setTokenIds] = useState<Record<string, string>>({});
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [nftMetadata, setNftMetadata] = useState<NFTMetadata[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // 2x2 grid
  
  const {
    mintingStates,
    burningStates,
    handleMint,
    handleBurn,
    getNFTMetadata,
    paymentStates,
    isPaying,
    handlePayFee,
    FEE_AMOUNT,
  } = useNFTContract();

  const handleViewNFTs = async (nft: NFT) => {
    setSelectedNFT(nft);
    setIsModalOpen(true);
    const metadata = await getNFTMetadata(nft);
    setNftMetadata(metadata);
  };

  const handleTokenIdChange = (address: string, value: string) => {
    setTokenIds(prev => ({ ...prev, [address]: value }));
  };

  const totalPages = Math.ceil(nfts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedNFTs = nfts.slice(startIndex, startIndex + itemsPerPage);

  if (nfts.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-4">Deployed Collections</h2>
        <p className="text-purple-200">No NFT collections deployed yet. Create your first collection above!</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Deployed Collections</h2>
        </div>

        <ViewControls
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          sortOption={sortOption}
          onSortOptionChange={onSortOptionChange}
        />
        
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 gap-4'
            : 'space-y-4'
        }`}>
          {displayedNFTs.map((nft) => (
            <NFTCard
              key={nft.address}
              nft={nft}
              onMint={handleMint}
              onBurn={handleBurn}
              onViewNFTs={handleViewNFTs}
              onPayFee={handlePayFee}
              mintingState={mintingStates[nft.address]}
              burningState={burningStates[nft.address]}
              isPaying={isPaying}
              hasPaid={paymentStates[nft.address]}
              feeAmount={FEE_AMOUNT}
              tokenId={tokenIds[nft.address] || ''}
              onTokenIdChange={(value) => handleTokenIdChange(nft.address, value)}
              onToggleFavorite={() => onToggleFavorite(nft.address)}
              viewMode={viewMode}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {isModalOpen && selectedNFT && (
        <NFTModal
          nft={selectedNFT}
          metadata={nftMetadata}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};