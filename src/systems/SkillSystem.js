// Skill System that manages player and enemy abilities
class SkillSystem {
  constructor(game) {
    this.game = game;
    this.skills = new Map();
    this.initSkills();
  }

  // Initialize skill definitions
  initSkills() {
    // Basic attack skills
    this.skills.set('slash', {
      id: 'slash',
      name: 'Slash',
      type: 'physical',
      mpCost: 5,
      cooldown: 2000,
      damage: 20,
      damageType: 'physical',
      description: 'A basic slash attack',
      requirements: {
        level: 1
      }
    });

    this.skills.set('fireball', {
      id: 'fireball',
      name: 'Fireball',
      type: 'magical',
      mpCost: 15,
      cooldown: 3000,
      damage: 30,
      damageType: 'fire',
      description: 'Launches a ball of fire',
      requirements: {
        level: 3,
        intelligence: 12
      }
    });

    this.skills.set('heal', {
      id: 'heal',
      name: 'Heal',
      type: 'support',
      mpCost: 20,
      cooldown: 4000,
      healing: 40,
      description: 'Restores HP to target',
      requirements: {
        level: 2,
        intelligence: 10
      }
    });

    this.skills.set('poison_strike', {
      id: 'poison_strike',
      name: 'Poison Strike',
      type: 'physical',
      mpCost: 12,
      cooldown: 5000,
      damage: 15,
      damageType: 'physical',
      effect: 'poison',
      effectDuration: 3,
      description: 'A strike that may poison the target',
      requirements: {
        level: 4,
        dexterity: 15
      }
    });

    this.skills.set('thunder_strike', {
      id: 'thunder_strike',
      name: 'Thunder Strike',
      type: 'magical',
      mpCost: 25,
      cooldown: 6000,
      damage: 45,
      damageType: 'lightning',
      description: 'A powerful lightning attack',
      requirements: {
        level: 5,
        intelligence: 18
      }
    });

    this.skills.set('defend', {
      id: 'defend',
      name: 'Defend',
      type: 'support',
      mpCost: 0,
      cooldown: 0,
      effect: 'defense_up',
      effectDuration: 1,
      description: 'Increases defense for one turn',
      requirements: {
        level: 1
      }
    });
  }

  // Get skill by ID
  getSkill(skillId) {
    return this.skills.get(skillId);
  }

  // Check if entity can use skill
  canUseSkill(entity, skillId) {
    const skill = this.getSkill(skillId);
    if (!skill) return false;

    // Check level requirement
    if (entity.level < skill.requirements.level) return false;

    // Check stat requirements
    for (const [stat, value] of Object.entries(skill.requirements)) {
      if (stat !== 'level' && entity.stats[stat] < value) return false;
    }

    // Check MP cost
    if (entity.mp < skill.mpCost) return false;

    // Check cooldown
    if (this.isOnCooldown(entity, skillId)) return false;

    return true;
  }

  // Check if skill is on cooldown
  isOnCooldown(entity, skillId) {
    const lastUse = entity.cooldowns.get(skillId) || 0;
    const skill = this.getSkill(skillId);
    return Date.now() - lastUse < skill.cooldown;
  }

  // Use skill
  useSkill(attacker, target, skillId) {
    const skill = this.getSkill(skillId);
    if (!skill) return false;

    // Check if skill can be used
    if (!this.canUseSkill(attacker, skillId)) return false;

    // Consume MP
    attacker.mp -= skill.mpCost;

    // Apply cooldown
    attacker.cooldowns.set(skillId, Date.now());

    // Calculate and apply effects
    if (skill.damage) {
      const damage = this.calculateDamage(attacker, target, skill);
      this.game.systems.combat.applyDamage(target, damage, skill.damageType);
    }

    if (skill.healing) {
      const healing = this.calculateHealing(attacker, skill);
      this.game.systems.combat.applyHealing(target, healing);
    }

    if (skill.effect) {
      this.applyEffect(target, skill.effect, skill.effectDuration);
    }

    return true;
  }

  // Calculate skill damage
  calculateDamage(attacker, target, skill) {
    let baseDamage = skill.damage;

    // Apply stat modifiers
    if (skill.type === 'physical') {
      baseDamage += Math.floor(attacker.stats.strength / 5);
    } else if (skill.type === 'magical') {
      baseDamage += Math.floor(attacker.stats.intelligence / 5);
    }

    // Apply critical hit
    const critChance = (attacker.stats.fortune / 10);
    const isCrit = Math.random() * 100 <= critChance;

    if (isCrit) {
      const critMultiplier = 1.5 + (attacker.stats.fortune / 100);
      baseDamage *= critMultiplier;
    }

    // Apply defense reduction
    const defense = target.stats.vitality;
    const finalDamage = Math.floor(baseDamage * (100 / (100 + defense)));

    return {
      damage: finalDamage,
      isCrit
    };
  }

  // Calculate healing amount
  calculateHealing(healer, skill) {
    let baseHealing = skill.healing;

    // Apply intelligence modifier
    baseHealing += Math.floor(healer.stats.intelligence / 5);

    return Math.floor(baseHealing);
  }

  // Apply status effect
  applyEffect(target, effect, duration) {
    target.applyStatusEffect(effect, duration);
  }

  // Get available skills for entity
  getAvailableSkills(entity) {
    const available = [];

    for (const [skillId, skill] of this.skills) {
      if (this.canUseSkill(entity, skillId)) {
        available.push(skill);
      }
    }

    return available;
  }

  // Get learnable skills for entity
  getLearnableSkills(entity) {
    const learnable = [];

    for (const [skillId, skill] of this.skills) {
      // Check if already learned
      if (entity.skills.has(skillId)) continue;

      // Check requirements
      if (entity.level >= skill.requirements.level) {
        let canLearn = true;
        for (const [stat, value] of Object.entries(skill.requirements)) {
          if (stat !== 'level' && entity.stats[stat] < value) {
            canLearn = false;
            break;
          }
        }
        if (canLearn) {
          learnable.push(skill);
        }
      }
    }

    return learnable;
  }
}

export default SkillSystem; 