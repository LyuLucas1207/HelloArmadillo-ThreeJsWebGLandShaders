
/**
 * GameLoop class - Manages the main game loop and update cycle
 */
export class GameLoop {
  /**
   * @param {Object} renderer - WebGL renderer instance
   * @param {Object} scene - Three.js scene object
   * @param {Object} camera - Camera instance
   * @param {Armadillo} armadillo - Armadillo instance
   * @param {KeyboardController} keyboardController - Keyboard input controller
   * @param {GameState} gameState - Current game state object
   * @param {UI} ui - UI instance
   * @param {PhysicsService} physicsService - Physics service instance
   * @param {EffectManager} effectManager - Effect manager instance
   * @param {OrbManager} orbManager - Orb management service
   */
  constructor(
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
  ) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.armadillo = armadillo;
    this.keyboardController = keyboardController;
    this.gameState = gameState;
    this.ui = ui;
    this.physicsService = physicsService;
    this.effectManager = effectManager;
    this.orbManager = orbManager;
  }

  /**
   * Handles reset key press when game is in victory or game over state
   */
  handleResetKey() {
    if ((this.gameState.isVictory || this.gameState.isGameOver) && this.keyboardController.keyboard.pressed('R')) {
      this.effectManager.cleanupActiveEffects();
      this.ui.reset();
      this.keyboardController.reset();
      this.armadillo.resetPosition();
      this.orbManager.reset();
      this.gameState.reset();
    }
  }

  /**
   * Processes collection events and triggers animations
   * @param {Array} collectedEvents - Array of collection event objects
   */
  handleCollectionEvents(collectedEvents) {
    collectedEvents.forEach(({ orbData, landingPosition }) => {
      this.effectManager.startAnimation(orbData, landingPosition);
      if (this.gameState.collectOrb()) this.ui.showVictoryMessage();
    });
  }

  /**
   * Main game loop update function
   */
  update() {
    const currentTime = performance.now();
    
    this.renderer.render(this.scene, this.camera);
    this.ui.updateUI(this.gameState);
    this.handleResetKey();
    
    if (this.gameState.isStarted && !this.gameState.isVictory && !this.gameState.isGameOver) {
      this.keyboardController.checkKeyboard();
      this.keyboardController.handleRotation(this.armadillo.group);
      
      const armadilloPosition = this.keyboardController.getArmadilloPosition();
      const velocityYRef = this.keyboardController.getVelocityYRef();
      const isGroundedRef = this.keyboardController.getIsGroundedRef();
      const baseY = this.keyboardController.getBaseY();
      
      this.physicsService.applyGravity(armadilloPosition, velocityYRef, isGroundedRef, baseY);
      
      if (this.physicsService.checkBoundary(armadilloPosition)) {
        this.keyboardController.reset();
        this.armadillo.resetPosition();
        if (this.gameState.applyBoundaryPenalty()) this.ui.showGameOverMessage();
      }
      
      this.armadillo.updatePosition(armadilloPosition);
      this.armadillo.markMaterialsForUpdate();
      
      this.orbManager.updateOrbMaterials();
      this.orbManager.updateNearestOrbLighting(this.armadillo);
      
      const collectedEvents = this.orbManager.checkCollection(
        this.armadillo.group
      );
      this.handleCollectionEvents(collectedEvents);
      
      this.effectManager.updateEffects(currentTime);
    } else if (this.gameState.isVictory || this.gameState.isGameOver) {
      this.effectManager.updateEffects(currentTime);
    }
    
    requestAnimationFrame(() => this.update());
  }

  /**
   * Starts the game loop
   */
  start() {
    this.update();
  }
}
