# Game Systems

## Overview
This document outlines the major systems that make up the game, their interactions, and their responsibilities.

## Core Systems

### 1. Combat System
- Handles turn-based combat mechanics
- Manages enemy spawning and behavior
- Processes player and enemy actions
- Calculates damage and effects
- Integrates with bestiary for kill tracking
- Manages type effectiveness and resistances
- Handles status effects and buffs/debuffs
- Processes combat rewards and achievements
- Tracks skill usage and combinations
- Manages critical hits and combos
- Processes type-specific achievements
- Handles combat milestone tracking

### 2. Bestiary System
- Tracks discovered monsters
- Records kill counts
- Displays monster information
- Manages monster images and data
- Persists bestiary progress
- Tracks achievements
- Manages type information
- Handles monster discovery rewards
- Tracks type-specific kills
- Manages monster-specific achievements
- Displays achievement progress
- Handles reward distribution

### 3. Player System
- Manages player stats and progression
- Handles inventory and equipment
- Tracks quest progress
- Manages save/load functionality
- Processes experience and leveling
- Handles ability learning and usage
- Manages status effects
- Tracks achievements
- Manages type mastery
- Tracks skill usage
- Handles achievement points
- Manages reward distribution

### 4. UI System
- Renders game interface
- Manages menus and HUD
- Handles bestiary book interface
- Processes user input
- Displays combat information
- Shows type effectiveness
- Manages achievement notifications
- Displays status effects
- Shows achievement progress
- Displays reward notifications
- Manages skill usage tracking
- Shows type mastery progress

### 5. Save System
- Persists game state
- Manages bestiary data
- Stores player progress
- Handles settings
- Saves achievements
- Manages type discoveries
- Stores kill counts
- Handles equipment and inventory
- Saves achievement progress
- Stores type mastery
- Manages skill usage data
- Handles reward tracking

### 6. Type System
- Manages type effectiveness
- Handles type-based abilities
- Controls type resistances
- Processes type advantages
- Manages type-based status effects
- Handles type discovery
- Controls type-based rewards
- Manages type combinations
- Tracks type mastery
- Handles type achievements
- Manages type-specific rewards
- Controls type effectiveness scaling

### 7. Achievement System
- Tracks bestiary completion
- Records first-time monster discoveries
- Manages kill count milestones
- Handles type mastery achievements
- Processes combat achievements
- Manages reward distribution
- Tracks player progression
- Handles achievement notifications
- Manages skill usage tracking
- Tracks type-specific achievements
- Handles combat milestone tracking
- Manages achievement points

## System Interactions

### Combat → Bestiary
- Records monster kills
- Updates discovery status
- Triggers bestiary UI updates
- Awards achievements
- Updates type effectiveness
- Tracks skill usage
- Manages combat milestones
- Updates kill counts
- Triggers type achievements
- Handles reward distribution

### Bestiary → UI
- Provides monster data for display
- Manages bestiary book interface
- Updates kill counts and discoveries
- Shows type information
- Displays achievements
- Shows achievement progress
- Displays reward information
- Manages type mastery display
- Shows skill usage tracking
- Updates combat statistics

### Player → Combat
- Provides player stats and abilities
- Manages combat rewards
- Tracks experience gain
- Handles status effects
- Processes type advantages
- Manages achievement progress
- Tracks skill usage
- Handles type mastery
- Processes combat milestones
- Manages reward distribution

### Save → All Systems
- Persists system states
- Loads saved progress
- Manages data consistency
- Handles achievements
- Stores type discoveries
- Saves achievement progress
- Manages skill usage data
- Stores type mastery
- Handles reward tracking
- Manages combat statistics

### Type → Combat
- Calculates damage effectiveness
- Manages type-based abilities
- Controls status effects
- Processes resistances
- Handles type combinations
- Tracks type mastery
- Manages type achievements
- Handles type-specific rewards
- Controls effectiveness scaling
- Processes type milestones

### Achievement → All Systems
- Tracks system progress
- Awards achievements
- Manages rewards
- Updates UI notifications
- Persists completion status
- Tracks skill usage
- Manages type mastery
- Handles combat milestones
- Processes reward distribution
- Updates achievement points

## Recent Additions

### Bestiary Integration
1. **Data Management**
   - Monster data loaded from markdown files
   - Kill counts stored in localStorage
   - Image assets managed in dedicated directory
   - Type information integrated
   - Achievement tracking added
   - Skill usage tracking
   - Type mastery system
   - Combat milestone tracking

2. **UI Components**
   - Book-like interface
   - Monster entry cards
   - Navigation system
   - Kill count tracking
   - Type effectiveness display
   - Achievement notifications
   - Skill usage display
   - Type mastery progress
   - Combat statistics
   - Reward information

3. **Combat Integration**
   - Automatic kill recording
   - Discovery system
   - Reward tracking
   - Type effectiveness
   - Achievement triggers
   - Skill usage tracking
   - Type mastery updates
   - Combat milestone tracking
   - Reward distribution
   - Achievement progress

### Universal Enemy Types
- Standardized type system
- Type-based abilities
- Consistent effectiveness
- Achievement integration
- Type mastery system
- Skill usage tracking
- Combat milestone system
- Reward distribution
- Type-specific achievements
- Effectiveness scaling

## Technical Requirements

### Bestiary System
- Markdown parsing for monster data
- Image asset management
- Local storage for persistence
- Responsive UI components
- Type system integration
- Achievement tracking
- Skill usage tracking
- Type mastery system
- Combat milestone tracking
- Reward distribution

### Combat System
- Turn-based action processing
- Status effect management
- Reward calculation
- Bestiary integration
- Type effectiveness
- Achievement triggers
- Skill usage tracking
- Type mastery updates
- Combat milestone tracking
- Reward distribution

### UI System
- Responsive design
- Dynamic content loading
- State management
- User input handling
- Type information display
- Achievement notifications
- Skill usage display
- Type mastery progress
- Combat statistics
- Reward information

### Type System
- Effectiveness calculations
- Resistance management
- Ability integration
- Status effect control
- Achievement tracking
- Discovery system
- Type mastery tracking
- Skill usage integration
- Combat milestone system
- Reward distribution

## Future Considerations

### Bestiary Enhancements
- Advanced monster behavior
- Type evolution system
- Achievement integration
- Enhanced discovery system
- Skill usage analytics
- Type mastery progression
- Combat milestone tracking
- Reward system expansion
- Achievement progression
- Type effectiveness scaling

### Combat Improvements
- Advanced type system
- Achievement-based rewards
- Enhanced status effects
- Dynamic difficulty
- Skill combination system
- Type mastery integration
- Combat milestone system
- Reward distribution
- Achievement progression
- Effectiveness scaling

### Type System Improvements
- Advanced combinations
- Environmental effects
- Mastery system
- Quest integration
- Skill usage tracking
- Combat milestone system
- Achievement progression
- Reward distribution
- Type effectiveness scaling
- Mastery progression 