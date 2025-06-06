// EntityManager handles game entities including player, enemies, NPCs, and items
class EntityManager {
  constructor(game) {
    this.game = game;
    this.entities = new Map();
    this.player = null;
    this.enemies = new Map();
    this.npcs = new Map();
    this.items = new Map();
    this.projectiles = new Map();
    this.effects = new Map();
    this.nextEntityId = 1;
  }

  init() {
    // Initialize entity pools
    this.initEntityPools();
  }

  initEntityPools() {
    // Initialize entity type pools
    this.entityPools = {
      enemies: new Map(),
      npcs: new Map(),
      items: new Map(),
      projectiles: new Map(),
      effects: new Map()
    };
  }

  // Entity Creation
  createPlayer(data) {
    const player = {
      id: this.getNextEntityId(),
      type: 'player',
      name: data.name,
      class: data.class,
      level: 1,
      xp: 0,
      health: data.health,
      maxHealth: data.health,
      mana: data.mana,
      maxMana: data.mana,
      strength: data.strength,
      dexterity: data.dexterity,
      intelligence: data.intelligence,
      position: { x: 0, y: 0 },
      velocity: { x: 0, y: 0 },
      direction: 'down',
      state: 'idle',
      inventory: [],
      equipment: {},
      skills: [],
      quests: [],
      stats: {
        attack: 0,
        defense: 0,
        speed: 0,
        critical: 0
      }
    };

    this.player = player;
    this.entities.set(player.id, player);
    return player;
  }

  createEnemy(type, position) {
    const enemyData = this.game.data.enemies[type];
    if (!enemyData) return null;

    const enemy = {
      id: this.getNextEntityId(),
      type: 'enemy',
      enemyType: type,
      name: enemyData.name,
      level: enemyData.level,
      health: enemyData.health,
      maxHealth: enemyData.health,
      mana: enemyData.mana,
      maxMana: enemyData.mana,
      position: { ...position },
      velocity: { x: 0, y: 0 },
      direction: 'down',
      state: 'idle',
      stats: { ...enemyData.stats },
      drops: enemyData.drops,
      xp: enemyData.xp,
      gold: enemyData.gold,
      ai: {
        type: enemyData.ai.type,
        state: 'idle',
        target: null,
        lastAttack: 0,
        attackCooldown: enemyData.ai.attackCooldown
      }
    };

    this.enemies.set(enemy.id, enemy);
    this.entities.set(enemy.id, enemy);
    return enemy;
  }

  createNPC(type, position) {
    const npcData = this.game.data.npcs[type];
    if (!npcData) return null;

    const npc = {
      id: this.getNextEntityId(),
      type: 'npc',
      npcType: type,
      name: npcData.name,
      position: { ...position },
      direction: 'down',
      state: 'idle',
      dialog: npcData.dialog,
      quests: npcData.quests,
      shop: npcData.shop
    };

    this.npcs.set(npc.id, npc);
    this.entities.set(npc.id, npc);
    return npc;
  }

  createItem(type, position) {
    const itemData = this.game.data.items[type];
    if (!itemData) return null;

    const item = {
      id: this.getNextEntityId(),
      type: 'item',
      itemType: type,
      name: itemData.name,
      description: itemData.description,
      position: { ...position },
      stackable: itemData.stackable,
      maxStack: itemData.maxStack,
      quantity: 1,
      stats: itemData.stats,
      value: itemData.value
    };

    this.items.set(item.id, item);
    this.entities.set(item.id, item);
    return item;
  }

  createProjectile(type, source, target, damage) {
    const projectileData = this.game.data.projectiles[type];
    if (!projectileData) return null;

    const projectile = {
      id: this.getNextEntityId(),
      type: 'projectile',
      projectileType: type,
      source: source,
      target: target,
      position: { ...source.position },
      velocity: this.calculateProjectileVelocity(source.position, target),
      damage: damage,
      speed: projectileData.speed,
      range: projectileData.range,
      distanceTraveled: 0
    };

    this.projectiles.set(projectile.id, projectile);
    this.entities.set(projectile.id, projectile);
    return projectile;
  }

  createEffect(type, position, duration) {
    const effectData = this.game.data.effects[type];
    if (!effectData) return null;

    const effect = {
      id: this.getNextEntityId(),
      type: 'effect',
      effectType: type,
      position: { ...position },
      duration: duration,
      elapsed: 0,
      active: true
    };

    this.effects.set(effect.id, effect);
    this.entities.set(effect.id, effect);
    return effect;
  }

  // Entity Updates
  update(deltaTime) {
    // Update player
    if (this.player) {
      this.updatePlayer(deltaTime);
    }

    // Update enemies
    for (const enemy of this.enemies.values()) {
      this.updateEnemy(enemy, deltaTime);
    }

    // Update NPCs
    for (const npc of this.npcs.values()) {
      this.updateNPC(npc, deltaTime);
    }

    // Update projectiles
    for (const projectile of this.projectiles.values()) {
      this.updateProjectile(projectile, deltaTime);
    }

    // Update effects
    for (const effect of this.effects.values()) {
      this.updateEffect(effect, deltaTime);
    }
  }

  updatePlayer(deltaTime) {
    // Update player position
    this.player.position.x += this.player.velocity.x * deltaTime;
    this.player.position.y += this.player.velocity.y * deltaTime;

    // Update player state
    if (this.player.velocity.x !== 0 || this.player.velocity.y !== 0) {
      this.player.state = 'walking';
    } else {
      this.player.state = 'idle';
    }

    // Update player direction
    if (Math.abs(this.player.velocity.x) > Math.abs(this.player.velocity.y)) {
      this.player.direction = this.player.velocity.x > 0 ? 'right' : 'left';
    } else if (this.player.velocity.y !== 0) {
      this.player.direction = this.player.velocity.y > 0 ? 'down' : 'up';
    }
  }

  updateEnemy(enemy, deltaTime) {
    // Update enemy position
    enemy.position.x += enemy.velocity.x * deltaTime;
    enemy.position.y += enemy.velocity.y * deltaTime;

    // Update enemy AI
    this.updateEnemyAI(enemy, deltaTime);

    // Update enemy state
    if (enemy.velocity.x !== 0 || enemy.velocity.y !== 0) {
      enemy.state = 'walking';
    } else {
      enemy.state = 'idle';
    }

    // Update enemy direction
    if (Math.abs(enemy.velocity.x) > Math.abs(enemy.velocity.y)) {
      enemy.direction = enemy.velocity.x > 0 ? 'right' : 'left';
    } else if (enemy.velocity.y !== 0) {
      enemy.direction = enemy.velocity.y > 0 ? 'down' : 'up';
    }
  }

  updateEnemyAI(enemy, deltaTime) {
    const ai = enemy.ai;
    const now = performance.now();

    switch (ai.type) {
      case 'aggressive':
        this.updateAggressiveAI(enemy, deltaTime);
        break;
      case 'defensive':
        this.updateDefensiveAI(enemy, deltaTime);
        break;
      case 'patrol':
        this.updatePatrolAI(enemy, deltaTime);
        break;
    }
  }

  updateAggressiveAI(enemy, deltaTime) {
    const ai = enemy.ai;
    const now = performance.now();

    // Find target if none
    if (!ai.target) {
      ai.target = this.findNearestPlayer(enemy);
    }

    // Move towards target
    if (ai.target) {
      const dx = ai.target.position.x - enemy.position.x;
      const dy = ai.target.position.y - enemy.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > enemy.stats.attackRange) {
        // Move towards target
        enemy.velocity.x = (dx / distance) * enemy.stats.speed;
        enemy.velocity.y = (dy / distance) * enemy.stats.speed;
      } else {
        // Stop and attack
        enemy.velocity.x = 0;
        enemy.velocity.y = 0;

        if (now - ai.lastAttack >= ai.attackCooldown) {
          this.attackTarget(enemy, ai.target);
          ai.lastAttack = now;
        }
      }
    }
  }

  updateDefensiveAI(enemy, deltaTime) {
    const ai = enemy.ai;
    const now = performance.now();

    // Find target if none
    if (!ai.target) {
      ai.target = this.findNearestPlayer(enemy);
    }

    // Move away from target if too close
    if (ai.target) {
      const dx = ai.target.position.x - enemy.position.x;
      const dy = ai.target.position.y - enemy.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < enemy.stats.attackRange) {
        // Move away from target
        enemy.velocity.x = -(dx / distance) * enemy.stats.speed;
        enemy.velocity.y = -(dy / distance) * enemy.stats.speed;
      } else if (distance > enemy.stats.attackRange * 2) {
        // Move towards target
        enemy.velocity.x = (dx / distance) * enemy.stats.speed;
        enemy.velocity.y = (dy / distance) * enemy.stats.speed;
      } else {
        // Stop and attack
        enemy.velocity.x = 0;
        enemy.velocity.y = 0;

        if (now - ai.lastAttack >= ai.attackCooldown) {
          this.attackTarget(enemy, ai.target);
          ai.lastAttack = now;
        }
      }
    }
  }

  updatePatrolAI(enemy, deltaTime) {
    const ai = enemy.ai;

    // Update patrol points
    if (!ai.patrolPoints) {
      ai.patrolPoints = this.generatePatrolPoints(enemy);
      ai.currentPoint = 0;
    }

    // Move to current patrol point
    const targetPoint = ai.patrolPoints[ai.currentPoint];
    const dx = targetPoint.x - enemy.position.x;
    const dy = targetPoint.y - enemy.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 5) {
      // Reached patrol point, move to next
      ai.currentPoint = (ai.currentPoint + 1) % ai.patrolPoints.length;
    } else {
      // Move towards patrol point
      enemy.velocity.x = (dx / distance) * enemy.stats.speed;
      enemy.velocity.y = (dy / distance) * enemy.stats.speed;
    }
  }

  updateNPC(npc, deltaTime) {
    // Update NPC state
    if (npc.state === 'talking') {
      // Handle dialog state
    } else {
      npc.state = 'idle';
    }
  }

  updateProjectile(projectile, deltaTime) {
    // Update projectile position
    projectile.position.x += projectile.velocity.x * deltaTime;
    projectile.position.y += projectile.velocity.y * deltaTime;

    // Update distance traveled
    const dx = projectile.velocity.x * deltaTime;
    const dy = projectile.velocity.y * deltaTime;
    projectile.distanceTraveled += Math.sqrt(dx * dx + dy * dy);

    // Check for collisions
    this.checkProjectileCollisions(projectile);

    // Remove if traveled max distance
    if (projectile.distanceTraveled >= projectile.range) {
      this.removeEntity(projectile.id);
    }
  }

  updateEffect(effect, deltaTime) {
    // Update effect duration
    effect.elapsed += deltaTime;

    // Remove if expired
    if (effect.elapsed >= effect.duration) {
      this.removeEntity(effect.id);
    }
  }

  // Entity Interactions
  attackTarget(attacker, target) {
    // Calculate damage
    const damage = this.calculateDamage(attacker, target);

    // Apply damage
    this.applyDamage(target, damage);

    // Create hit effect
    this.createEffect('hit', target.position, 200);

    // Check for death
    if (target.health <= 0) {
      this.handleEntityDeath(target);
    }
  }

  calculateDamage(attacker, target) {
    const baseDamage = attacker.stats.attack;
    const defense = target.stats.defense;
    const critical = Math.random() < attacker.stats.critical;

    let damage = baseDamage - defense;
    if (critical) {
      damage *= 2;
    }

    return Math.max(1, Math.floor(damage));
  }

  applyDamage(target, damage) {
    target.health = Math.max(0, target.health - damage);
  }

  handleEntityDeath(entity) {
    switch (entity.type) {
      case 'enemy':
        this.handleEnemyDeath(entity);
        break;
      case 'player':
        this.handlePlayerDeath(entity);
        break;
    }
  }

  handleEnemyDeath(enemy) {
    // Drop items
    this.dropEnemyLoot(enemy);

    // Award XP and gold
    if (this.player) {
      this.player.xp += enemy.xp;
      this.game.state.gold += enemy.gold;
    }

    // Remove enemy
    this.removeEntity(enemy.id);
  }

  handlePlayerDeath(player) {
    // Handle player death
    this.game.managers.ui.showDeathScreen();
  }

  dropEnemyLoot(enemy) {
    for (const drop of enemy.drops) {
      if (Math.random() < drop.chance) {
        this.createItem(drop.item, enemy.position);
      }
    }
  }

  // Entity Queries
  findNearestPlayer(entity) {
    if (!this.player) return null;

    const dx = this.player.position.x - entity.position.x;
    const dy = this.player.position.y - entity.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance <= entity.stats.detectionRange ? this.player : null;
  }

  findNearestEnemy(position, range) {
    let nearest = null;
    let minDistance = range;

    for (const enemy of this.enemies.values()) {
      const dx = enemy.position.x - position.x;
      const dy = enemy.position.y - position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < minDistance) {
        nearest = enemy;
        minDistance = distance;
      }
    }

    return nearest;
  }

  // Entity Management
  getNextEntityId() {
    return this.nextEntityId++;
  }

  removeEntity(id) {
    const entity = this.entities.get(id);
    if (!entity) return;

    switch (entity.type) {
      case 'enemy':
        this.enemies.delete(id);
        break;
      case 'npc':
        this.npcs.delete(id);
        break;
      case 'item':
        this.items.delete(id);
        break;
      case 'projectile':
        this.projectiles.delete(id);
        break;
      case 'effect':
        this.effects.delete(id);
        break;
    }

    this.entities.delete(id);
  }

  clearEntities() {
    this.entities.clear();
    this.enemies.clear();
    this.npcs.clear();
    this.items.clear();
    this.projectiles.clear();
    this.effects.clear();
    this.player = null;
  }

  // Utility Functions
  calculateProjectileVelocity(start, target) {
    const dx = target.position.x - start.x;
    const dy = target.position.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return {
      x: (dx / distance) * target.speed,
      y: (dy / distance) * target.speed
    };
  }

  generatePatrolPoints(entity) {
    const points = [];
    const numPoints = 4;
    const radius = 100;

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      points.push({
        x: entity.position.x + Math.cos(angle) * radius,
        y: entity.position.y + Math.sin(angle) * radius
      });
    }

    return points;
  }

  checkProjectileCollisions(projectile) {
    // Check collision with enemies
    for (const enemy of this.enemies.values()) {
      if (this.checkCollision(projectile, enemy)) {
        this.applyDamage(enemy, projectile.damage);
        this.removeEntity(projectile.id);
        return;
      }
    }

    // Check collision with player
    if (this.player && this.checkCollision(projectile, this.player)) {
      this.applyDamage(this.player, projectile.damage);
      this.removeEntity(projectile.id);
      return;
    }
  }

  checkCollision(entity1, entity2) {
    const dx = entity1.position.x - entity2.position.x;
    const dy = entity1.position.y - entity2.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < 32; // Collision radius
  }
}

// Export the EntityManager class
export default EntityManager; 