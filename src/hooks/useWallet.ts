import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { SUPPORTED_NETWORKS } from '@/constants';

interface UseWalletReturn {
  account: string | null;
  chainId: number | null;
  provider: ethers.providers.Web3Provider | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (networkName: string) => Promise<boolean>;
}

export default function useWallet(): UseWalletReturn {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Check if connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          // Check if already connected
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            const network = await provider.getNetwork();
            setAccount(accounts[0]);
            setChainId(network.chainId);
            setProvider(provider);
          }
        } catch (error) {
          console.error("Error checking wallet connection:", error);
        }
      }
    };
    
    checkConnection();
  }, []);

  // Handle account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected
          setAccount(null);
        } else {
          // Account changed
          setAccount(accounts[0]);
        }
      };

      const handleChainChanged = (chainIdHex: string) => {
        const newChainId = parseInt(chainIdHex, 16);
        setChainId(newChainId);
        
        // Refresh provider
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(newProvider);
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum === 'undefined') {
      alert('MetaMask is not installed!');
      return;
    }

    setIsConnecting(true);
    
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      
      const signer = provider.getSigner();
      const account = await signer.getAddress();
      const network = await provider.getNetwork();
      
      setAccount(account);
      setChainId(network.chainId);
      setProvider(provider);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Disconnect wallet (note: this only clears local state, as MetaMask doesn't have a disconnect method)
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setChainId(null);
    setProvider(null);
  }, []);

  // Switch network
  const switchNetwork = useCallback(async (networkName: string): Promise<boolean> => {
    if (!provider || !account) return false;
    
    const targetNetwork = SUPPORTED_NETWORKS[networkName];
    if (!targetNetwork) return false;
    
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetNetwork.chainId.toString(16)}` }],
      });
      
      return true;
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${targetNetwork.chainId.toString(16)}`,
                chainName: targetNetwork.name,
                rpcUrls: [targetNetwork.rpcUrl],
                blockExplorerUrls: [targetNetwork.explorerUrl],
                nativeCurrency: {
                  name: targetNetwork.symbol,
                  symbol: targetNetwork.symbol,
                  decimals: 18
                }
              },
            ],
          });
          return true;
        } catch (addError) {
          console.error("Error adding network:", addError);
          return false;
        }
      }
      console.error("Error switching network:", switchError);
      return false;
    }
  }, [provider, account]);

  return {
    account,
    chainId,
    provider,
    isConnected: !!account,
    isConnecting,
    connectWallet,
    disconnectWallet,
    switchNetwork
  };
}