'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useDisconnect, useSignMessage } from 'wagmi';

interface Web3ContextType {
  walletAddress: string;
  isConnected: boolean;
  isConnecting: boolean;
  disconnectWallet: () => void;
  signMessage: (message: string) => Promise<string>;
  error: string | null;
  isAuthenticating: boolean;
  isAuthenticated: boolean;
  authenticate: () => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

interface Web3ProviderProps {
  children: React.ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const { address, isConnecting, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { signMessageAsync } = useSignMessage();
  
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const walletAddress = address || '';

  // Reset authentication when wallet disconnects
  useEffect(() => {
    if (!isConnected || !address) {
      setIsAuthenticated(false);
      setError(null);
    }
  }, [isConnected, address]);

  // Add error boundary for subscription issues
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      console.error('Wallet connection error:', error);
      if (error.message?.includes('subscribe') || error.message?.includes('connection')) {
        setError('Wallet connection issue. Please try reconnecting.');
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const authenticateWithSignature = async (address: string): Promise<boolean> => {
    try {
      // Get nonce from backend
      const nonceResponse = await fetch('http://localhost:3000/auth/nonce', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress: address }),
      });

      if (!nonceResponse.ok) {
        const errorText = await nonceResponse.text();
        console.error('Nonce request failed:', errorText);
        throw new Error('Failed to get authentication nonce');
      }

      const { nonce } = await nonceResponse.json();
      
      // Create message to sign
      const message = `Sign this message to authenticate with Arena Social Media.\n\nNonce: ${nonce}`;
      
      // Request signature using wagmi
      const signature = await signMessageAsync({ message });

      // Verify signature with backend
      const verifyPayload = {
        walletAddress: address,
        signature,
        message,
      };

      const verifyResponse = await fetch('http://localhost:3000/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verifyPayload),
      });

      if (!verifyResponse.ok) {
        const errorText = await verifyResponse.text();
        console.error('Verify request failed:', errorText);
        throw new Error(`Authentication failed: ${verifyResponse.status} - ${errorText}`);
      }

      const verifyResult = await verifyResponse.json();
      
      // Backend returns { success: true } not { authenticated: true }
      return verifyResult.success === true;
      
    } catch (error) {
      console.error('Error during authentication:', error);
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      throw new Error(errorMessage);
    }
  };

  const authenticate = async () => {
    if (!address || !isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setIsAuthenticating(true);
    setError(null);

    try {
      const authenticated = await authenticateWithSignature(address);
      
      if (authenticated) {
        setIsAuthenticated(true);
      } else {
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      setError(errorMessage);
      setIsAuthenticated(false);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const disconnectWallet = () => {
    disconnect();
    setIsAuthenticated(false);
    setError(null);
  };

  const signMessage = async (message: string): Promise<string> => {
    try {
      const signature = await signMessageAsync({ message });
      return signature;
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  };

  const value: Web3ContextType = {
    walletAddress,
    isConnected,
    isConnecting,
    disconnectWallet,
    signMessage,
    error,
    isAuthenticating,
    isAuthenticated,
    authenticate,
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
}; 