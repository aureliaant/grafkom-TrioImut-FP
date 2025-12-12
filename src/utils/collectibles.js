// Collectibles System
export const COLLECTIBLES = {
    kutai: [
        { id: 'kutai_coin1', name: 'Koin Emas Kutai', icon: '🪙', found: false },
        { id: 'kutai_coin2', name: 'Prasasti Yupa', icon: '📜', found: false },
        { id: 'kutai_coin3', name: 'Mahkota Raja', icon: '👑', found: false }
    ],
    tarumanegara: [
        { id: 'taruma_coin1', name: 'Koin Emas Tarumanegara', icon: '🪙', found: false },
        { id: 'taruma_coin2', name: 'Telapak Kaki Purnawarman', icon: '👣', found: false },
        { id: 'taruma_coin3', name: 'Gajah Kerajaan', icon: '🐘', found: false }
    ],
    kalingga: [
        { id: 'kalingga_coin1', name: 'Koin Emas Kalingga', icon: '🪙', found: false },
        { id: 'kalingga_coin2', name: 'Timbangan Keadilan', icon: '⚖️', found: false },
        { id: 'kalingga_coin3', name: 'Mahkota Ratu Shima', icon: '👑', found: false }
    ],
    sriwijaya: [
        { id: 'sriwijaya_coin1', name: 'Koin Emas Sriwijaya', icon: '🪙', found: false },
        { id: 'sriwijaya_coin2', name: 'Kapal Dagang Kuno', icon: '⛵', found: false },
        { id: 'sriwijaya_coin3', name: 'Prasasti Kedukan Bukit', icon: '📜', found: false }
    ],
    mataram: [
        { id: 'mataram_coin1', name: 'Koin Emas Mataram', icon: '🪙', found: false },
        { id: 'mataram_coin2', name: 'Arca Durga', icon: '🗿', found: false },
        { id: 'mataram_coin3', name: 'Miniatur Prambanan', icon: '🛕', found: false }
    ],
    sailendra: [
        { id: 'sailendra_coin1', name: 'Koin Emas Sailendra', icon: '🪙', found: false },
        { id: 'sailendra_coin2', name: 'Arca Buddha', icon: '🧘', found: false },
        { id: 'sailendra_coin3', name: 'Miniatur Borobudur', icon: '🛕', found: false }
    ],
    kediri: [
        { id: 'kediri_coin1', name: 'Koin Emas Kediri', icon: '🪙', found: false },
        { id: 'kediri_coin2', name: 'Naskah Kuno', icon: '📚', found: false },
        { id: 'kediri_coin3', name: 'Rempah Langka', icon: '🌿', found: false }
    ],
    majapahit: [
        { id: 'majapahit_coin1', name: 'Koin Emas Majapahit', icon: '🪙', found: false },
        { id: 'majapahit_coin2', name: 'Gapura Bentar Mini', icon: '⛩️', found: false },
        { id: 'majapahit_coin3', name: 'Keris Pusaka', icon: '🗡️', found: false }
    ]
};

// Get collectibles for a kingdom
export function getKingdomCollectibles(kingdomId) {
    return COLLECTIBLES[kingdomId] || [];
}

// Mark collectible as found
export function collectItem(itemId) {
    for (const kingdom in COLLECTIBLES) {
        const item = COLLECTIBLES[kingdom].find(c => c.id === itemId);
        if (item) {
            item.found = true;
            return item;
        }
    }
    return null;
}

// Get total collectibles count
export function getCollectiblesStats() {
    let total = 0;
    let found = 0;
    
    for (const kingdom in COLLECTIBLES) {
        COLLECTIBLES[kingdom].forEach(item => {
            total++;
            if (item.found) found++;
        });
    }
    
    return { found, total };
}

// Check if item is collected
export function isCollected(itemId) {
    for (const kingdom in COLLECTIBLES) {
        const item = COLLECTIBLES[kingdom].find(c => c.id === itemId);
        if (item) return item.found;
    }
    return false;
}
