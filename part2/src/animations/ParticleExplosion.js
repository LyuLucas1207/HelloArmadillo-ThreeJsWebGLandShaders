import { PARTICLE_COUNT, PARTICLE_SPEED, PARTICLE_DURATION, 
         PARTICLE_SIZE } from '../constants/EffectsConstants.js';

/**
 * ParticleExplosion class - Manages particle explosion effects
 */
export class ParticleExplosion {
  /**
   * Creates particle explosion effect at specified position
   * @param {Object} position - Three.js Vector3 position
   * @param {Object} orbColor - Three.js Color object
   * @param {Object} worldFrame - World frame group to add particles to
   * @returns {Object} Particle explosion data object
   */
  createParticleExplosion(position, orbColor, worldFrame) {
    const initialPositions = [];
    const velocities = [];
    const geometry = new THREE.BufferGeometry();
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const direction = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi)
      );
      
      const speed = PARTICLE_SPEED * (0.5 + Math.random() * 1.0);
      const velocity = direction.multiplyScalar(speed);
      
      const offsetRadius = 0.1;
      const offsetX = (Math.random() - 0.5) * offsetRadius;
      const offsetY = (Math.random() - 0.5) * offsetRadius;
      const offsetZ = (Math.random() - 0.5) * offsetRadius;
      
      initialPositions.push(
        position.x + offsetX, 
        position.y + offsetY, 
        position.z + offsetZ
      );
      velocities.push(velocity);
    }
    
    geometry.setAttribute(
      'position', 
      new THREE.Float32BufferAttribute(initialPositions.slice(), 3)
    );
    
    const material = new THREE.PointsMaterial({
      color: orbColor || new THREE.Color(1, 1, 0),
      size: PARTICLE_SIZE,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const particleSystem = new THREE.Points(geometry, material);
    worldFrame.add(particleSystem);
    
    return {
      particles: particleSystem,
      initialPositions: initialPositions,
      velocities: velocities,
      startTime: performance.now(),
      isComplete: false,
      duration: PARTICLE_DURATION
    };
  }

  /**
   * Updates particle explosion animation state and positions
   * @param {Object} particleData - Particle explosion data object
   * @param {number} currentTime - Current timestamp in milliseconds
   * @returns {boolean} True if animation is complete, false otherwise
   */
  updateParticleExplosion(particleData, currentTime) {
    if (particleData.isComplete) return true;
    
    const elapsed = currentTime - particleData.startTime;
    const progress = Math.min(elapsed / particleData.duration, 1.0);
    
    if (progress >= 1.0) {
      particleData.isComplete = true;
      return true;
    }
    
    const positions = 
      particleData.particles.geometry.attributes.position.array;
    const totalTime = elapsed * 0.001;
    
    for (let i = 0; i < particleData.velocities.length; i++) {
      const velocity = particleData.velocities[i];
      const index = i * 3;
      const initialIndex = i * 3;
      
      positions[index] = particleData.initialPositions[initialIndex] + 
                         velocity.x * totalTime;
      positions[index + 1] = 
        particleData.initialPositions[initialIndex + 1] + 
        velocity.y * totalTime;
      positions[index + 2] = 
        particleData.initialPositions[initialIndex + 2] + 
        velocity.z * totalTime;
    }
    
    particleData.particles.geometry.attributes.position.needsUpdate = true;
    const gaussianDecay = Math.exp(-progress * progress * 3.0);
    particleData.particles.material.opacity = gaussianDecay;

    return false;
  }

  /**
   * Removes particle explosion and disposes resources
   * @param {Object} particleData - Particle explosion data object
   * @param {Object} scene - Three.js scene object
   */
  removeParticleExplosion(particleData, scene) {
    if (particleData.particles.parent) 
      particleData.particles.parent.remove(particleData.particles);
    particleData.particles.geometry.dispose();
    particleData.particles.material.dispose();
  }
}