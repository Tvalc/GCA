// Core Game class that manages the game loop and initialization
class Game {
  constructor() {
    this.state = {
      currentState: 'START',
      player: null,
      currentScene: 'arcade1',
      map: [],
      enemies: [],
      gold: 0,
      xp: 0,
      level: 1,
      keys: {},
      isPaused: false,
      inventory: [],
      fury: 0,
      relics: {},
      lastMoveTime: 0,
      mapWidth: 0,
      mapHeight: 0,
      spawnPoints: {
        arcade1: { x: 13, y: 14 }
      }
    };

    this.lastUpdate = 0;
    this.lastPassiveHealTime = 0;
    this.storedCollisionMaps = {};
    this.managers = {};
    this.systems = {};
  }

  async init() {
    // Initialize all managers
    this.managers.render = new RenderManager(this);
    this.managers.input = new InputManager(this);
    this.managers.ui = new UIManager(this);
    this.managers.audio = new AudioManager(this);
    this.managers.save = new SaveManager(this);

    // Initialize all systems
    this.systems.combat = new CombatSystem(this);
    this.systems.inventory = new InventorySystem(this);
    this.systems.relic = new RelicSystem(this);
    this.systems.npc = new NPCSystem(this);

    // Initialize managers
    await Promise.all([
      this.managers.render.init(),
      this.managers.input.init(),
      this.managers.ui.init(),
      this.managers.audio.init()
    ]);

    // Load saved game or start new game
    if (this.managers.save.hasSaveData()) {
      await this.managers.save.load();
    } else {
      await this.startNewGame();
    }

    // Start game loop
    this.startGameLoop();
  }

  async startNewGame() {
    // Initialize new game state
    this.state = {
      ...this.state,
      currentState: 'START',
      player: null,
      currentScene: 'arcade1',
      map: [],
      enemies: [],
      gold: 0,
      xp: 0,
      level: 1,
      inventory: [],
      fury: 0,
      relics: {}
    };

    // Create player
    this.state.player = await this.createPlayer();
  }

  async createPlayer(characterClass = 'Flexecutioner', savedStats = null) {
    const baseStats = savedStats || CHARACTER_CLASSES[characterClass].getBaseStats();
    const hp = baseStats.vitality * 20;
    const mp = baseStats.intelligence * 15;

    return {
      name: characterClass.substring(0, 5),
      class: characterClass,
      level: 1,
      hp,
      maxHp: hp,
      mp,
      maxMp: mp,
      stats: baseStats,
      equipment: {},
      skills: [],
      position: { x: 0, y: 0 }
    };
  }

  startGameLoop() {
    const gameLoop = (timestamp) => {
      // Request next frame
      requestAnimationFrame(gameLoop);

      // Skip if paused
      if (this.state.isPaused) return;

      // Calculate delta time
      const deltaTime = timestamp - this.lastUpdate;
      this.lastUpdate = timestamp;

      // Update game state
      this.update(deltaTime);

      // Render game
      this.managers.render.render();
    };

    // Start the game loop
    requestAnimationFrame(gameLoop);
  }

  update(deltaTime) {
    // Update current scene
    if (this.state.currentState === 'EXPLORE') {
      this.updateExploration(deltaTime);
    } else if (this.state.currentState === 'BATTLE') {
      this.systems.combat.update(deltaTime);
    }

    // Update UI
    this.managers.ui.update();

    // Update NPCs
    this.systems.npc.update(deltaTime);
  }

  updateExploration(deltaTime) {
    // Update player
    if (this.state.player) {
      this.updatePlayer(deltaTime);
    }

    // Update enemies
    this.state.enemies.forEach(enemy => {
      enemy.update(deltaTime);
    });

    // Check for passive healing
    this.checkPassiveHealing(deltaTime);
  }

  updatePlayer(deltaTime) {
    // Handle player movement
    if (this.managers.input.isMoving()) {
      const newPosition = this.calculateNewPosition(
        this.state.player.position,
        this.managers.input.getMovementDirection()
      );

      if (this.isValidPosition(newPosition)) {
        this.state.player.position = newPosition;
      }
    }

    // Update player animations
    this.state.player.updateAnimation(deltaTime);
  }

  calculateNewPosition(currentPos, direction) {
    const speed = 5; // pixels per frame
    const newPos = { ...currentPos };

    switch (direction) {
      case 'up':
        newPos.y -= speed;
        break;
      case 'down':
        newPos.y += speed;
        break;
      case 'left':
        newPos.x -= speed;
        break;
      case 'right':
        newPos.x += speed;
        break;
    }

    return newPos;
  }

  isValidPosition(position) {
    // Check if position is within map bounds
    if (position.x < 0 || position.x >= this.state.mapWidth ||
        position.y < 0 || position.y >= this.state.mapHeight) {
      return false;
    }

    // Check collision with map tiles
    const tileX = Math.floor(position.x / GRID_SIZE);
    const tileY = Math.floor(position.y / GRID_SIZE);
    
    return !this.isCollisionTile(tileX, tileY);
  }

  isCollisionTile(x, y) {
    const collisionMap = this.storedCollisionMaps[this.state.currentScene];
    return collisionMap && collisionMap[y] && collisionMap[y][x] === 1;
  }

  checkPassiveHealing(deltaTime) {
    const now = Date.now();
    if (now - this.lastPassiveHealTime >= PASSIVE_HEAL_INTERVAL) {
      this.lastPassiveHealTime = now;
      
      if (this.state.player && this.state.player.hp < this.state.player.maxHp) {
        this.state.player.hp = Math.min(
          this.state.player.maxHp,
          this.state.player.hp + PASSIVE_HEAL_AMOUNT
        );
      }
    }
  }
}

// Export the Game class
export default Game; 