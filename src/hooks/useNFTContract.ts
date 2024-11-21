import { useContract, useAddress, useSDK } from '@thirdweb-dev/react';
import { useState } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { NFT, NFTMetadata } from '../types/nft';

export const useNFTContract = () => {
  const [mintingStates, setMintingStates] = useState<Record<string, boolean>>({});
  const [burningStates, setBurningStates] = useState<Record<string, boolean>>({});
  const [paymentStates, setPaymentStates] = useState<Record<string, boolean>>({});
  const [isPaying, setIsPaying] = useState(false);
  const address = useAddress();
  const sdk = useSDK();

  const FEE_AMOUNT = "0.1"; // 0.10 POL
  const FEE_RECIPIENT = "0xe99919afd85beBbadAa63B940b090328b6Ad3653";

  const handlePayFee = async (nftAddress: string) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return false;
    }

    if (!sdk) {
      toast.error('SDK not initialized');
      return false;
    }

    setIsPaying(true);
    try {
      const signer = await sdk.getSigner();
      const tx = await signer.sendTransaction({
        to: FEE_RECIPIENT,
        value: ethers.utils.parseEther(FEE_AMOUNT),
      });

      await tx.wait();
      setPaymentStates(prev => ({ ...prev, [nftAddress]: true }));
      toast.success('Payment successful! You can now mint or burn NFTs.');
      return true;
    } catch (error: any) {
      toast.error(`Payment failed: ${error.message}`);
      return false;
    } finally {
      setIsPaying(false);
    }
  };

  const handleMint = async (nft: NFT) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!sdk) {
      toast.error('SDK not initialized');
      return;
    }

    if (!paymentStates[nft.address]) {
      toast.error('Please pay the fee first');
      return;
    }

    setMintingStates(prev => ({ ...prev, [nft.address]: true }));
    
    try {
      const contract = await sdk.getContract(nft.address);
      if (!contract) throw new Error('Failed to load contract');

      const mintPrice = nft.mintPrice ? nft.mintPrice : "0";
      
      await contract.erc721.mint({
        name: `${nft.name} #${Date.now()}`,
        description: nft.description,
        image: nft.imageUrl,
      });

      toast.success(`Successfully minted ${nft.name} NFT!`);
      return true;
    } catch (error: any) {
      toast.error(`Failed to mint: ${error.message}`);
      return false;
    } finally {
      setMintingStates(prev => ({ ...prev, [nft.address]: false }));
    }
  };

  const handleBurn = async (nft: NFT, tokenId: string) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!sdk) {
      toast.error('SDK not initialized');
      return;
    }

    if (!paymentStates[nft.address]) {
      toast.error('Please pay the fee first');
      return;
    }

    if (!tokenId) {
      toast.error('Please enter a token ID to burn');
      return;
    }

    setBurningStates(prev => ({ ...prev, [nft.address]: true }));
    
    try {
      const contract = await sdk.getContract(nft.address);
      if (!contract) throw new Error('Failed to load contract');

      await contract.erc721.burn(tokenId);
      toast.success(`Successfully burned token #${tokenId}`);
      return true;
    } catch (error: any) {
      toast.error(`Failed to burn: ${error.message}`);
      return false;
    } finally {
      setBurningStates(prev => ({ ...prev, [nft.address]: false }));
    }
  };

  const getNFTMetadata = async (nft: NFT): Promise<NFTMetadata[]> => {
    if (!sdk) {
      toast.error('SDK not initialized');
      return [];
    }

    try {
      const contract = await sdk.getContract(nft.address);
      if (!contract) throw new Error('Failed to load contract');

      const nfts = await contract.erc721.getAll();
      return nfts.map(nft => ({
        id: nft.metadata.id || '0',
        uri: nft.metadata.uri || '',
        name: nft.metadata.name || '',
        description: nft.metadata.description || '',
        image: nft.metadata.image || '',
      }));
    } catch (error: any) {
      toast.error(`Failed to load NFTs: ${error.message}`);
      return [];
    }
  };

  return {
    mintingStates,
    burningStates,
    paymentStates,
    isPaying,
    handleMint,
    handleBurn,
    handlePayFee,
    getNFTMetadata,
    FEE_AMOUNT,
  };
};