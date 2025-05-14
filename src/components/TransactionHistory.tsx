import { Transaction } from '@/types';
import { formatAddress, formatDate, getExplorerLink } from '@/utils/formatting';
import { SUPPORTED_NETWORKS } from '@/constants';

interface TransactionHistoryProps {
  transactions: Transaction[];
  isLoading: boolean;
  network: string;
}

export default function TransactionHistory({ transactions, isLoading, network }: TransactionHistoryProps) {
  const explorerUrl = SUPPORTED_NETWORKS[network]?.explorerUrl || '';

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-white">Transaction History</h2>
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-20 bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Transaction History</h2>
      
      {transactions.length === 0 ? (
        <div className="text-center py-4 text-gray-400">
          No transactions found
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((tx) => (
            <div 
              key={tx.hash} 
              className="p-4 bg-background rounded-lg"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-secondary bg-opacity-20 text-secondary text-sm px-2 py-1 rounded-full">
                    {tx.asset}
                  </span>
                  <span className="text-white font-medium">
                    {tx.formattedValue}
                  </span>
                </div>
                <a 
                  href={getExplorerLink(tx.hash, network, explorerUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline text-sm"
                >
                  View
                </a>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                <div>
                  <span className="block">From</span>
                  <span className="text-white">{formatAddress(tx.from)}</span>
                </div>
                <div>
                  <span className="block">To</span>
                  <span className="text-white">{formatAddress(tx.to)}</span>
                </div>
                <div className="col-span-2 mt-1">
                  <span className="block">Date</span>
                  <span className="text-white">{formatDate(tx.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}