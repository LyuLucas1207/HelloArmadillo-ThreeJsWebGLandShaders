import { COLLECTIBLE_ORB_COUNT, SCORE_PER_ORB, BOUNDARY_PENALTY } from '../constants/GameConstants.js';

/**
 * GameState class - Manages game state data and game logic
 */
export class GameState {
  constructor() {
    this.score = 0;
    this.collectedCount = 0;
    this.totalCount = COLLECTIBLE_ORB_COUNT;
    this.startTime = null;
    this.pausedTime = 0;
    this.isStarted = false;
    this.isVictory = false;
    this.isGameOver = false;
    this.victoryTime = null;
    this.gameOverTime = null;
  }

  /**
   * Handles orb collection - increases score and collected count
   * @returns {boolean} True if victory condition is met
   */
  collectOrb() {
    this.collectedCount++;
    this.score += SCORE_PER_ORB;
    
    if (this.collectedCount >= this.totalCount) {
      this.isVictory = true;
      this.victoryTime = Date.now();
      return true;
    }
    return false;
  }

  /**
   * Applies boundary penalty - reduces score
   * @returns {boolean} True if game over condition is met
   */
  applyBoundaryPenalty() {
    this.score -= BOUNDARY_PENALTY;
    if (this.score < 0) {
      this.isGameOver = true;
      this.gameOverTime = Date.now();
      return true;
    }
    return false;
  }

  /**
   * Starts the game
   */
  start() {
    if (!this.isStarted) {
      this.isStarted = true;
      this.startTime = Date.now();
      this.pausedTime = 0;
    }
  }

  /**
   * Resets game state to initial values
   */
  reset() {
    this.score = 0;
    this.collectedCount = 0;
    this.startTime = null;
    this.pausedTime = 0;
    this.isStarted = false;
    this.isVictory = false;
    this.isGameOver = false;
    this.victoryTime = null;
    this.gameOverTime = null;
  }
}
