"use client";

import { useState } from "react";
import { Wallet, X } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { WalletSelector } from "./walletSelector";

export const WalletConnectButton = () => {
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const { connected, connecting, balance } = useWallet();

  const handleConnectWallet = () => {
    setShowWalletSelector(true);
  };

  const handleWalletConnected = () => {
    setShowWalletSelector(false);
  };

  // Só mostra se não estiver conectado
  if (connected) return null;

  return (
    <>
      {/* Botão elegante no canto superior direito */}
      <div className="fixed top-4 right-4 z-30">
        <div className="relative">
          {/* Sombra suave */}
          <div className="absolute inset-0 bg-purple-600/20 rounded-2xl blur-lg scale-105 opacity-60"></div>
          
          <button
            onClick={handleConnectWallet}
            disabled={connecting}
            className={`relative group flex items-center gap-3 px-6 py-4 sm:px-8 sm:py-5 
                      bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600
                      text-white font-bold text-base sm:text-lg rounded-2xl 
                      border border-purple-400/50 shadow-xl shadow-purple-500/25 
                      hover:shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 
                      hover:scale-105 backdrop-blur-sm overflow-hidden min-w-[160px] sm:min-w-[200px]
                      ${connecting ? 'opacity-70 cursor-not-allowed' : 'hover:border-purple-300/70'}
                      font-['Lilita_One'] tracking-wide uppercase`}
          >
            {/* Padrão sutil de fundo */}
            <div className="absolute inset-0 opacity-10"
                 style={{
                   background: `
                     radial-gradient(circle at 30% 40%, rgba(255,255,255,0.1) 1px, transparent 1px),
                     linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.03) 50%, transparent 52%)
                   `,
                   backgroundSize: "30px 30px, 20px 20px"
                 }}></div>
            
            {/* Efeito de brilho elegante */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent 
                           transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                           transition-transform duration-700"></div>
            
            {/* Glow interno suave */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 via-transparent to-purple-400/10 
                           rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <span className="relative z-10 flex items-center gap-3">
              {connecting ? (
                <>
                  <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Wallet className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Connect Wallet</span>
                </>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Wallet Selector Modal */}
      {showWalletSelector && (
        <WalletSelector 
          onClose={() => setShowWalletSelector(false)}
          onConnected={handleWalletConnected}
        />
      )}
    </>
  );
}; 