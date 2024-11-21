import React, { useState, useEffect } from 'react';
import { Share2, Loader2, RefreshCw, AlertCircle, Copy, Check, Coins, History } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAddress, useSDK } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import { GeneratorHistory } from './GeneratorHistory';
import { GeneratedContent } from '../types/generator';
import { v4 as uuidv4 } from 'uuid';

interface ColumnContent {
  content: string;
  isGenerating: boolean;
}

interface ContentState {
  [key: string]: ColumnContent;
}

const INITIAL_CONTENT: ContentState = {
  tokenName: { content: '', isGenerating: false },
  tokenSymbol: { content: '', isGenerating: false },
  description: { content: '', isGenerating: false },
  tokenomics: { content: '', isGenerating: false },
  firstTweet: { content: '', isGenerating: false },
  vision: { content: '', isGenerating: false },
  culture: { content: '', isGenerating: false },
  company: { content: '', isGenerating: false },
  news: { content: '', isGenerating: false },
};

const GENERATE_FEE = "0.50"; // 0.50 POL
const FEE_RECIPIENT = "0xe99919afd85beBbadAa63B940b090328b6Ad3653";
const STORAGE_KEY = 'generator_history';

export const Generator: React.FC = () => {
  const [content, setContent] = useState<ContentState>(INITIAL_CONTENT);
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});
  const [isPaying, setIsPaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedContent[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const address = useAddress();
  const sdk = useSDK();

  const OPENROUTER_API_KEY = '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';

  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const saveToHistory = (generatedContent: ContentState) => {
    const historyItem: GeneratedContent = {
      tokenName: generatedContent.tokenName.content,
      tokenSymbol: generatedContent.tokenSymbol.content,
      description: generatedContent.description.content,
      tokenomics: generatedContent.tokenomics.content,
      firstTweet: generatedContent.firstTweet.content,
      vision: generatedContent.vision.content,
      culture: generatedContent.culture.content,
      company: generatedContent.company.content,
      news: generatedContent.news.content,
      timestamp: new Date().toISOString(),
      id: uuidv4(),
    };

    const updatedHistory = [historyItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  };

  // Rest of the component remains the same until the return statement

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Token Content Generator</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center px-4 py-2 bg-purple-500/20 text-white rounded-lg hover:bg-purple-500/30 transition-all gap-2"
          >
            <History className="w-5 h-5" />
            <span>{showHistory ? 'Hide History' : 'Show History'}</span>
          </button>
          <button
            onClick={generateAll}
            disabled={isGenerating || isPaying}
            className="flex items-center px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed gap-2"
          >
            {isGenerating || isPaying ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{isPaying ? 'Processing Payment...' : 'Generating...'}</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                <span>Generate All Content</span>
                <span className="text-sm">({GENERATE_FEE} POL)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {showHistory ? (
        <GeneratorHistory history={history} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ContentColumn title="Token Name" columnKey="tokenName" />
          <ContentColumn title="Token Symbol" columnKey="tokenSymbol" />
          <ContentColumn title="Description" columnKey="description" />
          <ContentColumn title="Tokenomics" columnKey="tokenomics" />
          <ContentColumn title="First Tweet" columnKey="firstTweet" showShare={true} />
          <ContentColumn title="Vision" columnKey="vision" />
          <ContentColumn title="Culture" columnKey="culture" />
          <ContentColumn title="Company" columnKey="company" />
          <ContentColumn title="Featured News" columnKey="news" showShare={true} />
        </div>
      )}
    </div>
  );
};