# Combat Data Model

## Overview
This document defines the data structures and relationships for the combat system, including achievements and rewards.

## Core Interfaces

### Entity Interface
```typescript
interface Entity {
    id: string;
    name: string;
    level: number;
    stats: Stats;
    abilities: Ability[];
    statusEffects: StatusEffect[];
    typeEffects: TypeEffectiveness;
    achievements: Achievement[];
    typeMastery: Record<string, number>;
}
```

### Player Interface
```typescript
interface Player extends Entity {
    inventory: Item[];
    equipment: Equipment;
    quests: Quest[];
    achievements: Achievement[];
    experience: number;
    gold: number;
    discoveredTypes: string[];
    typeMastery: Record<string, number>;
    skillUsage: Record<string, number>;
    combatStats: CombatStats;
    achievementPoints: number;
}
```

### Enemy Interface
```typescript
interface Enemy extends Entity {
    type: string;
    abilities: Ability[];
    drops: Drop[];
    rewards: CombatRewards;
    discovered: boolean;
    killCount: number;
    typeEffects: TypeEffectiveness;
    achievementTriggers: AchievementTrigger[];
}
```

### Achievement Interface
```typescript
interface Achievement {
    id: string;
    name: string;
    description: string;
    category: AchievementCategory;
    type: AchievementType;
    milestones: AchievementMilestone[];
    rewards: AchievementReward[];
    progress: number;
    completed: boolean;
    points: number;
}

interface AchievementMilestone {
    requirement: number;
    reward: AchievementReward;
    completed: boolean;
}

interface AchievementReward {
    type: RewardType;
    value: number | string;
    item?: Item;
    ability?: Ability;
    passive?: Passive;
}

interface AchievementTrigger {
    type: TriggerType;
    condition: TriggerCondition;
    achievementId: string;
    progress: number;
}
```

### CombatState Interface
```typescript
interface CombatState {
    activeEnemies: Enemy[];
    playerParty: Player[];
    currentTurn: number;
    rewards: CombatRewards;
    typeAdvantages: TypeAdvantage[];
    achievements: Achievement[];
    skillUsage: Record<string, number>;
    criticalHits: number;
    statusEffects: StatusEffect[];
    comboCount: number;
}
```

### TypeEffectiveness Interface
```typescript
interface TypeEffectiveness {
    type: string;
    advantages: string[];
    disadvantages: string[];
    resistances: string[];
    effectiveness: number;
    mastery: number;
    achievements: Achievement[];
}
```

### Ability Interface
```typescript
interface Ability {
    id: string;
    name: string;
    type: string;
    damage: number;
    cooldown: number;
    effects: Effect[];
    requirements: Requirement[];
    achievements: Achievement[];
    usageCount: number;
    criticalHits: number;
    statusEffects: StatusEffect[];
}
```

## Data Flow

### Achievement Tracking
1. **Combat Achievements**
   ```typescript
   // Track monster kills
   function trackMonsterKill(enemy: Enemy, player: Player) {
       // Update kill count
       enemy.killCount++;
       
       // Check type-specific achievements
       checkTypeAchievements(enemy.type, player);
       
       // Check skill usage achievements
       checkSkillAchievements(player);
       
       // Update combat stats
       updateCombatStats(player);
       
       // Award rewards
       awardAchievementRewards(player);
   }
   ```

2. **Skill Usage Tracking**
   ```typescript
   // Track skill usage
   function trackSkillUse(ability: Ability, player: Player) {
       // Update usage count
       ability.usageCount++;
       player.skillUsage[ability.id] = (player.skillUsage[ability.id] || 0) + 1;
       
       // Check skill achievements
       checkSkillAchievements(ability, player);
       
       // Update type mastery
       updateTypeMastery(ability.type, player);
       
       // Award rewards
       awardSkillRewards(ability, player);
   }
   ```

3. **Type Mastery Tracking**
   ```typescript
   // Track type mastery
   function trackTypeMastery(type: string, player: Player) {
       // Update mastery level
       player.typeMastery[type] = (player.typeMastery[type] || 0) + 1;
       
       // Check type achievements
       checkTypeAchievements(type, player);
       
       // Update effectiveness
       updateTypeEffectiveness(type, player);
       
       // Award rewards
       awardTypeRewards(type, player);
   }
   ```

### Reward Distribution
1. **Achievement Rewards**
   ```typescript
   // Award achievement rewards
   function awardAchievementRewards(achievement: Achievement, player: Player) {
       // Award gold
       player.gold += achievement.rewards.gold;
       
       // Award items
       achievement.rewards.items.forEach(item => {
           player.inventory.push(item);
       });
       
       // Award abilities
       achievement.rewards.abilities.forEach(ability => {
           player.abilities.push(ability);
       });
       
       // Award passives
       achievement.rewards.passives.forEach(passive => {
           player.passives.push(passive);
       });
       
       // Update achievement points
       player.achievementPoints += achievement.points;
   }
   ```

2. **Combat Rewards**
   ```typescript
   // Award combat rewards
   function awardCombatRewards(combatState: CombatState, player: Player) {
       // Award experience
       player.experience += combatState.rewards.experience;
       
       // Award gold
       player.gold += combatState.rewards.gold;
       
       // Award items
       combatState.rewards.items.forEach(item => {
           player.inventory.push(item);
       });
       
       // Check combat achievements
       checkCombatAchievements(combatState, player);
       
       // Update combat stats
       updateCombatStats(player);
   }
   ```

## Recent Changes

### Achievement System Integration
1. **Data Structure**
   - Added achievement tracking
   - Added reward system
   - Added type mastery
   - Added skill usage tracking

2. **Combat Integration**
   - Added achievement triggers
   - Added reward distribution
   - Added type effectiveness
   - Added skill tracking

3. **Type System Integration**
   - Added type mastery tracking
   - Added type achievements
   - Added type rewards
   - Added effectiveness calculation

### Universal Enemy Types
- Added type-specific achievements
- Added type mastery system
- Added type rewards
- Added type effectiveness tracking

## Core Components

### Base Interfaces
```typescript
interface Entity {
    id: string;
    name: string;
    level: number;
    stats: {
        hp: number;
        mp: number;
        atk: number;
        def: number;
        spd: number;
        mat: number;
        mdf: number;
    };
}

interface Player extends Entity {
    class: string;
    experience: number;
    equipment: Equipment[];
    inventory: Item[];
    abilities: Ability[];
}

interface Item {
    id: string;
    name: string;
    type: 'weapon' | 'armor' | 'accessory' | 'consumable' | 'material';
    stats?: Partial<Entity['stats']>;
    effects?: StatusEffect[];
    value: number;
    description: string;
}

interface StatusEffect {
    id: string;
    name: string;
    type: 'buff' | 'debuff' | 'neutral';
    duration: number;
    effects: {
        stat?: keyof Entity['stats'];
        value: number;
        isPercentage: boolean;
    }[];
}
```

### Enemy Data Structure
```typescript
interface Enemy extends Entity {
    type: 'Beast' | 'Bug' | 'Aquatic' | 'Construct' | 'Mystic';
    discovered: boolean;
    rewards: {
        xp: string;  // Range format: "min-max"
        gold: string; // Range format: "min-max"
    };
    drops: Item[];
    zone: string;
    abilities: Ability[];
    weaknesses: string[];
    resistances: string[];
    typeEffects: {
        strongAgainst: string[];
        weakAgainst: string[];
        resists: string[];
    };
}

interface Ability {
    id: string;
    name: string;
    type: 'physical' | 'magical' | 'status';
    element?: string;
    power: number;
    mpCost: number;
    effects: StatusEffect[];
    targetType: 'single' | 'all' | 'self';
    cooldown?: number;
}
```

### Bestiary System
```typescript
interface BestiaryEntry extends Enemy {
    kills: number;
    image: string;
    achievements: Achievement[];
}

interface Bestiary {
    entries: BestiaryEntry[];
    killCounts: Record<string, number>;
    currentPage: number;
    entriesPerPage: number;
    achievements: Achievement[];
}

interface Achievement {
    id: string;
    name: string;
    description: string;
    type: 'kill_count' | 'discovery' | 'completion';
    requirements: {
        target: string;
        count: number;
    };
    reward: {
        type: string;
        value: any;
    };
    completed: boolean;
}
```

### Combat State
```typescript
interface CombatState {
    activeEnemies: Enemy[];
    playerParty: Player[];
    turnOrder: Entity[];
    currentTurn: number;
    statusEffects: StatusEffect[];
    combatRewards: {
        xp: number;
        gold: number;
        drops: Item[];
        achievements: Achievement[];
    };
    typeEffects: {
        attacker: string;
        defender: string;
        effectiveness: number;
    }[];
}
```

## Data Flow

1. **Enemy Initialization**
   - Enemies are loaded from bestiary markdown files
   - Stats are calculated based on level and type
   - Abilities and drops are assigned
   - Type effects are configured

2. **Combat Processing**
   - Turn order is determined by SPD stats
   - Actions are processed in order
   - Type effectiveness is calculated
   - Status effects are applied
   - Rewards are calculated on enemy defeat

3. **Bestiary Updates**
   - Kill counts are tracked per enemy
   - Discovered status is updated
   - Achievements are checked and awarded
   - Data is persisted in localStorage

## Technical Implementation

### Data Storage
- Enemy data: Markdown files in `docs/Bestiary/`
- Kill counts: Browser localStorage
- Images: `assets/monsters/` directory
- Achievements: Browser localStorage
- Type effects: JSON configuration

### UI Components
- Bestiary book interface
- Monster entry cards
- Navigation system
- Kill count display
- Achievement tracking
- Type effectiveness display

### Integration Points
- Combat system: Records kills and achievements
- Save system: Persists bestiary and achievement data
- UI system: Displays bestiary and type information
- Type system: Manages combat interactions 