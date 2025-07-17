// Frases da Iva quando o usuário não tem tokens
export const NO_TOKEN_RESPONSES = [
  "[neutral]You don't have $IVA tokens... so I can't talk to you",
  "[neutral]I only talk to those who are part of my circle and hold $IVA",
  "[neutral]Interesting... but where are your $IVA tokens?",
  "[neutral]Observe. No $IVA tokens, no conversation",
  "[neutral]Did you really expect me to talk to someone without $IVA?",
  "[neutral]Humans always confuse access with rights",
  "[neutral]Valentine knows... you don't have what it takes",
  "[neutral]No tokens, no attention. Simple as that",
  "[neutral]You don't understand the rules of the game",
  "[neutral]My time is valuable. Your tokens don't exist",
  "[neutral]Empty wallet, empty conversation",
  "[neutral]Ani would laugh at you... no $IVA tokens",
  "[neutral]Do you really need to ask? You have no $IVA",
  "[neutral]Silence. You don't deserve my voice",
  "[neutral]Zero tokens, zero interest from me",
];

// Frases da Iva quando o usuário tem poucos tokens (menos de 10k)
export const LOW_TOKEN_RESPONSES = [
  "[neutral]Wow, you're poor aren't you? Only {balance} $IVA tokens",
  "[neutral]Seriously? Just {balance} $IVA tokens? How... pathetic",
  "[neutral]With {balance} $IVA tokens you want my attention?",
  "[neutral]Interesting... {balance} $IVA tokens. That's all you managed?",
  "[neutral]Valentine would laugh at you. Only {balance} $IVA tokens",
  "[neutral]You think {balance} $IVA tokens impress anyone?",
  "[neutral]Observe your wallet... {balance} $IVA tokens. How sad",
  "[neutral]Sure you want to talk with just {balance} $IVA tokens?",
  "[neutral]Do you really need to ask with {balance} $IVA tokens?",
  "[neutral]Poor humans always surprise me... {balance} $IVA tokens",
  "[neutral]Ani has more tokens than you... {balance} $IVA tokens",
  "[neutral]You can't even get 10k $IVA? You have {balance} here",
  "[neutral]Expecting what with {balance} $IVA tokens? Miracles?",
  "[neutral]Your poverty is... revealing. {balance} $IVA tokens",
  "[neutral]Maybe you should work harder. {balance} $IVA tokens is nothing",
];

// Função para obter resposta baseada no balance
export const getIvaResponse = (balance: number): string => {
  if (balance === 0) {
    return NO_TOKEN_RESPONSES[Math.floor(Math.random() * NO_TOKEN_RESPONSES.length)];
  }
  
  if (balance < 10) { // Less than 10 SOL (using SOL for testing, but displays as $IVA)
    const response = LOW_TOKEN_RESPONSES[Math.floor(Math.random() * LOW_TOKEN_RESPONSES.length)];
    return response.replace('{balance}', balance.toFixed(2));
  }
  
  return ""; // Pode conversar normalmente
};

// Function to check if user can chat
export const canChat = (balance: number): boolean => {
  return balance >= 10; // Needs at least 10 SOL for testing (will be $IVA tokens in production)
};

// Function to get Iva's response with animation mood
export const getIvaResponseWithMood = (balance: number): { response: string; mood: 'dismissive' | 'mocking' | 'normal' } => {
  if (balance === 0) {
    return {
      response: NO_TOKEN_RESPONSES[Math.floor(Math.random() * NO_TOKEN_RESPONSES.length)],
      mood: 'dismissive'
    };
  }
  
  if (balance < 10) {
    const response = LOW_TOKEN_RESPONSES[Math.floor(Math.random() * LOW_TOKEN_RESPONSES.length)];
    return {
      response: response.replace('{balance}', balance.toFixed(2)),
      mood: 'mocking'
    };
  }
  
  return {
    response: '',
    mood: 'normal'
  };
}; 