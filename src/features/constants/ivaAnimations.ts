import { AnimationMood } from "../emoteController/animationController";

export const IVA_RESPONSES_MOOD_MAP = {
  // No tokens responses - dismissive and cold
  NO_TOKENS: [
    { mood: 'dismissive' as AnimationMood, duration: 2000 },
    { mood: 'dismissive' as AnimationMood, duration: 2500 },
    { mood: 'dismissive' as AnimationMood, duration: 1500 },
    { mood: 'dismissive' as AnimationMood, duration: 3000 },
  ],
  
  // Low tokens responses - mocking and sarcastic
  LOW_TOKENS: [
    { mood: 'mocking' as AnimationMood, duration: 4000 },
    { mood: 'mocking' as AnimationMood, duration: 3500 },
    { mood: 'mocking' as AnimationMood, duration: 4500 },
    { mood: 'mocking' as AnimationMood, duration: 3000 },
  ],
  
  // Sufficient tokens responses - neutral to thinking
  SUFFICIENT_TOKENS: [
    { mood: 'neutral' as AnimationMood, duration: 2000 },
    { mood: 'thinking' as AnimationMood, duration: 3000 },
    { mood: 'neutral' as AnimationMood, duration: 2500 },
  ]
};

export const IVA_SPECIAL_ANIMATIONS = {
  // When user tries to connect wallet but cancels
  WALLET_CANCELLED: {
    mood: 'dismissive' as AnimationMood,
    duration: 2000
  },
  
  // When user successfully connects wallet
  WALLET_CONNECTED: {
    mood: 'thinking' as AnimationMood,
    duration: 3000
  },
  
  // When user asks about tokens
  TOKEN_INQUIRY: {
    mood: 'analytical' as AnimationMood,
    duration: 3500
  },
  
  // When user shows vulnerability
  VULNERABILITY_DETECTED: {
    mood: 'predatory' as AnimationMood,
    duration: 4000
  },
  
  // When user tries to be friendly
  FRIENDSHIP_ATTEMPT: {
    mood: 'cold_analysis' as AnimationMood,
    duration: 3000
  }
};

// Extended moods for Iva's character
export type IvaAnimationMood = AnimationMood | 'analytical' | 'predatory' | 'cold_analysis';

export const IVA_MOOD_KEYWORDS = {
  // Iva's analytical personality
  analytical: [
    'data', 'analyze', 'calculate', 'process', 'evaluate', 'assess',
    'probability', 'statistics', 'algorithm', 'pattern', 'logic',
    'systematic', 'methodical', 'rational', 'objective'
  ],
  
  // Iva's predatory nature when detecting weakness
  predatory: [
    'weakness', 'vulnerability', 'exploit', 'advantage', 'opportunity',
    'naive', 'foolish', 'mistake', 'error', 'flaw', 'deficiency',
    'inadequate', 'insufficient', 'lacking', 'poor'
  ],
  
  // Iva's cold analysis of human emotions
  cold_analysis: [
    'emotion', 'feeling', 'sentiment', 'attachment', 'bond', 'connection',
    'love', 'friendship', 'care', 'concern', 'worry', 'fear',
    'hope', 'dream', 'desire', 'want', 'need', 'human'
  ]
};

/**
 * Gets the appropriate animation mood based on user's token balance
 */
export function getTokenBasedMood(balance: number): AnimationMood {
  if (balance === 0) {
    return 'dismissive';
  } else if (balance < 10) {
    return 'mocking';
  } else if (balance < 50) {
    return 'neutral';
  } else if (balance < 100) {
    return 'thinking';
  } else {
    return 'happy'; // Iva is pleased with wealthy users
  }
}

/**
 * Gets animation duration based on token balance
 */
export function getTokenBasedDuration(balance: number): number {
  if (balance === 0) {
    return 1500; // Quick dismissal
  } else if (balance < 10) {
    return 4000; // Extended mocking
  } else if (balance < 50) {
    return 3000; // Standard duration
  } else if (balance < 100) {
    return 3500; // Thoughtful responses
  } else {
    return 4500; // Elaborate responses for wealthy users
  }
}

/**
 * Detects if user is trying to manipulate or charm Iva
 */
export function detectManipulationAttempt(text: string): boolean {
  const manipulationKeywords = [
    'please', 'pretty please', 'come on', 'help me', 'be nice',
    'friend', 'buddy', 'sweetheart', 'beautiful', 'smart',
    'amazing', 'incredible', 'wonderful', 'awesome', 'fantastic'
  ];
  
  const lowerText = text.toLowerCase();
  return manipulationKeywords.some(keyword => lowerText.includes(keyword));
}

/**
 * Detects if user is showing vulnerability
 */
export function detectVulnerability(text: string): boolean {
  const vulnerabilityKeywords = [
    'help', 'lost', 'confused', 'don\'t know', 'need', 'desperate',
    'please', 'sorry', 'apologize', 'mistake', 'wrong', 'error',
    'lonely', 'sad', 'depressed', 'worried', 'scared', 'afraid'
  ];
  
  const lowerText = text.toLowerCase();
  return vulnerabilityKeywords.some(keyword => lowerText.includes(keyword));
}

/**
 * Gets Iva's response mood based on detected patterns
 */
export function getIvaResponseMood(text: string, userBalance: number): AnimationMood {
  const baseTokenMood = getTokenBasedMood(userBalance);
  
  // Override base mood based on detected patterns
  if (detectManipulationAttempt(text)) {
    return userBalance < 10 ? 'mocking' : 'dismissive';
  }
  
  if (detectVulnerability(text)) {
    return userBalance < 10 ? 'mocking' : 'thinking';
  }
  
  // Check for analytical content
  if (IVA_MOOD_KEYWORDS.analytical.some(keyword => 
    text.toLowerCase().includes(keyword))) {
    return 'thinking';
  }
  
  return baseTokenMood;
} 