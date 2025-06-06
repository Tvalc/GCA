// QuestManager handles quests and objectives
class QuestManager {
  constructor(game) {
    this.game = game;
    this.quests = new Map();
    this.activeQuests = new Map();
    this.completedQuests = new Set();
    this.questLog = [];
    this.maxActiveQuests = 5;
  }

  init() {
    // Initialize quest data
    this.initQuestData();
  }

  initQuestData() {
    // Load quest definitions
    this.quests.set('tutorial', {
      id: 'tutorial',
      title: 'Tutorial Quest',
      description: 'Learn the basics of the game.',
      level: 1,
      type: 'main',
      steps: [
        {
          id: 'move',
          description: 'Move around using WASD',
          type: 'movement',
          target: 100,
          progress: 0
        },
        {
          id: 'attack',
          description: 'Attack an enemy',
          type: 'combat',
          target: 1,
          progress: 0
        },
        {
          id: 'collect',
          description: 'Collect 5 items',
          type: 'collection',
          target: 5,
          progress: 0
        }
      ],
      rewards: {
        xp: 100,
        gold: 50,
        items: ['health_potion']
      },
      prerequisites: []
    });

    this.quests.set('slime_hunt', {
      id: 'slime_hunt',
      title: 'Slime Hunt',
      description: 'Defeat 10 slimes in the dungeon.',
      level: 2,
      type: 'side',
      steps: [
        {
          id: 'kill_slimes',
          description: 'Defeat 10 slimes',
          type: 'kill',
          target: 10,
          progress: 0,
          targetType: 'slime'
        }
      ],
      rewards: {
        xp: 200,
        gold: 100,
        items: ['mana_potion']
      },
      prerequisites: ['tutorial']
    });

    this.quests.set('shop_delivery', {
      id: 'shop_delivery',
      title: 'Shop Delivery',
      description: 'Deliver supplies to the shopkeeper.',
      level: 3,
      type: 'side',
      steps: [
        {
          id: 'collect_supplies',
          description: 'Collect 3 supply crates',
          type: 'collection',
          target: 3,
          progress: 0,
          itemType: 'supply_crate'
        },
        {
          id: 'deliver_supplies',
          description: 'Deliver supplies to the shopkeeper',
          type: 'delivery',
          target: 1,
          progress: 0,
          targetNPC: 'shopkeeper'
        }
      ],
      rewards: {
        xp: 300,
        gold: 150,
        items: ['weapon_upgrade']
      },
      prerequisites: ['tutorial']
    });
  }

  // Quest Management
  startQuest(questId) {
    const quest = this.quests.get(questId);
    if (!quest) {
      console.error(`Quest not found: ${questId}`);
      return false;
    }

    // Check prerequisites
    if (!this.checkPrerequisites(quest)) {
      this.game.managers.ui.showNotification('Quest prerequisites not met', '#ff0000');
      return false;
    }

    // Check active quest limit
    if (this.activeQuests.size >= this.maxActiveQuests) {
      this.game.managers.ui.showNotification('Maximum active quests reached', '#ff0000');
      return false;
    }

    // Create quest instance
    const questInstance = {
      ...quest,
      steps: quest.steps.map(step => ({ ...step })),
      startTime: Date.now(),
      completed: false
    };

    this.activeQuests.set(questId, questInstance);
    this.questLog.push({
      type: 'start',
      questId,
      timestamp: Date.now()
    });

    this.game.managers.ui.showNotification(`Quest started: ${quest.title}`, '#00ff00');
    return true;
  }

  completeQuest(questId) {
    const quest = this.activeQuests.get(questId);
    if (!quest) {
      console.error(`Quest not found: ${questId}`);
      return false;
    }

    // Check if all steps are completed
    if (!this.isQuestComplete(quest)) {
      return false;
    }

    // Award rewards
    this.awardQuestRewards(quest);

    // Update quest state
    quest.completed = true;
    this.completedQuests.add(questId);
    this.activeQuests.delete(questId);

    this.questLog.push({
      type: 'complete',
      questId,
      timestamp: Date.now()
    });

    this.game.managers.ui.showNotification(`Quest completed: ${quest.title}`, '#00ff00');
    return true;
  }

  abandonQuest(questId) {
    const quest = this.activeQuests.get(questId);
    if (!quest) {
      console.error(`Quest not found: ${questId}`);
      return false;
    }

    this.activeQuests.delete(questId);
    this.questLog.push({
      type: 'abandon',
      questId,
      timestamp: Date.now()
    });

    this.game.managers.ui.showNotification(`Quest abandoned: ${quest.title}`, '#ff0000');
    return true;
  }

  // Quest Progress
  updateQuestProgress(type, data) {
    for (const quest of this.activeQuests.values()) {
      for (const step of quest.steps) {
        if (step.type === type && !step.completed) {
          this.updateStepProgress(step, data);
        }
      }
    }
  }

  updateStepProgress(step, data) {
    switch (step.type) {
      case 'kill':
        if (data.targetType === step.targetType) {
          step.progress = Math.min(step.progress + 1, step.target);
        }
        break;
      case 'collection':
        if (data.itemType === step.itemType) {
          step.progress = Math.min(step.progress + 1, step.target);
        }
        break;
      case 'delivery':
        if (data.targetNPC === step.targetNPC) {
          step.progress = Math.min(step.progress + 1, step.target);
        }
        break;
      case 'movement':
        step.progress = Math.min(step.progress + data.distance, step.target);
        break;
    }

    // Check if step is completed
    if (step.progress >= step.target) {
      step.completed = true;
      this.game.managers.ui.showNotification(`Quest step completed: ${step.description}`, '#00ff00');
    }
  }

  // Quest State
  isQuestComplete(quest) {
    return quest.steps.every(step => step.completed);
  }

  checkPrerequisites(quest) {
    return quest.prerequisites.every(prereq => this.completedQuests.has(prereq));
  }

  getQuestProgress(questId) {
    const quest = this.activeQuests.get(questId);
    if (!quest) return null;

    return {
      steps: quest.steps.map(step => ({
        description: step.description,
        progress: step.progress,
        target: step.target,
        completed: step.completed
      })),
      completed: this.isQuestComplete(quest)
    };
  }

  // Quest Rewards
  awardQuestRewards(quest) {
    // Award XP
    if (quest.rewards.xp) {
      this.game.managers.entity.player.xp += quest.rewards.xp;
    }

    // Award gold
    if (quest.rewards.gold) {
      this.game.state.gold += quest.rewards.gold;
    }

    // Award items
    if (quest.rewards.items) {
      for (const itemId of quest.rewards.items) {
        this.game.managers.entity.createItem(itemId, this.game.managers.entity.player.position);
      }
    }
  }

  // Quest Queries
  getAvailableQuests() {
    const availableQuests = [];
    for (const quest of this.quests.values()) {
      if (!this.activeQuests.has(quest.id) && 
          !this.completedQuests.has(quest.id) && 
          this.checkPrerequisites(quest)) {
        availableQuests.push(quest);
      }
    }
    return availableQuests;
  }

  getActiveQuests() {
    return Array.from(this.activeQuests.values());
  }

  getCompletedQuests() {
    return Array.from(this.completedQuests).map(id => this.quests.get(id));
  }

  getQuestById(questId) {
    return this.quests.get(questId);
  }

  // Quest Log
  getQuestLog() {
    return this.questLog;
  }

  clearQuestLog() {
    this.questLog = [];
  }

  // Quest State Management
  saveQuestState() {
    return {
      activeQuests: Array.from(this.activeQuests.entries()),
      completedQuests: Array.from(this.completedQuests),
      questLog: this.questLog
    };
  }

  loadQuestState(state) {
    this.activeQuests = new Map(state.activeQuests);
    this.completedQuests = new Set(state.completedQuests);
    this.questLog = state.questLog;
  }

  // Quest Events
  onQuestStarted(questId) {
    this.game.managers.ui.showQuestStarted(this.getQuestById(questId));
  }

  onQuestCompleted(questId) {
    this.game.managers.ui.showQuestCompleted(this.getQuestById(questId));
  }

  onQuestAbandoned(questId) {
    this.game.managers.ui.showQuestAbandoned(this.getQuestById(questId));
  }

  onStepCompleted(questId, stepId) {
    const quest = this.getQuestById(questId);
    const step = quest.steps.find(s => s.id === stepId);
    this.game.managers.ui.showStepCompleted(quest, step);
  }
}

// Export the QuestManager class
export default QuestManager; 