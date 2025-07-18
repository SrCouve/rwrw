import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import { useWalletBalance } from './WalletBalance';
import { canChat } from "@/features/constants/ivaResponses";
import { TokenLogo } from "./tokenLogo";

interface IvaStatusProps {
  appUnlocked?: boolean;
}

export const IvaStatus = ({ appUnlocked = true }: IvaStatusProps) => {
  const { connected, publicKey } = useWallet();
  const balance = useWalletBalance();

  // Só mostra se conectado e app desbloqueado
  if (!connected || !appUnlocked) return null;

  const canAccessIva = canChat(balance);

  return (
    <div className="fixed top-3 right-3 sm:top-6 sm:right-6 z-30 max-w-[360px] w-[calc(100vw-24px)] sm:w-auto hidden md:block">
      <div className="relative group">
        {/* Animated glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-pink-500/30 to-purple-600/30 rounded-3xl blur-xl animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-transparent to-pink-400/20 rounded-3xl blur-lg group-hover:blur-xl transition-all duration-500"></div>
        
        {/* Main card */}
        <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-3xl border border-purple-500/30 shadow-2xl shadow-purple-900/20 overflow-hidden">
          {/* Header gradient */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
          
          {/* Content */}
          <div className="p-4 sm:p-6 space-y-4">
            {/* Wallet info section */}
            <div className="mb-4 p-4 bg-gradient-to-r from-slate-50/80 to-gray-100/80 backdrop-blur-sm rounded-2xl border border-gray-200/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700 font-['M_PLUS_2'] tracking-wide">WALLET</span>
                <WalletDisconnectButton className="!bg-red-500 hover:!bg-red-600 !text-white !border-0 !rounded-lg !px-3 !py-1 !text-xs !font-semibold" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-800 font-mono font-bold bg-gray-100 px-3 py-1 rounded-lg">
                  {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
                </span>
              </div>
            </div>

            {/* Token balance section */}
            <div className="mb-5 p-4 bg-gradient-to-r from-purple-50/90 to-pink-50/90 backdrop-blur-sm rounded-2xl border border-purple-200/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-purple-700 font-['M_PLUS_2'] tracking-wide">BALANCE</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-purple-600 font-mono">
                    {balance.toFixed(2)}
                  </span>
                  <TokenLogo />
                  <span className="text-lg font-bold text-purple-600 font-['Lilita_One']">$IVA</span>
                </div>
              </div>
            </div>

            {/* Access status section */}
            <div className={`p-4 rounded-2xl border-2 transition-all duration-500 ${
              canAccessIva 
                ? 'bg-gradient-to-r from-green-50/90 to-emerald-50/90 border-green-300/50 shadow-lg shadow-green-500/20' 
                : balance > 0 
                ? 'bg-gradient-to-r from-orange-50/90 to-amber-50/90 border-orange-300/50 shadow-lg shadow-orange-500/20'
                : 'bg-gradient-to-r from-red-50/90 to-rose-50/90 border-red-300/50 shadow-lg shadow-red-500/20'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-4 h-4 rounded-full animate-pulse ${
                  canAccessIva ? 'bg-green-500' : balance > 0 ? 'bg-orange-500' : 'bg-red-500'
                }`}></div>
                <div className="flex-1">
                  <div className={`text-lg font-bold font-['Lilita_One'] tracking-wide ${
                    canAccessIva ? 'text-green-700' : balance > 0 ? 'text-orange-700' : 'text-red-700'
                  }`}>
                    {canAccessIva ? 'FULL ACCESS' : balance > 0 ? 'LIMITED ACCESS' : 'NO ACCESS'}
                  </div>
                  <div className="text-sm text-gray-600 mt-2 font-['M_PLUS_2'] leading-relaxed">
                    {canAccessIva 
                      ? 'You have full access to chat with Iva. She will respond normally to your messages.'
                      : balance > 0 
                      ? 'You have some tokens but not enough for full access. Iva might mock or limit responses.'
                      : 'You need $IVA tokens to chat with Iva. Connect a wallet with tokens to start chatting.'
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 