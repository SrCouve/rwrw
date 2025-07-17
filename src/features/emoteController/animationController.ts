import * as THREE from "three";
import { VRM } from "@pixiv/three-vrm";
import { loadVRMAnimation } from "@/lib/VRMAnimation/loadVRMAnimation";
import { buildUrl } from "@/utils/buildUrl";

export type AnimationMood = 'neutral' | 'happy' | 'sad' | 'angry' | 'thinking' | 'surprised' | 'mocking' | 'dismissive';

export class AnimationController {
  private vrm: VRM;
  private mixer: THREE.AnimationMixer;
  private currentAction: THREE.AnimationAction | null = null;
  private idleAction: THREE.AnimationAction | null = null;
  private isInitialized = false;
  private currentMood: AnimationMood = 'neutral';
  private moodTimer: NodeJS.Timeout | null = null;
  private lastAnimationTime = 0;
  private animationCooldown = 1000; // 1 segundo de cooldown entre animações

  constructor(vrm: VRM) {
    this.vrm = vrm;
    this.mixer = new THREE.AnimationMixer(vrm.scene);
    this.init();
  }

  private async init() {
    try {
      // Load the idle animation
      await this.loadIdleAnimation();
      this.isInitialized = true;
      this.startIdleAnimation();
    } catch (error) {
      console.error('Failed to initialize animation controller:', error);
    }
  }

  private async loadIdleAnimation() {
    try {
      const idleAnimation = await loadVRMAnimation(buildUrl('/idle_loop.vrma'));
      if (idleAnimation) {
        const clip = idleAnimation.createAnimationClip(this.vrm);
        this.idleAction = this.mixer.clipAction(clip);
        this.idleAction.loop = THREE.LoopRepeat;
        this.idleAction.clampWhenFinished = true;
        this.idleAction.weight = 1.0;
      }
    } catch (error) {
      console.error('Failed to load idle animation:', error);
    }
  }

  private startIdleAnimation() {
    if (this.idleAction) {
      this.idleAction.play();
      this.currentAction = this.idleAction;
    }
  }

  public playMoodAnimation(mood: AnimationMood, duration: number = 3000) {
    if (!this.isInitialized) return;

    const currentTime = Date.now();
    
    // Verifica cooldown para evitar animações muito frequentes
    if (currentTime - this.lastAnimationTime < this.animationCooldown) {
      console.log('Animation cooldown active, skipping animation');
      return;
    }

    this.currentMood = mood;
    this.lastAnimationTime = currentTime;
    
    // Clear existing mood timer
    if (this.moodTimer) {
      clearTimeout(this.moodTimer);
    }

    // Apply mood-based modifications to the idle animation
    this.applyMoodModifications(mood);

    // Reset to neutral after duration
    this.moodTimer = setTimeout(() => {
      this.resetToNeutral();
    }, duration);
  }

  private applyMoodModifications(mood: AnimationMood) {
    if (!this.currentAction) return;

    const action = this.currentAction;
    
    switch (mood) {
      case 'happy':
        action.setEffectiveTimeScale(1.05); // Mais sutil
        this.addHeadTilt(0.05); // Reduzido pela metade
        break;
      
      case 'sad':
        action.setEffectiveTimeScale(0.9); // Menos dramático
        this.addHeadTilt(-0.05); // Reduzido pela metade
        break;
      
      case 'angry':
        action.setEffectiveTimeScale(1.1); // Menos agressivo
        this.addBodyTension(0.1); // Reduzido pela metade
        break;
      
      case 'thinking':
        action.setEffectiveTimeScale(0.95); // Mais sutil
        this.addHeadTilt(0.03); // Muito sutil
        break;
      
      case 'surprised':
        action.setEffectiveTimeScale(1.15); // Menos dramático
        this.addQuickMovement();
        break;
      
      case 'mocking':
        action.setEffectiveTimeScale(1.05); // Mais sutil
        this.addSarcastic();
        break;
      
      case 'dismissive':
        action.setEffectiveTimeScale(0.85); // Menos dramático
        this.addDismissiveGesture();
        break;
      
      default:
        action.setEffectiveTimeScale(1.0);
        break;
    }
  }

  private addHeadTilt(angle: number) {
    const headBone = this.vrm.humanoid.getNormalizedBoneNode('head');
    if (headBone) {
      const targetRotation = new THREE.Euler(0, 0, angle);
      this.animateRotation(headBone, targetRotation, 2000); // Dobrei a duração
    }
  }

  private addBodyTension(intensity: number) {
    const spine = this.vrm.humanoid.getNormalizedBoneNode('spine');
    if (spine) {
      const targetRotation = new THREE.Euler(intensity * 0.05, 0, 0); // Reduzido pela metade
      this.animateRotation(spine, targetRotation, 1500); // Triplicei a duração
    }
  }

  private addQuickMovement() {
    // Add subtle movements to simulate surprise - mais suave
    const head = this.vrm.humanoid.getNormalizedBoneNode('head');
    if (head) {
      const originalRotation = head.rotation.clone();
      const quickRotation = new THREE.Euler(0.02, 0, 0); // Reduzido significativamente
      
      this.animateRotation(head, quickRotation, 800); // Muito mais lento
      setTimeout(() => {
        this.animateRotation(head, originalRotation, 1200); // Muito mais lento
      }, 800);
    }
  }

  private addSarcastic() {
    // Slight shoulder shrug and head tilt for sarcastic mood - mais sutil
    const leftShoulder = this.vrm.humanoid.getNormalizedBoneNode('leftShoulder');
    const rightShoulder = this.vrm.humanoid.getNormalizedBoneNode('rightShoulder');
    
    if (leftShoulder && rightShoulder) {
      const shrug = new THREE.Euler(0.05, 0, 0); // Reduzido pela metade
      this.animateRotation(leftShoulder, shrug, 1500); // Quase dobrei a duração
      this.animateRotation(rightShoulder, shrug, 1500);
    }
  }

  private addDismissiveGesture() {
    // Subtle head turn away - mais sutil
    const head = this.vrm.humanoid.getNormalizedBoneNode('head');
    if (head) {
      const dismissive = new THREE.Euler(0, -0.05, 0); // Reduzido pela metade
      this.animateRotation(head, dismissive, 2000); // Dobrei a duração
    }
  }

  private animateRotation(bone: THREE.Object3D, targetRotation: THREE.Euler, duration: number) {
    const startRotation = bone.rotation.clone();
    const startTime = performance.now();

    const animate = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Muito mais suave com easing cúbico
      const eased = this.easeInOutCubic(progress);

      bone.rotation.x = THREE.MathUtils.lerp(startRotation.x, targetRotation.x, eased);
      bone.rotation.y = THREE.MathUtils.lerp(startRotation.y, targetRotation.y, eased);
      bone.rotation.z = THREE.MathUtils.lerp(startRotation.z, targetRotation.z, eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  private easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  private resetToNeutral() {
    if (!this.currentAction) return;

    this.currentAction.setEffectiveTimeScale(1.0);
    this.currentMood = 'neutral';

    // Reset bone rotations to neutral - mais suave e lento
    const bones = ['head', 'spine', 'leftShoulder', 'rightShoulder'];
    bones.forEach(boneName => {
      const bone = this.vrm.humanoid.getNormalizedBoneNode(boneName as any);
      if (bone) {
        this.animateRotation(bone, new THREE.Euler(0, 0, 0), 3000); // 3 segundos para voltar ao neutro
      }
    });
  }

  public update(delta: number) {
    if (this.mixer) {
      this.mixer.update(delta);
    }
  }

  public getCurrentMood(): AnimationMood {
    return this.currentMood;
  }

  public dispose() {
    if (this.moodTimer) {
      clearTimeout(this.moodTimer);
    }
    this.mixer.stopAllAction();
  }
} 