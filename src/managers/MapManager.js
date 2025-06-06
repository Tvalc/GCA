// MapManager handles game maps and world generation
class MapManager {
  constructor(game) {
    this.game = game;
    this.currentMap = null;
    this.maps = new Map();
    this.tileSize = 32;
    this.chunkSize = 16;
    this.loadedChunks = new Map();
    this.activeChunks = new Set();
    this.spawnPoints = new Map();
    this.portals = new Map();
  }

  init() {
    // Initialize map data
    this.initMapData();
  }

  initMapData() {
    // Load map definitions
    this.maps.set('town', {
      name: 'Town',
      width: 50,
      height: 50,
      tileset: 'town',
      background: 'town_bg',
      music: 'town_theme',
      spawnPoints: [
        { id: 'player_spawn', x: 25, y: 25 },
        { id: 'shop_spawn', x: 15, y: 15 },
        { id: 'quest_spawn', x: 35, y: 35 }
      ],
      portals: [
        { id: 'dungeon_portal', x: 40, y: 40, target: 'dungeon', targetSpawn: 'dungeon_entrance' }
      ]
    });

    this.maps.set('dungeon', {
      name: 'Dungeon',
      width: 100,
      height: 100,
      tileset: 'dungeon',
      background: 'dungeon_bg',
      music: 'dungeon_theme',
      spawnPoints: [
        { id: 'dungeon_entrance', x: 5, y: 5 },
        { id: 'boss_room', x: 90, y: 90 }
      ],
      portals: [
        { id: 'town_portal', x: 5, y: 5, target: 'town', targetSpawn: 'player_spawn' }
      ]
    });
  }

  // Map Loading
  async loadMap(mapId) {
    const mapData = this.maps.get(mapId);
    if (!mapData) {
      console.error(`Map not found: ${mapId}`);
      return false;
    }

    // Clear current map
    this.clearCurrentMap();

    // Load new map
    this.currentMap = {
      id: mapId,
      ...mapData,
      chunks: new Map(),
      entities: new Map()
    };

    // Load initial chunks
    await this.loadInitialChunks();

    // Set up spawn points
    this.setupSpawnPoints();

    // Set up portals
    this.setupPortals();

    // Play map music
    this.game.managers.audio.playMusic(mapData.music);

    return true;
  }

  async loadInitialChunks() {
    const centerX = Math.floor(this.currentMap.width / 2);
    const centerY = Math.floor(this.currentMap.height / 2);
    const viewDistance = 2;

    for (let x = centerX - viewDistance; x <= centerX + viewDistance; x++) {
      for (let y = centerY - viewDistance; y <= centerY + viewDistance; y++) {
        await this.loadChunk(x, y);
      }
    }
  }

  async loadChunk(chunkX, chunkY) {
    const chunkId = `${chunkX},${chunkY}`;
    if (this.loadedChunks.has(chunkId)) {
      return;
    }

    // Generate chunk data
    const chunk = await this.generateChunk(chunkX, chunkY);
    this.loadedChunks.set(chunkId, chunk);
    this.currentMap.chunks.set(chunkId, chunk);
  }

  async generateChunk(chunkX, chunkY) {
    const chunk = {
      x: chunkX,
      y: chunkY,
      tiles: new Array(this.chunkSize * this.chunkSize),
      entities: new Map()
    };

    // Generate terrain
    for (let y = 0; y < this.chunkSize; y++) {
      for (let x = 0; x < this.chunkSize; x++) {
        const tileX = chunkX * this.chunkSize + x;
        const tileY = chunkY * this.chunkSize + y;
        const tileIndex = y * this.chunkSize + x;

        chunk.tiles[tileIndex] = this.generateTile(tileX, tileY);
      }
    }

    // Generate entities
    await this.generateChunkEntities(chunk);

    return chunk;
  }

  generateTile(x, y) {
    // Get tile type based on position and map type
    const mapType = this.currentMap.id;
    let tileType = 'floor';

    switch (mapType) {
      case 'town':
        tileType = this.generateTownTile(x, y);
        break;
      case 'dungeon':
        tileType = this.generateDungeonTile(x, y);
        break;
    }

    return {
      type: tileType,
      walkable: this.isTileWalkable(tileType),
      interactive: this.isTileInteractive(tileType)
    };
  }

  generateTownTile(x, y) {
    // Generate town-specific tiles
    if (x === 0 || x === this.currentMap.width - 1 || y === 0 || y === this.currentMap.height - 1) {
      return 'wall';
    }

    // Generate buildings
    if (x % 10 === 0 && y % 10 === 0) {
      return 'building';
    }

    // Generate paths
    if (x % 5 === 0 || y % 5 === 0) {
      return 'path';
    }

    return 'grass';
  }

  generateDungeonTile(x, y) {
    // Generate dungeon-specific tiles
    if (x === 0 || x === this.currentMap.width - 1 || y === 0 || y === this.currentMap.height - 1) {
      return 'wall';
    }

    // Generate rooms
    if (x % 20 === 0 && y % 20 === 0) {
      return 'room';
    }

    // Generate corridors
    if (x % 10 === 0 || y % 10 === 0) {
      return 'corridor';
    }

    return 'floor';
  }

  async generateChunkEntities(chunk) {
    const mapType = this.currentMap.id;
    const chunkX = chunk.x;
    const chunkY = chunk.y;

    switch (mapType) {
      case 'town':
        await this.generateTownEntities(chunk);
        break;
      case 'dungeon':
        await this.generateDungeonEntities(chunk);
        break;
    }
  }

  async generateTownEntities(chunk) {
    // Generate NPCs
    if (chunk.x === 0 && chunk.y === 0) {
      const shopkeeper = this.game.managers.entity.createNPC('shopkeeper', {
        x: chunk.x * this.chunkSize + 5,
        y: chunk.y * this.chunkSize + 5
      });
      chunk.entities.set(shopkeeper.id, shopkeeper);
    }

    // Generate quest givers
    if (chunk.x === 1 && chunk.y === 1) {
      const questGiver = this.game.managers.entity.createNPC('quest_giver', {
        x: chunk.x * this.chunkSize + 5,
        y: chunk.y * this.chunkSize + 5
      });
      chunk.entities.set(questGiver.id, questGiver);
    }
  }

  async generateDungeonEntities(chunk) {
    // Generate enemies
    if (Math.random() < 0.3) {
      const enemyType = this.getRandomEnemyType();
      const enemy = this.game.managers.entity.createEnemy(enemyType, {
        x: chunk.x * this.chunkSize + Math.random() * this.chunkSize,
        y: chunk.y * this.chunkSize + Math.random() * this.chunkSize
      });
      chunk.entities.set(enemy.id, enemy);
    }

    // Generate items
    if (Math.random() < 0.1) {
      const itemType = this.getRandomItemType();
      const item = this.game.managers.entity.createItem(itemType, {
        x: chunk.x * this.chunkSize + Math.random() * this.chunkSize,
        y: chunk.y * this.chunkSize + Math.random() * this.chunkSize
      });
      chunk.entities.set(item.id, item);
    }
  }

  // Map Updates
  update(deltaTime) {
    if (!this.currentMap) return;

    // Update active chunks
    this.updateActiveChunks();

    // Update map entities
    this.updateMapEntities(deltaTime);
  }

  updateActiveChunks() {
    if (!this.game.managers.entity.player) return;

    const playerChunkX = Math.floor(this.game.managers.entity.player.position.x / this.chunkSize);
    const playerChunkY = Math.floor(this.game.managers.entity.player.position.y / this.chunkSize);
    const viewDistance = 2;

    // Update active chunks
    const newActiveChunks = new Set();
    for (let x = playerChunkX - viewDistance; x <= playerChunkX + viewDistance; x++) {
      for (let y = playerChunkY - viewDistance; y <= playerChunkY + viewDistance; y++) {
        const chunkId = `${x},${y}`;
        newActiveChunks.add(chunkId);

        if (!this.loadedChunks.has(chunkId)) {
          this.loadChunk(x, y);
        }
      }
    }

    // Unload inactive chunks
    for (const chunkId of this.activeChunks) {
      if (!newActiveChunks.has(chunkId)) {
        this.unloadChunk(chunkId);
      }
    }

    this.activeChunks = newActiveChunks;
  }

  updateMapEntities(deltaTime) {
    for (const chunkId of this.activeChunks) {
      const chunk = this.loadedChunks.get(chunkId);
      if (!chunk) continue;

      for (const entity of chunk.entities.values()) {
        // Update entity position
        entity.position.x += entity.velocity.x * deltaTime;
        entity.position.y += entity.velocity.y * deltaTime;

        // Check for chunk crossing
        const newChunkX = Math.floor(entity.position.x / this.chunkSize);
        const newChunkY = Math.floor(entity.position.y / this.chunkSize);
        const currentChunkX = chunk.x;
        const currentChunkY = chunk.y;

        if (newChunkX !== currentChunkX || newChunkY !== currentChunkY) {
          // Move entity to new chunk
          const newChunkId = `${newChunkX},${newChunkY}`;
          const newChunk = this.loadedChunks.get(newChunkId);
          if (newChunk) {
            chunk.entities.delete(entity.id);
            newChunk.entities.set(entity.id, entity);
          }
        }
      }
    }
  }

  // Map Rendering
  render(ctx) {
    if (!this.currentMap) return;

    // Render background
    this.renderBackground(ctx);

    // Render active chunks
    this.renderActiveChunks(ctx);

    // Render portals
    this.renderPortals(ctx);
  }

  renderBackground(ctx) {
    const background = this.game.managers.assets.getImage(this.currentMap.background);
    if (background) {
      ctx.drawImage(background, 0, 0, this.game.canvas.width, this.game.canvas.height);
    }
  }

  renderActiveChunks(ctx) {
    for (const chunkId of this.activeChunks) {
      const chunk = this.loadedChunks.get(chunkId);
      if (!chunk) continue;

      // Render tiles
      for (let y = 0; y < this.chunkSize; y++) {
        for (let x = 0; x < this.chunkSize; x++) {
          const tileIndex = y * this.chunkSize + x;
          const tile = chunk.tiles[tileIndex];
          const tileX = chunk.x * this.chunkSize + x;
          const tileY = chunk.y * this.chunkSize + y;

          this.renderTile(ctx, tile, tileX, tileY);
        }
      }

      // Render entities
      for (const entity of chunk.entities.values()) {
        this.game.managers.entity.renderEntity(ctx, entity);
      }
    }
  }

  renderTile(ctx, tile, x, y) {
    const tileset = this.game.managers.assets.getImage(this.currentMap.tileset);
    if (!tileset) return;

    const tileSize = this.tileSize;
    const tileX = x * tileSize;
    const tileY = y * tileSize;

    // Get tile source coordinates from tileset
    const sourceX = this.getTileSourceX(tile.type);
    const sourceY = this.getTileSourceY(tile.type);

    ctx.drawImage(
      tileset,
      sourceX,
      sourceY,
      tileSize,
      tileSize,
      tileX,
      tileY,
      tileSize,
      tileSize
    );
  }

  renderPortals(ctx) {
    for (const portal of this.portals.values()) {
      const portalX = portal.x * this.tileSize;
      const portalY = portal.y * this.tileSize;

      ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
      ctx.fillRect(portalX, portalY, this.tileSize, this.tileSize);
    }
  }

  // Map Navigation
  setupSpawnPoints() {
    for (const spawn of this.currentMap.spawnPoints) {
      this.spawnPoints.set(spawn.id, {
        x: spawn.x * this.tileSize,
        y: spawn.y * this.tileSize
      });
    }
  }

  setupPortals() {
    for (const portal of this.currentMap.portals) {
      this.portals.set(portal.id, {
        x: portal.x,
        y: portal.y,
        target: portal.target,
        targetSpawn: portal.targetSpawn
      });
    }
  }

  getSpawnPoint(id) {
    return this.spawnPoints.get(id);
  }

  getPortalAt(x, y) {
    const tileX = Math.floor(x / this.tileSize);
    const tileY = Math.floor(y / this.tileSize);

    for (const portal of this.portals.values()) {
      if (portal.x === tileX && portal.y === tileY) {
        return portal;
      }
    }

    return null;
  }

  // Map Utilities
  isTileWalkable(tileType) {
    const walkableTiles = ['floor', 'grass', 'path', 'corridor'];
    return walkableTiles.includes(tileType);
  }

  isTileInteractive(tileType) {
    const interactiveTiles = ['chest', 'door', 'lever'];
    return interactiveTiles.includes(tileType);
  }

  getTileSourceX(tileType) {
    const tileIndex = this.getTileIndex(tileType);
    return (tileIndex % 8) * this.tileSize;
  }

  getTileSourceY(tileType) {
    const tileIndex = this.getTileIndex(tileType);
    return Math.floor(tileIndex / 8) * this.tileSize;
  }

  getTileIndex(tileType) {
    const tileIndices = {
      floor: 0,
      wall: 1,
      grass: 2,
      path: 3,
      building: 4,
      room: 5,
      corridor: 6,
      chest: 7,
      door: 8,
      lever: 9
    };

    return tileIndices[tileType] || 0;
  }

  getRandomEnemyType() {
    const enemyTypes = ['slime', 'goblin', 'skeleton', 'zombie'];
    return enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
  }

  getRandomItemType() {
    const itemTypes = ['health_potion', 'mana_potion', 'gold', 'weapon', 'armor'];
    return itemTypes[Math.floor(Math.random() * itemTypes.length)];
  }

  // Map Cleanup
  clearCurrentMap() {
    if (this.currentMap) {
      // Unload all chunks
      for (const chunkId of this.loadedChunks.keys()) {
        this.unloadChunk(chunkId);
      }

      // Clear maps
      this.loadedChunks.clear();
      this.activeChunks.clear();
      this.spawnPoints.clear();
      this.portals.clear();

      this.currentMap = null;
    }
  }

  unloadChunk(chunkId) {
    const chunk = this.loadedChunks.get(chunkId);
    if (!chunk) return;

    // Remove entities
    for (const entity of chunk.entities.values()) {
      this.game.managers.entity.removeEntity(entity.id);
    }

    // Remove chunk
    this.loadedChunks.delete(chunkId);
    this.currentMap.chunks.delete(chunkId);
  }
}

// Export the MapManager class
export default MapManager; 