import { ORB_POSITION, ORB_RADIUS } from '../constants/ModelConstants.js';

/**
 * Creates shader material for armadillo
 * @param {boolean} loadShaders - Whether to load shaders automatically
 * @returns {Object} Three.js ShaderMaterial object
 */
export const createArmadilloMaterial = (loadShaders = true) => {
  const material = new THREE.ShaderMaterial({
    uniforms: {
      orbPosition: ORB_POSITION,
      orbRadius: ORB_RADIUS
    }
  });
  
  if (loadShaders) loadArmadilloShaders(material);
  return material;
};

/**
 * Creates shader material for boxing gloves
 * @param {boolean} loadShaders - Whether to load shaders automatically
 * @returns {Object} Three.js ShaderMaterial object
 */
export const createBoxingGloveMaterial = (loadShaders = true) => {
  const gloveColorMap = new THREE.TextureLoader().load('images/boxing_gloves_texture.png');
  const material = new THREE.ShaderMaterial({
    uniforms: {
      orbPosition: ORB_POSITION,
      orbRadius: ORB_RADIUS,
      gloveColorMap: { value: gloveColorMap }
    }
  });
  
  if (loadShaders) loadBoxingGloveShaders(material);
  return material;
};

/**
 * Creates shader material for orb sphere
 * @param {Object} orbPosition - Position uniform for the orb
 * @param {Object|null} orbColor - Color uniform for the orb
 * @param {boolean} loadShaders - Whether to load shaders automatically
 * @returns {Object} Three.js ShaderMaterial object
 */
export const createSphereMaterial = (orbPosition, orbColor = null, loadShaders = true) => {
  const color = orbColor || { type: 'v3', value: new THREE.Vector3(1.0, 1.0, 0.0) };
  const material = new THREE.ShaderMaterial({
    uniforms: {
      orbPosition: orbPosition,
      orbColor: color
    }
  });
  if (loadShaders) loadSphereShaders(material);
  return material;
};

/**
 * Loads shaders for armadillo material
 * @param {Object} armadilloMaterial - Material to load shaders for
 */
export const loadArmadilloShaders = (armadilloMaterial) => {
  new THREE.SourceLoader().load(
    ['glsl/armadillo.vs.glsl', 'glsl/armadillo.fs.glsl'], 
    (shaders) => {
      armadilloMaterial.vertexShader = shaders['glsl/armadillo.vs.glsl'];
      armadilloMaterial.fragmentShader = shaders['glsl/armadillo.fs.glsl'];
    }
  );
};

/**
 * Loads shaders for boxing glove material
 * @param {Object} boxingGloveMaterial - Material to load shaders for
 */
export const loadBoxingGloveShaders = (boxingGloveMaterial) => {
  new THREE.SourceLoader().load(
    ['glsl/glove.vs.glsl', 'glsl/glove.fs.glsl'], 
    (shaders) => {
      boxingGloveMaterial.vertexShader = shaders['glsl/glove.vs.glsl'];
      boxingGloveMaterial.fragmentShader = shaders['glsl/glove.fs.glsl'];
    }
  );
};

/**
 * Loads shaders for sphere material
 * @param {Object} sphereMaterial - Material to load shaders for
 */
export const loadSphereShaders = (sphereMaterial) => {
  new THREE.SourceLoader().load(
    ['glsl/sphere.vs.glsl', 'glsl/sphere.fs.glsl'], 
    (shaders) => {
      sphereMaterial.vertexShader = shaders['glsl/sphere.vs.glsl'];
      sphereMaterial.fragmentShader = shaders['glsl/sphere.fs.glsl'];
    }
  );
};
