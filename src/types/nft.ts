export interface NFT {
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
}

export interface NFTMetadata {
  id: string;
  uri: string;
  name: string;
  description: string;
  image: string;
}