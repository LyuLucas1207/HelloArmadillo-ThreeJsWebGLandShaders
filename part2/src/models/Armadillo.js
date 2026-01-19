import { 
  ARMADILLO_INITIAL_POSITION, 
  RIGHT_POSITION, 
  RIGHT_SCALE, 
  RIGHT_ROTATION, 
  LEFT_POSITION, 
  LEFT_SCALE, 
  LEFT_ROTATION 
} from '../constants/ModelConstants.js';
import { createArmadilloMaterial, createBoxingGloveMaterial } from './Materials.js';

/**
 * Loads armadillo 3D model from OBJ file
 * @param {Object} armadilloMaterial - Material for armadillo
 * @param {Object} scene - Three.js scene object
 * @param {Object} worldFrame - World frame group
 * @param {Object|null} parentGroup - Optional parent group
 */
const loadArmadillo = (armadilloMaterial, scene, worldFrame, parentGroup) => {
  loadAndPlaceOBJ('obj/armadillo.obj', armadilloMaterial, (armadillo) => {
    armadillo.position.set(0, 0, 0);
    armadillo.rotation.y = Math.PI;
    armadillo.scale.set(-0.1, 0.1, -0.1);
    
    if (parentGroup) parentGroup.add(armadillo);
    else { 
      armadillo.parent = worldFrame; 
      scene.add(armadillo); 
    }
  });
};

/**
 * Loads boxing glove 3D model from OBJ file
 * @param {Object} boxingGloveMaterial - Material for boxing glove
 * @param {Object} scene - Three.js scene object
 * @param {Object} worldFrame - World frame group
 * @param {Object} position - Position object with x, y, z
 * @param {Object} scale - Scale object with x, y, z
 * @param {Object} rotation - Rotation object with x, y, z
 * @param {Object|null} parentGroup - Optional parent group
 */
const loadBoxingGlove = (boxingGloveMaterial, scene, worldFrame, position, scale, rotation, parentGroup) => {
  loadAndPlaceOBJ('obj/boxing_glove.obj', boxingGloveMaterial, (boxingGlove) => {
    boxingGlove.position.set(position.x, position.y, position.z);
    boxingGlove.rotation.x = rotation.x * Math.PI;
    boxingGlove.rotation.y = rotation.y * Math.PI;
    boxingGlove.rotation.z = rotation.z * Math.PI;
    boxingGlove.scale.set(scale.x, scale.y, scale.z);
    
    if (parentGroup) parentGroup.add(boxingGlove);
    else { boxingGlove.parent = worldFrame; scene.add(boxingGlove); }
  });
};

/**
 * Armadillo class - Manages armadillo 3D model and its materials
 */
export class Armadillo {
  /**
   * @param {Object} scene - Three.js scene object
   * @param {Object} worldFrame - World frame group
   */
  constructor(scene, worldFrame) {
    this.scene = scene;
    this.worldFrame = worldFrame;
    this.armadilloMaterial = createArmadilloMaterial();
    this.boxingGloveMaterial = createBoxingGloveMaterial();
    
    this.group = new THREE.Group();
    this.group.position.set(ARMADILLO_INITIAL_POSITION.x, ARMADILLO_INITIAL_POSITION.y, ARMADILLO_INITIAL_POSITION.z);
    this.group.rotation.set(0, Math.PI, 0);
    this.group.parent = worldFrame;
    scene.add(this.group);

    loadArmadillo(this.armadilloMaterial, scene, worldFrame, this.group);
    loadBoxingGlove(
      this.boxingGloveMaterial, scene, worldFrame, 
      RIGHT_POSITION, RIGHT_SCALE, RIGHT_ROTATION, this.group
    );
    loadBoxingGlove(
      this.boxingGloveMaterial, scene, worldFrame, 
      LEFT_POSITION, LEFT_SCALE, LEFT_ROTATION, this.group
    );
  }

  /**
   * Updates armadillo position in the scene
   * @param {Object} position - Position object with x, y, z
   */
  updatePosition(position) {
    if (this.group) {
      this.group.position.set(position.x, position.y, position.z);
    }
  }

  /**
   * Marks materials as needing update
   */
  markMaterialsForUpdate() {
    if (this.armadilloMaterial) {
      this.armadilloMaterial.needsUpdate = true;
    }
    if (this.boxingGloveMaterial) {
      this.boxingGloveMaterial.needsUpdate = true;
    }
  }

  /**
   * Resets armadillo to initial position and rotation in the scene
   */
  resetPosition() {
    if (this.group) {
      this.group.position.set(
        ARMADILLO_INITIAL_POSITION.x, 
        ARMADILLO_INITIAL_POSITION.y, 
        ARMADILLO_INITIAL_POSITION.z
      );
      this.group.rotation.set(0, Math.PI, 0);
    }
  }
}
