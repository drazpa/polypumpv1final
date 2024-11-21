export interface GeneratedContent {
  tokenName: string;
  tokenSymbol: string;
  description: string;
  tokenomics: string;
  firstTweet: string;
  vision: string;
  culture: string;
  company: string;
  news: string;
  timestamp: string;
  id: string;
}

export interface GenerationHistory {
  items: GeneratedContent[];
}