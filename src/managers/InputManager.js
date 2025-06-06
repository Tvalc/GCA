// InputManager handles all input operations
class InputManager {
  constructor(game) {
    this.game = game;
    this.keys = new Set();
    this.mousePosition = { x: 0, y: 0 };
    this.mouseButtons = new Set();
    this.touchPositions = new Map();
    this.lastClickTime = 0;
    this.doubleClickDelay = 300; // ms
    this.isMoving = false;
    this.movementDirection = null;
    this.keyBindings = {
      up: ['ArrowUp', 'w', 'W'],
      down: ['ArrowDown', 's', 'S'],
      left: ['ArrowLeft', 'a', 'A'],
      right: ['ArrowRight', 'd', 'D'],
      interact: ['e', 'E', ' '],
      menu: ['Escape', 'm', 'M'],
      inventory: ['i', 'I'],
      map: ['tab'],
      skill1: ['1'],
      skill2: ['2'],
      skill3: ['3'],
      skill4: ['4']
    };
  }

  init() {
    // Set up event listeners
    this.setupKeyboardEvents();
    this.setupMouseEvents();
    this.setupTouchEvents();
    
    // Set up click handler for game canvas
    this.setupClickHandler();
  }

  setupKeyboardEvents() {
    // Key down
    window.addEventListener('keydown', (event) => {
      this.keys.add(event.key);
      this.handleKeyDown(event);
    });
    
    // Key up
    window.addEventListener('keyup', (event) => {
      this.keys.delete(event.key);
      this.handleKeyUp(event);
    });
  }

  setupMouseEvents() {
    const canvas = this.game.managers.render.canvas;
    
    // Mouse move
    canvas.addEventListener('mousemove', (event) => {
      const rect = canvas.getBoundingClientRect();
      this.mousePosition = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    });
    
    // Mouse down
    canvas.addEventListener('mousedown', (event) => {
      this.mouseButtons.add(event.button);
      this.handleMouseDown(event);
    });
    
    // Mouse up
    canvas.addEventListener('mouseup', (event) => {
      this.mouseButtons.delete(event.button);
      this.handleMouseUp(event);
    });
    
    // Mouse leave
    canvas.addEventListener('mouseleave', () => {
      this.mouseButtons.clear();
    });
  }

  setupTouchEvents() {
    const canvas = this.game.managers.render.canvas;
    
    // Touch start
    canvas.addEventListener('touchstart', (event) => {
      event.preventDefault();
      Array.from(event.touches).forEach(touch => {
        const rect = canvas.getBoundingClientRect();
        this.touchPositions.set(touch.identifier, {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top
        });
      });
      this.handleTouchStart(event);
    });
    
    // Touch move
    canvas.addEventListener('touchmove', (event) => {
      event.preventDefault();
      Array.from(event.touches).forEach(touch => {
        const rect = canvas.getBoundingClientRect();
        this.touchPositions.set(touch.identifier, {
          x: touch.clientX - rect.left,
          y: touch.clientY - rect.top
        });
      });
      this.handleTouchMove(event);
    });
    
    // Touch end
    canvas.addEventListener('touchend', (event) => {
      event.preventDefault();
      Array.from(event.changedTouches).forEach(touch => {
        this.touchPositions.delete(touch.identifier);
      });
      this.handleTouchEnd(event);
    });
  }

  setupClickHandler() {
    const canvas = this.game.managers.render.canvas;
    
    canvas.addEventListener('click', (event) => {
      const now = Date.now();
      const isDoubleClick = now - this.lastClickTime < this.doubleClickDelay;
      this.lastClickTime = now;
      
      const rect = canvas.getBoundingClientRect();
      const clickPosition = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
      
      this.handleClick(clickPosition, isDoubleClick);
    });
  }

  handleKeyDown(event) {
    // Check for movement keys
    if (this.keyBindings.up.includes(event.key)) {
      this.isMoving = true;
      this.movementDirection = 'up';
    } else if (this.keyBindings.down.includes(event.key)) {
      this.isMoving = true;
      this.movementDirection = 'down';
    } else if (this.keyBindings.left.includes(event.key)) {
      this.isMoving = true;
      this.movementDirection = 'left';
    } else if (this.keyBindings.right.includes(event.key)) {
      this.isMoving = true;
      this.movementDirection = 'right';
    }
    
    // Check for action keys
    if (this.keyBindings.interact.includes(event.key)) {
      this.handleInteract();
    } else if (this.keyBindings.menu.includes(event.key)) {
      this.handleMenu();
    } else if (this.keyBindings.inventory.includes(event.key)) {
      this.handleInventory();
    } else if (this.keyBindings.map.includes(event.key)) {
      this.handleMap();
    }
    
    // Check for skill keys
    if (this.keyBindings.skill1.includes(event.key)) {
      this.handleSkill(0);
    } else if (this.keyBindings.skill2.includes(event.key)) {
      this.handleSkill(1);
    } else if (this.keyBindings.skill3.includes(event.key)) {
      this.handleSkill(2);
    } else if (this.keyBindings.skill4.includes(event.key)) {
      this.handleSkill(3);
    }
  }

  handleKeyUp(event) {
    // Check if movement key was released
    if (this.keyBindings.up.includes(event.key) ||
        this.keyBindings.down.includes(event.key) ||
        this.keyBindings.left.includes(event.key) ||
        this.keyBindings.right.includes(event.key)) {
      this.isMoving = false;
      this.movementDirection = null;
    }
  }

  handleMouseDown(event) {
    // Handle mouse button press
    switch (event.button) {
      case 0: // Left click
        this.handleLeftClick();
        break;
      case 1: // Middle click
        this.handleMiddleClick();
        break;
      case 2: // Right click
        this.handleRightClick();
        break;
    }
  }

  handleMouseUp(event) {
    // Handle mouse button release
    switch (event.button) {
      case 0: // Left click
        this.handleLeftClickRelease();
        break;
      case 1: // Middle click
        this.handleMiddleClickRelease();
        break;
      case 2: // Right click
        this.handleRightClickRelease();
        break;
    }
  }

  handleTouchStart(event) {
    // Handle touch start
    const touch = event.touches[0];
    const position = this.touchPositions.get(touch.identifier);
    
    if (position) {
      this.handleTouch(position);
    }
  }

  handleTouchMove(event) {
    // Handle touch move
    const touch = event.touches[0];
    const position = this.touchPositions.get(touch.identifier);
    
    if (position) {
      this.handleTouchDrag(position);
    }
  }

  handleTouchEnd(event) {
    // Handle touch end
    const touch = event.changedTouches[0];
    const position = this.touchPositions.get(touch.identifier);
    
    if (position) {
      this.handleTouchRelease(position);
    }
  }

  handleClick(position, isDoubleClick) {
    // Convert screen position to world position
    const worldPosition = this.screenToWorld(position);
    
    // Check if click is on an entity
    const entity = this.getEntityAtPosition(worldPosition);
    if (entity) {
      this.handleEntityClick(entity, isDoubleClick);
      return;
    }
    
    // Check if click is on the map
    const tile = this.getTileAtPosition(worldPosition);
    if (tile) {
      this.handleTileClick(tile, isDoubleClick);
      return;
    }
    
    // Check if click is on UI
    const uiElement = this.getUIElementAtPosition(position);
    if (uiElement) {
      this.handleUIClick(uiElement, isDoubleClick);
      return;
    }
  }

  screenToWorld(screenPosition) {
    const camera = this.game.state.camera;
    return {
      x: screenPosition.x + camera.x,
      y: screenPosition.y + camera.y
    };
  }

  getEntityAtPosition(position) {
    // Check player
    if (this.game.state.player) {
      if (this.isPositionInEntity(position, this.game.state.player)) {
        return this.game.state.player;
      }
    }
    
    // Check enemies
    for (const enemy of this.game.state.enemies) {
      if (this.isPositionInEntity(position, enemy)) {
        return enemy;
      }
    }
    
    // Check NPCs
    if (this.game.systems.npc) {
      for (const npc of this.game.systems.npc.getNPCs()) {
        if (this.isPositionInEntity(position, npc)) {
          return npc;
        }
      }
    }
    
    return null;
  }

  isPositionInEntity(position, entity) {
    return position.x >= entity.position.x &&
           position.x < entity.position.x + GRID_SIZE &&
           position.y >= entity.position.y &&
           position.y < entity.position.y + GRID_SIZE;
  }

  getTileAtPosition(position) {
    const tileX = Math.floor(position.x / GRID_SIZE);
    const tileY = Math.floor(position.y / GRID_SIZE);
    
    if (tileX >= 0 && tileX < this.game.state.mapWidth &&
        tileY >= 0 && tileY < this.game.state.mapHeight) {
      return this.game.state.map[tileY][tileX];
    }
    
    return null;
  }

  getUIElementAtPosition(position) {
    if (this.game.managers.ui) {
      return this.game.managers.ui.getElementAtPosition(position);
    }
    return null;
  }

  handleEntityClick(entity, isDoubleClick) {
    if (isDoubleClick) {
      // Handle double click on entity
      if (entity.type === 'npc') {
        this.game.systems.npc.startDialog(entity);
      } else if (entity.type === 'enemy') {
        this.game.systems.combat.startBattle(entity);
      }
    } else {
      // Handle single click on entity
      if (entity.type === 'item') {
        this.game.systems.inventory.pickupItem(entity);
      }
    }
  }

  handleTileClick(tile, isDoubleClick) {
    if (isDoubleClick) {
      // Handle double click on tile
      if (tile.type === 'door') {
        this.game.changeScene(tile.targetScene);
      }
    } else {
      // Handle single click on tile
      if (tile.type === 'chest') {
        this.game.systems.inventory.openChest(tile);
      }
    }
  }

  handleUIClick(element, isDoubleClick) {
    if (isDoubleClick) {
      // Handle double click on UI element
      element.onDoubleClick();
    } else {
      // Handle single click on UI element
      element.onClick();
    }
  }

  handleInteract() {
    // Get entity in front of player
    const player = this.game.state.player;
    const direction = this.movementDirection || 'down';
    const position = this.getPositionInDirection(player.position, direction);
    
    const entity = this.getEntityAtPosition(position);
    if (entity) {
      this.handleEntityClick(entity, false);
    } else {
      const tile = this.getTileAtPosition(position);
      if (tile) {
        this.handleTileClick(tile, false);
      }
    }
  }

  getPositionInDirection(position, direction) {
    const newPosition = { ...position };
    
    switch (direction) {
      case 'up':
        newPosition.y -= GRID_SIZE;
        break;
      case 'down':
        newPosition.y += GRID_SIZE;
        break;
      case 'left':
        newPosition.x -= GRID_SIZE;
        break;
      case 'right':
        newPosition.x += GRID_SIZE;
        break;
    }
    
    return newPosition;
  }

  handleMenu() {
    if (this.game.managers.ui) {
      this.game.managers.ui.toggleMenu();
    }
  }

  handleInventory() {
    if (this.game.managers.ui) {
      this.game.managers.ui.toggleInventory();
    }
  }

  handleMap() {
    if (this.game.managers.ui) {
      this.game.managers.ui.toggleMap();
    }
  }

  handleSkill(index) {
    const player = this.game.state.player;
    if (player && player.skills[index]) {
      this.game.systems.combat.useSkill(player.skills[index]);
    }
  }

  isMoving() {
    return this.isMoving;
  }

  getMovementDirection() {
    return this.movementDirection;
  }
}

// Export the InputManager class
export default InputManager; 