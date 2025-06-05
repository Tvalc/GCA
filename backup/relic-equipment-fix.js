// Relic Equipment System Fix
// Version: 2025-05-17 Updated 14:46

// Global flags to fix relics functionality
let originalRelicsInTab = false;

// Wait for page to load fully
window.addEventListener('load', function() {
  console.log("[RELIC-FIX] Initializing relic equipment fix...");
  
  // Give DOM time to initialize
  setTimeout(initRelicSystemFix, 1000);
});

function initRelicSystemFix() {
  console.log("[RELIC-FIX] Starting relic system fix implementation");
  
  // Patch the updateRelicsTab function to keep showing relics even when equipped
  patchUpdateRelicsTab();
  
  // 1. Fix the applyRelicBonuses function to ensure relics go into proper slots
  if (window.RELIC_SYSTEM) {
    const originalApplyFn = window.RELIC_SYSTEM.applyRelicBonuses;
    
    // Override with fixed version
    window.RELIC_SYSTEM.applyRelicBonuses = function(player, relicName) {
      console.log(`[RELIC-FIX] Applying relic: ${relicName} with fixed function`);
      
      const relic = player.relics[relicName];
      if (!relic) {
        console.error(`[RELIC-FIX] Relic ${relicName} not found in player's collection`);
        return;
      }
      
      // Ensure equipment object exists
      if (!player.equipment) {
        console.log("[RELIC-FIX] Creating equipment object for player");
        player.equipment = {};
      }
      
      // Ensure relic slots are initialized properly
      if (player.equipment.relic_1 === undefined) {
        player.equipment.relic_1 = null;
      }
      
      if (player.equipment.relic_2 === undefined) {
        player.equipment.relic_2 = null;
      }

      // Ensure applied bonuses tracking exists
      if (!player.appliedRelicBonuses) {
        player.appliedRelicBonuses = {};
      }
      
      // Check if already applied
      if (player.appliedRelicBonuses[relicName]) {
        console.log(`[RELIC-FIX] Relic ${relicName} is already applied, skipping`);
        return;
      }
      
      // Count equipped relics
      let equippedCount = 0;
      for (const key in player.appliedRelicBonuses) {
        if (player.appliedRelicBonuses[key] === true) {
          equippedCount++;
        }
      }
      
      if (equippedCount >= 2) {
        console.log("[RELIC-FIX] Cannot equip more than 2 relics");
        // Notify the user if UIManager exists
        if (typeof UIManager !== 'undefined' && UIManager.log) {
          UIManager.log('You cannot equip more than 2 relics at once. Unequip one first.');
        }
        return;
      }
      
      // Remember if player was at max HP/MP
      const wasAtMaxHP = player.derivedStats && player.hp >= player.derivedStats.maxHp - 1;
      const wasAtMaxMP = player.derivedStats && player.mp >= player.derivedStats.maxMp - 1;
      
      // Apply stat bonuses
      player.stats.strength += relic.level;
      player.stats.dexterity += relic.level;
      player.stats.intelligence += relic.level;
      player.stats.vitality += relic.level;
      player.stats.fortune += relic.level;
      player.stats.charisma += relic.level;
      
      // Add to first available equipment slot - CRITICAL FIX
      if (player.equipment.relic_1 === null) {
        console.log(`[RELIC-FIX] Adding ${relicName} to relic_1 slot`);
        player.equipment.relic_1 = {
          name: relic.name,
          type: 'relic',
          relicId: relicName,
          level: relic.level
        };
      } else if (player.equipment.relic_2 === null) {
        console.log(`[RELIC-FIX] Adding ${relicName} to relic_2 slot`);
        player.equipment.relic_2 = {
          name: relic.name,
          type: 'relic',
          relicId: relicName,
          level: relic.level
        };
      } else {
        console.error("[RELIC-FIX] No available relic slots");
        return;
      }
      
      // Mark as applied
      player.appliedRelicBonuses[relicName] = true;
      
      // Recalculate derived stats
      if (typeof LEVELING_SYSTEM !== 'undefined' && typeof LEVELING_SYSTEM.updateCharacterStats === 'function') {
        LEVELING_SYSTEM.updateCharacterStats(player);
        
        // Restore max HP/MP if needed
        if (wasAtMaxHP && player.derivedStats) {
          player.hp = player.derivedStats.maxHp;
        }
        
        if (wasAtMaxMP && player.derivedStats) {
          player.mp = player.derivedStats.maxMp;
        }
      }
      
      // CRITICAL FIX: Ensure relics tab stays visible and populated
      const relicsTab = document.getElementById('relics-tab');
      if (relicsTab) {
        // Refresh the relics display without changing tab
        refreshRelicsDisplay(player);
      }
      
      // Log success
      console.log(`[RELIC-FIX] Successfully applied ${relicName}`);
      
      // Return success
      return true;
    };
    console.log("[RELIC-FIX] Successfully patched applyRelicBonuses");
    
    // 2. Fix the removeRelicBonuses function to properly remove relics from equipment
    const originalRemoveFn = window.RELIC_SYSTEM.removeRelicBonuses;
    
    window.RELIC_SYSTEM.removeRelicBonuses = function(player, relicName) {
      console.log(`[RELIC-FIX] Removing relic: ${relicName} with fixed function`);
      
      const relic = player.relics[relicName];
      if (!relic) {
        console.error(`[RELIC-FIX] Relic ${relicName} not found`);
        return;
      }
      
      // CRITICAL: Make sure the relic is actually applied - this fixes the persisting stat bonuses
      if (!player.appliedRelicBonuses || player.appliedRelicBonuses[relicName] !== true) {
        console.log(`[RELIC-FIX] Relic ${relicName} not currently applied, nothing to remove`);
        return;
      }
      
      // Store the stat bonuses that need to be removed
      const bonusLevel = relic.level;
      
      // Remove from equipment slots
      if (player.equipment) {
        let removed = false;
        
        if (player.equipment.relic_1 && player.equipment.relic_1.relicId === relicName) {
          console.log(`[RELIC-FIX] Removing ${relicName} from relic_1 slot`);
          player.equipment.relic_1 = null;
          removed = true;
        } else if (player.equipment.relic_2 && player.equipment.relic_2.relicId === relicName) {
          console.log(`[RELIC-FIX] Removing ${relicName} from relic_2 slot`);
          player.equipment.relic_2 = null;
          removed = true;
        }
        
        if (!removed) {
          console.warn(`[RELIC-FIX] Relic ${relicName} not found in equipment slots, but was marked as applied - this may cause stat issues`);
        }
      }
      
      // CRITICAL FIX: Explicitly remove the exact stat bonuses
      console.log(`[RELIC-FIX] Removing ${bonusLevel} points from each stat`);
      player.stats.strength -= bonusLevel;
      player.stats.dexterity -= bonusLevel;
      player.stats.intelligence -= bonusLevel;
      player.stats.vitality -= bonusLevel;
      player.stats.fortune -= bonusLevel;
      player.stats.charisma -= bonusLevel;
      
      // Mark as not applied
      player.appliedRelicBonuses[relicName] = false;
      
      // Recalculate derived stats
      if (typeof LEVELING_SYSTEM !== 'undefined' && typeof LEVELING_SYSTEM.updateCharacterStats === 'function') {
        LEVELING_SYSTEM.updateCharacterStats(player);
        
        // Cap HP/MP at new maximum if needed
        if (player.derivedStats) {
          if (player.hp > player.derivedStats.maxHp) {
            console.log(`[RELIC-FIX] Capping HP at new maximum: ${player.derivedStats.maxHp}`);
            player.hp = player.derivedStats.maxHp;
          }
          
          if (player.mp > player.derivedStats.maxMp) {
            console.log(`[RELIC-FIX] Capping MP at new maximum: ${player.derivedStats.maxMp}`);
            player.mp = player.derivedStats.maxMp;
          }
        }
      }
      
      // CRITICAL FIX: Ensure relics tab stays visible and populated
      refreshRelicsDisplay(player);
      
      // Log success
      console.log(`[RELIC-FIX] Successfully removed ${relicName}`);
      
      return true;
    };
    console.log("[RELIC-FIX] Successfully patched removeRelicBonuses");
  } else {
    console.error("[RELIC-FIX] RELIC_SYSTEM not found, cannot patch methods");
  }
  
  // 3. Fix the tab visibility issue
  fixTabVisibility();
}

// Function to patch the relics tab update to ensure relics are always visible
function patchUpdateRelicsTab() {
  console.log("[RELIC-FIX] Setting up relics tab patch");
  
  // Check if the updateRelicsTab function exists globally
  if (typeof window.updateRelicsTab === 'function') {
    // Save reference to original function
    const originalUpdateRelicsTab = window.updateRelicsTab;
    
    // Override with our patched version
    window.updateRelicsTab = function(player) {
      console.log("[RELIC-FIX] Running patched updateRelicsTab");
      
      // Call original function first
      originalUpdateRelicsTab(player);
      
      // After the original function runs, make sure equipped relics still show in the tab
      showEquippedRelicsInTab(player);
    };
    
    console.log("[RELIC-FIX] Successfully patched updateRelicsTab");
  } else {
    console.warn("[RELIC-FIX] updateRelicsTab function not found, will use manual refresh only");
  }
}

// Function to refresh the relics display without switching tabs
function refreshRelicsDisplay(player) {
  console.log("[RELIC-FIX] Refreshing relics display");
  
  // First, check if the relics tab exists
  const relicsTab = document.getElementById('relics-tab');
  if (!relicsTab) {
    console.error("[RELIC-FIX] Relics tab element not found");
    return;
  }
  
  // Remember if the relics tab was active
  const wasActive = relicsTab.classList.contains('active');
  
  // Try to use existing function if available
  if (typeof window.updateRelicsTab === 'function') {
    window.updateRelicsTab(player);
  }
  
  // Ensure equipped relics still appear in the relics tab
  showEquippedRelicsInTab(player);
  
  // Restore active state if it was active
  if (wasActive) {
    relicsTab.classList.add('active');
  }
}

// Function to ensure equipped relics still appear in the relics tab
function showEquippedRelicsInTab(player) {
  console.log("[RELIC-FIX] Ensuring equipped relics are still visible in relics tab");
  
  // First, check if player has relics
  if (!player || !player.relics) {
    console.warn("[RELIC-FIX] Player or relics not found");
    return;
  }
  
  // Get the relics container
  const relicsTab = document.getElementById('relics-tab');
  if (!relicsTab) {
    console.error("[RELIC-FIX] Relics tab element not found");
    return;
  }
  
  // Get the container where relics are listed
  const relicsList = relicsTab.querySelector('.equipment-list');
  if (!relicsList) {
    console.error("[RELIC-FIX] Relics list container not found");
    return;
  }
  
  // Check each equipped relic
  for (const relicKey in player.relics) {
    const relic = player.relics[relicKey];
    const isEquipped = player.appliedRelicBonuses && player.appliedRelicBonuses[relicKey] === true;
    
    // Find the existing relic element if it exists
    let relicElement = relicsList.querySelector(`[data-relic-id="${relicKey}"]`);
    
    // If it's equipped but not shown, create it
    if (isEquipped && !relicElement) {
      // Create a new relic element showing the equipped status
      relicElement = document.createElement('div');
      relicElement.className = 'relic-item equipped';
      relicElement.setAttribute('data-relic-id', relicKey);
      
      relicElement.innerHTML = `
        <div class="relic-header">
          <span class="relic-name">${relic.name}</span>
          <span class="relic-status">EQUIPPED</span>
        </div>
        <div class="relic-description">${relic.description || 'A mysterious artifact with special powers.'}</div>
        <div class="relic-level">Level: ${relic.level}</div>
      `;
      
      // Add click handler to unequip
      relicElement.addEventListener('click', function() {
        if (window.RELIC_SYSTEM) {
          window.RELIC_SYSTEM.removeRelicBonuses(player, relicKey);
        }
      });
      
      // Add to relics list
      relicsList.appendChild(relicElement);
    }
    // If it exists but doesn't reflect equipped status, update it
    else if (relicElement) {
      if (isEquipped) {
        relicElement.classList.add('equipped');
        const statusElement = relicElement.querySelector('.relic-status');
        if (statusElement) {
          statusElement.textContent = 'EQUIPPED';
        }
      } else {
        relicElement.classList.remove('equipped');
        const statusElement = relicElement.querySelector('.relic-status');
        if (statusElement) {
          statusElement.textContent = 'CLICK TO EQUIP';
        }
      }
    }
  }
  
  console.log("[RELIC-FIX] Relic display updated");
}

// Fix tab visibility function
function fixTabVisibility() {
    // Patch the tab switching functionality to ensure relics tab doesn't disappear
    const tabButtons = document.querySelectorAll('.tab-button');
    if (tabButtons && tabButtons.length > 0) {
      console.log("[RELIC-FIX] Adding enhanced tab click handlers");
      
      tabButtons.forEach(button => {
        // Remove any existing event listeners (to prevent duplicates)
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add our enhanced click handler
        newButton.addEventListener('click', function(e) {
          e.stopPropagation();
          
          const tabId = this.getAttribute('data-tab');
          if (!tabId) {
            console.error("[RELIC-FIX] Tab button missing data-tab attribute");
            return;
          }
          
          console.log(`[RELIC-FIX] Switching to tab: ${tabId}`);
          
          // Hide all tab content
          const tabContents = document.querySelectorAll('.tab-content');
          tabContents.forEach(content => {
            if (content) content.classList.remove('active');
          });
          
          // Show selected tab content
          const selectedContent = document.getElementById(tabId);
          if (selectedContent) {
            selectedContent.classList.add('active');
          } else {
            console.error(`[RELIC-FIX] Tab content not found: ${tabId}`);
          }
          
          // Update button active states
          tabButtons.forEach(btn => {
            if (btn) btn.classList.remove('active');
          });
          
          // Set current button as active
          this.classList.add('active');
        });
      });
    } else {
      console.warn("[RELIC-FIX] No tab buttons found, will retry later");
      setTimeout(fixTabVisibility, 1000);
    }
  };
  
  // Attempt to fix tab visibility when tabs are available
  fixTabVisibility();
  
  console.log("[RELIC-FIX] Relic system fixes applied successfully");
}
