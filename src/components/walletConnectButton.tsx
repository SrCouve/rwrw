import React from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

interface WalletConnectButtonProps {
  appUnlocked?: boolean;
}

export const WalletConnectButton: React.FC<WalletConnectButtonProps> = ({ appUnlocked = true }) => {
  const { connected } = useWallet();

  // Não mostra se conectado ou se o app ainda não foi desbloqueado
  if (connected || !appUnlocked) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <WalletMultiButton 
        className="!bg-gradient-to-r !from-purple-600 !to-purple-700 hover:!from-purple-700 hover:!to-purple-800 
                   !text-white !border-0 !rounded-2xl !px-6 !py-3 !font-semibold !shadow-lg 
                   hover:!shadow-xl !transition-all !duration-300 !transform hover:!scale-105
                   !font-['M_PLUS_2'] !tracking-wide !text-sm"
        style={{
          background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
          boxShadow: '0 10px 25px rgba(139, 92, 246, 0.3)',
        }}
      />
    </div>
  );
}; 