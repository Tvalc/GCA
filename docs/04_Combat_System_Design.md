# Glitter Cloud Adventure: Combat System Design

## Combat System Overview

The combat system is implemented using a state machine pattern with the following key features:

### Party Formation
- Maximum of 4 characters in active party
- 2 characters in front row, 2 in back row
- Formation affects combat bonuses and abilities
- Characters can be swapped at designated rest points

### Cosmic Power System
- Each character has a cosmic affinity stat
- Cosmic powers are unlocked through story progression
- Three types of cosmic powers: Harmony, Chaos, Stability
- Cosmic balance affects party-wide bonuses

### Character Relationships
- Relationship levels affect combo effectiveness
- Special cosmic combos available between certain characters
- Relationship bonuses apply to party-wide stats
- Betrayal mechanics affect combat performance

## Combat State Machine

```javascript
GCA.Systems.Dungeon.Combat = (function() {
  // Private state
  let state = {
    inCombat: false,
    currentTurn: 0,
    turnOrder: [],
    participants: {},
    currentActor: null,
    battleLog: [],
    cosmicBalance: {
      harmony: 50,
      chaos: 50,
      stability: 50
    },
    partyRelationships: {},
    activeCombos: []
  };
  
  // Initialize combat with participants
  function startCombat(party, enemies) {
    state.inCombat = true;
    state.turnOrder = [];
    state.battleLog = [];
    
    // Validate party size
    if (party.length > 4) {
      throw new Error("Party size cannot exceed 4 characters");
    }
    
    // Combine all combatants and determine initiative
    const allCombatants = [...party, ...enemies].map(combatant => ({
      ...combatant,
      initiative: rollInitiative(combatant)
    }));
    
    // Sort by initiative (highest first)
    state.turnOrder = allCombatants.sort((a, b) => b.initiative - a.initiative);
    
    // Initialize participant states
    state.participants = allCombatants.reduce((acc, c) => ({
      ...acc,
      [c.id]: {
        ...c,
        currentHp: c.stats.maxHp,
        currentMp: c.stats.maxMp,
        cosmicPower: c.stats.cosmicAffinity,
        statusEffects: [],
        buffs: [],
        debuffs: [],
        relationshipBuffs: []
      }
    }), {});
    
    // Initialize cosmic balance
    updateCosmicBalance();
    
    // Start first turn
    nextTurn();
    
    // Show battle UI
    GCA.UI.showScreen('battle-screen');
    
    // Log battle start
    logBattleMessage('Battle started!');
  }
  
  // Process next turn
  function nextTurn() {
    state.currentTurn++;
    
    // Get next actor (or loop back to start)
    const currentIndex = state.turnOrder.findIndex(c => c.id === state.currentActor?.id);
    const nextIndex = (currentIndex + 1) % state.turnOrder.length;
    state.currentActor = state.turnOrder[nextIndex];
    
    // Process start-of-turn effects
    processStartOfTurnEffects(state.currentActor);
    
    // Update cosmic balance
    updateCosmicBalance();
    
    // If actor is player, wait for input
    if (state.currentActor.type === 'player') {
      GCA.UI.showBattleMenu(state.currentActor);
    } 
    // Otherwise, execute AI turn
    else {
      executeAITurn(state.currentActor);
    }
    
    // Update UI
    updateBattleUI();
  }
  
  // Process player action
  function processPlayerAction(action, targetId) {
    const actor = state.currentActor;
    const target = state.participants[targetId];
    
    // Validate action
    if (!canPerformAction(actor, action)) {
      logBattleMessage(`${actor.name} cannot perform that action!`);
      return false;
    }
    
    // Process action
    switch (action.type) {
      case 'attack':
        processAttack(actor, target);
        break;
      case 'skill':
        processSkill(actor, action.skillId, target);
        break;
      case 'cosmic':
        processCosmicPower(actor, action.powerId, target);
        break;
      case 'combo':
        processCombo(actor, action.comboId, target);
        break;
      case 'item':
        processItem(actor, action.itemId, target);
        break;
      case 'defend':
        processDefend(actor);
        break;
    }
    
    // Process end of turn
    processEndOfTurn(actor);
    
    // Check for battle end
    if (checkBattleEnd()) {
      endBattle();
      return true;
    }
    
    // Move to next turn
    nextTurn();
    return true;
  }
  
  // Update cosmic balance
  function updateCosmicBalance() {
    const party = state.turnOrder.filter(c => c.type === 'player');
    
    // Calculate cosmic balance based on party composition
    state.cosmicBalance = party.reduce((balance, character) => {
      const cosmicPowers = character.cosmicPowers || [];
      cosmicPowers.forEach(power => {
        switch (power.type) {
          case 'harmony':
            balance.harmony += power.level;
            break;
          case 'chaos':
            balance.chaos += power.level;
            break;
          case 'stability':
            balance.stability += power.level;
            break;
        }
      });
      return balance;
    }, { harmony: 0, chaos: 0, stability: 0 });
    
    // Normalize values
    const total = state.cosmicBalance.harmony + state.cosmicBalance.chaos + state.cosmicBalance.stability;
    if (total > 0) {
      state.cosmicBalance.harmony = Math.round((state.cosmicBalance.harmony / total) * 100);
      state.cosmicBalance.chaos = Math.round((state.cosmicBalance.chaos / total) * 100);
      state.cosmicBalance.stability = Math.round((state.cosmicBalance.stability / total) * 100);
    }
    
    // Apply cosmic balance effects
    applyCosmicBalanceEffects();
  }
  
  // Process cosmic power
  function processCosmicPower(actor, powerId, target) {
    const power = actor.cosmicPowers.find(p => p.id === powerId);
    if (!power) return false;
    
    // Check cosmic power requirements
    if (!canUseCosmicPower(actor, power)) {
      logBattleMessage(`${actor.name} cannot use that cosmic power!`);
      return false;
    }
    
    // Apply cosmic power effects
    power.effects.forEach(effect => {
      applyEffect(actor, target, effect);
    });
    
    // Update cosmic balance
    updateCosmicBalance();
    
    // Log cosmic power use
    logBattleMessage(`${actor.name} used ${power.name}!`);
    
    return true;
  }
  
  // Process combo attack
  function processCombo(actor, comboId, target) {
    const combo = state.activeCombos.find(c => c.id === comboId);
    if (!combo) return false;
    
    // Check combo requirements
    if (!canUseCombo(actor, combo)) {
      logBattleMessage(`${actor.name} cannot use that combo!`);
      return false;
    }
    
    // Apply combo effects
    combo.effects.forEach(effect => {
      applyEffect(actor, target, effect);
    });
    
    // Update relationship levels
    updateRelationshipLevels(combo.characters);
    
    // Log combo use
    logBattleMessage(`${actor.name} performed ${combo.name} with ${combo.characters.join(', ')}!`);
    
    return true;
  }
  
  // Other combat functions...
  
  // Public API
  return {
    startCombat,
    processPlayerAction,
    updateCosmicBalance,
    processCosmicPower,
    processCombo,
    // Other public methods...
  };
})();
```

## Combat UI Elements

### Battle Screen Layout
```
┌─────────────────────────────────────────────────────────┐
│  Cosmic Balance Meter                                  │
├─────────────────────────────────────────────────────────┤
│  Turn Order                                            │
├─────────────────────────────────────────────────────────┤
│  Enemy Area                                            │
├─────────────────────────────────────────────────────────┤
│  Party Area (4 characters)                             │
├─────────────────────────────────────────────────────────┤
│  Action Menu                                           │
└─────────────────────────────────────────────────────────┘
```

### Cosmic Balance Meter
- Shows current harmony, chaos, and stability levels
- Visual indicator of cosmic balance
- Affects available cosmic powers and combos

### Party Area
- Displays 4 party members
- Shows HP, MP, and cosmic power meters
- Indicates relationship levels between characters
- Highlights available combos

### Action Menu
- Basic actions (Attack, Defend, Item)
- Skills and abilities
- Cosmic powers (when available)
- Combo attacks (when available)

## Combat Mechanics

### Initiative System
```
Initiative = (Base Speed + d8) + (Level / 10) + Position Modifier + Cosmic Bonus
```

### Damage Calculation
```
Base Damage = Weapon Dice + (Strength / 5) + Cosmic Power Bonus
Final Damage = Base Damage × (100 / (100 + Target's Defense)) × Modifiers
```

### Cosmic Power Effects
- Harmony: Healing and support effects
- Chaos: Damage and debuff effects
- Stability: Defense and buff effects

### Combo System
- Based on character relationships
- Requires specific character combinations
- Affected by cosmic balance
- Special effects based on relationship types

## Implementation Guidelines

### Combat Event Flow
1. Combat initialization
   - Set up party (max 4 characters)
   - Calculate initiative
   - Initialize cosmic balance

2. Turn execution
   - Select action
   - Process cosmic powers
   - Execute combos
   - Update cosmic balance

3. Turn transition
   - Apply end-of-turn effects
   - Update relationships
   - Check victory/defeat

4. Combat resolution
   - Calculate rewards
   - Update character relationships
   - Return to exploration

### Performance Optimization
- Cache cosmic balance calculations
- Pre-calculate combo availability
- Optimize relationship updates
- Efficient cosmic power processing

## Conscription in Combat

### Conscription Attempt
When a player attempts to conscript an enemy:
1. Enemy must be below 30% HP
2. Player must have a Conscript Orb or equivalent item
3. Success chance is calculated as:
   ```
   baseChance = 30  // Base 30% chance
   hpBonus = (1 - (currentHP / maxHP)) * 40  // Up to 40% bonus
   charismaBonus = player.charisma * 0.5  // 0.5% per point
   levelBonus = (playerLevel - enemyLevel) * 2  // 2% per level
   itemBonus = item.effect.value  // From consumables
   
   finalChance = baseChance + hpBonus + charismaBonus + levelBonus + itemBonus
   finalChance = Math.min(95, Math.max(5, finalChance))  // Clamp 5-95%
   ```

### Conscript Status Effects
- **New Recruit**: -20% to all stats for 3 turns after conscription
- **Loyalty Boost**: +10% damage when HP < 30%
- **Betrayal Risk**: 5% chance to disobey orders if loyalty < 30

### Conscript Abilities
Each conscripted unit retains its original abilities plus:
- **Ally Support**: Can perform combo attacks with player
- **Tactical Retreat**: 50% chance to avoid fatal damage (3 turn cooldown)
- **Last Stand**: When defeated, deals 200% damage to attacker

## Core Combat Loop

```
┌─────────────┐
│  Combat     │
│  Initiation │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Initiative │
│  Calculation│
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│  Turn Start │────►│  Action     │
└──────┬──────┘     │  Selection  │
       │            └──────┬──────┘
       │                   │
       │                   ▼
       │            ┌─────────────┐
       │            │  Action     │
       │            │  Resolution │
       │            └──────┬──────┘
       │                   │
       │                   ▼
       │            ┌─────────────┐
       │            │  Effect     │
       │            │  Application│
       │            └──────┬──────┘
       │                   │
       ▼                   │
┌─────────────┐     ┌─────────────┐
│  Next Turn  │◄────│  Turn End   │
└──────┬──────┘     └─────────────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│  Victory    │     │  Defeat     │
│  Condition? │────►│  Condition? │
└──────┬──────┘     └──────┬──────┘
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│  Combat     │     │  Game Over  │
│  Resolution │     │  Sequence   │
└─────────────┘     └─────────────┘
```

## Dice System

The core mechanic of the combat system revolves around virtual dice rolls that determine the outcome of actions.

### Dice Types

- **d4**: Four-sided dice (values 1-4)
- **d6**: Six-sided dice (values 1-6)
- **d8**: Eight-sided dice (values 1-8)
- **d10**: Ten-sided dice (values 1-10)
- **d12**: Twelve-sided dice (values 1-12)
- **d20**: Twenty-sided dice (values 1-20)
- **d100**: Percentile dice (values 1-100)

### Dice Notation

The system uses standard dice notation:
- `XdY`: Roll X dice with Y sides and sum the results
- `XdY+Z`: Roll X dice with Y sides, sum the results, and add Z
- `XdY-Z`: Roll X dice with Y sides, sum the results, and subtract Z

### Advantage and Disadvantage

Some conditions or abilities grant advantage or disadvantage on dice rolls:
- **Advantage**: Roll twice and take the higher result
- **Disadvantage**: Roll twice and take the lower result

## Combat Initialization

### Encounter Types

1. **Random Encounters**: Triggered based on steps taken in dangerous areas
2. **Scripted Encounters**: Triggered by story progression or specific actions
3. **Boss Encounters**: Unique battles against powerful enemies
4. **Ambush Encounters**: Enemies get a surprise round (players with high fortune may detect)
5. **Prepared Encounters**: Players get a surprise round (with scouting or preparation)

### Formation and Position

- Player party can have up to 6 characters, with 3 in the front row and 3 in the back row
- Front row excels at melee combat but receives more damage
- Back row excels at ranged and magical combat with reduced physical damage
- Position can be changed during combat using the "Change Position" action (costs a turn)

## Initiative and Turn Order

### Initiative Calculation

Initiative determines the order in which combatants act:

```
Initiative = (Base Speed + d8) + (Level / 10) + Position Modifier
```

Where:
- Base Speed is derived from the character's Dexterity stat
- Position Modifier: +1 for front row, +0 for back row
- Level bonus provides a slight advantage to higher-level characters

### Turn Order Display

- Initiative track displayed at the top of the combat screen
- Next 5 upcoming turns shown with character/enemy portraits
- Status effects may modify a character's position in the initiative order

### Turn Manipulation

Certain abilities and status effects can manipulate the turn order:
- **Haste**: Adds an extra turn after the current initiative cycle
- **Slow**: Reduces initiative by 50% for the next turn
- **Interrupt**: Immediately gives a turn to a specific character (rare ability)
- **Delay**: Character can choose to act later in the initiative order

## Action Types

During their turn, characters can perform one of the following action types:

### Basic Actions

1. **Attack**: Standard physical attack using equipped weapon
   - Uses d20 for hit determination
   - Uses weapon-specific dice for damage (e.g., 2d6 for a sword)

2. **Skill**: Use a character ability or special attack
   - Consumes MP or other resources
   - Effects vary by skill (damage, healing, buffs, etc.)
   - May require specific dice rolls for effectiveness

3. **Item**: Use a consumable item from inventory
   - No dice roll required for success
   - Effects determined by the item used

4. **Defend**: Increase defense until next turn
   - Reduces incoming damage by 50%
   - Gains advantage on saving throws

5. **Run**: Attempt to flee from battle
   - Success chance = 50% + (Average Party Speed - Average Enemy Speed)
   - Boss encounters typically prevent running

### Advanced Actions

1. **Combo Attack**: Two characters combine their actions for a powerful joint attack
   - Both characters must have their turns adjacent in the initiative order
   - Damage = (Character 1 Attack + Character 2 Attack) × 1.5
   - Consumes both characters' turns

2. **Focus**: Gain advantage on your next action
   - Skip current turn
   - Next action gains +5 to hit and +25% damage

3. **Taunt**: Draw enemy attention to this character
   - 75% chance for enemies to target this character
   - Lasts 2 rounds

4. **Scout**: Analyze enemy weaknesses
   - Reveals HP, weaknesses, and resistances
   - Grants +10% critical chance against analyzed enemy

## Party Combo System

The Party Combo System adds strategic depth to combat by allowing characters to perform powerful joint attacks based on their relationships, classes, and equipped relics.

### Combo Types

1. **Dual Techs**: Two-character combos that combine basic abilities
   - Example: "Flame Strike" - Influmancer's fire spell + Flexecutioner's physical attack
   - Damage: Base damage of both attacks × 1.8
   - Special Effect: 30% chance to apply Burn status

2. **Triple Techs**: Three-character combos with powerful effects
   - Example: "Viral Cascade" - Memetic Rogue + Influmancer + Net Runner
   - Damage: Combined base damage × 2.5
   - Special Effect: Applies a random status effect to all enemies

3. **Chain Combos**: Sequential attacks that build upon each other
   - Initiated by one character and continued by others
   - Each successful chain increases damage multiplier by 0.3
   - Maximum chain length of 4 attacks
   - Requires timing-based input for success

### Affinity System

Characters develop affinity by:
- Fighting together in combat
- Completing character-specific quests
- Using complementary abilities
- Sharing items in battle

Affinity Levels:
- Level 1 (New Friends): Basic dual techs available
- Level 2 (Partners): Improved dual techs, basic triple techs
- Level 3 (Synced): Advanced dual techs, improved triple techs
- Level 4 (Bonded): Master-level techs with unique effects

### Combo Discovery

Players discover combos through:
1. **Experimentation**: Trying different character and ability combinations
2. **Battle Insights**: After certain battle conditions are met, combo hints appear
3. **Training**: Special training grounds where combos can be practiced
4. **Relic Revelations**: Certain relics reveal combo possibilities when equipped

### Combo Execution

Combos are executed through one of several methods:

1. **Turn Sequence**: Characters must act in a specific sequence within the same round
   - Success Chance: 100% if conditions are met
   - Input Required: Select "Combo" action and choose partners

2. **Action Timing**: Like Super Mario RPG, timed button presses enhance combo effects
   - Base Success: 100% for combo activation
   - Timing Bonus: Up to +50% damage based on timing accuracy
   - Three timing points: Start, Middle, and Final Hit

3. **Combo Meter**: Similar to Chrono Trigger's tech system, meter builds as battle progresses
   - Fills based on actions taken and damage dealt/received
   - When full, enables special combo abilities
   - Different combos require different meter levels

4. **Positioning System**: Like Chained Echoes, character position affects combo availability
   - Front row vs. back row combinations
   - Positioning relative to enemies (flanking, surrounding)
   - Mid-battle position changes can enable new combos

### Combo Effects

Beyond increased damage, combos can have special effects:

1. **Area Effects**: Hitting multiple targets or zones
2. **Status Application**: Higher chance to apply status effects
3. **Piercing Effects**: Bypassing certain enemy defenses
4. **Resource Effects**: MP regeneration, HP healing, etc.
5. **Battlefield Manipulation**: Changing terrain or combat conditions
6. **Initiative Disruption**: Altering the turn order

### Combo UI Elements

- Combo readiness indicators next to character portraits
- Visual cues when compatible characters have consecutive turns
- Combo discovery log in the menu system
- Tutorial system for teaching basic combo mechanics

## Attack Resolution

### Hit Determination

To determine if an attack hits:

```
Hit Roll = d20 + Accuracy Modifier
Hit Success if: Hit Roll >= Target's Evasion Value
```

Where:
- Accuracy Modifier = (Attacker's Dexterity / 5) + Weapon Accuracy + Status Modifiers
- Evasion Value = 10 + (Target's Dexterity / 5) + Armor Evasion + Status Modifiers

### Critical Hits

Critical hits deal significantly more damage:

```
Critical Chance = (Fortune / 10) + Weapon Critical Bonus + Skill Modifiers
Critical Hit if: d100 <= Critical Chance
Critical Damage = Normal Damage × Critical Multiplier
```

Where:
- Critical Multiplier = 1.5 + (Fortune / 100) + Weapon/Skill Bonuses

## Damage Calculation

### Physical Damage

```
Base Damage = Weapon Dice + (Strength / 5)
Final Damage = Base Damage × (100 / (100 + Target's Defense)) × Modifiers
```

Where Modifiers include:
- Elemental effectiveness (×0.5 for resistance, ×1.5 for weakness)
- Critical hit multiplier
- Skill multipliers
- Status effect modifiers
- Position modifiers

### Magical Damage

```
Base Damage = Spell Dice + (Intelligence / 5)
Final Damage = Base Damage × (100 / (100 + Target's Magic Defense)) × Modifiers
```

### Fixed Damage

Some attacks deal fixed damage that ignores defense:

```
Final Damage = Base Fixed Damage × Level Modifier
```

Where Level Modifier adjusts damage based on level difference between attacker and target.

## Status Effects

### Common Status Effects

1. **Burn**
   - Deals 5% max HP damage at the end of turn
   - Reduces physical attack by 25%
   - Duration: 3 turns

2. **Poison**
   - Deals 3% max HP damage at the end of turn
   - Damage increases by 3% each turn
   - Duration: 5 turns

3. **Paralysis**
   - 25% chance to lose turn
   - Reduces speed by 50%
   - Duration: 2 turns

4. **Stun**
   - Cannot act
   - Duration: 1 turn

5. **Blind**
   - Reduces hit chance by 50%
   - Duration: 3 turns

6. **Silence**
   - Cannot use skills or magic
   - Duration: 3 turns

7. **Berserk**
   - Increases attack by 50%
   - Forces auto-attack on random target
   - Duration: 4 turns

### Status Effect Application

Status effects have a chance to be applied based on:

```
Application Chance = Base Chance × (1 - Target's Resistance)
```

Where:
- Base Chance is determined by the ability or attack
- Target's Resistance is derived from equipment and stats

### Status Effect Removal

Status effects can be removed by:
- Specific items (e.g., Antidote removes Poison)
- Healing skills with status removal properties
- Natural expiration after their duration

## Defense and Damage Reduction

### Physical Defense

Physical damage reduction follows a diminishing returns formula:

```
Damage Reduction = Defense / (Defense + 100 + (5 × Target Level))
```

This ensures that defense remains valuable but doesn't make characters invulnerable at high levels.

### Elemental Resistance

Elemental resistance reduces damage from that element:

```
Elemental Damage Reduction = Base Damage × (1 - Resistance Percentage)
```

Characters can have innate resistances based on class and gain additional resistances through equipment and relics.

## Character Progression

### Leveling Up
- **Experience Points (XP)**: Gained from combat victories and quest completion
  - Base XP per enemy: `baseXP = enemyLevel * 10`
  - Bonus XP for first time encounters: +20%
  - XP required for next level: `100 * (1.5^(currentLevel - 1))`

- **Stat Increases** (per level):
  - HP: `10 + (vitality * 0.5)`
  - MP: `5 + (intelligence * 0.3)`
  - Attack: `1 + (strength * 0.1)`
  - Defense: `1 + (vitality * 0.1)`
  - Speed: `0.5 + (dexterity * 0.05)`

### Automatic Skill Unlocks
Skills are automatically unlocked at specific levels with no manual allocation required.

#### Flexecutioner (Tank/Melee DPS)

```
┌────────┬──────────────────────┬────────────┬──────────┬──────────┬───────────┬─────────────────────────────────────────────────────┐
│ Level  │ Skill Name          │ Type       │ MP Cost  │ Power    │ Cooldown  │ Description                                     │
├────────┼──────────────────────┼────────────┼──────────┼──────────┼──────────┼─────────────────────────────────────────────────────┤
│   1    │ Power Strike        │ Physical   │    5     │   220%   │     3    │ 20% chance to Bleed (10% HP over 3 turns)      │
│   3    │ Protein Shake       │ Passive    │    -     │    -     │     -    │ +4% max HP & +5% HP regen in overworld         │
│   6    │ Battle Cry          │ Support    │   10     │    -     │     4    │ +20% STR & +10% VIT for 3 turns (party)        │
│   9    │ Form Check          │ Passive    │    -     │    -     │     -   │ Blocks 10% of melee damage if not moved         │
│  12    │ Superset            │ Physical   │   12     │   150%   │     4    │ Hits all enemies in front row                  │
│  15    │ Flex & Reflect      │ Support    │    8     │    -     │     5    │ Heals 18% max HP, 15% damage reflect           │
│  18    │ Nitric Aura         │ Passive    │    -     │    -     │     -    │ +8% crit rate when HP > 75%                    │
│  22    │ Dumb-bell Curve     │ Support    │   14     │    -     │     4    │ -25% STR & DEX on target for 3 turns           │
│  25    │ Mass Pull           │ Support    │   15     │    -     │     4    │ Taunts all foes; +20% block for 2 turns        │
│  28    │ Hypertrophy         │ Passive    │    -     │    -     │     -    │ +1 max HP per 100 XP (cap +300)                │
│  31    │ Swole Stomp         │ Physical   │   18     │   180%   │     5    │ AoE attack, 30% chance to Stun 1 turn          │
│  34    │ Adrenal Flood       │ Support    │  8% HP   │    -     │     6    │ +40% STR & +25% Speed for 2 turns              │
│  37    │ Plyometric Guard    │ Passive    │    -     │    -     │     -    │ +30% damage after dodging                      │
│  40    │ Bro-tein Barrier    │ Support    │   20     │    -     │     7    │ Party absorbs (20% VIT + 5% max HP) damage     │
│  43    │ Drop-Set            │ Physical   │   16     │  70%x3   │     5    │ 3 hits, +5% damage per missing 10% HP          │
│  46    │ Mind-Muscle Link   │ Passive    │    -     │    -     │     -     │ STR also boosts MAG DEF at 50% rate            │
│  49    │ Spotter Call        │ Support    │   12     │    -     │     6    │ Takes 30% of ally's damage for 3 turns         │
│  52    │ 100-Rep Challenge   │ Physical   │   25     │    -     │     8   │ Next 3 attacks are guaranteed crits             │
│  55    │ Time Under Tension  │ Passive    │    -     │    -     │     -    │ +1% damage/turn in combat (max +15%)           │
│  58    │ Failure Training    │ Passive    │    -     │    -     │     -    │ Survive one fatal hit per battle               │
│  63    │ One-Rep Max         │ Physical   │   30     │   500%   │     8    │ Massive damage, stuns self for 1 turn          │
│  66    │ Beast Mode          │ Support    │   25     │    -     │    10    │ +50% STR, +30% SPD, -30% DEF for 4 turns       │
│  69    │ Hunter Squat Program│ Passive    │    -     │    -     │     -    │ +1 STR/VIT per 5 levels; +5% max HP            │
│  72    │ Tactical Shirt Rip  │ Support    │   20     │    -     │     7    │ Remove debuffs; +25% ATK/DEF for 3 turns       │
│  75    │ Gains Goblin Mode   │ Physical   │ 99% HP   │   50x    │    15    │ Sacrifice 99% HP for massive next turn damage  │
│  78    │ Atlas Carry         │ Support    │   35     │    -     │    10    │ Take 80% of party damage for 1 turn            │
│  80    │ Super Saiyan Mode   │ Support    │   50     │    -     │    999   │ +100% all stats, 50% DR, no MP cost for 5 turns│
└────────┴──────────────────────┴────────────┴──────────┴──────────┴────────────┴─────────────────────────────────────────────────────┘
```

#### Rizzler (Support/Healer)

```
┌────────┬───────────────────┬────────────┬──────────┬──────────┬────────────┬─────────────────────────────────────────────────────┐
│ Level  │ Skill Name       │ Type       │ MP Cost  │ Power    │ Cooldown   │ Description                                     │
├────────┼───────────────────┼────────────┼──────────┼──────────┼────────────┼─────────────────────────────────────────────────────┤
│   1    │ Rizz Beam        │ Magic      │    5     │   120%   │     0      │ Deals CHA-based damage to a single target      │
│   3    │ Smolder          │ Passive    │    -     │    -     │     -      │ +15% chance to charm enemies when attacked     │
│   6    │ Rizz Boost       │ Support    │    8     │    -     │     4      │ +20% CHA & INT for 3 turns (self)              │
│   9    │ Chill Vibes      │ Support    │   10     │    -     │     5      │ Party-wide +15% dodge chance for 2 turns       │
│  12    │ Roast Session    │ Magic      │   15     │   90%    │     3      │ Damages all enemies, 20% chance to silence     │
│  15    │ Group Hug        │ Support    │   20     │    -     │     6      │ Heals all allies for 150% INT + 5% max HP      │
│  18    │ Rizz Shield      │ Support    │   12     │    -     │     4      │ Absorbs 15% of target's max HP as shield       │
│  22    │ Rizz Tsunami     │ Magic      │   25     │   180%   │     6      │ Heavy CHA-based damage, 30% chance to charm    │
│  25    │ Golden Glow      │ Support    │   30     │    -     │     8      │ Party-wide 25% damage reduction for 2 turns    │
│  28    │ Divine Wingman   │ Support    │   15     │    -     │     5      │ Next ally action has +50% crit chance          │
│  31    │ Rizz Surge       │ Support    │   20     │    -     │     4      │ Next 3 attacks deal +30% damage (party)        │
│  34    │ Rizz Zone        │ Passive    │    -     │    -     │     -      │ +10% to all healing and support effects        │
│  37    │ Rizz Overload    │ Magic      │   40     │   250%   │     8      │ Massive CHA-based damage, consumes all MP      │
│  40    │ Battle Rizz      │ Passive    │    -     │    -     │     -      │ +20% CHA in combat, +10% out of combat         │
│  43    │ Ghost Buster     │ Magic      │   18     │   140%   │     5      │ Extra damage to undead/ghost types             │
│  46    │ Rizz Aura        │ Passive    │    -     │    -     │     -      │ Party-wide +5% to all stats                    │
│  49    │ Hype Man         │ Support    │   25     │    -     │     6      │ Next ally action costs 0 MP                    │
│  52    │ Rizz Karma       │ Passive    │    -     │    -     │     -      │ 30% of damage taken is reflected to attacker   │
│  55    │ Rizz Hug         │ Support    │   35     │    -     │    10      │ Full heal + remove all debuffs (single target)  │
│  58    │ Rizz Whisperer   │ Passive    │    -     │    -     │     -      │ Can revive once per battle at 25% HP           │
│  60    │ Rizz Ascension   │ Support    │   50     │    -     │    15      │ Party-wide +30% to all stats for 3 turns       │
│  63    │ Rizz Avatar      │ Support    │   40     │    -     │    12      │ Become immune to damage for 2 turns            │
│  66    │ Rizz Decree      │ Support    │   60     │    -     │    20      │ Full party revive at 50% HP, full MP            │
│  69    │ Rizz Symphony    │ Support    │   45     │    -     │    10      │ All allies act twice next turn                  │
│  72    │ Fountain of Rizz │ Support    │ 30/turn  │    -     │     -      │ Channel: Heals 10% max HP to all allies/turn   │
│  75    │ Rizz Backfire    │ Passive    │    -     │    -     │     -      │ 50% chance to reflect debuffs to caster        │
│  78    │ Rizz Guardian    │ Support    │   75     │    -     │    30      │ Party-wide invulnerability for 1 turn          │
│  80    │ Ultimate Rizz    │ Support    │   100    │    -     │    999     │ Full party: Full HP/MP, +50% stats, no cooldowns│
└────────┴───────────────────┴────────────┴──────────┴──────────┴────────────┴─────────────────────────────────────────────────────┘
```

#### Sus-Assassin (Stealth/DPS)

```
┌────────┬────────────────────┬────────────┬──────────┬──────────┬────────────┬─────────────────────────────────────────────────────┐
│ Level  │ Skill Name        │ Type       │ MP Cost  │ Power    │ Cooldown   │ Description                                     │
├────────┼────────────────────┼────────────┼──────────┼──────────┼────────────┼─────────────────────────────────────────────────────┤
│   1    │ Backstab          │ Physical   │   15     │   250%   │     3    │ 250% DEX dmg from behind. Guaranteed crit stealth │
│   3    │ Smoke and Mirrors  │ Support    │   10     │    -     │     4   │ Gain stealth 1 turn, next attack +30% crit dmg  │
│   6    │ Knife to Meet You │ Physical   │   20     │   180%   │     3      │ Hits all enemies, 20% Bleed chance             │
│   9    │ Quick Escape Plan │ Support    │   15     │    -     │     5      │ Retreat to back row, +30% dodge 2 turns        │
│  12    │ Ninja Vanish      │ Support    │   25     │    -     │     6      │ Stealth 2 turns, +50% crit chance next attack  │
│  15    │ Stab and Grab     │ Physical   │   30     │   220%   │     4      │ Steals one random buff from target             │
│  18    │ Ghost Mode        │ Support    │   40     │    -     │     8      │ Untargetable 1 turn, +100% crit dmg next attack│
│  22    │ Knee Capper       │ Physical   │   20     │   150%   │     3      │ Reduces target's SPD by 30% for 3 turns       │
│  25    │ Blender of Doom   │ Physical   │   45     │   320%   │     5      │ Hits all enemies, 30% Bleed chance             │
│  28    │ Shadow Clone Jutsu│ Support    │   35     │    -     │     7      │ Summon taunting clone (200% INT explosion)     │
│  31    │ Surprise Party    │ Physical   │   50     │   150%   │    10      │ 3 clones attack random enemies                 │
│  34    │ Phantom Limb      │ Passive    │    -     │    -     │     -      │ 20% chance to attack twice (2nd at 50% dmg)    │
│  37    │ Adrenaline Junkie │ Passive    │    -     │    -     │     -      │ +5% dmg per debuff on target (max 25%)         │
│  40    │ Mark of Shame     │ Support    │   40     │    -     │     8      │ Mark takes 30% more dmg from you (3 turns)     │
│  43    │ Knifey Spoony     │ Physical   │   25     │   180%   │     4      │ Bounces 3-5 times between enemies              │
│  46    │ Toxic Gossip      │ Magic      │   30     │    -     │     6      │ Poisons all (5% max HP/turn), 20% silence      │
│  49    │ Shadow Rave       │ Physical   │   60     │   400%   │    10      │ Hits all, 50% stun 1 turn                      │
│  52    │ Stalker's Mark    │ Support    │   25     │    -     │     5      │ See HP, +20% dmg to target (5 turns)           │
│  55    │ Silent But Deadly │ Passive    │    -     │    -     │     -      │ +50% dmg from stealth, ignore 30% DEF          │
│  58    │ Cloak of Deniablty│ Support    │   40     │    -     │    12      │ Stealth 3 turns, 50% DR 1 turn                │
│  60    │ Murder Spree      │ Physical   │   75     │   600%   │    15      │ Teleport to each enemy, reset on kill          │
│  63    │ Tele-Frag         │ Physical   │   30     │   350%   │     6      │ Always crits from stealth                      │
│  66    │ Petal Blender     │ Physical   │   50     │   280%   │     8      │ 3 hits to all, 30% Bleed per hit              │
│  69    │ Edgy Emo Phase    │ Support    │ 20% HP   │    -     │    10      │ +40% dmg, 50% lifesteal for 3 turns           │
│  72    │ Gut Feeling      │ Passive    │    -     │    -     │     -      │ <30% HP: +50% evasion, 100% crit               │
│  75    │ Casual Walk Away  │ Support    │    0     │   300%   │    20      │ Dodge all attacks, counter next turn           │
│  78    │ Knife Shield      │ Support    │   40     │    -     │    12      │ 2 turns: reflect 50% dmg, +30% DEF             │
│  80    │ Final Cut         │ Physical   │   100    │   999%   │    999     │ Execute enemies below 20% HP                   │
└────────┴────────────────────┴────────────┴──────────┴──────────┴────────────┴─────────────────────────────────────────────────────┘
```

#### Influmancer (Reality Bender)

```
┌────────┬────────────────────┬────────────┬──────────┬──────────┬────────────┬─────────────────────────────────────────────────────┐
│ Level  │ Skill Name        │ Type       │ MP Cost  │ Power    │ Cooldown   │ Description                                     │
├────────┼────────────────────┼────────────┼──────────┼──────────┼────────────┼─────────────────────────────────────────────────────┤
│   1    │ Clickbait Bolt    │ Magic      │   15     │   180%   │     0      │ 20% chance to confuse                          │
│   3    │ Block Button      │ Support    │   20     │    -     │     3      │ Block next attack, reflect 50% dmg             │
│   6    │ Hot Take         │ Magic      │   25     │   220%   │     4      │ Fire dmg + burn 10% INT/turn                   │
│   9    │ Cold Shoulder    │ Magic      │   25     │   220%   │     4      │ Ice dmg, -30% SPD 2 turns                      │
│  12    │ Viral Strike      │ Magic      │   35     │   280%   │     5      │ Bounces 3 times (50% dmg each)                 │
│  15    │ Engagement Boost  │ Support    │   30     │    -     │     6      │ Party +20% INT/CHA, extend buffs 1 turn        │
│  18    │ Hate Shield       │ Support    │   25     │    -     │     8      │ 300% INT shield, reflects 25% dmg              │
│  22    │ Rewind Button     │ Support    │   50     │    -     │    10      │ Revert HP/MP to start of last turn             │
│  25    │ Drama Llama       │ Support    │   40     │    -     │     6      │ Taunt all, +50% THP, reflect 30% dmg           │
│  28    │ Tweet Storm       │ Magic      │   45     │   150%   │     5      │ 5-8 random hits, 30% silence per hit          │
│  31    │ Mind Melter       │ Support    │   35     │    -     │     7      │ -30% INT, 40% confuse 2 turns                  │
│  34    │ Cancel Culture    │ Magic      │   60     │    -     │    12      │ Remove buffs, deal 50% as dmg, silence 2 turns │
│  37    │ Narrative Shift   │ Support    │   40     │    -     │    10      │ Swap HP% with enemy                            │
│  40    │ Clout Chaser      │ Passive    │    -     │    -     │     -     │ +5% INT per debuff (max 25%), crits apply debuff│
│  43    │ Black Mirror      │ Support    │   50     │    -     │     8      │ Reflect next 3 spells at 150% power            │
│  46    │ Doom Scroll       │ Magic      │ 15% HP   │   500%   │    15      │ +50% dmg per debuff on you                     │
│  49    │ Thread Weaver     │ Support    │   30     │    -     │     6      │ Link enemies for 3 turns (20% shared dmg)      │
│  52    │ Deep Fake         │ Support    │   60     │    -     │    12      │ Create enemy clone (50% stats) for 3 turns     │
│  55    │ Hype Train        │ Support    │   45     │    -     │    10      │ Party +30% ATK/SPD, 20% lifesteal 4 turns      │
│  58    │ Simp Army         │ Summon     │   70     │    -     │    15      │ 3 minions (30% stats) for 3 turns              │
│  60    │ Trending Worldwide│ Passive    │    -     │    -     │     -      │ 15% chance spells go viral (50% dmg, AoE)      │
│  63    │ Retcon            │ Support    │   80     │    -     │    20      │ Rewind battle 1 turn, keep memory              │
│  66    │ Big Think         │ Magic      │   50     │   800%   │    10      │ Charge 1 turn, then AoE + stun                 │
│  69    │ Void Your Opinion  │ Magic     │   40     │   200%   │     8      │ Silence all, dmg per buff removed              │
│  72    │ Ratio Blast       │ Magic      │   60     │   400%   │    12      │ +50% dmg if target has more HP                 │
│  75    │ Fact Anchor       │ Support    │ 25% HP   │    -     │    15      │ 3 turns: all crits, +10% dmg taken             │
│  78    │ Copium Inhaler    │ Support    │   30     │    -     │    10      │ Heal 30% HP, 50% DR 1 turn, 15% HP cost next  │
│  80    │ Going Viral       │ Magic      │   100    │  1000%   │    999     │ Apply all debuffs, heal 5% max HP per debuff   │
└────────┴────────────────────┴────────────┴──────────┴──────────┴────────────┴─────────────────────────────────────────────────────┘
```

### Stat Distribution

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

## Skill Mastery System
- **Usage Bonuses**: Skills improve with use
  - Every 10 uses: -1 MP cost (min 1)
  - Every 25 uses: +5% power
  - Every 50 uses: -1 turn cooldown (min 0)

- **Mastery Rewards**:
  - 100 uses: Unlock special visual effect
  - 250 uses: Unlock enhanced version of skill

### Rizzler Class Overview
- **Primary Role**: Support/Healer
- **Key Attributes**: Charisma (CHA), Intelligence (INT)
- **Playstyle**: Focuses on healing, buffing allies, and charming/debuffing enemies
- **Signature Abilities**:
  - **Rizz Beam**: Basic CHA-based attack
  - **Group Hug**: Party-wide healing
  - **Ultimate Rizz**: Full party restoration and empowerment
- **Strengths**:
  - Excellent party support and healing
  - Strong crowd control with charm effects
  - Versatile buffs and debuffs
- **Weaknesses**:
  - Lower personal damage output
  - MP-hungry abilities
  - Reliant on positioning and team composition

### Stat Progression
- **Base Stats**: Increase automatically per level
- **Equipment Bonuses**: Additional stats from gear
- **Relic Effects**: Special bonuses from collected relics
- **Synergy Bonuses**: Bonuses for using complementary skills in sequence

### Visual Feedback
- **Level Up**: Golden particle effect, sound fanfare
- **Skill Unlock**: Popup with skill details, auto-pauses combat
- **Stat Increases**: Floating numbers with up arrows
- **Mastery Milestones**: Special visual effects and achievements

## Health and Resource Management

### Health Points (HP)

- HP is reduced by taking damage
- Characters are defeated when HP reaches 0
- Defeated characters cannot act until revived
- If all player characters are defeated, the battle is lost

### Mana Points (MP)

- MP is consumed when using skills
- MP regenerates at a rate of 5% per turn
- Some items can restore MP
- Running out of MP limits a character to basic attacks and items

### Fury Points (FP)

- Fury is gained by taking damage or landing critical hits
- Fury accumulates in the relic gauge
- When the gauge is full, powerful relic abilities can be used
- Relic abilities consume all accumulated Fury

## Character Class Specializations

Each character class has unique combat attributes and specializations:

### Flexecutioner (Tank/Melee DPS)
- **Primary Stats**: Strength, Vitality
- **Secondary Stats**: Dexterity, Charisma
- **Role**: Frontline tank with high damage potential
- **Playstyle**: Excels at taking hits and dealing massive damage in short bursts
- **Key Abilities**:
  - **Protein Shake**: Passive HP regeneration and max HP boost
  - **Swole Stomp**: Powerful AoE with stun chance
  - **Super Saiyan Mode**: Ultimate transformation with massive stat boosts
- **Strengths**:
  - High HP and defense
  - Strong single-target and AoE damage
  - Excellent party support and tanking abilities
- **Weaknesses**:
  - Lower speed and dodge chance
  - Some abilities have HP costs
  - Reliant on MP management for sustained performance
- **Combat Style**: Front-line physical attacker with party support
- **Weapon Preference**: Dumbbells, barbells, and other gym equipment
- **Signature Moves**:
  - **Power Strike**: 220% damage with bleed chance
  - **Bro-tein Barrier**: Party-wide damage absorption
  - **Atlas Carry**: Take damage for allies and counterattack
- **Dice Affinity**: d12 for damage rolls, d20 for tanking rolls

### Influmancer
- **Combat Style**: Back-line support/debuffer
- **Weapon Preference**: Wands and staves
- **Special Ability**: "Trending" - Status effects last 2 turns longer
- **Dice Affinity**: d8 for effect duration

### Memetic Rogue
- **Combat Style**: Fast attacker with status effects
- **Weapon Preference**: Daggers and light weapons
- **Special Ability**: "Viral Strike" - Attacks have 25% chance to spread status effects
- **Dice Affinity**: d6 (multiple rolls) for quick attacks

### Wellness Warlock
- **Combat Style**: Healer with defensive buffs
- **Weapon Preference**: Staves and talismans
- **Special Ability**: "Cleanse" - Remove all negative status effects
- **Dice Affinity**: d10 for healing

### Net Runner
- **Combat Style**: Technical debuffer and controller
- **Weapon Preference**: Gloves and technical tools
- **Special Ability**: "Hack" - Manipulate enemy action chance
- **Dice Affinity**: d20 for control effects

## Weapon Type Specialization

Different weapon types provide unique combat benefits:

### Swords
- Balanced damage (2d6)
- +10% critical chance
- Special: Can perform counter-attacks

### Axes
- High damage (1d12)
- -5% hit chance
- Special: Ignore 20% of enemy defense

### Wands
- Magical damage (1d8 + Intelligence)
- +15% magic effect chance
- Special: Restore 2 MP on successful hit

### Bows
- Ranged damage (1d10)
- +15% hit chance
- Special: Can attack from back row without penalty

### Gauntlets
- Physical damage (1d6 + Strength)
- +20% status effect chance
- Special: Can perform multi-hit attacks

## Combat Abilities and Skills

Skills are divided into several categories:

### Attack Skills
- Deal damage to single or multiple targets
- May include additional effects (status, position change, etc.)
- Generally consume MP based on power level

### Support Skills
- Buff allies or debuff enemies
- Heal damage or restore resources
- Apply protective effects
- Generally consume MP based on effect strength

### Passive Skills
- Provide permanent bonuses when learned
- Do not require activation
- Examples: increased stats, elemental resistance, combat bonuses

### Relic Skills
- Powerful abilities unlocked through relics
- Consume Fury points instead of MP
- Can turn the tide of difficult battles
- Become permanently available when a relic is mastered

## Relic Integration

Relics provide powerful combat abilities that change based on their level:

### Relic Level 1-2
- Basic combat utility abilities
- Minor stat boosts (+1-2 to relevant stats)
- Low Fury cost abilities

### Relic Level 3-4
- Multi-target attack/support abilities
- Moderate stat boosts (+3-5 to relevant stats)
- Medium Fury cost abilities

### Relic Level 5-6
- Game-changing powerful abilities
- Major stat boosts (+6-10 to relevant stats)
- High Fury cost abilities

### Relic Mastery
- Permanently retain all abilities when the relic is unequipped
- Unlocks hidden mastery ability
- Provides passive bonuses related to the relic's theme

## Enemy Combat AI

Enemy behavior is governed by AI patterns:

### Behavior Types

1. **Aggressive**: Prioritizes attacking player characters with lowest HP
2. **Defensive**: Uses buffs and healing frequently
3. **Strategic**: Targets specific character roles (healers first)
4. **Adaptive**: Changes tactics based on battle conditions
5. **Berserk**: Always uses strongest attacks regardless of MP cost
6. **Support**: Focuses on buffing allies rather than attacking

### AI Decision Making

```
Action Priority = Base Priority + Condition Modifiers
```

Where:
- Base Priority is set for each action type
- Condition Modifiers adjust based on battle state (HP percentage, status effects, etc.)

### Boss Enemy Mechanics

Boss enemies feature unique mechanics:

1. **Phase Changes**: Behavior and abilities change at specific HP thresholds
2. **Special Attacks**: Powerful attacks telegraphed one turn in advance
3. **Minion Summoning**: Ability to call reinforcements
4. **Weak Points**: Specific vulnerabilities that change throughout battle
5. **Ultimate Attacks**: Very powerful attacks used at low HP

## Combat Rewards

### Experience Points

Experience is awarded based on enemy level and difficulty:

```
Base XP = Enemy Base XP × (1 + (Enemy Level - Player Level) × 0.1)
```

Experience is distributed evenly among surviving party members.

### Loot Distribution

- **Guaranteed Drops**: Always received upon victory
- **Chance Drops**: Probability-based drops determined by item rarity
- **Rare Drops**: Very low probability drops with valuable effects
- **Conditional Drops**: Only appear under specific battle conditions (e.g., defeat boss within 10 turns)

### Bonus Objectives

Additional rewards for completing combat challenges:
- No character KO'd: +25% XP
- Victory within X turns: +Gold
- Defeat enemies in specific order: +Rare item chance
- Victory with low HP: +Fury for relics

## Balancing Considerations

### Level Scaling

Enemy stats scale with level following these formulas:

```
HP = Base HP × (1.1 ^ Level)
Attack = Base Attack × (1.08 ^ Level)
Defense = Base Defense × (1.07 ^ Level)
```

### Difficulty Adjustments

The game offers multiple difficulty levels that adjust:
- Enemy stat multipliers
- Frequency of enemy special attacks
- Effectiveness of items and healing
- XP and drop rates

### Power Curve

Character power progression follows a curve that ensures:
- New abilities feel impactful
- Early game is accessible but challenging
- Mid-game introduces strategic depth
- Late game rewards mastery of systems

## Implementation Guidelines

### Combat Event Flow

1. Combat initialization
   - Set up combatants and formation
   - Calculate and display initiative order
   - Apply pre-combat effects

2. Turn execution
   - Select action
   - Calculate success/failure
   - Apply damage/effects
   - Update UI and combat state

3. Turn transition
   - Apply end-of-turn effects (DoT, regeneration)
   - Update initiative order
   - Check victory/defeat conditions

4. Combat resolution
   - Calculate rewards
   - Apply experience and loot
   - Return to exploration mode

### Performance Optimization

- Pre-calculate static values (base stats, equipment bonuses)
- Cache commonly used calculations
- Implement dice roll simulations efficiently
- Optimize animation playback for smooth combat flow

## Conclusion

The dice-based combat system in Glitter Cloud Adventure provides a unique blend of traditional JRPG combat with tabletop RPG elements. The system rewards strategic thinking, character building, and mastery of game mechanics while maintaining an element of chance that keeps battles exciting and unpredictable.

The next design document will cover the Story Progression & Economy system, detailing how the two worlds interact and progress throughout the game.
