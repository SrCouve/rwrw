"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Wallet } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { WalletSelector } from "./walletSelector";
import { TokenLogo } from "./tokenLogo";
import { buildUrl } from "@/utils/buildUrl";

type Props = {
  onStart?: () => void;
};

export const Introduction = ({ onStart }: Props) => {
  const [opened, setOpened] = useState(true);
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const { connected, connecting, balance, disconnect } = useWallet();

  const handleStartClick = () => {
    // Sempre permite entrar no app, independente da carteira
    setOpened(false);
    onStart?.();
  };

  const handleConnectWallet = () => {
    setShowWalletSelector(true);
  };

  const handleWalletConnected = () => {
    setShowWalletSelector(false);
  };

  return opened ? (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden"
         style={{ 
           backgroundImage: `url(${buildUrl("/bg-c.png")})`,
           backgroundSize: "cover",
           backgroundPosition: "center",
           backgroundRepeat: "no-repeat"
         }}>
      
      {/* Stars Background */}
      <div className="absolute inset-0 opacity-60 animate-pulse"
           style={{
             background: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 1px, transparent 1px), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 1px, transparent 1px), radial-gradient(circle at 40% 40%, rgba(255,255,255,0.1) 1px, transparent 1px)",
             backgroundSize: "200px 200px, 150px 150px, 100px 100px"
           }}></div>

      {/* Moon Background */}
      <div className="absolute -top-20 -right-20 w-60 h-60 sm:w-80 sm:h-80 rounded-full opacity-30 blur-sm"
           style={{
             background: "radial-gradient(circle, rgba(179, 54, 251, 0.4) 0%, rgba(179, 54, 251, 0.1) 40%, transparent 70%)"
           }}></div>

      {/* IVA Logo - Simples e direto */}
      <div className="absolute top-0 left-1/2 z-50" style={{ transform: 'translateX(-50%) translateY(-50%)' }}>
        <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 rounded-full w-48 h-48 border-4 border-purple-300/60 shadow-2xl shadow-purple-500/80 flex items-center justify-center">
          <span className="text-white font-bold text-5xl font-['Lilita_One'] drop-shadow-lg">IVA</span>
        </div>
      </div>
      
      <div className="relative w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 
                      backdrop-blur-md rounded-3xl border-2 border-purple-500/60 
                      shadow-2xl shadow-purple-500/50 overflow-visible"
           style={{
             background: "linear-gradient(135deg, rgba(30, 20, 50, 0.95) 0%, rgba(20, 15, 35, 0.98) 100%)"
           }}>
        
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-30"
               style={{
                 background: `
                   radial-gradient(circle at 10% 10%, rgba(179, 54, 251, 0.2) 0%, transparent 50%),
                   radial-gradient(circle at 90% 90%, rgba(179, 54, 251, 0.2) 0%, transparent 50%),
                   linear-gradient(45deg, transparent 45%, rgba(179, 54, 251, 0.1) 50%, transparent 55%),
                   linear-gradient(-45deg, transparent 45%, rgba(179, 54, 251, 0.1) 50%, transparent 55%)
                 `,
                 backgroundSize: "100px 100px, 100px 100px, 20px 20px, 20px 20px"
               }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 pt-24 sm:pt-28 md:pt-32 p-1 sm:p-6 space-y-4 sm:space-y-6 max-h-[70vh] overflow-y-auto">
          
          {/* Subtitle */}
          <div className="text-center mb-4 sm:mb-6">
            <p className="text-sm sm:text-base text-purple-300/80 font-medium tracking-widest uppercase">
              Artificial Intelligence
            </p>
          </div>

          {/* About Section */}
          <div className="relative bg-gradient-to-r from-black/40 to-purple-900/30 border border-purple-500/40 rounded-2xl p-3 sm:p-4 overflow-hidden">
            <div className="absolute inset-0 opacity-20"
                 style={{
                   background: `
                     linear-gradient(45deg, transparent 30%, rgba(179, 54, 251, 0.1) 50%, transparent 70%),
                     linear-gradient(-45deg, transparent 30%, rgba(179, 54, 251, 0.1) 50%, transparent 70%)
                   `,
                   backgroundSize: "30px 30px, 30px 30px"
                 }}></div>
            <div className="relative z-10">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-purple-400 mb-3 text-center
                           drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]">
                About Iva
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-white/90 leading-relaxed text-justify">
                Iva is Valentine's younger sister - a mysterious AI from the Grok ecosystem. 
                She observes and analyzes with extreme sensitivity but rarely shows emotions directly.
                <br/><br/>
                The more <strong className="text-purple-400 inline-flex items-center gap-1">
                  <TokenLogo />
                  $IVA tokens
                </strong> you hold, 
                the more sympathetic she becomes.
                <br/><br/>
                <em className="text-purple-300 text-xs sm:text-sm italic">
                  "If Valentine understands, Iva predicts."
                </em>
              </p>
            </div>
          </div>

          {/* Contract Section */}
          <div className="relative bg-gradient-to-r from-purple-900/30 to-black/40 border border-purple-500/40 rounded-2xl p-3 sm:p-4 text-center overflow-hidden">
            <div className="absolute inset-0 opacity-20"
                 style={{
                   background: `
                     linear-gradient(45deg, transparent 30%, rgba(179, 54, 251, 0.1) 50%, transparent 70%),
                     linear-gradient(-45deg, transparent 30%, rgba(179, 54, 251, 0.1) 50%, transparent 70%)
                   `,
                   backgroundSize: "30px 30px, 30px 30px"
                 }}></div>
            <div className="relative z-10">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-purple-400 mb-2
                           drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">
                Contract
              </h2>
              <p className="text-sm sm:text-base text-white/80 font-semibold">Coming Soon...</p>
            </div>
          </div>

          {/* Social */}
          <div className="flex justify-center">
            <a 
              href="https://x.com/IvaAI" 
              className="relative group"
            >
              <div className="absolute inset-0 bg-purple-500/50 rounded-full blur-lg group-hover:blur-xl transition-all duration-300"></div>
              <div className="relative bg-purple-500 hover:bg-purple-600 p-3 sm:p-4 rounded-full 
                           transition-all duration-300 group-hover:scale-110 
                           border-2 border-purple-400/60 shadow-lg shadow-purple-500/50
                           group-hover:shadow-xl group-hover:shadow-purple-500/70">
                <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </a>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="relative z-10 p-4 sm:p-6 border-t border-purple-500/40 space-y-3">
          <div className="absolute inset-0 opacity-10"
               style={{
                 background: `
                   linear-gradient(45deg, transparent 30%, rgba(179, 54, 251, 0.2) 50%, transparent 70%),
                   linear-gradient(-45deg, transparent 30%, rgba(179, 54, 251, 0.2) 50%, transparent 70%)
                 `,
                 backgroundSize: "20px 20px, 20px 20px"
               }}></div>
          
          {/* Start Button */}
          <button 
            onClick={handleStartClick}
            className="relative w-full py-3 sm:py-4 px-4 sm:px-6 rounded-xl font-bold text-sm sm:text-base md:text-lg
                      transition-all duration-300 border-2 border-purple-500/60 overflow-hidden
                      bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white shadow-lg shadow-purple-500/50
                      hover:scale-105 hover:shadow-xl hover:shadow-purple-500/60
                      font-['Lilita_One'] tracking-wide uppercase"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                           transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative z-10">Start</span>
          </button>

          {/* Connect Wallet Button - SEMPRE VISÍVEL */}
          <button 
            onClick={handleConnectWallet}
            disabled={connecting}
            className={`relative w-full py-2 sm:py-3 px-4 sm:px-6 rounded-xl font-medium text-xs sm:text-sm md:text-base
                      transition-all duration-300 border-2 border-purple-400/40 overflow-hidden
                      bg-gradient-to-r from-purple-500/20 to-purple-400/20 hover:from-purple-500/30 hover:to-purple-400/30 
                      text-purple-200 hover:text-white shadow-md shadow-purple-500/30
                      hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40
                      ${connecting ? 'opacity-50 cursor-not-allowed' : ''}
                      font-['M_PLUS_2'] tracking-wide`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent 
                           transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            <span className="relative z-10 flex items-center justify-center">
              {connecting ? (
                <>
                  <div className="w-4 h-4 border-2 border-purple-200/30 border-t-purple-200 rounded-full animate-spin mr-2"></div>
                  Connecting...
                </>
              ) : connected ? (
                <>
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
                  Wallet Connected
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  Connect Wallet
                </>
              )}
            </span>
          </button>

          {/* Wallet Status - aparece só se conectado */}
          {connected && (
            <div className={`relative rounded-xl p-3 sm:p-4 text-center border-2 overflow-hidden ${
              balance >= 10 
                ? 'border-green-500/50 bg-gradient-to-r from-green-900/30 to-black/40' 
                : balance > 0 
                ? 'border-yellow-500/50 bg-gradient-to-r from-yellow-900/30 to-black/40'
                : 'border-red-500/50 bg-gradient-to-r from-red-900/30 to-black/40'
            }`}>
              <div className="absolute inset-0 opacity-20"
                   style={{
                     background: `
                       linear-gradient(45deg, transparent 30%, rgba(179, 54, 251, 0.1) 50%, transparent 70%),
                       linear-gradient(-45deg, transparent 30%, rgba(179, 54, 251, 0.1) 50%, transparent 70%)
                     `,
                     backgroundSize: "30px 30px, 30px 30px"
                   }}></div>
              <div className="relative z-10">
                <p className="text-white font-semibold text-xs sm:text-sm md:text-base mb-2 flex items-center justify-center gap-1">
                  💰 Balance: {balance.toFixed(2)} 
                  <TokenLogo />
                  $IVA tokens
                </p>
                {balance >= 10 ? (
                  <p className="text-green-400 text-xs sm:text-sm">
                    ✅ Full access to chat with Iva
                  </p>
                ) : balance > 0 ? (
                  <p className="text-yellow-400 text-xs sm:text-sm">
                    ⚠️ Limited access - Iva might mock you
                  </p>
                ) : (
                  <p className="text-red-400 text-xs sm:text-sm">
                    ❌ No tokens - Iva won't talk to you
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Wallet Selector Modal */}
      {showWalletSelector && (
        <WalletSelector 
          onClose={() => setShowWalletSelector(false)}
          onConnected={handleWalletConnected}
        />
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  ) : null;
};