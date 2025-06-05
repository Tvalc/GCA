// Tab system fix for equipment issues
document.addEventListener('DOMContentLoaded', function() {
  console.log('[Tab Fix] Initializing tab system fix...');
  
  // Make a safer version of the equipment click handler
  const originalEquip = EquipmentManager.equip;
  EquipmentManager.equip = function(player, item) {
    // Call original method
    const result = originalEquip.call(this, player, item);
    
    // Fix tab system after equipping
    if (result) {
      fixTabSystem();
    }
    
    return result;
  };
  
  // Also fix unequip
  const originalUnequip = EquipmentManager.unequip;
  EquipmentManager.unequip = function(player, slot) {
    // Call original method
    const result = originalUnequip.call(this, player, slot);
    
    // Fix tab system after unequipping
    if (result) {
      fixTabSystem();
    }
    
    return result;
  };
  
  // Fix the tab system
  function fixTabSystem() {
    // Delay slightly to ensure DOM is updated
    setTimeout(() => {
      // Get all tab buttons
      const tabButtons = document.querySelectorAll('.tab-button');
      
      // Set up click handlers for all tabs
      tabButtons.forEach(button => {
        // Remove existing handler by cloning and replacing
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add new event handler
        newButton.addEventListener('click', function(e) {
          e.stopPropagation(); // Prevent event bubbling
          
          // Deactivate all tabs
          tabButtons.forEach(btn => btn.classList.remove('active'));
          
          // Hide all tab content
          document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active');
          });
          
          // Activate this tab
          this.classList.add('active');
          
          // Show this tab's content
          const tabId = this.getAttribute('data-tab');
          const tabContent = document.getElementById(tabId);
          if (tabContent) {
            tabContent.style.display = 'block';
            tabContent.classList.add('active');
          }
        });
      });
      
      // Make sure active tab is properly displayed
      const activeTab = document.querySelector('.tab-button.active');
      if (activeTab) {
        const tabId = activeTab.getAttribute('data-tab');
        const tabContent = document.getElementById(tabId);
        if (tabContent) {
          // Show the active tab content
          document.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active');
          });
          tabContent.style.display = 'block';
          tabContent.classList.add('active');
        }
      }
    }, 0);
  }
  
  // Initialize the fix
  fixTabSystem();
  
  console.log('[Tab Fix] Tab system fix initialized');
});
