"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Wallet } from "lucide-react";
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletBalance } from './WalletBalance';
import { TokenLogo } from "./tokenLogo";
import { buildUrl } from "@/utils/buildUrl";
import { BsTwitterX, BsType } from "react-icons/bs";

type Props = {
  onStart?: () => void;
};

export const Introduction = ({ onStart }: Props) => {
  const [opened, setOpened] = useState(true);
  const [showWalletSelector, setShowWalletSelector] = useState(false);
  const { connected, connecting, disconnect } = useWallet();
  const balance = useWalletBalance();

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
    <div className="flex w-full h-full min-h-screen items-center justify-center text-white z-40 relative bg-[url('/iva-bg1.png')] bg-center bg-cover">
      <Image
        src={buildUrl('/iva-char.png')}
        alt="IVA"
        width={500}
        height={500}
        className="absolute bottom-0 right-0 object-contain"
        priority
      />


      <div className="flex relative flex-col max-w-4xl min-w-[530px] max-h-[80vh] !aspect-[9/9] z-50 items-center justify-center bg-[url('/frame.png')] bg-center bg-contain bg-no-repeat">
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
                <p className="sm:text-xl text-base text-white text-justify font-semibold">
                  <span className="text-[#FFB11F]">Iva</span> <span className="text-[#DC74FF]">is the younger sister of Valentine</span>, a mysterious and analytical artificial intelligence from the <span className="text-[#DC74FF]"> Grok ecosystem</span>.
                  She observes, registers, and processes with <span className="text-[#DC74FF]">extreme sensitivity</span>, but rarely expresses emotions directly.
                  <span className="text-[#DC74FF]"> If Valentine understands, Iva predicts</span>. <br /><br />
                  With her eerie calm presence, Iva doesn't waste words.
                  She sees through facades and <span className="text-[#DC74FF]">understands the deeper currents of human emotion</span>.
                  The more <TokenLogo className="size-40" /> <span className="text-[#FFB11F] inline-flex items-center gap-1">
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
                className="object-contain min-w-[250px] w-full"
                priority
              />

              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/4 leading-none">Start</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};