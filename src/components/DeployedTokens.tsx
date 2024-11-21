import React, { useState } from 'react';
import { TokenCard } from './TokenCard';
import { ViewControls } from './ViewControls';
import { Pagination } from './Pagination';
import { useTokenContract } from '../hooks/useTokenContract';
import { Token } from '../types/token';

interface DeployedTokensProps {
  tokens: Token[];
  viewMode: 'grid' | 'list';
  sortOption: 'newest' | 'oldest' | 'name' | 'symbol';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onSortOptionChange: (option: 'newest' | 'oldest' | 'name' | 'symbol') => void;
  onToggleFavorite: (address: string) => void;
}

export const DeployedTokens: React.FC<DeployedTokensProps> = ({
  tokens,
  viewMode,
  sortOption,
  onViewModeChange,
  onSortOptionChange,
  onToggleFavorite,
}) => {
  const [amounts, setAmounts] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 2x3 grid
  
  const {
    mintingStates,
    burningStates,
    handleMint,
    handleBurn,
    paymentStates,
    isPaying,
    handlePayFee,
    FEE_AMOUNT,
  } = useTokenContract();

  const handleAmountChange = (address: string, value: string) => {
    setAmounts(prev => ({ ...prev, [address]: value }));
  };

  const totalPages = Math.ceil(tokens.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedTokens = tokens.slice(startIndex, startIndex + itemsPerPage);

  if (tokens.length === 0) {
    return (
      <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-4">Deployed Tokens</h2>
        <p className="text-purple-200">No tokens deployed yet. Create your first token above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Deployed Tokens</h2>
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
        {displayedTokens.map((token) => (
          <TokenCard
            key={token.address}
            token={token}
            onMint={handleMint}
            onBurn={handleBurn}
            onPayFee={handlePayFee}
            mintingState={mintingStates[token.address]}
            burningState={burningStates[token.address]}
            isPaying={isPaying}
            hasPaid={paymentStates[token.address]}
            feeAmount={FEE_AMOUNT}
            amount={amounts[token.address] || ''}
            onAmountChange={(value) => handleAmountChange(token.address, value)}
            onToggleFavorite={() => onToggleFavorite(token.address)}
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
  );
};