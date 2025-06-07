class Bestiary {
    constructor(game) {
        this.game = game;
        this.visible = false;
        this.currentPage = 0;
        this.entriesPerPage = 4;
        this.killCounts = {}; // Track monster kills
        this.entries = []; // Will store all monster entries
        
        // Create UI elements
        this.createUI();
        this.loadBestiaryData();
    }

    createUI() {
        // Create main container
        this.container = document.createElement('div');
        this.container.className = 'bestiary-container';
        this.container.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            height: 80%;
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #666;
            border-radius: 8px;
            display: none;
            flex-direction: column;
            padding: 20px;
            color: #fff;
            font-family: 'Segoe UI', Arial, sans-serif;
        `;

        // Create header
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #666;
        `;
        
        const title = document.createElement('h2');
        title.textContent = 'Bestiary';
        title.style.margin = '0';
        
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: #fff;
            font-size: 24px;
            cursor: pointer;
            padding: 0 10px;
        `;
        closeBtn.onclick = () => this.hide();

        header.appendChild(title);
        header.appendChild(closeBtn);

        // Create content area
        this.content = document.createElement('div');
        this.content.style.cssText = `
            flex: 1;
            overflow-y: auto;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            padding: 10px;
        `;

        // Create navigation
        const nav = document.createElement('div');
        nav.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 20px;
            padding-top: 10px;
            border-top: 1px solid #666;
        `;

        const prevBtn = document.createElement('button');
        prevBtn.textContent = 'Previous';
        prevBtn.onclick = () => this.previousPage();

        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next';
        nextBtn.onclick = () => this.nextPage();

        [prevBtn, nextBtn].forEach(btn => {
            btn.style.cssText = `
                background: #444;
                border: none;
                color: #fff;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
            `;
        });

        nav.appendChild(prevBtn);
        nav.appendChild(nextBtn);

        // Assemble UI
        this.container.appendChild(header);
        this.container.appendChild(this.content);
        this.container.appendChild(nav);
        document.body.appendChild(this.container);
    }

    loadBestiaryData() {
        // Load bestiary data from all zone files
        const zones = ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9', 'B10', 'BS'];
        zones.forEach(zone => {
            fetch(`docs/Bestiary/${zone}_*.md`)
                .then(response => response.text())
                .then(text => this.parseBestiaryData(text, zone))
                .catch(console.error);
        });
    }

    parseBestiaryData(text, zone) {
        // Parse markdown content to extract monster data
        const lines = text.split('\n');
        let currentMonster = null;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith('|') && !line.includes('TYPE')) {
                const [name, type, hp, atk, def, spd, xp, gold, drops] = line.split('|')
                    .map(s => s.trim())
                    .filter(s => s);
                
                if (name && type) {
                    currentMonster = {
                        name: name.replace(/[^a-zA-Z0-9\s]/g, ''),
                        type,
                        stats: { hp, atk, def, spd },
                        rewards: { xp, gold },
                        drops: drops.split(',').map(d => d.trim()),
                        zone,
                        image: `assets/monsters/${name.toLowerCase().replace(/\s+/g, '_')}.png`,
                        kills: this.killCounts[name] || 0
                    };
                    this.entries.push(currentMonster);
                }
            }
        }
    }

    createMonsterEntry(monster) {
        const entry = document.createElement('div');
        entry.className = 'monster-entry';
        entry.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;

        // Monster image
        const img = document.createElement('img');
        img.src = monster.image;
        img.style.cssText = `
            width: 100%;
            height: 150px;
            object-fit: contain;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 4px;
        `;
        img.onerror = () => img.src = 'assets/monsters/placeholder.png';

        // Monster info
        const info = document.createElement('div');
        info.innerHTML = `
            <h3>${monster.name}</h3>
            <p>Type: ${monster.type}</p>
            <p>Zone: ${monster.zone}</p>
            <p>Kills: ${monster.kills}</p>
            <div class="stats">
                <p>HP: ${monster.stats.hp}</p>
                <p>ATK: ${monster.stats.atk}</p>
                <p>DEF: ${monster.stats.def}</p>
                <p>SPD: ${monster.stats.spd}</p>
            </div>
            <div class="drops">
                <p>Drops:</p>
                <ul>
                    ${monster.drops.map(drop => `<li>${drop}</li>`).join('')}
                </ul>
            </div>
        `;

        entry.appendChild(img);
        entry.appendChild(info);
        return entry;
    }

    show() {
        this.visible = true;
        this.container.style.display = 'flex';
        this.updatePage();
    }

    hide() {
        this.visible = false;
        this.container.style.display = 'none';
    }

    updatePage() {
        this.content.innerHTML = '';
        const start = this.currentPage * this.entriesPerPage;
        const end = start + this.entriesPerPage;
        
        this.entries.slice(start, end).forEach(monster => {
            this.content.appendChild(this.createMonsterEntry(monster));
        });
    }

    nextPage() {
        if ((this.currentPage + 1) * this.entriesPerPage < this.entries.length) {
            this.currentPage++;
            this.updatePage();
        }
    }

    previousPage() {
        if (this.currentPage > 0) {
            this.currentPage--;
            this.updatePage();
        }
    }

    recordKill(monsterName) {
        this.killCounts[monsterName] = (this.killCounts[monsterName] || 0) + 1;
        // Update the entry if it exists
        const entry = this.entries.find(e => e.name === monsterName);
        if (entry) {
            entry.kills = this.killCounts[monsterName];
        }
        // Save kill counts to localStorage
        localStorage.setItem('bestiaryKillCounts', JSON.stringify(this.killCounts));
    }

    loadKillCounts() {
        const saved = localStorage.getItem('bestiaryKillCounts');
        if (saved) {
            this.killCounts = JSON.parse(saved);
            // Update entries with saved kill counts
            this.entries.forEach(entry => {
                entry.kills = this.killCounts[entry.name] || 0;
            });
        }
    }
} 