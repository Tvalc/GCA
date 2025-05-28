# Glitter Cloud Adventure - World Map

This document outlines the world map structure for Glitter Cloud Adventure, designed as a SNES-style RPG with scene-to-scene transitions. Each stage contains 3-5 unique scenes with their own background images and collision mapping.

## World Structure Overview

```
                                              ┌─────────────────┐
                                              │   B10: Binary   │
                                              │   Singularity   │
                                              └────────┬────────┘
                                                       │
                                              ┌────────▼────────┐
                                              │    B9: Cyber    │
                                              │     Citadel     │
                                              └────────┬────────┘
                                                       │
                                              ┌────────▼────────┐
                                              │ B8: Corrupted   │
                                              │      Core       │
                                              └────────┬────────┘
                                                       │
                                              ┌────────▼────────┐
                                              │  B7: Digital    │
                                              │   Dreamscape    │
                                              └────────┬────────┘
                                                       │
                                              ┌────────▼────────┐
                                              │  B6: Quantum    │
                                              │     Realm       │
                                              └────────┬────────┘
                           ┌───────────────────┬──────┴───────┬───────────────────┐
                           │                   │              │                   │
                     ┌─────▼─────┐      ┌──────▼───────┐ ┌────▼──────┐     ┌──────▼─────┐
                     │ B2: Cloudy │      │ B3: Great    │ │ B4: Deep  │     │ B5: Network│
                     │ with Data  │      │  Firewall    │ │Web Diving │     │   Nexus    │
                     └─────┬─────┘      └──────┬───────┘ └────┬──────┘     └──────┬─────┘
                           │                   │              │                   │
                           └───────────────────┬──────┬───────┴───────────────────┘
                                               │      │
                                         ┌─────▼──────▼─────┐
                                         │   B1: Digital    │
                                         │      Dawn        │
                                         └──────────────────┘

                               ╔═══════════════════════════╗
                               ║                           ║
                               ║  BS: DIGITAL PURGATORY    ║ ← (Secret Stage, accessible only 
                               ║  (SECRET CHALLENGE AREA)  ║    with the "Chaos Protocol" relic)
                               ║                           ║
                               ╚═══════════════════════════╝
```

## Detailed Scene Descriptions

### B1: Digital Dawn (Starting Area)
*The beginning of the digital journey, featuring simple internet landscapes and basic connectivity areas.*

1. **Tutorial Plaza** - A bright, open area with glowing pathways and simple digital structures. This is where players learn basic controls.
   - *Visual Theme*: Clean, bright digital space with tutorial signposts and basic NPCs
   - *Key Elements*: Training dummies, navigation markers, help desk

2. **Packet Village** - A small settlement made of data packet structures where friendly NPCs reside.
   - *Visual Theme*: Cozy data structures forming houses and shops
   - *Key Elements*: Item shop, save point, quest givers

3. **Login Gateway** - A large portal area with authentication mechanisms and security checkpoints.
   - *Visual Theme*: Vast gateway with login terminals and security scanners
   - *Key Elements*: Security guard NPCs, password puzzles, The Moderator (boss arena)

4. **Binary Forest** - A forest made of binary trees with 0s and 1s as leaves.
   - *Visual Theme*: Glowing binary digits forming tree-like structures
   - *Key Elements*: Hidden treasures, binary puzzles, first encounters with Bit enemies

### B2: Cloudy with Data
*A stage representing cloud storage and data centers with weather-themed digital elements.*

1. **Cloud Server Hub** - A vast space with floating cloud platforms and data streams.
   - *Visual Theme*: White and blue cloud formations with data flowing between them
   - *Key Elements*: Jumping cloud platforms, data stream transportation

2. **Storage Warehouse** - Enormous facility with countless rows of data storage units.
   - *Visual Theme*: Endless rows of server racks with blinking lights
   - *Key Elements*: Storage puzzles, data fragment collection challenges

3. **Weather Control Station** - Area where digital weather patterns are created and regulated.
   - *Visual Theme*: Control panels affecting cloud formations and data rain
   - *Key Elements*: Weather control puzzles, storm warning systems

4. **Backup Vault** - Heavily secured area containing backup copies of important data.
   - *Visual Theme*: Fortress-like structure with redundant security systems
   - *Key Elements*: Security bypass puzzles, The Administrator (boss arena)

### B3: Great Firewall
*A massive defensive wall stage with security features and protective measures.*

1. **Perimeter Defense** - The outer edge of the firewall with initial security measures.
   - *Visual Theme*: Tall digital wall with glowing security symbols and patrolling sentries
   - *Key Elements*: Security checkpoints, patrolling Guard enemies

2. **Authentication Chamber** - Area where credentials are verified and access is controlled.
   - *Visual Theme*: Complex security terminals with ID verification systems
   - *Key Elements*: Password puzzles, keycard collection

3. **Filter Maze** - Complex maze-like structure that filters out unauthorized traffic.
   - *Visual Theme*: Labyrinthine pathways with content filtering mechanisms
   - *Key Elements*: Navigation puzzles, packet inspection challenges

4. **Core Security Center** - The central command hub of the firewall's defense systems.
   - *Visual Theme*: High-tech control room with monitoring screens and alert systems
   - *Key Elements*: Security override puzzles, The Blocker (boss arena)

5. **Emergency Protocols** - Special area that activates during security breaches.
   - *Visual Theme*: Red-alert environment with flashing warnings and emergency systems
   - *Key Elements*: Timed escape sequences, security bypass challenges

### B4: Deep Web Diving
*A mysterious, darker stage representing the depths of the internet beyond normal access.*

1. **Hidden Gateway** - Concealed entrance to the deep web with privacy protections.
   - *Visual Theme*: Dark portal with encryption symbols and anonymizing features
   - *Key Elements*: Encryption puzzles, hidden pathways

2. **Anonymous Marketplace** - Trading hub for rare digital items and information.
   - *Visual Theme*: Shadowy bazaar with mysterious vendors and fluctuating data streams
   - *Key Elements*: Special vendors, rare item collection, information exchange

3. **Data Archive** - Vast repository of archived and hidden information.
   - *Visual Theme*: Endless stacks of forgotten data with cryptic organization
   - *Key Elements*: Research puzzles, knowledge collection challenges

4. **Underground Network** - Maze-like connection of private servers and hidden communities.
   - *Visual Theme*: Interconnected tunnels with private server nodes
   - *Key Elements*: Network navigation challenges, The Crawler (boss arena)

### B5: Network Nexus
*A hyper-connected hub of digital transportation and communication networks.*

1. **Router Junction** - Central routing facility directing data traffic.
   - *Visual Theme*: Busy intersection of data highways with switching mechanisms
   - *Key Elements*: Traffic flow puzzles, packet routing challenges

2. **Telecommunications Tower** - Tall structure broadcasting signals across the digital realm.
   - *Visual Theme*: Massive tower with broadcasting equipment and signal patterns
   - *Key Elements*: Signal strength puzzles, frequency tuning challenges

3. **Protocol Plaza** - Area where different communication protocols interact.
   - *Visual Theme*: Diplomatic zone with representatives of different protocols
   - *Key Elements*: Protocol translation puzzles, communication challenges

4. **Network Operations Center** - Command center monitoring the entire network.
   - *Visual Theme*: Wall of monitoring screens showing network status
   - *Key Elements*: Network troubleshooting puzzles, The Overseer (boss arena)

### B6: Quantum Realm
*A surreal stage representing quantum computing with probabilistic and uncertain environments.*

1. **Superposition Chamber** - Area where digital entities exist in multiple states simultaneously.
   - *Visual Theme*: Shimmering, overlapping reality with ghost-like duplicates
   - *Key Elements*: State-shifting puzzles, probability challenges

2. **Entanglement Nexus** - Location where distant elements are connected regardless of distance.
   - *Visual Theme*: Paired objects that affect each other across the environment
   - *Key Elements*: Synchronized puzzle solving, quantum link challenges

3. **Uncertainty Plains** - Vast area with constantly shifting landscape and properties.
   - *Visual Theme*: Landscape that changes with observation, wavering between states
   - *Key Elements*: Observation-based puzzles, probability manipulation

4. **Quantum Computer Core** - The central processing facility of quantum calculations.
   - *Visual Theme*: Complex crystalline structure with qubits and quantum gates
   - *Key Elements*: Quantum algorithm puzzles, The Physicist (boss arena)

### B7: Digital Dreamscape
*A fantastical stage representing the merging of consciousness and code.*

1. **Thought Stream** - Flowing river of consciousness connecting different dream areas.
   - *Visual Theme*: Ethereal flowing stream of thoughts and memories
   - *Key Elements*: Memory fragment collection, thought current navigation

2. **Memory Palace** - Structure containing organized memories and experiences.
   - *Visual Theme*: Impossible architecture with rooms representing different memories
   - *Key Elements*: Memory reconstruction puzzles, forgotten knowledge recovery

3. **Nightmare Alley** - Darker area representing fears and corrupted data dreams.
   - *Visual Theme*: Distorted, glitching environment with shadow manifestations
   - *Key Elements*: Fear confrontation challenges, corrupted memory cleansing

4. **Dream Engine** - Central facility where dreams are processed and maintained.
   - *Visual Theme*: Complex machinery interfacing with ethereal dream substance
   - *Key Elements*: Dream manipulation puzzles, The Dreamweaver (boss arena)

### B8: Corrupted Core
*A damaged, virus-infected stage representing digital decay and system corruption.*

1. **Infection Zone** - Initial area showing the spread of digital corruption.
   - *Visual Theme*: Glitching, deteriorating environment with corruption spreading visibly
   - *Key Elements*: Corruption containment puzzles, system stability challenges

2. **Quarantine Sector** - Isolated area attempting to contain the corruption.
   - *Visual Theme*: Sealed environment with containment measures and firewalls
   - *Key Elements*: Decontamination puzzles, quarantine protocol challenges

3. **Malware Factory** - Facility where corruption is being actively generated.
   - *Visual Theme*: Dark assembly line producing virus entities and corrupt code
   - *Key Elements*: Virus decompilation puzzles, assembly line sabotage

4. **System Core** - The heart of the infected system, heavily corrupted.
   - *Visual Theme*: Once-pristine central core now overrun with corruption
   - *Key Elements*: System recovery puzzles, The Corruption (boss arena)

### B9: Cyber Citadel
*A fortress-like stage representing the ultimate in digital security and defense.*

1. **Outer Fortifications** - Massive defensive walls and initial security systems.
   - *Visual Theme*: Imposing digital fortress with advanced security measures
   - *Key Elements*: Wall scaling challenges, outer defense disabling puzzles

2. **Security Complex** - Interconnected security systems and monitoring facilities.
   - *Visual Theme*: High-tech surveillance hub with constant monitoring
   - *Key Elements*: Camera evasion, security bypass puzzles

3. **Central Armory** - Storage for digital weapons and defensive measures.
   - *Visual Theme*: Arsenal of digital weapons and security implementations
   - *Key Elements*: Weapon deactivation puzzles, defense system override challenges

4. **Command Center** - Strategic hub controlling all citadel operations.
   - *Visual Theme*: Advanced command room with tactical displays and control systems
   - *Key Elements*: Command sequence puzzles, The Sovereign (boss arena)

5. **Secure Vault** - Ultimate secure storage for the most valuable digital assets.
   - *Visual Theme*: Impenetrable vault with countless security measures
   - *Key Elements*: Complex lock puzzles, final security challenges

### B10: Binary Singularity
*The final stage representing the convergence of all digital existence.*

1. **Reality Boundary** - The edge where normal digital space meets the singularity.
   - *Visual Theme*: Dissolving reality with increasing abstraction toward the center
   - *Key Elements*: Reality anchoring puzzles, boundary crossing challenges

2. **Convergence Field** - Area where multiple digital realities overlap and merge.
   - *Visual Theme*: Multiple overlapping environments from previous stages
   - *Key Elements*: Reality selection puzzles, dimensional navigation

3. **Quantum Possibility Space** - Region containing all possible digital states simultaneously.
   - *Visual Theme*: Fractal patterns containing infinite variations of the same elements
   - *Key Elements*: Probability collapse puzzles, possibility selection challenges

4. **Duality Nexus** - Location where binary opposites converge and balance.
   - *Visual Theme*: Yin-yang patterned environment with light and dark elements
   - *Key Elements*: Balance restoration puzzles, The Duality (sub-boss arena)

5. **Infinite Core** - The central point of all digital existence.
   - *Visual Theme*: Abstract, ever-changing environment representing pure digital potential
   - *Key Elements*: Existence stabilization puzzles, The Infinite (final boss arena)

### BS: Digital Purgatory (Secret Challenge Area)
*A hidden, ultra-challenging area accessible only with the Chaos Protocol relic, featuring the most powerful enemies and rewards in the game.*

1. **Corruption Nexus** - The entry point to the secret area, a twisted amalgamation of glitched digital space.
   - *Visual Theme*: Highly distorted and fragmented digital landscape with unstable geometry
   - *Key Elements*: Reality anchoring puzzles, corruption resistance challenges, warning signs

2. **Error Domain** - A landscape of broken code and failed algorithms, teeming with dangerous glitch entities.
   - *Visual Theme*: Broken, jagged terrain made of error messages and crashed code
   - *Key Elements*: Corrupted data puzzles, hostile glitch entities, unstable platforms

3. **Memory Dump** - Vast wasteland of discarded and corrupted data fragments.
   - *Visual Theme*: Mountains of fragmented code, broken assets, and digital debris
   - *Key Elements*: Memory reconstruction puzzles, abandoned system remnants, data salvage

4. **Root Access** - The most secure and dangerous area, guarded by the game's most challenging enemies.
   - *Visual Theme*: Stark, minimalist core system terminal environment with red emergency lighting
   - *Key Elements*: High-security override puzzles, kernel-level access challenges

5. **Administrator's Vault** - The final room containing the ultimate challenge and rewards.
   - *Visual Theme*: Pristine digital vault with glowing interfaces and display cases
   - *Key Elements*: System Administrator (super boss), reward pedestals for ultimate items

## Transition Mechanics

- **Scene Transitions**: Players move between scenes by reaching edge points on each background, triggering a transition to the connected scene.

- **Stage Transitions**: Completing a stage (defeating its boss) unlocks access to the next stage through special gateway points.

- **Fast Travel**: After completing a stage, players unlock fast travel points allowing quick movement between previously visited stages.

- **Hidden Connections**: Some scenes contain secret pathways that connect to unexpected locations, encouraging exploration.

- **Secret Stage Access**: The Digital Purgatory is only accessible by equipping the "Chaos Protocol" relic and interacting with specific glitched areas that appear randomly throughout the world.

## Collision Mapping Guidelines

- **Walkable Areas**: Clearly defined pathways and open spaces where the player can move freely.

- **Obstacles**: Visual elements like walls, furniture, rocks, or digital barriers that block player movement.

- **Interactive Objects**: Special collision areas that trigger events, conversations, or puzzles when the player interacts with them.

- **Transition Points**: Edge areas that connect to other scenes, often represented as doorways, paths leading offscreen, or special portals.

- **Water/Special Terrain**: Areas with modified movement properties, such as slowing down the player or requiring special abilities to cross.
