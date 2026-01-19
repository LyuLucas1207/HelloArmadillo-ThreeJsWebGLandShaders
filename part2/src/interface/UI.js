/**
 * UI class - Manages all UI operations
 */
export class UI {
  /**
   * @param {GameState} gameState - Game state instance
   */
  constructor(gameState) {
    this.gameState = gameState;
    this.lastUpdateTime = 0;
    this.updateInterval = 50; // Update UI every 50ms (20fps) instead of every frame
    this.initializeEventListeners();
  }

  /**
   * Initializes UI event listeners
   */
  initializeEventListeners() {
    const startButton = document.getElementById('startButton');
    if (startButton) {
      startButton.addEventListener('click', () => {
        this.startGame();
      });
    }
  }

  /**
   * Updates UI elements with current game state
   * @param {GameState} gameState - Current game state object
   */
  updateUI(gameState) {
    const now = performance.now();
    if (now - this.lastUpdateTime < this.updateInterval) {
      return; // Skip update if too soon
    }
    this.lastUpdateTime = now;
    
    document.getElementById('scoreValue').textContent = gameState.score;
    document.getElementById('collectedCount').textContent = gameState.collectedCount;
    document.getElementById('totalCount').textContent = gameState.totalCount;
    
    if (gameState.isStarted && !gameState.isVictory && !gameState.isGameOver && gameState.startTime) {
      const elapsed = (Date.now() - gameState.startTime - gameState.pausedTime) / 1000;
      document.getElementById('timerValue').textContent = elapsed.toFixed(1);
    } else if (gameState.isVictory && gameState.startTime) {
      const elapsed = (gameState.victoryTime - gameState.startTime - gameState.pausedTime) / 1000;
      document.getElementById('timerValue').textContent = elapsed.toFixed(1);
    } else if (gameState.isGameOver && gameState.startTime) {
      const elapsed = (gameState.gameOverTime - gameState.startTime - gameState.pausedTime) / 1000;
      document.getElementById('timerValue').textContent = elapsed.toFixed(1);
    } else {
      document.getElementById('timerValue').textContent = '0.0';
    }
  }

  /**
   * Starts the game - updates UI and calls gameState.start()
   */
  startGame() {
    this.gameState.start();
    document.getElementById('startButton').classList.add('hidden');
  }

  /**
   * Displays victory message with completion time
   */
  showVictoryMessage() {
    if (this.gameState.startTime && this.gameState.victoryTime) {
      const elapsed = (this.gameState.victoryTime - this.gameState.startTime - this.gameState.pausedTime) / 1000;
      document.getElementById('victoryMessage').textContent = `Victory! Time: ${elapsed.toFixed(1)}s\nPress R to Reset`;
    } else {
      document.getElementById('victoryMessage').textContent = `Victory!\nPress R to Reset`;
    }
    document.getElementById('victoryMessage').style.display = 'block';
  }

  /**
   * Hides the victory message element
   */
  hideVictoryMessage() {
    document.getElementById('victoryMessage').style.display = 'none';
  }

  /**
   * Shows the start button element
   */
  showStartButton() {
    document.getElementById('startButton').classList.remove('hidden');
  }

  /**
   * Displays game over message with final score and time
   */
  showGameOverMessage() {
    if (this.gameState.startTime && this.gameState.gameOverTime) {
      const elapsed = (this.gameState.gameOverTime - this.gameState.startTime - this.gameState.pausedTime) / 1000;
      document.getElementById('gameOverMessage').textContent = `Game Over! Score: ${this.gameState.score}\nTime: ${elapsed.toFixed(1)}s\nPress R to Reset`;
    } else {
      document.getElementById('gameOverMessage').textContent = `Game Over! Score: ${this.gameState.score}\nPress R to Reset`;
    }
    document.getElementById('gameOverMessage').style.display = 'block';
  }

  /**
   * Hides the game over message element
   */
  hideGameOverMessage() {
    document.getElementById('gameOverMessage').style.display = 'none';
  }

  /**
   * Resets UI to initial state
   */
  reset() {
    this.hideVictoryMessage();
    this.hideGameOverMessage();
    this.showStartButton();
  }
}