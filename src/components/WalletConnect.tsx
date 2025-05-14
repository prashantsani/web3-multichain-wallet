// src/components/WalletConnect.tsx
import { useState } from 'react';
import { formatAddress } from '@/utils/formatting';
import useWallet from '@/hooks/useWallet';

export default function WalletConnect() {
  const { account, isConnected, isConnecting, connectWallet, disconnectWallet } = useWallet();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    if (isConnected) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  return (
    <div className="relative">
      {isConnected ? (
        <div className="flex flex-col items-end">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 bg-card rounded-lg px-4 py-2 text-white hover:bg-opacity-80 transition-colors"
          >
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span>{formatAddress(account || '')}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {isDropdownOpen && (
            <div className="absolute right-0 mt-12 w-48 bg-card rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  disconnectWallet();
                  setIsDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700 rounded-lg"
              >
                Disconnect Wallet
              </button>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="flex items-center gap-2 bg-primary rounded-lg px-4 py-2 text-white hover:bg-opacity-80 transition-colors disabled:opacity-50"
        >
          {isConnecting ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 7H7v6h6V7z" />
                <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
              </svg>
              <span>Connect Wallet</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}