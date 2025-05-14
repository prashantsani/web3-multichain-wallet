// src/utils/formatting.ts

/**
 * Format an address for display by truncating the middle
 */
export const formatAddress = (address: string): string => {
  if (!address) return '';
  if (address.length <= 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * Format a balance with a specific number of decimal places
 */
export const formatBalance = (balance: string, decimals: number = 4): string => {
  const floatBalance = parseFloat(balance);
  if (isNaN(floatBalance)) return '0';
  
  // Format with comma separators and fixed decimals
  return floatBalance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals
  });
};

/**
 * Format a timestamp to a readable date
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

/**
 * Create a link to the appropriate block explorer for a transaction
 */
export const getExplorerLink = (txHash: string, network: string, explorerUrl: string): string => {
  return `${explorerUrl}/tx/${txHash}`;
};