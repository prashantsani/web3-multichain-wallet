import { Alchemy, Network } from 'alchemy-sdk';
import { ethers } from 'ethers';
import { SUPPORTED_NETWORKS } from '@/constants';
import { TokenBalance, Transaction } from '@/types';

// ERC20 ABI for token balance
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

// Initialize Alchemy clients
const alchemyClients: Record<string, Alchemy> = {
  ethereum: new Alchemy({
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_ETHEREUM,
    network: SUPPORTED_NETWORKS.ethereum.alchemyNetwork as Network
  }),
  gnosis: new Alchemy({
    apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_GNOSIS,
    network: SUPPORTED_NETWORKS.gnosis.alchemyNetwork as Network
  })
};

// Get native token balance
export const getNativeBalance = async (address: string, network: string): Promise<TokenBalance | null> => {
  try {
    const client = alchemyClients[network];
    if (!client) return null;

    const balanceHex = await client.core.getBalance(address);
    const balance = ethers.utils.formatEther(balanceHex);
    
    return {
      token: 'native',
      symbol: SUPPORTED_NETWORKS[network].symbol,
      balance: balanceHex.toString(),
      formattedBalance: balance,
      decimals: 18
    };
  } catch (error) {
    console.error(`Error fetching native balance for ${network}:`, error);
    return null;
  }
};

// Get ERC20 token balance
export const getTokenBalance = async (address: string, tokenAddress: string, network: string): Promise<TokenBalance | null> => {
  try {
    const client = alchemyClients[network];
    if (!client) return null;
    
    // Create a provider
    const provider = await client.config.getProvider();
    
    // Create a contract instance
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    
    // Get balance and token info
    const balanceHex = await tokenContract.balanceOf(address);
    const decimals = await tokenContract.decimals();
    const symbol = await tokenContract.symbol();
    
    const balance = ethers.utils.formatUnits(balanceHex, decimals);
    
    return {
      token: tokenAddress,
      symbol,
      balance: balanceHex.toString(),
      formattedBalance: balance,
      decimals
    };
  } catch (error) {
    console.error(`Error fetching token balance for ${tokenAddress} on ${network}:`, error);
    return null;
  }
};

// Get transactions for an address
export const getTransactions = async (address: string, network: string): Promise<Transaction[]> => {
  try {
    const client = alchemyClients[network];
    if (!client) return [];
    
    // Get both incoming and outgoing transactions
    const [outgoing, incoming] = await Promise.all([
      client.core.getAssetTransfers({
        fromAddress: address,
        category: ["external", "erc20"],
        maxCount: 10
      }),
      client.core.getAssetTransfers({
        toAddress: address,
        category: ["external", "erc20"],
        maxCount: 10
      })
    ]);
    
    // Combine and sort transactions
    const allTransfers = [...outgoing.transfers, ...incoming.transfers]
      .sort((a, b) => {
        const timeA = a.metadata?.blockTimestamp ? new Date(a.metadata.blockTimestamp).getTime() : 0;
        const timeB = b.metadata?.blockTimestamp ? new Date(b.metadata.blockTimestamp).getTime() : 0;
        return timeB - timeA;
      })
      .slice(0, 10); // Keep only the 10 most recent transactions
    
    const transactions = allTransfers.map(tx => {
      const value = tx.value?.toString() || '0';
      const decimals = tx.asset === SUPPORTED_NETWORKS[network].symbol ? 18 : 6;
      const isIncoming = tx.to?.toLowerCase() === address.toLowerCase();
      
      return {
        hash: tx.hash,
        from: tx.from,
        to: tx.to || '',
        value: value,
        timestamp: tx.metadata?.blockTimestamp ? new Date(tx.metadata.blockTimestamp).getTime() : Date.now(),
        asset: tx.asset || SUPPORTED_NETWORKS[network].symbol,
        formattedValue: ethers.utils.formatUnits(tx.rawContract?.value || value, decimals),
        type: isIncoming ? 'incoming' : 'outgoing',
        status: 'success', // You could fetch transaction receipt to get actual status
        blockNumber: tx.metadata?.blockNum || 0
      };
    });
    
    return transactions;
  } catch (error) {
    console.error(`Error fetching transactions for ${network}:`, error);
    // Add more specific error handling
    if (error instanceof Error) {
      if (error.message.includes('rate limit')) {
        throw new Error('Rate limit exceeded. Please try again in a few minutes.');
      }
      if (error.message.includes('network')) {
        throw new Error('Network error. Please check your connection.');
      }
    }
    throw new Error('Failed to fetch transactions. Please try again.');
  }
};