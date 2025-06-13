// Combat UI that handles the display of combat information and controls
class CombatUI {
  constructor(game) {
    this.game = game;
    this.elements = {
      container: null,
      combatLog: null,
      actionButtons: null,
      targetSelection: null,
      statusEffects: null,
      hpBars: null,
      mpBars: null
    };
  }

  // Initialize combat UI elements
  init() {
    // Create main combat container
    this.elements.container = document.createElement('div');
    this.elements.container.className = 'combat-container';
    this.elements.container.style.display = 'none';

    // Create combat log
    this.elements.combatLog = document.createElement('div');
    this.elements.combatLog.className = 'combat-log';
    this.elements.container.appendChild(this.elements.combatLog);

    // Create action buttons container
    this.elements.actionButtons = document.createElement('div');
    this.elements.actionButtons.className = 'action-buttons';
    this.elements.container.appendChild(this.elements.actionButtons);

    // Create target selection container
    this.elements.targetSelection = document.createElement('div');
    this.elements.targetSelection.className = 'target-selection';
    this.elements.targetSelection.style.display = 'none';
    this.elements.container.appendChild(this.elements.targetSelection);

    // Create status effects container
    this.elements.statusEffects = document.createElement('div');
    this.elements.statusEffects.className = 'status-effects';
    this.elements.container.appendChild(this.elements.statusEffects);

    // Create HP/MP bars container
    this.elements.hpBars = document.createElement('div');
    this.elements.hpBars.className = 'hp-bars';
    this.elements.container.appendChild(this.elements.hpBars);

    this.elements.mpBars = document.createElement('div');
    this.elements.mpBars.className = 'mp-bars';
    this.elements.container.appendChild(this.elements.mpBars);

    // Add combat container to game container
    const gameContainer = document.getElementById('game-container');
    gameContainer.appendChild(this.elements.container);

    // Initialize action buttons
    this.initActionButtons();
  }

  // Initialize combat action buttons
  initActionButtons() {
    const actions = [
      { id: 'attack', label: 'Attack', icon: '⚔️' },
      { id: 'skill', label: 'Skills', icon: '✨' },
      { id: 'item', label: 'Items', icon: '🎒' },
      { id: 'defend', label: 'Defend', icon: '🛡️' }
    ];

    actions.forEach(action => {
      const button = document.createElement('button');
      button.className = 'action-button';
      button.innerHTML = `${action.icon} ${action.label}`;
      button.onclick = () => this.handleAction(action.id);
      this.elements.actionButtons.appendChild(button);
    });
  }

  // Show combat UI
  show() {
    this.elements.container.style.display = 'block';
    this.updateCombatants();
  }

  // Hide combat UI
  hide() {
    this.elements.container.style.display = 'none';
  }

  // Update combat log with new entry
  updateCombatLog(entry) {
    const logEntry = document.createElement('div');
    logEntry.className = 'log-entry';
    
    switch (entry.type) {
      case 'damage':
        logEntry.innerHTML = `${entry.target} took ${entry.amount} ${entry.damageType} damage`;
        break;
      case 'heal':
        logEntry.innerHTML = `${entry.target} recovered ${entry.amount} HP`;
        break;
      case 'status':
        logEntry.innerHTML = `${entry.target} is ${entry.effect}`;
        break;
      // Add other log entry types
    }
    
    this.elements.combatLog.appendChild(logEntry);
    this.elements.combatLog.scrollTop = this.elements.combatLog.scrollHeight;
  }

  // Update combatant information (HP/MP bars, status effects)
  updateCombatants() {
    const combatSystem = this.game.systems.combat;
    if (!combatSystem.state.isActive) return;

    // Clear existing bars
    this.elements.hpBars.innerHTML = '';
    this.elements.mpBars.innerHTML = '';
    this.elements.statusEffects.innerHTML = '';

    // Update each combatant
    combatSystem.state.combatants.forEach(combatant => {
      // Create HP bar
      const hpBar = document.createElement('div');
      hpBar.className = 'hp-bar';
      hpBar.innerHTML = `
        <div class="bar-label">${combatant.name}</div>
        <div class="bar-container">
          <div class="bar-fill" style="width: ${(combatant.hp / combatant.maxHp) * 100}%"></div>
          <div class="bar-text">${combatant.hp}/${combatant.maxHp}</div>
        </div>
      `;
      this.elements.hpBars.appendChild(hpBar);

      // Create MP bar
      const mpBar = document.createElement('div');
      mpBar.className = 'mp-bar';
      mpBar.innerHTML = `
        <div class="bar-container">
          <div class="bar-fill" style="width: ${(combatant.mp / combatant.maxMp) * 100}%"></div>
          <div class="bar-text">${combatant.mp}/${combatant.maxMp}</div>
        </div>
      `;
      this.elements.mpBars.appendChild(mpBar);

      // Create status effects
      if (combatant.statusEffects) {
        const statusContainer = document.createElement('div');
        statusContainer.className = 'combatant-status';
        statusContainer.innerHTML = `<div class="combatant-name">${combatant.name}</div>`;
        
        for (const [effect, data] of combatant.statusEffects) {
          const statusIcon = document.createElement('div');
          statusIcon.className = `status-icon ${effect}`;
          statusIcon.title = `${effect} (${data.duration} turns)`;
          statusContainer.appendChild(statusIcon);
        }
        
        this.elements.statusEffects.appendChild(statusContainer);
      }
    });
  }

  // Handle action button clicks
  handleAction(actionId) {
    switch (actionId) {
      case 'attack':
        this.showTargetSelection('attack');
        break;
      case 'skill':
        this.showSkillSelection();
        break;
      case 'item':
        this.showItemSelection();
        break;
      case 'defend':
        this.game.systems.combat.defend(this.game.state.player);
        break;
    }
  }

  // Show target selection UI
  showTargetSelection(actionType) {
    this.elements.targetSelection.style.display = 'block';
    this.elements.targetSelection.innerHTML = '';

    const combatSystem = this.game.systems.combat;
    const validTargets = combatSystem.state.combatants.filter(c => c !== this.game.state.player);

    validTargets.forEach(target => {
      const targetButton = document.createElement('button');
      targetButton.className = 'target-button';
      targetButton.innerHTML = target.name;
      targetButton.onclick = () => {
        this.elements.targetSelection.style.display = 'none';
        if (actionType === 'attack') {
          combatSystem.attack(this.game.state.player, target);
        }
      };
      this.elements.targetSelection.appendChild(targetButton);
    });
  }

  // Show skill selection UI
  showSkillSelection() {
    const player = this.game.state.player;
    const skillContainer = document.createElement('div');
    skillContainer.className = 'skill-selection';

    player.skills.forEach(skill => {
      const skillButton = document.createElement('button');
      skillButton.className = 'skill-button';
      skillButton.innerHTML = `${skill.name} (${skill.mpCost} MP)`;
      skillButton.onclick = () => {
        if (player.mp >= skill.mpCost) {
          this.showTargetSelection('skill');
        } else {
          this.game.managers.ui.showNotification('Not enough MP', '#ff0000');
        }
      };
      skillContainer.appendChild(skillButton);
    });

    this.elements.actionButtons.innerHTML = '';
    this.elements.actionButtons.appendChild(skillContainer);
  }

  // Show item selection UI
  showItemSelection() {
    const player = this.game.state.player;
    const itemContainer = document.createElement('div');
    itemContainer.className = 'item-selection';

    player.inventory.forEach(item => {
      if (item.type === 'consumable') {
        const itemButton = document.createElement('button');
        itemButton.className = 'item-button';
        itemButton.innerHTML = `${item.name} (${item.quantity})`;
        itemButton.onclick = () => {
          this.showTargetSelection('item');
        };
        itemContainer.appendChild(itemButton);
      }
    });

    this.elements.actionButtons.innerHTML = '';
    this.elements.actionButtons.appendChild(itemContainer);
  }
}

export default CombatUI; 