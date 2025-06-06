// Main entry point for the game
import GameManager from './managers/GameManager';

// Create game instance
const game = new GameManager();

// Initialize game
async function initGame() {
  try {
    // Initialize game manager
    await game.init();

    // Add event listeners
    window.addEventListener('keydown', game.handleKeyPress.bind(game));
    window.addEventListener('mousemove', game.handleMouseMove.bind(game));
    window.addEventListener('click', game.handleClick.bind(game));

    // Handle window resize
    window.addEventListener('resize', () => {
      // Update canvas size
      const canvas = game.managers.scene.getCanvas();
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    // Handle window unload
    window.addEventListener('beforeunload', () => {
      // Save game state
      game.saveGame('autosave');
      
      // Cleanup
      game.cleanup();
    });

    console.log('Game initialized successfully');
  } catch (error) {
    console.error('Failed to initialize game:', error);
  }
}

// Start the game
initGame(); 