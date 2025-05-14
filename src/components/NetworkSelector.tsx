import { useState } from 'react';
import { NETWORK_LIST } from '@/constants';
import useWallet from '@/hooks/useWallet';

interface NetworkSelectorProps {
  selectedNetwork: string;
  onNetworkChange: (network: string) => void;
}

export default function NetworkSelector({ selectedNetwork, onNetworkChange }: NetworkSelectorProps) {
  const { isConnected, switchNetwork } = useWallet();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleNetworkSelect = async (networkId: string) => {
    if (isConnected) {
      const success = await switchNetwork(networkId);
      if (success) {
        onNetworkChange(networkId);
      }
    } else {
      // If not connected to wallet, just update the UI
      onNetworkChange(networkId);
    }
    setIsDropdownOpen(false);
  };

  const selectedNetworkData = NETWORK_LIST.find(network => network.id === selectedNetwork);

  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center gap-2 bg-card rounded-lg px-4 py-2 text-white hover:bg-opacity-80 transition-colors"
      >
        <span>{selectedNetworkData?.name || 'Select Network'}</span>
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
        <div className="absolute mt-2 w-48 bg-card rounded-lg shadow-lg z-10">
          {NETWORK_LIST.map((network) => (
            <button
              key={network.id}
              onClick={() => handleNetworkSelect(network.id)}
              className={`block w-full text-left px-4 py-2 hover:bg-gray-700 rounded-lg ${
                selectedNetwork === network.id ? 'bg-primary bg-opacity-20 text-white' : 'text-gray-200'
              }`}
            >
              {network.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}