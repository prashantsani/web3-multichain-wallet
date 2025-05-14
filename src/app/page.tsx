'use client';

import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Layout from '@/components/Layout';
import BalanceDisplay from '@/components/BalanceDisplay';
import TransactionHistory from '@/components/TransactionHistory';
import useWallet from '@/hooks/useWallet';
import useTokenBalances from '@/hooks/useTokenBalances';
import { DEFAULT_NETWORK } from '@/constants';

export default function Home() {
  const [selectedNetwork, setSelectedNetwork] = useState<string>(DEFAULT_NETWORK);
  const { account, isConnected } = useWallet();
  const { balances, transactions, isLoading, error } = useTokenBalances(account, selectedNetwork);

  // Handle network change
  const handleNetworkChange = (network: string) => {
    setSelectedNetwork(network);
  };

  // Show errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <>
      <Layout 
        selectedNetwork={selectedNetwork} 
        onNetworkChange={handleNetworkChange}
      >
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-card flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v-1l1-1 1-1 .257-.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
            <p className="text-center text-gray-400 max-w-md mb-6">
              Connect your wallet to view your token balances and transaction history on Ethereum and Gnosis networks.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <BalanceDisplay 
                balances={balances} 
                isLoading={isLoading} 
              />
            </div>
            <div>
              <TransactionHistory 
                transactions={transactions}
                isLoading={isLoading}
                network={selectedNetwork}
              />
            </div>
          </div>
        )}
      </Layout>
      <ToastContainer position="bottom-right" theme="dark" />
    </>
  );
}