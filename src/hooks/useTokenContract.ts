import { useAddress, useSDK } from '@thirdweb-dev/react';
import { useState } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';
import { Token } from '../types/token';

export const useTokenContract = () => {
  const [mintingStates, setMintingStates] = useState<Record<string, boolean>>({});
  const [burningStates, setBurningStates] = useState<Record<string, boolean>>({});
  const [paymentStates, setPaymentStates] = useState<Record<string, boolean>>({});
  const [isPaying, setIsPaying] = useState(false);
  const address = useAddress();
  const sdk = useSDK();

  const FEE_AMOUNT = "0.1"; // 0.10 POL
  const FEE_RECIPIENT = "0xe99919afd85beBbadAa63B940b090328b6Ad3653";

  const handlePayFee = async (tokenAddress: string) => {
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
      setPaymentStates(prev => ({ ...prev, [tokenAddress]: true }));
      toast.success('Payment successful! You can now mint or burn tokens.');
      return true;
    } catch (error: any) {
      toast.error(`Payment failed: ${error.message}`);
      return false;
    } finally {
      setIsPaying(false);
    }
  };

  const handleMint = async (token: Token, amount: string) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!sdk) {
      toast.error('SDK not initialized');
      return;
    }

    if (!paymentStates[token.address]) {
      toast.error('Please pay the fee first');
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setMintingStates(prev => ({ ...prev, [token.address]: true }));
    
    try {
      const contract = await sdk.getContract(token.address);
      if (!contract) throw new Error('Failed to load contract');

      await contract.erc20.mint(amount);
      toast.success(`Successfully minted ${amount} ${token.symbol} tokens!`);
      return true;
    } catch (error: any) {
      toast.error(`Failed to mint: ${error.message}`);
      return false;
    } finally {
      setMintingStates(prev => ({ ...prev, [token.address]: false }));
    }
  };

  const handleBurn = async (token: Token, amount: string) => {
    if (!address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!sdk) {
      toast.error('SDK not initialized');
      return;
    }

    if (!paymentStates[token.address]) {
      toast.error('Please pay the fee first');
      return;
    }

    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setBurningStates(prev => ({ ...prev, [token.address]: true }));
    
    try {
      const contract = await sdk.getContract(token.address);
      if (!contract) throw new Error('Failed to load contract');

      await contract.erc20.burn(amount);
      toast.success(`Successfully burned ${amount} ${token.symbol} tokens!`);
      return true;
    } catch (error: any) {
      toast.error(`Failed to burn: ${error.message}`);
      return false;
    } finally {
      setBurningStates(prev => ({ ...prev, [token.address]: false }));
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
    FEE_AMOUNT,
  };
};