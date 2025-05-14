// src/constants/index.ts
import { NetworkConfig } from '@/types';

export const SUPPORTED_NETWORKS: { [key: string]: NetworkConfig } = {
  ethereum: {
    name: 'Ethereum',
    chainId: 1,
    rpcUrl: 'https://eth-mainnet.g.alchemy.com/v2/',
    explorerUrl: 'https://etherscan.io',
    symbol: 'ETH',
    alchemyNetwork: process.env.NEXT_PUBLIC_ETHEREUM_NETWORK || 'eth-mainnet',
    usdcAddress: process.env.NEXT_PUBLIC_USDC_CONTRACT_ETHEREUM || '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
  },
  gnosis: {
    name: 'Gnosis',
    chainId: 100,
    rpcUrl: 'https://rpc.gnosischain.com',
    explorerUrl: 'https://gnosisscan.io',
    symbol: 'xDAI',
    alchemyNetwork: process.env.NEXT_PUBLIC_GNOSIS_NETWORK || 'gnosis-mainnet',
    usdcAddress: process.env.NEXT_PUBLIC_USDC_CONTRACT_GNOSIS || '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83'
  }
};

export const NETWORK_LIST = Object.keys(SUPPORTED_NETWORKS).map(key => ({
  id: key,
  ...SUPPORTED_NETWORKS[key]
}));

export const DEFAULT_NETWORK = 'ethereum';

export const TOKENS = {
  ethereum: [
    { address: 'native', symbol: 'ETH', name: 'Ethereum', decimals: 18 },
    { 
      address: SUPPORTED_NETWORKS.ethereum.usdcAddress, 
      symbol: 'USDC', 
      name: 'USD Coin', 
      decimals: 6 
    }
  ],
  gnosis: [
    { address: 'native', symbol: 'xDAI', name: 'xDAI', decimals: 18 },
    { 
      address: SUPPORTED_NETWORKS.gnosis.usdcAddress, 
      symbol: 'USDC', 
      name: 'USD Coin', 
      decimals: 6 
    }
  ]
};