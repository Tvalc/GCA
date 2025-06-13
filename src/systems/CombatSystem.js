// Combat System that handles turn-based battles using dice mechanics
class CombatSystem {
  constructor(game) {
    this.game = game;
    this.state = {
      isActive: false,
      currentTurn: null,
      turnOrder: [],
      combatants: [],
      currentAction: null,
      combatLog: []
    };
    
    // Combat constants
    this.COMBAT_STATES = {
      INIT: 'init',
      PLAYER_TURN: 'player_turn',
      ENEMY_TURN: 'enemy_turn',
      VICTORY: 'victory',
      DEFEAT: 'defeat'
    };
  }

  // Initialize combat with player and enemies
  startCombat(player, enemies) {
    this.state.isActive = true;
    this.state.combatants = [player, ...enemies];
    this.state.combatLog = [];
    
    // Determine turn order based on speed
    this.determineTurnOrder();
    
    // Start first turn
    this.startTurn();
  }

  // Determine turn order based on speed stat
  determineTurnOrder() {
    this.state.turnOrder = [...this.state.combatants].sort((a, b) => {
      return b.stats.speed - a.stats.speed;
    });
  }

  // Start a new turn
  startTurn() {
    if (!this.state.turnOrder.length) {
      this.determineTurnOrder();
    }
    
    this.state.currentTurn = this.state.turnOrder.shift();
    this.state.turnOrder.push(this.state.currentTurn);
    
    // Handle turn start effects
    this.handleTurnStart();
  }

  // Handle turn start effects (status effects, buffs, etc)
  handleTurnStart() {
    const combatant = this.state.currentTurn;
    
    // Process status effects
    if (combatant.statusEffects) {
      for (const [effect, data] of combatant.statusEffects) {
        this.processStatusEffect(combatant, effect, data);
      }
    }
    
    // Process buffs/debuffs
    if (combatant.buffs) {
      for (const [buff, data] of combatant.buffs) {
        this.processBuff(combatant, buff, data);
      }
    }
  }

  // Process a status effect
  processStatusEffect(combatant, effect, data) {
    switch (effect) {
      case 'burn':
        const burnDamage = Math.floor(combatant.maxHp * 0.05);
        this.applyDamage(combatant, burnDamage, 'fire');
        data.duration--;
        break;
      case 'poison':
        const poisonDamage = Math.floor(combatant.maxHp * (0.03 * data.stacks));
        this.applyDamage(combatant, poisonDamage, 'poison');
        data.duration--;
        break;
      // Add other status effects here
    }
    
    // Remove expired effects
    if (data.duration <= 0) {
      combatant.statusEffects.delete(effect);
    }
  }

  // Process a buff/debuff
  processBuff(combatant, buff, data) {
    data.duration--;
    
    // Remove expired buffs
    if (data.duration <= 0) {
      combatant.buffs.delete(buff);
    }
  }

  // Calculate hit chance based on attacker and defender stats
  calculateHitChance(attacker, defender) {
    const baseChance = 70;
    const attackerDexMod = attacker.stats.dexterity * 2;
    const defenderDexMod = defender.stats.dexterity * 1.5;
    return Math.min(95, Math.max(5, baseChance + attackerDexMod - defenderDexMod));
  }

  // Calculate damage based on attacker stats and weapon
  calculateDamage(attacker, defender, damageType = 'physical') {
    let baseDamage = 0;
    
    // Calculate base damage based on damage type
    if (damageType === 'physical') {
      baseDamage = this.rollDice(6, 2) + Math.floor(attacker.stats.strength / 5);
    } else if (damageType === 'magical') {
      baseDamage = this.rollDice(8, 1) + Math.floor(attacker.stats.intelligence / 5);
    }
    
    // Apply critical hit
    const critChance = (attacker.stats.fortune / 10) + (attacker.weapon?.critBonus || 0);
    const isCrit = this.rollDice(100) <= critChance;
    
    if (isCrit) {
      const critMultiplier = 1.5 + (attacker.stats.fortune / 100);
      baseDamage *= critMultiplier;
    }
    
    // Apply defense reduction
    const defense = defender.stats.defense;
    const finalDamage = Math.floor(baseDamage * (100 / (100 + defense)));
    
    return {
      damage: finalDamage,
      isCrit,
      damageType
    };
  }

  // Roll dice for combat calculations
  rollDice(sides, count = 1, modifier = 0) {
    let total = 0;
    for (let i = 0; i < count; i++) {
      total += Math.floor(Math.random() * sides) + 1;
    }
    return total + modifier;
  }

  // Apply damage to a combatant
  applyDamage(combatant, amount, damageType) {
    combatant.hp = Math.max(0, combatant.hp - amount);
    
    // Add to combat log
    this.addCombatLog({
      type: 'damage',
      target: combatant.id,
      amount,
      damageType,
      timestamp: Date.now()
    });
    
    // Check for defeat
    if (combatant.hp <= 0) {
      this.handleDefeat(combatant);
    }
  }

  // Handle combatant defeat
  handleDefeat(combatant) {
    // Remove from turn order
    this.state.turnOrder = this.state.turnOrder.filter(c => c.id !== combatant.id);
    
    // Check for combat end
    if (combatant === this.game.state.player) {
      this.endCombat(this.COMBAT_STATES.DEFEAT);
    } else if (this.state.turnOrder.length === 1 && this.state.turnOrder[0] === this.game.state.player) {
      this.endCombat(this.COMBAT_STATES.VICTORY);
    }
  }

  // End combat and process results
  endCombat(result) {
    this.state.isActive = false;
    
    if (result === this.COMBAT_STATES.VICTORY) {
      // Process victory rewards
      this.processVictoryRewards();
    }
    
    // Reset combat state
    this.state = {
      isActive: false,
      currentTurn: null,
      turnOrder: [],
      combatants: [],
      currentAction: null,
      combatLog: []
    };
  }

  // Process victory rewards
  processVictoryRewards() {
    const player = this.game.state.player;
    
    // Calculate XP and gold rewards
    const xpReward = this.calculateXPReward();
    const goldReward = this.calculateGoldReward();
    
    // Apply rewards
    player.xp += xpReward;
    player.gold += goldReward;
    
    // Check for level up
    this.checkLevelUp(player);
  }

  // Calculate XP reward based on defeated enemies
  calculateXPReward() {
    return this.state.combatants
      .filter(c => c !== this.game.state.player)
      .reduce((total, enemy) => total + enemy.xpValue, 0);
  }

  // Calculate gold reward based on defeated enemies
  calculateGoldReward() {
    return this.state.combatants
      .filter(c => c !== this.game.state.player)
      .reduce((total, enemy) => total + enemy.goldValue, 0);
  }

  // Check for level up
  checkLevelUp(player) {
    const xpNeeded = player.level * 100; // Simple XP formula
    if (player.xp >= xpNeeded) {
      player.level++;
      player.xp -= xpNeeded;
      
      // Level up rewards
      this.processLevelUp(player);
    }
  }

  // Process level up rewards
  processLevelUp(player) {
    // Increase stats
    player.stats.strength += 2;
    player.stats.dexterity += 2;
    player.stats.vitality += 2;
    player.stats.intelligence += 2;
    player.stats.luck += 1;
    player.stats.charisma += 1;
    player.stats.fortune += 1;
    
    // Increase HP/MP
    player.maxHp += 10;
    player.maxMp += 5;
    player.hp = player.maxHp;
    player.mp = player.maxMp;
    
    // Check for new skills
    this.checkNewSkills(player);
  }

  // Check for new skills based on level
  checkNewSkills(player) {
    const newSkills = player.getAvailableSkills();
    for (const skill of newSkills) {
      if (!player.skills.has(skill)) {
        player.skills.add(skill);
        // Notify UI of new skill
        this.game.managers.ui.showNotification(`Learned new skill: ${skill}`, '#00ff00');
      }
    }
  }

  // Add entry to combat log
  addCombatLog(entry) {
    this.state.combatLog.push(entry);
    // Notify UI of new log entry
    this.game.managers.ui.updateCombatLog(entry);
  }
}

export default CombatSystem; 