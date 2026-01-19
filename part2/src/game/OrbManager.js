import { COLLECTION_DISTANCE } from '../constants/GameConstants.js';

/**
 * OrbManager class - Manages orb-related game logic
 */
export class OrbManager {
  /**
   * @param {OrbCollection} orbCollection - Orb collection instance
   */
  constructor(orbCollection) {
    this.orbCollection = orbCollection;
  }

  /**
   * Gets the current orbs array
   * @returns {Array} Array of collectible orb objects
   */
  getOrbs() {
    return this.orbCollection.getOrbs();
  }

  /**
   * Finds the nearest collectible orb to the armadillo
   * @param {Object} armadilloGroup - Armadillo group object
   * @returns {Object|null} Nearest orb data object or null
   */
  findNearestOrb(armadilloGroup) {
    const armadilloPos = armadilloGroup.position;
    let nearestOrb = null;
    let minDistanceSq = Infinity;
    
    this.orbCollection.getOrbs().forEach((orbData) => {
      if (orbData.collected) return;
      
      const orbPos = orbData.orbPosition.value;
      const dx = armadilloPos.x - orbPos.x;
      const dy = armadilloPos.y - orbPos.y;
      const dz = armadilloPos.z - orbPos.z;
      const distanceSq = dx * dx + dy * dy + dz * dz;
      
      if (distanceSq < minDistanceSq) {
        minDistanceSq = distanceSq;
        nearestOrb = orbData;
      }
    });
    
    return nearestOrb;
  }

  /**
   * Updates materials for all collectible orbs
   */
  updateOrbMaterials() {
    this.orbCollection.getOrbs().forEach((orbData) => {
      if (!orbData.collected && !orbData.animating && 
          orbData.mesh && orbData.mesh.visible) {
        orbData.material.needsUpdate = true;
      }
    });
  }

  /**
   * Updates lighting uniforms based on nearest orb position
   * @param {Armadillo} armadillo - Armadillo instance
   */
  updateNearestOrbLighting(armadillo) {
    const nearestOrb = this.findNearestOrb(armadillo.group);
    if (nearestOrb) {
      const nearestPos = nearestOrb.orbPosition.value;
      armadillo.armadilloMaterial.uniforms.orbPosition.value.set(
        nearestPos.x, nearestPos.y, nearestPos.z
      );
      armadillo.boxingGloveMaterial.uniforms.orbPosition.value.set(
        nearestPos.x, nearestPos.y, nearestPos.z
      );
    }
  }

  /**
   * Resets the game by cleaning up and regenerating orbs
   */
  reset() {
    this.orbCollection.reset();
  }

  /**
   * Checks for collisions between armadillo and collectible orbs
   * @param {Object} armadilloGroup - Armadillo group object
   * @returns {Array} Array of collection event objects
   */
  checkCollection(armadilloGroup) {
    const collectedEvents = [];
    const armadilloWorldPos = new THREE.Vector3();
    armadilloGroup.getWorldPosition(armadilloWorldPos);
    const collectionDistanceSq = COLLECTION_DISTANCE * COLLECTION_DISTANCE;
    
    this.orbCollection.getOrbs().forEach((orbData) => {
      if (orbData.collected || orbData.animating) return;
      
      const orbWorldPos = new THREE.Vector3();
      orbData.mesh.getWorldPosition(orbWorldPos);
      
      const dx = armadilloWorldPos.x - orbWorldPos.x;
      const dy = armadilloWorldPos.y - orbWorldPos.y;
      const dz = armadilloWorldPos.z - orbWorldPos.z;
      const distanceSq = dx * dx + dy * dy + dz * dz;
      
      if (distanceSq < collectionDistanceSq) {
        orbData.collected = true;
        orbData.animating = true;
        
        const landingPosition = new THREE.Vector3(orbWorldPos.x, 0.7, orbWorldPos.z);
        collectedEvents.push({
          orbData,
          landingPosition
        });
      }
    });

    return collectedEvents;
  }
}
