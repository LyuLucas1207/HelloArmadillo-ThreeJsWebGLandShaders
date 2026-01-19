import { FLOOR_WIDTH, FLOOR_HEIGHT, FLOOR_TEXTURE_REPEAT } from './src/constants/FloorConstants.js';
import { Armadillo } from './src/models/Armadillo.js';
import { OrbCollection } from './src/models/OrbCollection.js';
import { OrbManager } from './src/game/OrbManager.js';
import { PhysicsService } from './src/physics/PhysicsService.js';
import { KeyboardController } from './src/input/KeyboardInputService.js';
import { GameState } from './src/interface/GameState.js';
import { UI } from './src/interface/UI.js';
import { BounceAnimation } from './src/animations/BounceAnimation.js';
import { ParticleExplosion } from './src/animations/ParticleExplosion.js';
import { EffectManager } from './src/game/EffectManager.js';
import { GameLoop } from './src/GameLoop.js';

const { renderer, scene, camera, worldFrame } = setup(
  FLOOR_WIDTH,
  FLOOR_HEIGHT,
  FLOOR_TEXTURE_REPEAT,
);
// create game state and ui
const gameState = new GameState();
const ui = new UI(gameState);

// create models
const armadillo = new Armadillo(scene, worldFrame);
const orbCollection = new OrbCollection(scene, worldFrame);

// create animations
const bounceAnimation = new BounceAnimation();
const particleExplosion = new ParticleExplosion();

const physicsService = new PhysicsService();
const keyboardController = new KeyboardController();

// create managers
const orbManager = new OrbManager(orbCollection);
const effectManager = new EffectManager(
  scene,
  worldFrame,
  bounceAnimation,
  particleExplosion,
  orbCollection
);

const gameLoop = new GameLoop(
  renderer,
  scene,
  camera,
  armadillo,
  keyboardController,
  gameState,
  ui,
  physicsService,
  effectManager,
  orbManager
);

gameLoop.start();
