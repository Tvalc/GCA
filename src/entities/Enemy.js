// Enemy class that represents combat enemies
class Enemy {
  constructor(data) {
    this.id = `enemy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.name = data.name;
    this.level = data.level || 1;
    this.type = data.type || 'normal';
    
    // Base stats
    this.stats = {
      strength: data.stats?.strength || 10,
      dexterity: data.stats?.dexterity || 10,
      vitality: data.stats?.vitality || 10,
      intelligence: data.stats?.intelligence || 10,
      luck: data.stats?.luck || 10,
      charisma: data.stats?.charisma || 10,
      fortune: data.stats?.fortune || 10,
      speed: data.stats?.speed || 10
    };
    
    // Combat stats
    this.hp = data.hp || 100;
    this.maxHp = data.maxHp || 100;
    this.mp = data.mp || 30;
    this.maxMp = data.maxMp || 30;
    
    // Rewards
    this.xpValue = data.xpValue || 50;
    this.goldValue = data.goldValue || 25;
    
    // Combat state
    this.statusEffects = new Map();
    this.buffs = new Map();
    this.cooldowns = new Map();
    
    // AI behavior
    this.behavior = data.behavior || 'aggressive';
    this.skills = data.skills || [];
    this.weaknesses = data.weaknesses || [];
    this.resistances = data.resistances || [];

    // --- NEW: Position and sprite sheet info ---
    // Default to a visible position if not provided
    this.position = data.position || { x: 200 + Math.floor(Math.random() * 200), y: 200 + Math.floor(Math.random() * 100) };
    // Default sprite sheet coordinates (top-left tile)
    this.spriteX = data.spriteX || 0;
    this.spriteY = data.spriteY || 0;
  }

  // Get available actions based on current state
  getAvailableActions() {
    const actions = ['attack'];
    
    // Add skills if MP is available
    this.skills.forEach(skill => {
      if (this.mp >= skill.mpCost && !this.isOnCooldown(skill)) {
        actions.push(skill);
      }
    });
    
    return actions;
  }

  // Check if skill is on cooldown
  isOnCooldown(skill) {
    const lastUse = this.cooldowns.get(skill.id) || 0;
    return Date.now() - lastUse < (skill.cooldown || 0);
  }

  // Choose next action based on AI behavior
  chooseAction() {
    const actions = this.getAvailableActions();
    
    switch (this.behavior) {
      case 'aggressive':
        // Prioritize damaging skills
        const damageSkills = actions.filter(a => a.damage);
        if (damageSkills.length > 0) {
          return damageSkills[Math.floor(Math.random() * damageSkills.length)];
        }
        return 'attack';
        
      case 'defensive':
        // Prioritize healing/buffing skills
        const supportSkills = actions.filter(a => a.healing || a.buff);
        if (supportSkills.length > 0) {
          return supportSkills[Math.floor(Math.random() * supportSkills.length)];
        }
        return 'attack';
        
      case 'balanced':
        // Randomly choose from available actions
        return actions[Math.floor(Math.random() * actions.length)];
        
      default:
        return 'attack';
    }
  }

  // Apply status effect
  applyStatusEffect(effect, duration, stacks = 1) {
    if (this.resistances.includes(effect)) {
      return false;
    }
    
    const currentEffect = this.statusEffects.get(effect);
    if (currentEffect) {
      currentEffect.duration = Math.max(currentEffect.duration, duration);
      currentEffect.stacks = Math.min(currentEffect.stacks + stacks, 5);
    } else {
      this.statusEffects.set(effect, { duration, stacks });
    }
    
    return true;
  }

  // Apply buff/debuff
  applyBuff(buff, duration, value) {
    const currentBuff = this.buffs.get(buff);
    if (currentBuff) {
      currentBuff.duration = Math.max(currentBuff.duration, duration);
      currentBuff.value = value;
    } else {
      this.buffs.set(buff, { duration, value });
    }
  }

  // Get stat value including buffs/debuffs
  getStatValue(stat) {
    let value = this.stats[stat];
    
    // Apply buffs/debuffs
    for (const [buff, data] of this.buffs) {
      if (buff.stats?.includes(stat)) {
        value *= data.value;
      }
    }
    
    return Math.floor(value);
  }

  // Get current HP percentage
  getHpPercentage() {
    return (this.hp / this.maxHp) * 100;
  }

  // Get current MP percentage
  getMpPercentage() {
    return (this.mp / this.maxMp) * 100;
  }

  // Check if enemy is defeated
  isDefeated() {
    return this.hp <= 0;
  }
}

export default Enemy; 