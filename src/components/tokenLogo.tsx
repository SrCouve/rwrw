import Image from "next/image";

interface TokenLogoProps {
  className?: string;
}

export const TokenLogo = ({ className = "" }: TokenLogoProps) => {
  return (
    <Image
      src="/Logotoken.png"
      alt="$IVA"
      width={200}
      height={200}
      className={`inline-block w-5 h-5 object-contain drop-shadow-sm ${className}`}
    />
  );
}; 