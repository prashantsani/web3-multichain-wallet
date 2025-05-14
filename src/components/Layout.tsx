import React from 'react';
import WalletConnect from './WalletConnect';
import NetworkSelector from './NetworkSelector';

interface LayoutProps {
  children: React.ReactNode;
  selectedNetwork: string;
  onNetworkChange: (network: string) => void;
}

export default function Layout({ children, selectedNetwork, onNetworkChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-white">
      <header className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-white">Multi-Chain Wallet</h1>
        </div>
        <div className="flex items-center gap-4">
          <NetworkSelector 
            selectedNetwork={selectedNetwork} 
            onNetworkChange={onNetworkChange} 
          />
          <WalletConnect />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="p-6 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Multi-Chain Wallet. Built with Next.js and Alchemy.</p>
      </footer>
    </div>
  );
}