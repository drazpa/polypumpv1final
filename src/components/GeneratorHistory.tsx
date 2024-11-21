import React from 'react';
import { Share2, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { GeneratedContent } from '../types/generator';
import toast from 'react-hot-toast';

interface GeneratorHistoryProps {
  history: GeneratedContent[];
}

export const GeneratorHistory: React.FC<GeneratorHistoryProps> = ({ history }) => {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());
  const [copiedStates, setCopiedStates] = React.useState<{[key: string]: boolean}>({});

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (expandedItems.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates(prev => ({ ...prev, [key]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [key]: false }));
      }, 2000);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy text');
    }
  };

  const shareOnTwitter = (text: string) => {
    const tweetText = encodeURIComponent(text);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
  };

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-purple-200">
        No generation history yet. Generate some content to see it here!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <div key={item.id} className="bg-black/20 rounded-lg border border-purple-500/30">
          <div 
            className="p-4 cursor-pointer flex items-center justify-between"
            onClick={() => toggleExpand(item.id)}
          >
            <div>
              <h3 className="text-lg font-semibold text-white">
                {item.tokenName} ({item.tokenSymbol})
              </h3>
              <p className="text-sm text-purple-200">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
            {expandedItems.has(item.id) ? (
              <ChevronUp className="w-5 h-5 text-purple-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-purple-400" />
            )}
          </div>

          {expandedItems.has(item.id) && (
            <div className="p-4 border-t border-purple-500/30 space-y-4">
              {Object.entries(item).map(([key, value]) => {
                if (key === 'id' || key === 'timestamp') return null;
                
                const isShareable = key === 'firstTweet' || key === 'news';
                const displayKey = key.charAt(0).toUpperCase() + key.slice(1);
                
                return (
                  <div key={key} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-purple-200">{displayKey}</h4>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(value, `${item.id}-${key}`)}
                          className="text-purple-400 hover:text-purple-300 transition-colors"
                        >
                          {copiedStates[`${item.id}-${key}`] ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        {isShareable && (
                          <button
                            onClick={() => shareOnTwitter(value)}
                            className="text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-white text-sm">{value}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};