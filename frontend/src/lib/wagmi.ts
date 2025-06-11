import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, sepolia } from 'wagmi/chains';
import { http } from 'wagmi';

// Create a more stable configuration
export const config = getDefaultConfig({
  appName: 'Decentralized Social Media',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'ca4b5a2da050854b39f3fb4bdc848c53', // Temporary public test ID
  chains: [sepolia, mainnet], // Put testnet first for easier testing
  transports: {
    [sepolia.id]: http('https://rpc.sepolia.org'),
    [mainnet.id]: http('https://cloudflare-eth.com'),
  },
  ssr: true,
}); 