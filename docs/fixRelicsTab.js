// Updated relics tab functions to fix all remaining issues

// This function will be used to replace the existing updateRelicsTab function
window.updateRelicsTab = function(player) {
  console.log('Updating relics tab...');
  // Use the permanent relics container instead of relics-list
  const relicsContainer = document.getElementById('relics-container');
  if (!relicsContainer) {
    console.warn('Relics container element not found');
    return;
  }
  
  // Get the tooltip element for displaying ability details
  const relicTooltip = document.getElementById('relicTooltip');
  
  // Clear existing content
  relicsContainer.innerHTML = '';
  
  // Check if player has relics
  if (!player.relics || Object.keys(player.relics).length === 0) {
    relicsContainer.innerHTML = '<div class="empty-message">No relics found</div>';
    return;
  }
  
  // Add each relic to the list
  for (const [relicKey, relic] of Object.entries(player.relics)) {
    // Skip relics with level 0 (not yet acquired)
    if (relic.level === 0) continue;
    
    const relicItem = document.createElement('div');
    relicItem.className = 'relic-item';
    
    let abilitiesHTML = '';
    if (relic.abilities && relic.abilities.length > 0) {
      abilitiesHTML = `
        <div class="relic-abilities">
          ${relic.abilities.map(ability => `
            <div class="ability-item" data-ability-name="${ability.name}" data-ability-level="${ability.level}" data-ability-unlocked="${ability.level <= relic.level}" data-ability-description="${ability.description}">
              <div class="ability-level ${ability.level <= relic.level ? 'unlocked' : 'locked'}">${ability.level}</div>
              <div class="ability-info">
                <div class="ability-name ${ability.level <= relic.level ? '' : 'locked'}">${ability.name}</div>
                <div class="ability-description">${ability.description}</div>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
    
    let furyBarHTML = '';
    if (relic.level < (relic.maxLevel || 5)) {
      const furyPercent = Math.min(100, Math.floor((relic.fury / relic.furyToNextLevel) * 100));
      furyBarHTML = `
        <div class="fury-bar">
          <div class="fury-fill" style="width: ${furyPercent}%"></div>
        </div>
        <div class="fury-text">${relic.fury}/${relic.furyToNextLevel} Fury</div>
      `;
    }
    
    relicItem.innerHTML = `
      <div class="relic-header">
        <span class="relic-name">${relic.name}</span>
        <span class="relic-level">Lvl ${relic.level}</span>
      </div>
      <div class="relic-description">${relic.description || ''}</div>
      ${furyBarHTML}
      <div class="relic-stats">+${relic.level} to all stats when equipped</div>
      ${abilitiesHTML}
    `;
    
    // Add click event to use the relic ability
    relicItem.addEventListener('click', () => {
      if (window.RELIC_SYSTEM) {
        window.RELIC_SYSTEM.useRelicAbility(player, relicKey);
        updateRelicsTab(player); // Refresh the display
      } else {
        console.error('RELIC_SYSTEM not found!');
      }
    });
    
    relicsContainer.appendChild(relicItem);
  }
  
  // Instead of creating a popup tooltip, we'll update the fixed tooltip in the UI
  // Add event listeners to the ability level elements (not the whole item) for showing details
  const abilityLevels = relicsContainer.querySelectorAll('.ability-level');
  
  abilityLevels.forEach(levelElement => {
    levelElement.addEventListener('click', function(e) {
      // Prevent event propagation to parent elements
      e.stopPropagation();
      
      // Get the parent ability item
      const abilityItem = this.closest('.ability-item');
      if (!abilityItem) return;
      
      // Get ability details from data attributes
      const name = abilityItem.getAttribute('data-ability-name');
      const level = abilityItem.getAttribute('data-ability-level');
      const description = abilityItem.getAttribute('data-ability-description');
      const isUnlocked = abilityItem.getAttribute('data-ability-unlocked') === 'true';
      
      // Update the tooltip with ability details
      if (relicTooltip) {
        const titleElement = relicTooltip.querySelector('.title');
        const descriptionElement = relicTooltip.querySelector('.description');
        
        if (titleElement && descriptionElement) {
          titleElement.innerHTML = isUnlocked 
            ? `<span style="color: #00ff00">${name} (Level ${level})</span>` 
            : `<span style="color: #ff8800">${name} (Level ${level} - Locked)</span>`;
          
          descriptionElement.innerHTML = isUnlocked 
            ? `${description}<br><span style="color: #00ff00">Ability Unlocked!</span>` 
            : `<span style="color: #aaaaaa">${description}</span><br><span style="color: #ffff00">Upgrade your relic to level ${level} to unlock.</span>`;
        }
      }
      
      console.log('Showing details for ability: ' + name);
    });
  });
  
  console.log('Relics tab updated with player relics');
};

// This ensures the relics tab is preserved and relics are visible
window.keepRelicsVisibleInTab = function(player) {
  console.log('[INLINE-FIX] Ensuring relics remain visible in tab');
  
  // Get the relics tab
  const relicsTab = document.getElementById('relics-tab');
  if (!relicsTab) return;
  
  // Get the equipped relics
  if (!player || !player.relics) return;
  
  // Remember if the relics tab was active
  const wasActive = relicsTab.classList.contains('active');
  
  // Remember all active tabs to make sure we don't disrupt UI
  const activeTabs = [];
  document.querySelectorAll('.tab-content.active').forEach(tab => {
    activeTabs.push(tab.id);
  });
  
  // Remember all active tab buttons
  const activeButtons = [];
  document.querySelectorAll('.tab-button.active').forEach(btn => {
    activeButtons.push(btn.getAttribute('data-tab'));
  });
  
  if (typeof updateRelicsTab === 'function') {
    // Update the tab with existing function
    updateRelicsTab(player);
    
    // Restore all tabs that were active
    activeTabs.forEach(tabId => {
      const tab = document.getElementById(tabId);
      if (tab) {
        tab.classList.add('active');
      }
    });
    
    // Restore all buttons that were active
    document.querySelectorAll('.tab-button').forEach(btn => {
      if (activeButtons.includes(btn.getAttribute('data-tab'))) {
        btn.classList.add('active');
      }
    });
    
    // Force the relics tab to be visible if it was active
    if (wasActive) {
      relicsTab.classList.add('active');
      
      // Make the button active too
      const tabButtons = document.querySelectorAll('.tab-button');
      tabButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === 'relics-tab') {
          btn.classList.add('active');
        }
      });
    }
  }
};

// Function to apply the fixes to the game
function applyRelicTabFixes() {
  console.log('Applying relic tab fixes...');
  
  // Force a refresh to test if our changes work
  if (window.player && window.player.relics) {
    console.log('Testing relic tab updates');
    window.updateRelicsTab(window.player);
  }
}

// Call the function to apply fixes
applyRelicTabFixes();
