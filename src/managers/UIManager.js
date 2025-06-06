// UIManager handles all user interface elements and interactions
class UIManager {
  constructor(game) {
    this.game = game;
    this.elements = new Map();
    this.activeMenus = new Set();
    this.notifications = [];
    this.tooltips = new Map();
    this.dialogs = new Map();
    this.hud = null;
    this.minimap = null;
    this.inventory = null;
    this.questLog = null;
    this.character = null;
    this.skills = null;
    this.map = null;
    this.shop = null;
    this.dialog = null;
    this.notificationQueue = [];
    this.notificationDuration = 3000;
    this.tooltipDelay = 500;
    this.tooltipTimer = null;
  }

  init() {
    // Initialize UI elements
    this.initUIElements();
    this.initEventListeners();
  }

  initUIElements() {
    // Create HUD
    this.hud = {
      health: this.createElement('div', 'hud-health'),
      mana: this.createElement('div', 'hud-mana'),
      xp: this.createElement('div', 'hud-xp'),
      level: this.createElement('div', 'hud-level'),
      gold: this.createElement('div', 'hud-gold')
    };

    // Create minimap
    this.minimap = this.createElement('div', 'minimap');
    this.minimapCanvas = this.createElement('canvas', 'minimap-canvas');

    // Create inventory
    this.inventory = {
      container: this.createElement('div', 'inventory'),
      slots: new Array(20).fill(null).map(() => this.createElement('div', 'inventory-slot')),
      equipment: {
        weapon: this.createElement('div', 'equipment-slot'),
        armor: this.createElement('div', 'equipment-slot'),
        helmet: this.createElement('div', 'equipment-slot'),
        boots: this.createElement('div', 'equipment-slot'),
        accessory: this.createElement('div', 'equipment-slot')
      }
    };

    // Create quest log
    this.questLog = {
      container: this.createElement('div', 'quest-log'),
      quests: new Map()
    };

    // Create character panel
    this.character = {
      container: this.createElement('div', 'character-panel'),
      stats: this.createElement('div', 'character-stats'),
      attributes: this.createElement('div', 'character-attributes'),
      equipment: this.createElement('div', 'character-equipment')
    };

    // Create skills panel
    this.skills = {
      container: this.createElement('div', 'skills-panel'),
      skills: new Map()
    };

    // Create map
    this.map = {
      container: this.createElement('div', 'map'),
      canvas: this.createElement('canvas', 'map-canvas')
    };

    // Create shop
    this.shop = {
      container: this.createElement('div', 'shop'),
      items: new Map(),
      playerGold: this.createElement('div', 'shop-gold')
    };

    // Create dialog
    this.dialog = {
      container: this.createElement('div', 'dialog'),
      text: this.createElement('div', 'dialog-text'),
      options: this.createElement('div', 'dialog-options')
    };

    // Add elements to document
    this.addElementsToDocument();
  }

  initEventListeners() {
    // Add event listeners for UI interactions
    document.addEventListener('keydown', this.handleKeyPress.bind(this));
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('click', this.handleClick.bind(this));
  }

  // UI Element Creation
  createElement(type, className) {
    const element = document.createElement(type);
    element.className = className;
    return element;
  }

  addElementsToDocument() {
    // Add HUD elements
    Object.values(this.hud).forEach(element => {
      document.body.appendChild(element);
    });

    // Add minimap
    this.minimap.appendChild(this.minimapCanvas);
    document.body.appendChild(this.minimap);

    // Add inventory
    document.body.appendChild(this.inventory.container);
    this.inventory.slots.forEach(slot => {
      this.inventory.container.appendChild(slot);
    });
    Object.values(this.inventory.equipment).forEach(slot => {
      this.inventory.container.appendChild(slot);
    });

    // Add quest log
    document.body.appendChild(this.questLog.container);

    // Add character panel
    document.body.appendChild(this.character.container);
    this.character.container.appendChild(this.character.stats);
    this.character.container.appendChild(this.character.attributes);
    this.character.container.appendChild(this.character.equipment);

    // Add skills panel
    document.body.appendChild(this.skills.container);

    // Add map
    this.map.container.appendChild(this.map.canvas);
    document.body.appendChild(this.map.container);

    // Add shop
    document.body.appendChild(this.shop.container);
    this.shop.container.appendChild(this.shop.playerGold);

    // Add dialog
    document.body.appendChild(this.dialog.container);
    this.dialog.container.appendChild(this.dialog.text);
    this.dialog.container.appendChild(this.dialog.options);
  }

  // Menu Management
  showMenu(menuId) {
    const menu = this.elements.get(menuId);
    if (menu) {
      menu.style.display = 'block';
      this.activeMenus.add(menuId);
    }
  }

  hideMenu(menuId) {
    const menu = this.elements.get(menuId);
    if (menu) {
      menu.style.display = 'none';
      this.activeMenus.delete(menuId);
    }
  }

  toggleMenu(menuId) {
    if (this.activeMenus.has(menuId)) {
      this.hideMenu(menuId);
    } else {
      this.showMenu(menuId);
    }
  }

  // HUD Updates
  updateHUD() {
    const player = this.game.managers.player.player;
    if (!player) return;

    // Update health
    this.hud.health.textContent = `Health: ${player.health}/${player.maxHealth}`;
    this.hud.health.style.width = `${(player.health / player.maxHealth) * 100}%`;

    // Update mana
    this.hud.mana.textContent = `Mana: ${player.mana}/${player.maxMana}`;
    this.hud.mana.style.width = `${(player.mana / player.maxMana) * 100}%`;

    // Update XP
    const xpPercentage = (player.xp / this.game.managers.player.getRequiredXP()) * 100;
    this.hud.xp.textContent = `XP: ${player.xp}/${this.game.managers.player.getRequiredXP()}`;
    this.hud.xp.style.width = `${xpPercentage}%`;

    // Update level
    this.hud.level.textContent = `Level: ${player.level}`;

    // Update gold
    this.hud.gold.textContent = `Gold: ${player.gold}`;
  }

  // Minimap Updates
  updateMinimap() {
    const ctx = this.minimapCanvas.getContext('2d');
    const player = this.game.managers.player.player;
    if (!player) return;

    // Clear canvas
    ctx.clearRect(0, 0, this.minimapCanvas.width, this.minimapCanvas.height);

    // Draw player
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(
      player.position.x * this.minimapCanvas.width / this.game.managers.map.width,
      player.position.y * this.minimapCanvas.height / this.game.managers.map.height,
      2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Draw other entities
    this.game.managers.entity.entities.forEach(entity => {
      if (entity.id !== player.id) {
        ctx.fillStyle = entity.type === 'enemy' ? 'red' : 'green';
        ctx.beginPath();
        ctx.arc(
          entity.position.x * this.minimapCanvas.width / this.game.managers.map.width,
          entity.position.y * this.minimapCanvas.height / this.game.managers.map.height,
          1,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    });
  }

  // Inventory Updates
  updateInventory() {
    const player = this.game.managers.player.player;
    if (!player) return;

    // Update inventory slots
    this.inventory.slots.forEach((slot, index) => {
      const item = player.inventory.get(index);
      if (item) {
        slot.textContent = item.name;
        slot.dataset.itemId = item.id;
      } else {
        slot.textContent = '';
        slot.dataset.itemId = '';
      }
    });

    // Update equipment slots
    Object.entries(this.inventory.equipment).forEach(([slot, element]) => {
      const item = player.equipment[slot];
      if (item) {
        element.textContent = item.name;
        element.dataset.itemId = item.id;
      } else {
        element.textContent = '';
        element.dataset.itemId = '';
      }
    });
  }

  // Quest Log Updates
  updateQuestLog() {
    const quests = this.game.managers.quest.getActiveQuests();
    this.questLog.quests.clear();

    quests.forEach(quest => {
      const questElement = this.createElement('div', 'quest');
      questElement.innerHTML = `
        <h3>${quest.name}</h3>
        <p>${quest.description}</p>
        <div class="quest-steps">
          ${quest.steps.map(step => `
            <div class="quest-step ${step.completed ? 'completed' : ''}">
              ${step.description} (${step.progress}/${step.required})
            </div>
          `).join('')}
        </div>
      `;
      this.questLog.quests.set(quest.id, questElement);
      this.questLog.container.appendChild(questElement);
    });
  }

  // Character Panel Updates
  updateCharacterPanel() {
    const player = this.game.managers.player.player;
    if (!player) return;

    // Update stats
    this.character.stats.innerHTML = `
      <h3>Stats</h3>
      <div>Health: ${player.health}/${player.maxHealth}</div>
      <div>Mana: ${player.mana}/${player.maxMana}</div>
      <div>Damage: ${player.damage}</div>
      <div>Defense: ${player.defense}</div>
      <div>Speed: ${player.speed}</div>
    `;

    // Update attributes
    this.character.attributes.innerHTML = `
      <h3>Attributes</h3>
      <div>Strength: ${player.attributes.strength}</div>
      <div>Dexterity: ${player.attributes.dexterity}</div>
      <div>Intelligence: ${player.attributes.intelligence}</div>
      <div>Vitality: ${player.attributes.vitality}</div>
      ${player.attributePoints ? `<div>Attribute Points: ${player.attributePoints}</div>` : ''}
    `;

    // Update equipment
    this.character.equipment.innerHTML = `
      <h3>Equipment</h3>
      ${Object.entries(player.equipment).map(([slot, item]) => `
        <div>${slot}: ${item ? item.name : 'Empty'}</div>
      `).join('')}
    `;
  }

  // Skills Panel Updates
  updateSkillsPanel() {
    const player = this.game.managers.player.player;
    if (!player) return;

    this.skills.skills.clear();
    player.skills.forEach(skillId => {
      const skill = this.game.managers.skill.getSkill(skillId);
      if (skill) {
        const skillElement = this.createElement('div', 'skill');
        skillElement.innerHTML = `
          <h3>${skill.name}</h3>
          <p>${skill.description}</p>
          <div>Level: ${skill.level}</div>
          <div>Mana Cost: ${skill.manaCost}</div>
          <div>Cooldown: ${skill.cooldown}s</div>
        `;
        this.skills.skills.set(skillId, skillElement);
        this.skills.container.appendChild(skillElement);
      }
    });
  }

  // Shop Updates
  updateShop() {
    const player = this.game.managers.player.player;
    if (!player) return;

    // Update player gold
    this.shop.playerGold.textContent = `Gold: ${player.gold}`;

    // Update shop items
    this.shop.items.clear();
    this.game.managers.npc.getMerchantInventory().forEach(item => {
      const itemElement = this.createElement('div', 'shop-item');
      itemElement.innerHTML = `
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div>Price: ${item.price}</div>
        <button class="buy-button" data-item-id="${item.id}">Buy</button>
      `;
      this.shop.items.set(item.id, itemElement);
      this.shop.container.appendChild(itemElement);
    });
  }

  // Dialog Updates
  updateDialog(dialogData) {
    this.dialog.text.textContent = dialogData.text;
    this.dialog.options.innerHTML = dialogData.options.map(option => `
      <button class="dialog-option" data-option-id="${option.id}">
        ${option.text}
      </button>
    `).join('');
  }

  // Notification System
  showNotification(message, type = 'info') {
    const notification = this.createElement('div', `notification ${type}`);
    notification.textContent = message;
    document.body.appendChild(notification);

    // Add to queue
    this.notificationQueue.push(notification);

    // Remove after duration
    setTimeout(() => {
      notification.remove();
      this.notificationQueue = this.notificationQueue.filter(n => n !== notification);
    }, this.notificationDuration);
  }

  // Tooltip System
  showTooltip(element, content) {
    this.tooltipTimer = setTimeout(() => {
      const tooltip = this.createElement('div', 'tooltip');
      tooltip.textContent = content;
      document.body.appendChild(tooltip);

      const rect = element.getBoundingClientRect();
      tooltip.style.left = `${rect.right + 10}px`;
      tooltip.style.top = `${rect.top}px`;

      this.tooltips.set(element, tooltip);
    }, this.tooltipDelay);
  }

  hideTooltip(element) {
    clearTimeout(this.tooltipTimer);
    const tooltip = this.tooltips.get(element);
    if (tooltip) {
      tooltip.remove();
      this.tooltips.delete(element);
    }
  }

  // Event Handlers
  handleKeyPress(event) {
    // Handle keyboard shortcuts
    switch (event.key) {
      case 'i':
        this.toggleMenu('inventory');
        break;
      case 'm':
        this.toggleMenu('map');
        break;
      case 'c':
        this.toggleMenu('character');
        break;
      case 'k':
        this.toggleMenu('skills');
        break;
      case 'q':
        this.toggleMenu('quest-log');
        break;
      case 'Escape':
        this.hideAllMenus();
        break;
    }
  }

  handleMouseMove(event) {
    // Handle tooltips
    const target = event.target;
    if (target.dataset.tooltip) {
      this.showTooltip(target, target.dataset.tooltip);
    } else {
      this.hideTooltip(target);
    }
  }

  handleClick(event) {
    // Handle UI interactions
    const target = event.target;

    // Handle inventory clicks
    if (target.classList.contains('inventory-slot')) {
      const itemId = target.dataset.itemId;
      if (itemId) {
        this.game.managers.inventory.useItem(itemId);
      }
    }

    // Handle equipment clicks
    if (target.classList.contains('equipment-slot')) {
      const itemId = target.dataset.itemId;
      if (itemId) {
        this.game.managers.inventory.unequipItem(itemId);
      }
    }

    // Handle shop clicks
    if (target.classList.contains('buy-button')) {
      const itemId = target.dataset.itemId;
      if (itemId) {
        this.game.managers.npc.buyItem(itemId);
      }
    }

    // Handle dialog clicks
    if (target.classList.contains('dialog-option')) {
      const optionId = target.dataset.optionId;
      if (optionId) {
        this.game.managers.npc.selectDialogOption(optionId);
      }
    }
  }

  // Utility Methods
  hideAllMenus() {
    this.activeMenus.forEach(menuId => this.hideMenu(menuId));
  }

  update() {
    // Update all UI elements
    this.updateHUD();
    this.updateMinimap();
    this.updateInventory();
    this.updateQuestLog();
    this.updateCharacterPanel();
    this.updateSkillsPanel();
    this.updateShop();
  }
}

// Export the UIManager class
export default UIManager; 