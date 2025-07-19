import React from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletBalance } from './WalletBalance';
import { canChat } from "@/features/constants/ivaResponses";
import { TokenLogo } from "./tokenLogo";
import Image from 'next/image';

export const WalletInfo = () => {
  const { connected, publicKey } = useWallet();
  const balance = useWalletBalance();

  // Se conectado, o IvaStatus já mostra as informações, então não precisamos mostrar este componente
  if (connected) return null;

  return (
    <div className="fixed top-4 right-4 z-20 hidden md:block">
        
        <Image
          alt='Not Connected'
          width={320}
          height={250}
          src={'/not-connected.png'}
          className="object-contain sm:block hidden relative"
          priority
        />

    </div>
  );
}; 