import { ARMADILLO_INITIAL_POSITION } from '../constants/ModelConstants.js';

/**
 * KeyboardController class - Handles keyboard input and manages player state
 */
export class KeyboardController {
  constructor() {
    this.keyboard = new THREEx.KeyboardState();
    this.moveSpeed = 0.3;
    this.rotationSpeed = 0.05;
    this.jumpForce = 0.8;
    
    this.armadilloPosition = { ...ARMADILLO_INITIAL_POSITION };
    this.baseY = ARMADILLO_INITIAL_POSITION.y;
    this.velocityYRef = { value: 0 };
    this.isGroundedRef = { value: true };
  }

  /**
   * Handles WASD movement input
   */
  handleMovement() {
    if (this.keyboard.pressed("W"))
      this.armadilloPosition.z -= this.moveSpeed;
    else if (this.keyboard.pressed("S"))
      this.armadilloPosition.z += this.moveSpeed;

    if (this.keyboard.pressed("A"))
      this.armadilloPosition.x -= this.moveSpeed;
    else if (this.keyboard.pressed("D"))
      this.armadilloPosition.x += this.moveSpeed;
  }

  /**
   * Handles JL rotation input
   * @param {Object} armadilloGroup - Armadillo group object
   */
  handleRotation(armadilloGroup) {
    if (this.keyboard.pressed("J"))
      armadilloGroup.rotation.y -= this.rotationSpeed;
    else if (this.keyboard.pressed("L"))
      armadilloGroup.rotation.y += this.rotationSpeed;
  }

  /**
   * Handles spacebar jump input
   */
  handleJump() {
    if (this.keyboard.pressed(" ")) {
      if (this.isGroundedRef.value) { 
        this.velocityYRef.value = this.jumpForce; 
        this.isGroundedRef.value = false; 
      }
    }
  }

  /**
   * Checks keyboard input and updates input state only
   */
  checkKeyboard() {
    this.handleMovement();
    this.handleJump();
  }

  /**
   * Resets keyboard controller state to initial values
   */
  reset() {
    this.armadilloPosition.x = ARMADILLO_INITIAL_POSITION.x;
    this.armadilloPosition.y = ARMADILLO_INITIAL_POSITION.y;
    this.armadilloPosition.z = ARMADILLO_INITIAL_POSITION.z;
    this.velocityYRef.value = 0;
    this.isGroundedRef.value = true;
  }

  /**
   * Gets current armadillo position
   * @returns {Object} Armadillo position object
   */
  getArmadilloPosition() {
    return this.armadilloPosition;
  }

  /**
   * Gets Y velocity reference
   * @returns {Object} Velocity Y reference object
   */
  getVelocityYRef() {
    return this.velocityYRef;
  }

  /**
   * Gets grounded state reference
   * @returns {Object} Grounded state reference object
   */
  getIsGroundedRef() {
    return this.isGroundedRef;
  }

  /**
   * Gets base Y coordinate
   * @returns {number} Base Y coordinate
   */
  getBaseY() {
    return this.baseY;
  }
}
