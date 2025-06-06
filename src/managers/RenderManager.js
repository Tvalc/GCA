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
  }

  async init() {
    // Create main canvas
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Set canvas size based on game container
    const gameContainer = document.getElementById('game-container');
    const containerWidth = gameContainer ? gameContainer.offsetWidth : 800;
    const containerHeight = gameContainer ? gameContainer.offsetHeight : 600;
    
    // Get nav height with fallback
    const nav = document.querySelector('#topNav');
    const navHeight = nav ? nav.offsetHeight : 0;
    
    // Set canvas dimensions
    this.canvas.width = containerWidth;
    this.canvas.height = containerHeight - navHeight;
    
    // Create layer canvases
    for (const layer in this.layers) {
      this.layers[layer] = document.createElement('canvas');
      this.layers[layer].width = this.canvas.width;
      this.layers[layer].height = this.canvas.height;
      this.layers[layer].getContext('2d');
    }
    
    // Add canvas to game container
    gameContainer.appendChild(this.canvas);
    
    // Load initial assets
    await this.loadAssets();
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
    const spritePromises = [];
    
    // Load player sprites
    for (const classType in CHARACTER_CLASSES) {
      const spriteUrl = CHARACTER_CLASSES[classType].spriteSheet;
      spritePromises.push(this.loadSprite(classType, spriteUrl));
    }
    
    // Load enemy sprites
    for (const enemyType in ENEMY_TYPES) {
      const spriteUrl = ENEMY_TYPES[enemyType].spriteSheet;
      spritePromises.push(this.loadSprite(enemyType, spriteUrl));
    }
    
    // Load item sprites
    for (const itemType in ITEM_TYPES) {
      const spriteUrl = ITEM_TYPES[itemType].sprite;
      spritePromises.push(this.loadSprite(itemType, spriteUrl));
    }
    
    await Promise.all(spritePromises);
  }

  async loadSprite(key, url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        this.sprites.set(key, img);
        resolve();
      };
      
      img.onerror = () => {
        console.error(`Failed to load sprite: ${key}`);
        reject(new Error(`Failed to load sprite: ${key}`));
      };
      
      img.src = url;
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
    const ctx = this.layers.entities.getContext('2d');
    
    // Render player
    if (this.game.state.player) {
      this.renderEntity(ctx, this.game.state.player);
    }
    
    // Render enemies
    this.game.state.enemies.forEach(enemy => {
      this.renderEntity(ctx, enemy);
    });
    
    // Render NPCs
    if (this.game.systems.npc) {
      this.game.systems.npc.getNPCs().forEach(npc => {
        this.renderEntity(ctx, npc);
      });
    }
  }

  renderEntity(ctx, entity) {
    const sprite = this.sprites.get(entity.spriteKey);
    if (!sprite) return;
    
    // Calculate screen position
    const screenX = entity.position.x - this.game.state.camera.x;
    const screenY = entity.position.y - this.game.state.camera.y;
    
    // Draw entity sprite
    ctx.drawImage(
      sprite,
      entity.animationFrame * GRID_SIZE,
      0,
      GRID_SIZE,
      GRID_SIZE,
      screenX,
      screenY,
      GRID_SIZE,
      GRID_SIZE
    );
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
    const ctx = this.layers.ui.getContext('2d');
    
    // Render HUD
    this.renderHUD(ctx);
    
    // Render active menus
    if (this.game.managers.ui) {
      this.game.managers.ui.getActiveMenus().forEach(menu => {
        this.renderMenu(ctx, menu);
      });
    }
  }

  renderHUD(ctx) {
    const player = this.game.state.player;
    if (!player) return;
    
    // Render health bar
    this.renderHealthBar(ctx, player);
    
    // Render MP bar
    this.renderMPBar(ctx, player);
    
    // Render level and XP
    this.renderLevelInfo(ctx, player);
    
    // Render inventory
    this.renderInventory(ctx);
  }

  renderHealthBar(ctx, player) {
    const barWidth = 200;
    const barHeight = 20;
    const x = 10;
    const y = 10;
    
    // Draw background
    ctx.fillStyle = '#333';
    ctx.fillRect(x, y, barWidth, barHeight);
    
    // Draw health
    const healthPercent = player.hp / player.maxHp;
    ctx.fillStyle = '#f00';
    ctx.fillRect(x, y, barWidth * healthPercent, barHeight);
    
    // Draw border
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(x, y, barWidth, barHeight);
    
    // Draw text
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText(
      `HP: ${player.hp}/${player.maxHp}`,
      x + 5,
      y + 15
    );
  }

  renderMPBar(ctx, player) {
    const barWidth = 200;
    const barHeight = 20;
    const x = 10;
    const y = 35;
    
    // Draw background
    ctx.fillStyle = '#333';
    ctx.fillRect(x, y, barWidth, barHeight);
    
    // Draw MP
    const mpPercent = player.mp / player.maxMp;
    ctx.fillStyle = '#00f';
    ctx.fillRect(x, y, barWidth * mpPercent, barHeight);
    
    // Draw border
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(x, y, barWidth, barHeight);
    
    // Draw text
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText(
      `MP: ${player.mp}/${player.maxMp}`,
      x + 5,
      y + 15
    );
  }

  renderLevelInfo(ctx, player) {
    const x = 10;
    const y = 65;
    
    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.fillText(
      `Level: ${player.level} | XP: ${this.game.state.xp}`,
      x,
      y
    );
  }

  renderInventory(ctx) {
    const x = this.canvas.width - 210;
    const y = 10;
    const itemSize = 40;
    const padding = 5;
    
    // Draw inventory background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(x, y, 200, 200);
    
    // Draw inventory items
    this.game.state.inventory.forEach((item, index) => {
      const itemX = x + (index % 4) * (itemSize + padding);
      const itemY = y + Math.floor(index / 4) * (itemSize + padding);
      
      // Draw item sprite
      const sprite = this.sprites.get(item.spriteKey);
      if (sprite) {
        ctx.drawImage(sprite, itemX, itemY, itemSize, itemSize);
      }
      
      // Draw item count if stackable
      if (item.count > 1) {
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.fillText(item.count.toString(), itemX + itemSize - 15, itemY + itemSize - 5);
      }
    });
  }

  renderMenu(ctx, menu) {
    // Draw menu background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(menu.x, menu.y, menu.width, menu.height);
    
    // Draw menu items
    menu.items.forEach((item, index) => {
      const y = menu.y + (index * 30) + 20;
      
      // Draw selected item highlight
      if (index === menu.selectedIndex) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.fillRect(menu.x, y - 15, menu.width, 30);
      }
      
      // Draw item text
      ctx.fillStyle = '#fff';
      ctx.font = '14px Arial';
      ctx.fillText(item.text, menu.x + 10, y);
    });
  }
}

// Export the RenderManager class
export default RenderManager; 