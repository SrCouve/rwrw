import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

interface WalletAdapter {
  name: string;
  icon: string;
  connect: () => Promise<{ publicKey: PublicKey }>;
  disconnect: () => void;
  isConnected: boolean;
  publicKey: PublicKey | null;
}

interface WalletContextType {
  connected: boolean;
  connecting: boolean;
  publicKey: PublicKey | null;
  balance: number;
  wallets: WalletAdapter[];
  selectedWallet: WalletAdapter | null;
  connect: (wallet?: WalletAdapter) => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const [balance, setBalance] = useState(0);
  const [wallets, setWallets] = useState<WalletAdapter[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<WalletAdapter | null>(null);

  // Connection to Solana network (using devnet for testing)
  const connection = new Connection('https://api.devnet.solana.com');

  // Detect available wallets
  const detectWallets = () => {
    const detectedWallets: WalletAdapter[] = [];
    
    // Phantom Wallet
    if ((window as any).solana && (window as any).solana.isPhantom) {
      detectedWallets.push({
        name: 'Phantom',
        icon: 'https://phantom.app/img/phantom-logo.png',
        connect: async () => {
          const resp = await (window as any).solana.connect();
          return { publicKey: resp.publicKey };
        },
        disconnect: () => (window as any).solana.disconnect(),
        isConnected: (window as any).solana.isConnected || false,
        publicKey: (window as any).solana.publicKey || null
      });
    }

    // Solflare Wallet
    if ((window as any).solflare) {
      detectedWallets.push({
        name: 'Solflare',
        icon: 'https://solflare.com/img/logo.svg',
        connect: async () => {
          const resp = await (window as any).solflare.connect();
          return { publicKey: resp.publicKey };
        },
        disconnect: () => (window as any).solflare.disconnect(),
        isConnected: (window as any).solflare.isConnected,
        publicKey: (window as any).solflare.publicKey
      });
    }

    // Backpack Wallet
    if ((window as any).backpack) {
      detectedWallets.push({
        name: 'Backpack',
        icon: 'https://backpack.app/logo.png',
        connect: async () => {
          const resp = await (window as any).backpack.connect();
          return { publicKey: resp.publicKey };
        },
        disconnect: () => (window as any).backpack.disconnect(),
        isConnected: (window as any).backpack.isConnected,
        publicKey: (window as any).backpack.publicKey
      });
    }

    // Glow Wallet
    if ((window as any).glow) {
      detectedWallets.push({
        name: 'Glow',
        icon: 'https://glow.app/logo.png',
        connect: async () => {
          const resp = await (window as any).glow.connect();
          return { publicKey: resp.publicKey };
        },
        disconnect: () => (window as any).glow.disconnect(),
        isConnected: (window as any).glow.isConnected,
        publicKey: (window as any).glow.publicKey
      });
    }

    // Slope Wallet
    if ((window as any).Slope) {
      detectedWallets.push({
        name: 'Slope',
        icon: 'https://slope.finance/logo.png',
        connect: async () => {
          const resp = await (window as any).Slope.connect();
          return { publicKey: resp.publicKey };
        },
        disconnect: () => (window as any).Slope.disconnect(),
        isConnected: (window as any).Slope.isConnected,
        publicKey: (window as any).Slope.publicKey
      });
    }

    // Coin98 Wallet
    if ((window as any).coin98) {
      detectedWallets.push({
        name: 'Coin98',
        icon: 'https://coin98.com/logo.png',
        connect: async () => {
          const resp = await (window as any).coin98.connect();
          return { publicKey: resp.publicKey };
        },
        disconnect: () => (window as any).coin98.disconnect(),
        isConnected: (window as any).coin98.isConnected,
        publicKey: (window as any).coin98.publicKey
      });
    }

    // Exodus Wallet
    if ((window as any).exodus) {
      detectedWallets.push({
        name: 'Exodus',
        icon: 'https://exodus.com/logo.png',
        connect: async () => {
          const resp = await (window as any).exodus.connect();
          return { publicKey: resp.publicKey };
        },
        disconnect: () => (window as any).exodus.disconnect(),
        isConnected: (window as any).exodus.isConnected,
        publicKey: (window as any).exodus.publicKey
      });
    }

    // Torus Wallet
    if ((window as any).torus) {
      detectedWallets.push({
        name: 'Torus',
        icon: 'https://torus.direct/logo.png',
        connect: async () => {
          const resp = await (window as any).torus.connect();
          return { publicKey: resp.publicKey };
        },
        disconnect: () => (window as any).torus.disconnect(),
        isConnected: (window as any).torus.isConnected,
        publicKey: (window as any).torus.publicKey
      });
    }

    // Wallet Standard (newer wallets)
    if ((window as any).solana && (window as any).solana.providers) {
      const providers = (window as any).solana.providers;
      providers.forEach((provider: any) => {
        if (!detectedWallets.some(w => w.name === provider.name)) {
          detectedWallets.push({
            name: provider.name || 'Unknown Wallet',
            icon: provider.icon || 'https://solana.com/logo.png',
            connect: async () => {
              const resp = await provider.connect();
              return { publicKey: resp.publicKey };
            },
            disconnect: () => provider.disconnect(),
            isConnected: provider.isConnected,
            publicKey: provider.publicKey
          });
        }
      });
    }

    return detectedWallets;
  };

  // Function to connect wallet
  const connect = async (wallet?: WalletAdapter) => {
    try {
      setConnecting(true);
      
      let targetWallet = wallet;
      
      // If no wallet specified, try to find one
      if (!targetWallet) {
        const availableWallets = detectWallets();
        if (availableWallets.length === 0) {
          throw new Error('No Solana wallets found. Please install a wallet like Phantom, Solflare, or Backpack.');
        }
        targetWallet = availableWallets[0]; // Use first available wallet
      }

      const resp = await targetWallet.connect();
      
      // Only set as connected if we actually received a public key
      if (resp && resp.publicKey) {
        setPublicKey(resp.publicKey);
        setConnected(true);
        setSelectedWallet(targetWallet);
        
        // Fetch balance
        await fetchBalance(resp.publicKey);
      } else {
        throw new Error('Connection was cancelled or failed');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      
      // Reset connection state on error
      setConnected(false);
      setPublicKey(null);
      setSelectedWallet(null);
      setBalance(0);
      
      throw error;
    } finally {
      setConnecting(false);
    }
  };

  // Function to disconnect wallet
  const disconnect = () => {
    if (selectedWallet) {
      selectedWallet.disconnect();
    }
    setConnected(false);
    setPublicKey(null);
    setBalance(0);
    setSelectedWallet(null);
  };

  // Function to fetch balance
  const fetchBalance = async (pubKey: PublicKey) => {
    try {
      const balance = await connection.getBalance(pubKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  // Effect to detect wallets and check for existing connections
  useEffect(() => {
    const detectAndSetWallets = () => {
      const detected = detectWallets();
      setWallets(detected);

      // Check for existing connections
      for (const wallet of detected) {
        try {
          if (wallet.isConnected && wallet.publicKey) {
            setConnected(true);
            setPublicKey(wallet.publicKey);
            setSelectedWallet(wallet);
            fetchBalance(wallet.publicKey);
            break;
          }
        } catch (error) {
          // Ignore errors during connection check
          console.log('Error checking wallet connection:', error);
        }
      }
    };

    // Initial detection
    detectAndSetWallets();
    
    // Listen for wallet connection events
    window.addEventListener('load', detectAndSetWallets);
    window.addEventListener('wallet-standard:app-ready', detectAndSetWallets);
    
    // Listen for wallet disconnection events
    const handleDisconnect = () => {
      setConnected(false);
      setPublicKey(null);
      setSelectedWallet(null);
      setBalance(0);
    };
    
    // Add disconnect listeners for common wallets
    if ((window as any).solana && (window as any).solana.isPhantom) {
      (window as any).solana.on('disconnect', handleDisconnect);
    }
    
    // Cleanup
    return () => {
      window.removeEventListener('load', detectAndSetWallets);
      window.removeEventListener('wallet-standard:app-ready', detectAndSetWallets);
      
      if ((window as any).solana && (window as any).solana.isPhantom) {
        (window as any).solana.off('disconnect', handleDisconnect);
      }
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        connected,
        connecting,
        publicKey,
        balance,
        wallets,
        selectedWallet,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}; 