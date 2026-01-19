/**
 * UBC CPSC 314
 * Assignment 1 Template setup
 */

/**
 * Creates a basic scene and returns necessary objects
 * to manipulate the scene, camera and render context.
 * @param {number} floorWidth - Width of the floor plane
 * @param {number} floorHeight - Height of the floor plane
 * @param {number} textureRepeat - Number of times to repeat the texture
 */
function setup(floorWidth, floorHeight, textureRepeat) {
    // Check WebGL Version
    if (!WEBGL.isWebGL2Available()) {
        document.body.appendChild(WEBGL.getWebGL2ErrorMessage());
    }

    // Get the canvas element and its drawing context from the HTML document.
    const canvas = document.getElementById('webglcanvas');
    const context = canvas.getContext('webgl2');

    // Construct a THREEjs renderer from the canvas and context.
    const renderer = new THREE.WebGLRenderer({ canvas, context });
    renderer.setClearColor(0X80CEE1); // blue background colour
    const scene = new THREE.Scene();

    // Set up the camera.
    const camera = new THREE.PerspectiveCamera(40.0, 1.0, 0.1, 1000.0); // view angle, aspect ratio, near, far
    camera.position.set(0.0, 45.0, 105.0);
    camera.lookAt(scene.position);
    scene.add(camera);

    // Setup orbit controls for the camera.
    const controls = new THREE.OrbitControls(camera, canvas);
    controls.damping = 0.2;
    controls.autoRotate = false;

    // Update projection matrix based on the windows size.
    function resize() {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
    window.addEventListener('resize', resize);
    resize();

    // World Coordinate Frame: other objects are defined with respect to it.
    const worldFrame = new THREE.AxesHelper(1);
    scene.add(worldFrame);

    // Diffuse texture map (this defines the main colors of the floor)
    const floorDiff = new THREE.TextureLoader().load('images/cobblestone_floor_diff.jpg');
    floorDiff.wrapS = THREE.RepeatWrapping;
    floorDiff.wrapT = THREE.RepeatWrapping;
    floorDiff.repeat.set(textureRepeat, textureRepeat);
    
    // Ambient occlusion map
    const floorAo = new THREE.TextureLoader().load('images/cobblestone_floor_ao.jpg');
    floorAo.wrapS = THREE.RepeatWrapping;
    floorAo.wrapT = THREE.RepeatWrapping;
    floorAo.repeat.set(textureRepeat, textureRepeat);
    
    // Displacement map
    const floorDisp = new THREE.TextureLoader().load('images/cobblestone_floor_disp.jpg');
    floorDisp.wrapS = THREE.RepeatWrapping;
    floorDisp.wrapT = THREE.RepeatWrapping;
    floorDisp.repeat.set(textureRepeat, textureRepeat);
    
    // Normal map
    const floorNorm = new THREE.TextureLoader().load('images/cobblestone_floor_nor.jpg');
    floorNorm.wrapS = THREE.RepeatWrapping;
    floorNorm.wrapT = THREE.RepeatWrapping;
    floorNorm.repeat.set(textureRepeat, textureRepeat);
    
    // Roughness map
    const floorRoughness = new THREE.TextureLoader().load('images/cobblestone_floor_rough.jpg');
    floorRoughness.wrapS = THREE.RepeatWrapping;
    floorRoughness.wrapT = THREE.RepeatWrapping;
    floorRoughness.repeat.set(textureRepeat, textureRepeat);

    const floorMaterial = new THREE.MeshStandardMaterial({
        map: floorDiff,
        aoMap: floorAo,
        displacementMap: floorDisp,
        normalMap: floorNorm,
        roughnessMap: floorRoughness,
        side: THREE.DoubleSide
    });
    //! PlaneBufferGeometry is a 2D geometry, so we need to use a 2D texture for the floor.
    const floorGeometry = new THREE.PlaneBufferGeometry(floorWidth, floorHeight);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2.0;
    floor.position.y = -0.3;
    scene.add(floor);
    floor.parent = worldFrame;

    // Cast a weak ambient light to make the floor visible.
    const light = new THREE.AmbientLight(0xFFFFFF, 0.5);
    scene.add(light);

    return {
        renderer,
        scene,
        camera,
        worldFrame,
    };
}

/**
 * Utility function that loads obj files using THREE.OBJLoader
 * and places them in the scene using the given callback `place`.
 * 
 * The variable passed into the place callback is a THREE.Object3D.
 */
function loadAndPlaceOBJ(file, material, place) {
    const manager = new THREE.LoadingManager();
    manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };

    const onProgress = function (xhr) {
        if (xhr.lengthComputable) {
            const percentComplete = xhr.loaded / xhr.total * 100.0;
            console.log(Math.round(percentComplete, 2) + '% downloaded');
        }
    };

    const loader = new THREE.OBJLoader(manager);
    loader.load(file, function (object) {
        object.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material = material;
            }
        });
        place(object);
    }, onProgress);
}