// debug-fix.js - Debug utilities for relic system

// Wait for the document to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('[DEBUG] Initializing relic system debugging');
    
    // Monitor equipment tab and relics tab visibility
    setInterval(function() {
        const characterScreen = document.getElementById('characterScreen');
        if (characterScreen && characterScreen.style.display !== 'none') {
            const equipmentTab = document.querySelector('.tab-content[data-tab="equipment"]');
            const relicsTab = document.querySelector('.tab-content[data-tab="relics"]');
            
            console.log('[DEBUG] Character screen visible');
            console.log('[DEBUG] Equipment tab visible:', equipmentTab && equipmentTab.classList.contains('active'));
            console.log('[DEBUG] Relics tab visible:', relicsTab && relicsTab.classList.contains('active'));
            
            // Log current equipment slots
            if (window.player && window.player.equipment) {
                console.log('[DEBUG] Relic slot 1:', window.player.equipment.relic_1);
                console.log('[DEBUG] Relic slot 2:', window.player.equipment.relic_2);
            }
            
            // Log applied relic bonuses
            if (window.player && window.player.appliedRelicBonuses) {
                console.log('[DEBUG] Applied relic bonuses:', JSON.stringify(window.player.appliedRelicBonuses));
            }
        }
    }, 3000); // Check every 3 seconds
    
    // Wait for RELIC_SYSTEM to be available
    const waitForRelicSystem = setInterval(function() {
        if (window.RELIC_SYSTEM) {
            clearInterval(waitForRelicSystem);
            console.log('[DEBUG] RELIC_SYSTEM object found, adding monitoring hooks');
            
            // Backup original methods
            const originalApplyRelicBonuses = window.RELIC_SYSTEM.applyRelicBonuses;
            const originalRemoveRelicBonuses = window.RELIC_SYSTEM.removeRelicBonuses;
            
            // Override applyRelicBonuses to add logging
            window.RELIC_SYSTEM.applyRelicBonuses = function(player, relicName) {
                console.log('[DEBUG] applyRelicBonuses called for', relicName);
                console.log('[DEBUG] Player equipment before:', JSON.stringify(player.equipment));
                console.log('[DEBUG] Applied bonuses before:', JSON.stringify(player.appliedRelicBonuses));
                
                // Call original method
                const result = originalApplyRelicBonuses.call(this, player, relicName);
                
                console.log('[DEBUG] Player equipment after:', JSON.stringify(player.equipment));
                console.log('[DEBUG] Applied bonuses after:', JSON.stringify(player.appliedRelicBonuses));
                console.log('[DEBUG] HP/MP after:', player.hp, '/', player.mp);
                
                // Check which tab is active after applying
                setTimeout(function() {
                    const activeTab = document.querySelector('.tab-content.active');
                    console.log('[DEBUG] Active tab after equipping:', activeTab ? activeTab.getAttribute('data-tab') : 'none');
                }, 100);
                
                return result;
            };
            
            // Override removeRelicBonuses to add logging
            window.RELIC_SYSTEM.removeRelicBonuses = function(player, relicName) {
                console.log('[DEBUG] removeRelicBonuses called for', relicName);
                console.log('[DEBUG] Player equipment before:', JSON.stringify(player.equipment));
                console.log('[DEBUG] Applied bonuses before:', JSON.stringify(player.appliedRelicBonuses));
                
                // Call original method
                const result = originalRemoveRelicBonuses.call(this, player, relicName);
                
                console.log('[DEBUG] Player equipment after:', JSON.stringify(player.equipment));
                console.log('[DEBUG] Applied bonuses after:', JSON.stringify(player.appliedRelicBonuses));
                console.log('[DEBUG] HP/MP after:', player.hp, '/', player.mp);
                
                // Check which tab is active after removing
                setTimeout(function() {
                    const activeTab = document.querySelector('.tab-content.active');
                    console.log('[DEBUG] Active tab after unequipping:', activeTab ? activeTab.getAttribute('data-tab') : 'none');
                }, 100);
                
                return result;
            };
            
            // Monitor tab switching
            document.addEventListener('click', function(e) {
                if (e.target && e.target.classList.contains('tab-button')) {
                    console.log('[DEBUG] Tab button clicked:', e.target.getAttribute('data-tab'));
                }
                
                // Monitor clicks on relic headers
                if (e.target && e.target.classList.contains('relic-header')) {
                    console.log('[DEBUG] Relic header clicked:', e.target.textContent);
                    console.log('[DEBUG] Target:', e.target);
                    console.log('[DEBUG] Event propagation path:', e.composedPath().map(el => el.tagName || el.toString()).join(' > '));
                }
            }, true); // Use capture phase to see events before they're handled
        }
    }, 500);
});

// Helper function to find all event listeners on an element
window.getElementListeners = function(element) {
    const elClone = element.cloneNode(true);
    const elParent = element.parentNode;
    
    if (elParent) {
        elParent.replaceChild(elClone, element);
        console.log('Replaced element to check event listeners');
        return 'Element replaced - if functionality is broken, any listeners were attached directly';
    }
    
    return 'Could not replace element to test';
};
