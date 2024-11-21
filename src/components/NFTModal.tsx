import React from 'react';
import { X } from 'lucide-react';
import { NFT, NFTMetadata } from '../types/nft';

interface NFTModalProps {
  nft: NFT;
  metadata: NFTMetadata[];
  onClose: () => void;
}

export const NFTModal: React.FC<NFTModalProps> = ({ nft, metadata, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden relative">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white">
              {nft.name} NFTs
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
          {metadata.length === 0 ? (
            <p className="text-gray-400 text-center">No NFTs minted yet</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {metadata.map((nft) => (
                <div
                  key={nft.id}
                  className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700"
                >
                  <img
                    src={nft.image}
                    alt={nft.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="text-white font-medium mb-1">{nft.name}</h4>
                    <p className="text-gray-400 text-sm">{nft.description}</p>
                    <p className="text-purple-400 text-sm mt-2">Token ID: {nft.id}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};