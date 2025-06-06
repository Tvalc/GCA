# Game

A 2D game built with JavaScript, featuring a robust architecture and modern development practices.

## Features

- **Audio System**: Background music, sound effects, and voice lines with volume control
- **Save System**: Multiple save slots, auto-save, and save data management
- **Asset Management**: Loading and managing images, sprites, animations, and fonts
- **Scene Management**: Multiple scenes with transitions and state management
- **Entity System**: Players, enemies, NPCs, items, projectiles, and effects
- **Map System**: Chunk-based maps with dynamic loading and world generation
- **Quest System**: Main quests, side quests, and quest tracking
- **Inventory System**: Item management, equipment, and item usage
- **Combat System**: Attack mechanics, skills, damage calculation, and status effects
- **Skill System**: Combat, magic, support, and passive skills
- **NPC System**: Quest givers, merchants, trainers, and interactions
- **Player System**: Character creation, stats, attributes, and progression
- **UI System**: HUD, menus, notifications, tooltips, and dialogs

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/game.git
   cd game
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Development

Start the development server:
```bash
npm start
```

The game will be available at `http://localhost:5173`.

## Building

Build the game for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Testing

Run tests:
```bash
npm test
```

## Code Quality

Lint code:
```bash
npm run lint
```

Format code:
```bash
npm run format
```

## Project Structure

```
game/
├── src/
│   ├── managers/
│   │   ├── AudioManager.js
│   │   ├── SaveManager.js
│   │   ├── AssetManager.js
│   │   ├── SceneManager.js
│   │   ├── EntityManager.js
│   │   ├── MapManager.js
│   │   ├── QuestManager.js
│   │   ├── InventoryManager.js
│   │   ├── CombatManager.js
│   │   ├── SkillManager.js
│   │   ├── NPCManager.js
│   │   ├── PlayerManager.js
│   │   ├── UIManager.js
│   │   └── GameManager.js
│   └── index.js
├── assets/
│   ├── audio/
│   ├── images/
│   ├── sprites/
│   ├── animations/
│   └── fonts/
├── index.html
├── package.json
└── README.md
```

## Architecture

The game follows a manager-based architecture where each manager is responsible for a specific aspect of the game:

- **GameManager**: Main game loop and manager coordination
- **AudioManager**: Sound effects, music, and voice lines
- **SaveManager**: Game state persistence
- **AssetManager**: Asset loading and management
- **SceneManager**: Scene transitions and state
- **EntityManager**: Game entities and interactions
- **MapManager**: World generation and management
- **QuestManager**: Quest tracking and progression
- **InventoryManager**: Item and equipment management
- **CombatManager**: Combat mechanics and damage
- **SkillManager**: Player skills and abilities
- **NPCManager**: NPC interactions and AI
- **PlayerManager**: Player state and progression
- **UIManager**: User interface and interactions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Howler.js](https://howlerjs.com/) for audio management
- [Vite](https://vitejs.dev/) for development and building
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io/) for code formatting
- [Jest](https://jestjs.io/) for testing 