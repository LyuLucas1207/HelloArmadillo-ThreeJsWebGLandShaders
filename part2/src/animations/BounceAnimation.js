import { ORB_BOUNCE_HEIGHT, ORB_BOUNCE_DURATION, ORB_NUM_BOUNCES } 
  from '../constants/EffectsConstants.js';

/**
 * BounceAnimation class - Manages orb bounce animations
 */
export class BounceAnimation {
  /**
   * Creates orb bounce animation object
   * @param {Object} orbData - Orb data object with mesh
   * @param {Object} landingPosition - Landing position vector
   * @returns {Object} Animation object with timing and state
   */
  createOrbAnimation(orbData, landingPosition) {
    const startTime = performance.now();
    const startY = landingPosition.y;
    
    return {
      orbData,
      startTime,
      startY,
      bounceHeight: ORB_BOUNCE_HEIGHT,
      bounceDuration: ORB_BOUNCE_DURATION,
      numBounces: ORB_NUM_BOUNCES,
      isComplete: false
    };
  }

  /**
   * Updates orb bounce animation state and position
   * @param {Object} animation - Animation object to update
   * @param {number} currentTime - Current timestamp in milliseconds
   * @returns {boolean} True if animation is complete, false otherwise
   */
  updateOrbAnimation(animation, currentTime) {
    if (animation.isComplete) return true;
    
    const elapsed = currentTime - animation.startTime;
    const progress = Math.min(elapsed / animation.bounceDuration, 1.0);
    
    if (progress >= 1.0) {
      animation.orbData.mesh.position.y = animation.startY;
      animation.isComplete = true;
      return true;
    }
    
    const bounceProgress = progress * animation.numBounces;
    const bouncePhase = (bounceProgress % 1.0) * Math.PI;
    const bounceIndex = Math.floor(bounceProgress);
    const decayFactor = Math.pow(0.5, bounceIndex);
    
    const bounceOffset = Math.sin(bouncePhase) * animation.bounceHeight * decayFactor;
    animation.orbData.mesh.position.y = animation.startY + bounceOffset;
    
    return false;
  }
}