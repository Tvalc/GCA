/**
 * Equipment Screen Fix for Glitter Cloud Adventure
 * 
 * This script fixes issues with the equipment screen, particularly:
 * 1. Ensures all equipment slots are displayed correctly after equipping items
 * 2. Prevents the character menu from closing unexpectedly when clicking on items
 * 3. Fixes the issue where all tabs appear the same after equipping rubber dumbbells
 * 
 * Instructions:
 * Include this script at the end of your HTML file, right before the closing </body> tag
 */

// Wait for the page to load before applying fixes
window.addEventListener('load', function() {
  console.log('[Equipment Fix] Applying equipment screen fixes...');
  
  // Fix for equipment tab display issues
  const originalUpdateEquipmentList = window.updateEquipmentList;
  
  // Override the updateEquipmentList function
  window.updateEquipmentList = function(player) {
    // Call the original function first
    originalUpdateEquipmentList(player);
    
    // Now ensure the equipment tab is properly displayed
    ensureEquipmentTabVisible();
    
    // Extra fix for the equipment list visibility
    setTimeout(() => {
      const equipmentList = document.querySelector(".equipment-list");
      if (equipmentList) {
        // Force a DOM reflow to ensure everything is properly rendered
        const display = equipmentList.style.display;
        equipmentList.style.display = 'none';
        void equipmentList.offsetHeight; // Trigger reflow
        equipmentList.style.display = display;
      }
    }, 10);
  };
  
  // Function to ensure the equipment tab is visible and correctly displayed
  window.ensureEquipmentTabVisible = function() {
    // Make sure the equipment tab is visible
    const equipmentTab = document.getElementById('equipment-tab');
    if (equipmentTab) {
      // Force all tabs to be properly hidden
      document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
        tab.classList.remove('active');
      });
      
      // Make the equipment tab visible
      equipmentTab.style.display = 'block';
      equipmentTab.classList.add('active');
      
      // Ensure the tab button is also correctly highlighted
      document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      const equipmentTabButton = document.querySelector('[data-tab="equipment-tab"]');
      if (equipmentTabButton) {
        equipmentTabButton.classList.add('active');
      }
    }
  };
  
  // Fix the EquipmentManager.equip function to use our improved tab management
  if (window.EquipmentManager && window.EquipmentManager.equip) {
    const originalEquip = window.EquipmentManager.equip;
    
    window.EquipmentManager.equip = function(player, item) {
      // Call the original function
      const result = originalEquip.call(this, player, item);
      
      // Ensure the equipment tab is properly displayed
      if (result) {
        ensureEquipmentTabVisible();
      }
      
      return result;
    };
  }
  
  // Fix the EquipmentManager.unequip function similarly
  if (window.EquipmentManager && window.EquipmentManager.unequip) {
    const originalUnequip = window.EquipmentManager.unequip;
    
    window.EquipmentManager.unequip = function(player, slot) {
      // Call the original function
      const result = originalUnequip.call(this, player, slot);
      
      // Ensure the equipment tab is properly displayed
      if (result) {
        ensureEquipmentTabVisible();
      }
      
      return result;
    };
  }
  
  console.log('[Equipment Fix] Equipment screen fixes applied successfully!');
});
