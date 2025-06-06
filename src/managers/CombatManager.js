// CombatManager handles combat mechanics and damage calculations
class CombatManager {
  constructor(game) {
    this.game = game;
    this.combatLog = [];
    this.maxCombatLogSize = 100;
    this.criticalHitChance = 0.1;
    this.criticalHitMultiplier = 1.5;
    this.dodgeChance = 0.05;
    this.blockChance = 0.1;
    this.blockDamageReduction = 0.5;
  }

  init() {
    // Initialize combat data
    this.initCombatData();
  }

  initCombatData() {
    // Define damage types
    this.damageTypes = {
      physical: {
        name: 'Physical',
        color: '#ff0000'
      },
      magical: {
        name: 'Magical',
        color: '#0000ff'
      },
      fire: {
        name: 'Fire',
        color: '#ff4500'
      },
      ice: {
        name: 'Ice',
        color: '#00ffff'
      },
      lightning: {
        name: 'Lightning',
        color: '#ffff00'
      }
    };

    // Define status effects
    this.statusEffects = {
      poison: {
        name: 'Poison',
        color: '#00ff00',
        duration: 5000,
        tickInterval: 1000,
        damage: 5,
        type: 'damage'
      },
      burn: {
        name: 'Burn',
        color: '#ff4500',
        duration: 3000,
        tickInterval: 500,
        damage: 10,
        type: 'damage'
      },
      stun: {
        name: 'Stun',
        color: '#ffff00',
        duration: 2000,
        type: 'control'
      },
      slow: {
        name: 'Slow',
        color: '#808080',
        duration: 4000,
        speedReduction: 0.5,
        type: 'control'
      }
    };
  }

  // Combat Actions
  attack(attacker, target, damageType = 'physical') {
    if (!this.canAttack(attacker, target)) {
      return false;
    }

    // Calculate damage
    const damage = this.calculateDamage(attacker, target, damageType);
    
    // Apply damage
    this.applyDamage(target, damage, damageType);

    // Add to combat log
    this.addCombatLog({
      type: 'attack',
      attacker: attacker.id,
      target: target.id,
      damage,
      damageType,
      timestamp: Date.now()
    });

    return true;
  }

  useSkill(attacker, target, skill) {
    if (!this.canUseSkill(attacker, target, skill)) {
      return false;
    }

    // Calculate skill effects
    const effects = this.calculateSkillEffects(attacker, target, skill);
    
    // Apply skill effects
    this.applySkillEffects(target, effects);

    // Add to combat log
    this.addCombatLog({
      type: 'skill',
      attacker: attacker.id,
      target: target.id,
      skill: skill.id,
      effects,
      timestamp: Date.now()
    });

    return true;
  }

  // Damage Calculation
  calculateDamage(attacker, target, damageType) {
    let damage = attacker.damage || 0;

    // Apply critical hit
    if (Math.random() < this.criticalHitChance) {
      damage *= this.criticalHitMultiplier;
      this.addCombatLog({
        type: 'critical',
        attacker: attacker.id,
        target: target.id,
        timestamp: Date.now()
      });
    }

    // Apply defense reduction
    const defense = target.defense || 0;
    damage = Math.max(1, damage - defense);

    // Apply damage type modifiers
    damage = this.applyDamageTypeModifiers(damage, damageType, target);

    return Math.floor(damage);
  }

  applyDamageTypeModifiers(damage, damageType, target) {
    // Apply resistances and vulnerabilities
    const resistance = target.resistances?.[damageType] || 0;
    return damage * (1 - resistance);
  }

  // Skill Effects
  calculateSkillEffects(attacker, target, skill) {
    const effects = [];

    // Calculate damage effects
    if (skill.damage) {
      const damage = this.calculateDamage(attacker, target, skill.damageType);
      effects.push({
        type: 'damage',
        value: damage,
        damageType: skill.damageType
      });
    }

    // Calculate healing effects
    if (skill.healing) {
      const healing = skill.healing * (attacker.healingPower || 1);
      effects.push({
        type: 'healing',
        value: healing
      });
    }

    // Calculate status effects
    if (skill.statusEffects) {
      for (const effect of skill.statusEffects) {
        effects.push({
          type: 'status',
          effect: effect.type,
          duration: effect.duration,
          value: effect.value
        });
      }
    }

    return effects;
  }

  // Effect Application
  applyDamage(target, damage, damageType) {
    // Check for dodge
    if (Math.random() < this.dodgeChance) {
      this.addCombatLog({
        type: 'dodge',
        target: target.id,
        timestamp: Date.now()
      });
      return;
    }

    // Check for block
    let finalDamage = damage;
    if (Math.random() < this.blockChance) {
      finalDamage *= (1 - this.blockDamageReduction);
      this.addCombatLog({
        type: 'block',
        target: target.id,
        damage: finalDamage,
        timestamp: Date.now()
      });
    }

    // Apply damage
    target.health = Math.max(0, target.health - finalDamage);

    // Check for death
    if (target.health <= 0) {
      this.handleDeath(target);
    }
  }

  applySkillEffects(target, effects) {
    for (const effect of effects) {
      switch (effect.type) {
        case 'damage':
          this.applyDamage(target, effect.value, effect.damageType);
          break;
        case 'healing':
          target.health = Math.min(
            target.maxHealth,
            target.health + effect.value
          );
          break;
        case 'status':
          this.applyStatusEffect(target, effect);
          break;
      }
    }
  }

  applyStatusEffect(target, effect) {
    const statusEffect = this.statusEffects[effect.effect];
    if (!statusEffect) return;

    // Add or refresh status effect
    target.statusEffects = target.statusEffects || new Map();
    target.statusEffects.set(effect.effect, {
      ...statusEffect,
      startTime: Date.now(),
      value: effect.value
    });
  }

  // Combat Checks
  canAttack(attacker, target) {
    return (
      attacker &&
      target &&
      attacker.health > 0 &&
      target.health > 0 &&
      this.isInRange(attacker, target)
    );
  }

  canUseSkill(attacker, target, skill) {
    return (
      this.canAttack(attacker, target) &&
      attacker.mana >= (skill.manaCost || 0) &&
      !this.isOnCooldown(attacker, skill)
    );
  }

  isInRange(attacker, target) {
    const distance = this.calculateDistance(attacker.position, target.position);
    return distance <= (attacker.attackRange || 1);
  }

  isOnCooldown(attacker, skill) {
    const cooldowns = attacker.cooldowns || new Map();
    const lastUse = cooldowns.get(skill.id) || 0;
    return Date.now() - lastUse < (skill.cooldown || 0);
  }

  // Utility Functions
  calculateDistance(pos1, pos2) {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  handleDeath(entity) {
    // Handle entity death
    if (entity.type === 'enemy') {
      this.handleEnemyDeath(entity);
    } else if (entity.type === 'player') {
      this.handlePlayerDeath(entity);
    }
  }

  handleEnemyDeath(enemy) {
    // Drop loot
    this.game.managers.entity.dropLoot(enemy);

    // Award XP
    if (enemy.xp) {
      this.game.managers.entity.player.xp += enemy.xp;
    }

    // Remove enemy
    this.game.managers.entity.removeEnemy(enemy.id);
  }

  handlePlayerDeath(player) {
    // Handle player death
    this.game.managers.ui.showGameOver();
  }

  // Combat Log
  addCombatLog(entry) {
    this.combatLog.push(entry);
    if (this.combatLog.length > this.maxCombatLogSize) {
      this.combatLog.shift();
    }
  }

  getCombatLog() {
    return this.combatLog;
  }

  clearCombatLog() {
    this.combatLog = [];
  }

  // Combat State Management
  saveCombatState() {
    return {
      combatLog: this.combatLog
    };
  }

  loadCombatState(state) {
    this.combatLog = state.combatLog;
  }

  // Combat Events
  onAttack(attacker, target, damage) {
    this.game.managers.ui.showDamageNumber(target.position, damage);
  }

  onCriticalHit(attacker, target) {
    this.game.managers.ui.showCriticalHit(target.position);
  }

  onDodge(target) {
    this.game.managers.ui.showDodge(target.position);
  }

  onBlock(target, damage) {
    this.game.managers.ui.showBlock(target.position, damage);
  }

  onStatusEffect(target, effect) {
    this.game.managers.ui.showStatusEffect(target.position, effect);
  }

  onDeath(entity) {
    this.game.managers.ui.showDeath(entity.position);
  }
}

// Export the CombatManager class
export default CombatManager; 