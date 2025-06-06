// GameManager manages the game loop and ties all managers together
class GameManager {
  constructor() {
    this.managers = {
      audio: null,
      save: null,
      asset: null,
      scene: null,
      entity: null,
      map: null,
      quest: null,
      inventory: null,
      combat: null,
      skill: null,
      npc: null,
      player: null,
      ui: null
    };

    this.gameState = {
      isRunning: false,
      isPaused: false,
      currentTime: 0,
      deltaTime: 0,
      lastTime: 0,
      fps: 0,
      frameCount: 0,
      frameTime: 0
    };

    this.config = {
      targetFPS: 60,
      frameTime: 1000 / 60,
      debug: false
    };
  }

  async init() {
    // Initialize all managers
    await this.initManagers();

    // Start the game loop
    this.start();
  }

  async initManagers() {
    // Initialize AudioManager
    this.managers.audio = new AudioManager(this);
    await this.managers.audio.init();

    // Initialize SaveManager
    this.managers.save = new SaveManager(this);
    await this.managers.save.init();

    // Initialize AssetManager
    this.managers.asset = new AssetManager(this);
    await this.managers.asset.init();

    // Initialize SceneManager
    this.managers.scene = new SceneManager(this);
    await this.managers.scene.init();

    // Initialize EntityManager
    this.managers.entity = new EntityManager(this);
    await this.managers.entity.init();

    // Initialize MapManager
    this.managers.map = new MapManager(this);
    await this.managers.map.init();

    // Initialize QuestManager
    this.managers.quest = new QuestManager(this);
    await this.managers.quest.init();

    // Initialize InventoryManager
    this.managers.inventory = new InventoryManager(this);
    await this.managers.inventory.init();

    // Initialize CombatManager
    this.managers.combat = new CombatManager(this);
    await this.managers.combat.init();

    // Initialize SkillManager
    this.managers.skill = new SkillManager(this);
    await this.managers.skill.init();

    // Initialize NPCManager
    this.managers.npc = new NPCManager(this);
    await this.managers.npc.init();

    // Initialize PlayerManager
    this.managers.player = new PlayerManager(this);
    await this.managers.player.init();

    // Initialize UIManager
    this.managers.ui = new UIManager(this);
    await this.managers.ui.init();
  }

  // Game Loop
  start() {
    this.gameState.isRunning = true;
    this.gameState.lastTime = performance.now();
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  stop() {
    this.gameState.isRunning = false;
  }

  pause() {
    this.gameState.isPaused = true;
  }

  resume() {
    this.gameState.isPaused = false;
    this.gameState.lastTime = performance.now();
  }

  gameLoop(currentTime) {
    if (!this.gameState.isRunning) return;

    // Calculate delta time
    this.gameState.deltaTime = currentTime - this.gameState.lastTime;
    this.gameState.currentTime = currentTime;

    // Update FPS counter
    this.updateFPS();

    if (!this.gameState.isPaused) {
      // Update game state
      this.update(this.gameState.deltaTime);

      // Render game
      this.render();
    }

    // Schedule next frame
    this.gameState.lastTime = currentTime;
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  updateFPS() {
    this.gameState.frameCount++;
    this.gameState.frameTime += this.gameState.deltaTime;

    if (this.gameState.frameTime >= 1000) {
      this.gameState.fps = this.gameState.frameCount;
      this.gameState.frameCount = 0;
      this.gameState.frameTime = 0;
    }
  }

  update(deltaTime) {
    // Update current scene
    this.managers.scene.update(deltaTime);

    // Update entities
    this.managers.entity.update(deltaTime);

    // Update map
    this.managers.map.update(deltaTime);

    // Update quests
    this.managers.quest.update(deltaTime);

    // Update UI
    this.managers.ui.update();

    // Update debug info
    if (this.config.debug) {
      this.updateDebugInfo();
    }
  }

  render() {
    // Clear canvas
    const ctx = this.managers.scene.getContext();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Render current scene
    this.managers.scene.render();

    // Render debug info
    if (this.config.debug) {
      this.renderDebugInfo();
    }
  }

  // Debug System
  updateDebugInfo() {
    this.debugInfo = {
      fps: this.gameState.fps,
      entities: this.managers.entity.getEntityCount(),
      player: this.managers.player.player ? {
        position: this.managers.player.player.position,
        health: this.managers.player.player.health,
        mana: this.managers.player.player.mana
      } : null,
      scene: this.managers.scene.getCurrentScene(),
      memory: performance.memory ? {
        usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
        totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024)
      } : null
    };
  }

  renderDebugInfo() {
    const ctx = this.managers.scene.getContext();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 200, 150);

    ctx.fillStyle = 'white';
    ctx.font = '12px monospace';
    let y = 30;

    // FPS
    ctx.fillText(`FPS: ${this.debugInfo.fps}`, 20, y);
    y += 20;

    // Entities
    ctx.fillText(`Entities: ${this.debugInfo.entities}`, 20, y);
    y += 20;

    // Player
    if (this.debugInfo.player) {
      ctx.fillText(`Player Position: (${Math.round(this.debugInfo.player.position.x)}, ${Math.round(this.debugInfo.player.position.y)})`, 20, y);
      y += 20;
      ctx.fillText(`Health: ${this.debugInfo.player.health}`, 20, y);
      y += 20;
      ctx.fillText(`Mana: ${this.debugInfo.player.mana}`, 20, y);
      y += 20;
    }

    // Scene
    ctx.fillText(`Scene: ${this.debugInfo.scene}`, 20, y);
    y += 20;

    // Memory
    if (this.debugInfo.memory) {
      ctx.fillText(`Memory: ${this.debugInfo.memory.usedJSHeapSize}MB / ${this.debugInfo.memory.totalJSHeapSize}MB`, 20, y);
    }
  }

  // Game State Management
  saveGame(slot) {
    const gameState = {
      player: this.managers.player.savePlayerState(),
      scene: this.managers.scene.saveSceneState(),
      quests: this.managers.quest.saveQuestState(),
      inventory: this.managers.inventory.saveInventoryState(),
      skills: this.managers.skill.saveSkillState(),
      map: this.managers.map.saveMapState(),
      entities: this.managers.entity.saveEntityState()
    };

    return this.managers.save.saveGame(slot, gameState);
  }

  loadGame(slot) {
    const gameState = this.managers.save.loadGame(slot);
    if (!gameState) return false;

    // Load game state
    this.managers.player.loadPlayerState(gameState.player);
    this.managers.scene.loadSceneState(gameState.scene);
    this.managers.quest.loadQuestState(gameState.quests);
    this.managers.inventory.loadInventoryState(gameState.inventory);
    this.managers.skill.loadSkillState(gameState.skills);
    this.managers.map.loadMapState(gameState.map);
    this.managers.entity.loadEntityState(gameState.entities);

    return true;
  }

  // Event Handlers
  handleKeyPress(event) {
    // Handle global keyboard shortcuts
    switch (event.key) {
      case 'Escape':
        this.togglePause();
        break;
      case 'F1':
        this.toggleDebug();
        break;
      case 'F5':
        this.quickSave();
        break;
      case 'F9':
        this.quickLoad();
        break;
    }

    // Forward to current scene
    this.managers.scene.handleKeyPress(event);
  }

  handleMouseMove(event) {
    // Forward to current scene
    this.managers.scene.handleMouseMove(event);
  }

  handleClick(event) {
    // Forward to current scene
    this.managers.scene.handleClick(event);
  }

  // Utility Methods
  togglePause() {
    if (this.gameState.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  toggleDebug() {
    this.config.debug = !this.config.debug;
  }

  quickSave() {
    this.saveGame('quicksave');
  }

  quickLoad() {
    this.loadGame('quicksave');
  }

  // Cleanup
  cleanup() {
    // Stop the game loop
    this.stop();

    // Cleanup all managers
    Object.values(this.managers).forEach(manager => {
      if (manager && typeof manager.cleanup === 'function') {
        manager.cleanup();
      }
    });
  }
}

// Export the GameManager class
export default GameManager; 