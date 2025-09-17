const GAME_DATA = {
    CONFIG: {
        FOSSIL_BASE_SPAWN_RATE: 1000,
        FOSSIL_BASE_VALUE: 1,
        SKELETON_PIECE_BASE_CHANCE: 0.0005,
        MAX_FOSSILS_ON_GROUND: 10,
        ASCENSION_THRESHOLD: 1e12,
        AUTO_SAVE_INTERVAL: 30000,
        FOSSIL_AUTO_COLLECT_TIME: 30000,
        OFFLINE_PROGRESS_CAP: 24 * 60 * 60 * 1000, // 24 hours
    },
    
    player: {
        // Current run stats
        fossils: 0,
        fossilsLifetime: 0,
        digSpeed: 1,
        fossilQuality: 1,
        fossilCapacity: 10,
        currentDigsite: 'prehistoric_valley',
        
        // Rebirth stats (Expeditions)
        expeditions: 0,
        expeditionMultiplier: 1,
        expeditionPoints: 0,
        
        // Ascension stats
        ascensions: 0,
        paleontologists: 0,
        
        // Progress tracking
        skeletonPieces: {},
        completedSkeletons: [],
        unlockedDigsites: ['prehistoric_valley'],
        
        // Museum and collections
        museumCatalog: {},
        relics: {},
        achievements: [],
        
        // Meta progress
        totalPlayTime: 0,
        lastSaveTime: Date.now(),
        startTime: Date.now(),
        
        // Upgrades
        upgrades: {
            // Basic upgrades (fossils)
            basicDigSpeed: 0,
            basicFossilQuality: 0,
            basicCapacity: 0,
            
            // Expedition upgrades (expedition points)
            expeditionMultiplier: 0,
            newDigsites: 0,
            skeletonChanceBoost: 0,
            expeditionCapacityBoost: 0,
            expeditionSpawnBoost: 0,
            
            // Paleontologist upgrades (paleontologists)
            fossilBoostPermanent: 0,
            relicEffectBoost: 0,
            skeletonPowerBoost: 0,
            autoDigger: 0,
        },
        
        // Settings
        settings: {
            autoSave: true,
            notifications: true,
            animations: true,
            soundEffects: false,
            musicVolume: 0.5,
            sfxVolume: 0.7
        }
    }
};

// Game constants that don't change
const GAME_CONSTANTS = {
    VERSION: '1.0.0',
    SAVE_KEY: 'paleontologyIncremental',
    
    // UI Constants
    NOTIFICATION_DURATION: 3000,
    ANIMATION_DURATION: 300,
    
    // Calculation constants
    EXPEDITION_POINT_BASE: 1,
    EXPEDITION_MULTIPLIER_BASE: 1.1,
    PALEONTOLOGIST_FOSSIL_BONUS: 0.01,
    
    // Formatting
    NUMBER_SUFFIXES: ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'],
    
    // Achievement IDs
    ACHIEVEMENTS: {
        FIRST_FOSSIL: 'first_fossil',
        FIRST_SKELETON: 'first_skeleton', 
        FIRST_EXPEDITION: 'first_expedition',
        FOSSIL_MILLIONAIRE: 'fossil_millionaire',
        VETERAN_EXPLORER: 'veteran_explorer',
        SPEED_DEMON: 'speed_demon',
        MASTER_COLLECTOR: 'master_collector',
        PALEONTOLOGY_PHD: 'paleontology_phd'
    }
};

// Export for Node.js compatibility (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { GAME_DATA, GAME_CONSTANTS };
}
