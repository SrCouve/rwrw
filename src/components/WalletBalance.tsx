import React, { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

interface WalletBalanceProps {
  children: (balance: number) => React.ReactNode;
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({ children }) => {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (!connected || !publicKey) {
      setBalance(0);
      return;
    }

    // Fetch balance
    const fetchBalance = async () => {
      try {
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance(0);
      }
    };

    fetchBalance();

    // Set up interval to update balance every 10 seconds
    const interval = setInterval(fetchBalance, 10000);

    return () => clearInterval(interval);
  }, [publicKey, connected, connection]);

  return <>{children(balance)}</>;
};

// Custom hook for easier access to wallet balance
export const useWalletBalance = () => {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number>(0);

  useEffect(() => {
    if (!connected || !publicKey) {
      setBalance(0);
      return;
    }

    const fetchBalance = async () => {
      try {
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / LAMPORTS_PER_SOL);
      } catch (error) {
        console.error('Error fetching balance:', error);
        setBalance(0);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 10000);

    return () => clearInterval(interval);
  }, [publicKey, connected, connection]);

  return balance;
}; 