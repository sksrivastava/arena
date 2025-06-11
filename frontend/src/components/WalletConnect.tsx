'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWeb3 } from '@/contexts/Web3Context';
import { useState, useEffect } from 'react';

const formatAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const WalletConnect = () => {
  const { 
    isAuthenticated, 
    isAuthenticating, 
    authenticate, 
    error, 
    isConnected,
    walletAddress 
  } = useWeb3();

  const [showAuthSuccess, setShowAuthSuccess] = useState(false);

  // Show success message briefly after authentication
  useEffect(() => {
    if (isAuthenticated && !isAuthenticating) {
      setShowAuthSuccess(true);
      const timer = setTimeout(() => {
        setShowAuthSuccess(false);
      }, 3000); // Hide after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, isAuthenticating]);

  return (
    <div className="space-y-4">
      {/* Custom styled RainbowKit Connect Button */}
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                    >
                      Connect Wallet
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                    >
                      Wrong network
                    </button>
                  );
                }

                return (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="flex items-center space-x-1 bg-muted hover:bg-muted/80 px-3 py-2 rounded-lg transition-colors text-sm"
                    >
                      {chain.hasIcon && (
                        <div
                          style={{
                            background: chain.iconBackground,
                            width: 16,
                            height: 16,
                            borderRadius: 999,
                            overflow: 'hidden',
                            marginRight: 4,
                          }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              style={{ width: 16, height: 16 }}
                            />
                          )}
                        </div>
                      )}
                      <span className="text-muted-foreground">{chain.name}</span>
                    </button>

                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="bg-muted hover:bg-muted/80 px-3 py-2 rounded-lg transition-colors text-sm text-muted-foreground"
                    >
                      {formatAddress(account.address)}
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
      
      {/* Authentication Status */}
      {isConnected && (
        <div className="space-y-3">
          {!isAuthenticated && (
            <button
              onClick={authenticate}
              disabled={isAuthenticating}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              {isAuthenticating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Sign to Authenticate'
              )}
            </button>
          )}
          
          {showAuthSuccess && (
            <div className="flex items-center space-x-2 text-green-500 text-sm font-medium bg-green-500/10 border border-green-500/20 px-3 py-2 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Authenticated Successfully!</span>
            </div>
          )}
          
          {error && (
            <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 