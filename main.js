# GAME DESIGN DOCUMENT: FORGEBORN: SOLSTICE BREAK

## 1. Game Overview
### Genre
- Side-scrolling beat 'em up
- Action combat with RPG elements
- Hand-crafted levels
- Meta-progression system

### Core Gameplay Loop
1. Choose a Forgeborn character
2. Progress through hand-crafted levels
3. Collect power-ups and story fragments
4. Face bosses and minibosses
5. Die and unlock new content
6. Return stronger for the next run

## 2. Core Mechanics
### Combat System
- Basic attacks (light/heavy)
- Special abilities
- Ultimate moves
- Dodge/block mechanics
- Combo system

### Character Progression
- Experience points
- Ability unlocks
- Power level increases
- New moves and combos
- Character-specific upgrades

### Roguelike Elements
- Permadeath
- Hand-crafted level design
- Random power-ups
- Meta-progression
- Unlockable content

## 3. Level Design
### Structure: Stages, Levels, and Scenes
- The game world is organized into a hierarchy:
  - **Stage:** Major thematic region (e.g., Tempys Territory)
  - **Level:** Distinct sub-area within a stage (e.g., Frozen Wastes, Ice Cave, Frozen Forest)
  - **Scene:** The smallest unit, a vertical segment of a level, each with a unique PNG background

### Vertical Progression
- The player starts at the top of each scene and descends to the bottom.
- Upon reaching the bottom, the next scene loads seamlessly.
- When all scenes in a level are completed, the next level begins, often with a new biome, enemy set, and narrative beat.
- Completing all levels in a stage advances the story to the next major chapter.

### Scene & Background Management
- Each scene loads a specific PNG image as its background, allowing for detailed, atmospheric environments.
- Backgrounds are preloaded at the start of each scene for smooth transitions.
- Scene data includes the PNG filename, enemy spawn patterns, and any special environmental effects.

### Level Design Principles
- Each level tells a story through its environment and scene transitions
- Progressive difficulty curve across scenes and levels
- Unique mechanics and hazards per level
- Secret areas and collectibles within scenes
- Environmental storytelling and lore objects
- Boss arenas and minibosses at key scene transitions

### Example: Stage 1 – Tempys Territory
- **Level 1: Frozen Wastes**
  - Scene 1: frozen_wastes_1.png (open tundra, snow drifts, scattered ruins)
  - Scene 2: frozen_wastes_2.png (ice fissures, howling wind, first enemy ambush)
  - Scene 3: frozen_wastes_3.png (approaching the ice cave entrance, mini-boss)
- **Level 2: Ice Cave**
  - Scene 1: ice_cave_1.png (crystal caverns, slippery floors)
  - Scene 2: ice_cave_2.png (underground river, falling icicles, puzzle element)
- **Level 3: Frozen Forest**
  - Scene 1: frozen_forest_1.png (dense, frost-covered trees, lurking enemies)
  - Scene 2: frozen_forest_2.png (ancient monoliths, magical traps)
  - Scene 3: frozen_forest_3.png (sacred grove, level boss)

### Modularity & Expansion
- Designers can add new scenes by creating new PNGs and updating the scene data.
- Levels and stages can be expanded or reordered without breaking the core progression.
- This system supports both linear and branching paths, secret areas, and replayable content.

---

(Other sections updated for consistency: All references to left-to-right progression, 10-level structure, and old level elements have been removed or revised to match the new system.)

## 4. Character Design
### Playable Characters
1. Korok (Tempys)
   - Stats: High HP, Medium Speed, High Attack
   - Abilities: Fire manipulation, Stone armor, Ground slam
   - Playstyle: Tank with area control

2. Oros (Alloyin)
   - Stats: Low HP, High Speed, Medium Attack
   - Abilities: Energy blasts, Shield projection, Time manipulation
   - Playstyle: Ranged combat with defensive options

3. Cercee (Uterra)
   - Stats: Medium HP, High Speed, Medium Attack
   - Abilities: Plant manipulation, Healing, Nature's fury
   - Playstyle: Support with crowd control

4. Ironbeard (Alloyin)
   - Stats: High HP, Low Speed, High Attack
   - Abilities: Mechanical enhancements, Steam power, Heavy weapons
   - Playstyle: Heavy damage dealer

5. Ignir (Tempys)
   - Stats: Low HP, Very High Speed, Low Attack
   - Abilities: Fire dash, Quick strikes, Combo mastery
   - Playstyle: Fast-paced combo fighter

6. [SECRET] Voss (Nekrium)
   - Unlock Requirements:
     - Complete the game with all 5 main characters
     - Find all Nekrium lore fragments (hidden in levels)
     - Defeat the Nekrium boss without taking damage
   - Stats: Medium HP, Medium Speed, Very High Attack
   - Abilities:
     - Death Touch: Melee attacks have a chance to instantly defeat non-boss enemies
     - Soul Harvest: Collect souls from defeated enemies to power abilities
     - Dark Forge: Temporarily corrupt the SolForge's power for enhanced abilities
     - Undead Minions: Summon corrupted versions of defeated enemies
   - Playstyle: High-risk, high-reward with unique mechanics
   - Special Features:
     - Can see hidden Nekrium paths in levels
     - Access to exclusive Nekrium-themed levels
     - Unique dialogue and story perspectives
     - Corrupted versions of other characters' abilities

### Character Stats
- Health
- Attack Power
- Defense
- Speed
- Special Power

### Character Abilities
- Basic Attacks
- Special Moves
- Ultimate Abilities
- Passive Skills
- Character-specific mechanics

## 5. Enemy Design
### Enemy Types
- Basic enemies
- Elite enemies
- Minibosses
- Bosses
- Darkforged variants

### Enemy Behaviors
- Attack patterns
- Movement patterns
- Special abilities
- Group behaviors
- Boss phases

## 6. Progression Systems
### Score-Based Progression
All unlocks are determined by the player's current high score in Farcade. When the game starts, it checks the current high score and unlocks content accordingly. No persistent storage is used - everything is based on the current session's high score.

#### Score Milestones
1. 0-10,000 Points
   - Basic character abilities
   - First level access
   - Basic power-ups

2. 10,001-25,000 Points
   - Secondary abilities
   - Second level access
   - New power-up types
   - Basic character skins

3. 25,001-50,000 Points
   - Advanced abilities
   - Third level access
   - Special power-ups
   - Advanced character skins

4. 50,001-100,000 Points
   - Ultimate abilities
   - Fourth level access
   - Legendary power-ups
   - Premium character skins

5. 100,001-200,000 Points
   - Secret character (Voss)
   - Fifth level access
   - Unique power-ups
   - Special effects and animations

6. 200,001-500,000 Points
   - Sixth level access
   - Advanced power-up combinations
   - Special visual effects
   - Additional character customization

7. 500,001-1,000,000 Points
   - Seventh level access
   - Legendary power-up combinations
   - Unique visual effects
   - Special character animations

8. 1,000,001-2,000,000 Points
   - Eighth level access
   - Ultimate power-up combinations
   - Special particle effects
   - Character transformation effects

9. 2,000,001-5,000,000 Points
   - Ninth level access
   - Secret power-up combinations
   - Special screen effects
   - Character evolution effects

10. 5,000,001+ Points
    - Final level access
    - All power-ups unlocked
    - All visual effects unlocked
    - Complete character customization

### Score Mechanics

#### Base Scoring
- Basic enemy defeat: 100 points
- Elite enemy defeat: 500 points
- Mini-boss defeat: 1,000 points
- Boss defeat: 5,000 points
- Environmental destruction: 50 points
- Secret area discovery: 1,000 points

#### Combo System
- Hit counter increases with each successful hit
- Combo multiplier increases score for consecutive hits
- Combo breaks if:
  - Player takes damage
  - Too much time passes between hits
  - Player misses an attack
- Combo tiers:
  - 5 hits: 1.5x multiplier
  - 10 hits: 2x multiplier
  - 15 hits: 2.5x multiplier
  - 20 hits: 3x multiplier
  - 30+ hits: 4x multiplier

#### Bonus Points
- No-damage bonus: 2x score for completing a level without taking damage
- Speed bonus: Additional points for completing levels quickly
- Style bonus: Points for using different moves and combinations
- Environmental bonus: Points for using the environment in combat

### Power-Up System
- Power-ups appear during gameplay
- Each power-up has a score requirement to use
- Power-ups last for the current level only
- Higher score thresholds unlock more powerful combinations

### Level Access
- Each level requires a minimum score to access
- Score is checked at the start of each session
- No progress is saved between sessions
- All unlocks are based on current high score

### Technical Implementation
- Farcade high score integration
- Score verification at session start
- No persistent storage
- All unlocks determined by current high score

### User Interface
- Current high score display
- Next unlock threshold indicator
- Combo counter and multiplier display
- Score breakdown at level end
- Unlock notifications

## 7. UI/UX Design
### HUD Elements
- Health bar
- Power meter
- Combo counter
- Mini-map
- Objective markers

### Menu Systems
- Character select
- Ability tree
- Story archive
- Settings
- Progress tracking

## 8. Technical Requirements
### Platform
- PC (Windows)
- Target resolution: 1920x1080
- 60 FPS target

### Controls
- Keyboard/Mouse
- Gamepad support
- Customizable controls

## 9. Art Style
### Visual Direction
- 2D pixel art
- Dynamic lighting
- Particle effects
- Environmental effects
- Character animations

### Audio Design
- Dynamic music system
- Character voice lines
- Environmental sounds
- Combat effects
- Ambient tracks

## 10. Monetization
### Business Model
- Premium game
- No microtransactions
- Potential DLC content
- Future content updates

## 11. Development Roadmap
### Phase 1
- Core mechanics
- Basic level generation
- Character implementation
- Combat system

### Phase 2
- Full level system
- Boss implementation
- Story integration
- Meta-progression

### Phase 3
- Polish
- Balance
- Bug fixes
- Release preparation

## Technical Architecture Overview

To ensure maintainability, extensibility, and Farcade compatibility, the game will be built as a single HTML file with modular, well-organized code. The architecture is designed for clarity, separation of concerns, and ease of debugging and future expansion.

### Core Principles
- **Single HTML file** (for Farcade)
- **Modular code** using ES6 classes and functions (all in one `<script>`)
- **Separation of concerns**: game loop, rendering, input, entities, UI, etc.
- **Lightweight and readable**: no bloat, easy to debug and extend

### Suggested Architecture

#### A. HTML Structure
- `<canvas>` for rendering
- Minimal CSS for centering and background

#### B. JavaScript Modules (in one script tag)
1. **Constants & Config**
   - Game dimensions, world size, colors, etc.
2. **Utility Functions**
   - Clamp, random, etc.
3. **Input Manager**
   - Handles keyboard (and later, gamepad) input
4. **Game Loop**
   - Handles update and render at a fixed timestep
5. **Camera**
   - Handles viewport logic (follows player, clamps to world)
6. **Entity System**
   - Base `Entity` class
   - `Player` class (inherits Entity)
   - (Later: `Enemy`, `Pickup`, etc.)
7. **Level/World**
   - Handles level data, ground, backgrounds
8. **Renderer**
   - Draws entities, backgrounds, UI, debug overlay
9. **UI/HUD**
   - Draws score, health, etc.
10. **Debug Tools**
    - Toggleable overlay for positions, camera, etc.
11. **Game State Manager**
    - Handles start, running, pause, game over, etc.

#### Example File Skeleton
```html
<!DOCTYPE html>
<html>
<head>
  <title>Forgeborn: Solstice Break</title>
  <style>
    body { margin: 0; background: #111; display: flex; justify-content: center; align-items: center; height: 100vh; }
    canvas { border: 2px solid #333; }
  </style>
</head>
<body>
  <canvas id="game" width="800" height="600"></canvas>
  <script>
    // 1. Constants & Config
    // 2. Utility Functions
    // 3. Input Manager
    // 4. Game Loop
    // 5. Camera
    // 6. Entity System (Entity, Player, ...)
    // 7. Level/World
    // 8. Renderer
    // 9. UI/HUD
    // 10. Debug Tools
    // 11. Game State Manager
    // 12. Game Initialization
  </script>
</body>
</html>
```

### Development Approach
- Confirm or adjust this architecture as needed.
- Prioritize which systems to implement first (e.g., player movement, camera, input).
- Build and test each module in small, testable steps before moving on.

## Vertical Progression Update

- The player now traverses from the bottom of the screen to the top (vertical progression), rather than left-to-right.
- The game is optimized for phone screens and vertical play (portrait orientation).
- Scene transitions occur when the player reaches the top of the background; a new scene/level loads and the player continues upward.
- Enemies attack from above, sides, or spawn along the vertical path.
- Camera follows the player vertically, clamped to the world bounds.
- All level design, camera, and enemy logic should reflect this vertical movement.
- UI and HUD elements should be positioned for vertical play (e.g., health at the top, controls at the bottom if needed).
- Technical architecture and entity logic remain modular, but all movement, rendering, and input logic should assume vertical progression as the default.

## Level & Scene Structure (Expanded)

### Overview
The game world is organized into a hierarchy of Stages, Levels, and Scenes to support both narrative depth and gameplay variety:
- **Stage:** A major thematic area with its own lore, enemies, and environmental hazards. Each stage represents a chapter in the story.
- **Level:** A distinct sub-area within a stage, with unique objectives, enemy types, and environmental features. Levels are designed to escalate challenge and reveal new story elements.
- **Scene:** The smallest unit of progression. Each scene is a vertical segment of a level, represented by a unique PNG background. Scenes provide visual and gameplay variety within a level.

### Background Management
- Each scene loads a specific PNG image as its background, allowing for detailed, atmospheric environments.
- Backgrounds are preloaded at the start of each scene to ensure smooth transitions.
- Scene data includes the PNG filename, enemy spawn patterns, and any special environmental effects.

### Progression & Narrative Integration
- The player starts at the top of each scene and descends to the bottom. Upon reaching the bottom, the next scene loads seamlessly.
- When all scenes in a level are completed, the next level begins, often with a new biome, enemy set, and narrative beat.
- Completing all levels in a stage advances the story to the next major chapter, with new lore, cutscenes, and gameplay twists.
- This structure allows for modular expansion: new scenes, levels, or entire stages can be added without disrupting existing content.

### Example: Stage 1 – Tempys Territory
**Narrative Context:**
The Forgeborn enter the harsh, wind-blasted lands of the Tempys, seeking the first fragment of the SolForge. The journey tests their resolve against the elements and the Tempys' own guardians.

- **Level 1: Frozen Wastes**
  - *Objective:* Survive the blizzard and defeat Tempys scouts.
  - *Scenes:*
    - Scene 1: frozen_wastes_1.png (open tundra, snow drifts, scattered ruins)
    - Scene 2: frozen_wastes_2.png (ice fissures, howling wind, first enemy ambush)
    - Scene 3: frozen_wastes_3.png (approaching the ice cave entrance, mini-boss)
- **Level 2: Ice Cave**
  - *Objective:* Navigate the labyrinthine ice tunnels and avoid environmental hazards.
  - *Scenes:*
    - Scene 1: ice_cave_1.png (crystal caverns, slippery floors)
    - Scene 2: ice_cave_2.png (underground river, falling icicles, puzzle element)
- **Level 3: Frozen Forest**
  - *Objective:* Find the hidden druidic altar while fending off corrupted wildlife.
  - *Scenes:*
    - Scene 1: frozen_forest_1.png (dense, frost-covered trees, lurking enemies)
    - Scene 2: frozen_forest_2.png (ancient monoliths, magical traps)
    - Scene 3: frozen_forest_3.png (sacred grove, level boss)

### Modularity & Expansion
- Designers can add new scenes by creating new PNGs and updating the scene data.
- Levels and stages can be expanded or reordered without breaking the core progression.
- This system supports both linear and branching paths, secret areas, and replayable content.

---

## Art & Technical Notes
- PNG backgrounds should be optimized for mobile performance and vertical scrolling.
- Each scene's PNG should align seamlessly with the next for smooth transitions.
- Scene data is stored in a structured format (e.g., JSON or JS object) for easy management. 