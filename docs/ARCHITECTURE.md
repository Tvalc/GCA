# Glitter Cloud Adventure: Core Architecture Document

## 1. Architectural Foundation

This architecture prioritizes scalability, iteration, and maintainability while keeping everything in a single HTML file for Farcade compatibility.

### 1.1 Guiding Principles

- **Module Independence**: Systems communicate through well-defined interfaces, not direct dependencies
- **Data-Driven Design**: Game content defined through data, not hard-coded logic
- **Progressive Enhancement**: Core systems work from day one, with advanced features added iteratively
- **Event-Based Communication**: Systems interact through events rather than tight coupling
- **Namespaced Organization**: Clear organization despite single-file constraint

## 2. Core Framework

### 2.1 Namespace Structure

```javascript
window.GCA = {
  Core: {},        // Engine fundamentals
  Systems: {
    Dungeon: {},   // Arcade/JRPG gameplay systems
    Surface: {},   // Strategy/4X gameplay systems
    Shared: {}     // Systems used by both storylines
  },
  Data: {},        // Game content/definitions
  Managers: {},    // Global resource managers
  UI: {},          // User interface components
  Utils: {},       // Utility functions
  Config: {}       // Configuration settings
};
```

### 2.2 Module Pattern

All systems use the module pattern for encapsulation:

```javascript
GCA.Systems.Dungeon.Combat = (function() {
  // Private variables and functions
  let state = { /* ... */ };
  
  function privateMethod() { /* ... */ }
  
  // Public API
  return {
    initialize: function() { /* ... */ },
    startCombat: function() { /* ... */ },
    processTurn: function() { /* ... */ },
    // Additional public methods
  };
})();
```

### 2.3 Event System

Central event system for decoupled communication:

```javascript
GCA.Core.EventSystem = (function() {
  const listeners = new Map();
  
  function on(event, callback) {
    if (!listeners.has(event)) {
      listeners.set(event, []);
    }
    listeners.get(event).push(callback);
    return function unsubscribe() { /* ... */ };
  }
  
  function emit(event, data) {
    if (listeners.has(event)) {
      listeners.get(event).forEach(callback => callback(data));
    }
  }
  
  return { on, emit };
})();

// Example usage
GCA.Core.EventSystem.on('combat:start', data => {
  // React to combat starting
});
```

## 3. Storyline Management

### 3.1 Dual-Storyline Framework

```javascript
GCA.Systems.StorylineManager = (function() {
  let currentStoryline = 'dungeon'; // 'dungeon' or 'surface'
  
  function switchStoryline(target, reason = 'manual') {
    // Save current storyline state
    // Load target storyline state
    // Update UI
    // Emit event
  }
  
  function initialize() {
    // Set up storyline switching UI
    // Load initial storyline
  }
  
  // Public API
  return {
    initialize,
    switchStoryline,
    getCurrentStoryline: () => currentStoryline
  };
})();
```

### 3.2 Resource Exchange

```javascript
GCA.Systems.Shared.ResourceExchange = (function() {
  const pendingTransfers = {
    dungeon: [], // Resources waiting to be claimed by surface
    surface: []  // Resources waiting to be claimed by dungeon
  };
  
  function sendResource(fromStoryline, resource) {
    // Remove from sender
    // Add to pending transfers
  }
  
  function claimResource(storyline, transferId) {
    // Find transfer in pending list
    // Add to recipient inventory
  }
  
  // Public API
  return {
    sendResource,
    claimResource,
    getPendingTransfers: storyline => [...pendingTransfers[storyline]]
  };
})();
```

## 4. Game Systems

### 4.1 Registration Pattern

All game content uses a registration pattern for unlimited expansion:

```javascript
GCA.Registry = (function() {
  return {
    registerArea(id, areaData) {
      GCA.Data.Areas[id] = areaData;
    },
    
    registerNPC(id, npcData) {
      GCA.Data.NPCs[id] = npcData;
    },
    
    registerEnemy(id, enemyData) {
      GCA.Data.Enemies[id] = enemyData;
    },
    
    registerItem(id, itemData) {
      GCA.Data.Items[id] = itemData;
    },
    
    registerRelic(id, relicData) {
      GCA.Data.Relics[id] = relicData;
    },
    
    registerMiniGame(id, miniGameData) {
      GCA.Data.MiniGames[id] = miniGameData;
    }
  };
})();
```

### 4.2 State Management

Centralized state with controlled mutations:

```javascript
GCA.Managers.StateManager = (function() {
  // Core game state
  let state = {
    dungeon: {
      player: null,
      party: [],
      currentArea: null,
      inventory: [],
      quests: {},
      combat: null
    },
    surface: {
      resources: {},
      buildings: [],
      citizens: [],
      research: {},
      defenses: []
    },
    shared: {
      relics: {},
      saveTimestamp: null,
      gameTime: 0
    }
  };
  
  // Update state with validation
  function updateState(path, value) {
    // Apply update to specific path in state
    // Validate and sanitize input
    // Notify listeners
  }
  
  // Public API
  return {
    getState: () => JSON.parse(JSON.stringify(state)), // Return copy
    updateState,
    getDungeonState: () => JSON.parse(JSON.stringify(state.dungeon)),
    getSurfaceState: () => JSON.parse(JSON.stringify(state.surface))
  };
})();
```

## 5. Scalable Content Systems

### 5.1 Area System

```javascript
// Example area registration
GCA.Registry.registerArea('arcade1', {
  id: 'arcade1',
  name: 'Arcade One',
  type: 'dungeon',
  mapData: {
    width: 30,
    height: 20,
    collisionMap: { /* ... */ },
    backgroundImage: 'arcade_floor.png'
  },
  npcs: ['glitch_guide', 'arcade_keeper'],
  enemies: {
    types: ['byte_bug', 'pixel_pirate'],
    spawnRate: 0.3
  },
  objects: [
    { id: 'arcade_machine_1', type: 'mini_game', x: 5, y: 10, gameId: 'space_invaders' }
  ],
  transitions: [
    { x: 0, y: 10, targetArea: 'arcade2', targetX: 29, targetY: 10 }
  ]
});
```

### 5.2 Enemy System

```javascript
// Example enemy registration
GCA.Registry.registerEnemy('byte_bug', {
  id: 'byte_bug',
  name: 'Byte Bug',
  sprite: 'byte_bug.png',
  stats: {
    baseLevel: 1,
    hp: 20,
    strength: 3,
    defense: 2,
    speed: 4
  },
  attacks: [
    { id: 'byte', name: 'Byte', damage: { min: 2, max: 5 }, accuracy: 0.9 }
  ],
  loot: {
    guaranteed: [{ itemId: 'byte_fragment', count: { min: 1, max: 3 } }],
    chance: [{ itemId: 'debug_potion', chance: 0.1 }]
  }
});
```

### 5.3 Character System

```javascript
GCA.Systems.Shared.Character = (function() {
  // Character creation with class-based starting stats
  function createCharacter(name, classId) {
    const classData = GCA.Data.Classes[classId];
    return {
      id: generateId(),
      name,
      class: classId,
      level: 1,
      experience: 0,
      stats: classData.getBaseStats(),
      skills: { ...classData.baseSkills },
      equipment: {},
      relics: {}
    };
  }
  
  // Level up system
  function levelUp(character) {
    // Increase level
    // Gain stat points
    // Unlock skills based on level
    // Update derived stats
  }
  
  // Public API
  return {
    createCharacter,
    levelUp,
    calculateCombatStats,
    applyEquipment,
    // Additional methods
  };
})();
```

### 5.4 Relic System

```javascript
GCA.Systems.Shared.Relic = (function() {
  // Assign relic to character
  function assignRelic(characterId, relicId) {
    // Create relic instance for character
    // Initialize at level 1
    // Apply level 1 abilities/bonuses
  }
  
  // Add fury to level up relic
  function addFury(characterId, relicId, amount) {
    // Add fury points
    // Check for level up
    // Apply new abilities if leveled up
  }
  
  // Master relic at max level
  function masterRelic(characterId, relicId) {
    // Permanently unlock all abilities
    // Apply mastery bonuses
  }
  
  // Public API
  return {
    assignRelic,
    addFury,
    masterRelic,
    // Additional methods
  };
})();
```

## 6. Combat System

### 6.1 Dice-Based Combat Framework

```javascript
GCA.Systems.Dungeon.Combat = (function() {
  function rollDice(sides, count = 1, modifier = 0) {
    let total = 0;
    for (let i = 0; i < count; i++) {
      total += Math.floor(Math.random() * sides) + 1;
    }
    return total + modifier;
  }
  
  function calculateHitChance(attacker, defender) {
    // Base hit chance modified by stats
    const baseChance = 70;
    const attackerDexMod = attacker.stats.dexterity * 2;
    const defenderDexMod = defender.stats.dexterity * 1.5;
    return Math.min(95, Math.max(5, baseChance + attackerDexMod - defenderDexMod));
  }
  
  function resolveAttack(attacker, defender, attackData) {
    // Roll to hit
    const hitChance = calculateHitChance(attacker, defender);
    const hitRoll = rollDice(100);
    
    if (hitRoll > hitChance) {
      return { hit: false, damage: 0, critical: false };
    }
    
    // Roll for critical
    const critChance = 5 + Math.floor(attacker.stats.fortune / 2);
    const critRoll = rollDice(100);
    const isCritical = critRoll <= critChance;
    
    // Calculate damage
    const baseDamage = attackData.baseDamage || attacker.stats.strength;
    const damageRoll = rollDice(attackData.damageDice.sides, attackData.damageDice.count);
    let damage = baseDamage + damageRoll;
    
    // Apply critical multiplier
    if (isCritical) {
      damage = Math.floor(damage * 1.5);
    }
    
    // Apply defense reduction
    damage = Math.max(1, damage - defender.stats.defense);
    
    return { hit: true, damage, critical: isCritical };
  }
  
  // Public API
  return {
    rollDice,
    resolveAttack,
    startCombat,
    endCombat,
    // Additional methods
  };
})();
```

### 6.2 Turn-Based Combat Flow

```javascript
function startCombat(playerParty, enemies) {
  // Initialize combat state
  const combatState = {
    playerParty,
    enemies,
    turnOrder: [],
    currentTurn: -1,
    round: 1,
    status: 'active'
  };
  
  // Determine turn order based on speed
  const allCombatants = [...playerParty, ...enemies];
  combatState.turnOrder = allCombatants
    .map(c => ({ id: c.id, initiative: rollDice(20) + c.stats.speed }))
    .sort((a, b) => b.initiative - a.initiative);
  
  // Start first turn
  advanceTurn(combatState);
  
  return combatState;
}
```

## 7. Mini-Game Framework

### 7.1 Mini-Game Integration

```javascript
GCA.Systems.Dungeon.MiniGame = (function() {
  function registerMiniGame(config) {
    // Store mini-game definition
    // Set up high score tracking
  }
  
  function startMiniGame(miniGameId, characterId) {
    // Get mini-game definition
    // Initialize game state based on character stats
    // Set up UI
  }
  
  function endMiniGame(score, state) {
    // Calculate rewards based on score
    // Update high scores
    // Grant items/experience
  }
  
  // Public API
  return {
    registerMiniGame,
    startMiniGame,
    endMiniGame,
    // Additional methods
  };
})();
```

### 7.2 Character Stat Integration

```javascript
function initializeMiniGameState(miniGame, character) {
  // Base difficulty on area and character level
  const difficulty = calculateDifficulty(character, miniGame);
  
  // Apply character stats to game parameters
  const gameParams = {
    playerSpeed: 1 + (character.stats.dexterity * 0.05),
    playerStrength: 1 + (character.stats.strength * 0.05),
    playerHealth: 3 + Math.floor(character.stats.vitality / 5),
    scoreMultiplier: 1 + (character.stats.fortune * 0.02),
    difficulty
  };
  
  return {
    miniGameId: miniGame.id,
    characterId: character.id,
    params: gameParams,
    score: 0,
    startTime: Date.now(),
    gameSpecificState: {}
  };
}
```

## 8. Saving & Loading

### 8.1 Comprehensive Save System

```javascript
GCA.Managers.SaveManager = (function() {
  const SAVE_VERSION = '1.0.0';
  
  function save() {
    const dungeonState = GCA.Managers.StateManager.getDungeonState();
    const surfaceState = GCA.Managers.StateManager.getSurfaceState();
    const sharedState = GCA.Managers.StateManager.getSharedState();
    
    const saveData = {
      version: SAVE_VERSION,
      timestamp: Date.now(),
      dungeon: dungeonState,
      surface: surfaceState,
      shared: sharedState
    };
    
    try {
      localStorage.setItem('GCA_SAVE', JSON.stringify(saveData));
      return true;
    } catch (err) {
      console.error('Failed to save game:', err);
      return false;
    }
  }
  
  function load() {
    try {
      const saveData = JSON.parse(localStorage.getItem('GCA_SAVE'));
      if (!saveData) return false;
      
      // Version migration if needed
      if (saveData.version !== SAVE_VERSION) {
        migrateSaveData(saveData);
      }
      
      // Restore game state
      GCA.Managers.StateManager.restoreState(saveData);
      return true;
    } catch (err) {
      console.error('Failed to load game:', err);
      return false;
    }
  }
  
  // Public API
  return {
    save,
    load,
    hasSaveData: () => !!localStorage.getItem('GCA_SAVE')
  };
})();
```

## 9. Implementation Strategy

### 9.1 Phased Implementation

1. **Foundation Phase** (1-2 weeks)
   - Core structure and namespaces
   - Event system
   - State management
   - Basic UI framework

2. **Dungeon Systems** (2-3 weeks)
   - Character system
   - JRPG combat
   - Basic inventory
   - First area implementation

3. **Surface Systems** (2-3 weeks)
   - Resource management
   - Building system
   - Defense mechanics

4. **Integration Phase** (1-2 weeks)
   - Resource exchange
   - Story progression sync
   - Save/load system

5. **Content Expansion** (ongoing)
   - Additional areas, enemies, items
   - New mini-games
   - More relics and abilities

### 9.2 Test-Driven Implementation

Each system should be implemented with:

1. Basic framework with minimal features
2. Comprehensive unit tests
3. Integration with related systems
4. UI components and player feedback
5. Progressive enhancement

## 10. Iteration & Expansion Guidelines

### 10.1 Adding New Content

For adding new areas, enemies, items, etc.:

```javascript
// Step 1: Define the content data
const newArea = {
  id: 'cyber_forest',
  name: 'Cyber Forest',
  /* other properties */
};

// Step 2: Register with the system
GCA.Registry.registerArea('cyber_forest', newArea);

// Step 3: Connect to existing content (e.g., add transition)
GCA.Data.Areas['arcade2'].transitions.push({
  x: 15, 
  y: 0, 
  targetArea: 'cyber_forest', 
  targetX: 15, 
  targetY: 19
});
```

### 10.2 Extending Systems

To add new features to existing systems:

1. Extend the public API of the relevant module
2. Update related systems to use the new functionality
3. Add UI components if needed
4. Update documentation

### 10.3 Optimization Strategies

For performance as the game grows:

1. Lazy initialization of systems
2. On-demand loading of assets
3. Spatial partitioning for collision detection
4. Object pooling for frequently created/destroyed entities
