// SceneManager handles different game scenes and transitions
class SceneManager {
  constructor(game) {
    this.game = game;
    this.scenes = new Map();
    this.currentScene = null;
    this.previousScene = null;
    this.isTransitioning = false;
    this.transitionProgress = 0;
    this.transitionDuration = 1000; // 1 second
    this.transitionStartTime = 0;
    this.transitionType = 'fade'; // fade, slide, none
  }

  init() {
    // Register default scenes
    this.registerScene('mainMenu', {
      init: () => this.initMainMenu(),
      update: (deltaTime) => this.updateMainMenu(deltaTime),
      render: (ctx) => this.renderMainMenu(ctx),
      cleanup: () => this.cleanupMainMenu()
    });

    this.registerScene('game', {
      init: () => this.initGame(),
      update: (deltaTime) => this.updateGame(deltaTime),
      render: (ctx) => this.renderGame(ctx),
      cleanup: () => this.cleanupGame()
    });

    this.registerScene('inventory', {
      init: () => this.initInventory(),
      update: (deltaTime) => this.updateInventory(deltaTime),
      render: (ctx) => this.renderInventory(ctx),
      cleanup: () => this.cleanupInventory()
    });

    this.registerScene('shop', {
      init: () => this.initShop(),
      update: (deltaTime) => this.updateShop(deltaTime),
      render: (ctx) => this.renderShop(ctx),
      cleanup: () => this.cleanupShop()
    });

    this.registerScene('quest', {
      init: () => this.initQuest(),
      update: (deltaTime) => this.updateQuest(deltaTime),
      render: (ctx) => this.renderQuest(ctx),
      cleanup: () => this.cleanupQuest()
    });

    // Start with main menu
    this.changeScene('mainMenu');
  }

  registerScene(id, scene) {
    this.scenes.set(id, scene);
  }

  async changeScene(sceneId, transitionType = 'fade') {
    if (this.isTransitioning || !this.scenes.has(sceneId)) {
      return false;
    }

    this.isTransitioning = true;
    this.transitionType = transitionType;
    this.transitionProgress = 0;
    this.transitionStartTime = performance.now();

    // Store previous scene
    this.previousScene = this.currentScene;

    // Initialize new scene
    const newScene = this.scenes.get(sceneId);
    await newScene.init();

    // Update current scene
    this.currentScene = newScene;

    return true;
  }

  update(deltaTime) {
    if (this.isTransitioning) {
      this.updateTransition(deltaTime);
    }

    if (this.currentScene) {
      this.currentScene.update(deltaTime);
    }
  }

  render(ctx) {
    if (!this.currentScene) {
      return;
    }

    // Render current scene
    this.currentScene.render(ctx);

    // Render transition effect
    if (this.isTransitioning) {
      this.renderTransition(ctx);
    }
  }

  updateTransition(deltaTime) {
    const currentTime = performance.now();
    const elapsed = currentTime - this.transitionStartTime;
    
    this.transitionProgress = Math.min(elapsed / this.transitionDuration, 1);

    if (this.transitionProgress >= 1) {
      this.isTransitioning = false;
      this.transitionProgress = 0;
    }
  }

  renderTransition(ctx) {
    const { width, height } = this.game.canvas;

    switch (this.transitionType) {
      case 'fade':
        ctx.fillStyle = `rgba(0, 0, 0, ${this.transitionProgress})`;
        ctx.fillRect(0, 0, width, height);
        break;

      case 'slide':
        const slideOffset = width * this.transitionProgress;
        ctx.fillStyle = 'black';
        ctx.fillRect(slideOffset, 0, width, height);
        break;
    }
  }

  // Main Menu Scene
  initMainMenu() {
    this.game.managers.ui.showMainMenu();
  }

  updateMainMenu(deltaTime) {
    // Update main menu UI
  }

  renderMainMenu(ctx) {
    // Render main menu background
    const background = this.game.managers.assets.getImage('background');
    if (background) {
      ctx.drawImage(background, 0, 0, this.game.canvas.width, this.game.canvas.height);
    }
  }

  cleanupMainMenu() {
    this.game.managers.ui.hideMainMenu();
  }

  // Game Scene
  initGame() {
    this.game.managers.ui.showHUD();
  }

  updateGame(deltaTime) {
    // Update game state
    this.game.update(deltaTime);
  }

  renderGame(ctx) {
    // Render game world
    this.game.render(ctx);
  }

  cleanupGame() {
    this.game.managers.ui.hideHUD();
  }

  // Inventory Scene
  initInventory() {
    this.game.managers.ui.showInventory();
  }

  updateInventory(deltaTime) {
    // Update inventory UI
  }

  renderInventory(ctx) {
    // Render inventory background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
  }

  cleanupInventory() {
    this.game.managers.ui.hideInventory();
  }

  // Shop Scene
  initShop() {
    this.game.managers.ui.showShop();
  }

  updateShop(deltaTime) {
    // Update shop UI
  }

  renderShop(ctx) {
    // Render shop background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
  }

  cleanupShop() {
    this.game.managers.ui.hideShop();
  }

  // Quest Scene
  initQuest() {
    this.game.managers.ui.showQuest();
  }

  updateQuest(deltaTime) {
    // Update quest UI
  }

  renderQuest(ctx) {
    // Render quest background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
  }

  cleanupQuest() {
    this.game.managers.ui.hideQuest();
  }

  // Scene State Management
  saveSceneState() {
    if (this.currentScene) {
      return {
        sceneId: this.currentScene.id,
        state: this.currentScene.getState()
      };
    }
    return null;
  }

  loadSceneState(state) {
    if (state && this.scenes.has(state.sceneId)) {
      const scene = this.scenes.get(state.sceneId);
      scene.setState(state.state);
      this.changeScene(state.sceneId, 'none');
    }
  }

  // Scene Navigation
  goToMainMenu() {
    return this.changeScene('mainMenu');
  }

  goToGame() {
    return this.changeScene('game');
  }

  goToInventory() {
    return this.changeScene('inventory');
  }

  goToShop() {
    return this.changeScene('shop');
  }

  goToQuest() {
    return this.changeScene('quest');
  }

  goBack() {
    if (this.previousScene) {
      return this.changeScene(this.previousScene.id);
    }
    return false;
  }
}

// Export the SceneManager class
export default SceneManager; 