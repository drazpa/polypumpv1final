export interface Token {
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
}