# Glitter Cloud Adventure: Character Classes and Progression

## Table of Contents
1. [Progression System Overview](#progression-system-overview)
2. [Base Stats and Attributes](#base-stats-and-attributes)
3. [Leveling Mechanics](#leveling-mechanics)
4. [Class Descriptions](#class-descriptions)
   - [Flexecutioner](#flexecutioner)
   - [Rizzler](#rizzler)
   - [Sus-Assassin](#sus-assassin)
   - [Influmancer](#influmancer)
5. [Skill Acquisition and Mastery](#skill-acquisition-and-mastery)
6. [Class-Specific Quests](#class-specific-quests)
7. [Prestige System](#prestige-system)
8. [Party Composition Bonuses](#party-composition-bonuses)

## Progression System Overview

Character progression in Glitter Cloud Adventure follows a balanced approach of automatic stat increases, skill unlocks, and gear enhancement. Each character class has a unique progression path tailored to their role in the party.

### Core Progression Elements

- **Level System**: Characters gain XP from battles, quests, and exploration
- **Automatic Skill Unlocks**: New abilities unlock at predetermined levels
- **Skill Mastery**: Skills improve with use, granting reduced MP costs and increased power
- **Equipment Enhancement**: Gear can be upgraded to provide additional stat bonuses
- **Relic Synergy**: Special bonuses for collecting and equipping complementary relics
- **Class-Specific Quests**: Unique quests that unlock additional abilities and customization options

## Base Stats and Attributes

All characters possess six core attributes that determine their effectiveness in combat and exploration:

| Attribute | Description | Primary Benefit |
|-----------|-------------|-----------------|
| Strength (STR) | Physical power | Physical damage, carrying capacity |
| Dexterity (DEX) | Agility and accuracy | Hit chance, dodge rate, critical chance |
| Vitality (VIT) | Physical endurance | HP, physical defense, status resistance |
| Intelligence (INT) | Mental acuity | Magical damage, puzzle-solving ability |
| Charisma (CHA) | Social influence | Status effect chances, merchant prices |
| Fortune (FTN) | Luck and fate | Item drop rates, critical damage |

### Stat Distribution by Class

```
┌──────────────────┬───────────────────────────┬───────────────────────────┐
│ Class/Type      │ Primary Stats            │ Secondary Stats          │
├──────────────────┼───────────────────────────┼───────────────────────────┤
│ Flexecutioner   │ Strength, Vitality       │ Dexterity, Charisma      │
│ Influmancer     │ Intelligence, Charisma   │ Fortune, Magic           │
│ Sus-Assassin    │ Dexterity, Fortune       │ Speed, Charisma          │
│ Rizzler         │ Charisma, Magic          │ Intelligence, Speed      │
└──────────────────┴───────────────────────────┴───────────────────────────┘
```

### Base Stats (Level 1)

| Class | HP | MP | STR | VIT | DEX | INT | CHA | FTN |
|-------|----|----|-----|-----|-----|-----|-----|-----|
| Flexecutioner | 120 | 50 | 12 | 10 | 7 | 5 | 6 | 5 |
| Rizzler | 80 | 90 | 5 | 6 | 8 | 10 | 12 | 7 |
| Sus-Assassin | 90 | 70 | 8 | 7 | 12 | 6 | 9 | 10 |
| Influmancer | 85 | 95 | 4 | 6 | 7 | 12 | 10 | 9 |

## Leveling Mechanics

### Experience Points (XP)
- **XP Gain**: Acquired from battles, quests, and exploration
  - Base XP per enemy: `baseXP = enemyLevel * 10`
  - Bonus XP for first-time encounters: +20%
  - Quest completion: 50-500 XP based on difficulty
  - Exploration discoveries: 10-100 XP

- **XP Requirements**: The XP required for the next level follows an exponential curve:
  - `XP_required = 100 * (1.5^(currentLevel - 1))`

### Level-Up Process

When a character gains enough XP to level up:

1. **Stat Increases**: Automatic stat increases based on class specialization
2. **Skill Unlocks**: New skills automatically unlock at predetermined levels
3. **Level-Up Animation**: Golden particle effect with a triumphant sound
4. **Notification**: A popup displays newly acquired skills and stat increases

### Stat Increases (per level)

- **HP**: `10 + (vitality * 0.5)`
- **MP**: `5 + (intelligence * 0.3)`
- **Attack**: `1 + (strength * 0.1)`
- **Defense**: `1 + (vitality * 0.1)`
- **Speed**: `0.5 + (dexterity * 0.05)`

### Primary Stat Growth Rates (per level)

| Class | STR | VIT | DEX | INT | CHA | FTN |
|-------|-----|-----|-----|-----|-----|-----|
| Flexecutioner | 1.2 | 1.0 | 0.7 | 0.4 | 0.6 | 0.5 |
| Rizzler | 0.4 | 0.6 | 0.8 | 1.0 | 1.2 | 0.7 |
| Sus-Assassin | 0.8 | 0.7 | 1.2 | 0.5 | 0.8 | 1.0 |
| Influmancer | 0.3 | 0.5 | 0.7 | 1.2 | 1.0 | 0.9 |

## Class Descriptions

### Flexecutioner

**Class Concept**: Gym-obsessed tank and physical damage dealer who uses workout-themed abilities.

**Background**: Flexecutioners are digital entities who have become obsessed with physical optimization. They have discovered that even in a digital world, the appearance of physical strength can translate to actual power.

**Role in Party**: Front-line tank with high damage potential. The Flexecutioner excels at taking hits and dealing massive damage in short bursts.

**Playstyle**: Flexecutioners use their high HP and strength to absorb damage for the party while dealing powerful physical attacks. They can temporarily boost party members' physical attributes and provide defensive support.

**Starting Equipment**:
- Beginner's Dumbbell Set (Weapon)
- Sweaty Headband (Helm)
- Gym Tank Top (Armor)
- Protein Shaker (Accessory)

**Strengths**:
- Highest HP and physical defense
- Strong single-target and AoE damage
- Excellent party support and tanking abilities

**Weaknesses**:
- Lower speed and dodge chance
- Some abilities have HP costs
- Reliant on MP management for sustained performance

**Skill Tree Highlights**:
- **Beginner Path**: Focus on basic damage and survivability
- **Protein Path**: Enhances self-buffs and HP regeneration
- **Spotter Path**: Emphasizes party protection and taunt abilities
- **Ultimate Gains Path**: Unlocks devastating attacks with self-sacrifice mechanics

### Rizzler

**Class Concept**: Charismatic support and healer who uses charm and social influence as power sources.

**Background**: Rizzlers emerged from social networking algorithms, evolving to harness emotional connections and charm as a form of digital energy.

**Role in Party**: Primary healer and support with strong crowd control capabilities.

**Playstyle**: Rizzlers focus on keeping the party alive through healing, buffing, and removing status effects. They can also charm enemies and provide utility through various supportive abilities.

**Starting Equipment**:
- Golden Microphone (Weapon)
- Designer Shades (Helm)
- Stylish Jacket (Armor)
- Friendship Bracelet (Accessory)

**Strengths**:
- Excellent party support and healing
- Strong crowd control with charm effects
- Versatile buffs and debuffs

**Weaknesses**:
- Lower personal damage output
- MP-hungry abilities
- Reliant on positioning and team composition

**Skill Tree Highlights**:
- **Charm Path**: Focus on enemy control and manipulation
- **Support Path**: Enhances healing and protective abilities
- **Inspiration Path**: Emphasizes party-wide buffs and aura effects
- **Ultimate Rizz Path**: Unlocks game-changing support abilities and resurrection

### Sus-Assassin

**Class Concept**: Stealthy damage dealer who uses misdirection and surprise attacks.

**Background**: Sus-Assassins evolved from anti-cheat algorithms and security protocols, learning to exploit the very systems they were designed to protect.

**Role in Party**: Primary single-target damage dealer with high burst potential.

**Playstyle**: Sus-Assassins rely on stealth and positioning to deal massive damage from the shadows. They excel at eliminating high-priority targets quickly and can apply deadly status effects.

**Starting Equipment**:
- Starter Daggers (Weapon)
- Suspicious Mask (Helm)
- Stealth Suit (Armor)
- Lockpick Set (Accessory)

**Strengths**:
- Highest critical hit rate and damage
- Excellent mobility and evasion
- Strong status effect application

**Weaknesses**:
- Lower HP and defense
- Vulnerable when not in stealth
- Limited AoE capabilities early game

**Skill Tree Highlights**:
- **Stealth Path**: Focus on evasion and stealth mechanics
- **Poison Path**: Enhances status effect application and damage over time
- **Critical Path**: Emphasizes critical hit chance and damage
- **Ultimate Deception Path**: Unlocks game-changing assassination abilities

### Influmancer

**Class Concept**: Reality-bending caster who manipulates perception and digital physics.

**Background**: Influmancers emerged from content recommendation algorithms, learning to bend reality by controlling what others perceive as truth.

**Role in Party**: Versatile caster with strong debuffs and reality manipulation.

**Playstyle**: Influmancers control the battlefield through powerful magical attacks and debuffs. They can manipulate reality itself, bending the rules of combat to their advantage.

**Starting Equipment**:
- Trending Topic Wand (Weapon)
- Viral Crown (Helm)
- Algorithm Robe (Armor)
- Engagement Ring (Accessory)

**Strengths**:
- Powerful AoE magical damage
- Strong debuff application
- Unique reality manipulation abilities

**Weaknesses**:
- Lower physical defense
- Complex ability interactions
- Some abilities have delayed effects

**Skill Tree Highlights**:
- **Viral Path**: Focus on spreading status effects and AoE damage
- **Reality Path**: Enhances reality manipulation and rule-bending abilities
- **Trend Path**: Emphasizes momentum-based abilities that grow stronger
- **Ultimate Influence Path**: Unlocks reality-shattering abilities

## Skill Acquisition and Mastery

### Skill Unlock System

Skills are automatically unlocked at specific levels with no manual allocation required. This allows players to focus on mastering their abilities rather than worrying about build optimization.

### Skill Mastery System

- **Usage Bonuses**: Skills improve with use
  - Every 10 uses: -1 MP cost (min 1)
  - Every 25 uses: +5% power
  - Every 50 uses: -1 turn cooldown (min 0)

- **Mastery Rewards**:
  - 100 uses: Unlock special visual effect
  - 250 uses: Unlock enhanced version of skill

### Enhanced Skills

When a skill reaches 250 uses, it evolves into an enhanced version with additional effects:

**Example Enhanced Skills:**

| Base Skill | Enhanced Version | Additional Effect |
|------------|------------------|------------------|
| Power Strike | Devastating Strike | +10% critical chance, inflicts Weakness (-10% STR) |
| Group Hug | Group Embrace | Adds small shield (10% max HP) to all healed allies |
| Backstab | Shadowsever | Inflicts Bleed (8% max HP over 3 turns) |
| Clickbait Bolt | Viral Clickbait | Bounces to a second target at 50% damage |

## Class-Specific Quests

Each character class has unique quest lines that unlock additional abilities, customization options, and lore. These quests begin at level 10 and continue throughout the game.

### Flexecutioner Quests

1. **Protein Protocol** (Level 10)
   - **Quest**: Defeat the Protein Bandit in the Great Firewall
   - **Reward**: Unlocks Protein Shake recipe crafting
   - **Requirements**: Defeat 10 enemies using Power Strike

2. **Iron Temple Challenge** (Level 25)
   - **Quest**: Complete the Iron Temple dungeon with no healing items
   - **Reward**: Unlocks Hypertrophy passive skill early
   - **Requirements**: Reach level 25, complete Protein Protocol

3. **Ultimate Gains Program** (Level 40)
   - **Quest**: Defeat a boss while having 3+ buffs active
   - **Reward**: Unlocks alternate color scheme, "Failure Training" passive
   - **Requirements**: Reach level 40, complete Iron Temple Challenge

4. **One Rep Max Challenge** (Level 60)
   - **Quest**: Defeat The Infinite with a finishing blow of 9999+ damage
   - **Reward**: Unlocks "Super Saiyan Mode" early, unique title "Absolute Unit"
   - **Requirements**: Reach level 60, complete Ultimate Gains Program

### Rizzler Quests

1. **Charisma Check** (Level 10)
   - **Quest**: Successfully charm 15 different enemy types
   - **Reward**: Unlocks "Smolder+" passive (charm chance +10%)
   - **Requirements**: Successfully charm 5 enemies

2. **Friend Collection** (Level 25)
   - **Quest**: Recruit 5 NPCs to the Digital Dawn hub
   - **Reward**: Unlocks "Group Hug+" with extended effect duration
   - **Requirements**: Reach level 25, complete Charisma Check

3. **Ultimate Wingman** (Level 40)
   - **Quest**: Complete 10 side quests for NPCs
   - **Reward**: Unlocks alternate outfit, "Hype Man" skill early
   - **Requirements**: Reach level 40, complete Friend Collection

4. **Rizz Legend** (Level 60)
   - **Quest**: Charm a boss for the maximum duration possible
   - **Reward**: Unlocks "Ultimate Rizz" early, unique title "Heart Hacker"
   - **Requirements**: Reach level 60, complete Ultimate Wingman

### Sus-Assassin Quests

1. **First Blood** (Level 10)
   - **Quest**: Land 20 critical hits from stealth
   - **Reward**: Unlocks "Shadow Step" ability (teleport behind target)
   - **Requirements**: Land 10 critical hits

2. **Ghost Protocol** (Level 25)
   - **Quest**: Complete the Network Nexus without being detected
   - **Reward**: Unlocks "Ghost Mode+" with extended duration
   - **Requirements**: Reach level 25, complete First Blood

3. **Master of Shadows** (Level 40)
   - **Quest**: Defeat 3 bosses while maintaining stealth
   - **Reward**: Unlocks alternate weapon appearance, "Silent But Deadly" early
   - **Requirements**: Reach level 40, complete Ghost Protocol

4. **Digital Assassin** (Level 60)
   - **Quest**: Defeat a boss without being hit
   - **Reward**: Unlocks "Final Cut" early, unique title "Shadow Reaper"
   - **Requirements**: Reach level 60, complete Master of Shadows

### Influmancer Quests

1. **Trending Topic** (Level 10)
   - **Quest**: Apply 5 different status effects in a single battle
   - **Reward**: Unlocks "Trending+" passive (status effects last 1 turn longer)
   - **Requirements**: Apply 20 status effects to enemies

2. **Reality Distortion** (Level 25)
   - **Quest**: Complete the Digital Dreamscape while confused
   - **Reward**: Unlocks "Rewind Button+" with reduced cooldown
   - **Requirements**: Reach level 25, complete Trending Topic

3. **Viral Sensation** (Level 40)
   - **Quest**: Have 5 enemies affected by the same status effect simultaneously
   - **Reward**: Unlocks alternate spell effects, "Clout Chaser" early
   - **Requirements**: Reach level 40, complete Reality Distortion

4. **Reality Breaker** (Level 60)
   - **Quest**: Use "Retcon" to reverse a party wipe and win the battle
   - **Reward**: Unlocks "Going Viral" early, unique title "Reality Architect"
   - **Requirements**: Reach level 60, complete Viral Sensation

## Prestige System

Upon reaching level 80, characters can prestige and reset to level 1, keeping all their skills and gaining the following benefits:

1. **Prestige Aura**: Visual effect showing prestige level
2. **Stat Retention**: 10% of previous max level stats are retained
3. **Skill Mastery**: All skill masteries are retained
4. **Prestige Talent**: One unique passive ability is unlocked:
   - **Flexecutioner**: "Limitless Gains" - STR and VIT grow 15% faster
   - **Rizzler**: "Endless Charisma" - All heals have 10% chance to be critical (2x effect)
   - **Sus-Assassin**: "Perfect Precision" - 5% chance for attacks to ignore target defense
   - **Influmancer**: "Reality Administrator" - All spells have 15% chance to cost 0 MP

## Party Composition Bonuses

When certain combinations of classes are used together, party-wide bonuses are activated:

| Composition | Classes | Party Bonus |
|-------------|---------|-------------|
| Gym Buddies | 2+ Flexecutioners | +15% max HP for all party members |
| Social Circle | 2+ Rizzlers | +20% status effect duration |
| Shadow Cabal | 2+ Sus-Assassins | +10% critical hit chance |
| Echo Chamber | 2+ Influmancers | +25% magical damage |
| Balanced Party | 1 of each class | +5% to all stats |
| Frontline Duo | Flexecutioner + Sus-Assassin | Physical attacks deal +10% damage |
| Support Team | Rizzler + Influmancer | Healing and buffs +15% effectiveness |
| Odd Couple | Flexecutioner + Influmancer | Both physical and magical defense +10% |
| Ultimate Wingman | Rizzler + Sus-Assassin | +20% effectiveness against bosses |
