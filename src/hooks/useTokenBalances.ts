// src/hooks/useTokenBalances.ts
import { useState, useEffect, useCallback } from 'react';
import { getNativeBalance, getTokenBalance, getTransactions } from '@/utils/alchemy';
import { TokenBalance, Transaction } from '@/types';
import { TOKENS } from '@/constants';

interface UseTokenBalancesReturn {
  balances: TokenBalance[];
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchBalances: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
}

export default function useTokenBalances(
  address: string | null,
  network: string
): UseTokenBalancesReturn {
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch token balances
  const fetchBalances = useCallback(async () => {
    if (!address) {
      setBalances([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const networkTokens = TOKENS[network as keyof typeof TOKENS] || [];
      const balancePromises = networkTokens.map(async (token) => {
        if (token.address === 'native') {
          return getNativeBalance(address, network);
        } else {
          return getTokenBalance(address, token.address, network);
        }
      });

      const results = await Promise.all(balancePromises);
      const validBalances = results.filter((balance): balance is TokenBalance => balance !== null);
      setBalances(validBalances);
    } catch (err: any) {
      console.error("Error fetching balances:", err);
      setError(err.message || 'Error fetching token balances');
    } finally {
      setIsLoading(false);
    }
  }, [address, network]);

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    if (!address) {
      setTransactions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const txs = await getTransactions(address, network);
      setTransactions(txs);
    } catch (err: any) {
      console.error("Error fetching transactions:", err);
      setError(err.message || 'Error fetching transactions');
    } finally {
      setIsLoading(false);
    }
  }, [address, network]);

  // Fetch data on mount and when address or network changes
  useEffect(() => {
    if (address) {
      fetchBalances();
      fetchTransactions();
    }
  }, [address, network, fetchBalances, fetchTransactions]);

  return {
    balances,
    transactions,
    isLoading,
    error,
    fetchBalances,
    fetchTransactions
  };
}