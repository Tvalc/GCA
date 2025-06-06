// AudioManager handles all audio-related operations
class AudioManager {
  constructor(game) {
    this.game = game;
    this.musicVolume = 0.5;
    this.soundVolume = 0.5;
    this.voiceVolume = 0.5;
    this.currentMusic = null;
    this.sounds = new Map();
    this.voices = new Map();
    this.musicTracks = new Map();
    this.isMuted = false;
    this.context = null;
    this.masterGain = null;
    this.musicGain = null;
    this.soundGain = null;
    this.voiceGain = null;
  }

  async init() {
    try {
      // Create audio context
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create gain nodes
      this.masterGain = this.context.createGain();
      this.musicGain = this.context.createGain();
      this.soundGain = this.context.createGain();
      this.voiceGain = this.context.createGain();
      
      // Connect gain nodes
      this.musicGain.connect(this.masterGain);
      this.soundGain.connect(this.masterGain);
      this.voiceGain.connect(this.masterGain);
      this.masterGain.connect(this.context.destination);
      
      // Set initial volumes
      this.setMusicVolume(this.musicVolume);
      this.setSoundVolume(this.soundVolume);
      this.setVoiceVolume(this.voiceVolume);
      
      // Load audio assets
      await this.loadAudioAssets();
      
      return true;
    } catch (error) {
      console.error('Failed to initialize audio:', error);
      return false;
    }
  }

  async loadAudioAssets() {
    // Load music tracks
    const musicTracks = [
      { id: 'mainTheme', url: 'assets/audio/music/main_theme.mp3' },
      { id: 'battleTheme', url: 'assets/audio/music/battle_theme.mp3' },
      { id: 'shopTheme', url: 'assets/audio/music/shop_theme.mp3' },
      { id: 'dungeonTheme', url: 'assets/audio/music/dungeon_theme.mp3' }
    ];
    
    for (const track of musicTracks) {
      try {
        const response = await fetch(track.url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
        this.musicTracks.set(track.id, audioBuffer);
      } catch (error) {
        console.error(`Failed to load music track ${track.id}:`, error);
      }
    }
    
    // Load sound effects
    const soundEffects = [
      { id: 'click', url: 'assets/audio/sounds/click.mp3' },
      { id: 'sword', url: 'assets/audio/sounds/sword.mp3' },
      { id: 'magic', url: 'assets/audio/sounds/magic.mp3' },
      { id: 'heal', url: 'assets/audio/sounds/heal.mp3' },
      { id: 'levelUp', url: 'assets/audio/sounds/level_up.mp3' },
      { id: 'itemPickup', url: 'assets/audio/sounds/item_pickup.mp3' },
      { id: 'door', url: 'assets/audio/sounds/door.mp3' },
      { id: 'chest', url: 'assets/audio/sounds/chest.mp3' }
    ];
    
    for (const sound of soundEffects) {
      try {
        const response = await fetch(sound.url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
        this.sounds.set(sound.id, audioBuffer);
      } catch (error) {
        console.error(`Failed to load sound effect ${sound.id}:`, error);
      }
    }
    
    // Load voice lines
    const voiceLines = [
      { id: 'greeting', url: 'assets/audio/voice/greeting.mp3' },
      { id: 'quest', url: 'assets/audio/voice/quest.mp3' },
      { id: 'battle', url: 'assets/audio/voice/battle.mp3' },
      { id: 'victory', url: 'assets/audio/voice/victory.mp3' },
      { id: 'defeat', url: 'assets/audio/voice/defeat.mp3' }
    ];
    
    for (const voice of voiceLines) {
      try {
        const response = await fetch(voice.url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
        this.voices.set(voice.id, audioBuffer);
      } catch (error) {
        console.error(`Failed to load voice line ${voice.id}:`, error);
      }
    }
  }

  playMusic(trackId, loop = true, fadeIn = true) {
    if (!this.musicTracks.has(trackId)) {
      console.error(`Music track ${trackId} not found`);
      return;
    }
    
    // Stop current music if playing
    if (this.currentMusic) {
      this.stopMusic();
    }
    
    // Create new source
    const source = this.context.createBufferSource();
    source.buffer = this.musicTracks.get(trackId);
    source.loop = loop;
    
    // Connect to music gain node
    source.connect(this.musicGain);
    
    // Handle fade in
    if (fadeIn) {
      this.musicGain.gain.setValueAtTime(0, this.context.currentTime);
      this.musicGain.gain.linearRampToValueAtTime(
        this.musicVolume,
        this.context.currentTime + 2
      );
    }
    
    // Start playback
    source.start();
    this.currentMusic = source;
  }

  stopMusic(fadeOut = true) {
    if (!this.currentMusic) return;
    
    if (fadeOut) {
      // Fade out over 2 seconds
      this.musicGain.gain.linearRampToValueAtTime(
        0,
        this.context.currentTime + 2
      );
      
      // Stop after fade
      setTimeout(() => {
        if (this.currentMusic) {
          this.currentMusic.stop();
          this.currentMusic = null;
        }
      }, 2000);
    } else {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }

  playSound(soundId, volume = 1.0) {
    if (!this.sounds.has(soundId)) {
      console.error(`Sound effect ${soundId} not found`);
      return;
    }
    
    // Create new source
    const source = this.context.createBufferSource();
    source.buffer = this.sounds.get(soundId);
    
    // Create gain node for this sound
    const gainNode = this.context.createGain();
    gainNode.gain.value = volume * this.soundVolume;
    
    // Connect nodes
    source.connect(gainNode);
    gainNode.connect(this.soundGain);
    
    // Start playback
    source.start();
    
    // Clean up after playback
    source.onended = () => {
      source.disconnect();
      gainNode.disconnect();
    };
  }

  playVoice(voiceId, volume = 1.0) {
    if (!this.voices.has(voiceId)) {
      console.error(`Voice line ${voiceId} not found`);
      return;
    }
    
    // Create new source
    const source = this.context.createBufferSource();
    source.buffer = this.voices.get(voiceId);
    
    // Create gain node for this voice
    const gainNode = this.context.createGain();
    gainNode.gain.value = volume * this.voiceVolume;
    
    // Connect nodes
    source.connect(gainNode);
    gainNode.connect(this.voiceGain);
    
    // Start playback
    source.start();
    
    // Clean up after playback
    source.onended = () => {
      source.disconnect();
      gainNode.disconnect();
    };
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.musicGain.gain.value = this.musicVolume;
  }

  setSoundVolume(volume) {
    this.soundVolume = Math.max(0, Math.min(1, volume));
    this.soundGain.gain.value = this.soundVolume;
  }

  setVoiceVolume(volume) {
    this.voiceVolume = Math.max(0, Math.min(1, volume));
    this.voiceGain.gain.value = this.voiceVolume;
  }

  setMasterVolume(volume) {
    const masterVolume = Math.max(0, Math.min(1, volume));
    this.masterGain.gain.value = masterVolume;
  }

  mute() {
    this.isMuted = true;
    this.masterGain.gain.value = 0;
  }

  unmute() {
    this.isMuted = false;
    this.masterGain.gain.value = 1;
  }

  toggleMute() {
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  pause() {
    if (this.context.state === 'running') {
      this.context.suspend();
    }
  }

  resume() {
    if (this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  stopAll() {
    // Stop music
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
    
    // Reset gain nodes
    this.musicGain.gain.value = 0;
    this.soundGain.gain.value = 0;
    this.voiceGain.gain.value = 0;
  }
}

// Export the AudioManager class
export default AudioManager; 