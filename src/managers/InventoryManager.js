// InventoryManager handles player inventory and item management
class InventoryManager {
  constructor(game) {
    this.game = game;
    this.inventory = new Map();
    this.equipped = new Map();
    this.maxSlots = 20;
    this.maxStackSize = 99;
    this.equipmentSlots = {
      weapon: null,
      armor: null,
      helmet: null,
      boots: null,
      accessory: null
    };
  }

  init() {
    // Initialize inventory data
    this.initItemData();
  }

  initItemData() {
    // Define item types and their properties
    this.itemTypes = {
      weapon: {
        slots: ['weapon'],
        equippable: true,
        stackable: false
      },
      armor: {
        slots: ['armor'],
        equippable: true,
        stackable: false
      },
      helmet: {
        slots: ['helmet'],
        equippable: true,
        stackable: false
      },
      boots: {
        slots: ['boots'],
        equippable: true,
        stackable: false
      },
      accessory: {
        slots: ['accessory'],
        equippable: true,
        stackable: false
      },
      consumable: {
        slots: ['inventory'],
        equippable: false,
        stackable: true
      },
      material: {
        slots: ['inventory'],
        equippable: false,
        stackable: true
      },
      quest: {
        slots: ['inventory'],
        equippable: false,
        stackable: true
      }
    };

    // Define item templates
    this.itemTemplates = {
      // Weapons
      'sword_1': {
        id: 'sword_1',
        name: 'Basic Sword',
        type: 'weapon',
        rarity: 'common',
        damage: 10,
        speed: 1.0,
        value: 50,
        description: 'A basic iron sword.'
      },
      'sword_2': {
        id: 'sword_2',
        name: 'Steel Sword',
        type: 'weapon',
        rarity: 'uncommon',
        damage: 15,
        speed: 1.1,
        value: 100,
        description: 'A well-crafted steel sword.'
      },

      // Armor
      'armor_1': {
        id: 'armor_1',
        name: 'Leather Armor',
        type: 'armor',
        rarity: 'common',
        defense: 5,
        value: 40,
        description: 'Basic leather protection.'
      },
      'armor_2': {
        id: 'armor_2',
        name: 'Chain Mail',
        type: 'armor',
        rarity: 'uncommon',
        defense: 10,
        value: 80,
        description: 'Flexible chain mail armor.'
      },

      // Consumables
      'health_potion': {
        id: 'health_potion',
        name: 'Health Potion',
        type: 'consumable',
        rarity: 'common',
        effect: {
          type: 'heal',
          value: 50
        },
        value: 20,
        description: 'Restores 50 health points.'
      },
      'mana_potion': {
        id: 'mana_potion',
        name: 'Mana Potion',
        type: 'consumable',
        rarity: 'common',
        effect: {
          type: 'mana',
          value: 50
        },
        value: 20,
        description: 'Restores 50 mana points.'
      }
    };
  }

  // Inventory Management
  addItem(itemId, quantity = 1) {
    const itemTemplate = this.itemTemplates[itemId];
    if (!itemTemplate) {
      console.error(`Item template not found: ${itemId}`);
      return false;
    }

    const itemType = this.itemTypes[itemTemplate.type];
    if (!itemType) {
      console.error(`Item type not found: ${itemTemplate.type}`);
      return false;
    }

    // Handle stackable items
    if (itemType.stackable) {
      const existingItem = this.findStackableItem(itemId);
      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + quantity, this.maxStackSize);
        const remaining = existingItem.quantity + quantity - newQuantity;
        existingItem.quantity = newQuantity;

        if (remaining > 0) {
          return this.addItem(itemId, remaining);
        }
        return true;
      }
    }

    // Check inventory space
    if (this.inventory.size >= this.maxSlots) {
      this.game.managers.ui.showNotification('Inventory is full', '#ff0000');
      return false;
    }

    // Create new item instance
    const item = {
      ...itemTemplate,
      quantity: quantity,
      equipped: false
    };

    this.inventory.set(this.generateItemId(), item);
    this.game.managers.ui.showNotification(`Added ${quantity}x ${item.name}`, '#00ff00');
    return true;
  }

  removeItem(itemId, quantity = 1) {
    const item = this.inventory.get(itemId);
    if (!item) {
      console.error(`Item not found: ${itemId}`);
      return false;
    }

    if (item.quantity > quantity) {
      item.quantity -= quantity;
    } else {
      this.inventory.delete(itemId);
      if (item.equipped) {
        this.unequipItem(itemId);
      }
    }

    this.game.managers.ui.showNotification(`Removed ${quantity}x ${item.name}`, '#ff0000');
    return true;
  }

  // Equipment Management
  equipItem(itemId) {
    const item = this.inventory.get(itemId);
    if (!item) {
      console.error(`Item not found: ${itemId}`);
      return false;
    }

    const itemType = this.itemTypes[item.type];
    if (!itemType.equippable) {
      this.game.managers.ui.showNotification('Item cannot be equipped', '#ff0000');
      return false;
    }

    // Unequip current item in slot
    const slot = itemType.slots[0];
    const currentItem = this.equipmentSlots[slot];
    if (currentItem) {
      this.unequipItem(currentItem.id);
    }

    // Equip new item
    item.equipped = true;
    this.equipmentSlots[slot] = item;
    this.updatePlayerStats();

    this.game.managers.ui.showNotification(`Equipped ${item.name}`, '#00ff00');
    return true;
  }

  unequipItem(itemId) {
    const item = this.inventory.get(itemId);
    if (!item || !item.equipped) {
      console.error(`Item not found or not equipped: ${itemId}`);
      return false;
    }

    const itemType = this.itemTypes[item.type];
    const slot = itemType.slots[0];
    
    item.equipped = false;
    this.equipmentSlots[slot] = null;
    this.updatePlayerStats();

    this.game.managers.ui.showNotification(`Unequipped ${item.name}`, '#ff0000');
    return true;
  }

  // Item Usage
  useItem(itemId) {
    const item = this.inventory.get(itemId);
    if (!item) {
      console.error(`Item not found: ${itemId}`);
      return false;
    }

    if (item.type === 'consumable') {
      this.applyItemEffect(item);
      this.removeItem(itemId, 1);
      return true;
    }

    return false;
  }

  applyItemEffect(item) {
    if (!item.effect) return;

    switch (item.effect.type) {
      case 'heal':
        this.game.managers.entity.player.health = Math.min(
          this.game.managers.entity.player.health + item.effect.value,
          this.game.managers.entity.player.maxHealth
        );
        break;
      case 'mana':
        this.game.managers.entity.player.mana = Math.min(
          this.game.managers.entity.player.mana + item.effect.value,
          this.game.managers.entity.player.maxMana
        );
        break;
    }

    this.game.managers.ui.showNotification(`Used ${item.name}`, '#00ff00');
  }

  // Inventory Queries
  findStackableItem(itemId) {
    for (const [id, item] of this.inventory) {
      if (item.id === itemId && item.quantity < this.maxStackSize) {
        return item;
      }
    }
    return null;
  }

  getItemCount(itemId) {
    let count = 0;
    for (const item of this.inventory.values()) {
      if (item.id === itemId) {
        count += item.quantity;
      }
    }
    return count;
  }

  hasItem(itemId, quantity = 1) {
    return this.getItemCount(itemId) >= quantity;
  }

  // Equipment Queries
  getEquippedItem(slot) {
    return this.equipmentSlots[slot];
  }

  getEquipmentStats() {
    const stats = {
      damage: 0,
      defense: 0,
      speed: 1.0
    };

    for (const item of Object.values(this.equipmentSlots)) {
      if (item) {
        if (item.damage) stats.damage += item.damage;
        if (item.defense) stats.defense += item.defense;
        if (item.speed) stats.speed *= item.speed;
      }
    }

    return stats;
  }

  // Player Stats
  updatePlayerStats() {
    const stats = this.getEquipmentStats();
    const player = this.game.managers.entity.player;

    player.damage = stats.damage;
    player.defense = stats.defense;
    player.speed = stats.speed;
  }

  // Utility Functions
  generateItemId() {
    return `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Inventory State Management
  saveInventoryState() {
    return {
      inventory: Array.from(this.inventory.entries()),
      equipmentSlots: this.equipmentSlots
    };
  }

  loadInventoryState(state) {
    this.inventory = new Map(state.inventory);
    this.equipmentSlots = state.equipmentSlots;
    this.updatePlayerStats();
  }

  // Inventory Events
  onItemAdded(item) {
    this.game.managers.ui.showItemAdded(item);
  }

  onItemRemoved(item) {
    this.game.managers.ui.showItemRemoved(item);
  }

  onItemEquipped(item) {
    this.game.managers.ui.showItemEquipped(item);
  }

  onItemUnequipped(item) {
    this.game.managers.ui.showItemUnequipped(item);
  }

  onItemUsed(item) {
    this.game.managers.ui.showItemUsed(item);
  }
}

// Export the InventoryManager class
export default InventoryManager; 