# Content Creation Guidelines (Single HTML File)

## File Structure

All game content is defined in a single HTML file with the following structure:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Glitter Cloud Adventure</title>
  <style>
    /* Base styles */
    /* ... */
  </style>
</head>
<body>
  <div id="game-container">
    <!-- Game screens go here -->
  </div>
  
  <script>
    // Game namespace
    window.GCA = {
      Core: {},
      Systems: { Dungeon: {}, Surface: {}, Shared: {} },
      Data: {},
      Managers: {},
      UI: {},
      Utils: {},
      Config: {}
    };
    
    // Game initialization
    document.addEventListener('DOMContentLoaded', () => {
      // Initialize game systems
      GCA.Managers.StateManager.init();
      GCA.UI.init();
      
      // Load game data
      loadGameData();
      
      // Show title screen
      GCA.UI.showScreen('title-screen');
    });
    
    // Game data (moved to separate section for clarity)
    function loadGameData() {
      // Characters, items, skills, etc.
      GCA.Data.Skills = { /* ... */ };
      GCA.Data.Items = { /* ... */ };
      // ...
    }
  </script>
</body>
</html>
```

## Character Design

### Naming Conventions
- **Main Characters**: Unique, memorable names (e.g., "Zephyr", "Nova")
- **NPCs**: Theme-based naming based on location/role
- **Enemies**: Descriptive names (e.g., "Storm Wisp", "Thunderclaw")
- **Conscripts**: Follow enemy naming but add rank/title (e.g., "Veteran Storm Wisp")

### Stat Distribution
| Class/Type      | Primary Stats       | Secondary Stats     |
|-----------------|---------------------|---------------------|
| Flexecutioner   | Strength, Vitality  | Dexterity, Charisma |
| Stormcaller     | Intelligence, Magic | Fortune, Charisma   |
| Cloud Dancer    | Dexterity, Speed    | Fortune, Charisma   |
| Tower (Basic)   | Damage, Range       | Attack Speed        |
| Tower (Support) | Effect Strength     | Area of Effect     |
| Conscript       | Varies by Type      | Loyalty, Potential  |

### Dialogue Guidelines
- Keep lines under 120 characters
- Use consistent speech patterns per character
- Include personality cues in dialogue tags
- Mark special dialogue options with [REQUIREMENT] tags
- Add conscription-specific dialogue variations

### Skill Design Guidelines

#### Naming Conventions
- **Physical Skills**: Use action verbs (e.g., "Power Strike", "Whirlwind Slash")
- **Magic Skills**: Combine element + effect (e.g., "Fireball", "Chain Lightning")
- **Support Skills**: Describe the effect (e.g., "Quick Step", "Taunt")

#### Balancing Guidelines

##### Damage Skills
- **Single Target**: 100-200% of attack
  - Lower MP cost (5-10)
  - Shorter cooldowns (0-2 turns)
- **AoE Skills**: 70-120% of attack
  - Higher MP cost (10-20)
  - Longer cooldowns (3-5 turns)

##### Support Skills
- **Buffs/Debuffs**: 20-40% effect
- **Healing**: 15-30% of target's max HP
- **Status Effects**: 2-3 turn duration

#### Visual Design
- Each skill should have a unique icon
- Color code by element/type:
  - Red: Fire/Offensive
  - Blue: Ice/Defensive
  - Yellow: Lightning/Support
  - Green: Nature/Healing
- Include clear visual effects that match the skill's element and power level

#### Sound Design
- Unique sound effect for each skill category
- Higher level skills should have more complex/impactful sounds
- Include voice lines for special abilities

#### Progression Curve
- New skills every 2-3 levels
- Each skill should feel meaningfully different
- Later skills should be more situational but powerful
- Include at least one "signature" ability per class that defines their playstyle

## Tower Defense Design

### Tower Types
1. **Basic Towers**
   - Balanced stats, low cost
   - Good against standard enemies
   - Multiple upgrade paths

2. **Splash Towers**
   - Area damage
   - Effective against groups
   - Slower attack speed

3. **Sniper Towers**
   - Long range
   - High single-target damage
   - Slower attack speed

4. **Support Towers**
   - Buffs allies/debuffs enemies
   - No direct damage
   - Essential for late-game

5. **Conscript Towers**
   - Deploys conscripted units
   - Scales with conscript level
   - Customizable abilities

### Enemy Types
- **Standard**: Balanced stats
- **Armored**: High defense
- **Swarm**: Low health, high numbers
- **Boss**: Unique abilities, high health
- **Elite**: Mini-bosses with special drops

## Conscript System

### Unit Types
1. **Melee**
   - High health/defense
   - Short range
   - Taunt abilities

2. **Ranged**
   - Lower health
   - Long range
   - Status effects

3. **Support**
   - Healing/buffing
   - Low combat ability
   - Essential for sustain

### Loyalty System
- Affects performance in battle
- Increases through successful missions
- Decreases when defeated
- Special abilities unlock at high loyalty

## Mini-Game Design

### Core Principles
- Easy to learn, hard to master
- Quick to complete (1-5 minutes)
- Rewarding for all skill levels
- Visually distinct from main game

### Integration
- Rewards should benefit main progression
- Include character cameos
- Reference main story elements
- Scale difficulty with player level

## World Building

### New Location Types
4. **Training Grounds**
   - Test new conscripts
   - Practice tower defense
   - Tutorial areas

5. **Mini-Game Hubs**
   - Central locations for mini-games
   - Leaderboards
   - Special events

## Quest Design

### New Quest Types
- **Tower Defense Challenges**: Defend against waves
- **Conscription Quests**: Capture specific enemies
- **Mini-Game Tournaments**: Compete for high scores
- **Tower Blueprint Hunts**: Find rare tower designs

### Reward Tiers

#### Tower Defense Rewards
| Tier | Rewards |
|------|---------|
| 1    | Basic Tower Blueprints, Small Gold |
| 2    | Support Towers, Consumables |
| 3    | Rare Towers, Conscription Items |
| 4    | Unique Towers, Special Abilities |

#### Mini-Game Rewards
| Game Type | Common | Uncommon | Rare |
|-----------|--------|----------|------|
| Memory Match | Gold | Consumables | Conscription Orbs |
| Endless Faller | Materials | Temporary Buffs | Rare Materials |
| Rhythm Game | Upgrade Materials | Character Skins | Special Abilities |
| Tier | XP | Gold | Items | Relationship |
|------|----|------|-------|--------------|
| S    | +++| +++  | Rare  | +2           |
| A    | ++ | ++   | Good  | +1           |
| B    | +  | +    | Common| +0           |

## Asset Specifications

### Sprites
- **Character Sprites**: 64x64 pixels, PNG-24 with transparency
- **Enemy Sprites**: 96x96 pixels, include attack animations
- **Items/Icons**: 32x32 pixels, clear silhouette

### UI Elements
- **Font**: Main UI - [Font Name], 16pt
- **Colors**: Primary #4A90E2, Secondary #F5A623, Accent #E74C3C
- **Buttons**: 200x48px standard size, 4px border radius

### Audio
- **Music**: Loopable, 2-3 minute tracks
- **SFX**: Short (<2s), mono, 44.1kHz
- **Voice**: Optional, but consistent quality if used

## Implementation Notes
- All content must be tagged with appropriate metadata
- Include documentation for custom behaviors
- Follow version control best practices
- Document any dependencies or requirements
