// Enemy data definitions
const enemies = {
  // Basic enemies
  slime: {
    name: 'Slime',
    type: 'normal',
    level: 1,
    stats: {
      strength: 8,
      dexterity: 6,
      vitality: 12,
      intelligence: 4,
      luck: 5,
      charisma: 3,
      fortune: 4,
      speed: 5
    },
    hp: 50,
    maxHp: 50,
    mp: 10,
    maxMp: 10,
    xpValue: 20,
    goldValue: 10,
    behavior: 'aggressive',
    skills: [
      {
        id: 'slime_tackle',
        name: 'Tackle',
        mpCost: 5,
        cooldown: 2000,
        damage: 15,
        damageType: 'physical'
      }
    ],
    weaknesses: ['fire'],
    resistances: ['water']
  },

  bat: {
    name: 'Bat',
    type: 'flying',
    level: 2,
    stats: {
      strength: 6,
      dexterity: 12,
      vitality: 8,
      intelligence: 6,
      luck: 8,
      charisma: 4,
      fortune: 6,
      speed: 14
    },
    hp: 40,
    maxHp: 40,
    mp: 15,
    maxMp: 15,
    xpValue: 30,
    goldValue: 15,
    behavior: 'balanced',
    skills: [
      {
        id: 'bat_swoop',
        name: 'Swoop',
        mpCost: 8,
        cooldown: 3000,
        damage: 20,
        damageType: 'physical'
      },
      {
        id: 'bat_screech',
        name: 'Screech',
        mpCost: 12,
        cooldown: 5000,
        effect: 'blind',
        duration: 2
      }
    ],
    weaknesses: ['lightning'],
    resistances: ['dark']
  },

  skeleton: {
    name: 'Skeleton',
    type: 'undead',
    level: 3,
    stats: {
      strength: 10,
      dexterity: 8,
      vitality: 15,
      intelligence: 6,
      luck: 4,
      charisma: 2,
      fortune: 3,
      speed: 7
    },
    hp: 70,
    maxHp: 70,
    mp: 20,
    maxMp: 20,
    xpValue: 40,
    goldValue: 25,
    behavior: 'aggressive',
    skills: [
      {
        id: 'skeleton_bash',
        name: 'Bone Bash',
        mpCost: 10,
        cooldown: 2500,
        damage: 25,
        damageType: 'physical'
      },
      {
        id: 'skeleton_curse',
        name: 'Curse',
        mpCost: 15,
        cooldown: 4000,
        effect: 'poison',
        duration: 3
      }
    ],
    weaknesses: ['holy'],
    resistances: ['dark', 'poison']
  },

  // Boss enemies
  slime_king: {
    name: 'Slime King',
    type: 'boss',
    level: 5,
    stats: {
      strength: 15,
      dexterity: 10,
      vitality: 20,
      intelligence: 12,
      luck: 8,
      charisma: 10,
      fortune: 8,
      speed: 8
    },
    hp: 200,
    maxHp: 200,
    mp: 50,
    maxMp: 50,
    xpValue: 100,
    goldValue: 100,
    behavior: 'balanced',
    skills: [
      {
        id: 'slime_king_slam',
        name: 'Royal Slam',
        mpCost: 20,
        cooldown: 4000,
        damage: 40,
        damageType: 'physical'
      },
      {
        id: 'slime_king_split',
        name: 'Split',
        mpCost: 30,
        cooldown: 8000,
        effect: 'summon',
        duration: 1,
        summonType: 'slime'
      },
      {
        id: 'slime_king_heal',
        name: 'Royal Recovery',
        mpCost: 25,
        cooldown: 6000,
        healing: 50
      }
    ],
    weaknesses: ['fire'],
    resistances: ['water', 'poison']
  }
};

export default enemies; 