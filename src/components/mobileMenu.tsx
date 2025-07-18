import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import { useWalletBalance } from './WalletBalance';
import { canChat } from "@/features/constants/ivaResponses";
import { TokenLogo } from "./tokenLogo";

interface MobileMenuProps {
  appUnlocked?: boolean;
}

export const MobileMenu = ({ appUnlocked = true }: MobileMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { connected, publicKey } = useWallet();
  const balance = useWalletBalance();

  // Só mostra se app desbloqueado
  if (!appUnlocked) return null;

  const canAccessIva = canChat(balance);

  return (
    <>
      {/* Hamburger Button - SÓ MOBILE */}
      <div className="fixed top-4 left-4 z-50 block md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 bg-purple-600 hover:bg-purple-700 rounded-lg shadow-lg flex flex-col justify-center items-center space-y-1 transition-all duration-200"
          aria-label="Menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-200 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-opacity duration-200 ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-transform duration-200 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
        </button>
      </div>

      {/* Menu Lateral - SÓ MOBILE */}
      {isOpen && (
        <div className="fixed inset-0 z-40 block md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-0 left-0 w-80 max-w-[90vw] h-full bg-slate-900 shadow-2xl overflow-y-auto">
            <div className="p-6 pt-20">
              {/* Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">IVA</h2>
                <p className="text-purple-300 text-sm">Wallet & Token Status</p>
              </div>

              {/* Wallet Section */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-purple-500/30 pb-2">
                  WALLET
                </h3>
                
                {!connected ? (
                  <WalletMultiButton className="!w-full !bg-purple-600 hover:!bg-purple-700 !text-white !border-0 !rounded-lg !px-4 !py-3 !font-semibold" />
                ) : (
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-300">Connected</span>
                      <WalletDisconnectButton className="!bg-red-500 hover:!bg-red-600 !text-white !border-0 !rounded !px-3 !py-1 !text-xs" />
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-white font-mono bg-gray-700 px-3 py-2 rounded inline-block">
                        {publicKey?.toString().slice(0, 6)}...{publicKey?.toString().slice(-6)}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Balance Section */}
              {connected && (
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-white mb-4 border-b border-purple-500/30 pb-2">
                    BALANCE
                  </h3>
                  
                  <div className="bg-purple-900/30 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-purple-300">Your Tokens</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">{balance.toFixed(2)}</span>
                        <TokenLogo />
                        <span className="text-sm text-purple-300">$IVA</span>
                      </div>
                    </div>
                  </div>

                  {/* Access Status */}
                  <div className={`rounded-lg p-4 border ${
                    canAccessIva 
                      ? 'bg-green-900/30 border-green-500/50' 
                      : balance > 0 
                      ? 'bg-orange-900/30 border-orange-500/50'
                      : 'bg-red-900/30 border-red-500/50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        canAccessIva ? 'bg-green-500' : balance > 0 ? 'bg-orange-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <div className={`font-bold ${
                          canAccessIva ? 'text-green-300' : balance > 0 ? 'text-orange-300' : 'text-red-300'
                        }`}>
                          {canAccessIva ? 'Full Access' : balance > 0 ? 'Limited Access' : 'No Access'}
                        </div>
                        <div className="text-sm text-gray-400">
                          {canAccessIva 
                            ? 'You can chat normally with Iva'
                            : balance > 0 
                            ? 'Iva may limit responses'
                            : 'Need tokens to chat with Iva'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 