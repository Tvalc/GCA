# Art Style Guide

## Visual Style

### Overall Aesthetic
- **Style**: Stylized pixel art with modern lighting and VFX
- **Resolution**: 1080p with pixel-perfect scaling
- **Color Palette**: Vibrant, high-contrast colors with atmospheric effects
- **Theme**: Whimsical fantasy with cloud and storm motifs

### Character Design
- **Proportions**: 3-4 heads tall for chibi style
- **Animation**: 8 frames for walk cycles, 12 frames for attacks
- **Expressions**: 6 core expressions (Neutral, Happy, Sad, Angry, Surprised, Tired)
- **Conscript Variants**: Color-shifted versions of enemies with faction insignias

### Environment Art
- **Tileset**: 32x32 pixel grid
- **Layers**: Background (far), Midground, Foreground, Effects
- **Lighting**: Dynamic lighting with weather effects
- **Tower Defense Maps**: Grid-based with path indicators

## UI/UX Design

### Color Scheme
| Usage | Hex | RGB |
|-------|-----|-----|
| Primary | #4A90E2 | 74, 144, 226 |
| Secondary | #F5A623 | 245, 166, 35 |
| Accent | #E74C3C | 231, 76, 60 |
| Background | #2C3E50 | 44, 62, 80 |
| Text | #ECF0F1 | 236, 240, 241 |
| Success | #2ECC71 | 46, 204, 113 |
| Warning | #F39C12 | 243, 156, 18 |
| Danger | #E74C3C | 231, 76, 60 |

### Typography
- **Primary Font**: 'Press Start 2P' - UI, Menus
- **Secondary Font**: 'VT323' - Dialogue, Descriptions
- **Sizes**: 
  - Headers: 24-32px
  - Body: 16px
  - Small: 12px
  - Tower UI: 10-14px (readable at small sizes)

### Skill Effects

#### Visual Effects
- **Physical Attacks**: Quick, impactful animations with screen shake on crits
- **Magic Spells**: Glowing particle effects matching element colors
- **Healing**: Soft glow with rising plus symbols
- **Buffs/Debuffs**: Circular auras around affected characters

#### Element Colors
| Element | Primary Color | Secondary Color | Particle Effect |
|---------|---------------|-----------------|-----------------|
| Fire    | #FF4500       | #FFA500         | Flames, Embers  |
| Ice     | #00BFFF       | #87CEFA         | Snowflakes, Mist|
| Thunder | #FFD700       | #FFFFFF         | Lightning Bolts |
| Wind    | #98FB98       | #F0FFF0         | Swirling Leaves |
| Dark    | #8A2BE2       | #4B0082         | Shadowy Wisps   |

### UI Components

#### Core Components
1. **Skill Buttons**
   - Size: 64x64px (with 4px padding)
   - States: Normal, Hover, Pressed, Disabled, On Cooldown
   - Include: Skill icon, cooldown indicator, MP cost, keybind

2. **Skill Tooltips**
   - Appear on hover
   - Show: Name, Description, MP Cost, Cooldown, Damage/Effect
   - Include skill type icon and element

3. **Level Up Notification**
   - Golden particle burst
   - Smooth slide-in animation
   - Dismissible with any key after 1 second

4. **Skill Unlock Screen**
   - Full-screen overlay with darkened background
   - Large skill icon with unlock animation
   - Detailed description and controls
   - "Continue" button (appears after 1.5s)
   - Animation: Subtle scale on hover (1.05x)
   - Sound: Soft chime on press

2. **Health Bars**
   - Width: 200px, Height: 12px
   - Colors: 
     - Green (HP)
     - Blue (MP)
     - Yellow (XP)
     - Purple (Loyalty for conscripts)
   - Animation: Smooth depletion with particle effects

#### Tower Defense UI
1. **Tower Icons**
   - Size: 64x64px
   - States: Available, Selected, On Cooldown
   - Tooltip: Shows stats and upgrade paths

2. **Wave Counter**
   - Displays current wave/total waves
   - Progress bar for next wave timer
   - Enemy type indicators

3. **Resource Display**
   - Gold counter
   - Lives remaining
   - Special resources

#### Mini-Game UI
1. **Score Display**
   - Large, prominent numbers
   - Combo counter
   - Multiplier indicator

2. **Timer**
   - Clear, easy-to-read
   - Color changes based on remaining time
   - Flashing animation when time is low

#### Conscription UI
1. **Unit Cards**
   - Shows unit type and level
   - Loyalty meter
   - Special abilities

2. **Deployment Interface**
   - Drag-and-drop functionality
   - Cost indicators
   - Cooldown timers

## Animation Guidelines

### Tower Defense Effects
- **Tower Attacks**: Clear projectile paths
- **Enemy Deaths**: Satisfying particle explosions
- **Special Abilities**: Screen shake and flash effects
- **Wave Start/End**: Dramatic camera zooms

### Mini-Game Feedback
- **Success**: Bright flash and chime
- **Failure**: Screen shake and darker tone
- **Combo**: Cascading number pop-ups
- **Rewards**: Shiny particle effects

### Character Animation
- **Idle**: Subtle breathing animation
- **Walk**: 8 frames, 12fps
- **Attack**: 12 frames, key frames at 4 and 8
- **Hurt/Damage**: 6 frames, flash white on hit

### VFX
- **Damage Numbers**: Pop-up with slight arc
- **Healing**: Soft green particle effect
- **Critical Hits**: Screen shake + particle burst

## Technical Specifications

### File Naming Conventions
- Characters: `char_[name]_[action]_[frame].png`
- Tiles: `tile_[set]_[type]_[variant].png`
- UI: `ui_[element]_[state].png`

### Export Settings
- Format: PNG-24 with transparency
- Color Profile: sRGB
- DPI: 72
- Trim: All sprites should be trimmed to content

### Optimization
- Sprite sheets for animations
- Texture atlases for UI elements
- 2^n dimensions for textures

## Implementation Notes
- All assets should be created at 2x resolution for HD support
- Include a 1px transparent border for sprites to prevent bleeding
- Document any special shaders or effects in the asset metadata
