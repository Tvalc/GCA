// RenderManager handles all rendering operations using canvas layers
class RenderManager {
  constructor(game) {
    this.game = game;
    this.canvas = null;
    this.ctx = null;
    this.layers = {
      background: null,
      map: null,
      entities: null,
      effects: null,
      ui: null
    };
    this.sprites = new Map();
    this.animations = new Map();
    this.backgroundImage = null;
    this.uiElements = new Map();
  }

  async init() {
    // Create main canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'gameCanvas';
    document.body.appendChild(this.canvas);
    
    // Get context
    this.ctx = this.canvas.getContext('2d');
    
    // Set canvas size
    this.resizeCanvas();
    
    // Create layer canvases
    for (const layer in this.layers) {
      this.layers[layer] = document.createElement('canvas');
      this.layers[layer].width = this.canvas.width;
      this.layers[layer].height = this.canvas.height;
      this.layers[layer].getContext('2d');
    }
    
    // Load initial assets
    await this.loadAssets();
    
    // Initialize UI elements
    this.initUI();
    
    // Handle window resize
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  async loadAssets() {
    // Load background for current scene
    const scene = this.game.state.currentScene;
    const backgroundUrl = SCENES[scene.toUpperCase()].background;
    await this.loadBackground(backgroundUrl);
    
    // Load sprites
    await this.loadSprites();
  }

  async loadBackground(backgroundUrl) {
    if (!backgroundUrl) {
      console.error('No background URL provided');
      return;
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        this.backgroundImage = img;
        
        // Set map dimensions based on actual image size
        this.game.state.mapWidth = Math.floor(img.width / GRID_SIZE);
        this.game.state.mapHeight = Math.floor(img.height / GRID_SIZE);
        
        // Generate the map
        this.game.generateMap();
        
        resolve();
      };
      
      img.onerror = () => {
        console.error('Failed to load background image');
        reject(new Error('Failed to load background image'));
      };
      
      img.src = backgroundUrl;
    });
  }

  async loadSprites() {
    // Load player sprites
    await this.loadSprite('player', 'assets/sprites/player.png');
    await this.loadSprite('enemies', 'assets/sprites/enemies.png');
    await this.loadSprite('ui', 'assets/sprites/ui.png');
    
    // Load map tiles
    await this.loadSprite('tiles', 'assets/sprites/tiles.png');
  }

  async loadSprite(name, src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        this.sprites.set(name, img);
        resolve();
      };
      
      img.onerror = reject;
      img.src = src;
    });
  }

  render() {
    // Clear all layers
    for (const layer in this.layers) {
      const ctx = this.layers[layer].getContext('2d');
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    // Render each layer
    this.renderBackground();
    this.renderMap();
    this.renderEntities();
    this.renderEffects();
    this.renderUI();
    
    // Composite all layers onto main canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const layer in this.layers) {
      this.ctx.drawImage(this.layers[layer], 0, 0);
    }
  }

  renderBackground() {
    const ctx = this.layers.background.getContext('2d');
    
    if (this.backgroundImage) {
      ctx.drawImage(
        this.backgroundImage,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
    }
  }

  renderMap() {
    const ctx = this.layers.map.getContext('2d');
    const map = this.game.state.map;
    
    if (!map) return;
    
    // Render map tiles
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const tile = map[y][x];
        if (tile && tile.sprite) {
          ctx.drawImage(
            this.sprites.get(tile.sprite),
            x * GRID_SIZE,
            y * GRID_SIZE,
            GRID_SIZE,
            GRID_SIZE
          );
        }
      }
    }
  }

  renderEntities() {
    // Render player
    this.renderPlayer();
    
    // Render enemies
    this.renderEnemies();
  }

  renderPlayer() {
    const { player } = this.game.state;
    if (!player) return;

    const playerSprite = this.sprites.get('player');
    if (!playerSprite) return;

    // Calculate sprite position
    const spriteX = (player.direction === 'left' ? 1 : 0) * GRID_SIZE;
    const spriteY = (['up', 'down', 'left', 'right'].indexOf(player.direction)) * GRID_SIZE;

    // Draw player sprite
    this.ctx.drawImage(
      playerSprite,
      spriteX, spriteY,
      GRID_SIZE, GRID_SIZE,
      player.position.x, player.position.y,
      GRID_SIZE, GRID_SIZE
    );

    // Draw player HP/MP bars
    this.renderEntityBars(player);
  }

  renderEnemies() {
    const { enemies } = this.game.state;
    const enemiesSprite = this.sprites.get('enemies');
    
    if (!enemiesSprite) return;

    enemies.forEach(enemy => {
      // Draw enemy sprite
      this.ctx.drawImage(
        enemiesSprite,
        enemy.spriteX, enemy.spriteY,
        GRID_SIZE, GRID_SIZE,
        enemy.position.x, enemy.position.y,
        GRID_SIZE, GRID_SIZE
      );

      // Draw enemy HP/MP bars
      this.renderEntityBars(enemy);
    });
  }

  renderEntityBars(entity) {
    const barWidth = GRID_SIZE;
    const barHeight = 5;
    const barSpacing = 2;
    const x = entity.position.x;
    const y = entity.position.y - barHeight * 2 - barSpacing;

    // HP Bar
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(x, y, barWidth, barHeight);
    this.ctx.fillStyle = 'green';
    this.ctx.fillRect(x, y, barWidth * (entity.hp / entity.maxHp), barHeight);

    // MP Bar
    this.ctx.fillStyle = 'blue';
    this.ctx.fillRect(x, y + barHeight + barSpacing, barWidth, barHeight);
    this.ctx.fillStyle = 'cyan';
    this.ctx.fillRect(x, y + barHeight + barSpacing, barWidth * (entity.mp / entity.maxMp), barHeight);
  }

  renderEffects() {
    const ctx = this.layers.effects.getContext('2d');
    
    // Render active effects (particles, animations, etc.)
    if (this.game.systems.combat) {
      this.game.systems.combat.getActiveEffects().forEach(effect => {
        this.renderEffect(ctx, effect);
      });
    }
  }

  renderEffect(ctx, effect) {
    // Render different types of effects
    switch (effect.type) {
      case 'particle':
        this.renderParticleEffect(ctx, effect);
        break;
      case 'animation':
        this.renderAnimationEffect(ctx, effect);
        break;
      // Add more effect types as needed
    }
  }

  renderUI() {
    // Render combat UI if in battle
    if (this.game.state.currentState === 'BATTLE') {
      this.renderCombatUI();
    }

    // Render status effects
    this.renderStatusEffects();
  }

  renderCombatUI() {
    const combatContainer = this.uiElements.get('combat');
    combatContainer.style.display = 'block';

    // Update combat log
    const combatLog = this.uiElements.get('combatLog');
    combatLog.innerHTML = this.game.systems.combat.getCombatLog();

    // Update action buttons
    const actionButtons = this.uiElements.get('actionButtons');
    actionButtons.innerHTML = '';
    
    const actions = ['Attack', 'Skills', 'Items', 'Defend'];
    actions.forEach(action => {
      const button = document.createElement('button');
      button.textContent = action;
      button.onclick = () => this.game.systems.combat.handleAction(action);
      actionButtons.appendChild(button);
    });
  }

  renderStatusEffects() {
    const statusContainer = this.uiElements.get('statusEffects');
    statusContainer.innerHTML = '';

    const { player } = this.game.state;
    if (!player) return;

    // Render player status effects
    player.statusEffects.forEach((effect, id) => {
      const effectElement = document.createElement('div');
      effectElement.className = 'status-effect';
      effectElement.textContent = `${id} (${effect.duration})`;
      statusContainer.appendChild(effectElement);
    });
  }

  initUI() {
    // Create UI containers
    this.createUIContainer('combat', {
      position: 'fixed',
      bottom: '0',
      left: '0',
      right: '0',
      height: '200px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'none'
    });

    this.createUIContainer('combatLog', {
      position: 'absolute',
      top: '10px',
      left: '10px',
      right: '10px',
      height: '100px',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      color: 'white',
      overflowY: 'auto',
      padding: '10px'
    });

    this.createUIContainer('actionButtons', {
      position: 'absolute',
      bottom: '10px',
      left: '50%',
      transform: 'translateX(-50%)',
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '10px',
      padding: '10px'
    });

    this.createUIContainer('targetSelection', {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: '20px',
      borderRadius: '10px',
      display: 'none'
    });

    this.createUIContainer('statusEffects', {
      position: 'absolute',
      top: '10px',
      right: '10px',
      display: 'flex',
      flexDirection: 'column',
      gap: '5px'
    });
  }

  createUIContainer(id, styles) {
    const container = document.createElement('div');
    container.id = id;
    Object.assign(container.style, styles);
    document.body.appendChild(container);
    this.uiElements.set(id, container);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  showTargetSelection(targets) {
    const targetContainer = this.uiElements.get('targetSelection');
    targetContainer.style.display = 'block';
    targetContainer.innerHTML = '';

    targets.forEach(target => {
      const button = document.createElement('button');
      button.textContent = target.name;
      button.onclick = () => {
        this.game.systems.combat.selectTarget(target);
        targetContainer.style.display = 'none';
      };
      targetContainer.appendChild(button);
    });
  }

  showSkillSelection(skills) {
    const targetContainer = this.uiElements.get('targetSelection');
    targetContainer.style.display = 'block';
    targetContainer.innerHTML = '';

    skills.forEach(skill => {
      const button = document.createElement('button');
      button.textContent = `${skill.name} (${skill.mpCost} MP)`;
      button.onclick = () => {
        this.game.systems.combat.selectSkill(skill);
        targetContainer.style.display = 'none';
      };
      targetContainer.appendChild(button);
    });
  }

  showItemSelection(items) {
    const targetContainer = this.uiElements.get('targetSelection');
    targetContainer.style.display = 'block';
    targetContainer.innerHTML = '';

    items.forEach(item => {
      const button = document.createElement('button');
      button.textContent = `${item.name} (${item.quantity})`;
      button.onclick = () => {
        this.game.systems.combat.selectItem(item);
        targetContainer.style.display = 'none';
      };
      targetContainer.appendChild(button);
    });
  }
}

// Export the RenderManager class
export default RenderManager; 