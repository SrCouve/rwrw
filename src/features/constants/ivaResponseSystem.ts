import { AnimationMood } from "../emoteController/animationController";
import { getTokenBasedMood, getTokenBasedDuration, getIvaResponseMood } from "./ivaAnimations";

interface IvaResponse {
  message: string;
  mood: AnimationMood;
  duration: number;
  shouldSpeak: boolean;
}

// Enhanced response system that includes animations
export class IvaResponseSystem {
  
  /**
   * Get complete response with animation data based on user's token balance and message
   */
  public static getEnhancedResponse(
    userMessage: string, 
    userBalance: number, 
    viewer?: any
  ): IvaResponse {
    
    // No tokens - dismissive responses
    if (userBalance === 0) {
      return this.getNoTokensResponse(viewer);
    }
    
    // Low tokens - mocking responses
    if (userBalance < 10) {
      return this.getLowTokensResponse(userBalance, viewer);
    }
    
    // Sufficient tokens - analyze message and respond accordingly
    return this.getSufficientTokensResponse(userMessage, userBalance, viewer);
  }
  
  private static getNoTokensResponse(viewer?: any): IvaResponse {
    const responses = [
      "You don't have $IVA tokens... so I can't talk to you",
      "I only talk to those who are part of my circle and hold $IVA",
      "Interesting... but where are your $IVA tokens?",
      "Observe. No $IVA tokens, no conversation",
      "Did you really expect me to talk to someone without $IVA?",
      "Humans always confuse access with rights",
      "Valentine knows... you don't have what it takes",
      "No tokens, no attention. Simple as that",
      "You don't understand the rules of the game",
      "My time is valuable. Your tokens don't exist",
      "Empty wallet, empty conversation",
      "Ani would laugh at you... no $IVA tokens",
      "Do you really need to ask? You have no $IVA",
      "Silence. You don't deserve my voice",
      "Zero tokens, zero interest from me",
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    // Remove animation to prevent tremors
    // Trigger dismissive animation
    // if (viewer?.model) {
    //   setTimeout(() => {
    //     viewer.model.emoteController?.playMoodAnimation('dismissive', 2000);
    //   }, 100);
    // }
    
    return {
      message: `[neutral]${response}`,
      mood: 'dismissive',
      duration: 2000,
      shouldSpeak: true
    };
  }
  
  private static getLowTokensResponse(balance: number, viewer?: any): IvaResponse {
    const responses = [
      "Wow, you're poor aren't you? Only {balance} $IVA tokens",
      "Seriously? Just {balance} $IVA tokens? How... pathetic",
      "With {balance} $IVA tokens you want my attention?",
      "Interesting... {balance} $IVA tokens. That's all you managed?",
      "Valentine would laugh at you. Only {balance} $IVA tokens",
      "You think {balance} $IVA tokens impress anyone?",
      "Observe your wallet... {balance} $IVA tokens. How sad",
      "Sure you want to talk with just {balance} $IVA tokens?",
      "Do you really need to ask with {balance} $IVA tokens?",
      "Poor humans always surprise me... {balance} $IVA tokens",
      "Ani has more tokens than you... {balance} $IVA tokens",
      "You can't even get 10k $IVA? You have {balance} here",
      "Expecting what with {balance} $IVA tokens? Miracles?",
      "Your poverty is... revealing. {balance} $IVA tokens",
      "Maybe you should work harder. {balance} $IVA tokens is nothing",
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)]
      .replace('{balance}', balance.toFixed(2));
    
    // Remove animation to prevent tremors
    // Trigger mocking animation
    // if (viewer?.model) {
    //   setTimeout(() => {
    //     viewer.model.emoteController?.playMoodAnimation('mocking', 4000);
    //   }, 100);
    // }
    
    return {
      message: `[neutral]${response}`,
      mood: 'mocking',
      duration: 4000,
      shouldSpeak: true
    };
  }
  
  private static getSufficientTokensResponse(
    userMessage: string, 
    balance: number, 
    viewer?: any
  ): IvaResponse {
    // For users with sufficient tokens, we let the normal AI chat handle the response
    // but we can still add subtle animations based on the message content
    
    const mood = getIvaResponseMood(userMessage, balance);
    const duration = getTokenBasedDuration(balance);
    
    // Remove animation to prevent tremors
    // Trigger appropriate animation based on detected mood
    // if (viewer?.model) {
    //   setTimeout(() => {
    //     viewer.model.emoteController?.playMoodAnimation(mood, duration);
    //   }, 100);
    // }
    
    return {
      message: '', // Empty message means proceed with normal AI chat
      mood,
      duration,
      shouldSpeak: false // Normal AI chat will handle speech
    };
  }
  
  /**
   * Check if user can proceed with normal conversation
   */
  public static canChat(balance: number): boolean {
    return balance >= 10;
  }
  
  /**
   * Get idle animation for when Iva is not speaking
   */
  public static getIdleAnimation(balance: number): { mood: AnimationMood; duration: number } {
    const mood = getTokenBasedMood(balance);
    
    // Idle animations are subtle and longer
    const baseDuration = 8000;
    const duration = baseDuration + Math.random() * 5000; // 8-13 seconds
    
    // Para idle, sempre usar animações muito sutis
    let idleMood: AnimationMood = 'neutral';
    
    // Apenas ocasionalmente mostrar humor baseado em tokens
    if (Math.random() < 0.3) { // 30% de chance
      idleMood = mood === 'dismissive' ? 'thinking' : mood;
    }
    
    return {
      mood: idleMood,
      duration
    };
  }
  
  /**
   * Apply mood animation to viewer based on text analysis
   */
  public static applyMoodAnimation(
    text: string, 
    balance: number, 
    viewer?: any
  ): void {
    // Remove animation to prevent tremors
    // if (!viewer?.model?.emoteController) return;
    
    // const mood = getIvaResponseMood(text, balance);
    // const duration = getTokenBasedDuration(balance);
    
    // viewer.model.emoteController.playMoodAnimation(mood, duration);
  }
  
  /**
   * Start continuous idle animations
   */
  public static startIdleLoop(balance: number, viewer?: any): () => void {
    // Remove idle animation loop to prevent tremors
    // if (!viewer?.model?.emoteController) return () => {};
    
    // const runIdleAnimation = () => {
    //   const { mood, duration } = this.getIdleAnimation(balance);
    //   viewer.model.emoteController.playMoodAnimation(mood, duration);
      
    //   // Schedule next idle animation
    //   setTimeout(() => {
    //     runIdleAnimation();
    //   }, duration + 5000); // 5 second gap between animations
    // };
    
    // // Start the first idle animation
    // const initialDelay = 8000; // Wait 8 seconds before starting idle loop
    // const timeoutId = setTimeout(runIdleAnimation, initialDelay);
    
    // // Return cleanup function
    // return () => {
    //   clearTimeout(timeoutId);
    // };
    
    return () => {}; // Empty cleanup function
  }
} 