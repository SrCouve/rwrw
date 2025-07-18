import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletBalance } from './WalletBalance';
import { canChat } from "@/features/constants/ivaResponses";
import { TokenLogo } from "./tokenLogo";

export const WalletInfo = () => {
  const { connected, publicKey } = useWallet();
  const balance = useWalletBalance();

  // Se conectado, o IvaStatus já mostra as informações, então não precisamos mostrar este componente
  if (connected) return null;

  return (
    <div className="fixed top-4 right-4 z-20 hidden md:block">
      <div className="relative">
        <div className="absolute inset-0 bg-purple-600/20 rounded-2xl blur-lg scale-105 opacity-60"></div>
        <div className="relative bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-md rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-900/20 p-4">
          <div className="flex items-center gap-3">
            <span className="text-white font-semibold font-['M_PLUS_2'] text-sm">
              Wallet Not Connected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}; 