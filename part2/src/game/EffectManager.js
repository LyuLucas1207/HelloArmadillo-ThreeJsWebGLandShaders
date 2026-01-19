/**
 * EffectManager class - Manages all visual effects (animations and particles)
 */
export class EffectManager {
  /**
   * @param {Object} scene - Three.js scene object
   * @param {Object} worldFrame - World frame group
   * @param {BounceAnimation} bounceAnimation - Bounce animation instance
   * @param {ParticleExplosion} particleExplosion - Particle explosion instance
   * @param {OrbCollection} orbCollection - Orb collection instance
   */
  constructor(
    scene,
    worldFrame,
    bounceAnimation,
    particleExplosion,
    orbCollection
  ) {
    this.scene = scene;
    this.worldFrame = worldFrame;
    this.bounceAnimation = bounceAnimation;
    this.particleExplosion = particleExplosion;
    this.orbCollection = orbCollection;
    this.activeAnimations = [];
    this.activeParticles = [];
  }

  /**
   * Starts a new orb collection animation
   * @param {Object} orbData - Orb data object
   * @param {Object} landingPosition - Landing position for the orb
   */
  startAnimation(orbData, landingPosition) {
    const animation = this.bounceAnimation.createOrbAnimation(orbData, landingPosition);
    this.activeAnimations.push(animation);
  }

  /**
   * Updates all active orb bounce animations
   * @param {number} currentTime - Current timestamp in milliseconds
   */
  handleOrbBounceAnimations(currentTime) {
    for (let i = this.activeAnimations.length - 1; i >= 0; i--) {
      const animation = this.activeAnimations[i];
      const isComplete = this.bounceAnimation.updateOrbAnimation(animation, currentTime);
      
      if (isComplete) {
        const landingPos = new THREE.Vector3(
          animation.orbData.mesh.position.x,
          animation.startY,
          animation.orbData.mesh.position.z
        );
        
        const orbData = animation.orbData;
        const orbColorUniform = orbData.material.uniforms.orbColor;
        const orbColorVec = orbColorUniform ? orbColorUniform.value : null;
        const orbColor = orbColorVec ? 
          new THREE.Color(orbColorVec.x, orbColorVec.y, orbColorVec.z) :
          new THREE.Color(1, 1, 0);
        
        const particleData = this.particleExplosion.createParticleExplosion(
          landingPos, orbColor, this.worldFrame);
        particleData.orbData = orbData;
        this.activeParticles.push(particleData);
        
        orbData.mesh.visible = false;
        this.activeAnimations.splice(i, 1);
      }
    }
  }

  /**
   * Updates all active particle explosions
   * @param {number} currentTime - Current timestamp in milliseconds
   */
  handleParticleExplosions(currentTime) {
    for (let i = this.activeParticles.length - 1; i >= 0; i--) {
      const particleData = this.activeParticles[i];
      const isComplete = this.particleExplosion.updateParticleExplosion(particleData, currentTime);
      
      if (isComplete) {
        if (particleData.orbData) 
          this.orbCollection.disposeOrb(particleData.orbData);
        this.particleExplosion.removeParticleExplosion(particleData, this.scene);
        this.activeParticles.splice(i, 1);
      }
    }
  }

  /**
   * Updates all active effects (animations and particles)
   * @param {number} currentTime - Current timestamp in milliseconds
   */
  updateEffects(currentTime) {
    this.handleOrbBounceAnimations(currentTime);
    this.handleParticleExplosions(currentTime);
  }

  /**
   * Cleans up all active effects
   */
  cleanupActiveEffects() {
    this.activeAnimations.forEach(animation => {
      if (animation.orbData && animation.orbData.mesh) 
        animation.orbData.mesh.visible = false;
    });
    this.activeAnimations.length = 0;
    
    this.activeParticles.forEach(particleData => {
      if (particleData.orbData) 
        this.orbCollection.disposeOrb(particleData.orbData);
      this.particleExplosion.removeParticleExplosion(particleData, this.scene);
    });
    this.activeParticles.length = 0;
  }
}
