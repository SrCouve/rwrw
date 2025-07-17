"use client";

import { useState } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Wallet, X, AlertCircle } from "lucide-react";

interface WalletSelectorProps {
  onClose: () => void;
  onConnected: () => void;
}

export const WalletSelector = ({ onClose, onConnected }: WalletSelectorProps) => {
  const { wallets, connect, connecting } = useWallet();
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleWalletConnect = async (wallet: any) => {
    try {
      setConnectingWallet(wallet.name);
      setError(null);
      await connect(wallet);
      onConnected();
    } catch (err: any) {
      // Don't show error if user cancelled the connection
      if (err.message && (
        err.message.includes('User rejected') || 
        err.message.includes('cancelled') ||
        err.message.includes('denied') ||
        err.message.includes('rejected')
      )) {
        // Just silently handle cancellation and close modal
        setError(null);
        setTimeout(() => {
          onClose();
        }, 100);
      } else {
        setError(err.message || 'Failed to connect wallet');
      }
    } finally {
      setConnectingWallet(null);
    }
  };

  const styles = {
    overlay: {
      position: "fixed" as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
    modal: {
      backgroundColor: "rgba(139, 69, 19, 0.95)",
      border: "2px solid #B336FB",
      borderRadius: "20px",
      padding: "2rem",
      maxWidth: "400px",
      width: "90%",
      maxHeight: "80vh",
      overflowY: "auto" as const,
      boxShadow: "0 0 30px rgba(179, 54, 251, 0.3)",
      backdropFilter: "blur(10px)",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.5rem",
    },
    title: {
      fontSize: "1.5rem",
      fontWeight: "bold",
      color: "#B336FB",
      fontFamily: "'Lilita One', cursive",
    },
    closeButton: {
      backgroundColor: "transparent",
      border: "none",
      color: "#B336FB",
      cursor: "pointer",
      padding: "0.5rem",
      borderRadius: "50%",
      transition: "background-color 0.3s",
    },
    description: {
      color: "rgba(255, 255, 255, 0.9)",
      marginBottom: "1.5rem",
      textAlign: "center" as const,
      fontFamily: "'M PLUS 2', sans-serif",
    },
    walletList: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "0.75rem",
    },
    walletButton: {
      display: "flex",
      alignItems: "center",
      gap: "1rem",
      padding: "1rem",
      backgroundColor: "rgba(179, 54, 251, 0.1)",
      border: "1px solid rgba(179, 54, 251, 0.3)",
      borderRadius: "12px",
      color: "white",
      cursor: "pointer",
      transition: "all 0.3s",
      fontFamily: "'M PLUS 2', sans-serif",
      fontWeight: "500",
    },
    walletButtonHover: {
      backgroundColor: "rgba(179, 54, 251, 0.2)",
      borderColor: "#B336FB",
      transform: "translateY(-1px)",
    },
    walletIcon: {
      width: "32px",
      height: "32px",
      borderRadius: "8px",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    walletInfo: {
      flex: 1,
      display: "flex",
      flexDirection: "column" as const,
    },
    walletName: {
      fontSize: "1rem",
      fontWeight: "600",
      marginBottom: "0.25rem",
    },
    walletStatus: {
      fontSize: "0.875rem",
      color: "rgba(255, 255, 255, 0.7)",
    },
    spinner: {
      width: "20px",
      height: "20px",
      border: "2px solid transparent",
      borderTop: "2px solid #B336FB",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    error: {
      backgroundColor: "rgba(239, 68, 68, 0.1)",
      border: "1px solid rgba(239, 68, 68, 0.3)",
      borderRadius: "8px",
      padding: "1rem",
      marginBottom: "1rem",
      color: "#EF4444",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
      fontFamily: "'M PLUS 2', sans-serif",
    },
    noWallets: {
      textAlign: "center" as const,
      color: "rgba(255, 255, 255, 0.7)",
      padding: "2rem",
      fontFamily: "'M PLUS 2', sans-serif",
    },
    installLink: {
      color: "#B336FB",
      textDecoration: "underline",
      marginTop: "1rem",
      display: "block",
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h2 style={styles.title}>Select Wallet</h2>
          <button 
            style={styles.closeButton}
            onClick={onClose}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(179, 54, 251, 0.1)"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <X size={20} />
          </button>
        </div>

        <p style={styles.description}>
          Choose your preferred wallet to connect with Iva
        </p>

        {error && (
          <div style={styles.error}>
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {wallets.length === 0 ? (
          <div style={styles.noWallets}>
            <Wallet size={48} style={{ color: "#B336FB", margin: "0 auto 1rem" }} />
            <p>No Solana wallets detected</p>
            <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>
              Install a wallet extension to continue:
            </p>
            <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer" style={styles.installLink}>
              Download Phantom
            </a>
            <a href="https://solflare.com/" target="_blank" rel="noopener noreferrer" style={styles.installLink}>
              Download Solflare
            </a>
            <a href="https://backpack.app/" target="_blank" rel="noopener noreferrer" style={styles.installLink}>
              Download Backpack
            </a>
          </div>
        ) : (
          <div style={styles.walletList}>
            {wallets.map((wallet) => (
              <button
                key={wallet.name}
                style={styles.walletButton}
                onClick={() => handleWalletConnect(wallet)}
                disabled={connectingWallet === wallet.name}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.walletButtonHover)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.walletButton)}
              >
                <div style={styles.walletIcon}>
                  {wallet.icon ? (
                    <img src={wallet.icon} alt={wallet.name} style={{ width: "24px", height: "24px" }} />
                  ) : (
                    <Wallet size={24} color="#B336FB" />
                  )}
                </div>
                <div style={styles.walletInfo}>
                  <div style={styles.walletName}>{wallet.name}</div>
                  <div style={styles.walletStatus}>
                    {wallet.isConnected ? 'Connected' : 'Available'}
                  </div>
                </div>
                {connectingWallet === wallet.name && (
                  <div style={styles.spinner}></div>
                )}
              </button>
            ))}
          </div>
        )}

        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}; 