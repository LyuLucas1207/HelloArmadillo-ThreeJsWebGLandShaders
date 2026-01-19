import { GRAVITY } from '../constants/PhysicsConstants.js';
import { FLOOR_WIDTH, FLOOR_HEIGHT } from '../constants/FloorConstants.js';

/**
 * PhysicsService class - Handles all physics calculations (gravity and boundary checks)
 */
export class PhysicsService {
  constructor() {
    this.floorBoundary = {
      minX: -FLOOR_WIDTH / 2,
      maxX: FLOOR_WIDTH / 2,
      minZ: -FLOOR_HEIGHT / 2,
      maxZ: FLOOR_HEIGHT / 2
    };
  }

  /**
   * Applies gravity to armadillo position
   * @param {Object} armadilloPosition - Current armadillo position
   * @param {Object} velocityYRef - Reference to Y velocity value
   * @param {Object} isGroundedRef - Reference to grounded state
   * @param {number} groundY - Ground Y coordinate
   */
  applyGravity(armadilloPosition, velocityYRef, isGroundedRef, groundY) {
    velocityYRef.value += GRAVITY;
    armadilloPosition.y += velocityYRef.value;

    if (armadilloPosition.y <= groundY) {
      armadilloPosition.y = groundY;
      velocityYRef.value = 0;
      isGroundedRef.value = true;
    }
  }

  /**
   * Checks if armadillo is outside floor boundaries
   * @param {Object} armadilloPosition - Current armadillo position
   * @returns {boolean} True if out of bounds, false otherwise
   */
  checkBoundary(armadilloPosition) {
    return armadilloPosition.x < this.floorBoundary.minX || 
           armadilloPosition.x > this.floorBoundary.maxX ||
           armadilloPosition.z < this.floorBoundary.minZ || 
           armadilloPosition.z > this.floorBoundary.maxZ;
  }
}
