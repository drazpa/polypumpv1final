import { useState, useEffect } from 'react';

interface Token {
  address: string;
  name: string;
  symbol: string;
  initialSupply: string;
  timestamp: string;
  iconUrl?: string;
  description?: string;
  website?: string;
  platformFee?: string;
  isBurnable?: boolean;
  isMintable?: boolean;
  isFavorite?: boolean;
}

interface NFT {
  address: string;
  name: string;
  symbol: string;
  description?: string;
  imageUrl: string;
  maxSupply?: string;
  mintPrice: string;
  royaltyBps: string;
  isLazy: boolean;
  isDelayedReveal: boolean;
  isRestrictedTransfer: boolean;
  timestamp: string;
  isFavorite?: boolean;
}

export type ViewMode = 'grid' | 'list';
export type SortOption = 'newest' | 'oldest' | 'name' | 'symbol';

export const useDeployedContracts = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [nfts, setNFTs] = useState<NFT[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(() => 
    localStorage.getItem('viewMode') as ViewMode || 'grid'
  );
  const [sortOption, setSortOption] = useState<SortOption>(() =>
    localStorage.getItem('sortOption') as SortOption || 'newest'
  );

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTokens = localStorage.getItem('deployedTokens');
    const savedNFTs = localStorage.getItem('deployedNFTs');
    const savedFavoriteTokens = localStorage.getItem('favoriteTokens');
    const savedFavoriteNFTs = localStorage.getItem('favoriteNFTs');

    if (savedTokens) {
      const parsedTokens = JSON.parse(savedTokens);
      const favoriteTokens = savedFavoriteTokens ? JSON.parse(savedFavoriteTokens) : [];
      setTokens(parsedTokens.map((token: Token) => ({
        ...token,
        isFavorite: favoriteTokens.includes(token.address)
      })));
    }
    
    if (savedNFTs) {
      const parsedNFTs = JSON.parse(savedNFTs);
      const favoriteNFTs = savedFavoriteNFTs ? JSON.parse(savedFavoriteNFTs) : [];
      setNFTs(parsedNFTs.map((nft: NFT) => ({
        ...nft,
        isFavorite: favoriteNFTs.includes(nft.address)
      })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('viewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem('sortOption', sortOption);
  }, [sortOption]);

  const addToken = (token: Token) => {
    const updatedTokens = [...tokens, { ...token, isFavorite: false }];
    setTokens(updatedTokens);
    localStorage.setItem('deployedTokens', JSON.stringify(updatedTokens));
  };

  const addNFT = (nft: NFT) => {
    const updatedNFTs = [...nfts, { ...nft, isFavorite: false }];
    setNFTs(updatedNFTs);
    localStorage.setItem('deployedNFTs', JSON.stringify(updatedNFTs));
  };

  const toggleTokenFavorite = (address: string) => {
    const updatedTokens = tokens.map(token => 
      token.address === address ? { ...token, isFavorite: !token.isFavorite } : token
    );
    setTokens(updatedTokens);
    localStorage.setItem('deployedTokens', JSON.stringify(updatedTokens));
    localStorage.setItem('favoriteTokens', JSON.stringify(
      updatedTokens.filter(t => t.isFavorite).map(t => t.address)
    ));
  };

  const toggleNFTFavorite = (address: string) => {
    const updatedNFTs = nfts.map(nft => 
      nft.address === address ? { ...nft, isFavorite: !nft.isFavorite } : nft
    );
    setNFTs(updatedNFTs);
    localStorage.setItem('deployedNFTs', JSON.stringify(updatedNFTs));
    localStorage.setItem('favoriteNFTs', JSON.stringify(
      updatedNFTs.filter(n => n.isFavorite).map(n => n.address)
    ));
  };

  const getSortedTokens = () => {
    return [...tokens].sort((a, b) => {
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

  const getSortedNFTs = () => {
    return [...nfts].sort((a, b) => {
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

  return {
    tokens: getSortedTokens(),
    nfts: getSortedNFTs(),
    addToken,
    addNFT,
    viewMode,
    setViewMode,
    sortOption,
    setSortOption,
    toggleTokenFavorite,
    toggleNFTFavorite,
  };
};