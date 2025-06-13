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
    this.systems.skill = new SkillSystem(this);
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
    // Create player
    this.state.player = await this.createPlayer();

    // Initialize starting enemies
    this.initializeEnemies();

    // Set initial state
    this.state.currentState = 'EXPLORE';
  }

  async createPlayer() {
    // Create player with base stats
    const player = {
      id: 'player',
      name: 'Hazel',
      level: 1,
      xp: 0,
      gold: 0,
      stats: {
        strength: 10,
        dexterity: 10,
        vitality: 10,
        intelligence: 10,
        luck: 10,
        charisma: 10,
        fortune: 10,
        speed: 10
      },
      hp: 100,
      maxHp: 100,
      mp: 30,
      maxMp: 30,
      position: { x: 0, y: 0 },
      direction: 'down',
      skills: new Set(['slash', 'defend']),
      inventory: new Map(),
      equipment: {
        weapon: null,
        armor: null,
        helmet: null,
        boots: null,
        accessory: null
      },
      statusEffects: new Map(),
      cooldowns: new Map()
    };

    return player;
  }

  initializeEnemies() {
    // Create some initial enemies at visible positions
    const slime = new Enemy({ ...enemies.slime, position: { x: 300, y: 250 } });
    const bat = new Enemy({ ...enemies.bat, position: { x: 400, y: 300 } });
    this.state.enemies = [slime, bat];
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
      this.render();
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
    // Check map boundaries
    if (position.x < 0 || position.x >= this.state.mapWidth ||
        position.y < 0 || position.y >= this.state.mapHeight) {
      return false;
    }

    // Check collision with map objects
    const tileX = Math.floor(position.x / TILE_SIZE);
    const tileY = Math.floor(position.y / TILE_SIZE);
    
    return !this.isCollision(tileX, tileY);
  }

  isCollision(x, y) {
    // Check if position is blocked by map collision
    const collisionMap = this.getCollisionMap();
    return collisionMap[y]?.[x] === 1;
  }

  getCollisionMap() {
    // Get or create collision map for current scene
    if (!this.storedCollisionMaps[this.state.currentScene]) {
      this.storedCollisionMaps[this.state.currentScene] = this.generateCollisionMap();
    }
    return this.storedCollisionMaps[this.state.currentScene];
  }

  generateCollisionMap() {
    // Generate collision map based on current scene
    const map = [];
    for (let y = 0; y < this.state.mapHeight; y++) {
      const row = [];
      for (let x = 0; x < this.state.mapWidth; x++) {
        // Add collision logic here
        row.push(0);
      }
      map.push(row);
    }
    return map;
  }

  checkPassiveHealing(deltaTime) {
    // Passive healing every 5 seconds
    this.lastPassiveHealTime += deltaTime;
    if (this.lastPassiveHealTime >= 5000) {
      this.lastPassiveHealTime = 0;
      
      if (this.state.player.hp < this.state.player.maxHp) {
        const healAmount = Math.floor(this.state.player.maxHp * 0.05);
        this.state.player.hp = Math.min(
          this.state.player.maxHp,
          this.state.player.hp + healAmount
        );
      }
    }
  }

  render() {
    // Clear canvas
    this.managers.render.clear();

    // Render map
    this.managers.render.renderMap();

    // Render entities
    this.managers.render.renderEntities();

    // Render UI
    this.managers.render.renderUI();
  }
}

// Export the Game class
export default Game; 