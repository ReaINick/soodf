// ========================================
// PALEONTOLOGY INCREMENTAL GAME
// Complete JavaScript Implementation
// ========================================

// Game State and Configuration
const GAME_CONFIG = {
    VERSION: '1.0.0',
    SAVE_KEY: 'paleontologyIncremental_v1',
    
    // Timing constants
    TICK_RATE: 50, // 20 FPS for smooth animations
    SAVE_INTERVAL: 30000, // Auto-save every 30 seconds
    NOTIFICATION_DURATION: 3000,
    
    // Fossil system
    FOSSIL_BASE_SPAWN_RATE: 1000,
    FOSSIL_BASE_VALUE: 1,
    MAX_FOSSILS_ON_GROUND: 10,
    FOSSIL_AUTO_COLLECT_TIME: 30000,
    
    // Skeleton system  
    SKELETON_PIECE_BASE_CHANCE: 0.0005, // 0.05%
    
    // Progression thresholds
    EXPEDITION_BASE_COST: 1, // Complete 1 skeleton
    ASCENSION_THRESHOLD: 1e12, // 1 trillion fossils lifetime
    
    // UI constants
    MAX_NOTIFICATIONS: 5,
    ANIMATION_DURATION: 300,
    
    // Number formatting
    NUMBER_SUFFIXES: ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'],
    
    // Performance settings
    MAX_PARTICLES: 50,
    PARTICLE_LIFETIME: 2000
};

// Core Game Data Structure
const GAME_DATA = {
    player: {
        // Current run stats
        fossils: 0,
        fossilsLifetime: 0,
        fossilsAllTime: 0,
        
        // Current run modifiers
        digSpeed: 1,
        fossilQuality: 1,
        fossilCapacity: 10,
        autoDigEnabled: false,
        
        // Progression stats
        expeditions: 0,
        expeditionPoints: 0,
        expeditionMultiplier: 1,
        
        ascensions: 0,
        paleontologists: 0,
        
        // Discovery tracking
        currentDigsite: 'prehistoric_valley',
        unlockedDigsites: ['prehistoric_valley'],
        skeletonPieces: {},
        completedSkeletons: [],
        
        // Collection data
        museumCatalog: {},
        achievements: [],
        statistics: {
            fossilsClicked: 0,
            totalPlayTime: 0,
            sessionsPlayed: 0,
            largestFossil: 0,
            fastestSkeleton: 0
        },
        
        // Upgrades
        upgrades: {
            // Basic upgrades (fossil currency)
            basicDigSpeed: 0,
            basicFossilQuality: 0,
            basicCapacity: 0,
            basicAutoCollect: 0,
            
            // Expedition upgrades (expedition points)
            expeditionMultiplier: 0,
            expeditionSkeletonChance: 0,
            expeditionDigsiteBoost: 0,
            expeditionCapacityBoost: 0,
            
            // Paleontologist upgrades (paleontologist currency)
            paleontologistFossilBoost: 0,
            paleontologistAutoDigger: 0,
            paleontologistSkeletonBoost: 0,
            paleontrologistRelicPower: 0
        },
        
        // Meta data
        settings: {
            autoSave: true,
            notifications: true,
            animations: true,
            soundEffects: false,
            theme: 'default',
            numberFormat: 'short'
        },
        
        lastSave: Date.now(),
        startTime: Date.now(),
        sessionStart: Date.now()
    }
};

// Skeleton Data Configuration
const SKELETON_DATA = {
    velociraptor: {
        name: "Velociraptor",
        rarity: "common",
        pieces: ['skull', 'spine', 'ribs', 'left_arm', 'right_arm', 'left_leg', 'right_leg', 'tail', 'claws'],
        unlockRequirement: null,
        completionBonus: {
            type: 'skeleton_chance',
            value: 0.0005,
            description: '+0.05% skeleton piece drop chance'
        },
        description: "A swift predator from the Late Cretaceous period."
    },
    
    triceratops: {
        name: "Triceratops", 
        rarity: "uncommon",
        pieces: ['skull', 'frill', 'horns', 'spine', 'ribs', 'left_front_leg', 'right_front_leg', 'left_back_leg', 'right_back_leg', 'tail'],
        unlockRequirement: { expeditions: 1 },
        completionBonus: {
            type: 'fossil_value',
            value: 1.5,
            description: '+50% fossil value'
        },
        description: "A heavily armored herbivore with distinctive three-horned face shield."
    },
    
    stegosaurus: {
        name: "Stegosaurus",
        rarity: "uncommon", 
        pieces: ['skull', 'spine', 'plates_front', 'plates_middle', 'plates_back', 'ribs', 'left_front_leg', 'right_front_leg', 'left_back_leg', 'right_back_leg', 'tail', 'tail_spikes'],
        unlockRequirement: { expeditions: 3 },
        completionBonus: {
            type: 'dig_speed',
            value: 2.0,
            description: '+100% fossil spawn rate'
        },
        description: "Famous for its distinctive back plates and tail spikes."
    },
    
    allosaurus: {
        name: "Allosaurus",
        rarity: "rare",
        pieces: ['skull', 'jaw', 'teeth', 'neck', 'spine_upper', 'spine_lower', 'ribs', 'left_arm', 'right_arm', 'left_leg', 'right_leg', 'tail', 'claws'],
        unlockRequirement: { expeditions: 8 },
        completionBonus: {
            type: 'expedition_points',
            value: 1.3,
            description: '+30% expedition points'
        },
        description: "A powerful predator of the Late Jurassic period."
    },
    
    brachiosaurus: {
        name: "Brachiosaurus",
        rarity: "rare",
        pieces: ['skull', 'neck_1', 'neck_2', 'neck_3', 'neck_4', 'spine', 'ribs', 'left_front_leg', 'right_front_leg', 'left_back_leg', 'right_back_leg', 'tail'],
        unlockRequirement: { expeditions: 15 },
        completionBonus: {
            type: 'fossil_capacity',
            value: 2.0,
            description: '+100% fossil capacity'
        },
        description: "A massive sauropod reaching heights of 40+ feet."
    },
    
    tyrannosaurus: {
        name: "Tyrannosaurus Rex",
        rarity: "legendary",
        pieces: ['skull', 'jaw', 'teeth', 'neck', 'spine_upper', 'spine_middle', 'spine_lower', 'ribs', 'left_arm', 'right_arm', 'left_leg', 'right_leg', 'tail', 'hip'],
        unlockRequirement: { expeditions: 25 },
        completionBonus: {
            type: 'all_multiplier',
            value: 2.0,
            description: '+100% to all gains'
        },
        description: "The apex predator of the Late Cretaceous period."
    }
};

// Digsite Data Configuration
const DIGSITE_DATA = {
    prehistoric_valley: {
        name: "Prehistoric Valley",
        description: "A lush valley where ancient fossils lie waiting to be discovered.",
        fossilMultiplier: 1,
        unlockRequirement: null,
        availableSkeletons: ['velociraptor'],
        backgroundColor: 'linear-gradient(145deg, #8b4513, #a0522d)',
        explorationRequired: 100
    },
    
    bone_canyon: {
        name: "Bone Canyon",
        description: "An ancient riverbed rich with fossilized remains.",
        fossilMultiplier: 2.5,
        unlockRequirement: { expeditions: 1 },
        availableSkeletons: ['velociraptor', 'triceratops'],
        backgroundColor: 'linear-gradient(145deg, #cd853f, #daa520)',
        explorationRequired: 250
    },
    
    fossil_cliffs: {
        name: "Fossil Cliffs", 
        description: "Exposed rock faces reveal ancient secrets from deep time.",
        fossilMultiplier: 6,
        unlockRequirement: { expeditions: 3 },
        availableSkeletons: ['velociraptor', 'triceratops', 'stegosaurus'],
        backgroundColor: 'linear-gradient(145deg, #696969, #778899)',
        explorationRequired: 500
    },
    
    amber_forest: {
        name: "Amber Forest",
        description: "Perfectly preserved specimens trapped in golden resin.",
        fossilMultiplier: 15,
        unlockRequirement: { expeditions: 10 },
        availableSkeletons: ['velociraptor', 'triceratops', 'stegosaurus', 'allosaurus'],
        backgroundColor: 'linear-gradient(145deg, #ff8c00, #ffd700)',
        explorationRequired: 1000
    },
    
    primordial_depths: {
        name: "Primordial Depths",
        description: "Deep caverns hiding the largest predators ever discovered.",
        fossilMultiplier: 50,
        unlockRequirement: { expeditions: 25 },
        availableSkeletons: ['velociraptor', 'triceratops', 'stegosaurus', 'allosaurus', 'brachiosaurus', 'tyrannosaurus'],
        backgroundColor: 'linear-gradient(145deg, #2c3e50, #34495e)',
        explorationRequired: 2500
    }
};

// Upgrade Data Configuration  
const UPGRADE_DATA = {
    basic: {
        digSpeed: {
            name: "Improved Tools",
            description: "Increase fossil spawn rate",
            baseCost: 10,
            costMultiplier: 1.15,
            effect: level => Math.pow(1.25, level),
            maxLevel: 1000,
            icon: "⛏️"
        },
        
        fossilQuality: {
            name: "Expert Training",
            description: "Increase fossil value",
            baseCost: 25, 
            costMultiplier: 1.2,
            effect: level => Math.pow(1.2, level),
            maxLevel: 1000,
            icon: "🎓"
        },
        
        capacity: {
            name: "Larger Dig Site",
            description: "More fossils can appear at once",
            baseCost: 100,
            costMultiplier: 1.25,
            effect: level => 10 + (level * 2),
            maxLevel: 100,
            icon: "📏"
        },
        
        autoCollect: {
            name: "Collection Tools",
            description: "Automatically collect old fossils",
            baseCost: 500,
            costMultiplier: 2.0,
            effect: level => Math.max(0, 30 - level * 2), // Reduces auto-collect time
            maxLevel: 14, // Min 2 second auto-collect
            icon: "🤖"
        }
    },
    
    expedition: {
        multiplier: {
            name: "Field Experience",
            description: "Multiplicative boost to all fossil gains",
            baseCost: 1,
            costMultiplier: 2.0,
            effect: level => Math.pow(1.5, level),
            maxLevel: 50,
            icon: "🏕️"
        },
        
        skeletonChance: {
            name: "Keen Eye",
            description: "Increase skeleton piece drop chance",
            baseCost: 5,
            costMultiplier: 2.5,
            effect: level => level * 0.0001,
            maxLevel: 100,
            icon: "👁️"
        },
        
        digsiteBoost: {
            name: "Survey Mastery", 
            description: "Boost digsite multipliers",
            baseCost: 15,
            costMultiplier: 3.0,
            effect: level => 1 + (level * 0.1),
            maxLevel: 25,
            icon: "🗺️"
        },
        
        capacityBoost: {
            name: "Advanced Equipment",
            description: "Further increase fossil capacity",
            baseCost: 25,
            costMultiplier: 3.5,
            effect: level => level * 5,
            maxLevel: 20,
            icon: "📦"
        }
    },
    
    paleontologist: {
        fossilBoost: {
            name: "Research Grant",
            description: "Permanent multiplicative fossil boost",
            baseCost: 1,
            costMultiplier: 10,
            effect: level => Math.pow(2, level),
            maxLevel: 20,
            icon: "💰"
        },
        
        autoDigger: {
            name: "Automated Excavation",
            description: "Continues progress while offline",
            baseCost: 5, 
            costMultiplier: 1,
            effect: level => Math.min(level * 0.1, 1),
            maxLevel: 10,
            icon: "⚙️"
        },
        
        skeletonBoost: {
            name: "Expert Analysis",
            description: "Dramatically increase skeleton piece chance",
            baseCost: 3,
            costMultiplier: 15,
            effect: level => level * 0.001,
            maxLevel: 15,
            icon: "🔬"
        },
        
        relicPower: {
            name: "Ancient Wisdom",
            description: "Unlock powerful relic bonuses",
            baseCost: 10,
            costMultiplier: 25,
            effect: level => Math.pow(1.25, level),
            maxLevel: 10,
            icon: "📜"
        }
    }
};

// Achievement Data
const ACHIEVEMENT_DATA = {
    first_fossil: {
        name: "First Discovery",
        description: "Find your first fossil",
        condition: () => GAME_DATA.player.fossilsAllTime > 0,
        icon: "🔍",
        reward: { type: 'none' }
    },
    
    first_skeleton: {
        name: "Bone Collector", 
        description: "Complete your first skeleton",
        condition: () => GAME_DATA.player.completedSkeletons.length > 0,
        icon: "🦴",
        reward: { type: 'fossil_bonus', value: 1.1 }
    },
    
    first_expedition: {
        name: "Explorer",
        description: "Complete your first expedition",
        condition: () => GAME_DATA.player.expeditions > 0,
        icon: "🗺️",
        reward: { type: 'expedition_points', value: 5 }
    },
    
    fossil_millionaire: {
        name: "Fossil Millionaire",
        description: "Collect 1,000,000 total fossil value",
        condition: () => GAME_DATA.player.fossilsAllTime >= 1000000,
        icon: "💰",
        reward: { type: 'fossil_multiplier', value: 1.25 }
    },
    
    speed_demon: {
        name: "Speed Demon",
        description: "Click 1000 fossils in a single session",
        condition: () => GAME_DATA.player.statistics.fossilsClicked >= 1000,
        icon: "⚡",
        reward: { type: 'dig_speed', value: 1.5 }
    },
    
    master_collector: {
        name: "Master Collector",
        description: "Complete 5 different skeletons",
        condition: () => GAME_DATA.player.completedSkeletons.length >= 5,
        icon: "🏆",
        reward: { type: 'skeleton_chance', value: 0.001 }
    },
    
    paleontology_phd: {
        name: "Paleontology PhD",
        description: "Reach 10 ascensions",
        condition: () => GAME_DATA.player.ascensions >= 10,
        icon: "🎓",
        reward: { type: 'all_multiplier', value: 2.0 }
    }
};

// ========================================
// GAME SYSTEMS
// ========================================

// Game class - Main game controller
class Game {
    constructor() {
        this.isRunning = false;
        this.lastUpdate = performance.now();
        this.accumulator = 0;
        
        // Game state
        this.fossilsOnGround = [];
        this.particles = [];
        this.notifications = [];
        
        // Systems
        this.fossilSystem = new FossilSystem(this);
        this.skeletonSystem = new SkeletonSystem(this);
        this.expeditionSystem = new ExpeditionSystem(this);
        this.upgradeSystem = new UpgradeSystem(this);
        this.achievementSystem = new AchievementSystem(this);
        this.ui = new UISystem(this);
        this.saveSystem = new SaveSystem(this);
        
        // Timing
        this.lastSave = Date.now();
        this.lastStatUpdate = Date.now();
        
        this.debug = new DebugSystem(this);
        
        this.bindEvents();
        this.init();
    }
    
    init() {
        console.log('🦕 Paleontology Incremental Game v' + GAME_CONFIG.VERSION);
        this.saveSystem.load();
        this.ui.init();
        this.upgradeSystem.applyAllUpgrades();
        this.achievementSystem.checkAllAchievements();
        this.calculateOfflineProgress();
    }
    
    start() {
        this.isRunning = true;
        this.lastUpdate = performance.now();
        GAME_DATA.player.sessionStart = Date.now();
        GAME_DATA.player.statistics.sessionsPlayed++;
        this.gameLoop();
    }
    
    gameLoop() {
        if (!this.isRunning) return;
        
        const now = performance.now();
        const deltaTime = now - this.lastUpdate;
        this.lastUpdate = now;
        
        // Fixed timestep with accumulator for consistent physics
        this.accumulator += deltaTime;
        const fixedDeltaTime = 1000 / 60; // 60 FPS fixed timestep
        
        while (this.accumulator >= fixedDeltaTime) {
            this.update(fixedDeltaTime);
            this.accumulator -= fixedDeltaTime;
        }
        
        // Render with interpolation
        const alpha = this.accumulator / fixedDeltaTime;
        this.render(alpha);
        
        // Auto-save check
        if (now - this.lastSave > GAME_CONFIG.SAVE_INTERVAL) {
            this.saveSystem.save();
            this.lastSave = now;
        }
        
        // Statistics update
        if (now - this.lastStatUpdate > 1000) {
            this.updateStatistics();
            this.lastStatUpdate = now;
        }
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update(deltaTime) {
        // Update all systems
        this.fossilSystem.update(deltaTime);
        this.skeletonSystem.update(deltaTime);
        this.expeditionSystem.update(deltaTime);
        this.achievementSystem.update(deltaTime);
        
        // Update particles
        this.updateParticles(deltaTime);
        
        // Update notifications
        this.updateNotifications(deltaTime);
    }
    
    render(alpha) {
        this.ui.update(alpha);
    }
    
    updateStatistics() {
        const now = Date.now();
        const sessionTime = now - GAME_DATA.player.sessionStart;
        GAME_DATA.player.statistics.totalPlayTime += 1; // 1 second increments
    }
    
    updateParticles(deltaTime) {
        this.particles = this.particles.filter(particle => {
            particle.life -= deltaTime;
            particle.y -= particle.speed * (deltaTime / 1000);
            particle.opacity = Math.max(0, particle.life / GAME_CONFIG.PARTICLE_LIFETIME);
            return particle.life > 0;
        });
    }
    
    updateNotifications(deltaTime) {
        this.notifications = this.notifications.filter(notification => {
            notification.life -= deltaTime;
            return notification.life > 0;
        });
    }
    
    calculateOfflineProgress() {
        const now = Date.now();
        const timeDiff = now - GAME_DATA.player.lastSave;
        
        if (timeDiff > 60000) { // Only if offline for more than 1 minute
            const offlineHours = Math.min(timeDiff / (1000 * 60 * 60), 24); // Cap at 24 hours
            const autoDigLevel = GAME_DATA.player.upgrades.paleontologistAutoDigger;
            const autoDigEfficiency = this.upgradeSystem.getUpgradeEffect('paleontologist', 'autoDigger', autoDigLevel);
            
            if (autoDigEfficiency > 0) {
                const fossilsGained = Math.floor(
                    this.calculateFossilValue() * 
                    this.calculateDigSpeed() * 
                    autoDigEfficiency * 
                    (offlineHours * 3600) / 
                    (GAME_CONFIG.FOSSIL_BASE_SPAWN_RATE / 1000)
                );
                
                if (fossilsGained > 0) {
                    GAME_DATA.player.fossils += fossilsGained;
                    GAME_DATA.player.fossilsLifetime += fossilsGained;
                    GAME_DATA.player.fossilsAllTime += fossilsGained;
                    
                    this.ui.showNotification(
                        `While you were away, your automated excavation found ${this.ui.formatNumber(fossilsGained)} fossils!`, 
                        'success'
                    );
                }
            }
        }
    }
    
    // Calculation methods
    calculateFossilValue() {
        let value = GAME_CONFIG.FOSSIL_BASE_VALUE;
        value *= GAME_DATA.player.fossilQuality;
        value *= GAME_DATA.player.expeditionMultiplier;
        value *= this.upgradeSystem.getTotalFossilMultiplier();
        value *= this.getDigsiteMultiplier();
        value *= this.getPaleontologistBonus();
        return Math.floor(value);
    }
    
    calculateDigSpeed() {
        let speed = GAME_DATA.player.digSpeed;
        speed *= this.getSkeletonSpeedBonus();
        return speed;
    }
    
    calculateSkeletonPieceChance() {
        let chance = GAME_CONFIG.SKELETON_PIECE_BASE_CHANCE;
        chance += this.getSkeletonChanceBonus();
        chance += this.upgradeSystem.getUpgradeEffect('expedition', 'skeletonChance', GAME_DATA.player.upgrades.expeditionSkeletonChance);
        chance += this.upgradeSystem.getUpgradeEffect('paleontologist', 'skeletonBoost', GAME_DATA.player.upgrades.paleontologistSkeletonBoost);
        return Math.min(chance, 0.1); // Cap at 10%
    }
    
    getDigsiteMultiplier() {
        const digsite = DIGSITE_DATA[GAME_DATA.player.currentDigsite];
        let multiplier = digsite.fossilMultiplier;
        multiplier *= this.upgradeSystem.getUpgradeEffect('expedition', 'digsiteBoost', GAME_DATA.player.upgrades.expeditionDigsiteBoost);
        return multiplier;
    }
    
    getPaleontologistBonus() {
        return 1 + (GAME_DATA.player.paleontologists * 0.01); // 1% per paleontologist
    }
    
    getSkeletonSpeedBonus() {
        let bonus = 1;
        for (const skeletonId of GAME_DATA.player.completedSkeletons) {
            const skeleton = SKELETON_DATA[skeletonId];
            if (skeleton.completionBonus.type === 'dig_speed') {
                bonus *= skeleton.completionBonus.value;
            }
        }
        return bonus;
    }
    
    getSkeletonChanceBonus() {
        let bonus = 0;
        for (const skeletonId of GAME_DATA.player.completedSkeletons) {
            const skeleton = SKELETON_DATA[skeletonId];
            if (skeleton.completionBonus.type === 'skeleton_chance') {
                bonus += skeleton.completionBonus.value;
            }
        }
        return bonus;
    }
    
    spawnParticle(x, y, color = '#f39c12') {
        if (this.particles.length >= GAME_CONFIG.MAX_PARTICLES) {
            this.particles.shift(); // Remove oldest particle
        }
        
        this.particles.push({
            x: x,
            y: y,
            life: GAME_CONFIG.PARTICLE_LIFETIME,
            opacity: 1,
            color: color,
            speed: 50 + Math.random() * 50,
            size: 2 + Math.random() * 3
        });
    }
    
    bindEvents() {
        // Prevent right-click context menu on game elements
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('#game-container')) {
                e.preventDefault();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveSystem.save();
                this.ui.showNotification('Game saved!', 'success');
            }
            
            if (e.key === 'Escape') {
                this.ui.closeAllModals();
            }
            
            // Debug toggle
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                this.debug.toggle();
            }
        });
        
        // Visibility change handling
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveSystem.save();
            } else {
                this.calculateOfflineProgress();
            }
        });
        
        // Page unload handling
        window.addEventListener('beforeunload', () => {
            this.saveSystem.save();
        });
    }
}

// Fossil System - Handles fossil spawning and collection
class FossilSystem {
    constructor(game) {
        this.game = game;
        this.spawnTimer = 0;
        this.autoCollectTimer = 0;
    }
    
    update(deltaTime) {
        // Fossil spawning
        this.spawnTimer += deltaTime;
        const spawnRate = GAME_CONFIG.FOSSIL_BASE_SPAWN_RATE / this.game.calculateDigSpeed();
        
        if (this.spawnTimer >= spawnRate && this.canSpawnFossil()) {
            this.spawnFossil();
            this.spawnTimer = 0;
        }
        
        // Auto-collection
        this.autoCollectTimer += deltaTime;
        const autoCollectTime = this.game.upgradeSystem.getUpgradeEffect('basic', 'autoCollect', GAME_DATA.player.upgrades.basicAutoCollect) * 1000;
        
        if (autoCollectTime > 0 && this.autoCollectTimer >= autoCollectTime) {
            this.autoCollectFossils();
            this.autoCollectTimer = 0;
        }
        
        // Age fossils for auto-collection
        this.ageFossils(deltaTime);
    }
    
    canSpawnFossil() {
        const maxCapacity = GAME_DATA.player.fossilCapacity + 
            this.game.upgradeSystem.getUpgradeEffect('expedition', 'capacityBoost', GAME_DATA.player.upgrades.expeditionCapacityBoost);
        return this.game.fossilsOnGround.length < maxCapacity;
    }
    
    spawnFossil() {
        const digsiteContainer = document.getElementById('digsite-view');
        const containerRect = digsiteContainer.getBoundingClientRect();
        
        const fossil = {
            id: Date.now() + Math.random(),
            value: this.game.calculateFossilValue(),
            x: Math.random() * (containerRect.width - 80) + 40,
            y: Math.random() * (containerRect.height - 40) + 20,
            spawnTime: Date.now(),
            age: 0
        };
        
        this.game.fossilsOnGround.push(fossil);
        
        // Check for skeleton piece drop
        if (Math.random() < this.game.calculateSkeletonPieceChance()) {
            this.game.skeletonSystem.dropSkeletonPiece();
        }
        
        // Spawn particle effect
        this.game.spawnParticle(fossil.x, fossil.y, '#f4d03f');
    }
    
    collectFossil(fossilId, clicked = false) {
        const fossilIndex = this.game.fossilsOnGround.findIndex(f => f.id === fossilId);
        if (fossilIndex === -1) return false;
        
        const fossil = this.game.fossilsOnGround[fossilIndex];
        
        // Add to player resources
        GAME_DATA.player.fossils += fossil.value;
        GAME_DATA.player.fossilsLifetime += fossil.value;
        GAME_DATA.player.fossilsAllTime += fossil.value;
        
        // Update statistics
        if (clicked) {
            GAME_DATA.player.statistics.fossilsClicked++;
            if (fossil.value > GAME_DATA.player.statistics.largestFossil) {
                GAME_DATA.player.statistics.largestFossil = fossil.value;
            }
        }
        
        // Remove fossil
        this.game.fossilsOnGround.splice(fossilIndex, 1);
        
        // Spawn collection particle
        this.game.spawnParticle(fossil.x, fossil.y, '#27ae60');
        
        // Check achievements
        this.game.achievementSystem.checkAchievement('first_fossil');
        this.game.achievementSystem.checkAchievement('fossil_millionaire');
        this.game.achievementSystem.checkAchievement('speed_demon');
        
        return true;
    }
    
    collectAllFossils() {
        let totalValue = 0;
        const fossilCount = this.game.fossilsOnGround.length;
        
        for (const fossil of this.game.fossilsOnGround) {
            totalValue += fossil.value;
        }
        
        if (totalValue > 0) {
            GAME_DATA.player.fossils += totalValue;
            GAME_DATA.player.fossilsLifetime += totalValue;
            GAME_DATA.player.fossilsAllTime += totalValue;
            
            this.game.fossilsOnGround = [];
            
            this.game.ui.showNotification(
                `Collected ${fossilCount} fossils worth ${this.game.ui.formatNumber(totalValue)}!`, 
                'success'
            );
        }
    }
    
    autoCollectFossils() {
        const oldFossils = this.game.fossilsOnGround.filter(fossil => 
            fossil.age > GAME_CONFIG.FOSSIL_AUTO_COLLECT_TIME
        );
        
        if (oldFossils.length > 0) {
            let totalValue = 0;
            for (const fossil of oldFossils) {
                totalValue += fossil.value;
            }
            
            GAME_DATA.player.fossils += totalValue;
            GAME_DATA.player.fossilsLifetime += totalValue;
            GAME_DATA.player.fossilsAllTime += totalValue;
            
            this.game.fossilsOnGround = this.game.fossilsOnGround.filter(fossil => 
                fossil.age <= GAME_CONFIG.FOSSIL_AUTO_COLLECT_TIME
            );
        }
    }
    
    ageFossils(deltaTime) {
        for (const fossil of this.game.fossilsOnGround) {
            fossil.age += deltaTime;
        }
    }
}

// Skeleton System - Handles skeleton piece discovery and completion
class SkeletonSystem {
    constructor(game) {
        this.game = game;
        this.completionAnimations = [];
    }
    
    update(deltaTime) {
        // Update completion animations
        this.completionAnimations = this.completionAnimations.filter(anim => {
            anim.life -= deltaTime;
            return anim.life > 0;
        });
    }
    
    dropSkeletonPiece() {
        const availableSkeletons = this.getAvailableSkeletons();
        if (availableSkeletons.length === 0) return;
        
        const selectedSkeleton = this.selectWeightedSkeleton(availableSkeletons);
        const skeletonData = SKELETON_DATA[selectedSkeleton];
        const currentPieces = GAME_DATA.player.skeletonPieces[selectedSkeleton] || [];
        const missingPieces = skeletonData.pieces.filter(piece => !currentPieces.includes(piece));
        
        if (missingPieces.length > 0) {
            const selectedPiece = missingPieces[Math.floor(Math.random() * missingPieces.length)];
            this.addSkeletonPiece(selectedSkeleton, selectedPiece);
        }
    }
    
    addSkeletonPiece(skeletonType, piece) {
        if (!GAME_DATA.player.skeletonPieces[skeletonType]) {
            GAME_DATA.player.skeletonPieces[skeletonType] = [];
        }
        
        if (!GAME_DATA.player.skeletonPieces[skeletonType].includes(piece)) {
            GAME_DATA.player.skeletonPieces[skeletonType].push(piece);
            
            const skeletonData = SKELETON_DATA[skeletonType];
            const currentCount = GAME_DATA.player.skeletonPieces[skeletonType].length;
            const totalCount = skeletonData.pieces.length;
            
            this.game.ui.showNotification(
                `Found ${piece.replace(/_/g, ' ')} of ${skeletonData.name}! (${currentCount}/${totalCount})`,
                'success'
            );
            
            // Check for completion
            if (currentCount === totalCount) {
                this.completeSkeleton(skeletonType);
            }
        }
    }
    
    completeSkeleton(skeletonType) {
        if (!GAME_DATA.player.completedSkeletons.includes(skeletonType)) {
            GAME_DATA.player.completedSkeletons.push(skeletonType);
            
            const skeletonData = SKELETON_DATA[skeletonType];
            const completionTime = Date.now();
            
            // Track fastest completion
            if (GAME_DATA.player.statistics.fastestSkeleton === 0 || 
                completionTime - GAME_DATA.player.startTime < GAME_DATA.player.statistics.fastestSkeleton) {
                GAME_DATA.player.statistics.fastestSkeleton = completionTime - GAME_DATA.player.startTime;
            }
            
            // Add to museum catalog
            GAME_DATA.player.museumCatalog[`skeleton_${skeletonType}`] = {
                name: skeletonData.name,
                completedAt: completionTime,
                expeditionsWhenCompleted: GAME_DATA.player.expeditions
            };
            
            // Show completion notification
            this.game.ui.showNotification(
                `🎉 ${skeletonData.name} skeleton completed! ${skeletonData.completionBonus.description}`,
                'success'
            );
            
            // Add completion animation
            this.completionAnimations.push({
                skeletonType: skeletonType,
                life: 3000,
                maxLife: 3000
            });
            
            // Check achievements
            this.game.achievementSystem.checkAchievement('first_skeleton');
            this.game.achievementSystem.checkAchievement('master_collector');
            
            // Apply skeleton bonus immediately
            this.game.upgradeSystem.applyAllUpgrades();
        }
    }
    
    getAvailableSkeletons() {
        const currentDigsite = DIGSITE_DATA[GAME_DATA.player.currentDigsite];
        return currentDigsite.availableSkeletons.filter(skeletonId => {
            const skeletonData = SKELETON_DATA[skeletonId];
            return this.meetsUnlockRequirement(skeletonData.unlockRequirement);
        });
    }
    
    selectWeightedSkeleton(availableSkeletons) {
        // Weight incomplete skeletons higher
        const weights = availableSkeletons.map(skeletonId => {
            const isComplete = GAME_DATA.player.completedSkeletons.includes(skeletonId);
            const rarity = SKELETON_DATA[skeletonId].rarity;
            
            let weight = isComplete ? 1 : 5; // Favor incomplete skeletons
            
            // Adjust for rarity
            switch (rarity) {
                case 'common': weight *= 1.0; break;
                case 'uncommon': weight *= 0.7; break;
                case 'rare': weight *= 0.4; break;
                case 'legendary': weight *= 0.1; break;
                default: weight *= 1.0;
            }
            
            return weight;
        });
        
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < availableSkeletons.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return availableSkeletons[i];
            }
        }
        
        return availableSkeletons[0];
    }
    
    meetsUnlockRequirement(requirement) {
        if (!requirement) return true;
        
        if (requirement.expeditions !== undefined && GAME_DATA.player.expeditions < requirement.expeditions) {
            return false;
        }
        
        if (requirement.paleontologists !== undefined && GAME_DATA.player.paleontologists < requirement.paleontologists) {
            return false;
        }
        
        return true;
    }
    
    getSkeletonProgress(skeletonType) {
        const skeletonData = SKELETON_DATA[skeletonType];
        const currentPieces = GAME_DATA.player.skeletonPieces[skeletonType] || [];
        
        return {
            current: currentPieces.length,
            total: skeletonData.pieces.length,
            pieces: currentPieces,
            missing: skeletonData.pieces.filter(piece => !currentPieces.includes(piece)),
            percentage: (currentPieces.length / skeletonData.pieces.length) * 100
        };
    }
}

// Expedition System - Handles rebirth mechanics
class ExpeditionSystem {
    constructor(game) {
        this.game = game;
    }
    
    update(deltaTime) {
        // No continuous updates needed
    }
    
    canStartExpedition() {
        return GAME_DATA.player.completedSkeletons.includes('velociraptor');
    }
    
    calculateExpeditionPoints() {
        let basePoints = Math.max(1, Math.floor(Math.log10(GAME_DATA.player.fossilsLifetime + 1)));
        let bonusPoints = GAME_DATA.player.completedSkeletons.length;
        
        // Apply skeleton bonuses
        for (const skeletonId of GAME_DATA.player.completedSkeletons) {
            const skeleton = SKELETON_DATA[skeletonId];
            if (skeleton.completionBonus.type === 'expedition_points') {
                bonusPoints = Math.floor(bonusPoints * skeleton.completionBonus.value);
            }
        }
        
        return Math.max(1, basePoints + bonusPoints);
    }
    
    startExpedition() {
        if (!this.canStartExpedition()) {
            this.game.ui.showNotification('Complete the Velociraptor skeleton first!', 'warning');
            return false;
        }
        
        const pointsEarned = this.calculateExpeditionPoints();
        const newFeatures = this.getNewFeatures();
        
        // Award expedition points
        GAME_DATA.player.expeditionPoints += pointsEarned;
        GAME_DATA.player.expeditions++;
        
        // Update multiplier
        this.updateExpeditionMultiplier();
        
        // Reset current run progress
        this.resetCurrentRun();
        
        // Show results
        let message = `Expedition complete! Earned ${pointsEarned} expedition points.`;
        if (newFeatures.length > 0) {
            message += ` Unlocked: ${newFeatures.join(', ')}`;
        }
        
        this.game.ui.showNotification(message, 'success');
        this.game.achievementSystem.checkAchievement('first_expedition');
        
        return true;
    }
    
    updateExpeditionMultiplier() {
        GAME_DATA.player.expeditionMultiplier = Math.pow(1.1, GAME_DATA.player.expeditions);
    }
    
    resetCurrentRun() {
        // Save persistent data
        const persistentData = {
            expeditions: GAME_DATA.player.expeditions,
            expeditionPoints: GAME_DATA.player.expeditionPoints,
            expeditionMultiplier: GAME_DATA.player.expeditionMultiplier,
            completedSkeletons: [...GAME_DATA.player.completedSkeletons],
            upgrades: { ...GAME_DATA.player.upgrades },
            fossilsAllTime: GAME_DATA.player.fossilsAllTime,
            ascensions: GAME_DATA.player.ascensions,
            paleontologists: GAME_DATA.player.paleontologists,
            museumCatalog: { ...GAME_DATA.player.museumCatalog },
            achievements: [...GAME_DATA.player.achievements],
            statistics: { ...GAME_DATA.player.statistics },
            unlockedDigsites: [...GAME_DATA.player.unlockedDigsites]
        };
        
        // Reset run-specific data
        GAME_DATA.player.fossils = 0;
        GAME_DATA.player.fossilsLifetime = 0;
        GAME_DATA.player.digSpeed = 1;
        GAME_DATA.player.fossilQuality = 1;
        GAME_DATA.player.fossilCapacity = 10;
        GAME_DATA.player.currentDigsite = 'prehistoric_valley';
        GAME_DATA.player.skeletonPieces = {};
        
        // Restore persistent data
        Object.assign(GAME_DATA.player, persistentData);
        
        // Clear fossils on ground
        this.game.fossilsOnGround = [];
        
        // Reapply upgrades
        this.game.upgradeSystem.applyAllUpgrades();
    }
    
    getNewFeatures() {
        const features = [];
        const expeditionCount = GAME_DATA.player.expeditions;
        
        // Check for new digsite unlocks
        for (const [digsiteId, digsiteData] of Object.entries(DIGSITE_DATA)) {
            if (!GAME_DATA.player.unlockedDigsites.includes(digsiteId)) {
                if (this.game.skeletonSystem.meetsUnlockRequirement(digsiteData.unlockRequirement)) {
                    GAME_DATA.player.unlockedDigsites.push(digsiteId);
                    features.push(digsiteData.name);
                }
            }
        }
        
        return features;
    }
}

// Upgrade System - Handles all upgrade purchases and effects
class UpgradeSystem {
    constructor(game) {
        this.game = game;
    }
    
    buyUpgrade(category, upgradeId) {
        const upgradeData = UPGRADE_DATA[category][upgradeId];
        const upgradeKey = `${category}${upgradeId.charAt(0).toUpperCase() + upgradeId.slice(1)}`;
        const currentLevel = GAME_DATA.player.upgrades[upgradeKey] || 0;
        
        if (currentLevel >= upgradeData.maxLevel) {
            this.game.ui.showNotification('Upgrade maxed out!', 'warning');
            return false;
        }
        
        const cost = this.getUpgradeCost(upgradeData, currentLevel);
        
        // Check currency and deduct cost
        let canAfford = false;
        if (category === 'basic' && GAME_DATA.player.fossils >= cost) {
            GAME_DATA.player.fossils -= cost;
            canAfford = true;
        } else if (category === 'expedition' && GAME_DATA.player.expeditionPoints >= cost) {
            GAME_DATA.player.expeditionPoints -= cost;
            canAfford = true;
        } else if (category === 'paleontologist' && GAME_DATA.player.paleontologists >= cost) {
            GAME_DATA.player.paleontologists -= cost;
            canAfford = true;
        }
        
        if (canAfford) {
            GAME_DATA.player.upgrades[upgradeKey] = currentLevel + 1;
            this.applyUpgrade(category, upgradeId);
            
            this.game.ui.showNotification(
                `${upgradeData.name} upgraded to level ${currentLevel + 1}!`,
                'success'
            );
            
            return true;
        } else {
            this.game.ui.showNotification('Not enough currency!', 'warning');
            return false;
        }
    }
    
    getUpgradeCost(upgradeData, level) {
        return Math.floor(upgradeData.baseCost * Math.pow(upgradeData.costMultiplier, level));
    }
    
    getUpgradeEffect(category, upgradeId, level) {
        if (level <= 0) return category === 'basic' && upgradeId === 'capacity' ? 0 : 1;
        
        const upgradeData = UPGRADE_DATA[category][upgradeId];
        return upgradeData.effect(level);
    }
    
    applyUpgrade(category, upgradeId) {
        const upgradeKey = `${category}${upgradeId.charAt(0).toUpperCase() + upgradeId.slice(1)}`;
        const level = GAME_DATA.player.upgrades[upgradeKey];
        
        switch (upgradeId) {
            case 'digSpeed':
                GAME_DATA.player.digSpeed = this.getUpgradeEffect(category, upgradeId, level);
                break;
            case 'fossilQuality':
                GAME_DATA.player.fossilQuality = this.getUpgradeEffect(category, upgradeId, level);
                break;
            case 'capacity':
                GAME_DATA.player.fossilCapacity = 10 + this.getUpgradeEffect(category, upgradeId, level);
                break;
        }
    }
    
    applyAllUpgrades() {
        // Apply all basic upgrades
        for (const upgradeId of Object.keys(UPGRADE_DATA.basic)) {
            this.applyUpgrade('basic', upgradeId);
        }
        
        // Apply skeleton bonuses
        this.applySkeletonBonuses();
    }
    
    applySkeletonBonuses() {
        for (const skeletonId of GAME_DATA.player.completedSkeletons) {
            const skeleton = SKELETON_DATA[skeletonId];
            const bonus = skeleton.completionBonus;
            
            switch (bonus.type) {
                case 'fossil_value':
                    GAME_DATA.player.fossilQuality *= bonus.value;
                    break;
                case 'dig_speed':
                    GAME_DATA.player.digSpeed *= bonus.value;
                    break;
                case 'fossil_capacity':
                    GAME_DATA.player.fossilCapacity = Math.floor(GAME_DATA.player.fossilCapacity * bonus.value);
                    break;
            }
        }
    }
    
    getTotalFossilMultiplier() {
        let multiplier = 1;
        
        // Expedition upgrades
        multiplier *= this.getUpgradeEffect('expedition', 'multiplier', GAME_DATA.player.upgrades.expeditionMultiplier);
        
        // Paleontologist upgrades
        multiplier *= this.getUpgradeEffect('paleontologist', 'fossilBoost', GAME_DATA.player.upgrades.paleontologistFossilBoost);
        
        // Achievement bonuses
        for (const achievementId of GAME_DATA.player.achievements) {
            const achievement = ACHIEVEMENT_DATA[achievementId];
            if (achievement.reward.type === 'fossil_multiplier') {
                multiplier *= achievement.reward.value;
            }
        }
        
        return multiplier;
    }
}

// Achievement System - Handles achievement checking and rewards
class AchievementSystem {
    constructor(game) {
        this.game = game;
        this.checkTimer = 0;
    }
    
    update(deltaTime) {
        this.checkTimer += deltaTime;
        if (this.checkTimer >= 5000) { // Check every 5 seconds
            this.checkAllAchievements();
            this.checkTimer = 0;
        }
    }
    
    checkAllAchievements() {
        for (const [achievementId, achievementData] of Object.entries(ACHIEVEMENT_DATA)) {
            this.checkAchievement(achievementId);
        }
    }
    
    checkAchievement(achievementId) {
        if (GAME_DATA.player.achievements.includes(achievementId)) {
            return; // Already unlocked
        }
        
        const achievement = ACHIEVEMENT_DATA[achievementId];
        if (achievement.condition()) {
            this.unlockAchievement(achievementId);
        }
    }
    
    unlockAchievement(achievementId) {
        const achievement = ACHIEVEMENT_DATA[achievementId];
        GAME_DATA.player.achievements.push(achievementId);
        
        // Apply reward
        if (achievement.reward.type !== 'none') {
            this.applyAchievementReward(achievement.reward);
        }
        
        // Show notification
        this.game.ui.showNotification(
            `🏆 Achievement Unlocked: ${achievement.name}!`,
            'success'
        );
        
        // Add to statistics
        GAME_DATA.player.statistics.achievementsUnlocked = GAME_DATA.player.achievements.length;
    }
    
    applyAchievementReward(reward) {
        switch (reward.type) {
            case 'fossil_bonus':
                GAME_DATA.player.fossilQuality *= reward.value;
                break;
            case 'expedition_points':
                GAME_DATA.player.expeditionPoints += reward.value;
                break;
            case 'skeleton_chance':
                // Applied in calculation method
                break;
            case 'dig_speed':
                GAME_DATA.player.digSpeed *= reward.value;
                break;
        }
    }
}

// UI System - Handles all user interface updates and interactions
class UISystem {
    constructor(game) {
        this.game = game;
        this.currentModal = null;
        this.updateTimer = 0;
        this.formatNumberCache = new Map();
    }
    
    init() {
        this.bindEventListeners();
        this.initializeModals();
        this.update();
    }
    
    update(alpha = 1) {
        this.updateTimer += 16; // Assume ~16ms per frame
        
        if (this.updateTimer >= 100) { // Update UI every 100ms
            this.updateResourceDisplay();
            this.updateDigsiteView();
            this.updateUpgradePanels();
            this.updateSkeletonPanel();
            this.updateExpeditionPanel();
            this.updateActionButtons();
            
            this.updateTimer = 0;
        }
        
        // Always update fossils for smooth animation
        this.renderFossils();
        this.renderParticles();
    }
    
    updateResourceDisplay() {
        document.getElementById('fossil-count').textContent = this.formatNumber(GAME_DATA.player.fossils);
        document.getElementById('expedition-points').textContent = this.formatNumber(GAME_DATA.player.expeditionPoints);
        document.getElementById('paleontologist-count').textContent = this.formatNumber(GAME_DATA.player.paleontologists);
        document.getElementById('multiplier-display').textContent = this.formatMultiplier(this.game.calculateFossilValue() / GAME_CONFIG.FOSSIL_BASE_VALUE);
    }
    
    updateDigsiteView() {
        const currentDigsite = DIGSITE_DATA[GAME_DATA.player.currentDigsite];
        
        document.getElementById('digsite-name').textContent = currentDigsite.name;
        document.getElementById('digsite-multiplier').textContent = this.formatMultiplier(this.game.getDigsiteMultiplier());
        document.getElementById('fossil-capacity').textContent = GAME_DATA.player.fossilCapacity;
        document.getElementById('dig-speed-display').textContent = this.formatMultiplier(this.game.calculateDigSpeed());
        document.getElementById('digsite-desc-text').textContent = currentDigsite.description;
        
        // Update digsite background
        const digsiteView = document.getElementById('digsite-view');
        if (digsiteView.style.background !== currentDigsite.backgroundColor) {
            digsiteView.style.background = currentDigsite.backgroundColor;
        }
    }
    
    renderFossils() {
        const fossilContainer = document.getElementById('fossil-container');
        
        // Clear existing fossils
        fossilContainer.innerHTML = '';
        
        // Render current fossils
        for (const fossil of this.game.fossilsOnGround) {
            const fossilElement = document.createElement('div');
            fossilElement.className = 'fossil';
            fossilElement.style.left = fossil.x + 'px';
            fossilElement.style.top = fossil.y + 'px';
            fossilElement.innerHTML = `🦴 ${this.formatNumber(fossil.value)}`;
            fossilElement.onclick = () => {
                if (this.game.fossilSystem.collectFossil(fossil.id, true)) {
                    this.game.spawnParticle(fossil.x, fossil.y, '#27ae60');
                }
            };
            
            // Add aging effect
            if (fossil.age > GAME_CONFIG.FOSSIL_AUTO_COLLECT_TIME * 0.5) {
                fossilElement.style.opacity = '0.7';
                fossilElement.style.animation = 'pulseGlow 1s ease-in-out infinite';
            }
            
            fossilContainer.appendChild(fossilElement);
        }
    }
    
    renderParticles() {
        // This would render particle effects in a real implementation
        // For now, we'll skip complex particle rendering
    }
    
    updateUpgradePanels() {
        this.updateUpgradeTab('basic', 'basic-upgrades');
        this.updateUpgradeTab('expedition', 'expedition-upgrades');
        this.updateUpgradeTab('paleontologist', 'paleontologist-upgrades');
    }
    
    updateUpgradeTab(category, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        let html = '';
        
        for (const [upgradeId, upgradeData] of Object.entries(UPGRADE_DATA[category])) {
            const upgradeKey = `${category}${upgradeId.charAt(0).toUpperCase() + upgradeId.slice(1)}`;
            const currentLevel = GAME_DATA.player.upgrades[upgradeKey] || 0;
            const cost = this.game.upgradeSystem.getUpgradeCost(upgradeData, currentLevel);
            const maxLevel = currentLevel >= upgradeData.maxLevel;
            
            let canAfford = false;
            if (category === 'basic') canAfford = GAME_DATA.player.fossils >= cost;
            else if (category === 'expedition') canAfford = GAME_DATA.player.expeditionPoints >= cost;
            else if (category === 'paleontologist') canAfford = GAME_DATA.player.paleontologists >= cost;
            
            html += `
                <div class="upgrade-item">
                    <div class="upgrade-info">
                        <div class="upgrade-name">
                            <span class="upgrade-icon">${upgradeData.icon}</span>
                            ${upgradeData.name}
                        </div>
                        <div class="upgrade-description">${upgradeData.description}</div>
                        <div class="upgrade-level">Level ${currentLevel}/${upgradeData.maxLevel}</div>
                    </div>
                    <button class="upgrade-button" 
                            ${(!canAfford || maxLevel) ? 'disabled' : ''}
                            onclick="game.upgradeSystem.buyUpgrade('${category}', '${upgradeId}')">
                        ${maxLevel ? 'MAX' : this.formatNumber(cost)}
                    </button>
                </div>
            `;
        }
        
        container.innerHTML = html;
    }
    
    updateSkeletonPanel() {
        const skeletonList = document.getElementById('skeleton-list');
        const availableSkeletons = this.game.skeletonSystem.getAvailableSkeletons();
        
        let html = '';
        
        for (const skeletonId of availableSkeletons) {
            const skeleton = SKELETON_DATA[skeletonId];
            const progress = this.game.skeletonSystem.getSkeletonProgress(skeletonId);
            const isCompleted = GAME_DATA.player.completedSkeletons.includes(skeletonId);
            
            html += `
                <div class="skeleton-item ${isCompleted ? 'completed' : ''}">
                    <div class="skeleton-header">
                        <div class="skeleton-name">
                            <span class="skeleton-icon">${isCompleted ? '🦴' : '❓'}</span>
                            ${skeleton.name}
                        </div>
                        <div class="skeleton-rarity ${skeleton.rarity}">${skeleton.rarity}</div>
                    </div>
                    
                    <div class="skeleton-progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress.percentage}%"></div>
                        </div>
                        <small>${progress.current}/${progress.total} pieces</small>
                    </div>
                    
                    <div class="skeleton-pieces">
                        ${skeleton.pieces.map(piece => `
                            <span class="skeleton-piece ${progress.pieces.includes(piece) ? 'found' : ''}">
                                ${piece.replace(/_/g, ' ')}
                            </span>
                        `).join('')}
                    </div>
                    
                    ${isCompleted ? `
                        <div class="skeleton-bonus">
                            Bonus: ${skeleton.completionBonus.description}
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        skeletonList.innerHTML = html;
        
        // Update panel stats
        document.getElementById('completed-skeletons').textContent = GAME_DATA.player.completedSkeletons.length;
        document.getElementById('skeleton-drop-rate').textContent = (this.game.calculateSkeletonPieceChance() * 100).toFixed(3) + '%';
    }
    
    updateExpeditionPanel() {
        document.getElementById('expedition-count').textContent = GAME_DATA.player.expeditions;
        document.getElementById('current-multiplier').textContent = this.formatMultiplier(GAME_DATA.player.expeditionMultiplier);
        document.getElementById('available-points').textContent = this.formatNumber(GAME_DATA.player.expeditionPoints);
        document.getElementById('next-points').textContent = this.formatNumber(this.game.expeditionSystem.calculateExpeditionPoints());
        
        // Update requirements
        const canExpedition = this.game.expeditionSystem.canStartExpedition();
        const reqElement = document.getElementById('velociraptor-req');
        if (reqElement) {
            reqElement.className = `requirement ${canExpedition ? 'completed' : ''}`;
            reqElement.innerHTML = `
                <span class="req-icon">${canExpedition ? '✅' : '❌'}</span>
                <span class="req-text">Complete Velociraptor skeleton</span>
            `;
        }
        
        // Show/hide expedition preview
        const previewElement = document.getElementById('expedition-preview');
        if (canExpedition && previewElement) {
            previewElement.style.display = 'block';
            document.getElementById('preview-points').textContent = this.formatNumber(this.game.expeditionSystem.calculateExpeditionPoints());
            document.getElementById('preview-multiplier').textContent = this.formatMultiplier(Math.pow(1.1, GAME_DATA.player.expeditions + 1));
        } else if (previewElement) {
            previewElement.style.display = 'none';
        }
        
        // Show ascension panel if conditions met
        if (GAME_DATA.player.fossilsAllTime >= GAME_CONFIG.ASCENSION_THRESHOLD) {
            const ascensionPanel = document.getElementById('ascension-panel');
            if (ascensionPanel) {
                ascensionPanel.style.display = 'block';
                this.updateAscensionPanel();
            }
        }
    }
    
    updateAscensionPanel() {
        document.getElementById('ascension-count').textContent = GAME_DATA.player.ascensions;
        document.getElementById('lifetime-fossils').textContent = this.formatNumber(GAME_DATA.player.fossilsAllTime);
        document.getElementById('ascension-requirement').textContent = this.formatNumber(GAME_CONFIG.ASCENSION_THRESHOLD);
        
        const progress = Math.min(GAME_DATA.player.fossilsAllTime / GAME_CONFIG.ASCENSION_THRESHOLD * 100, 100);
        document.getElementById('ascension-progress-fill').style.width = progress + '%';
        
        const paleontologistsGained = this.calculatePaleontologistsGained();
        document.getElementById('paleontologists-gained').textContent = this.formatNumber(paleontologistsGained);
        document.getElementById('total-paleontologists').textContent = this.formatNumber(GAME_DATA.player.paleontologists + paleontologistsGained);
        document.getElementById('passive-bonus').textContent = '+' + ((GAME_DATA.player.paleontologists + paleontologistsGained) * 1).toFixed(1) + '%';
    }
    
    calculatePaleontologistsGained() {
        if (GAME_DATA.player.fossilsAllTime < GAME_CONFIG.ASCENSION_THRESHOLD) return 0;
        return Math.floor(Math.log10(GAME_DATA.player.fossilsAllTime / GAME_CONFIG.ASCENSION_THRESHOLD) + 1);
    }
    
    updateActionButtons() {
        const expeditionBtn = document.getElementById('expedition-btn');
        const ascendBtn = document.getElementById('ascend-btn');
        
        if (expeditionBtn) {
            expeditionBtn.disabled = !this.game.expeditionSystem.canStartExpedition();
        }
        
        if (ascendBtn) {
            const canAscend = GAME_DATA.player.fossilsAllTime >= GAME_CONFIG.ASCENSION_THRESHOLD;
            ascendBtn.disabled = !canAscend;
            ascendBtn.style.display = canAscend ? 'flex' : 'none';
        }
    }
    
    bindEventListeners() {
        // Main action buttons
        document.getElementById('collect-all-btn').onclick = () => {
            this.game.fossilSystem.collectAllFossils();
        };
        
        document.getElementById('museum-btn').onclick = () => {
            this.showMuseumModal();
        };
        
        document.getElementById('expedition-btn').onclick = () => {
            this.showExpeditionConfirmation();
        };
        
        document.getElementById('ascend-btn').onclick = () => {
            this.showAscensionConfirmation();
        };
        
        document.getElementById('settings-btn').onclick = () => {
            this.showSettingsModal();
        };
        
        // Tab switching
        document.querySelectorAll('.tab-button').forEach(button => {
            button.onclick = () => {
                const tabName = button.dataset.tab;
                this.switchTab(button.parentElement.parentElement, tabName);
            };
        });
        
        // Modal close
        document.getElementById('modal-close').onclick = () => {
            this.closeModal();
        };
        
        document.getElementById('modal-overlay').onclick = (e) => {
            if (e.target.id === 'modal-overlay') {
                this.closeModal();
            }
        };
    }
    
    switchTab(container, tabName) {
        // Hide all tab contents
        container.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Remove active from all tab buttons
        container.querySelectorAll('.tab-button').forEach(button => {
            button.classList.remove('active');
        });
        
        // Show selected tab
        const targetTab = container.querySelector(`#${tabName}-tab`);
        const targetButton = container.querySelector(`[data-tab="${tabName}"]`);
        
        if (targetTab) targetTab.classList.add('active');
        if (targetButton) targetButton.classList.add('active');
    }
    
    showMuseumModal() {
        const template = document.getElementById('museum-template');
        this.showModal('🏛️ Museum of Natural History', template.innerHTML);
        this.updateMuseumContent();
    }
    
    updateMuseumContent() {
        // Update museum statistics
        const stats = this.calculateMuseumStats();
        document.getElementById('museum-digsites').textContent = stats.digsitesExplored;
        document.getElementById('museum-skeletons').textContent = stats.skeletonsCompleted;
        document.getElementById('museum-fossils').textContent = this.formatNumber(stats.totalFossils);
        document.getElementById('museum-value').textContent = this.formatNumber(stats.totalValue);
        
        // Bind museum tabs
        document.querySelectorAll('.museum-tab-button').forEach(button => {
            button.onclick = () => {
                const tabName = button.dataset.museumTab;
                this.switchMuseumTab(tabName);
            };
        });
        
        // Initialize skeleton gallery
        this.updateSkeletonGallery();
    }
    
    switchMuseumTab(tabName) {
        document.querySelectorAll('.museum-tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.museum-tab-content').forEach(content => content.classList.remove('active'));
        
        document.querySelector(`[data-museum-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`museum-${tabName}`).classList.add('active');
        
        // Update content for selected tab
        switch (tabName) {
            case 'skeletons':
                this.updateSkeletonGallery();
                break;
            case 'digsites':
                this.updateDigsiteGallery();
                break;
            case 'achievements':
                this.updateAchievementList();
                break;
            case 'statistics':
                this.updateStatisticsGrid();
                break;
        }
    }
    
    updateSkeletonGallery() {
        const gallery = document.getElementById('skeleton-gallery');
        let html = '';
        
        for (const [skeletonId, skeleton] of Object.entries(SKELETON_DATA)) {
            const isCompleted = GAME_DATA.player.completedSkeletons.includes(skeletonId);
            const progress = this.game.skeletonSystem.getSkeletonProgress(skeletonId);
            const isAvailable = this.game.skeletonSystem.getAvailableSkeletons().includes(skeletonId);
            
            if (!isAvailable && !isCompleted) continue;
            
            html += `
                <div class="skeleton-exhibit ${isCompleted ? 'completed' : ''}">
                    <div class="skeleton-image">
                        ${isCompleted ? '🦴' : '❓'}
                    </div>
                    <div class="exhibit-info">
                        <h4>${skeleton.name}</h4>
                        <p>${skeleton.description}</p>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress.percentage}%"></div>
                        </div>
                        <small>${progress.current}/${progress.total} pieces</small>
                        ${isCompleted ? `
                            <div class="completion-bonus">
                                ${skeleton.completionBonus.description}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }
        
        gallery.innerHTML = html;
    }
    
    updateDigsiteGallery() {
        const gallery = document.getElementById('digsite-gallery');
        let html = '';
        
        for (const [digsiteId, digsite] of Object.entries(DIGSITE_DATA)) {
            const isUnlocked = GAME_DATA.player.unlockedDigsites.includes(digsiteId);
            const isCurrent = GAME_DATA.player.currentDigsite === digsiteId;
            
            if (!isUnlocked) continue;
            
            html += `
                <div class="digsite-exhibit ${isCurrent ? 'current' : ''}">
                    <div class="digsite-image">🗺️</div>
                    <div class="exhibit-info">
                        <h4>${digsite.name}</h4>
                        <p>${digsite.description}</p>
                        <p>Multiplier: ${digsite.fossilMultiplier}x</p>
                        ${!isCurrent ? `
                            <button class="switch-digsite-btn" onclick="game.switchDigsite('${digsiteId}')">
                                Switch Here
                            </button>
                        ` : '<p><strong>Current Location</strong></p>'}
                    </div>
                </div>
            `;
        }
        
        gallery.innerHTML = html;
    }
    
    updateAchievementList() {
        const list = document.getElementById('achievement-list');
        let html = '';
        
        for (const [achievementId, achievement] of Object.entries(ACHIEVEMENT_DATA)) {
            const isCompleted = GAME_DATA.player.achievements.includes(achievementId);
            
            html += `
                <div class="achievement ${isCompleted ? 'completed' : ''}">
                    <div class="achievement-icon">${achievement.icon}</div>
                    <div class="achievement-info">
                        <h4>${achievement.name}</h4>
                        <p>${achievement.description}</p>
                    </div>
                    <div class="achievement-status">${isCompleted ? '✓' : '🔒'}</div>
                </div>
            `;
        }
        
        list.innerHTML = html;
    }
    
    updateStatisticsGrid() {
        const grid = document.getElementById('statistics-grid');
        const stats = GAME_DATA.player.statistics;
        
        const statisticsData = [
            { label: 'Total Play Time', value: this.formatTime(stats.totalPlayTime * 1000) },
            { label: 'Sessions Played', value: this.formatNumber(stats.sessionsPlayed) },
            { label: 'Fossils Clicked', value: this.formatNumber(stats.fossilsClicked) },
            { label: 'Largest Fossil', value: this.formatNumber(stats.largestFossil) },
            { label: 'Achievements Unlocked', value: `${GAME_DATA.player.achievements.length}/${Object.keys(ACHIEVEMENT_DATA).length}` },
            { label: 'Skeletons Completed', value: `${GAME_DATA.player.completedSkeletons.length}/${Object.keys(SKELETON_DATA).length}` },
            { label: 'Expeditions Completed', value: this.formatNumber(GAME_DATA.player.expeditions) },
            { label: 'Ascensions', value: this.formatNumber(GAME_DATA.player.ascensions) }
        ];
        
        let html = '';
        for (const stat of statisticsData) {
            html += `
                <div class="statistic-item">
                    <div class="stat-label">${stat.label}</div>
                    <div class="stat-value">${stat.value}</div>
                </div>
            `;
        }
        
        grid.innerHTML = html;
    }
    
    calculateMuseumStats() {
        return {
            digsitesExplored: GAME_DATA.player.unlockedDigsites.length,
            skeletonsCompleted: GAME_DATA.player.completedSkeletons.length,
            totalFossils: GAME_DATA.player.statistics.fossilsClicked,
            totalValue: GAME_DATA.player.fossilsAllTime
        };
    }
    
    showExpeditionConfirmation() {
        if (!this.game.expeditionSystem.canStartExpedition()) {
            this.showNotification('Complete the Velociraptor skeleton first!', 'warning');
            return;
        }
        
        const pointsEarned = this.game.expeditionSystem.calculateExpeditionPoints();
        const newMultiplier = Math.pow(1.1, GAME_DATA.player.expeditions + 1);
        
        const content = `
            <div class="expedition-confirmation">
                <h3>Start New Expedition?</h3>
                <p>This will reset your current progress but grant permanent bonuses!</p>
                
                <div class="expedition-rewards">
                    <div class="reward-item">
                        <strong>Expedition Points:</strong> +${this.formatNumber(pointsEarned)}
                    </div>
                    <div class="reward-item">
                        <strong>New Multiplier:</strong> ${this.formatMultiplier(newMultiplier)}
                    </div>
                </div>
                
                <div class="warning">
                    ⚠️ You will lose: Current fossils, skeleton pieces, and dig site progress
                </div>
                <div class="success">
                    ✅ You will keep: Completed skeletons, upgrades, and expedition progress
                </div>
            </div>
        `;
        
        this.showModal('🗺️ New Expedition', content, `
            <button class="modal-button secondary" onclick="game.ui.closeModal()">Cancel</button>
            <button class="modal-button primary" onclick="game.expeditionSystem.startExpedition(); game.ui.closeModal();">
                Start Expedition
            </button>
        `);
    }
    
    showAscensionConfirmation() {
        const paleontologistsGained = this.calculatePaleontologistsGained();
        
        const content = `
            <div class="ascension-confirmation">
                <h3>Ascend to Higher Learning?</h3>
                <p>This will reset ALL progress but grant powerful paleontologists!</p>
                
                <div class="ascension-rewards">
                    <div class="reward-item">
                        <strong>Paleontologists Gained:</strong> +${this.formatNumber(paleontologistsGained)}
                    </div>
                    <div class="reward-item">
                        <strong>Passive Bonus:</strong> +${(paleontologistsGained * 1).toFixed(1)}% to all gains
                    </div>
                </div>
                
                <div class="warning">
                    ⚠️ You will lose: Everything except paleontologists and achievements
                </div>
            </div>
        `;
        
        this.showModal('🌟 Ascension', content, `
            <button class="modal-button secondary" onclick="game.ui.closeModal()">Cancel</button>
            <button class="modal-button primary" onclick="game.ascend(); game.ui.closeModal();">
                Ascend
            </button>
        `);
    }
    
    showSettingsModal() {
        const template = document.getElementById('settings-template');
        this.showModal('⚙️ Settings', template.innerHTML);
        this.updateSettingsContent();
    }
    
    updateSettingsContent() {
        // Bind setting controls
        document.getElementById('auto-save-toggle').checked = GAME_DATA.player.settings.autoSave;
        document.getElementById('notifications-toggle').checked = GAME_DATA.player.settings.notifications;
        document.getElementById('animations-toggle').checked = GAME_DATA.player.settings.animations;
        document.getElementById('sound-toggle').checked = GAME_DATA.player.settings.soundEffects;
        document.getElementById('number-format').value = GAME_DATA.player.settings.numberFormat;
        document.getElementById('theme-select').value = GAME_DATA.player.settings.theme;
        
        // Bind events
        document.getElementById('auto-save-toggle').onchange = (e) => {
            GAME_DATA.player.settings.autoSave = e.target.checked;
        };
        
        document.getElementById('notifications-toggle').onchange = (e) => {
            GAME_DATA.player.settings.notifications = e.target.checked;
        };
        
        document.getElementById('animations-toggle').onchange = (e) => {
            GAME_DATA.player.settings.animations = e.target.checked;
            document.body.classList.toggle('no-animations', !e.target.checked);
        };
        
        document.getElementById('sound-toggle').onchange = (e) => {
            GAME_DATA.player.settings.soundEffects = e.target.checked;
        };
        
        document.getElementById('number-format').onchange = (e) => {
            GAME_DATA.player.settings.numberFormat = e.target.value;
            this.formatNumberCache.clear();
        };
        
        document.getElementById('theme-select').onchange = (e) => {
            GAME_DATA.player.settings.theme = e.target.value;
            document.body.dataset.theme = e.target.value;
        };
        
        document.getElementById('export-save-btn').onclick = () => {
            this.exportSave();
        };
        
        document.getElementById('import-save-btn').onclick = () => {
            this.importSave();
        };
        
        document.getElementById('reset-game-btn').onclick = () => {
            this.showResetConfirmation();
        };
    }
    
    showModal(title, content, footer = '') {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-content').innerHTML = content;
        document.getElementById('modal-footer').innerHTML = footer;
        document.getElementById('modal-overlay').classList.remove('hidden');
        this.currentModal = title;
    }
    
    closeModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
        this.currentModal = null;
    }
    
    closeAllModals() {
        this.closeModal();
    }
    
    showNotification(message, type = 'info') {
        if (!GAME_DATA.player.settings.notifications) return;
        
        // Limit notifications
        if (this.game.notifications.length >= GAME_CONFIG.MAX_NOTIFICATIONS) {
            this.game.notifications.shift();
        }
        
        const notification = {
            id: Date.now() + Math.random(),
            message: message,
            type: type,
            life: GAME_CONFIG.NOTIFICATION_DURATION
        };
        
        this.game.notifications.push(notification);
        
        // Create notification element
        const container = document.getElementById('notification-container');
        const element = document.createElement('div');
        element.className = `notification ${type}`;
        element.textContent = message;
        element.dataset.id = notification.id;
        
        container.appendChild(element);
        
        // Auto-remove
        setTimeout(() => {
            const el = container.querySelector(`[data-id="${notification.id}"]`);
            if (el) {
                el.classList.add('fade-out');
                setTimeout(() => {
                    if (el.parentNode) el.parentNode.removeChild(el);
                }, GAME_CONFIG.ANIMATION_DURATION);
            }
        }, GAME_CONFIG.NOTIFICATION_DURATION);
    }
    
    formatNumber(num) {
        if (this.formatNumberCache.has(num)) {
            return this.formatNumberCache.get(num);
        }
        
        let result;
        const format = GAME_DATA.player.settings.numberFormat;
        
        if (num < 1000) {
            result = Math.floor(num).toString();
        } else if (format === 'scientific') {
            result = num.toExponential(2);
        } else if (format === 'full') {
            result = num.toLocaleString();
        } else { // short format
            const tier = Math.log10(num) / 3 | 0;
            if (tier === 0) {
                result = Math.floor(num).toString();
            } else {
                const suffix = GAME_CONFIG.NUMBER_SUFFIXES[tier] || `e${tier * 3}`;
                const scale = Math.pow(10, tier * 3);
                const scaled = num / scale;
                result = scaled.toFixed(scaled < 10 ? 2 : scaled < 100 ? 1 : 0) + suffix;
            }
        }
        
        this.formatNumberCache.set(num, result);
        return result;
    }
    
    formatMultiplier(mult) {
        return mult.toFixed(2) + 'x';
    }
    
    formatTime(ms) {
        const seconds = Math.floor(ms / 1000) % 60;
        const minutes = Math.floor(ms / (1000 * 60)) % 60;
        const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        
        if (days > 0) return `${days}d ${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h ${minutes}m`;
        if (minutes > 0) return `${minutes}m ${seconds}s`;
        return `${seconds}s`;
    }
    
    exportSave() {
        const saveData = this.game.saveSystem.getSaveData();
        const dataStr = JSON.stringify(saveData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `paleontology_save_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('Save exported successfully!', 'success');
    }
    
    importSave() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const saveData = JSON.parse(e.target.result);
                        this.game.saveSystem.loadSaveData(saveData);
                        this.showNotification('Save imported successfully!', 'success');
                        this.closeModal();
                    } catch (err) {
                        this.showNotification('Invalid save file!', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
    
    showResetConfirmation() {
        const content = `
            <div class="reset-confirmation">
                <h3>⚠️ Reset Game</h3>
                <p>This will permanently delete ALL your progress!</p>
                <p>This action cannot be undone.</p>
            </div>
        `;
        
        this.showModal('Reset Game', content, `
            <button class="modal-button secondary" onclick="game.ui.closeModal()">Cancel</button>
            <button class="modal-button danger" onclick="game.resetGame(); game.ui.closeModal();">
                Reset Everything
            </button>
        `);
    }
    
    initializeModals() {
        // Set up modal system
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.closeModal();
            }
        });
    }
}

// Save System - Handles game saving and loading
class SaveSystem {
    constructor(game) {
        this.game = game;
    }
    
    save() {
        if (!GAME_DATA.player.settings.autoSave) return;
        
        try {
            GAME_DATA.player.lastSave = Date.now();
            const saveData = this.getSaveData();
            localStorage.setItem(GAME_CONFIG.SAVE_KEY, JSON.stringify(saveData));
        } catch (error) {
            console.error('Failed to save game:', error);
        }
    }
    
    load() {
        try {
            const saveData = localStorage.getItem(GAME_CONFIG.SAVE_KEY);
            if (saveData) {
                this.loadSaveData(JSON.parse(saveData));
            }
        } catch (error) {
            console.error('Failed to load game:', error);
            this.game.ui.showNotification('Failed to load save file!', 'error');
        }
    }
    
    getSaveData() {
        return {
            version: GAME_CONFIG.VERSION,
            player: { ...GAME_DATA.player },
            saveTime: Date.now()
        };
    }
    
    loadSaveData(saveData) {
        if (saveData.version !== GAME_CONFIG.VERSION) {
            // Handle version migrations here
            console.log('Save file version mismatch, attempting migration...');
        }
        
        Object.assign(GAME_DATA.player, saveData.player);
        this.game.upgradeSystem.applyAllUpgrades();
        this.game.achievementSystem.checkAllAchievements();
    }
    
    deleteSave() {
        localStorage.removeItem(GAME_CONFIG.SAVE_KEY);
    }
}

// Debug System - Development and testing tools
class DebugSystem {
    constructor(game) {
        this.game = game;
        this.isVisible = false;
    }
    
    toggle() {
        this.isVisible = !this.isVisible;
        const panel = document.getElementById('debug-panel');
        panel.classList.toggle('hidden', !this.isVisible);
        
        if (this.isVisible) {
            this.bindDebugEvents();
        }
    }
    
    bindDebugEvents() {
        document.getElementById('debug-close').onclick = () => {
            this.toggle();
        };
    }
    
    addFossils(amount) {
        GAME_DATA.player.fossils += amount;
        GAME_DATA.player.fossilsLifetime += amount;
        GAME_DATA.player.fossilsAllTime += amount;
        this.game.ui.showNotification(`Added ${amount} fossils`, 'success');
    }
    
    addExpeditionPoints(amount) {
        GAME_DATA.player.expeditionPoints += amount;
        this.game.ui.showNotification(`Added ${amount} expedition points`, 'success');
    }
    
    addPaleontologists(amount) {
        GAME_DATA.player.paleontologists += amount;
        this.game.ui.showNotification(`Added ${amount} paleontologists`, 'success');
    }
    
    completeSkeleton(skeletonId) {
        const skeleton = SKELETON_DATA[skeletonId];
        if (skeleton) {
            GAME_DATA.player.skeletonPieces[skeletonId] = [...skeleton.pieces];
            this.game.skeletonSystem.completeSkeleton(skeletonId);
        }
    }
    
    triggerSave() {
        this.game.saveSystem.save();
        this.game.ui.showNotification('Game saved!', 'success');
    }
    
    showGameState() {
        console.log('Current Game State:', GAME_DATA.player);
        this.game.ui.showNotification('Game state logged to console', 'info');
    }
    
    skipTime(ms) {
        GAME_DATA.player.lastSave -= ms;
        this.game.calculateOfflineProgress();
        this.game.ui.showNotification(`Skipped ${ms/1000} seconds`, 'success');
    }
}

// Additional Game Methods
Game.prototype.switchDigsite = function(digsiteId) {
    const digsite = DIGSITE_DATA[digsiteId];
    if (!digsite) return;
    
    if (this.skeletonSystem.meetsUnlockRequirement(digsite.unlockRequirement)) {
        GAME_DATA.player.currentDigsite = digsiteId;
        this.fossilsOnGround = [];
        this.ui.showNotification(`Switched to ${digsite.name}!`, 'success');
        this.ui.closeModal();
    } else {
        this.ui.showNotification('Digsite not yet unlocked!', 'warning');
    }
};

Game.prototype.ascend = function() {
    if (GAME_DATA.player.fossilsAllTime < GAME_CONFIG.ASCENSION_THRESHOLD) {
        this.ui.showNotification('Not enough lifetime fossils for ascension!', 'warning');
        return false;
    }
    
    const paleontologistsGained = this.ui.calculatePaleontologistsGained();
    
    // Award paleontologists
    GAME_DATA.player.paleontologists += paleontologistsGained;
    GAME_DATA.player.ascensions++;
    
    // Reset everything except paleontologists and achievements
    const preservedData = {
        paleontologists: GAME_DATA.player.paleontologists,
        ascensions: GAME_DATA.player.ascensions,
        achievements: [...GAME_DATA.player.achievements],
        statistics: { ...GAME_DATA.player.statistics },
        settings: { ...GAME_DATA.player.settings }
    };
    
    // Full reset
    Object.assign(GAME_DATA.player, {
        fossils: 0,
        fossilsLifetime: 0,
        fossilsAllTime: 0,
        digSpeed: 1,
        fossilQuality: 1,
        fossilCapacity: 10,
        expeditions: 0,
        expeditionPoints: 0,
        expeditionMultiplier: 1,
        currentDigsite: 'prehistoric_valley',
        unlockedDigsites: ['prehistoric_valley'],
        skeletonPieces: {},
        completedSkeletons: [],
        museumCatalog: {},
        upgrades: {
            basicDigSpeed: 0,
            basicFossilQuality: 0,
            basicCapacity: 0,
            basicAutoCollect: 0,
            expeditionMultiplier: 0,
            expeditionSkeletonChance: 0,
            expeditionDigsiteBoost: 0,
            expeditionCapacityBoost: 0,
            paleontologistFossilBoost: 0,
            paleontologistAutoDigger: 0,
            paleontologistSkeletonBoost: 0,
            paleontrologistRelicPower: 0
        }
    });
    
    // Restore preserved data
    Object.assign(GAME_DATA.player, preservedData);
    
    // Clear on-screen elements
    this.fossilsOnGround = [];
    
    // Reapply upgrades
    this.upgradeSystem.applyAllUpgrades();
    
    this.ui.showNotification(`Ascension complete! Gained ${paleontologistsGained} paleontologists!`, 'success');
    this.achievementSystem.checkAchievement('paleontology_phd');
    
    return true;
};

Game.prototype.resetGame = function() {
    // Complete reset
    Object.assign(GAME_DATA.player, {
        fossils: 0,
        fossilsLifetime: 0,
        fossilsAllTime: 0,
        digSpeed: 1,
        fossilQuality: 1,
        fossilCapacity: 10,
        expeditions: 0,
        expeditionPoints: 0,
        expeditionMultiplier: 1,
        ascensions: 0,
        paleontologists: 0,
        currentDigsite: 'prehistoric_valley',
        unlockedDigsites: ['prehistoric_valley'],
        skeletonPieces: {},
        completedSkeletons: [],
        museumCatalog: {},
        achievements: [],
        statistics: {
            fossilsClicked: 0,
            totalPlayTime: 0,
            sessionsPlayed: 0,
            largestFossil: 0,
            fastestSkeleton: 0
        },
        upgrades: {
            basicDigSpeed: 0,
            basicFossilQuality: 0,
            basicCapacity: 0,
            basicAutoCollect: 0,
            expeditionMultiplier: 0,
            expeditionSkeletonChance: 0,
            expeditionDigsiteBoost: 0,
            expeditionCapacityBoost: 0,
            paleontologistFossilBoost: 0,
            paleontologistAutoDigger: 0,
            paleontologistSkeletonBoost: 0,
            paleontrologistRelicPower: 0
        },
        settings: {
            autoSave: true,
            notifications: true,
            animations: true,
            soundEffects: false,
            theme: 'default',
            numberFormat: 'short'
        },
        startTime: Date.now(),
        sessionStart: Date.now(),
        lastSave: Date.now()
    });
    
    this.fossilsOnGround = [];
    this.particles = [];
    this.notifications = [];
    
    this.saveSystem.deleteSave();
    this.ui.showNotification('Game reset complete!', 'success');
};

// ========================================
// GAME INITIALIZATION
// ========================================

// Global game instance
let game;

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    game = new Game();
    game.start();
    
    // Make game available globally for debugging
    window.game = game;
    
    console.log('🦕 Paleontology Incremental Game initialized!');
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (game) {
        if (document.hidden) {
            game.saveSystem.save();
        } else {
            game.calculateOfflineProgress();
        }
    }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (game) {
        game.saveSystem.save();
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Game, GAME_CONFIG, GAME_DATA };
}
