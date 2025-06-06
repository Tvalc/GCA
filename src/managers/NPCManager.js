// NPCManager handles non-player characters and their interactions
class NPCManager {
  constructor(game) {
    this.game = game;
    this.npcs = new Map();
    this.dialogues = new Map();
    this.questGivers = new Map();
    this.merchants = new Map();
    this.interactions = new Map();
  }

  init() {
    // Initialize NPC data
    this.initNPCData();
  }

  initNPCData() {
    // Define NPC types
    this.npcTypes = {
      questGiver: {
        name: 'Quest Giver',
        color: '#00ff00'
      },
      merchant: {
        name: 'Merchant',
        color: '#ffff00'
      },
      trainer: {
        name: 'Trainer',
        color: '#0000ff'
      },
      guard: {
        name: 'Guard',
        color: '#ff0000'
      },
      civilian: {
        name: 'Civilian',
        color: '#808080'
      }
    };

    // Define NPC templates
    this.npcTemplates = {
      // Quest Givers
      'elder': {
        id: 'elder',
        name: 'Village Elder',
        type: 'questGiver',
        position: { x: 100, y: 100 },
        quests: ['tutorial', 'slime_hunt'],
        dialogue: 'elder_dialogue',
        sprite: 'elder'
      },
      'hunter': {
        id: 'hunter',
        name: 'Master Hunter',
        type: 'questGiver',
        position: { x: 200, y: 150 },
        quests: ['shop_delivery'],
        dialogue: 'hunter_dialogue',
        sprite: 'hunter'
      },

      // Merchants
      'shopkeeper': {
        id: 'shopkeeper',
        name: 'Shopkeeper',
        type: 'merchant',
        position: { x: 150, y: 200 },
        inventory: ['health_potion', 'mana_potion', 'sword_1', 'armor_1'],
        dialogue: 'shopkeeper_dialogue',
        sprite: 'shopkeeper'
      },
      'blacksmith': {
        id: 'blacksmith',
        name: 'Blacksmith',
        type: 'merchant',
        position: { x: 250, y: 250 },
        inventory: ['sword_2', 'armor_2'],
        dialogue: 'blacksmith_dialogue',
        sprite: 'blacksmith'
      },

      // Trainers
      'mage': {
        id: 'mage',
        name: 'Master Mage',
        type: 'trainer',
        position: { x: 300, y: 300 },
        skills: ['fireball', 'heal'],
        dialogue: 'mage_dialogue',
        sprite: 'mage'
      },
      'warrior': {
        id: 'warrior',
        name: 'Master Warrior',
        type: 'trainer',
        position: { x: 350, y: 350 },
        skills: ['slash', 'strength'],
        dialogue: 'warrior_dialogue',
        sprite: 'warrior'
      }
    };

    // Define dialogues
    this.dialogueTemplates = {
      'elder_dialogue': {
        greeting: "Welcome, young adventurer. The village needs your help.",
        quests: {
          available: "There are tasks that need to be done. Will you help?",
          active: "How are your tasks coming along?",
          completed: "Thank you for your help, brave adventurer."
        },
        farewell: "May the gods watch over you."
      },
      'shopkeeper_dialogue': {
        greeting: "Welcome to my shop! What can I do for you today?",
        trade: {
          buy: "That'll be {price} gold. A fair price, don't you think?",
          sell: "I'll give you {price} gold for that. Deal?",
          notEnoughGold: "I'm afraid you don't have enough gold.",
          inventoryFull: "Your inventory seems to be full."
        },
        farewell: "Come back soon!"
      }
    };
  }

  // NPC Management
  createNPC(npcId, position) {
    const template = this.npcTemplates[npcId];
    if (!template) {
      console.error(`NPC template not found: ${npcId}`);
      return null;
    }

    const npc = {
      ...template,
      position: position || template.position,
      state: {
        lastInteraction: 0,
        questProgress: new Map(),
        inventory: new Map(),
        dialogueState: {}
      }
    };

    this.npcs.set(npcId, npc);

    // Add to appropriate manager
    switch (npc.type) {
      case 'questGiver':
        this.questGivers.set(npcId, npc);
        break;
      case 'merchant':
        this.merchants.set(npcId, npc);
        break;
    }

    return npc;
  }

  removeNPC(npcId) {
    const npc = this.npcs.get(npcId);
    if (!npc) return false;

    this.npcs.delete(npcId);
    this.questGivers.delete(npcId);
    this.merchants.delete(npcId);

    return true;
  }

  // NPC Interaction
  interactWithNPC(npcId, player) {
    const npc = this.npcs.get(npcId);
    if (!npc) {
      console.error(`NPC not found: ${npcId}`);
      return false;
    }

    // Check interaction distance
    if (!this.isInRange(player.position, npc.position)) {
      this.game.managers.ui.showNotification('Too far to interact', '#ff0000');
      return false;
    }

    // Update last interaction time
    npc.state.lastInteraction = Date.now();

    // Handle interaction based on NPC type
    switch (npc.type) {
      case 'questGiver':
        this.handleQuestGiverInteraction(npc, player);
        break;
      case 'merchant':
        this.handleMerchantInteraction(npc, player);
        break;
      case 'trainer':
        this.handleTrainerInteraction(npc, player);
        break;
      default:
        this.handleBasicInteraction(npc, player);
    }

    return true;
  }

  // Quest Giver Interaction
  handleQuestGiverInteraction(npc, player) {
    const dialogue = this.dialogueTemplates[npc.dialogue];
    if (!dialogue) return;

    // Get available quests
    const availableQuests = this.getAvailableQuests(npc, player);
    const activeQuests = this.getActiveQuests(npc, player);
    const completedQuests = this.getCompletedQuests(npc, player);

    // Show dialogue
    this.game.managers.ui.showDialogue(npc, {
      greeting: dialogue.greeting,
      quests: {
        available: availableQuests.length > 0 ? dialogue.quests.available : null,
        active: activeQuests.length > 0 ? dialogue.quests.active : null,
        completed: completedQuests.length > 0 ? dialogue.quests.completed : null
      },
      farewell: dialogue.farewell
    });
  }

  // Merchant Interaction
  handleMerchantInteraction(npc, player) {
    const dialogue = this.dialogueTemplates[npc.dialogue];
    if (!dialogue) return;

    // Show shop interface
    this.game.managers.ui.showShop(npc, {
      greeting: dialogue.greeting,
      trade: dialogue.trade,
      farewell: dialogue.farewell
    });
  }

  // Trainer Interaction
  handleTrainerInteraction(npc, player) {
    // Show skill training interface
    this.game.managers.ui.showTraining(npc, {
      skills: npc.skills,
      player: player
    });
  }

  // Basic Interaction
  handleBasicInteraction(npc, player) {
    const dialogue = this.dialogueTemplates[npc.dialogue];
    if (!dialogue) return;

    // Show basic dialogue
    this.game.managers.ui.showDialogue(npc, {
      greeting: dialogue.greeting,
      farewell: dialogue.farewell
    });
  }

  // Quest Management
  getAvailableQuests(npc, player) {
    return npc.quests.filter(questId => {
      const quest = this.game.managers.quest.getQuestById(questId);
      return quest && this.game.managers.quest.checkPrerequisites(quest);
    });
  }

  getActiveQuests(npc, player) {
    return npc.quests.filter(questId => {
      return this.game.managers.quest.activeQuests.has(questId);
    });
  }

  getCompletedQuests(npc, player) {
    return npc.quests.filter(questId => {
      return this.game.managers.quest.completedQuests.has(questId);
    });
  }

  // Merchant Management
  getMerchantInventory(npc) {
    return npc.inventory.map(itemId => {
      const template = this.game.managers.inventory.itemTemplates[itemId];
      return {
        ...template,
        price: this.calculateItemPrice(template)
      };
    });
  }

  calculateItemPrice(item) {
    // Base price calculation
    let price = item.value || 0;

    // Apply merchant markup
    price *= 1.2;

    // Apply player reputation modifier
    const reputation = this.game.managers.player.getReputation();
    price *= (1 - (reputation * 0.1));

    return Math.floor(price);
  }

  // Utility Functions
  isInRange(pos1, pos2, range = 2) {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    return Math.sqrt(dx * dx + dy * dy) <= range;
  }

  // NPC State Management
  saveNPCState() {
    return {
      npcs: Array.from(this.npcs.entries()),
      dialogues: Array.from(this.dialogues.entries())
    };
  }

  loadNPCState(state) {
    this.npcs = new Map(state.npcs);
    this.dialogues = new Map(state.dialogues);

    // Rebuild quest givers and merchants maps
    this.questGivers.clear();
    this.merchants.clear();

    for (const [id, npc] of this.npcs) {
      if (npc.type === 'questGiver') {
        this.questGivers.set(id, npc);
      } else if (npc.type === 'merchant') {
        this.merchants.set(id, npc);
      }
    }
  }

  // NPC Events
  onNPCInteraction(npc, player) {
    this.game.managers.ui.showNPCInteraction(npc);
  }

  onQuestOffered(npc, quest) {
    this.game.managers.ui.showQuestOffered(npc, quest);
  }

  onTradeStarted(npc, player) {
    this.game.managers.ui.showTradeStarted(npc);
  }

  onTrainingStarted(npc, player) {
    this.game.managers.ui.showTrainingStarted(npc);
  }
}

// Export the NPCManager class
export default NPCManager; 