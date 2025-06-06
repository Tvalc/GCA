// AssetManager handles all asset loading and management
class AssetManager {
  constructor(game) {
    this.game = game;
    this.images = new Map();
    this.sprites = new Map();
    this.animations = new Map();
    this.fonts = new Map();
    this.loadingPromises = [];
    this.totalAssets = 0;
    this.loadedAssets = 0;
    this.isLoading = false;
  }

  async init() {
    this.isLoading = true;
    
    try {
      // Load images
      await this.loadImages();
      
      // Load sprites
      await this.loadSprites();
      
      // Load animations
      await this.loadAnimations();
      
      // Load fonts
      await this.loadFonts();
      
      return true;
    } catch (error) {
      console.error('Failed to initialize assets:', error);
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  async loadImages() {
    const imageAssets = [
      { id: 'background', url: 'assets/images/background.png' },
      { id: 'tileset', url: 'assets/images/tileset.png' },
      { id: 'ui', url: 'assets/images/ui.png' },
      { id: 'items', url: 'assets/images/items.png' },
      { id: 'effects', url: 'assets/images/effects.png' }
    ];
    
    for (const asset of imageAssets) {
      this.loadingPromises.push(this.loadImage(asset.id, asset.url));
    }
    
    await Promise.all(this.loadingPromises);
    this.loadingPromises = [];
  }

  async loadSprites() {
    const spriteAssets = [
      {
        id: 'player',
        url: 'assets/sprites/player.png',
        frameWidth: 32,
        frameHeight: 32,
        frames: 4
      },
      {
        id: 'enemy',
        url: 'assets/sprites/enemy.png',
        frameWidth: 32,
        frameHeight: 32,
        frames: 4
      },
      {
        id: 'npc',
        url: 'assets/sprites/npc.png',
        frameWidth: 32,
        frameHeight: 32,
        frames: 4
      },
      {
        id: 'boss',
        url: 'assets/sprites/boss.png',
        frameWidth: 64,
        frameHeight: 64,
        frames: 4
      }
    ];
    
    for (const asset of spriteAssets) {
      this.loadingPromises.push(this.loadSprite(asset));
    }
    
    await Promise.all(this.loadingPromises);
    this.loadingPromises = [];
  }

  async loadAnimations() {
    const animationAssets = [
      {
        id: 'player_walk',
        spriteId: 'player',
        frames: [0, 1, 2, 3],
        frameRate: 8
      },
      {
        id: 'player_idle',
        spriteId: 'player',
        frames: [0],
        frameRate: 1
      },
      {
        id: 'enemy_walk',
        spriteId: 'enemy',
        frames: [0, 1, 2, 3],
        frameRate: 6
      },
      {
        id: 'enemy_attack',
        spriteId: 'enemy',
        frames: [4, 5, 6, 7],
        frameRate: 12
      },
      {
        id: 'boss_walk',
        spriteId: 'boss',
        frames: [0, 1, 2, 3],
        frameRate: 6
      },
      {
        id: 'boss_attack',
        spriteId: 'boss',
        frames: [4, 5, 6, 7],
        frameRate: 12
      }
    ];
    
    for (const asset of animationAssets) {
      this.loadingPromises.push(this.loadAnimation(asset));
    }
    
    await Promise.all(this.loadingPromises);
    this.loadingPromises = [];
  }

  async loadFonts() {
    const fontAssets = [
      {
        family: 'GameFont',
        url: 'assets/fonts/game_font.woff2'
      }
    ];
    
    for (const asset of fontAssets) {
      this.loadingPromises.push(this.loadFont(asset));
    }
    
    await Promise.all(this.loadingPromises);
    this.loadingPromises = [];
  }

  async loadImage(id, url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.images.set(id, img);
        this.loadedAssets++;
        this.updateLoadingProgress();
        resolve(img);
      };
      
      img.onerror = () => {
        console.error(`Failed to load image: ${url}`);
        reject(new Error(`Failed to load image: ${url}`));
      };
      
      img.src = url;
      this.totalAssets++;
    });
  }

  async loadSprite(asset) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        const sprite = {
          image: img,
          frameWidth: asset.frameWidth,
          frameHeight: asset.frameHeight,
          frames: asset.frames,
          framesPerRow: Math.floor(img.width / asset.frameWidth)
        };
        
        this.sprites.set(asset.id, sprite);
        this.loadedAssets++;
        this.updateLoadingProgress();
        resolve(sprite);
      };
      
      img.onerror = () => {
        console.error(`Failed to load sprite: ${asset.url}`);
        reject(new Error(`Failed to load sprite: ${asset.url}`));
      };
      
      img.src = asset.url;
      this.totalAssets++;
    });
  }

  async loadAnimation(asset) {
    return new Promise((resolve) => {
      const sprite = this.sprites.get(asset.spriteId);
      
      if (!sprite) {
        console.error(`Sprite not found: ${asset.spriteId}`);
        resolve(null);
        return;
      }
      
      const animation = {
        spriteId: asset.spriteId,
        frames: asset.frames,
        frameRate: asset.frameRate,
        frameTime: 1000 / asset.frameRate
      };
      
      this.animations.set(asset.id, animation);
      this.loadedAssets++;
      this.updateLoadingProgress();
      resolve(animation);
    });
  }

  async loadFont(asset) {
    return new Promise((resolve, reject) => {
      const fontFace = new FontFace(asset.family, `url(${asset.url})`);
      
      fontFace.load().then((loadedFont) => {
        document.fonts.add(loadedFont);
        this.fonts.set(asset.family, loadedFont);
        this.loadedAssets++;
        this.updateLoadingProgress();
        resolve(loadedFont);
      }).catch((error) => {
        console.error(`Failed to load font: ${asset.url}`);
        reject(error);
      });
      
      this.totalAssets++;
    });
  }

  updateLoadingProgress() {
    const progress = (this.loadedAssets / this.totalAssets) * 100;
    this.game.managers.ui.showNotification(`Loading assets: ${Math.round(progress)}%`, '#ffffff');
  }

  getImage(id) {
    return this.images.get(id);
  }

  getSprite(id) {
    return this.sprites.get(id);
  }

  getAnimation(id) {
    return this.animations.get(id);
  }

  getFont(family) {
    return this.fonts.get(family);
  }

  drawSprite(ctx, spriteId, frameIndex, x, y, width, height) {
    const sprite = this.sprites.get(spriteId);
    
    if (!sprite) {
      console.error(`Sprite not found: ${spriteId}`);
      return;
    }
    
    const frameX = (frameIndex % sprite.framesPerRow) * sprite.frameWidth;
    const frameY = Math.floor(frameIndex / sprite.framesPerRow) * sprite.frameHeight;
    
    ctx.drawImage(
      sprite.image,
      frameX,
      frameY,
      sprite.frameWidth,
      sprite.frameHeight,
      x,
      y,
      width,
      height
    );
  }

  drawAnimation(ctx, animationId, frameIndex, x, y, width, height) {
    const animation = this.animations.get(animationId);
    
    if (!animation) {
      console.error(`Animation not found: ${animationId}`);
      return;
    }
    
    const frame = animation.frames[frameIndex % animation.frames.length];
    this.drawSprite(ctx, animation.spriteId, frame, x, y, width, height);
  }

  getAnimationFrame(animationId, time) {
    const animation = this.animations.get(animationId);
    
    if (!animation) {
      console.error(`Animation not found: ${animationId}`);
      return 0;
    }
    
    const frameIndex = Math.floor(time / animation.frameTime) % animation.frames.length;
    return animation.frames[frameIndex];
  }

  preloadAssets(assetList) {
    for (const asset of assetList) {
      switch (asset.type) {
        case 'image':
          this.loadingPromises.push(this.loadImage(asset.id, asset.url));
          break;
        case 'sprite':
          this.loadingPromises.push(this.loadSprite(asset));
          break;
        case 'animation':
          this.loadingPromises.push(this.loadAnimation(asset));
          break;
        case 'font':
          this.loadingPromises.push(this.loadFont(asset));
          break;
      }
    }
    
    return Promise.all(this.loadingPromises);
  }

  unloadAsset(id, type) {
    switch (type) {
      case 'image':
        this.images.delete(id);
        break;
      case 'sprite':
        this.sprites.delete(id);
        break;
      case 'animation':
        this.animations.delete(id);
        break;
      case 'font':
        this.fonts.delete(id);
        break;
    }
  }

  clearAssets() {
    this.images.clear();
    this.sprites.clear();
    this.animations.clear();
    this.fonts.clear();
    this.loadingPromises = [];
    this.totalAssets = 0;
    this.loadedAssets = 0;
  }
}

// Export the AssetManager class
export default AssetManager; 