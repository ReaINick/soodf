const UPGRADE_DATA = {
    // Fossil-purchased upgrades
    basic: {
        digSpeed: {
            name: "Improved Tools",
            description: "Increase fossil spawn rate",
            baseCost: 10,
            costMultiplier: 1.15,
            effect: level => Math.pow(1.2, level),
            maxLevel: 1000,
            icon: "⛏️"
        },
        
        fossilQuality: {
            name: "Expert Training", 
            description: "Increase fossil value",
            baseCost: 25,
            costMultiplier: 1.2,
            effect: level => Math.pow(1.15, level),
            maxLevel: 1000,
            icon: "🎓"
        },
        
        fossilCapacity: {
            name: "Larger Site",
            description: "More fossils can spawn at once", 
            baseCost: 100,
            costMultiplier: 1.25,
            effect: level => Math.floor(10 + level * 2),
            maxLevel: 100,
            icon: "📏"
        },
        
        autoClicker: {
            name: "Automated Collector",
            description: "Automatically collect fossils",
            baseCost: 1000,
            costMultiplier: 2.0,
            effect: level => level * 0.1, // fossils per second
            maxLevel: 50,
            icon: "🤖"
        }
    },
    
    // Expedition point upgrades  
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
            baseCost: 10,
            costMultiplier: 2.5,
            effect: level => level * 0.0001,
            maxLevel: 100, 
            icon: "👁️"
        },
        
        digsiteEfficiency: {
            name: "Survey Mastery",
            description: "Boost digsite multipliers",
            baseCost: 25,
            costMultiplier: 3.0,
            effect: level => 1 + (level * 0.1),
            maxLevel: 25,
            icon: "🗺️"
        }
    },
    
    // Paleontologist upgrades
    paleontologist: {
        fossilBoost: {
            name: "Research Grant", 
            description: "Permanent multiplicative fossil boost",
            baseCost: 10,
            costMultiplier: 10,
            effect: level => Math.pow(2, level),
            maxLevel: 20,
            icon: "💰"
        },
        
        autoDigger: {
            name: "Automated Excavation",
            description: "Continues digging while offline",
            baseCost: 100,
            costMultiplier: 1,
            effect: level => Math.min(level * 0.1, 1),
            maxLevel: 10,
            icon: "⚙️"
        },
        
        relicPower: {
            name: "Ancient Wisdom",
            description: "Increase relic effectiveness", 
            baseCost: 25,
            costMultiplier: 15,
            effect: level => Math.pow(1.25, level),
            maxLevel: 15,
            icon: "📜"
        }
    }
};
