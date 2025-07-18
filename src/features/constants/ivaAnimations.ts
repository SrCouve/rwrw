import { AnimationMood } from "../emoteController/animationController";
import { TOKEN_THRESHOLDS, hasNoAccess, hasLimitedAccess } from './tokenThresholds';

// Mood keywords for text analysis
export const IVA_MOOD_KEYWORDS = {
  analytical: [
    'analyze', 'think', 'observe', 'consider', 'examine', 'study', 'investigate',
    'calculate', 'evaluate', 'assess', 'review', 'scrutinize', 'data', 'statistics',
    'logic', 'reasoning', 'hypothesis', 'conclusion', 'evidence', 'facts'
  ],
  dismissive: [
    'whatever', 'ignore', 'don\'t care', 'boring', 'pointless', 'waste', 'stupid',
    'ridiculous', 'nonsense', 'irrelevant', 'meaningless', 'trivial', 'pathetic'
  ],
  mocking: [
    'really?', 'seriously?', 'wow', 'amazing', 'incredible', 'fantastic', 'sure',
    'obviously', 'of course', 'genius', 'brilliant', 'impressive', 'perfect'
  ],
  thinking: [
    'hmm', 'interesting', 'curious', 'wonder', 'perhaps', 'maybe', 'possibly',
    'potentially', 'theoretically', 'supposedly', 'apparently', 'presumably'
  ],
  surprised: [
    'what?', 'how?', 'impossible', 'unexpected', 'sudden', 'shocking', 'unbelievable',
    'extraordinary', 'remarkable', 'astonishing', 'incredible', 'amazing'
  ],
  happy: [
    'good', 'great', 'excellent', 'wonderful', 'fantastic', 'amazing', 'perfect',
    'love', 'enjoy', 'pleased', 'delighted', 'satisfied', 'happy', 'joy'
  ],
  sad: [
    'sad', 'sorry', 'disappointed', 'unfortunate', 'regret', 'pity', 'tragic',
    'depressing', 'melancholy', 'sorrowful', 'grieving', 'mourning'
  ],
  angry: [
    'angry', 'mad', 'furious', 'rage', 'annoyed', 'irritated', 'frustrated',
    'outraged', 'indignant', 'livid', 'enraged', 'hostile', 'aggressive'
  ]
};

// Patterns that might indicate manipulation attempts
const MANIPULATION_PATTERNS = [
  /please.*help/i,
  /you.*must/i,
  /i.*need.*you/i,
  /emergency/i,
  /urgent/i,
  /important/i,
  /special.*request/i,
  /exception/i,
  /just.*this.*once/i,
  /trust.*me/i,
  /believe.*me/i,
  /promise/i,
  /swear/i,
  /i.*beg/i,
  /desperate/i
];

// Patterns that might indicate vulnerability or emotional manipulation
const VULNERABILITY_PATTERNS = [
  /i.*feel.*sad/i,
  /i.*hurt/i,
  /i.*lonely/i,
  /i.*depressed/i,
  /nobody.*understands/i,
  /you.*only.*one/i,
  /i.*love.*you/i,
  /you.*mean.*everything/i,
  /can.*we.*be.*friends/i,
  /i.*trust.*you/i,
  /tell.*me.*secret/i,
  /between.*us/i,
  /don.*t.*tell.*anyone/i
];

export function detectManipulationAttempt(text: string): boolean {
  return MANIPULATION_PATTERNS.some(pattern => pattern.test(text));
}

export function detectVulnerability(text: string): boolean {
  return VULNERABILITY_PATTERNS.some(pattern => pattern.test(text));
}

/**
 * Analyzes text and returns appropriate mood based on content and context
 */
export function analyzeMood(text: string): AnimationMood {
  const lowercaseText = text.toLowerCase();
  
  // Check for specific mood keywords
  for (const [mood, keywords] of Object.entries(IVA_MOOD_KEYWORDS)) {
    if (keywords.some(keyword => lowercaseText.includes(keyword))) {
      return mood as AnimationMood;
    }
  }
  
  // Default to neutral if no specific mood detected
  return 'neutral';
}

/**
 * Gets the appropriate animation mood based on user's token balance
 */
export function getTokenBasedMood(balance: number): AnimationMood {
  if (hasNoAccess(balance)) {
    return 'dismissive';
  } else if (hasLimitedAccess(balance)) {
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
  if (hasNoAccess(balance)) {
    return 1500; // Quick dismissal
  } else if (hasLimitedAccess(balance)) {
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
 * Gets mood duration based on detected mood and context
 */
export function getMoodDuration(text: string, mood: AnimationMood): number {
  const baseTime = 3000; // 3 seconds
  const textLength = text.length;
  
  // Adjust duration based on mood
  const moodMultiplier = {
    'neutral': 1.0,
    'happy': 1.2,
    'sad': 1.5,
    'angry': 0.8,
    'thinking': 1.8,
    'surprised': 0.6,
    'mocking': 1.3,
    'dismissive': 0.7
  };
  
  // Adjust duration based on text length
  const lengthMultiplier = Math.max(0.5, Math.min(2.0, textLength / 100));
  
  return baseTime * moodMultiplier[mood] * lengthMultiplier;
}

/**
 * Gets Iva's response mood based on detected patterns
 */
export function getIvaResponseMood(text: string, userBalance: number): AnimationMood {
  const baseTokenMood = getTokenBasedMood(userBalance);
  
  // Override base mood based on detected patterns
  if (detectManipulationAttempt(text)) {
    return hasLimitedAccess(userBalance) ? 'mocking' : 'dismissive';
  }
  
  if (detectVulnerability(text)) {
    return hasLimitedAccess(userBalance) ? 'mocking' : 'thinking';
  }
  
  // Check for analytical content
  if (IVA_MOOD_KEYWORDS.analytical.some(keyword => 
    text.toLowerCase().includes(keyword))) {
    return 'thinking';
  }
  
  return baseTokenMood;
} 