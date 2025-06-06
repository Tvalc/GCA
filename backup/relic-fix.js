// EMERGENCY RELIC FIX v3.0 - Last resort direct DOM manipulation and event capture
// Date: 2025-05-23 19:24

console.log('%c[CRITICAL FIX] Initializing emergency relic system override', 'color:red; font-weight:bold; font-size:16px; background:black');

// IMMEDIATELY EXECUTING FUNCTION - runs as soon as this script loads
(function() {
  // Create global emergency tooltip that works regardless of game state
  const tooltip = document.createElement('div');
  tooltip.id = 'emergency-tooltip';
  tooltip.style.position = 'fixed';
  tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
  tooltip.style.color = '#00ffff';
  tooltip.style.border = '2px solid #ff0000';
  tooltip.style.padding = '10px';
  tooltip.style.borderRadius = '5px';
  tooltip.style.zIndex = '999999';
  tooltip.style.pointerEvents = 'none';
  tooltip.style.display = 'none';
  tooltip.style.maxWidth = '250px';
  tooltip.style.fontWeight = 'bold';
  tooltip.style.fontSize = '14px';
  tooltip.style.boxShadow = '0 0 10px red';
  
  // Add tooltip to document immediately
  document.addEventListener('DOMContentLoaded', function() {
    document.body.appendChild(tooltip);
    console.log('[CRITICAL] Emergency tooltip added to document');
  });
  
  // Global emergency functions
  window.EMERGENCY = {
    // Show tooltip at given coordinates
    showTooltip: function(content, x, y) {
      tooltip.innerHTML = content;
      tooltip.style.display = 'block';
      tooltip.style.left = x + 'px';
      tooltip.style.top = y + 'px';
    },
    
    // Hide tooltip
    hideTooltip: function() {
      tooltip.style.display = 'none';
    },
    
    // FORCE unequip an item from a slot - bypasses normal game logic
    forceUnequip: function(slot) {
      console.log('%c[CRITICAL] Force unequipping: ' + slot, 'color:red; font-weight:bold');
      
      try {
        if (!window.GameStateManager || !window.GameStateManager.state || !window.GameStateManager.state.player) {
          console.error('[CRITICAL] Cannot unequip - game state unavailable');
          return false;
        }
        
        const player = window.GameStateManager.state.player;
        
        // Get the item before removal to handle special logic
        let item = null;
        
        // Check all possible case variations of the slot
        const slotVariations = [
          slot,
          slot.toUpperCase(),
          slot.toLowerCase(),
          slot.charAt(0).toUpperCase() + slot.slice(1)
        ];
        
        // Find the item in any slot variation
        for (const slotVar of slotVariations) {
          if (player.equipment && player.equipment[slotVar]) {
            item = player.equipment[slotVar];
            break;
          }
        }
        
        // Handle relic-specific logic
        const isRelic = slot.toLowerCase().includes('relic');
        if (isRelic) {
          const relicNum = slot.toLowerCase().includes('1') ? 1 : 2;
          const relicKey = relicNum === 1 ? 'glitchStick' : 'codeFragment';
          
          console.log(`[CRITICAL] Unequipping relic ${relicKey} from slot ${slot}`);
          
          // Remove relic bonuses
          if (player.appliedRelicBonuses && player.appliedRelicBonuses[relicKey]) {
            console.log('[CRITICAL] Removing stat bonuses for: ' + relicKey);
            player.appliedRelicBonuses[relicKey] = false;
            
            // Glitch Stick: +level to all stats
            if (relicKey === 'glitchStick' && player.relics && player.relics.glitchStick) {
              const level = player.relics.glitchStick.level;
              ['strength', 'dexterity', 'intelligence', 'vitality', 'fortune', 'charisma'].forEach(stat => {
                if (player.stats && typeof player.stats[stat] === 'number') {
                  player.stats[stat] -= level;
                  console.log(`[CRITICAL] Removed +${level} from ${stat}`);
                }
              });
            }
            // Code Fragment: +level*2 to intelligence, +level to magicDamage
            else if (relicKey === 'codeFragment' && player.relics && player.relics.codeFragment) {
              const level = player.relics.codeFragment.level;
              if (player.stats) {
                if (typeof player.stats.intelligence === 'number') {
                  player.stats.intelligence -= (level * 2);
                  console.log(`[CRITICAL] Removed +${level*2} from intelligence`);
                }
                if (typeof player.stats.magicDamage === 'number') {
                  player.stats.magicDamage -= level;
                  console.log(`[CRITICAL] Removed +${level} from magicDamage`);
                }
              }
            }
          }
        }
        
        // Remove the item from ALL possible slot variations to be thorough
        slotVariations.forEach(slotVar => {
          if (player.equipment && player.equipment[slotVar]) {
            console.log('[CRITICAL] Deleting item from: ' + slotVar);
            delete player.equipment[slotVar];
          }
        });
        
        // Force UI updates
        try {
          if (typeof updateEquipmentList === 'function') {
            console.log('[CRITICAL] Forcing equipment list update');
            updateEquipmentList(player);
          }
          
          if (typeof recalculateDerivedStats === 'function') {
            recalculateDerivedStats(player);
          }
          
          if (typeof updateCharacterScreen === 'function') {
            updateCharacterScreen();
          }
          
          // Log message to player
          if (window.UIManager && typeof window.UIManager.log === 'function') {
            window.UIManager.log(`Unequipped ${item ? item.name : 'item'} from ${slot}`);
          }
          
          return true;
        } catch (e) {
          console.error('[CRITICAL] Error updating UI after unequip:', e);
          return false;
        }
      } catch (e) {
        console.error('[CRITICAL] Fatal error in forceUnequip:', e);
        return false;
      }
    },
    
    // Force-inject relics into equipment slots
    forceRelicsIntoEquipment: function() {
      console.log('[CRITICAL] Force-injecting relics into equipment...');
      
      try {
        if (!window.GameStateManager || !window.GameStateManager.state || !window.GameStateManager.state.player) {
          return false;
        }
        
        const player = window.GameStateManager.state.player;
        
        // Ensure equipment object exists
        if (!player.equipment) player.equipment = {};
        
        // Force-inject Glitch Stick if player has it
        if (player.relics && player.relics.glitchStick && player.relics.glitchStick.level > 0) {
          console.log('[CRITICAL] Injecting Glitch Stick into equipment slots');
          
          const glitchStick = {
            name: 'Glitch Stick',
            display_name: 'Glitch Stick',
            description: 'A mysterious artifact that seems to flicker between realities.',
            slot: 'RELIC_1',
            equipped: true,
            isRelic: true,
            stats: {
              strength: player.relics.glitchStick.level,
              dexterity: player.relics.glitchStick.level,
              intelligence: player.relics.glitchStick.level,
              vitality: player.relics.glitchStick.level,
              charisma: player.relics.glitchStick.level,
              fortune: player.relics.glitchStick.level
            }
          };
          
          // Insert into all possible slot variations
          player.equipment['relic_1'] = glitchStick;
          player.equipment['RELIC_1'] = glitchStick;
          player.equipment['Relic_1'] = glitchStick;
        }
        
        // Force-inject Code Fragment if player has it
        if (player.relics && player.relics.codeFragment && player.relics.codeFragment.level > 0) {
          console.log('[CRITICAL] Injecting Code Fragment into equipment slots');
          
          const codeFragment = {
            name: 'Code Fragment',
            display_name: 'Code Fragment',
            description: 'A fragment of code from a powerful ancient program.',
            slot: 'relic_2',
            equipped: true,
            isRelic: true,  // Mark as relic
            stats: {
              intelligence: player.relics.codeFragment.level * 2,
              magicDamage: player.relics.codeFragment.level
            }
          };
          
          // Insert into all possible slot variations
          player.equipment['relic_2'] = codeFragment;
          player.equipment['RELIC_2'] = codeFragment;
          player.equipment['Relic_2'] = codeFragment;
        }
        
        // Update UI if equipment tab is visible
        if (document.getElementById('equipment-tab') && 
            getComputedStyle(document.getElementById('equipment-tab')).display !== 'none') {
          if (typeof updateEquipmentList === 'function') {
            console.log('[CRITICAL] Updating equipment list after injection');
            updateEquipmentList(player);
          }
        }
        
        return true;
      } catch (e) {
        console.error('[CRITICAL] Error injecting relics:', e);
        return false;
      }
    }
  };
  
  // HIJACK: Override the globalUnequipItem function
  window.globalUnequipItem = function(slot) {
    console.log('[CRITICAL] Intercepted unequip call for slot: ' + slot);
    return window.EMERGENCY.forceUnequip(slot);
  };
  
  // DIRECT DOM EVENT LISTENERS that bypass the game's event system
  
  // Set up event listener for all mouseover events - captures everything
  document.addEventListener('mouseover', function(e) {
    // Handle tooltips for relic tab elements
    if (e.target.closest('#relics-tab')) {
      // Look for ability items or grid items
      const abilityItem = e.target.closest('.ability-item') || 
                         e.target.closest('.relic-grid > div') || 
                         e.target.closest('[data-ability-id]');
      
      if (abilityItem) {
        // Get name from any available source
        const nameEl = abilityItem.querySelector('.ability-name') || 
                      abilityItem.querySelector('.relic-name');
        const name = nameEl ? nameEl.textContent : 'Ability';
        
        // Get description from various possible sources
        let desc = abilityItem.getAttribute('data-description') || 
                  abilityItem.getAttribute('title') || 
                  (nameEl ? nameEl.getAttribute('data-description') : null) || 
                  'Enhances your abilities';
        
        // Position tooltip near the ability item
        const rect = abilityItem.getBoundingClientRect();
        window.EMERGENCY.showTooltip(
          `<div style="color: #ffff00; margin-bottom: 5px;">${name}</div><div>${desc}</div>`,
          rect.left + window.scrollX,
          rect.bottom + window.scrollY + 5
        );
      }
    }
    
    // Handle tooltips for equipment items
    if (e.target.closest('.equipment-item')) {
      const equipItem = e.target.closest('.equipment-item');
      const hasItem = equipItem.classList.contains('has-item');
      const slot = equipItem.getAttribute('data-slot');
      
      if (hasItem && slot) {
        // Try to get the actual item name from the player's equipment
        let itemName = slot;
        try {
          if (window.GameStateManager && window.GameStateManager.state && 
              window.GameStateManager.state.player && window.GameStateManager.state.player.equipment) {
            const player = window.GameStateManager.state.player;
            const item = player.equipment[slot] || player.equipment[slot.toUpperCase()] || 
                        player.equipment[slot.toLowerCase()];
            if (item && item.name) {
              itemName = item.name;
            }
          }
        } catch (err) {
          console.log('[CRITICAL] Error getting item name:', err);
        }
        
        // Position tooltip near the equipment item
        const rect = equipItem.getBoundingClientRect();
        window.EMERGENCY.showTooltip(
          `<div style="color: #ffff00; margin-bottom: 5px;">${itemName}</div><div>Click to unequip</div>`,
          rect.left + window.scrollX,
          rect.bottom + window.scrollY + 5
        );
      }
    }
  });
  
  // Hide tooltip when mouse moves out
  document.addEventListener('mouseout', function(e) {
    if (e.target.closest('#relics-tab') || e.target.closest('.equipment-item')) {
      window.EMERGENCY.hideTooltip();
    }
  });
  
  // Direct click handler for equipment items
  document.addEventListener('click', function(e) {
    const equipItem = e.target.closest('.equipment-item');
    if (equipItem && equipItem.classList.contains('has-item')) {
      const slot = equipItem.getAttribute('data-slot');
      if (slot) {
        console.log('[CRITICAL] Direct click handler activated for: ' + slot);
        window.EMERGENCY.forceUnequip(slot);
        e.preventDefault();
        e.stopPropagation();
      }
    }
  });
  
  // INITIALIZATION AND PERIODIC CHECKS
  
  // Main emergency check function
  function runEmergencyChecks() {
    console.log('[CRITICAL] Running emergency system checks...');
    
    // Force relics into equipment slots
    window.EMERGENCY.forceRelicsIntoEquipment();
    
    // Add direct click handlers to all equipment items
    document.querySelectorAll('.equipment-item').forEach(item => {
      // Skip if already processed
      if (item.dataset.emergencyFixed === 'true') return;
      
      const slot = item.getAttribute('data-slot');
      if (slot) {
        item.addEventListener('click', function(e) {
          console.log('[CRITICAL] Equipment item clicked via direct handler: ' + slot);
          window.EMERGENCY.forceUnequip(slot);
          e.preventDefault();
          e.stopPropagation();
        });
        
        // Mark as processed
        item.dataset.emergencyFixed = 'true';
      }
    });
  }
  
  // Run immediately
  setTimeout(runEmergencyChecks, 500);
  
  // Also run periodically to ensure fixes are applied after tab switches
  setInterval(runEmergencyChecks, 1000);
  
  console.log('%c[CRITICAL] Emergency relic fixes applied - direct DOM manipulation active', 'color: lime; font-weight: bold; font-size: 14px;');
})();

// End of emergency fixes
  
  // Create relics object if it doesn't exist
  if (!player.relics) {
    player.relics = {};
  }
  
  // Check for Glitch Stick
  if (player.relics.glitchStick && player.relics.glitchStick.acquired) {
    // Create equipment object for Glitch Stick
    const glitchStick = {
      name: 'Glitch Stick',
      display_name: 'Glitch Stick',
      description: 'A mysterious artifact that seems to flicker between realities.',
      slot: 'RELIC_1',
      equipped: true,
      isRelic: true,
      stats: {
        strength: player.relics.glitchStick.level,
        dexterity: player.relics.glitchStick.level,
        intelligence: player.relics.glitchStick.level,
        vitality: player.relics.glitchStick.level,
        charisma: player.relics.glitchStick.level,
        fortune: player.relics.glitchStick.level
      }
    };
    
    // Add to equipment object with all case variations
    player.equipment['relic_1'] = glitchStick;
    player.equipment['RELIC_1'] = glitchStick;
    player.equipment['Relic_1'] = glitchStick;
    
    console.log('[RELIC-FIX] Added Glitch Stick to equipment slots');
  }
  
  // Check for Code Fragment
  if (player.relics.codeFragment && player.relics.codeFragment.acquired) {
    // Create equipment object for Code Fragment
    const codeFragment = {
      name: 'Code Fragment',
      display_name: 'Code Fragment',
      description: 'A fragment of code from a powerful ancient program.',
      slot: 'RELIC_2',
      equipped: true,
      isRelic: true,
      stats: {
        intelligence: player.relics.codeFragment.level * 2,
        magicDamage: player.relics.codeFragment.level
      }
    };
    
    // Add to equipment object with all case variations
    player.equipment['relic_2'] = codeFragment;
    player.equipment['RELIC_2'] = codeFragment;
    player.equipment['Relic_2'] = codeFragment;
    
    console.log('[RELIC-FIX] Added Code Fragment to equipment slots');
  }
  
  // Force update the equipment list UI if it's visible
  if (document.getElementById('equipment-tab') && 
      document.getElementById('equipment-tab').style.display === 'block') {
    if (typeof updateEquipmentList === 'function') {
      console.log('[RELIC-FIX] Updating equipment list UI');
      updateEquipmentList(player);
    }
  }
}

// Setup tooltips for relics tab
function setupRelicTooltips() {
  console.log('[RELIC-FIX] Setting up relic tooltips...');
  
  // Find all ability items in the relics tab
  const relicAbilities = document.querySelectorAll('#relics-tab .ability-item, #relics-tab .relic-grid > div');
  
  if (relicAbilities.length === 0) {
    console.log('[RELIC-FIX] No relic abilities found yet');
    return;
  }
  
  console.log(`[RELIC-FIX] Found ${relicAbilities.length} relic abilities`);
  
  // Create a tooltip element if it doesn't exist
  let tooltip = document.getElementById('relic-fix-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'relic-fix-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
    tooltip.style.color = '#00ffff';
    tooltip.style.border = '1px solid #00ffff';
    tooltip.style.padding = '8px';
    tooltip.style.borderRadius = '4px';
    tooltip.style.zIndex = '9999';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.display = 'none';
    tooltip.style.maxWidth = '250px';
    document.body.appendChild(tooltip);
  }
  
  // Add hover events to each ability
  relicAbilities.forEach(ability => {
    // Skip if already has tooltip handling
    if (ability.dataset.tooltipFixed === 'true') return;
    
    // Find name and description
    const nameElement = ability.querySelector('.ability-name') || ability.querySelector('.relic-name');
    const name = nameElement ? nameElement.textContent : 'Unknown Ability';
    
    // Get description from data attributes or fallback
    let description = ability.getAttribute('data-description') || ability.getAttribute('title') || 'No description available';
    
    // Add mouseenter event
    ability.addEventListener('mouseenter', function(e) {
      tooltip.innerHTML = `<div style="font-weight: bold;">${name}</div><div>${description}</div>`;
      tooltip.style.display = 'block';
      
      // Position tooltip near the mouse
      const rect = this.getBoundingClientRect();
      tooltip.style.left = `${rect.left}px`;
      tooltip.style.top = `${rect.bottom + 5}px`;
    });
    
    // Add mouseleave event
    ability.addEventListener('mouseleave', function() {
      tooltip.style.display = 'none';
    });
    
    // Mark as fixed
    ability.dataset.tooltipFixed = 'true';
    
    // For level divs, add the same tooltip to them
    const levelDiv = ability.querySelector('.ability-level');
    if (levelDiv) {
      levelDiv.addEventListener('mouseenter', function(e) {
        e.stopPropagation(); // Prevent bubbling to parent
        tooltip.innerHTML = `<div style="font-weight: bold;">${name}</div><div>${description}</div>`;
        tooltip.style.display = 'block';
        
        // Position tooltip near the mouse
        const rect = this.getBoundingClientRect();
        tooltip.style.left = `${rect.left}px`;
        tooltip.style.top = `${rect.bottom + 5}px`;
      });
      
      levelDiv.addEventListener('mouseleave', function() {
        tooltip.style.display = 'none';
      });
    }
  });
}

// Fix equipment unequip functionality
function fixEquipmentUnequip() {
  console.log('[RELIC-FIX] Fixing equipment unequip functionality...');
  
  // Create a global unequip function that correctly handles relics
  window.globalUnequipItem = function(slot) {
    console.log(`[RELIC-FIX] Attempting to unequip item from slot: ${slot}`);
    
    if (!window.GameStateManager || !window.GameStateManager.state || !window.GameStateManager.state.player) {
      console.error('[RELIC-FIX] Game state not available');
      return;
    }
    
    const player = window.GameStateManager.state.player;
    
    // Handle relic slots specially
    if (slot.toLowerCase().startsWith('relic_')) {
      console.log(`[RELIC-FIX] Unequipping relic from slot: ${slot}`);
      
      // Determine which relic this is
      const relicKey = slot.toLowerCase() === 'relic_1' ? 'glitchStick' : 
                      (slot.toLowerCase() === 'relic_2' ? 'codeFragment' : null);
      
      if (relicKey && window.RELIC_SYSTEM) {
        // Use relic system to unequip
        console.log(`[RELIC-FIX] Unequipping relic: ${relicKey}`);
        window.RELIC_SYSTEM.removeRelicBonuses(player, relicKey);
        
        // Remove from equipment slots
        delete player.equipment[slot];
        delete player.equipment[slot.toUpperCase()];
        delete player.equipment[slot.toLowerCase()];
        
        // Update UI
        if (typeof updateEquipmentList === 'function') {
          updateEquipmentList(player);
        }
        
        if (typeof UIManager !== 'undefined' && UIManager && UIManager.log) {
          UIManager.log(`Unequipped relic from ${slot}`);
        }
        
        // Update character screen
        if (typeof updateCharacterScreen === 'function') {
          updateCharacterScreen();
        }
        
        return;
      }
    }
    
    // Use regular equipment manager for non-relic slots
    if (window.EquipmentManager && typeof window.EquipmentManager.unequip === 'function') {
      console.log(`[RELIC-FIX] Using standard unequip for slot: ${slot}`);
      const result = window.EquipmentManager.unequip(player, slot);
      
      // Update UI
      if (typeof updateEquipmentList === 'function') {
        updateEquipmentList(player);
      }
      
      // Log the action
      if (typeof UIManager !== 'undefined' && UIManager && UIManager.log) {
        UIManager.log(`Unequipped item from ${slot}`);
      }
      
      return result;
    }
  };
  
  // Add onclick handlers to all equipment items
  const equipmentItems = document.querySelectorAll('.equipment-item');
  equipmentItems.forEach(item => {
    // Skip if already has click handler
    if (item.dataset.clickFixed === 'true') return;
    
    const slot = item.getAttribute('data-slot');
    if (slot) {
      item.addEventListener('click', function() {
        window.globalUnequipItem(slot);
      });
      
      // Mark as fixed
      item.dataset.clickFixed = 'true';
    }
  });
}
