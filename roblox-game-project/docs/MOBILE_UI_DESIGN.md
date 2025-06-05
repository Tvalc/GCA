# Mobile UI/UX Design - Glitter Cloud Adventure

## Screen Layout

```
+-------------------------------------+
| [Health/MP]       [Mini-map]      |
| [Party Status]  [Quest Info]     |
|                                     |
|                                     |
|                                     |
|                                     |
|                                     |
|                                     |
|                                     |
|       [Virtual Joystick]           |
|                                     |
|               [Jump]               |
|                                     |
|    [Attack]       [Interact]       |
|                                     |
| [Menu] [Items] [FURY] [Companions] |
+-------------------------------------+
```

## Control Elements

### 1. Virtual Joystick (Left Side)

- **Type**: Floating, dynamic position
- **Activation**: Touch anywhere on left 40% of screen
- **Visuals**:
  - Outer ring (semi-transparent)
  - Inner dot (glowing blue)
- **Behaviors**:
  - Deadzone: 20px radius
  - Maximum distance: 100px
  - Returns to center on release

### 2. Action Buttons (Right Side)

- **Attack Button**

  - Position: Lower right
  - Size: 120x120px
  - Visual: Glowing red circle with sword icon
  - Tap: Basic attack
  - Hold: Charged attack
  - Double-tap: Special ability

- **Jump Button**

  - Position: Above attack button
  - Size: 100x100px
  - Visual: Circular with arrow icon
  - Tap: Jump
  - Double-tap: Double jump (if unlocked)

- **Interact Button**
  - Position: Right of attack button
  - Size: 80x80px
  - Visual: Appears near interactable objects
  - Context-sensitive icon (hand, talk, pickup)

### 3. Quick Access Bar (Bottom)

- **Menu Button**

  - Icon: ☰
  - Opens: Main menu (inventory, settings, etc.)

- **Items Button**

  - Icon: Backpack
  - Opens: Quick item wheel
  - Swipe to select, release to use

- **FURY Button**

  - Visual: Glowing blue orb
  - Shows current FURY level
  - Tap to activate when charged
  - Pulsates when ready

- **Companions Button**
  - Icon: Multiple figures
  - Opens: Companion command wheel
  - Radial menu for abilities

### 4. Gesture Controls

- **Swipe Up**: Interact/Climb
- **Swipe Down**: Crouch/Dodge
- **Swipe Left/Right**: Quick dodge roll
- **Two-finger Tap**: Block/Parry
- **Pinch**: Zoom camera

## Contextual UI Elements

### 1. Dialogue Interface

- Appears at bottom 25% of screen
- Character portrait (left)
- Text box with nameplate
- Auto-advance option
- Text speed adjustment

### 2. Combat Popups

- Damage numbers
- Status effect icons
- Combo counter
- XP gained notifications

### 3. Quick-Time Events

- Large circular button appears
- Tap rapidly or follow swipe pattern
- Visual feedback for success/failure

## Customization Options

### 1. Control Customization

- Button size (80-150%)
- Button opacity (30-90%)
- Button position adjustment
- Preset layouts (Default, Left-handed, One-handed)

### 2. HUD Customization

- Toggle individual elements
- Scale HUD (80-120%)
- Dynamic hide/show options
- Color themes

### 3. Accessibility

- Button remapping
- Auto-attack toggle
- Auto-collect toggle
- Vibration intensity

## Visual Feedback

### 1. Touch Indicators

- Ripple effect on button press
- Glow on active elements
- Subtle screen shake for important actions

### 2. Tutorial Hints

- Visual cues for first-time actions
- Optional tooltips
- Can be disabled in settings

### 3. Performance Mode

- Simplified VFX
- Reduced particle count
- Lower resolution textures
- Disabled background animations

## Implementation Notes

### 1. Screen Ratios

- Designed for 16:9 and 18:9 aspect ratios
- Safe area detection for notches/cutouts
- Dynamic scaling for tablets

### 2. Performance Considerations

- UI elements pooled for performance
- Texture atlasing for mobile
- Minimal redraw regions

### 3. Input Handling

- Multi-touch support (up to 5 touches)
- Touch priority system
- Deadzone calibration

---

_Document Version: 0.1 - Initial Mobile UI Design_
_Next: Implement core UI components in Roblox Studio_
