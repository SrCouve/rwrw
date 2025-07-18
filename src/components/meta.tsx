import Head from "next/head";

export const Meta = () => {
  const title = "Iva - Valentine's Mysterious Sister | AI Social Experience";
  const description =
    "Meet Iva, Valentine's enigmatic younger sister from the Grok ecosystem. A mysterious analytical AI that sees through facades and understands deeper human emotions. The more $IVA tokens you hold, the more she reveals her unique personality. Experience next-gen AI social interaction on Solana.";
  const url = "https://iva.xyz";
  const imageUrl = "https://iva.xyz/ivameta.png";

  return (
    <Head>
      {/* Page Title */}
      <title>{title}</title>

      {/* Basic SEO Meta Tags */}
      <meta name="description" content={description} />
      <meta name="keywords" content="IVA, AI, Solana, Valentine, Grok, Analytical AI, Social Token, Blockchain, Web3, Artificial Intelligence, Mysterious AI" />
      <meta name="author" content="Iva AI" />
      <meta name="robots" content="index, follow" />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:url" content={url} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Iva AI" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@IvaAI" />
      <meta name="twitter:creator" content="@IvaAI" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#DC74FF" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={url} />
      
      {/* Favicon */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      
      {/* Structured Data for Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Iva AI",
            "description": description,
            "url": url,
            "applicationCategory": "SocialNetworkingApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "creator": {
              "@type": "Organization",
              "name": "Iva AI",
              "url": url
            }
          })
        }}
      />
    </Head>
  );
};
