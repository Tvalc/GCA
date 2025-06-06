// SaveManager handles all save/load operations
class SaveManager {
  constructor(game) {
    this.game = game;
    this.saveSlots = 3;
    this.autoSaveInterval = 5 * 60 * 1000; // 5 minutes
    this.autoSaveTimer = null;
    this.lastSaveTime = null;
    this.isSaving = false;
    this.isLoading = false;
  }

  init() {
    // Start auto-save timer
    this.startAutoSave();
    
    // Load last save time
    this.lastSaveTime = localStorage.getItem('lastSaveTime');
  }

  startAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
    }
    
    this.autoSaveTimer = setInterval(() => {
      this.autoSave();
    }, this.autoSaveInterval);
  }

  stopAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  async saveGame(slot = 'auto') {
    if (this.isSaving) return;
    this.isSaving = true;
    
    try {
      // Get current game state
      const gameState = this.getGameState();
      
      // Add metadata
      const saveData = {
        version: '1.0.0',
        timestamp: Date.now(),
        playTime: this.game.state.playTime,
        gameState
      };
      
      // Save to localStorage
      const saveKey = `save_${slot}`;
      localStorage.setItem(saveKey, JSON.stringify(saveData));
      
      // Update last save time
      this.lastSaveTime = Date.now();
      localStorage.setItem('lastSaveTime', this.lastSaveTime.toString());
      
      // Show save notification
      this.game.managers.ui.showNotification('Game saved successfully!', '#00ff00');
      
      return true;
    } catch (error) {
      console.error('Failed to save game:', error);
      this.game.managers.ui.showNotification('Failed to save game!', '#ff0000');
      return false;
    } finally {
      this.isSaving = false;
    }
  }

  async loadGame(slot = 'auto') {
    if (this.isLoading) return;
    this.isLoading = true;
    
    try {
      // Get save data from localStorage
      const saveKey = `save_${slot}`;
      const saveData = localStorage.getItem(saveKey);
      
      if (!saveData) {
        throw new Error('No save data found');
      }
      
      // Parse save data
      const { version, timestamp, playTime, gameState } = JSON.parse(saveData);
      
      // Check version compatibility
      if (!this.isVersionCompatible(version)) {
        throw new Error('Save file version incompatible');
      }
      
      // Restore game state
      this.restoreGameState(gameState);
      
      // Show load notification
      this.game.managers.ui.showNotification('Game loaded successfully!', '#00ff00');
      
      return true;
    } catch (error) {
      console.error('Failed to load game:', error);
      this.game.managers.ui.showNotification('Failed to load game!', '#ff0000');
      return false;
    } finally {
      this.isLoading = false;
    }
  }

  autoSave() {
    if (!this.isSaving) {
      this.saveGame('auto');
    }
  }

  getGameState() {
    return {
      player: {
        ...this.game.state.player,
        position: { ...this.game.state.player.position },
        stats: { ...this.game.state.player.stats },
        skills: [...this.game.state.player.skills],
        equipment: [...this.game.state.player.equipment]
      },
      inventory: [...this.game.state.inventory],
      gold: this.game.state.gold,
      xp: this.game.state.xp,
      level: this.game.state.level,
      keys: [...this.game.state.keys],
      currentScene: this.game.state.currentScene,
      map: this.game.state.map,
      enemies: this.game.state.enemies.map(enemy => ({
        ...enemy,
        position: { ...enemy.position }
      })),
      npcs: this.game.systems.npc.getNPCs().map(npc => ({
        ...npc,
        position: { ...npc.position },
        dialog: npc.dialog
      })),
      quests: this.game.systems.quest.getQuests(),
      relics: this.game.state.relics.map(relic => ({
        ...relic,
        level: relic.level,
        fury: relic.fury
      })),
      settings: {
        musicVolume: this.game.managers.audio.musicVolume,
        soundVolume: this.game.managers.audio.soundVolume,
        voiceVolume: this.game.managers.audio.voiceVolume
      }
    };
  }

  restoreGameState(gameState) {
    // Restore player
    this.game.state.player = {
      ...gameState.player,
      position: { ...gameState.player.position },
      stats: { ...gameState.player.stats },
      skills: [...gameState.player.skills],
      equipment: [...gameState.player.equipment]
    };
    
    // Restore inventory
    this.game.state.inventory = [...gameState.inventory];
    
    // Restore game state
    this.game.state.gold = gameState.gold;
    this.game.state.xp = gameState.xp;
    this.game.state.level = gameState.level;
    this.game.state.keys = [...gameState.keys];
    this.game.state.currentScene = gameState.currentScene;
    this.game.state.map = gameState.map;
    
    // Restore enemies
    this.game.state.enemies = gameState.enemies.map(enemy => ({
      ...enemy,
      position: { ...enemy.position }
    }));
    
    // Restore NPCs
    this.game.systems.npc.setNPCs(gameState.npcs.map(npc => ({
      ...npc,
      position: { ...npc.position },
      dialog: npc.dialog
    })));
    
    // Restore quests
    this.game.systems.quest.setQuests(gameState.quests);
    
    // Restore relics
    this.game.state.relics = gameState.relics.map(relic => ({
      ...relic,
      level: relic.level,
      fury: relic.fury
    }));
    
    // Restore settings
    this.game.managers.audio.setMusicVolume(gameState.settings.musicVolume);
    this.game.managers.audio.setSoundVolume(gameState.settings.soundVolume);
    this.game.managers.audio.setVoiceVolume(gameState.settings.voiceVolume);
  }

  isVersionCompatible(version) {
    // Simple version check
    const currentVersion = '1.0.0';
    return version === currentVersion;
  }

  getSaveInfo(slot) {
    const saveKey = `save_${slot}`;
    const saveData = localStorage.getItem(saveKey);
    
    if (!saveData) {
      return null;
    }
    
    try {
      const { version, timestamp, playTime, gameState } = JSON.parse(saveData);
      return {
        slot,
        version,
        timestamp,
        playTime,
        playerLevel: gameState.player.level,
        playerName: gameState.player.name,
        currentScene: gameState.currentScene
      };
    } catch (error) {
      console.error('Failed to parse save info:', error);
      return null;
    }
  }

  getAllSaveInfo() {
    const saveInfo = [];
    
    // Get auto-save info
    const autoSaveInfo = this.getSaveInfo('auto');
    if (autoSaveInfo) {
      saveInfo.push(autoSaveInfo);
    }
    
    // Get manual save info
    for (let i = 0; i < this.saveSlots; i++) {
      const manualSaveInfo = this.getSaveInfo(i);
      if (manualSaveInfo) {
        saveInfo.push(manualSaveInfo);
      }
    }
    
    return saveInfo;
  }

  deleteSave(slot) {
    const saveKey = `save_${slot}`;
    localStorage.removeItem(saveKey);
    
    // Show delete notification
    this.game.managers.ui.showNotification('Save file deleted!', '#ff0000');
  }

  clearAllSaves() {
    if (confirm('Are you sure you want to delete all save files?')) {
      // Delete auto-save
      localStorage.removeItem('save_auto');
      
      // Delete manual saves
      for (let i = 0; i < this.saveSlots; i++) {
        localStorage.removeItem(`save_${i}`);
      }
      
      // Clear last save time
      localStorage.removeItem('lastSaveTime');
      this.lastSaveTime = null;
      
      // Show clear notification
      this.game.managers.ui.showNotification('All save files deleted!', '#ff0000');
    }
  }

  exportSave(slot = 'auto') {
    const saveKey = `save_${slot}`;
    const saveData = localStorage.getItem(saveKey);
    
    if (!saveData) {
      this.game.managers.ui.showNotification('No save data to export!', '#ff0000');
      return;
    }
    
    // Create blob and download link
    const blob = new Blob([saveData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `save_${slot}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  importSave(file) {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      try {
        const saveData = JSON.parse(event.target.result);
        
        // Check version compatibility
        if (!this.isVersionCompatible(saveData.version)) {
          throw new Error('Save file version incompatible');
        }
        
        // Save imported data
        const saveKey = `save_import_${Date.now()}`;
        localStorage.setItem(saveKey, JSON.stringify(saveData));
        
        // Show import notification
        this.game.managers.ui.showNotification('Save file imported successfully!', '#00ff00');
      } catch (error) {
        console.error('Failed to import save:', error);
        this.game.managers.ui.showNotification('Failed to import save file!', '#ff0000');
      }
    };
    
    reader.onerror = () => {
      this.game.managers.ui.showNotification('Failed to read save file!', '#ff0000');
    };
    
    reader.readAsText(file);
  }
}

// Export the SaveManager class
export default SaveManager; 