import { AnimationMood } from './animationController';

export class MoodAnalyzer {
  private static readonly MOOD_KEYWORDS = {
    happy: [
      'feliz', 'alegre', 'animada', 'contente', 'satisfeita', 'positiva', 'otimista',
      'radiante', 'eufórica', 'entusiasmada', 'happy', 'joy', 'excited', 'wonderful',
      'amazing', 'fantastic', 'great', 'excellent', 'smile', 'laugh', 'celebration'
    ],
    sad: [
      'triste', 'melancólica', 'deprimida', 'desanimada', 'abatida', 'pessimista',
      'desesperada', 'lamentável', 'aflita', 'chorosa', 'sad', 'sorry', 'unfortunate',
      'disappointing', 'regret', 'mourn', 'grief', 'sorrow', 'tears', 'cry'
    ],
    angry: [
      'raiva', 'irritada', 'furiosa', 'brava', 'enfurecida', 'indignada', 'revoltada',
      'exasperada', 'irada', 'colérica', 'angry', 'furious', 'mad', 'rage', 'hate',
      'disgusted', 'annoyed', 'frustrated', 'outraged', 'damn', 'hell'
    ],
    thinking: [
      'pensando', 'refletindo', 'analisando', 'considerando', 'ponderando', 'avaliando',
      'calculando', 'estudando', 'investigando', 'cogitando', 'thinking', 'consider',
      'analyze', 'ponder', 'reflect', 'contemplate', 'evaluate', 'hmm', 'wonder',
      'curious', 'interesting', 'perhaps', 'maybe', 'possibly'
    ],
    surprised: [
      'surpresa', 'chocada', 'espantada', 'admirada', 'atônita', 'perplexa',
      'impressionada', 'assombrada', 'estupefata', 'boquiaberta', 'surprised',
      'shocked', 'amazed', 'astonished', 'stunned', 'wow', 'incredible',
      'unbelievable', 'remarkable', 'extraordinary', 'oh', 'really'
    ],
    mocking: [
      'zombando', 'sarcástica', 'irônica', 'debochada', 'escarnecendo', 'ridicularizando',
      'troçando', 'caçoando', 'satirizando', 'provocando', 'mockery', 'sarcasm',
      'ridiculous', 'pathetic', 'laughable', 'absurd', 'foolish', 'silly',
      'obviously', 'clearly', 'surely', 'of course', 'wow really', 'hah'
    ],
    dismissive: [
      'dispensando', 'rejeitando', 'ignorando', 'descartando', 'desprezando',
      'menosprezando', 'desdenhando', 'desmerecendo', 'dismissive', 'ignore',
      'whatever', 'boring', 'uninteresting', 'irrelevant', 'pointless',
      'waste', 'useless', 'meaningless', 'meh', 'nah', 'pass'
    ]
  };

  private static readonly CONTEXTUAL_PATTERNS = {
    mocking: [
      'wow.*poor', 'only.*tokens', 'pathetic.*balance', 'impressive.*not',
      'such.*wealth', 'clearly.*rich', 'obviously.*loaded'
    ],
    dismissive: [
      'I.*won\'t.*talk', 'no.*tokens.*no.*conversation', 'come.*back.*when',
      'without.*tokens', 'not.*worth.*my.*time'
    ],
    thinking: [
      'let.*me.*think', 'analyzing.*your', 'processing.*information',
      'calculating.*probability', 'considering.*options'
    ],
    surprised: [
      'wait.*what', 'hold.*on', 'that\'s.*unexpected', 'interesting.*turn',
      'didn\'t.*expect'
    ]
  };

  /**
   * Analyzes the text to determine the dominant mood
   */
  public static analyzeMood(text: string): AnimationMood {
    const lowerText = text.toLowerCase();
    const moodScores: Record<AnimationMood, number> = {
      neutral: 0,
      happy: 0,
      sad: 0,
      angry: 0,
      thinking: 0,
      surprised: 0,
      mocking: 0,
      dismissive: 0
    };

    // Analyze keywords
    Object.entries(this.MOOD_KEYWORDS).forEach(([mood, keywords]) => {
      keywords.forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
        const matches = lowerText.match(regex);
        if (matches) {
          moodScores[mood as AnimationMood] += matches.length;
        }
      });
    });

    // Analyze contextual patterns
    Object.entries(this.CONTEXTUAL_PATTERNS).forEach(([mood, patterns]) => {
      patterns.forEach(pattern => {
        const regex = new RegExp(pattern, 'gi');
        if (regex.test(lowerText)) {
          moodScores[mood as AnimationMood] += 3; // Higher weight for contextual patterns
        }
      });
    });

    // Special rules for Iva's character
    moodScores.mocking += this.detectMockingTone(lowerText);
    moodScores.dismissive += this.detectDismissiveTone(lowerText);
    moodScores.thinking += this.detectAnalyticalTone(lowerText);

    // Find the mood with the highest score
    const dominantMood = Object.entries(moodScores)
      .filter(([mood]) => mood !== 'neutral')
      .reduce((a, b) => moodScores[a[0] as AnimationMood] > moodScores[b[0] as AnimationMood] ? a : b, ['neutral', 0]);

    // Return neutral if no strong mood is detected
    if (dominantMood[1] === 0) {
      return 'neutral';
    }

    return dominantMood[0] as AnimationMood;
  }

  private static detectMockingTone(text: string): number {
    let score = 0;
    
    // Detect sarcastic phrases
    const sarcasticPhrases = [
      'how.*impressive', 'what.*fortune', 'such.*wealth',
      'clearly.*rich', 'obviously.*loaded', 'wow.*amazing',
      'so.*generous', 'incredible.*amount'
    ];
    
    sarcasticPhrases.forEach(phrase => {
      if (new RegExp(phrase, 'gi').test(text)) {
        score += 2;
      }
    });

    // Detect token-related mockery
    if (text.includes('token') && (text.includes('poor') || text.includes('only') || text.includes('pathetic'))) {
      score += 3;
    }

    // Detect ellipsis (often used for dramatic effect)
    const ellipsisCount = (text.match(/\.\.\./g) || []).length;
    score += ellipsisCount;

    return score;
  }

  private static detectDismissiveTone(text: string): number {
    let score = 0;
    
    // Detect dismissive phrases
    const dismissivePhrases = [
      'won\'t.*talk', 'can\'t.*talk', 'no.*conversation',
      'not.*worth', 'waste.*time', 'come.*back.*when'
    ];
    
    dismissivePhrases.forEach(phrase => {
      if (new RegExp(phrase, 'gi').test(text)) {
        score += 2;
      }
    });

    // Detect short, curt responses
    if (text.length < 50 && text.includes('no')) {
      score += 1;
    }

    return score;
  }

  private static detectAnalyticalTone(text: string): number {
    let score = 0;
    
    // Detect analytical phrases
    const analyticalPhrases = [
      'analyzing', 'calculating', 'processing', 'evaluating',
      'considering', 'examining', 'studying', 'investigating'
    ];
    
    analyticalPhrases.forEach(phrase => {
      if (new RegExp(phrase, 'gi').test(text)) {
        score += 2;
      }
    });

    // Detect technical language
    const technicalWords = [
      'data', 'information', 'probability', 'algorithm',
      'system', 'process', 'logic', 'pattern'
    ];
    
    technicalWords.forEach(word => {
      if (new RegExp(`\\b${word}\\b`, 'gi').test(text)) {
        score += 1;
      }
    });

    return score;
  }

  /**
   * Get mood duration based on the intensity of the detected mood
   */
  public static getMoodDuration(text: string, mood: AnimationMood): number {
    const baseLength = text.length;
    const baseDuration = 3000; // 3 seconds
    
    // Adjust duration based on text length and mood type
    let duration = baseDuration;
    
    if (baseLength > 100) {
      duration += 1000; // Add 1 second for longer texts
    }
    
    switch (mood) {
      case 'angry':
        duration += 1000; // Anger lasts longer
        break;
      case 'surprised':
        duration -= 500; // Surprise is quick
        break;
      case 'thinking':
        duration += 2000; // Thinking is prolonged
        break;
      case 'mocking':
        duration += 1500; // Mocking is extended
        break;
      case 'dismissive':
        duration -= 1000; // Dismissive is quick
        break;
    }
    
    return Math.max(duration, 1000); // Minimum 1 second
  }
} 