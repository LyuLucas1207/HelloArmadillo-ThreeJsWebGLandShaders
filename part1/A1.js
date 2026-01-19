/*
 * UBC CPSC 314, Vjan2026
 * Assignment 1 Template
 */

// Setup and return the scene and related objects.
// You should look into js/setup.js to see what exactly is done here.
const {
  renderer,
  scene,
  camera,
  worldFrame,
} = setup();

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

// Initialize uniform
const orbPosition = { type: 'v3', value: new THREE.Vector3(0.0, 1.0, 0.0) };
//*====================================(c)====================================*/
const RADIUS = 1.0;
const orbRadius = { type: 'f', value: RADIUS }; // Radius of the orb sphere
//*====================================(c)====================================*/

// Materials: specifying uniforms and shaders
// Boxing gloves: ShaderMaterial with orb lighting, proximity, and deformation (glove shaders for part d)
// Diffuse texture map (this defines the main colors of the boxing glove)
const gloveColorMap = new THREE.TextureLoader().load('images/boxing_gloves_texture.png');
const boxingGloveMaterial = new THREE.ShaderMaterial({
  uniforms: {
    orbPosition: orbPosition,
    orbRadius: orbRadius,
    gloveColorMap: { value: gloveColorMap }
  }
});
//*====================================(b)====================================*/
//*====================================(c)====================================*/
const armadilloMaterial = new THREE.ShaderMaterial({
  uniforms: {
    orbPosition: orbPosition,
    orbRadius: orbRadius
  }
});
//*====================================(b)====================================*/
//*====================================(c)====================================*/
const sphereMaterial = new THREE.ShaderMaterial({
  uniforms: {
    orbPosition: orbPosition
  }
});

// Load shaders.
const shaderFiles = [
  'glsl/armadillo.vs.glsl',
  'glsl/armadillo.fs.glsl',
  'glsl/sphere.vs.glsl',
  'glsl/sphere.fs.glsl',
  'glsl/glove.vs.glsl',
  'glsl/glove.fs.glsl'
];

new THREE.SourceLoader().load(shaderFiles, function (shaders) {
  armadilloMaterial.vertexShader = shaders['glsl/armadillo.vs.glsl'];
  armadilloMaterial.fragmentShader = shaders['glsl/armadillo.fs.glsl'];

  sphereMaterial.vertexShader = shaders['glsl/sphere.vs.glsl'];
  sphereMaterial.fragmentShader = shaders['glsl/sphere.fs.glsl'];

  boxingGloveMaterial.vertexShader = shaders['glsl/glove.vs.glsl'];
  boxingGloveMaterial.fragmentShader = shaders['glsl/glove.fs.glsl'];
})

// Load and place the Armadillo geometry
// Look at the definition of loadOBJ to familiarize yourself with how each parameter
// affects the loaded object.
loadAndPlaceOBJ('obj/armadillo.obj', armadilloMaterial, function (armadillo) {
  armadillo.position.set(0.0, 5.3, -8.0);
  armadillo.rotation.y = Math.PI;
  armadillo.scale.set(0.1, 0.1, 0.1);
  armadillo.parent = worldFrame;
  scene.add(armadillo);
});

// TODO: Add the boxing glove to the scene on top of the Armadillo similar to how the Armadillo
// is added to the scene
//*====================================(a)====================================*/
/*
  position.set(POSITION_X, POSITION_Y, POSITION_Z) = (Right/Left , up/down , Forward/Backward)
  position.set(0.0, 0.0, 0.0) = (Right/Left , up/down , Forward/Backward)
  scale.set(SCALE_X, SCALE_Y, SCALE_Z) = (X-Width|Z , Y-Width|X , Z-Width|Y)
  scale.set(1,1,1) = (X-Width|Z , Y-Width|X , Z-Width|Y)
*/
const RIGHT_POSITION = { 
  x: 5.30, 
  y: 12.3, 
  z: -4.2 
};   
const RIGHT_SCALE = { 
  x: 1.62, 
  y: 1.62, 
  z: 1.62 
};
const RIGHT_ROTATION = { 
  x: 0.40, 
  y: 0.0, 
  z: 1.35 
};
const LEFT_POSITION = { 
  x: -5.30, 
  y: 13.1, 
  z: -5.6 
};
const LEFT_SCALE = { 
  x: -1.62, 
  y: -1.62, 
  z: -1.62 
};
const LEFT_ROTATION = { 
  x: -0.75, 
  y: 0.0, 
  z: 1.35 
};
const boxingGlovePlace = (position, scale, rotation) => {
  return (boxingGlove) => {
    boxingGlove.position.set(position.x, position.y, position.z);
    boxingGlove.rotation.x = rotation.x*Math.PI;
    boxingGlove.rotation.y = rotation.y*Math.PI;
    boxingGlove.rotation.z =rotation.z*Math.PI;
    boxingGlove.scale.set(scale.x, scale.y, scale.z);
    boxingGlove.parent = worldFrame;
    scene.add(boxingGlove);
  }
}
loadAndPlaceOBJ('obj/boxing_glove.obj', boxingGloveMaterial, boxingGlovePlace(RIGHT_POSITION, RIGHT_SCALE, RIGHT_ROTATION));
loadAndPlaceOBJ('obj/boxing_glove.obj', boxingGloveMaterial, boxingGlovePlace(LEFT_POSITION, LEFT_SCALE, LEFT_ROTATION));
//*====================================(a)====================================*/

// Create the sphere geometry
// https://threejs.org/docs/#api/en/geometries/SphereGeometry
// TODO: Make the radius of the orb a variable
// First parameter is radius
// Second parameter is widthSegments
// Third parameter is heightSegments
//The number of horizontal segments. Minimum value is 3.Default is 32.
const sphereGeometry = new THREE.SphereGeometry(RADIUS, 32.0, 32.0);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0.0, 1.0, 0.0);
sphere.parent = worldFrame;
scene.add(sphere);

const sphereLight = new THREE.PointLight(0xffffff, 1, 100);
scene.add(sphereLight);

// Listen to keyboard events.
const keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("W"))
    orbPosition.value.z -= 0.3;
  else if (keyboard.pressed("S"))
    orbPosition.value.z += 0.3;

  if (keyboard.pressed("A"))
    orbPosition.value.x -= 0.3;
  else if (keyboard.pressed("D"))
    orbPosition.value.x += 0.3;

  if (keyboard.pressed("E"))
    orbPosition.value.y -= 0.3;
  else if (keyboard.pressed("Q"))
    orbPosition.value.y += 0.3;

  // The following tells three.js that some uniforms might have changed
  armadilloMaterial.needsUpdate = true;
  boxingGloveMaterial.needsUpdate = true;
  sphereMaterial.needsUpdate = true;

  // Move the sphere light in the scene. This allows the floor to reflect the light as it moves.
  sphereLight.position.set(orbPosition.value.x, orbPosition.value.y, orbPosition.value.z);
}

// Setup update callback
function update() {
  checkKeyboard();

  // Requests the next update call, this creates a loop
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

// Start the animation loop.
update();
