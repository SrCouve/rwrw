import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletDisconnectButton } from '@solana/wallet-adapter-react-ui';
import { useWalletBalance } from './WalletBalance';
import { canChat } from "@/features/constants/ivaResponses";
import { TokenLogo } from "./tokenLogo";
import Image from 'next/image';
import { buildUrl } from '@/utils/buildUrl';

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
    <div className="fixed top-3 right-3 sm:top-6 sm:right-6 z-30 max-w-[360px] w-[calc(100vw-24px)] sm:w-auto ">
      {/* Content */}
      <div className="p-4 sm:p-6 space-y-4">
        <Image
          src={buildUrl('/image.png')}
          alt="IVA Logo"
          width={385}
          height={250}
          className="object-contain sm:block hidden relative w-full -mt-[12%] max-w-[45%] translate-y-1/2 translate-x-1/2 z-30"
          priority
        />
        <div className='flex relative flex-col p-16 space-y-4 bg-[#1F142A] sm:pt-[52px] sm:pb-[42px] rounded-16'>
          {/* Wallet info section */}
          <div className="mb-4 p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xl font-semibold text-[#FF00BF]">Wallet</span>
              <WalletDisconnectButton className="!bg-red-500 hover:!bg-red-600 !text-white !border-0 !rounded-lg !px-3 !py-1 !text-xs !font-semibold" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base text-[#7D5E9D] bg-[#1A1223] rounded-8 px-8 py-4 font-bold rounded-lg">
                {publicKey?.toString().slice(0, 4)}...{publicKey?.toString().slice(-4)}
              </span>
            </div>
          </div>

          {/* Token balance section */}
          <div className="mb-4 p-4">
            <div className="flex flex-col mb-2">
              <span className="text-xl font-semibold text-[#FF00BF]">Balance</span>
              <div className="flex w-fit items-center gap-2 px-8 py-4 text-base rounded-8 text-[#7D5E9D] bg-[#1A1223] font-bold">
                <span className="">
                  {balance.toFixed(2)}
                </span>
                <TokenLogo className='size-40' />
                <span className="">$IVA</span>
              </div>
            </div>
          </div>

          <TokenLogo className='absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 sm:size-[88px] size-[44px]' />
        </div>

        {/* Access status section */}
        <div className={`flex flex-col p-16 space-y-4 bg-[#1F142A] sm:pt-[32px] rounded-16 ${canAccessIva
          ? 'bg-gradient-to-r from-green-50/90 to-emerald-50/90 border-green-300/50 shadow-lg shadow-green-500/20'
          : balance > 0
            ? 'bg-gradient-to-r from-orange-50/90 to-amber-50/90 border-orange-300/50 shadow-lg shadow-orange-500/20'
            : 'bg-gradient-to-r from-red-50/90 to-rose-50/90 border-red-300/50 shadow-lg shadow-red-500/20'
          }`}>
          <div className="flex items-start gap-4">
            <div className={`w-4 h-4 rounded-full animate-pulse ${canAccessIva ? 'bg-green-500' : balance > 0 ? 'bg-orange-500' : 'bg-red-500'
              }`}></div>
            <div className="flex-1">
              <div className={`text-lg font-bold ${canAccessIva ? 'text-green-700' : balance > 0 ? 'text-orange-700' : 'text-[#7D5E9D]'
                }`}>
                {canAccessIva ? 'Full Access' : balance > 0 ? 'Limited Access' : 'No Access!'}
              </div>
              <div className="text-sm text-[#7D5E9D] font-semibold mt-2">
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
  );
}; 