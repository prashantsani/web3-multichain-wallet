export interface TokenBalance {
  token: string;
  symbol: string;
  balance: string;
  formattedBalance: string;
  decimals: number;
}

export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  timestamp: number;
  asset: string;
  formattedValue: string;
  type: 'incoming' | 'outgoing';
  status: 'success' | 'failed' | 'pending';
  blockNumber: number;
}

export type Network = 'ethereum' | 'gnosis';

export interface NetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  symbol: string;
  alchemyNetwork: string;
  usdcAddress: string;
}