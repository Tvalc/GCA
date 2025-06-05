// Relic System Debug and Fix
// Version: 2.0 (2025-05-17)

window.RELIC_DEBUG = {
  // Track original stat values
  originalStats: null,
  
  // Record of all stat changes
  statChanges: [],
  
  // Initialize by capturing base stats
  init: function(player) {
    if (!player || !player.stats) return;
    
    // Store a copy of original stats
    this.originalStats = {
      strength: player.stats.strength,
      dexterity: player.stats.dexterity,
      intelligence: player.stats.intelligence,
      vitality: player.stats.vitality,
      fortune: player.stats.fortune,
      charisma: player.stats.charisma
    };
    
    console.log("[STATS] Captured base player stats:", this.originalStats);
  },
  
  // Log a stat change
  logStatChange: function(action, relicName, oldStats, newStats) {
    const change = {
      timestamp: new Date().toISOString(),
      action: action,
      relicName: relicName,
      oldStats: {...oldStats},
      newStats: {...newStats},
      diff: {
        strength: newStats.strength - oldStats.strength,
        dexterity: newStats.dexterity - oldStats.dexterity,
        intelligence: newStats.intelligence - oldStats.intelligence,
        vitality: newStats.vitality - oldStats.vitality,
        fortune: newStats.fortune - oldStats.fortune,
        charisma: newStats.charisma - oldStats.charisma
      }
    };
    
    this.statChanges.push(change);
    
    // Log the change
    console.log(`[STATS] ${action} ${relicName}:`, 
      `STR: ${oldStats.strength} → ${newStats.strength} (${change.diff.strength}), ` +
      `DEX: ${oldStats.dexterity} → ${newStats.dexterity} (${change.diff.dexterity}), ` +
      `INT: ${oldStats.intelligence} → ${newStats.intelligence} (${change.diff.intelligence}), ` +
      `VIT: ${oldStats.vitality} → ${newStats.vitality} (${change.diff.vitality}), ` +
      `FOR: ${oldStats.fortune} → ${newStats.fortune} (${change.diff.fortune}), ` +
      `CHA: ${oldStats.charisma} → ${newStats.charisma} (${change.diff.charisma})`
    );
    
    return change;
  },
  
  // Show stat history in console
  showHistory: function() {
    console.log("[STATS] Stat change history:", this.statChanges);
  }
};

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
  console.log("[RELIC] Initializing relic system fixes and debug");
  
  // Wait for game systems to initialize
  setTimeout(function() {
    if (!window.RELIC_SYSTEM) {
      console.error("[RELIC] RELIC_SYSTEM not found, cannot apply fixes");
      return;
    }
    
    console.log("[RELIC] Installing fixes...");
    
    // Save references to original functions
    const originalApply = window.RELIC_SYSTEM.applyRelicBonuses;
    const originalRemove = window.RELIC_SYSTEM.removeRelicBonuses;
    
    // Flag to detect if we're in a complete refresh
    let refreshingUI = false;
    
    // Initialize debug tracking
    const gameStateCheck = setInterval(() => {
      const player = window.GameStateManager?.state?.player;
      if (player && player.stats) {
        window.RELIC_DEBUG.init(player);
        clearInterval(gameStateCheck);
      }
    }, 1000);
    
    // Override applyRelicBonuses
    window.RELIC_SYSTEM.applyRelicBonuses = function(player, relicName) {
      console.log(`[RELIC] Applying relic: ${relicName}`);
      
      // Get the relic
      const relic = player.relics[relicName];
      if (!relic) {
        console.error(`[RELIC] Relic ${relicName} not found`);
        return false;
      }
      
      // Setup equipment object and slots
      if (!player.equipment) player.equipment = {};
      if (player.equipment.relic_1 === undefined) player.equipment.relic_1 = null;
      if (player.equipment.relic_2 === undefined) player.equipment.relic_2 = null;
      
      // Setup applied bonuses tracking
      if (!player.appliedRelicBonuses) player.appliedRelicBonuses = {};
      
      // Check if already applied
      if (player.appliedRelicBonuses[relicName] === true) {
        console.log(`[RELIC] Relic ${relicName} already equipped`);
        return false;
      }
      
      // Count equipped relics
      let equippedCount = 0;
      for (const key in player.appliedRelicBonuses) {
        if (player.appliedRelicBonuses[key] === true) equippedCount++;
      }
      
      if (equippedCount >= 2) {
        console.log("[RELIC] Cannot equip more than 2 relics");
        if (typeof UIManager !== 'undefined' && UIManager.log) {
          UIManager.log('You cannot equip more than 2 relics at once. Unequip one first.');
        }
        return false;
      }
      
      // Store original stats before change
      const oldStats = {
        strength: player.stats.strength,
        dexterity: player.stats.dexterity,
        intelligence: player.stats.intelligence,
        vitality: player.stats.vitality,
        fortune: player.stats.fortune,
        charisma: player.stats.charisma
      };
      
      // Apply stat bonuses
      const bonusAmount = relic.level;
      player.stats.strength += bonusAmount;
      player.stats.dexterity += bonusAmount;
      player.stats.intelligence += bonusAmount;
      player.stats.vitality += bonusAmount;
      player.stats.fortune += bonusAmount;
      player.stats.charisma += bonusAmount;
      
      // Log the stat change
      window.RELIC_DEBUG.logStatChange("Applied", relicName, oldStats, player.stats);
      
      // Add to equipment slot
      if (player.equipment.relic_1 === null) {
        console.log(`[RELIC] Adding ${relicName} to relic_1 slot`);
        player.equipment.relic_1 = {
          name: relic.name,
          type: 'relic',
          relicId: relicName,
          level: relic.level
        };
      } else if (player.equipment.relic_2 === null) {
        console.log(`[RELIC] Adding ${relicName} to relic_2 slot`);
        player.equipment.relic_2 = {
          name: relic.name,
          type: 'relic',
          relicId: relicName,
          level: relic.level
        };
      } else {
        console.log('[RELIC] No available relic slots');
        return false;
      }
      
      // Mark as applied
      player.appliedRelicBonuses[relicName] = true;
      
      // Recalculate derived stats
      if (typeof LEVELING_SYSTEM !== 'undefined' && LEVELING_SYSTEM.updateCharacterStats) {
        LEVELING_SYSTEM.updateCharacterStats(player);
      }
      
      // CRITICAL FIX: Force relics to stay visible in tab
      forceShowRelicsInTab(player);
      
      // Update character screen to show new stats
      updateGameUI(player);
      
      return true;
    };
    
    // Override removeRelicBonuses
    window.RELIC_SYSTEM.removeRelicBonuses = function(player, relicName) {
      console.log(`[RELIC] Removing relic: ${relicName}`);
      
      // Get the relic
      const relic = player.relics[relicName];
      if (!relic) {
        console.error(`[RELIC] Relic ${relicName} not found`);
        return false;
      }
      
      // Verify relic is currently equipped
      if (!player.appliedRelicBonuses || player.appliedRelicBonuses[relicName] !== true) {
        console.log(`[RELIC] Relic ${relicName} is not currently equipped`);
        return false;
      }
      
      // Store original stats before removal
      const oldStats = {
        strength: player.stats.strength,
        dexterity: player.stats.dexterity,
        intelligence: player.stats.intelligence,
        vitality: player.stats.vitality,
        fortune: player.stats.fortune,
        charisma: player.stats.charisma
      };
      
      // CRITICAL FIX: Explicitly set the exact bonus amount
      const bonusAmount = relic.level;
      console.log(`[RELIC] Removing ${bonusAmount} points from all stats`);
      
      // Remove from equipment slots
      let wasEquipped = false;
      if (player.equipment) {
        if (player.equipment.relic_1 && player.equipment.relic_1.relicId === relicName) {
          console.log(`[RELIC] Removing ${relicName} from relic_1 slot`);
          player.equipment.relic_1 = null;
          wasEquipped = true;
        } else if (player.equipment.relic_2 && player.equipment.relic_2.relicId === relicName) {
          console.log(`[RELIC] Removing ${relicName} from relic_2 slot`);
          player.equipment.relic_2 = null;
          wasEquipped = true;
        }
      }
      
      if (!wasEquipped) {
        console.warn(`[RELIC] Relic ${relicName} was marked as applied but not found in equipment slots`);
      }
      
      // CRITICAL FIX: Explicitly subtract exact bonus amount
      player.stats.strength -= bonusAmount;
      player.stats.dexterity -= bonusAmount;
      player.stats.intelligence -= bonusAmount;
      player.stats.vitality -= bonusAmount;
      player.stats.fortune -= bonusAmount;
      player.stats.charisma -= bonusAmount;
      
      // Log the stat change
      window.RELIC_DEBUG.logStatChange("Removed", relicName, oldStats, player.stats);
      
      // Mark as not applied
      player.appliedRelicBonuses[relicName] = false;
      
      // Recalculate derived stats
      if (typeof LEVELING_SYSTEM !== 'undefined' && LEVELING_SYSTEM.updateCharacterStats) {
        LEVELING_SYSTEM.updateCharacterStats(player);
      }
      
      // CRITICAL FIX: Force relics to stay visible in tab
      forceShowRelicsInTab(player);
      
      // Update character screen to show new stats
      updateGameUI(player);
      
      return true;
    };
    
    // Function to force relics to always appear in the relics tab
    function forceShowRelicsInTab(player) {
      if (!player || !player.relics) return;
      
      console.log("[RELIC] Forcing relics to remain visible in tab");
      
      // Find the relics tab
      const relicsTab = document.getElementById('relics-tab');
      if (!relicsTab) {
        console.error("[RELIC] Relics tab element not found");
        return;
      }
      
      // Get or create the equipment list
      let relicsList = relicsTab.querySelector('.equipment-list');
      if (!relicsList) {
        console.log("[RELIC] Creating equipment list in relics tab");
        relicsList = document.createElement('div');
        relicsList.className = 'equipment-list';
        relicsTab.appendChild(relicsList);
      }
      
      // Remember active tab state
      const wasActive = relicsTab.classList.contains('active');
      const activeTabId = document.querySelector('.tab-content.active')?.id;
      
      // Clear and rebuild the relics list
      relicsList.innerHTML = '';
      
      // Add all relics to the list, regardless of equipped status
      for (const relicId in player.relics) {
        const relic = player.relics[relicId];
        const isEquipped = player.appliedRelicBonuses && player.appliedRelicBonuses[relicId] === true;
        
        // Create relic element
        const relicElement = document.createElement('div');
        relicElement.className = 'relic-item' + (isEquipped ? ' equipped' : '');
        relicElement.setAttribute('data-relic-id', relicId);
        
        // Create content
        relicElement.innerHTML = `
          <div class="relic-header">
            <span class="relic-name">${relic.name}</span>
            <span class="relic-status">${isEquipped ? 'EQUIPPED' : 'CLICK TO EQUIP'}</span>
          </div>
          <div class="relic-description">${relic.description || 'A mysterious artifact with special powers.'}</div>
          <div class="relic-level">Level: ${relic.level}</div>
        `;
        
        // Add click handler
        relicElement.addEventListener('click', function() {
          if (isEquipped) {
            window.RELIC_SYSTEM.removeRelicBonuses(player, relicId);
          } else {
            window.RELIC_SYSTEM.applyRelicBonuses(player, relicId);
          }
        });
        
        // Add to list
        relicsList.appendChild(relicElement);
      }
      
      // If there are no relics, add a placeholder message
      if (relicsList.children.length === 0) {
        const placeholder = document.createElement('div');
        placeholder.className = 'relic-placeholder';
        placeholder.innerHTML = '<div style="padding: 10px; color: #00ffff;">Find relics to equip them here.</div>';
        relicsList.appendChild(placeholder);
      }
      
      // Restore active tab state if we're not in a refresh cycle
      if (!refreshingUI && activeTabId) {
        setTimeout(() => {
          document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
          });
          
          document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
          });
          
          const tab = document.getElementById(activeTabId);
          if (tab) {
            tab.classList.add('active');
            
            // Also make the button active
            const btn = document.querySelector(`.tab-button[data-tab="${activeTabId}"]`);
            if (btn) btn.classList.add('active');
          }
        }, 50);
      }
    }
    
    // Update all UI elements when stats change
    function updateGameUI(player) {
      // Don't nest updates
      if (refreshingUI) return;
      
      refreshingUI = true;
      
      // Update character screen if it exists
      if (typeof updateCharacterScreen === 'function') {
        console.log("[RELIC] Updating character screen");
        updateCharacterScreen();
      }
      
      // Update stat displays
      updateStatDisplays(player);
      
      refreshingUI = false;
    }
    
    // Update all stat displays with current values
    function updateStatDisplays(player) {
      if (!player || !player.stats) return;
      
      console.log("[RELIC] Updating stat displays");
      
      // Update stat values in character screen
      document.querySelectorAll('.character-stat').forEach(statElement => {
        const statType = statElement.getAttribute('data-stat-type');
        if (statType && player.stats[statType] !== undefined) {
          const valueElement = statElement.querySelector('.stat-value');
          if (valueElement) {
            valueElement.textContent = player.stats[statType];
          }
        }
      });
      
      // Update derived stats like HP/MP max
      document.querySelectorAll('.derived-stat').forEach(statElement => {
        const statType = statElement.getAttribute('data-stat-type');
        if (statType && player.derivedStats && player.derivedStats[statType] !== undefined) {
          const valueElement = statElement.querySelector('.stat-value');
          if (valueElement) {
            valueElement.textContent = player.derivedStats[statType];
          }
        }
      });
    }
    
    // Observer to catch when the relics tab is added to DOM
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (let i = 0; i < mutation.addedNodes.length; i++) {
            const node = mutation.addedNodes[i];
            if (node.id === 'relics-tab') {
              console.log("[RELIC] Relics tab added to DOM");
              const player = window.GameStateManager?.state?.player;
              if (player) {
                forceShowRelicsInTab(player);
              }
            }
          }
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Hook into tab button clicks
    document.addEventListener('click', function(e) {
      if (e.target.classList.contains('tab-button') || e.target.closest('.tab-button')) {
        const button = e.target.classList.contains('tab-button') ? e.target : e.target.closest('.tab-button');
        const tabId = button.getAttribute('data-tab');
        
        if (tabId === 'relics-tab') {
          console.log("[RELIC] Relics tab selected");
          const player = window.GameStateManager?.state?.player;
          if (player) {
            // Slight delay to let the tab change happen first
            setTimeout(() => forceShowRelicsInTab(player), 50);
          }
        }
      }
    }, true);
    
    // Add debugging commands to window object
    window.relicDebug = {
      showStats: function() {
        const player = window.GameStateManager?.state?.player;
        if (player && player.stats) {
          console.log("[STATS] Current player stats:", player.stats);
          return player.stats;
        }
        return "Player stats not found";
      },
      showEquipped: function() {
        const player = window.GameStateManager?.state?.player;
        if (player && player.equipment) {
          console.log("[RELIC] Equipped relics:", player.equipment);
          return {
            relic_1: player.equipment.relic_1,
            relic_2: player.equipment.relic_2
          };
        }
        return "Equipment not found";
      },
      showRelics: function() {
        const player = window.GameStateManager?.state?.player;
        if (player && player.relics) {
          console.log("[RELIC] All relics:", player.relics);
          return player.relics;
        }
        return "Relics not found";
      },
      showApplied: function() {
        const player = window.GameStateManager?.state?.player;
        if (player && player.appliedRelicBonuses) {
          console.log("[RELIC] Applied bonuses:", player.appliedRelicBonuses);
          return player.appliedRelicBonuses;
        }
        return "Applied bonuses not found";
      },
      showHistory: function() {
        window.RELIC_DEBUG.showHistory();
        return "History shown in console";
      },
      refreshTab: function() {
        const player = window.GameStateManager?.state?.player;
        if (player) {
          forceShowRelicsInTab(player);
          return "Refreshed relics tab";
        }
        return "Player not found";
      }
    };
    
    console.log("[RELIC] Debug tools and relic system fixes installed. Type 'relicDebug' in console for debug commands.");
  }, 1000);
});
