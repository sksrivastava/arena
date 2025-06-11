# RainbowKit + ethers.js Authentication Setup

This project uses RainbowKit and Wagmi for Ethereum wallet authentication as the sole identity provider.

## Setup Instructions

### 1. Get a WalletConnect Project ID

1. Visit [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy your Project ID
4. Add it to your environment variables:

```bash
# In your .env.local file
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### 2. Dependencies Installed

The following packages have been installed:

- `@rainbow-me/rainbowkit` - UI components and wallet connection
- `wagmi` - React hooks for Ethereum
- `viem` - TypeScript interface for Ethereum
- `@tanstack/react-query` - Data fetching library required by Wagmi

### 3. Architecture

#### Components:
- **Providers** (`src/components/Providers.tsx`) - Wraps the app with RainbowKit and Wagmi providers
- **WalletConnect** (`src/components/WalletConnect.tsx`) - Uses RainbowKit's ConnectButton with custom authentication flow
- **Web3Context** (`src/contexts/Web3Context.tsx`) - Manages authentication state using Wagmi hooks

#### Features:
- **Wallet Connection**: Multiple wallet support through RainbowKit
- **Multi-Chain Support**: Mainnet, Polygon, Optimism, Arbitrum, Base, and Sepolia
- **Authentication Flow**: After wallet connection, users must sign a message to authenticate
- **State Management**: Clean separation between wallet connection and app authentication

### 4. Authentication Flow

1. User clicks "Connect Wallet" (RainbowKit button)
2. User selects and connects their preferred wallet
3. After connection, user must click "Sign Message to Authenticate"
4. User signs a message with their wallet
5. Backend verifies the signature
6. User gains access to protected features

### 5. Usage in Components

```tsx
import { useWeb3 } from '@/contexts/Web3Context';
import { WalletConnect } from '@/components/WalletConnect';

function MyComponent() {
  const { 
    walletAddress, 
    isConnected, 
    isAuthenticated, 
    authenticate 
  } = useWeb3();

  return (
    <div>
      <WalletConnect />
      {isAuthenticated && <p>Welcome {walletAddress}!</p>}
    </div>
  );
}
```

### 6. Environment Variables

Create a `.env.local` file with:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### 7. Testing

The app will work with a temporary project ID for testing, but you should get a proper one from WalletConnect Cloud for production use. 