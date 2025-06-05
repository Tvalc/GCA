// Relic Debug Helper - Add to GCAWorking.html
document.addEventListener('DOMContentLoaded', function() {
  console.log('[RELIC-DEBUG] Adding debug hooks');
  
  // Wait until the page is fully loaded and then inspect the DOM
  setTimeout(function() {
    const relicsTab = document.getElementById('relics-tab');
    if (!relicsTab) {
      console.error('[RELIC-DEBUG] Relics tab not found');
      return;
    }
    
    console.log('[RELIC-DEBUG] Found relics tab:', relicsTab);
    
    // Log all ability name elements and their computed styles
    const abilityElements = relicsTab.querySelectorAll('*[class*="ability"], *[class*="name"]');
    console.log('[RELIC-DEBUG] Found ability elements:', abilityElements.length);
    
    abilityElements.forEach(function(el, index) {
      const computedStyle = window.getComputedStyle(el);
      console.log(`[RELIC-DEBUG] Element ${index}:`, {
        element: el,
        tagName: el.tagName,
        className: el.className,
        id: el.id,
        textContent: el.textContent,
        innerHTML: el.innerHTML,
        computedStyle: {
          textAlign: computedStyle.textAlign,
          display: computedStyle.display,
          marginLeft: computedStyle.marginLeft,
          padding: computedStyle.padding
        }
      });
      
      // Force apply styles
      el.style.textAlign = 'left';
      
      // If this element contains text that matches our target ability names, apply specific styles
      if (el.textContent && (
          el.textContent.includes('Reality Guide') || 
          el.textContent.includes('Visit the Bodega')
        )) {
        console.log('[RELIC-DEBUG] Found target ability element:', el);
        el.style.textAlign = 'left';
        el.style.color = 'red'; // Make it red temporarily to see if our styles are applying
      }
    });
    
    // Also try to target specific relic items
    const relicItems = relicsTab.querySelectorAll('*[class*="relic"]');
    console.log('[RELIC-DEBUG] Found relic elements:', relicItems.length);
    
    relicItems.forEach(function(el, index) {
      console.log(`[RELIC-DEBUG] Relic ${index}:`, {
        element: el,
        tagName: el.tagName,
        className: el.className,
        id: el.id
      });
      
      // Force apply styles
      el.style.padding = '2px';
    });
    
    // Add an observer to detect DOM changes and reapply styles
    const observer = new MutationObserver(function(mutations) {
      console.log('[RELIC-DEBUG] DOM changed, reapplying styles');
      
      // Find ability elements and apply styles
      relicsTab.querySelectorAll('*[class*="ability"], *[class*="name"]').forEach(function(el) {
        el.style.textAlign = 'left';
      });
      
      // Find relic items and apply styles
      relicsTab.querySelectorAll('*[class*="relic"]').forEach(function(el) {
        el.style.padding = '2px';
      });
    });
    
    observer.observe(relicsTab, { 
      childList: true, 
      subtree: true,
      attributes: true,
      characterData: true
    });
    
    console.log('[RELIC-DEBUG] Setup complete');
  }, 1000);
});
