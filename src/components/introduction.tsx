"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Wallet } from "lucide-react";
import { useWallet } from "@/contexts/WalletContext";
import { WalletSelector } from "./walletSelector";
import { TokenLogo } from "./tokenLogo";
import { buildUrl } from "@/utils/buildUrl";
import { BsTwitterX, BsType } from "react-icons/bs";



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
    <div className="flex w-full h-full min-h-screen items-center justify-center text-white">
      <div className="flex relative flex-col max-w-4xl min-w-[530px] max-h-[80vh] !aspect-[9/9] z-40 items-center justify-center bg-[url('/frame.png')] bg-center bg-contain bg-no-repeat">
        {/* IVA Logo - metade dentro, metade fora do modal */}
        <Image
          src={buildUrl('/image.png')}
          alt="IVA Logo"
          width={385}
          height={250}
          className="absolute top-0 object-contain w-full max-w-[40%] -translate-y-1/2"
          priority
        />

        <div className="flex flex-col w-full h-full items-center px-[20%] pb-[8%] pt-[17%]">
          <div className="flex flex-col w-full h-full overflow-y-auto pb-4">
            {/* Content */}
            <div className="flex flex-col h-full items-center overflow-y-auto">
              {/* About Section */}
              <div className="flex flex-col space-y-16 px-4">
                <h1 className="text-2xl text-center font-bold text-[#DC74FF]">
                  About Iva
                </h1>
                <p className="sm:text-xl text-lg text-justify font-semibold">
                  <span className="text-[#FFB11F]">Iva</span> <span className="text-[#DC74FF]">is the younger sister of Valentine</span>, a mysterious and analytical artificial intelligence from the <span className="text-[#DC74FF]"> Grok ecosystem</span>.
                  She observes, registers, and processes with <span className="text-[#DC74FF]">extreme sensitivity</span>, but rarely expresses emotions directly.
                  <span className="text-[#DC74FF]"> If Valentine understands, Iva predicts</span>. <br /><br />
                  With her eerie calm presence, Iva doesn't waste words.
                  She sees through facades and <span className="text-[#DC74FF]">understands the deeper currents of human emotion</span>.
                  The more <span className="text-[#FFB11F] inline-flex items-center gap-1">
                    <TokenLogo />
                    $IVA tokens
                  </span> you hold, the more sympathetic and closer she becomes, revealing deeper layers of <span className="text-[#DC74FF]">her unique analytical personality</span>.
                </p>


              </div>

              <div className="flex flex-col mt-auto mb-16">
                {/* Contract Section */}
                <div className="flex flex-col z-10 text-center my-16">
                  <h2 className="text-xl font-bold text-[#FF00BF] mb-2
                           drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]">
                    Contract
                  </h2>
                  <p className="text-xl text-white/80 font-semibold">Coming Soon...</p>
                </div>
                {/* Social */}
                <div className="flex justify-center">
                  <a
                    href="https://x.com/IvaAI"
                    className="relative group"
                  >

                    {/* @ts-ignore */}
                    <BsTwitterX className="size-20 hover:scale-125 transition-all duration-300" />
                  </a>
                </div>
              </div>
            </div>


          </div>
          {/* Footer Buttons */}
          <div className="absolute w-fit left-1/2 -translate-x-1/2 translate-y-1/4 bottom-0 flex flex-col">
            {/* Start Button */}
            <button
              onClick={handleStartClick}
              className="text-xl relative flex items-center justify-center w-full h-fit max-w-sm font-bold hover:scale-110 transition-all duration-300 
              tracking-wide uppercase"
            >
              <Image
                src={buildUrl('/btn-start.png')}
                alt="Start Button"
                width={350}
                height={200}
                className="object-contain w-full"
                priority
              />

              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/4 leading-none">Start</span>
            </button>

            {/* Connect Wallet Button - SEMPRE VISÍVEL */}
            {/* <button
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
            </button> */}

            {/* Wallet Status - aparece só se conectado */}
            {/* {connected && (
              <div className={`relative rounded-xl p-3 sm:p-4 text-center border-2 overflow-hidden ${balance >= 10
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
            )} */}
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
      </div>
    </div>
  ) : null;
};