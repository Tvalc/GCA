// PlayerManager handles player-specific functionality
class PlayerManager {
  constructor(game) {
    this.game = game;
    this.player = null;
    this.stats = {
      level: 1,
      xp: 0,
      gold: 0,
      reputation: 0,
      kills: 0,
      deaths: 0,
      playTime: 0
    };
    this.attributes = {
      strength: 10,
      dexterity: 10,
      intelligence: 10,
      vitality: 10
    };
    this.skills = new Map();
    this.achievements = new Set();
    this.startTime = Date.now();
  }

  init() {
    // Initialize player data
    this.initPlayerData();
  }

  initPlayerData() {
    // Define player classes
    this.playerClasses = {
      warrior: {
        name: 'Warrior',
        description: 'A mighty warrior skilled in combat.',
        baseStats: {
          health: 100,
          mana: 50,
          damage: 15,
          defense: 10,
          speed: 1.0
        },
        attributes: {
          strength: 15,
          dexterity: 10,
          intelligence: 5,
          vitality: 12
        },
        skills: ['slash', 'strength']
      },
      mage: {
        name: 'Mage',
        description: 'A powerful spellcaster.',
        baseStats: {
          health: 70,
          mana: 100,
          damage: 10,
          defense: 5,
          speed: 1.0
        },
        attributes: {
          strength: 5,
          dexterity: 8,
          intelligence: 15,
          vitality: 8
        },
        skills: ['fireball', 'heal']
      },
      rogue: {
        name: 'Rogue',
        description: 'A swift and agile fighter.',
        baseStats: {
          health: 80,
          mana: 60,
          damage: 12,
          defense: 7,
          speed: 1.2
        },
        attributes: {
          strength: 8,
          dexterity: 15,
          intelligence: 8,
          vitality: 10
        },
        skills: ['backstab', 'stealth']
      }
    };

    // Define level progression
    this.levelProgression = {
      xpPerLevel: 100,
      xpScaling: 1.5,
      attributePointsPerLevel: 2,
      skillPointsPerLevel: 1
    };

    // Define achievements
    this.achievementTemplates = {
      'first_kill': {
        id: 'first_kill',
        name: 'First Blood',
        description: 'Defeat your first enemy.',
        reward: {
          xp: 100,
          gold: 50
        }
      },
      'level_10': {
        id: 'level_10',
        name: 'Novice',
        description: 'Reach level 10.',
        reward: {
          xp: 500,
          gold: 200
        }
      },
      'quest_master': {
        id: 'quest_master',
        name: 'Quest Master',
        description: 'Complete 10 quests.',
        reward: {
          xp: 1000,
          gold: 500
        }
      }
    };
  }

  // Player Creation
  createPlayer(classId, name) {
    const playerClass = this.playerClasses[classId];
    if (!playerClass) {
      console.error(`Player class not found: ${classId}`);
      return null;
    }

    this.player = {
      id: `player_${Date.now()}`,
      name: name,
      class: classId,
      level: 1,
      xp: 0,
      gold: 0,
      health: playerClass.baseStats.health,
      maxHealth: playerClass.baseStats.health,
      mana: playerClass.baseStats.mana,
      maxMana: playerClass.baseStats.mana,
      damage: playerClass.baseStats.damage,
      defense: playerClass.baseStats.defense,
      speed: playerClass.baseStats.speed,
      position: { x: 0, y: 0 },
      direction: 'down',
      attributes: { ...playerClass.attributes },
      skills: new Set(playerClass.skills),
      inventory: new Map(),
      equipment: {
        weapon: null,
        armor: null,
        helmet: null,
        boots: null,
        accessory: null
      },
      statusEffects: new Map(),
      cooldowns: new Map()
    };

    // Initialize skills
    for (const skillId of playerClass.skills) {
      this.game.managers.skill.learnSkill(skillId);
    }

    return this.player;
  }

  // Player Stats
  updateStats() {
    if (!this.player) return;

    // Update play time
    this.stats.playTime = Math.floor((Date.now() - this.startTime) / 1000);

    // Update player stats based on attributes
    this.player.maxHealth = this.calculateMaxHealth();
    this.player.maxMana = this.calculateMaxMana();
    this.player.damage = this.calculateDamage();
    this.player.defense = this.calculateDefense();
    this.player.speed = this.calculateSpeed();

    // Ensure current health/mana doesn't exceed max
    this.player.health = Math.min(this.player.health, this.player.maxHealth);
    this.player.mana = Math.min(this.player.mana, this.player.maxMana);
  }

  calculateMaxHealth() {
    return 100 + (this.player.attributes.vitality * 10);
  }

  calculateMaxMana() {
    return 50 + (this.player.attributes.intelligence * 5);
  }

  calculateDamage() {
    return 10 + (this.player.attributes.strength * 2);
  }

  calculateDefense() {
    return 5 + (this.player.attributes.vitality * 1.5);
  }

  calculateSpeed() {
    return 1.0 + (this.player.attributes.dexterity * 0.02);
  }

  // Leveling System
  addXP(amount) {
    if (!this.player) return;

    this.player.xp += amount;
    this.stats.xp += amount;

    // Check for level up
    while (this.player.xp >= this.getRequiredXP()) {
      this.levelUp();
    }
  }

  getRequiredXP() {
    return Math.floor(
      this.levelProgression.xpPerLevel * 
      Math.pow(this.levelProgression.xpScaling, this.player.level - 1)
    );
  }

  levelUp() {
    if (!this.player) return;

    this.player.level++;
    this.stats.level = this.player.level;

    // Award attribute points
    this.addAttributePoints(this.levelProgression.attributePointsPerLevel);

    // Award skill points
    this.game.managers.skill.addSkillPoints(this.levelProgression.skillPointsPerLevel);

    // Restore health and mana
    this.player.health = this.player.maxHealth;
    this.player.mana = this.player.maxMana;

    // Check achievements
    this.checkLevelAchievements();

    this.game.managers.ui.showLevelUp(this.player.level);
  }

  // Attribute System
  addAttributePoints(points) {
    if (!this.player) return;

    this.player.attributePoints = (this.player.attributePoints || 0) + points;
  }

  increaseAttribute(attribute) {
    if (!this.player || !this.player.attributePoints) return false;

    if (this.player.attributes[attribute] !== undefined) {
      this.player.attributes[attribute]++;
      this.player.attributePoints--;
      this.updateStats();
      return true;
    }

    return false;
  }

  // Achievement System
  checkAchievements() {
    if (!this.player) return;

    // Check first kill
    if (this.stats.kills === 1 && !this.achievements.has('first_kill')) {
      this.unlockAchievement('first_kill');
    }

    // Check level achievements
    this.checkLevelAchievements();

    // Check quest achievements
    this.checkQuestAchievements();
  }

  checkLevelAchievements() {
    if (!this.player) return;

    if (this.player.level >= 10 && !this.achievements.has('level_10')) {
      this.unlockAchievement('level_10');
    }
  }

  checkQuestAchievements() {
    if (!this.player) return;

    const completedQuests = this.game.managers.quest.getCompletedQuests();
    if (completedQuests.length >= 10 && !this.achievements.has('quest_master')) {
      this.unlockAchievement('quest_master');
    }
  }

  unlockAchievement(achievementId) {
    const achievement = this.achievementTemplates[achievementId];
    if (!achievement) return;

    this.achievements.add(achievementId);

    // Award rewards
    if (achievement.reward) {
      if (achievement.reward.xp) {
        this.addXP(achievement.reward.xp);
      }
      if (achievement.reward.gold) {
        this.addGold(achievement.reward.gold);
      }
    }

    this.game.managers.ui.showAchievementUnlocked(achievement);
  }

  // Currency System
  addGold(amount) {
    if (!this.player) return;

    this.player.gold += amount;
    this.stats.gold += amount;
  }

  removeGold(amount) {
    if (!this.player || this.player.gold < amount) return false;

    this.player.gold -= amount;
    this.stats.gold -= amount;
    return true;
  }

  // Player State Management
  savePlayerState() {
    if (!this.player) return null;

    return {
      player: this.player,
      stats: this.stats,
      attributes: this.attributes,
      skills: Array.from(this.skills),
      achievements: Array.from(this.achievements)
    };
  }

  loadPlayerState(state) {
    this.player = state.player;
    this.stats = state.stats;
    this.attributes = state.attributes;
    this.skills = new Set(state.skills);
    this.achievements = new Set(state.achievements);

    // Update player stats
    this.updateStats();
  }

  // Player Events
  onPlayerCreated(player) {
    this.game.managers.ui.showPlayerCreated(player);
  }

  onLevelUp(level) {
    this.game.managers.ui.showLevelUp(level);
  }

  onAttributeIncreased(attribute, value) {
    this.game.managers.ui.showAttributeIncreased(attribute, value);
  }

  onAchievementUnlocked(achievement) {
    this.game.managers.ui.showAchievementUnlocked(achievement);
  }

  onGoldChanged(amount) {
    this.game.managers.ui.showGoldChanged(amount);
  }
}

// Export the PlayerManager class
export default PlayerManager; 