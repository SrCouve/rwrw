import * as THREE from "three";
import { VRM, VRMExpressionPresetName } from "@pixiv/three-vrm";
import { ExpressionController } from "./expressionController";
import { AnimationController, AnimationMood } from "./animationController";
import { MoodAnalyzer } from "./moodAnalyzer";

/**
 * 感情表現としてExpressionとMotionを操作する為のクラス
 * アニメーションとエクスプレッションの両方を管理
 */
export class EmoteController {
  private _expressionController: ExpressionController;
  private _animationController: AnimationController;

  constructor(vrm: VRM, camera: THREE.Object3D) {
    this._expressionController = new ExpressionController(vrm, camera);
    this._animationController = new AnimationController(vrm);
  }

  public playEmotion(preset: VRMExpressionPresetName) {
    this._expressionController.playEmotion(preset);
  }

  public lipSync(preset: VRMExpressionPresetName, value: number) {
    this._expressionController.lipSync(preset, value);
  }

  /**
   * Analyzes text and plays appropriate mood animation
   */
  public playMoodFromText(text: string) {
    const mood = MoodAnalyzer.analyzeMood(text);
    const duration = MoodAnalyzer.getMoodDuration(text, mood);
    
    // Play mood animation
    this._animationController.playMoodAnimation(mood, duration);
    
    // Also play corresponding facial expression
    this.playMoodExpression(mood);
  }

  /**
   * Plays facial expression based on mood
   */
  private playMoodExpression(mood: AnimationMood) {
    switch (mood) {
      case 'happy':
        this._expressionController.playEmotion('happy');
        break;
      case 'sad':
        this._expressionController.playEmotion('sad');
        break;
      case 'angry':
        this._expressionController.playEmotion('angry');
        break;
      case 'surprised':
        this._expressionController.playEmotion('surprised');
        break;
      case 'mocking':
        // Use a smug expression for mocking
        this._expressionController.playEmotion('relaxed');
        break;
      case 'dismissive':
        // Use neutral with slight annoyance
        this._expressionController.playEmotion('neutral');
        break;
      case 'thinking':
        this._expressionController.playEmotion('neutral');
        break;
      default:
        this._expressionController.playEmotion('neutral');
        break;
    }
  }

  /**
   * Directly play mood animation
   */
  public playMoodAnimation(mood: AnimationMood, duration?: number) {
    this._animationController.playMoodAnimation(mood, duration);
    this.playMoodExpression(mood);
  }

  /**
   * Get current mood
   */
  public getCurrentMood(): AnimationMood {
    return this._animationController.getCurrentMood();
  }

  public update(delta: number) {
    this._expressionController.update(delta);
    this._animationController.update(delta);
  }

  public dispose() {
    this._animationController.dispose();
  }
}
