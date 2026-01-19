import { RADIUS, LIGHT_INTENSITY, LIGHT_STRENGTH } 
  from '../constants/ModelConstants.js';
import { FLOOR_WIDTH, getFloorBoundary } 
  from '../constants/FloorConstants.js';
import { COLLECTIBLE_ORB_COUNT } from '../constants/GameConstants.js';
import { createSphereMaterial } from './Materials.js';

/**
 * Creates a single orb mesh
 * @param {Object} sphereMaterial - Material for the sphere
 * @param {Object} worldFrame - World frame group to add orb to
 * @returns {Object} Three.js mesh object
 */
const createOrb = (sphereMaterial, worldFrame) => {
  const sphereGeometry = new THREE.SphereGeometry(RADIUS, 32.0, 32.0);
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(0.0, 1.0, 0.0);
  worldFrame.add(sphere);
  return sphere;
};

/**
 * Creates point light for orb
 */
const createOrbLight = (scene) => {
  const sphereLight = new THREE.PointLight(0xffffff, LIGHT_INTENSITY, LIGHT_STRENGTH);
  scene.add(sphereLight);
  return sphereLight;
};

/**
 * Updates orb light position to match orb position
 * @param {Object} sphereLight - Three.js point light object
 * @param {Object} orbPosition - Orb position uniform object
 */
const updateOrbLight = (sphereLight, orbPosition) => {
  sphereLight.position.set(orbPosition.value.x, orbPosition.value.y, orbPosition.value.z);
};

/**
 * Creates a collectible orb
 */
const createCollectibleOrb = (x, z, worldFrame, scene, orbColor = null) => {
  const orbPos = { type: 'v3', value: new THREE.Vector3(x, RADIUS, z) };
  const orbMat = createSphereMaterial(orbPos, orbColor);
  
  const orb = createOrb(orbMat, worldFrame);
  orb.position.set(x, RADIUS, z);
  
  const orbLight = createOrbLight(scene);
  updateOrbLight(orbLight, orbPos);
  
  return {
    mesh: orb,
    material: orbMat,
    orbPosition: orbPos,
    light: orbLight,
    collected: false,
    animating: false
  };
};

/**
 * OrbCollection class - Manages collection of collectible orbs
 */
export class OrbCollection {
  /**
   * @param {Object} scene - Three.js scene object
   * @param {Object} worldFrame - World frame group
   */
  constructor(scene, worldFrame) {
    this.scene = scene;
    this.worldFrame = worldFrame;
    this.orbs = [];
    this.generateOrbs();
  }

  /**
   * Generates multiple collectible orbs at random positions
   */
  generateOrbs() {
    const floorBoundary = getFloorBoundary(FLOOR_WIDTH);
    this.orbs = [];
    
    for (let i = 0; i < COLLECTIBLE_ORB_COUNT; i++) {
      const x = (Math.random() * 2 - 1) * floorBoundary;
      const z = (Math.random() * 2 - 1) * floorBoundary;
      
      const randomColor = {
        type: 'v3',
        value: new THREE.Vector3(
          Math.random(),
          Math.random(),
          Math.random()
        )
      };
      
      const orbData = createCollectibleOrb(x, z, this.worldFrame, this.scene, randomColor);
      this.orbs.push(orbData);
    }
  }

  /**
   * Gets the current orbs array
   * @returns {Array} Array of collectible orb data objects
   */
  getOrbs() {
    return this.orbs;
  }

  /**
   * Disposes a single orb
   * @param {Object} orbData - Orb data object to dispose
   */
  disposeOrb(orbData) {
    if (orbData.mesh) {
      if (orbData.mesh.parent) orbData.mesh.parent.remove(orbData.mesh);
      if (orbData.mesh.geometry) orbData.mesh.geometry.dispose();
      if (orbData.mesh.material) orbData.mesh.material.dispose();
    }
    if (orbData.light) this.scene.remove(orbData.light);
  }

  /**
   * Disposes all orbs in the collection
   */
  disposeAllOrbs() {
    this.orbs.forEach(orbData => this.disposeOrb(orbData));
    this.orbs = [];
  }

  /**
   * Resets the collection by cleaning up and regenerating orbs
   */
  reset() {
    this.disposeAllOrbs();
    this.generateOrbs();
  }
}