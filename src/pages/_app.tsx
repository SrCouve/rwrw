import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@charcoal-ui/icons";
import { WalletProvider } from "@/contexts/WalletContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WalletProvider>
      <Component {...pageProps} />
    </WalletProvider>
  );
}
