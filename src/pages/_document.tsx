import { buildUrl } from "@/utils/buildUrl";
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        {/* Preconnect with Google Fonts for better performance */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* Modern fonts for Iva's interface */}
        <link
          href="https://fonts.googleapis.com/css2?family=M+PLUS+2:wght@300;400;500;600;700;800&family=Montserrat:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        {/* Character encoding */}
        <meta charSet="utf-8" />
        
        {/* Ensure proper rendering on mobile devices */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </Head>

      {/* Beautiful background for Iva's world */}
      <body style={{ backgroundImage: `url(${buildUrl("/bg-c.png")})` }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}