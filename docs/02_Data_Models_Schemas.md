# Glitter Cloud Adventure: Data Models & Schemas

## Introduction

This document defines the data structures for all major objects in Glitter Cloud Adventure. These schemas provide a reference for implementation and ensure consistency across the codebase. All data models are designed to support the single-file architecture while maintaining clean separation between game systems.

## Tower Defense System

### Tower Model
```javascript
{
  id: "tower_basic_1",
  name: "Basic Tower",
  type: "basic",
  level: 1,
  maxLevel: 5,
  cost: 100,
  upgradeCost: 150,
  damage: 10,
  range: 3,
  attackSpeed: 1.0,  // attacks per second
  specialEffects: [],
  sprite: "tower_basic.png",
  description: "A basic tower with balanced stats.",
  // Conscript-specific fields (for conscript towers)
  isConscriptTower: false,
  conscriptSlots: 0,
  assignedConscripts: []
}
```

### Wave Model
```javascript
{
  waveNumber: 1,
  enemies: [
    { type: "byte_bug", count: 10, delay: 1.5 },
    { type: "glitch_slime", count: 5, delay: 2.0 }
  ],
  spawnInterval: 2.0,  // seconds between spawns
  isBossWave: false,
  reward: {
    gold: 100,
    items: [],
    experience: 50
  },
  completed: false
}
```

### Tower Defense Game State
```javascript
{
  currentWave: 1,
  lives: 20,
  gold: 500,
  energy: 100,
  maxEnergy: 100,
  towers: [],
  path: [[0,0], [0,1], [1,1], [1,2]],  // Grid coordinates
  grid: [10, 10],  // Grid size [width, height]
  activeEnemies: [],
  waveInProgress: false,
  timeUntilNextWave: 30,  // seconds
  specialAbilities: {
    freeze: 3,
    nuke: 1,
    repair: 5
  }
}
```

## Mini-Game System

### Mini-Game State
```javascript
{
  gameType: "memory_match",  // or "endless_faller", "rhythm", etc.
  score: 0,
  highScore: 0,
  level: 1,
  timeRemaining: 60,  // seconds
  isActive: false,
  difficulty: 1,  // 1-5
  // Game-specific state
  board: [],  // For memory match
  playerPosition: {x: 0, y: 0},  // For endless faller
  combo: 0,
  // Rewards
  potentialRewards: {
    gold: {min: 10, max: 50},
    items: [
      {id: "small_health_potion", chance: 0.3},
      {id: "conscript_orb", chance: 0.1}
    ]
  }
}
```

### Mini-Game Progress
```javascript
{
  gamesPlayed: {
    memory_match: 5,
    endless_faller: 3,
    rhythm: 2,
    tactical_puzzle: 1
  },
  dailyChallenges: {
    current: [
      {id: "match_10_cards", progress: 3, target: 10, reward: "gold_100"},
      {id: "reach_wave_5", progress: 2, target: 5, reward: "conscript_orb_1"}
    ],
    completed: [],
    nextRefresh: "2025-05-27T00:00:00Z"
  },
  stats: {
    totalScore: 1250,
    highestCombo: 8,
    perfectGames: 2
  }
}
```

## Conscription System

### Conscript
```javascript
{
  id: "conscript_123",
  enemyId: "byte_bug",  // Reference to the base enemy type
  name: "Byte Bug",   // Can be renamed by player
  level: 5,
  experience: 0,
  experienceToNextLevel: 100,
  
  // Base stats (copied from enemy at time of conscription)
  baseStats: {
    strength: 3,
    intelligence: 2,
    vitality: 4,
    dexterity: 5,
    fortune: 2,
    charisma: 1
  },
  
  // Current stats (can be improved through training)
  currentStats: {
    hp: 40,
    mp: 20,
    // ... other current stats
  },
  
  // Growth rates for level ups
  growthRates: {
    hp: 0.7,       // 70% chance of +1 HP on level up
    mp: 0.5,       // 50% chance of +1 MP on level up
    strength: 0.6,  // etc.
    intelligence: 0.3,
    vitality: 0.5,
    dexterity: 0.8,
    fortune: 0.4,
    charisma: 0.2
  },
  
  // Current location/assignment
  assignment: "roster",  // "roster", "tower_defense", "dungeon_party"
  
  // Skills/abilities (inherited from enemy type + any learned)
  skills: ["byte_bite", "glitch_dodge"],
  
  // Equipment (if applicable)
  equipment: {},
  
  // Status effects
  statusEffects: [],
  
  // Friendship/loyalty level (affects performance)
  loyalty: 50,  // 0-100
  
  // Date captured and by whom
  capturedAt: "2025-05-26T17:30:00Z",
  capturedBy: "player_123"
}
```

### Conscription Chance Calculation
```javascript
function calculateConscriptionChance(enemy, player) {
  // Base chance based on enemy's max HP
  let baseChance = 30;  // 30% base chance
  
  // Adjust based on enemy's current HP (lower HP = higher chance)
  const hpRatio = enemy.currentHp / enemy.maxHp;
  const hpBonus = (1 - hpRatio) * 40;  // Up to 40% bonus for low HP
  
  // Adjust based on player's charisma
  const charismaBonus = player.stats.charisma * 0.5;  // 0.5% per charisma point
  
  // Adjust based on enemy's level vs player's level
  const levelDifference = player.level - enemy.level;
  const levelBonus = levelDifference * 2;  // 2% per level advantage
  
  // Calculate final chance (capped between 1% and 95%)
  let finalChance = baseChance + hpBonus + charismaBonus + levelBonus;
  return Math.min(95, Math.max(1, Math.round(finalChance)));
}
```

### Consumable Items for Conscription
```javascript
{
  id: "conscript_orb",
  name: "Conscript Orb",
  description: "Increases conscription chance by 15% when used on an enemy.",
  type: "consumable",
  rarity: "uncommon",
  effect: {
    type: "conscription_boost",
    value: 15  // 15% boost to conscription chance
  },
  maxStack: 99,
  value: 200
}

{
  id: "charm",
  name: "Charm",
  description: "Calms wild creatures, making them easier to conscript. +10% conscription chance.",
  type: "consumable",
  rarity: "common",
  effect: {
    type: "conscription_boost",
    value: 10
  },
  maxStack: 30,
  value: 100
}

{
  id: "net",
  name: "Capture Net",
  description: "A special net that restrains enemies. +5% conscription chance.",
  type: "consumable",
  rarity: "common",
  effect: {
    type: "conscription_boost",
    value: 5
  },
  maxStack: 10,
  value: 50
}
```

## Character Data

### Player Character Schema (Single File Implementation)

```javascript
// In GCA.Data.Player
Player: {
  // Core Identity
  id: "player_1",
  name: "Player",
  class: "ASPIRING",  // Changes at level 5
  level: 1,
  experience: 0,
  gold: 100,
  
  // Stats
  stats: {
    strength: 10,
    dexterity: 10,
    vitality: 10,
    intelligence: 10,
    luck: 10
  },
  
  // Equipment
  equipment: {
    weapon: null,
    armor: null,
    accessory: null
  },
  
  // Skills (populated via GCA.Managers.StateManager.unlockSkill)
  skills: [],
  
  // Inventory (item IDs and quantities)
  inventory: {
    items: [],
    maxSlots: 20
  },
  
  // Quests
  quests: {
    active: [],
    completed: []
  },
  
  // Relationships
  relationships: {}
}
```

### Player Character

```javascript
{
  // Core Identity
  id: "char_123456",              // Unique identifier
  name: "Hazel",                   // Character name
  class: "ASPIRING",              // Starts as "ASPIRING", changes at level 5
  level: 1,                       // Current level (starts at 1)
  experience: 0,                  // Current experience points
  experienceToNextLevel: 100,      // XP required for next level
  pendingClassSelection: false,    // Becomes true at level 5 until class is chosen
  availablePoints: 3,              // Points available for stat allocation

  // Base Stats (starting values, can be rerolled)
  baseStats: {
    strength: 3,      // Physical power
    intelligence: 3,   // Magical aptitude
    vitality: 3,       // Health and stamina
    dexterity: 3,      // Speed and precision
    fortune: 3,        // Luck and critical hits
    charisma: 3        // Social influence
  },
  
  // Stats from manual allocation (levels 1-4)
  allocatedStats: {
    strength: 0,
    intelligence: 0,
    vitality: 0,
    dexterity: 0,
    fortune: 0,
    charisma: 0
  },
  
  // Stats from class bonuses (applied after level 5)
  classBonusStats: {
    strength: 0,
    intelligence: 0,
    vitality: 0,
    dexterity: 0,
    fortune: 0,
    charisma: 0
  },
  
  // Current effective stats (computed property)
  get stats() {
    return {
      strength: this.baseStats.strength + this.allocatedStats.strength + this.classBonusStats.strength,
      intelligence: this.baseStats.intelligence + this.allocatedStats.intelligence + this.classBonusStats.intelligence,
      vitality: this.baseStats.vitality + this.allocatedStats.vitality + this.classBonusStats.vitality,
      dexterity: this.baseStats.dexterity + this.allocatedStats.dexterity + this.classBonusStats.dexterity,
      fortune: this.baseStats.fortune + this.allocatedStats.fortune + this.classBonusStats.fortune,
      charisma: this.baseStats.charisma + this.allocatedStats.charisma + this.classBonusStats.charisma
    };
  },
  
  // Derived stats (calculated from base stats)
  get derivedStats() {
    const s = this.stats;  // Reference to current stats
    return {
      maxHp: 50 + (s.vitality * 5) + (this.level * 2),
      maxMp: 10 + (s.intelligence * 3) + (this.level * 1.5),
      attack: s.strength * 2 + (s.dexterity * 0.5),
      defense: s.vitality * 1.5 + (s.strength * 0.5),
      magicAttack: s.intelligence * 2 + (s.fortune * 0.3),
      magicDefense: s.intelligence * 1.2 + (s.vitality * 0.8),
      speed: s.dexterity * 1.8 + (this.level * 0.3),
      critChance: 5 + (s.fortune * 0.7) + (s.dexterity * 0.3),
      evasion: s.dexterity * 1.0 + (s.fortune * 0.5)
    };
  },
  
  // Current HP/MP (start at max)
  get hp() { return this.derivedStats.maxHp; },
  get mp() { return this.derivedStats.maxMp; },
  
  // Class definitions (stored separately, referenced by ID)
  classes: {
    FLEXECUTIONER: {
      name: "Flexecutioner",
      description: "Warriors who blend strength and agility",
      // Class-specific stat modifiers (applied on top of base stats)
      statModifiers: {
        strength: 1.2,    // 20% bonus to strength
        vitality: 1.1,   // 10% bonus to vitality
        dexterity: 1.1,  // 10% bonus to dexterity
        hp: 1.15,        // 15% bonus to max HP
        physicalDefense: 1.1,  // 10% bonus to physical defense
        critDamage: 1.2  // 20% bonus to critical hit damage
      },
      // Auto-distributed stats per level (after 5)
      levelUpBonuses: {
        auto: {
          strength: 0.8,    // 80% chance of +1 strength
          vitality: 0.6,    // 60% chance of +1 vitality
          dexterity: 0.4,   // 40% chance of +1 dexterity
          intelligence: 0.1,
          fortune: 0.1,
          charisma: 0.1
        },
        manualPoints: 2  // Points to allocate manually per level
      },
      // Starting equipment (added to character's inventory)
      startingEquipment: [
        "rubber_dumbbells",
        "gym_bro_tank"
      ],
      // Skills learned at specific levels
      skillProgression: {
        1: ["power_strike"],
        3: ["protein_shake"],
        6: ["battle_cry"],
        9: ["form_check"],
        12: ["superset"],
        15: ["flex_and_reflect"],
        18: ["nitric_aura"],
        22: ["dumbbell_curve"],
        25: ["mass_pull"],
        28: ["hypertrophy"],
        31: ["swole_stomp"],
        34: ["adrenal_flood"],
        37: ["plyometric_guard"],
        40: ["brotein_barrier"],
        43: ["drop_set"],
        46: ["mind_muscle_link"],
        49: ["spotter_call"],
        52: ["hundred_rep_challenge"],
        55: ["time_under_tension"],
        58: ["failure_training"],
        60: ["one_rep_max"],
        63: ["beast_mode"],
        66: ["hunter_squat_program"],
        69: ["tactical_shirt_rip"],
        72: ["gains_goblin_mode"],
        75: ["atlas_carry"],
        78: ["super_saiyan_mode"]
      },
      // Class-specific abilities
      abilities: {
        // Power Strike: Level 1 ability
        power_strike: {
          type: "active",
          target: "single",
          mpCost: 5,
          cooldown: 3,
          damage: "220% STR",
          description: "Deals 220% STR damage. 20% chance to cause Bleed (10% HP over 3 turns)."
        },
        // Protein Shake: Level 3 ability
        protein_shake: {
          type: "passive",
          description: "+4% max HP & +5% HP regen in overworld"
        },
        // Battle Cry: Level 6 ability
        battle_cry: {
          type: "active",
          target: "party",
          mpCost: 10,
          cooldown: 4,
          description: "+20% STR & +10% VIT for 3 turns"
        },
        // Form Check: Level 9 ability
        form_check: {
          type: "passive",
          description: "Blocks 10% of melee damage if not moved last turn"
        },
        // Superset: Level 12 ability
        superset: {
          type: "active",
          target: "aoe",
          mpCost: 12,
          cooldown: 4,
          description: "150% STR damage to all enemies in front row"
        },
        // Flex and Reflect: Level 15 ability
        flex_and_reflect: {
          type: "active",
          target: "self",
          mpCost: 8,
          cooldown: 5,
          description: "Heals 18% max HP and grants 15% damage-reflection for 2 turns"
        },
        // Nitric Aura: Level 18 ability
        nitric_aura: {
          type: "passive",
          description: "+8% crit rate when HP > 75%"
        },
        // Dumb-bell Curve: Level 22 ability
        dumbbell_curve: {
          type: "active",
          target: "single",
          mpCost: 14,
          cooldown: 4,
          description: "-25% STR & DEX on target for 3 turns"
        },
        // Mass Pull: Level 25 ability
        mass_pull: {
          type: "active",
          target: "aoe",
          mpCost: 15,
          cooldown: 4,
          description: "Taunts all foes; +20% block for 2 turns"
        },
        // Hypertrophy: Level 28 ability
        hypertrophy: {
          type: "passive",
          description: "Every 100 XP gained: +1 permanent max HP (cap +300)"
        },
        // Swole Stomp: Level 31 ability
        swole_stomp: {
          type: "active",
          target: "aoe",
          mpCost: 18,
          cooldown: 5,
          description: "180% STR damage to all; 30% chance to Stun 1 turn"
        },
        // Adrenal Flood: Level 34 ability
        adrenal_flood: {
          type: "active",
          target: "self",
          hpCost: 0.08,
          cooldown: 6,
          description: "HP cost 8%; +40% STR & +25% Speed for 2 turns"
        },
        // Plyometric Guard: Level 37 ability
        plyometric_guard: {
          type: "passive",
          description: "When dodging, next attack +30% damage"
        },
        // Bro-tein Barrier: Level 40 ability
        brotein_barrier: {
          type: "active",
          target: "party",
          mpCost: 20,
          cooldown: 7,
          description: "Absorbs (20% VIT + 5% max HP) damage for all allies, 2 turns"
        },
        // Drop-Set: Level 43 ability
        drop_set: {
          type: "active",
          target: "single",
          mpCost: 16,
          cooldown: 5,
          description: "3 hits at 70% STR each; +5% damage per missing 10% HP"
        },
        // Mind-Muscle Link: Level 46 ability
        mind_muscle_link: {
          type: "passive",
          description: "STR also boosts MAG DEF at 50% rate"
        },
        // Spotter Call: Level 49 ability
        spotter_call: {
          type: "active",
          target: "ally",
          mpCost: 12,
          cooldown: 6,
          description: "Transfer 30% of damage taken to caster for 3 turns"
        },
        // 100-Rep Challenge: Level 52 ability
        hundred_rep_challenge: {
          type: "active",
          target: "self",
          mpCost: 25,
          cooldown: 8,
          description: "Next 3 attacks are guaranteed crits, but cost 12% HP each"
        },
        // Time Under Tension: Level 55 ability
        time_under_tension: {
          type: "passive",
          description: "+1% damage per turn in combat (max +15%)"
        },
        // Failure Training: Level 58 ability
        failure_training: {
          type: "passive",
          description: "At 1 HP, survive one fatal hit per battle (1 turn cooldown)"
        },
        // One-Rep Max: Level 63 ability
        one_rep_max: {
          type: "active",
          target: "single",
          mpCost: 30,
          cooldown: 8,
          description: "500% STR damage, but stuns self for 1 turn"
        },
        // Beast Mode: Level 66 ability
        beast_mode: {
          type: "active",
          target: "self",
          mpCost: 25,
          cooldown: 10,
          description: "+50% STR, +30% SPD, -30% DEF for 4 turns"
        },
        // Hunter Squat Program: Level 69 ability
        hunter_squat_program: {
          type: "passive",
          description: "+1 STR/VIT per 5 levels; +5% max HP"
        },
        // Tactical Shirt Rip: Level 72 ability
        tactical_shirt_rip: {
          type: "active",
          target: "aoe",
          mpCost: 20,
          cooldown: 7,
          description: "Removes all debuffs; +25% ATK/DEF for 3 turns"
        },
        // Gains Goblin Mode: Level 75 ability
        gains_goblin_mode: {
          type: "active",
          target: "self",
          hpCost: 0.99,
          mpCost: 1,
          cooldown: 15,
          description: "Sacrifice 99% HP to deal 50x missing HP as damage next turn"
        },
        // Atlas Carry: Level 78 ability
        atlas_carry: {
          type: "active",
          target: "party",
          mpCost: 35,
          cooldown: 10,
          description: "For 1 turn: Take 80% of damage for allies; counter for 200% DEF"
        },
        // Super Saiyan Mode: Level 80 ability (Ultimate)
        super_saiyan_mode: {
          type: "active",
          target: "self",
          mpCost: 50,
          cooldown: 999,
          description: "Transform for 5 turns: +100% all stats, 50% damage reduction, skills cost no MP"
        }
      },
      // Animation overrides
      animations: {
        basic: "power_strike",        // Basic attack animation
        skill: "swole_stomp",        // General skill animation
        buff: "muscle_flex",         // Buff application
        debuff: "intimidating_gaze",  // Debuff application
        ultimate: "super_saiyan",    // Ultimate ability
        idle: "confident_pose",      // Idle animation
        hurt: "tank_hit",            // Taking damage
        victory: "victory_pose",     // Victory pose
        defeat: "exhausted_pose",    // Defeat animation
        block: "guard_stance",       // Blocking/defending
        charge: "power_up"           // Charging abilities
      }
    },
    // Sus-Assassin - Agile melee/ranged DPS with stealth and critical hits
    SUS_ASSASSIN: {
      name: "Sus-Assassin",
      description: "Masters of stealth and precision, striking from the shadows with deadly accuracy",
      // Class-specific stat modifiers
      statModifiers: {
        dexterity: 1.25,   // 25% bonus to dexterity
        fortune: 1.2,     // 20% bonus to fortune
        strength: 1.1     // 10% bonus to strength
      },
      // Auto-distributed stats per level (after 5)
      levelUpBonuses: {
        auto: {
          dexterity: 0.9,    // 90% chance of +1 dexterity
          fortune: 0.7,      // 70% chance of +1 fortune
          strength: 0.5,     // 50% chance of +1 strength
          vitality: 0.3,
          intelligence: 0.1,
          charisma: 0.3
        },
        manualPoints: 2
      },
      // Starting equipment
      startingEquipment: [
        "suspicious_daggers",
        "edgy_hoodie"
      ],
      // Skills learned at specific levels (1-80 progression)
      skillProgression: {
        // Levels 1-20 ("Sneaky Sus")
        1: ["backstab"],
        3: "smoke_and_mirrors",
        6: "knife_to_meet_you",
        9: "quick_escape_plan",
        12: "ninja_vanish",
        15: "stab_and_grab",
        18: "ghost_mode",
        // Levels 21-40 ("Silent But Deadly")
        22: "knee_capper",
        25: "blender_of_doom",
        28: "shadow_clone_jutsu",
        31: "surprise_party",
        34: "phantom_limb",
        37: "adrenaline_junkie",
        40: "mark_of_shame",
        // Levels 41-60 ("Master of Disguise")
        43: "knifey_spoony",
        46: "toxic_gossip",
        49: "shadow_rave",
        52: "stalkers_mark",
        55: "silent_but_deadly",
        58: "cloak_of_plausible_deniability",
        60: "murder_spree",
        // Levels 61-80 ("Phantom Menace")
        63: "tele-frag",
        66: "petal_blender",
        69: "edgy_emo_phase",
        72: "gut_feeling",
        75: "casual_walk_away",
        78: "knife_shield",
        80: "final_cut"
      },
      // Class-specific abilities
      abilities: {
        backstab: {
          type: "active",
          mpCost: 15,
          cooldown: 3,
          damage: "250% DEX",
          description: "Deals 250% DEX damage when attacking from behind. Guaranteed crit from stealth."
        },
        smoke_and_mirrors: {
          type: "active",
          mpCost: 10,
          cooldown: 4,
          description: "Creates a smoke cloud that grants stealth for 1 turn. Next attack has +30% crit damage."
        },
        knife_to_meet_you: {
          type: "active",
          mpCost: 20,
          cooldown: 3,
          damage: "180% DEX",
          description: "Throws knives at all enemies for 180% DEX damage. 20% chance to cause Bleed."
        },
        quick_escape_plan: {
          type: "active",
          mpCost: 15,
          cooldown: 5,
          description: "Quickly retreat to back row, removing debuffs and gaining +30% dodge for 2 turns."
        },
        ninja_vanish: {
          type: "active",
          mpCost: 25,
          cooldown: 6,
          description: "Enter stealth for 2 turns and gain +50% crit chance on next attack."
        },
        stab_and_grab: {
          type: "active",
          mpCost: 30,
          cooldown: 4,
          damage: "220% DEX",
          description: "Deals 220% DEX damage and steals one random buff from the target."
        },
        ghost_mode: {
          type: "active",
          mpCost: 40,
          cooldown: 8,
          description: "Become untargetable for 1 turn and gain +100% crit damage on next attack."
        },
        knee_capper: {
          type: "active",
          mpCost: 20,
          cooldown: 3,
          damage: "150% DEX",
          description: "Deals 150% DEX damage and reduces target's SPD by 30% for 3 turns."
        },
        blender_of_doom: {
          type: "active",
          mpCost: 45,
          cooldown: 5,
          damage: "320% DEX",
          description: "Spins rapidly, hitting all enemies for 320% DEX damage. 30% chance to cause Bleed."
        },
        shadow_clone_jutsu: {
          type: "active",
          mpCost: 35,
          cooldown: 7,
          description: "Creates a shadow clone that taunts enemies and explodes for 200% INT damage when destroyed."
        },
        surprise_party: {
          type: "active",
          mpCost: 50,
          cooldown: 10,
          description: "Summons 3 shadow clones that each attack random enemies for 150% DEX damage."
        },
        phantom_limb: {
          type: "passive",
          description: "20% chance to attack twice. Second attack deals 50% damage."
        },
        adrenaline_junkie: {
          type: "passive",
          description: "Gain +5% damage for each debuff on the target, up to 25%."
        },
        mark_of_shame: {
          type: "active",
          mpCost: 40,
          cooldown: 8,
          description: "Marks target for 3 turns. Marked targets take 30% more damage from you."
        },
        knifey_spoony: {
          type: "active",
          mpCost: 25,
          cooldown: 4,
          damage: "180% DEX",
          description: "Throws a spoon that bounces between 3-5 enemies for 180% DEX damage each."
        },
        toxic_gossip: {
          type: "active",
          mpCost: 30,
          cooldown: 6,
          description: "Poisons all enemies, dealing 5% max HP per turn for 4 turns. 20% chance to silence."
        },
        shadow_rave: {
          type: "active",
          mpCost: 60,
          cooldown: 10,
          damage: "400% DEX",
          description: "Disappears and strikes all enemies for 400% DEX damage. 50% chance to stun for 1 turn."
        },
        stalkers_mark: {
          type: "active",
          mpCost: 25,
          cooldown: 5,
          description: "Marks target for 5 turns. You gain +20% damage against marked targets and can see their HP."
        },
        silent_but_deadly: {
          type: "passive",
          description: "Your attacks from stealth deal 50% more damage and ignore 30% of DEF."
        },
        cloak_of_plausible_deniability: {
          type: "active",
          mpCost: 40,
          cooldown: 12,
          description: "Enter stealth for 3 turns and gain 50% damage reduction for 1 turn."
        },
        murder_spree: {
          type: "active",
          mpCost: 75,
          cooldown: 15,
          damage: "600% DEX",
          description: "Teleports to each enemy, dealing 600% DEX damage. If this kills, cooldown is reset."
        },
        tele_frag: {
          type: "active",
          mpCost: 30,
          cooldown: 6,
          damage: "350% DEX",
          description: "Instantly teleport behind target, dealing 350% DEX damage. Always crits from stealth."
        },
        petal_blender: {
          type: "active",
          mpCost: 50,
          cooldown: 8,
          damage: "280% DEX",
          description: "Hits all enemies 3 times for 280% DEX total damage. 30% chance to cause Bleed each hit."
        },
        edgy_emo_phase: {
          type: "active",
          mpCost: 1,  // HP cost instead
          hpCost: "20%",
          cooldown: 10,
          description: "Sacrifice 20% HP to enter a state where all attacks deal +40% damage and heal for 50% of damage dealt for 3 turns."
        },
        gut_feeling: {
          type: "passive",
          description: "When below 30% HP, gain +50% evasion and your attacks have 100% crit chance."
        },
        casual_walk_away: {
          type: "active",
          mpCost: 0,
          cooldown: 20,
          description: "Dodge all attacks this turn. Next turn, automatically counter all attacks with 300% DEX damage."
        },
        knife_shield: {
          type: "active",
          mpCost: 40,
          cooldown: 12,
          description: "For 2 turns, reflect 50% of damage taken back to the attacker. While active, gain +30% DEF."
        },
        final_cut: {
          type: "active",
          mpCost: 100,
          cooldown: 999,
          damage: "999% DEX",
          description: "The ultimate technique. Deals 999% DEX damage to a single target. If this kills, instantly execute all other enemies below 20% HP."
        }
      },
      // Animation overrides
      animations: {
        basic: "dagger_slash",        // Basic attack animation
        skill: "shadow_assault",     // General skill animation
        stealth: "vanish",           // Entering stealth
        crit: "backstab",            // Critical hit/backstab
        dodge: "shadow_step",        // Successful dodge
        ultimate: "murder_spree",    // Ultimate ability
        idle: "crouching_stance",    // Idle animation
        hurt: "quick_recovery",      // Taking damage
        victory: "knife_twirl",      // Victory pose
        defeat: "fade_away",         // Defeat animation
        poison: "venom_application"  // Applying poison/DoT effects
      }
    },
    
    // Influmancer - Caster DPS with elemental magic and reality-bending powers
    INFLUMANCER: {
      name: "Influmancer",
      description: "Masters of arcane arts who manipulate the fabric of reality with their influence",
      // Class-specific stat modifiers
      statModifiers: {
        intelligence: 1.3,   // 30% bonus to intelligence
        charisma: 1.2,      // 20% bonus to charisma
        fortune: 1.1        // 10% bonus to fortune
      },
      // Auto-distributed stats per level (after 5)
      levelUpBonuses: {
        auto: {
          intelligence: 1.0,  // 100% chance of +1 intelligence
          charisma: 0.6,     // 60% chance of +1 charisma
          fortune: 0.4,      // 40% chance of +1 fortune
          dexterity: 0.2,
          vitality: 0.1,
          strength: 0.1
        },
        manualPoints: 2
      },
      // Starting equipment
      startingEquipment: [
        "viral_spellbook",
        "influencer_hoodie"
      ],
      // Skills learned at specific levels (1-80 progression)
      skillProgression: {
        // Levels 1-20 ("Influencer Wannabe")
        1: ["clickbait_bolt"],
        3: "block_button",
        6: "hot_take",
        9: "cold_shoulder",
        12: "viral_strike",
        15: "engagement_boost",
        18: "hate_shield",
        // Levels 21-40 ("Trending Topic")
        22: "rewind_button",
        25: "drama_llama",
        28: "tweet_storm",
        31: "mind_melter",
        34: "cancel_culture",
        37: "narrative_shift",
        40: "clout_chaser",
        // Levels 41-60 ("Viral Sensation")
        43: "black_mirror",
        46: "doom_scroll",
        49: "thread_weaver",
        52: "deep_fake",
        55: "hype_train",
        58: "simp_army",
        60: "trending_worldwide",
        // Levels 61-80 ("Meme Lord")
        63: "retcon",
        66: "big_think",
        69: "void_your_opinion",
        72: "ratio_blast",
        75: "fact_anchor",
        78: "copium_inhaler",
        80: "going_viral"
      },
      // Class-specific abilities
      abilities: {
        clickbait_bolt: {
          type: "active",
          mpCost: 15,
          cooldown: 0,
          damage: "180% INT",
          description: "Fires a flashy bolt that deals 180% INT damage. 20% chance to confuse target."
        },
        block_button: {
          type: "active",
          mpCost: 20,
          cooldown: 3,
          description: "Blocks the next incoming attack and reflects 50% of the damage back. +20% block chance for 2 turns."
        },
        hot_take: {
          type: "active",
          mpCost: 25,
          cooldown: 4,
          damage: "220% INT",
          description: "Deals 220% INT fire damage and burns for 10% INT per turn for 3 turns."
        },
        cold_shoulder: {
          type: "active",
          mpCost: 25,
          cooldown: 4,
          damage: "220% INT",
          description: "Deals 220% INT ice damage and reduces target's SPD by 30% for 2 turns."
        },
        viral_strike: {
          type: "active",
          mpCost: 35,
          cooldown: 5,
          damage: "280% INT",
          description: "Deals 280% INT damage. If target dies, spreads to another enemy for 50% damage (up to 3 bounces)."
        },
        engagement_boost: {
          type: "active",
          mpCost: 30,
          cooldown: 6,
          description: "Increases party's INT and CHA by 20% for 4 turns. Extends duration of all buffs by 1 turn."
        },
        hate_shield: {
          type: "active",
          mpCost: 25,
          cooldown: 8,
          description: "Creates a shield that absorbs 300% INT damage for 3 turns. While active, reflects 25% of damage taken."
        },
        rewind_button: {
          type: "active",
          mpCost: 50,
          cooldown: 10,
          description: "Rewinds time by 1 turn, restoring HP/MP to their values at the start of last turn. Removes debuffs."
        },
        drama_llama: {
          type: "active",
          mpCost: 40,
          cooldown: 6,
          description: "Taunts all enemies for 2 turns. While active, gain +50% THP and reflect 30% of damage taken."
        },
        tweet_storm: {
          type: "active",
          mpCost: 45,
          cooldown: 5,
          damage: "150% INT",
          description: "Hits random enemies 5-8 times for 150% INT damage each. Each hit has 30% chance to silence."
        },
        mind_melter: {
          type: "active",
          mpCost: 35,
          cooldown: 7,
          description: "Reduces all enemies' INT by 30% and has a 40% chance to confuse for 2 turns."
        },
        cancel_culture: {
          type: "active",
          mpCost: 60,
          cooldown: 12,
          description: "Removes all buffs from all enemies and deals 50% of total buffs removed as damage. Silences for 2 turns."
        },
        narrative_shift: {
          type: "active",
          mpCost: 40,
          cooldown: 10,
          description: "Swaps HP% with target enemy. If enemy has lower HP, deals the difference as damage instead."
        },
        clout_chaser: {
          type: "passive",
          description: "Gain +5% INT for each debuff on enemies, up to 25%. Critical hits apply a random debuff."
        },
        black_mirror: {
          type: "active",
          mpCost: 50,
          cooldown: 8,
          description: "Creates a mirror that reflects the next 3 spells back at their caster with 150% power."
        },
        doom_scroll: {
          type: "active",
          mpCost: 1,  // HP cost instead
          hpCost: "15%",
          cooldown: 15,
          description: "Sacrifice 15% HP to deal 500% INT damage to all enemies. Damage increases by 50% for each debuff on you."
        },
        thread_weaver: {
          type: "active",
          mpCost: 30,
          cooldown: 6,
          description: "Links all enemies for 3 turns. When one takes damage, others take 20% of that damage."
        },
        deep_fake: {
          type: "active",
          mpCost: 60,
          cooldown: 12,
          description: "Creates an illusion of target enemy that fights for you for 3 turns with 50% of their stats."
        },
        hype_train: {
          type: "active",
          mpCost: 45,
          cooldown: 10,
          description: "Grants all allies +30% ATK, +30% SPD, and 20% lifesteal for 4 turns."
        },
        simp_army: {
          type: "active",
          mpCost: 70,
          cooldown: 15,
          description: "Summons 3 simp minions with 30% of your stats that attack random enemies each turn for 3 turns."
        },
        trending_worldwide: {
          type: "passive",
          description: "Your spells have a 15% chance to go viral, dealing 50% more damage and hitting all enemies."
        },
        retcon: {
          type: "active",
          mpCost: 80,
          cooldown: 20,
          description: "Rewinds the battle to the start of the previous turn, restoring HP/MP to those values. You remember what happened."
        },
        big_think: {
          type: "active",
          mpCost: 50,
          cooldown: 10,
          description: "Enter deep thought for 1 turn, then unleash a massive 800% INT AoE attack that stuns for 1 turn."
        },
        void_your_opinion: {
          type: "active",
          mpCost: 40,
          cooldown: 8,
          description: "Silences all enemies for 2 turns and removes all buffs. Deals 200% INT damage per buff removed."
        },
        ratio_blast: {
          type: "active",
          mpCost: 60,
          cooldown: 12,
          damage: "400% INT",
          description: "Deals 400% INT damage. If target has more HP than you, damage is increased by 50%."
        },
        fact_anchor: {
          type: "active",
          mpCost: 1,  // HP cost instead
          hpCost: "25%",
          cooldown: 15,
          description: "Sacrifice 25% HP to create a zone of truth for 3 turns. All attacks are critical hits, but you take 10% more damage."
        },
        copium_inhaler: {
          type: "active",
          mpCost: 30,
          cooldown: 10,
          description: "Restore 30% HP and gain 50% damage reduction for 1 turn. Next turn, take 15% of max HP as damage."
        },
        going_viral: {
          type: "active",
          mpCost: 100,
          cooldown: 999,
          damage: "1000% INT",
          description: "The ultimate flex. Deal 1000% INT damage to all enemies and apply all debuffs in the game. For each debuff applied, heal for 5% max HP."
        }
      },
      // Animation overrides
      animations: {
        basic: "spell_cast",         // Basic attack animation
        skill: "reality_tear",      // General skill animation
        aoe: "viral_strike",        // Area of effect spells
        channel: "doom_scroll",     // Channeling powerful magic
        summon: "simp_army",        // Summoning minions
        ultimate: "going_viral",    // Ultimate ability
        idle: "hovering_stance",    // Idle animation
        hurt: "phase_shift",        // Taking damage
        victory: "reality_bend",    // Victory pose
        defeat: "digital_glitch",   // Defeat animation
        buff: "narrative_shift"     // Buff/debuff application
      }
    },
    
    // Rizzler - Support/Healer with charm and divine powers
    RIZZLER: {
      name: "Rizzler",
      description: "Charismatic healers who use their charm and divine powers to support allies and confound enemies",
      // Class-specific stat modifiers
      statModifiers: {
        charisma: 1.3,      // 30% bonus to charisma
        intelligence: 1.2,  // 20% bonus to intelligence
        fortune: 1.1        // 10% bonus to fortune
      },
      // Auto-distributed stats per level (after 5)
      levelUpBonuses: {
        auto: {
          charisma: 1.0,    // 100% chance of +1 charisma
          intelligence: 0.6,// 60% chance of +1 intelligence
          vitality: 0.4,    // 40% chance of +1 vitality
          fortune: 0.3,
          dexterity: 0.1,
          strength: 0.1
        },
        manualPoints: 2
      },
      // Starting equipment
      startingEquipment: [
        "rizz_charm",
        "smooth_operator_manual"
      ],
      // Skills learned at specific levels (1-80 progression)
      skillProgression: {
        // Levels 1-20 ("Rizzler Rookie")
        1: ["rizz_beam"],
        3: "smolder",
        6: "rizz_boost",
        9: "chill_vibes",
        12: "roast_session",
        15: "group_hug",
        18: "rizz_shield",
        // Levels 21-40 ("Rizz God")
        22: "rizz_tsunami",
        25: "golden_glow",
        28: "divine_wingman",
        31: "rizz_surge",
        34: "rizz_zone",
        37: "rizz_overload",
        40: "battle_rizz",
        // Levels 41-60 ("Rizz Master")
        43: "ghost_buster",
        46: "rizz_aura",
        49: "hype_man",
        52: "rizz_karma",
        55: "rizz_hug",
        58: "rizz_whisperer",
        60: "rizz_ascension",
        // Levels 61-80 ("Rizz Legend")
        63: "rizz_avatar",
        66: "rizz_decree",
        69: "rizz_symphony",
        72: "fountain_of_rizz",
        75: "rizz_backfire",
        78: "rizz_guardian",
        80: "ultimate_rizz"
      },
      // Class-specific abilities
      abilities: {
        rizz_beam: {
          type: "active",
          mpCost: 15,
          cooldown: 0,
          heal: "200% INT + 10% max HP",
          description: "Channels positive energy to heal a target ally for 200% INT + 10% of their max HP. Critical heals grant a shield for 50% of the amount healed."
        },
        smolder: {
          type: "active",
          mpCost: 20,
          cooldown: 3,
          description: "Charms an enemy for 2 turns, causing them to skip their turn. 30% chance to charm all enemies instead."
        },
        rizz_boost: {
          type: "active",
          mpCost: 25,
          cooldown: 4,
          description: "Grants an ally +30% ATK and +20% CRIT chance for 3 turns. If cast on self, also gain +50% CHA."
        },
        chill_vibes: {
          type: "active",
          mpCost: 30,
          cooldown: 5,
          heal: "150% INT",
          description: "Heals all allies for 150% INT and removes 1 debuff from each. If no debuffs are removed, heal for an additional 50% INT."
        },
        roast_session: {
          type: "active",
          mpCost: 35,
          cooldown: 4,
          damage: "180% CHA",
          description: "Deals 180% CHA damage to an enemy and reduces their ATK by 20% for 3 turns. 30% chance to stun for 1 turn."
        },
        group_hug: {
          type: "active",
          mpCost: 40,
          cooldown: 6,
          heal: "120% INT",
          description: "Heals all allies for 120% INT and grants them +15% damage reduction for 2 turns. Each ally healed increases your CHA by 5% (stacks up to 5 times)."
        },
        rizz_shield: {
          type: "active",
          mpCost: 30,
          cooldown: 5,
          description: "Shields an ally for 300% INT + 15% of their max HP for 3 turns. While shielded, they gain +20% damage dealt."
        },
        rizz_tsunami: {
          type: "active",
          mpCost: 50,
          cooldown: 8,
          damage: "250% CHA",
          description: "Deals 250% CHA damage to all enemies and reduces their CHA by 30% for 3 turns. If any enemy is charmed, deal 50% more damage."
        },
        golden_glow: {
          type: "active",
          mpCost: 45,
          cooldown: 7,
          description: "Grants all allies +25% all stats and immunity to debuffs for 3 turns. Extends duration of all buffs by 1 turn."
        },
        divine_wingman: {
          type: "passive",
          description: "Your heals and buffs are 20% more effective on allies below 50% HP. Your CHA increases by 1% for every 1% HP missing on your lowest HP ally."
        },
        rizz_surge: {
          type: "active",
          mpCost: 60,
          cooldown: 10,
          description: "Instantly grants an ally an extra turn and increases their damage by 50% for that turn. If used on self, cooldown is reduced by 3 turns."
        },
        rizz_zone: {
          type: "active",
          mpCost: 70,
          cooldown: 12,
          description: "Creates a zone for 4 turns where all allies gain +30% CHA and all enemies have -30% CHA. All healing and shielding is increased by 50% in the zone."
        },
        rizz_overload: {
          type: "active",
          mpCost: 80,
          cooldown: 15,
          damage: "400% CHA",
          description: "Deals 400% CHA damage to all enemies and charms them for 1 turn. Charmed enemies attack their allies with 75% of their ATK."
        },
        battle_rizz: {
          type: "passive",
          description: "Your basic attacks heal the most injured ally for 50% of the damage dealt. Your critical heals grant the target +20% CHA for 3 turns."
        },
        ghost_buster: {
          type: "active",
          mpCost: 40,
          cooldown: 8,
          damage: "300% INT",
          description: "Deals 300% INT damage to undead and demon enemies, and heals your party for 100% of the damage dealt. Stuns undead for 1 turn."
        },
        rizz_aura: {
          type: "passive",
          description: "All allies within 2 tiles gain +15% CHA and +10% healing received. Your presence reduces enemy CHA by 10%."
        },
        hype_man: {
          type: "active",
          mpCost: 50,
          cooldown: 10,
          description: "Target ally gains +50% ATK and +30% SPD for 3 turns. If they kill an enemy during this time, reset the cooldown of this skill."
        },
        rizz_karma: {
          type: "passive",
          description: "When an ally dies, they are revived with 25% HP and gain 100% CHA for 1 turn. This can only happen once per battle per ally."
        },
        rizz_hug: {
          type: "active",
          mpCost: 1,  // HP cost instead
          hpCost: "20%",
          cooldown: 15,
          heal: "500% INT",
          description: "Sacrifice 20% of your max HP to heal an ally for 500% INT and grant them a shield equal to 100% of their max HP for 2 turns."
        },
        rizz_whisperer: {
          type: "passive",
          description: "Your charm effects cannot be resisted. Charmed enemies take 30% more damage from all sources and deal 50% less damage to your party."
        },
        rizz_ascension: {
          type: "active",
          mpCost: 100,
          cooldown: 20,
          description: "Enter a divine state for 5 turns where all your stats are doubled, your cooldowns are reduced by 50%, and all your skills cost no MP."
        },
        rizz_avatar: {
          type: "active",
          mpCost: 80,
          cooldown: 15,
          description: "Become an avatar of charm for 4 turns. All your attacks hit all enemies, and all your heals affect all allies. Your CHA is increased by 50% during this time."
        },
        rizz_decree: {
          type: "active",
          mpCost: 60,
          cooldown: 12,
          description: "Issue a divine decree that forces all enemies to attack their ally with the lowest HP. The target takes 50% more damage from these attacks."
        },
        rizz_symphony: {
          type: "active",
          mpCost: 90,
          cooldown: 18,
          description: "Play a mesmerizing melody that charms all enemies for 2 turns and heals all allies for 300% INT each turn for 3 turns. While active, enemies have -50% CHA."
        },
        fountain_of_rizz: {
          type: "active",
          mpCost: 70,
          cooldown: 10,
          description: "Create a fountain that heals all allies for 200% INT per turn and removes 1 debuff each turn. Lasts 4 turns. Each heal has a 20% chance to reset the cooldown of a random skill."
        },
        rizz_backfire: {
          type: "passive",
          description: "When an enemy attempts to apply a debuff to your party, there's a 50% chance it will backfire and affect their allies instead. You are immune to charm effects."
        },
        rizz_guardian: {
          type: "active",
          mpCost: 120,
          cooldown: 25,
          description: "Summon a guardian that protects your party for 3 turns. All damage taken is reduced by 70% and reflected back at the attacker. Cannot be dispelled."
        },
        ultimate_rizz: {
          type: "active",
          mpCost: 200,
          cooldown: 999,
          description: "The ultimate display of charm. Fully heal and revive all allies, remove all debuffs, and grant them +50% to all stats for 5 turns. All enemies are charmed for 3 turns and take 50% more damage. This ability can only be used once per battle."
        }
      },
      // Animation overrides
      animations: {
        basic: "charming_wink",          // Basic attack animation
        skill: "divine_embrace",       // General skill animation
        heal: "hearts_swirl",          // Healing abilities
        buff: "golden_halo_glow",      // Buff application
        debuff: "charm_heart_eyes",     // Charm/debuff application
        ultimate: "divine_ascension",   // Ultimate ability
        idle: "confident_pose",         // Idle animation
        hurt: "graceful_recoil",        // Taking damage
        victory: "triumphant_pose",     // Victory pose
        defeat: "dramatic_faint"        // Defeat animation
      }
    },
    
  
  // Methods
  levelUp() {
    this.level += 1;
    this.experienceToNextLevel = Math.floor(100 * Math.pow(1.5, this.level - 1));
    
    // Check for skill unlocks
    const classProgression = this.skillProgression[this.class];
    if (classProgression) {
      const newSkills = classProgression
        .filter(skill => skill.level === this.level)
        .map(skill => ({
          id: skill.skillId,
          name: this.formatSkillName(skill.skillId),
          levelUnlocked: skill.level,
          type: this.getSkillType(skill.skillId),
          power: this.calculateSkillPower(skill.skillId),
          mpCost: this.calculateMpCost(skill.skillId),
          cooldown: this.calculateCooldown(skill.skillId),
          description: this.getSkillDescription(skill.skillId)
        }));
      
      // Add new skills to character
      this.skills.push(...newSkills);
      
      // Trigger skill unlock notification if any new skills were added
      if (newSkills.length > 0) {
        this.triggerEvent('skillUnlocked', { skills: newSkills });
      }
    }
    
    // Stat increases
    const statIncreases = this.calculateStatIncreases();
    Object.entries(statIncreases).forEach(([stat, value]) => {
      this.stats[stat] += value;
    });
    
    // Show level up notification
    this.triggerEvent('levelUp', { 
      level: this.level,
      newSkills: newSkills.map(skill => skill.name) 
    });
    
    if (this.level < 5) {
      // Pre-class levels: 3 points to distribute
      this.availablePoints += 3;
    } else if (this.level === 5) {
      // Time to choose a class
      this.pendingClassSelection = true;
    } else if (this.class !== "ASPIRING") {
      // Post-class level up
      const classData = this.classes[this.class];
      
      // Add auto-distributed stats
      for (const [stat, value] of Object.entries(classData.statBonuses.auto)) {
        const bonus = Math.floor(value);
        this.classBonusStats[stat] += bonus;
        
        // Handle fractional parts
        const remainder = value - bonus;
        if (Math.random() < remainder) {
          this.classBonusStats[stat] += 1;
        }
      }
      
      // Add manual points
      this.availablePoints += classData.statBonuses.manualPoints;
    }
  },
  
  selectClass(className) {
    if (this.level < 5) {
      throw new Error("Must be at least level 5 to select a class");
    }
    if (!this.classes[className]) {
      throw new Error(`Invalid class: ${className}`);
    }
    
    this.class = className;
    this.pendingClassSelection = false;
    
    // Apply first level of class bonuses
    this.levelUp();
  },
  
  // Rolls 2d6-2 for each stat (range: 0-10, average ~5)
  rollDice() {
    return Math.min(10, Math.max(0, 
      Math.floor(Math.random() * 6) + 
      Math.floor(Math.random() * 6) - 2
    ));
  },
  
  rerollStats() {
    if (this.level > 1) {
      throw new Error("Can only reroll stats at level 1");
    }
    
    // Roll 2d6-2 for each stat (range: 0-10)
    for (const stat in this.baseStats) {
      this.baseStats[stat] = this.rollDice();
    }
    
    // Reset allocated points
    for (const stat in this.allocatedStats) {
      this.allocatedStats[stat] = 0;
    }
    
    // Reset available points
    this.availablePoints = 3;
    
    return this;
  },
  
  // Apply class-specific modifiers to stats
  applyClassModifiers() {
    if (this.class === "ASPIRING") return;
    
    const classData = this.classes[this.class];
    if (!classData) return;
    
    // Apply stat modifiers (multiplicative)
    for (const [stat, modifier] of Object.entries(classData.statModifiers || {})) {
      this.baseStats[stat] = Math.floor(this.baseStats[stat] * modifier);
    }
    
    // Add starting equipment
    if (Array.isArray(classData.startingEquipment)) {
      classData.startingEquipment.forEach(item => {
        if (!this.inventory.includes(item)) {
          this.inventory.push(item);
        }
      });
    }
  },
  
  // Get available skills based on level
  getAvailableSkills() {
    if (this.class === "ASPIRING") return [];
    const classData = this.classes[this.class];
    if (!classData?.skillProgression) return [];
    
    const available = [];
    for (const [level, skills] of Object.entries(classData.skillProgression)) {
      if (this.level >= parseInt(level)) {
        if (Array.isArray(skills)) {
          available.push(...skills);
        } else {
          available.push(skills);
        }
      }
    }
    return available;
  },
  
  // ... rest of character methods
}
  // Skills (automatically unlocked by level)
  skills: [
    {
      id: "basic_attack",
      name: "Basic Attack",
      levelUnlocked: 1,
      type: "physical",
      power: 100,  // Percentage of base damage
      mpCost: 0,
      cooldown: 0,
      description: "A basic attack dealing 100% of attack damage.",
      icon: "basic_attack_icon.png",
      animation: "slash_effect",
      sound: "slash.wav",
      targetType: "single",
      range: 1,
      element: "neutral",
      isUnlocked: true,
      timesUsed: 0,
      lastUsed: null,
      comboPoints: 1
    },
    // Additional skills are added automatically when leveling up
  ],
  
  // Skill slots (quick access)
  skillSlots: [
    { slot: 1, skillId: "basic_attack" },
    { slot: 2, skillId: "powerStrike" },
    { slot: 3, skillId: null },
    { slot: 4, skillId: null }
  ],

  // Skill progression is now defined within each class definition

  // maxHp = 50 + (vitality * 5) + (level * 2)
  // maxMp = 10 + (intelligence * 3) + (level * 1.5)
  // attack = strength * 2 + (dexterity * 0.5)
  // defense = vitality * 1.5 + (strength * 0.5)
  // magicAttack = intelligence * 2 + (fortune * 0.3)
  // magicDefense = intelligence * 1.2 + (vitality * 0.8)
  // speed = dexterity * 1.8 + (level * 0.3)
  // critChance = 5 + (fortune * 0.7) + (dexterity * 0.3)
  // evasion = dexterity * 1.0 + (fortune * 0.5)
  //
  // These base values are then modified by:
  // 1. Class modifiers (each class has different multipliers)
  // 2. Equipment bonuses
  // 3. Status effects
  // 4. Temporary buffs/debuffs
  //
  // Example calculation for a level 5 character with 10 strength, 8 vitality, 9 dexterity:
  // attack = (10 * 2 + 9 * 0.5) * classModifier + equipmentBonus
  //         = (20 + 4.5) * 1.0 + 0  // Assuming 1.0 class mod and no equipment
  //         = 24.5 (rounded to 25)
  
  skills: {                       // Active and passive abilities
    "powerStrike": {
      id: "powerStrike",
      name: "Power Strike",
      level: 1,
      type: "active",
      target: "single",
      mpCost: 5,
      cooldown: 0,
      description: "A powerful strike that deals 150% physical damage.",
      unlockLevel: 1,
      damageMultiplier: 1.5
    },
    // Additional skills...
  },
  equipment: {                    // Equipped items
    MAIN_HAND: {
      id: "rubber_dumbells",
      name: "Rubber Dumbells",
      // Item properties...
    },
    OFF_HAND: null,
    HEAD: null,
    BODY: null,
    LEGS: null,
    FEET: null,
    RELIC_1: null,
    RELIC_2: null
  },
  relics: {                       // Owned relics
    "glitchStick": {
      id: "glitchStick",
      name: "Glitch Stick",
      level: 2,
      fury: 150,
      furyToNextLevel: 300,
      maxLevel: 6,
      equippedSlot: "RELIC_1"
    }
    // Additional relics...
  },
  masteredRelicSkills: [          // Permanently unlocked relic skills
    "summonGuide",
    "realityShift"
  ],
  inventory: [                    // Character-specific inventory
    // Reference to inventory items
  ],
  questStates: {                  // Character-specific quest progress
    "find_relic": {
      status: "inProgress",
      objectives: {
        "explore_arcade_basement": true,
        "interact_glitch_pedestal": false,
        "collect_glitch_stick": false
      }
    }
    // Additional quests...
  },
  storylinePosition: {            // Position in main storyline
    chapter: 1,
    scene: 1,
    flags: {}
  },
  createdAt: 1714492800000,       // When character was created
  lastPlayed: 1714579200000       // When character was last used
}

## Enemy Data

###Enemy Definition

```javascript
{
  id: "byte_bug",
  name: "Byte Bug",
  description: "A digital insect that feeds on corrupted data.",
  level: 1,
  baseStats: {
    hp: 20,
    mp: 0,
    strength: 3,
    defense: 2,
    magicAttack: 0,
    magicDefense: 1,
    speed: 4,
    critChance: 5,
    evasion: 8
  },
  scaling: {                      // Stat scaling per level
    hp: 5,
    strength: 0.8,
    defense: 0.5,
    speed: 0.3
  },
  attacks: [
    {
      id: "byte",
      name: "Byte",
      damage: { min: 2, max: 5 },
      accuracy: 0.9,
      weight: 0.7              // Probability weight for AI selection
    },
    {
      id: "virus_injection",
      name: "Virus Injection",
      damage: { min: 4, max: 8 },
      accuracy: 0.7,
      weight: 0.3,
      statusEffects: [
        {
          type: "poison",
          chance: 0.3,
          duration: 3,
          strength: 2
        }
      ]
    }
  ],
  loot: {
    experience: { min: 10, max: 15 },
    gold: { min: 5, max: 10 },
    guaranteed: [
      { itemId: "byte_fragment", count: { min: 1, max: 3 } }
    ],
    chance: [
      { itemId: "debug_potion", chance: 0.1 },
      { itemId: "circuit_piece", chance: 0.05 }
    ]
  },
  sprite: "byte_bug.png",
  animations: {
    idle: { frames: [0, 1, 2, 1], frameRate: 4 },
    attack: { frames: [3, 4, 5], frameRate: 8 }
  },
  behavior: "aggressive",        // AI behavior type
  movementPattern: "patrol",     // World map movement
  vulnerabilities: {
    physical: 1.0,
    fire: 0.5,
    electric: 1.5,
    ice: 1.0
  },
  areas: ["arcade1", "arcade2"]  // Areas where this enemy can appear
}
```

### Enemy Encounter

```javascript
{
  id: "arcade_easy",
  name: "Arcade Bugs",
  description: "A group of digital bugs roaming the arcade.",
  enemies: [
    { enemyId: "byte_bug", count: { min: 1, max: 3 } },
    { enemyId: "pixel_pirate", count: { min: 0, max: 1 }, chance: 0.3 }
  ],
  background: "arcade_floor.png",
  music: "battle_theme_arcade.mp3",
  levelRange: { min: 1, max: 3 },
  bonusConditions: {
    "noHits": {
      description: "Complete battle without taking damage",
      reward: { gold: 50, experience: 25 }
    },
    "quickVictory": {
      description: "Win in 3 turns or less",
      reward: { gold: 30, experience: 15 }
    }
  },
  areas: ["arcade1"]
}
```

## Item Data

### Basic Item

```javascript
{
  id: "health_potion",
  name: "Health Potion",
  description: "Restores 30 HP to one character.",
  type: "consumable",
  subType: "healing",
  rarity: "common",
  value: 15,                    // Base gold value
  usableIn: ["combat", "world"],
  effect: {
    type: "heal",
    target: "single",
    amount: 30
  },
  sprite: "health_potion.png",
  stack: true,                  // Can be stacked in inventory
  maxStack: 99,                 // Maximum stack size
  dropRate: 0.2,                // Generic drop rate
  sellValue: 7                  // Value when selling to shops
}
```

### Equipment Item

```javascript
{
  id: "pixel_sword",
  name: "Pixel Sword",
  description: "A sword made of hardened pixels. Sharp!",
  type: "equipment",
  subType: "weapon",
  equipSlot: "MAIN_HAND",
  rarity: "rare",
  value: 120,
  stats: {
    strength: 5,
    attack: 12,
    critChance: 10
  },
  effects: [
    {
      type: "damage",
      element: "physical",
      value: 10
    },
    {
      type: "skill_unlock",
      skillId: "pixel_slash"
    }
  ],
  requirements: {
    level: 5,
    strength: 7
  },
  durability: {
    current: 100,
    max: 100,
    loseOnHit: 1
  },
  sprite: "pixel_sword.png",
  stack: false,
  dropRate: 0.05,
  sellValue: 60
}
```

### Relic

```javascript
{
  id: "glitch_stick",
  name: "Glitch Stick",
  description: "A mysterious USB stick that contains... something.",
  type: "relic",
  sprite: "glitch_stick.png",
  maxLevel: 6,
  levels: [
    {
      level: 1,
      name: "Reality Guide",
      description: "+1 to all stats, summon your guide to give you a hint about what to do next",
      furyRequired: 200,
      statBonus: { all: 1 },
      abilities: [
        { 
          id: "summon_guide", 
          name: "Summon Guide", 
          type: "utility",
          mpCost: 5,
          cooldown: 0,
          description: "Summon the guide to provide hints about your current objective."
        }
      ]
    },
    {
      level: 2,
      name: "Basic Shop Access",
      description: "+2 to all stats, summon your guide who will let you access a shop to buy and sell consumable items",
      furyRequired: 300,
      statBonus: { all: 2 },
      abilities: [
        { 
          id: "summon_shop", 
          name: "Summon Shop", 
          type: "utility",
          mpCost: 10,
          cooldown: 30,
          description: "Summon the guide who will let you access a shop to buy and sell consumable items."
        }
      ]
    },
    // Levels 3-6...
  ],
  masterBonus: {
    description: "All abilities from this relic remain available even when unequipped.",
    unlockFeature: "advanced_abilities"
  }
}
```

### Relic Instance (Character-specific)

```javascript
{
  id: "glitch_stick",
  level: 2,
  fury: 150,
  furyToNextLevel: 300,
  unlocked: true,
  equippedSlot: "RELIC_1",
  discoveredAt: 1714492800000,
  abilities: [
    { id: "summon_guide", unlocked: true },
    { id: "summon_shop", unlocked: true }
  ]
}
```

## World Data

### Area Definition

```javascript
{
  id: "arcade1",
  name: "Arcade One",
  description: "The first area of the digital arcade. Neon lights flicker as data streams through the floor.",
  type: "dungeon",               // "dungeon" or "surface"
  mapData: {
    width: 30,
    height: 20,
    collisionMap: {              // Tiles that cannot be walked on
      "0,0": true,
      "0,1": true,
      // Additional collision tiles...
    },
    backgroundImage: "arcade_floor.png",
    backgroundLayers: [
      { image: "arcade_floor.png", z: 0, parallax: 1.0 },
      { image: "arcade_glow.png", z: 1, parallax: 0.8 }
    ],
    foregroundLayers: [
      { image: "arcade_ceiling.png", z: 10, parallax: 1.2 }
    ]
  },
  npcs: [
    {
      id: "glitch_guide",
      x: 15,
      y: 10,
      direction: "down",
      behavior: "stationary"
    },
    {
      id: "arcade_keeper",
      x: 5,
      y: 8,
      direction: "right",
      behavior: "patrol",
      patrolPoints: [
        { x: 5, y: 8 },
        { x: 10, y: 8 },
        { x: 10, y: 12 },
        { x: 5, y: 12 }
      ]
    }
  ],
  enemies: {
    spawnPoints: [
      { x: 20, y: 15, radius: 3 },
      { x: 8, y: 18, radius: 2 }
    ],
    types: ["byte_bug", "pixel_pirate"],
    spawnRate: 0.3,              // Spawn chance per step
    maxEnemies: 5                // Maximum enemies at once
  },
  objects: [
    { 
      id: "arcade_machine_1", 
      type: "mini_game", 
      x: 5, 
      y: 10, 
      interaction: {
        type: "mini_game",
        miniGameId: "space_invaders",
        dialogueBefore: "dialogue_arcade_machine_1",
        requireItem: { itemId: "arcade_token", consume: true }
      }
    },
    { 
      id: "treasure_chest_1", 
      type: "container", 
      x: 20, 
      y: 15,
      interaction: {
        type: "container",
        lootTable: "arcade_treasures",
        once: true,
        requireKey: false
      }
    }
  ],
  transitions: [
    { 
      x: 0, 
      y: 10, 
      width: 1,
      height: 3,
      targetArea: "arcade2", 
      targetX: 29, 
      targetY: 10,
      direction: "left",
      requirements: {
        items: ["arcade_keycard"],
        quests: ["find_glitch_stick"],
        level: 3
      }
    }
  ],
  music: {
    main: "arcade_theme.mp3",
    battle: "arcade_battle.mp3",
    danger: "arcade_danger.mp3"
  },
  ambientSounds: ["arcade_beeps.mp3", "distant_voices.mp3"],
  lighting: {
    base: "dim",
    sources: [
      { x: 15, y: 15, radius: 5, color: "#00ffff", intensity: 0.8 },
      { x: 5, y: 10, radius: 3, color: "#ff00ff", intensity: 0.6 }
    ]
  },
  discoveryRequirements: {       // Requirements to unlock this area
    items: [],
    quests: [],
    areas: []
  }
}
```

### NPC Definition

```javascript
{
  id: "glitch_guide",
  name: "Glitch Guide",
  description: "A mysterious digital entity that seems to know more than they let on.",
  sprite: "glitch_guide.png",
  animations: {
    idle: { frames: [0, 1, 2, 3, 4, 5, 6, 7], frameRate: 8 },
    talk: { frames: [8, 9, 10, 11], frameRate: 6 }
  },
  dialogue: {
    default: "dialogue_glitch_guide_default",
    conditional: [
      { 
        condition: { questCompleted: "find_relic" }, 
        dialogueId: "dialogue_glitch_guide_after_relic" 
      },
      {
        condition: { itemInInventory: "debug_key" },
        dialogueId: "dialogue_glitch_guide_debug_key"
      }
    ]
  },
  quests: ["find_relic", "debug_dungeon"],
  shop: "guide_shop",
  behavior: "stationary",
  interactionRadius: 2,
  schedules: [                  // Optional time-based movement/behavior
    {
      time: "day",
      location: { areaId: "arcade1", x: 15, y: 10 },
      behavior: "stationary"
    },
    {
      time: "night",
      location: { areaId: "arcade_basement", x: 5, y: 5 },
      behavior: "patrol"
    }
  ]
}
```

## Quest Data

### Quest Definition

```javascript
{
  id: "find_relic",
  title: "Find the Glitch Stick",
  description: "Locate the mysterious Glitch Stick in the Arcade Basement.",
  type: "main",                   // "main", "side", "repeatable"
  giver: "glitch",                // Always Glitch
  giverDialogue: {
    start: "dialogue_find_relic_start",
    progress: "dialogue_find_relic_progress",
    complete: "dialogue_find_relic_complete",
    memoryFragment: "memory_fragment_relic"  // Memory fragment unlocked by quest
  },
  objectives: [
    { 
      id: "explore_arcade_basement",
      type: "explore", 
      areaId: "arcade_basement",
      description: "Explore the Arcade Basement",
      glitchMemory: "memory_arcade_basement"  // Memory triggered by objective
    },
    { 
      id: "interact_glitch_pedestal",
      type: "interact", 
      objectId: "glitch_stick_pedestal",
      description: "Examine the strange pedestal",
      glitchMemory: "memory_pedestal"
    },
    { 
      id: "collect_glitch_stick",
      type: "collect", 
      itemId: "glitch_stick", 
      count: 1,
      description: "Obtain the Glitch Stick",
      glitchMemory: "memory_stick_collection"
    }
  ],
  rewards: [
    { type: "item", itemId: "healing_potion", count: 3 },
    { type: "experience", amount: 100 },
    { type: "currency", amount: 50 },
    { type: "relic", relicId: "glitch_stick" },
    { type: "memory", memoryId: "glitch_memory_relic" }  // Memory fragment reward
  ],
  requiredLevel: 1,
  prerequisiteQuests: [],
  followupQuests: ["power_up_stick"],
  storylineRequirements: {
    chapter: 1,
    scene: 2,
    glitchMemoryLevel: 1  // Required Glitch memory level
  },
  expireConditions: {},         // Conditions under which quest expires
  failConditions: {}            // Conditions under which quest fails
}
```

## Mini-Game Data

### Mini-Game Definition

```javascript
{
  id: "space_invaders",
  name: "Space Invaders",
  description: "Defend against waves of alien invaders!",
  type: "arcade",                 // "arcade", "puzzle", "strategy"
  difficulty: "medium",
  instructions: "Use arrow keys to move, space to shoot. Defeat all enemies before they reach the bottom of the screen.",
  rewards: {
    currency: { min: 10, max: 50 },
    experience: { min: 20, max: 100 },
    items: [
      { itemId: "space_token", chance: 0.5, count: { min: 1, max: 3 } }
    ],
    highScoreRewards: [
      { score: 1000, itemId: "space_helmet" },
      { score: 5000, itemId: "alien_blaster" }
    ]
  },
  statInfluence: {
    dexterity: {
      attribute: "playerSpeed",
      formula: "base + (stat * 0.05)"
    },
    intelligence: {
      attribute: "shotCooldown",
      formula: "base - (stat * 0.02)"
    }
  },
  progressionUnlocks: {
    level: 3000,                 // Score needed to advance story
    items: [
      { score: 2000, itemId: "space_fragment" }
    ]
  },
  config: {
    // Game-specific configuration
    playerSpeed: 5,
    enemySpeed: 2,
    shotSpeed: 8,
    maxLives: 3,
    waveCount: 5
  }
}
```

## Surface World Data

### Resource Definition

```javascript
{
  id: "metal_scrap",
  name: "Metal Scrap",
  description: "Salvaged metal parts that can be used for building and upgrades.",
  type: "material",               // "material", "currency", "food", "energy"
  tier: 1,                        // Resource tier/quality
  baseValue: 5,                   // Base value in currency
  storageType: "bulk",            // "bulk", "container", "special"
  stackSize: 100,                 // Max amount in one inventory slot
  sources: [
    { type: "gather", rate: 1, workAmount: 5 },
    { type: "salvage", from: "robot_enemy", amount: { min: 1, max: 3 } }
  ],
  usedIn: [
    { type: "upgrade", upgradeIds: ["basic_armor", "metal_sword"] },
    { type: "building", buildingIds: ["workshop", "barricade"] }
  ],
  sprite: "metal_scrap.png"
}
```

### Building Definition

```javascript
{
  id: "workshop",
  name: "Workshop",
  description: "A place to upgrade weapons, armor, and tools.",
  type: "production",             // "production", "defense", "housing", "special"
  tier: 1,
  size: { width: 2, height: 2 },
  buildCosts: [
    { resourceId: "metal_scrap", amount: 50 },
    { resourceId: "wood", amount: 30 }
  ],
  buildTime: 300,                 // Time in seconds to complete
  workerCapacity: 2,              // Number of citizens that can work here
  production: {
    recipes: ["basic_armor", "metal_sword", "healing_potion"],
    baseRate: 0.5,                // Base production rate
    workerBonus: 0.3              // Production bonus per worker
  },
  upgrades: [
    {
      tier: 2,
      name: "Advanced Workshop",
      buildCosts: [
        { resourceId: "metal_scrap", amount: 100 },
        { resourceId: "electronics", amount: 25 }
      ],
      effects: {
        workerCapacity: 4,
        production: { baseRate: 0.8 }
      }
    }
  ],
  sprite: {
    base: "workshop.png",
    working: "workshop_active.png",
    damaged: "workshop_damaged.png"
  },
  unlockRequirements: {
    research: ["basic_engineering"],
    buildings: ["town_center"]
  }
}
```

### Defense Structure

```javascript
{
  id: "laser_turret",
  name: "Laser Turret",
  description: "Automated defense system that fires at approaching enemies.",
  type: "defense",
  tier: 1,
  size: { width: 1, height: 1 },
  buildCosts: [
    { resourceId: "metal_scrap", amount: 40 },
    { resourceId: "electronics", amount: 15 }
  ],
  buildTime: 180,
  defenseStats: {
    damage: 25,
    range: 5,
    attackSpeed: 1.5,             // Attacks per second
    accuracy: 0.85,
    energyUsage: 5                // Energy per second
  },
  targetPriority: "closest",      // "closest", "strongest", "weakest"
  upgrades: [
    {
      tier: 2,
      name: "Double Laser Turret",
      buildCosts: [
        { resourceId: "metal_scrap", amount: 80 },
        { resourceId: "electronics", amount: 30 }
      ],
      effects: {
        damage: 40,
        attackSpeed: 2.0,
        energyUsage: 8
      }
    }
  ],
  sprite: {
    base: "laser_turret.png",
    firing: "laser_turret_fire.png",
    damaged: "laser_turret_damaged.png"
  },
  unlockRequirements: {
    research: ["basic_defense_systems"],
    buildings: ["power_generator"]
  }
}
```

## System Settings & Configuration

### Game Configuration

```javascript
{
  version: "1.0.0",
  saveVersion: "1.0.0",
  debug: false,
  audioEnabled: true,
  musicVolume: 0.7,
  sfxVolume: 1.0,
  textSpeed: 1.0,                 // Text scroll speed multiplier
  autosaveInterval: 5,            // Minutes between autosaves
  maxSaveSlots: 3,
  difficulty: "normal",           // "easy", "normal", "hard"
  difficultyModifiers: {
    easy: {
      playerDamageMultiplier: 1.2,
      enemyDamageMultiplier: 0.8,
      experienceMultiplier: 1.2
    },
    normal: {
      playerDamageMultiplier: 1.0,
      enemyDamageMultiplier: 1.0,
      experienceMultiplier: 1.0
    },
    hard: {
      playerDamageMultiplier: 0.8,
      enemyDamageMultiplier: 1.2,
      experienceMultiplier: 0.8
    }
  }
}
```

## Conclusion

These data models provide a comprehensive foundation for implementing all the major systems in Glitter Cloud Adventure. The schemas are designed to be flexible enough to handle the game's complex requirements while maintaining clear organization.

As development progresses, these schemas may be refined or extended, but they serve as a solid starting point for implementing the core game systems. The next design document will cover the UI Flow & Screens, which will define the user experience and interface components.

## Character System

### Character Schema
```javascript
{
  id: String,
  name: String,
  type: "player" | "enemy" | "npc",
  role: String,
  background: String,
  appearance: {
    sprite: String,
    portrait: String,
    animations: {
      idle: String,
      attack: String,
      special: String,
      hurt: String
    }
  },
  stats: {
    level: Number,
    experience: Number,
    strength: Number,
    dexterity: Number,
    vitality: Number,
    intelligence: Number,
    luck: Number,
    cosmicAffinity: Number  // New stat for cosmic powers
  },
  abilities: [{
    id: String,
    name: String,
    type: "active" | "passive" | "cosmic",
    description: String,
    cost: {
      type: "mp" | "hp" | "cosmic",
      amount: Number
    },
    effects: [{
      type: String,
      value: Number,
      duration: Number
    }],
    cooldown: Number,
    unlockLevel: Number
  }],
  relationships: [{
    characterId: String,
    level: Number,  // 0-100
    type: "friendship" | "rivalry" | "mentorship" | "cosmic",
    effects: [{
      type: String,
      value: Number
    }]
  }],
  cosmicPowers: [{
    id: String,
    name: String,
    description: String,
    unlocked: Boolean,
    level: Number,
    effects: [{
      type: String,
      value: Number
    }]
  }],
  partyStatus: {
    isInParty: Boolean,
    position: Number,  // 0-3 for active party members
    formation: "front" | "back"
  }
}
```

### Party Schema
```javascript
{
  id: String,
  name: String,
  maxSize: 4,  // Updated from 6 to 4
  members: [{
    characterId: String,
    position: Number,  // 0-3
    formation: "front" | "back"
  }],
  relationships: [{
    character1Id: String,
    character2Id: String,
    level: Number,
    type: String,
    effects: [{
      type: String,
      value: Number
    }]
  }],
  cosmicBalance: {
    harmony: Number,  // 0-100
    chaos: Number,    // 0-100
    stability: Number // 0-100
  },
  formationBonuses: [{
    type: String,
    value: Number,
    requirements: [{
      characterId: String,
      position: Number
    }]
  }]
}
```

### Character Progression
```javascript
{
  characterId: String,
  level: Number,
  experience: Number,
  statPoints: Number,
  skillPoints: Number,
  cosmicPoints: Number,  // New resource for cosmic powers
  unlockedAbilities: [String],
  relationshipProgress: [{
    characterId: String,
    currentLevel: Number,
    nextLevel: Number,
    points: Number
  }],
  cosmicProgression: {
    harmonyLevel: Number,
    chaosLevel: Number,
    stabilityLevel: Number,
    unlockedPowers: [String]
  }
}
```

### Party Management
```javascript
{
  activeParty: {
    id: String,
    members: [String],  // Character IDs
    formation: "standard" | "offensive" | "defensive" | "cosmic",
    bonuses: [{
      type: String,
      value: Number
    }]
  },
  availableCharacters: [String],  // Character IDs
  restPoints: [{
    id: String,
    location: String,
    availableCharacters: [String]
  }],
  partyHistory: [{
    timestamp: Date,
    action: "swap" | "formation" | "rest",
    details: {
      characterIn: String,
      characterOut: String,
      position: Number
    }
  }]
}
```

### Cosmic Power System
```javascript
{
  characterId: String,
  cosmicPowers: [{
    id: String,
    name: String,
    type: "harmony" | "chaos" | "stability",
    level: Number,
    unlocked: Boolean,
    effects: [{
      type: String,
      value: Number,
      duration: Number
    }],
    requirements: {
      harmonyLevel: Number,
      chaosLevel: Number,
      stabilityLevel: Number
    }
  }],
  cosmicBalance: {
    harmony: Number,
    chaos: Number,
    stability: Number
  },
  cosmicCombos: [{
    id: String,
    name: String,
    characters: [String],
    effects: [{
      type: String,
      value: Number
    }],
    requirements: {
      relationshipLevel: Number,
      cosmicBalance: {
        harmony: Number,
        chaos: Number,
        stability: Number
      }
    }
  }]
}
```
