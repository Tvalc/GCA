// SkillManager handles player skills and abilities
class SkillManager {
  constructor(game) {
    this.game = game;
    this.skills = new Map();
    this.activeSkills = new Map();
    this.skillPoints = 0;
    this.maxSkillLevel = 10;
  }

  init() {
    // Initialize skill data
    this.initSkillData();
  }

  initSkillData() {
    // Define skill categories
    this.skillCategories = {
      combat: {
        name: 'Combat',
        color: '#ff0000'
      },
      magic: {
        name: 'Magic',
        color: '#0000ff'
      },
      support: {
        name: 'Support',
        color: '#00ff00'
      },
      passive: {
        name: 'Passive',
        color: '#ffff00'
      }
    };

    // Define skill templates
    this.skillTemplates = {
      // Combat Skills
      'slash': {
        id: 'slash',
        name: 'Slash',
        category: 'combat',
        level: 1,
        maxLevel: 5,
        manaCost: 10,
        cooldown: 2000,
        range: 2,
        damage: 20,
        damageType: 'physical',
        description: 'A powerful slash attack.',
        requirements: {
          level: 1,
          skills: []
        },
        effects: {
          damage: {
            base: 20,
            scaling: 5
          }
        }
      },
      'fireball': {
        id: 'fireball',
        name: 'Fireball',
        category: 'magic',
        level: 1,
        maxLevel: 5,
        manaCost: 15,
        cooldown: 3000,
        range: 5,
        damage: 30,
        damageType: 'fire',
        description: 'Launches a ball of fire at the target.',
        requirements: {
          level: 3,
          skills: []
        },
        effects: {
          damage: {
            base: 30,
            scaling: 8
          },
          status: {
            type: 'burn',
            chance: 0.3,
            duration: 3000
          }
        }
      },
      'heal': {
        id: 'heal',
        name: 'Heal',
        category: 'support',
        level: 1,
        maxLevel: 5,
        manaCost: 20,
        cooldown: 5000,
        range: 3,
        healing: 50,
        description: 'Heals the target for a moderate amount.',
        requirements: {
          level: 2,
          skills: []
        },
        effects: {
          healing: {
            base: 50,
            scaling: 10
          }
        }
      },
      'strength': {
        id: 'strength',
        name: 'Strength',
        category: 'passive',
        level: 1,
        maxLevel: 5,
        description: 'Increases physical damage.',
        requirements: {
          level: 1,
          skills: []
        },
        effects: {
          damage: {
            multiplier: 0.1,
            scaling: 0.05
          }
        }
      }
    };
  }

  // Skill Management
  learnSkill(skillId) {
    const skillTemplate = this.skillTemplates[skillId];
    if (!skillTemplate) {
      console.error(`Skill template not found: ${skillId}`);
      return false;
    }

    // Check requirements
    if (!this.checkSkillRequirements(skillTemplate)) {
      this.game.managers.ui.showNotification('Skill requirements not met', '#ff0000');
      return false;
    }

    // Check skill points
    if (this.skillPoints <= 0) {
      this.game.managers.ui.showNotification('Not enough skill points', '#ff0000');
      return false;
    }

    // Create skill instance
    const skill = {
      ...skillTemplate,
      level: 1,
      cooldowns: new Map()
    };

    this.skills.set(skillId, skill);
    this.skillPoints--;

    this.game.managers.ui.showNotification(`Learned ${skill.name}`, '#00ff00');
    return true;
  }

  upgradeSkill(skillId) {
    const skill = this.skills.get(skillId);
    if (!skill) {
      console.error(`Skill not found: ${skillId}`);
      return false;
    }

    // Check max level
    if (skill.level >= skill.maxLevel) {
      this.game.managers.ui.showNotification('Skill is at maximum level', '#ff0000');
      return false;
    }

    // Check skill points
    if (this.skillPoints <= 0) {
      this.game.managers.ui.showNotification('Not enough skill points', '#ff0000');
      return false;
    }

    // Upgrade skill
    skill.level++;
    this.skillPoints--;

    // Update skill effects
    this.updateSkillEffects(skill);

    this.game.managers.ui.showNotification(`Upgraded ${skill.name} to level ${skill.level}`, '#00ff00');
    return true;
  }

  // Skill Usage
  useSkill(skillId, target) {
    const skill = this.skills.get(skillId);
    if (!skill) {
      console.error(`Skill not found: ${skillId}`);
      return false;
    }

    // Check cooldown
    if (this.isOnCooldown(skill)) {
      this.game.managers.ui.showNotification('Skill is on cooldown', '#ff0000');
      return false;
    }

    // Check mana
    if (this.game.managers.entity.player.mana < skill.manaCost) {
      this.game.managers.ui.showNotification('Not enough mana', '#ff0000');
      return false;
    }

    // Use skill
    this.game.managers.combat.useSkill(
      this.game.managers.entity.player,
      target,
      skill
    );

    // Apply cooldown
    this.applyCooldown(skill);

    // Consume mana
    this.game.managers.entity.player.mana -= skill.manaCost;

    return true;
  }

  // Skill Effects
  updateSkillEffects(skill) {
    const effects = skill.effects;
    if (!effects) return;

    // Update damage effects
    if (effects.damage) {
      effects.damage.current = effects.damage.base + 
        (effects.damage.scaling * (skill.level - 1));
    }

    // Update healing effects
    if (effects.healing) {
      effects.healing.current = effects.healing.base + 
        (effects.healing.scaling * (skill.level - 1));
    }

    // Update status effects
    if (effects.status) {
      effects.status.duration = effects.status.baseDuration + 
        (effects.status.durationScaling * (skill.level - 1));
    }
  }

  // Cooldown Management
  isOnCooldown(skill) {
    const lastUse = skill.cooldowns.get('lastUse') || 0;
    return Date.now() - lastUse < skill.cooldown;
  }

  applyCooldown(skill) {
    skill.cooldowns.set('lastUse', Date.now());
  }

  getCooldownRemaining(skill) {
    const lastUse = skill.cooldowns.get('lastUse') || 0;
    const remaining = skill.cooldown - (Date.now() - lastUse);
    return Math.max(0, remaining);
  }

  // Skill Requirements
  checkSkillRequirements(skill) {
    const player = this.game.managers.entity.player;

    // Check level requirement
    if (player.level < skill.requirements.level) {
      return false;
    }

    // Check skill prerequisites
    for (const requiredSkill of skill.requirements.skills) {
      if (!this.skills.has(requiredSkill)) {
        return false;
      }
    }

    return true;
  }

  // Skill Queries
  getSkillById(skillId) {
    return this.skills.get(skillId);
  }

  getAvailableSkills() {
    const availableSkills = [];
    for (const skill of Object.values(this.skillTemplates)) {
      if (!this.skills.has(skill.id) && this.checkSkillRequirements(skill)) {
        availableSkills.push(skill);
      }
    }
    return availableSkills;
  }

  getUpgradeableSkills() {
    const upgradeableSkills = [];
    for (const skill of this.skills.values()) {
      if (skill.level < skill.maxLevel) {
        upgradeableSkills.push(skill);
      }
    }
    return upgradeableSkills;
  }

  // Skill Points
  addSkillPoints(points) {
    this.skillPoints += points;
    this.game.managers.ui.showNotification(`Gained ${points} skill points`, '#00ff00');
  }

  getSkillPoints() {
    return this.skillPoints;
  }

  // Skill State Management
  saveSkillState() {
    return {
      skills: Array.from(this.skills.entries()),
      skillPoints: this.skillPoints
    };
  }

  loadSkillState(state) {
    this.skills = new Map(state.skills);
    this.skillPoints = state.skillPoints;

    // Update skill effects
    for (const skill of this.skills.values()) {
      this.updateSkillEffects(skill);
    }
  }

  // Skill Events
  onSkillLearned(skill) {
    this.game.managers.ui.showSkillLearned(skill);
  }

  onSkillUpgraded(skill) {
    this.game.managers.ui.showSkillUpgraded(skill);
  }

  onSkillUsed(skill, target) {
    this.game.managers.ui.showSkillUsed(skill, target);
  }

  onCooldownStarted(skill) {
    this.game.managers.ui.showCooldownStarted(skill);
  }

  onCooldownEnded(skill) {
    this.game.managers.ui.showCooldownEnded(skill);
  }
}

// Export the SkillManager class
export default SkillManager; 