import { TokenBalance } from '@/types';
import { formatBalance } from '@/utils/formatting';

interface BalanceDisplayProps {
  balances: TokenBalance[];
  isLoading: boolean;
}

export default function BalanceDisplay({ balances, isLoading }: BalanceDisplayProps) {
  if (isLoading) {
    return (
      <div className="bg-card rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-white">Token Balances</h2>
        <div className="animate-pulse flex flex-col gap-4">
          <div className="h-10 bg-gray-700 rounded"></div>
          <div className="h-10 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-white">Token Balances</h2>
      
      {balances.length === 0 ? (
        <div className="text-center py-4 text-gray-400">
          No token balances found
        </div>
      ) : (
        <div className="space-y-4">
          {balances.map((balance) => (
            <div 
              key={balance.token} 
              className="flex justify-between items-center p-3 bg-background rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {balance.symbol.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-white">{balance.symbol}</div>
                </div>
              </div>
              <div className="text-white font-medium">
                {formatBalance(balance.formattedBalance)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}