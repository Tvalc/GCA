// Debug Control System for Farcade Game
// Version: 1.0 (2025-05-17)

// Global debug control object
window.DEBUG_CONTROL = {
  // Debug categories that can be enabled/disabled
  enabledCategories: {
    RELIC: true,      // Relic system logs
    COMBAT: false,    // Combat system logs
    ANIMATION: false, // Animation system logs
    MOVEMENT: false,  // Player movement logs
    STATS: true,      // Character stats logs
    UI: false,        // UI updates logs
    GENERAL: true     // General game logs
  },
  
  // Original console methods
  originalConsole: {
    log: console.log,
    warn: console.warn,
    error: console.error,
    info: console.info
  },
  
  // Initialize the debug control system
  init: function() {
    console.log("[DEBUG-CONTROL] Initializing debug control system");
    
    // Override console.log to filter by category
    console.log = function(message, ...args) {
      // Always show errors and critical messages
      if (typeof message === 'string') {
        // Check if this log belongs to a specific category
        let categoryMatch = message.match(/^\[(.*?)\]/);
        if (categoryMatch) {
          let category = categoryMatch[1];
          
          // Check common categories
          if (category.includes('ANIMATION') && !DEBUG_CONTROL.enabledCategories.ANIMATION) return;
          if (category.includes('MOVEMENT') && !DEBUG_CONTROL.enabledCategories.MOVEMENT) return;
          if (category.includes('COMBAT') && !DEBUG_CONTROL.enabledCategories.COMBAT) return;
          if (category.includes('RELIC') && !DEBUG_CONTROL.enabledCategories.RELIC) return;
          if (category.includes('STATS') && !DEBUG_CONTROL.enabledCategories.STATS) return;
          if (category.includes('UI') && !DEBUG_CONTROL.enabledCategories.UI) return;
          
          // Special case for inline fix logs
          if (category.includes('INLINE-FIX')) {
            // Only show if RELIC category is enabled
            if (!DEBUG_CONTROL.enabledCategories.RELIC) return;
          }
        } else {
          // If no category tag, treat as GENERAL
          if (!DEBUG_CONTROL.enabledCategories.GENERAL) return;
        }
      }
      
      // Call the original console.log with all arguments
      DEBUG_CONTROL.originalConsole.log(message, ...args);
    };
    
    // Add helper methods to enable/disable categories
    this.enable = function(category) {
      if (this.enabledCategories.hasOwnProperty(category)) {
        this.enabledCategories[category] = true;
        console.log(`[DEBUG-CONTROL] Enabled ${category} logs`);
      }
    };
    
    this.disable = function(category) {
      if (this.enabledCategories.hasOwnProperty(category)) {
        this.enabledCategories[category] = false;
        console.log(`[DEBUG-CONTROL] Disabled ${category} logs`);
      }
    };
    
    // Create a debug log control panel
    this.createDebugPanel = function() {
      const panel = document.createElement('div');
      panel.id = 'debug-control-panel';
      panel.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 10px;
        border-radius: 5px;
        font-family: monospace;
        font-size: 12px;
        z-index: 9999;
        display: none;
      `;
      
      let html = '<div style="font-weight: bold; margin-bottom: 5px;">Debug Controls</div>';
      
      // Add toggles for each category
      for (const category in this.enabledCategories) {
        html += `
          <div>
            <label>
              <input type="checkbox" data-category="${category}" 
                     ${this.enabledCategories[category] ? 'checked' : ''}>
              ${category}
            </label>
          </div>
        `;
      }
      
      // Add close button
      html += `
        <div style="margin-top: 5px;">
          <button id="debug-panel-close" style="padding: 2px 5px;">Close</button>
          <button id="debug-panel-hide" style="padding: 2px 5px; margin-left: 5px;">Hide</button>
        </div>
      `;
      
      panel.innerHTML = html;
      document.body.appendChild(panel);
      
      // Add event listeners
      document.querySelectorAll('#debug-control-panel input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
          const category = this.dataset.category;
          DEBUG_CONTROL.enabledCategories[category] = this.checked;
          console.log(`[DEBUG-CONTROL] ${this.checked ? 'Enabled' : 'Disabled'} ${category} logs`);
        });
      });
      
      document.getElementById('debug-panel-close').addEventListener('click', function() {
        panel.style.display = 'none';
      });
      
      document.getElementById('debug-panel-hide').addEventListener('click', function() {
        panel.style.display = 'none';
        // Show a small button to bring it back
        createDebugButton();
      });
    };
    
    // Create a small button to show the debug panel
    const createDebugButton = function() {
      const btn = document.createElement('button');
      btn.id = 'show-debug-panel';
      btn.textContent = 'Debug';
      btn.style.cssText = `
        position: fixed;
        bottom: 5px;
        right: 5px;
        padding: 3px 8px;
        background: #333;
        color: white;
        border: none;
        border-radius: 3px;
        font-size: 10px;
        cursor: pointer;
        z-index: 9999;
      `;
      
      btn.addEventListener('click', function() {
        document.getElementById('debug-control-panel').style.display = 'block';
        this.remove();
      });
      
      document.body.appendChild(btn);
    };
    
    // Create keyboard shortcut to toggle debug panel (Ctrl+Shift+D)
    document.addEventListener('keydown', function(e) {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        const panel = document.getElementById('debug-control-panel');
        if (panel) {
          panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
          
          // If hiding, show the small button
          if (panel.style.display === 'none') {
            const btn = document.getElementById('show-debug-panel');
            if (!btn) createDebugButton();
          } else {
            // If showing, remove the small button
            const btn = document.getElementById('show-debug-panel');
            if (btn) btn.remove();
          }
        } else {
          DEBUG_CONTROL.createDebugPanel();
          document.getElementById('debug-control-panel').style.display = 'block';
        }
      }
    });
    
    console.log("[DEBUG-CONTROL] Debug control system initialized. Press Ctrl+Shift+D to toggle debug panel");
  }
};

// Initialize when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    window.DEBUG_CONTROL.init();
  }, 500);
});
