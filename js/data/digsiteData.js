const DIGSITE_DATA = {
    prehistoric_valley: {
        name: "Prehistoric Valley",
        description: "A lush valley where fossils are abundant",
        background: "linear-gradient(145deg, #8b4513, #a0522d)",
        fossilMultiplier: 1,
        unlockRequirement: null,
        availableSkeletons: ['velociraptor'],
        specialFeatures: [],
        discoveryBonus: 0
    },
    
    bone_canyon: {
        name: "Bone Canyon",
        description: "Ancient riverbed rich with specimens",
        background: "linear-gradient(145deg, #cd853f, #daa520)",
        fossilMultiplier: 2.5,
        unlockRequirement: { expeditions: 1 },
        availableSkeletons: ['velociraptor', 'triceratops'],
        specialFeatures: ['increased_skeleton_chance'],
        discoveryBonus: 100
    },
    
    fossil_cliffs: {
        name: "Fossil Cliffs",
        description: "Exposed rock faces reveal ancient secrets",
        background: "linear-gradient(145deg, #696969, #778899)",
        fossilMultiplier: 6,
        unlockRequirement: { expeditions: 3 },
        availableSkeletons: ['velociraptor', 'triceratops', 'stegosaurus'],
        specialFeatures: ['rare_fossil_boost'],
        discoveryBonus: 500
    },
    
    amber_forest: {
        name: "Amber Forest",
        description: "Preserved specimens in golden resin",
        background: "linear-gradient(145deg, #ff8c00, #ffd700)",
        fossilMultiplier: 15,
        unlockRequirement: { expeditions: 10 },
        availableSkeletons: ['velociraptor', 'triceratops', 'stegosaurus', 'allosaurus'],
        specialFeatures: ['perfect_preservation', 'amber_bonuses'],
        discoveryBonus: 2000
    },
    
    dragons_teeth_desert: {
        name: "Dragon's Teeth Desert",
        description: "Harsh badlands hiding apex predators",
        background: "linear-gradient(145deg, #f4a460, #d2691e)",
        fossilMultiplier: 25,
        unlockRequirement: { expeditions: 25 },
        availableSkeletons: ['velociraptor', 'triceratops', 'stegosaurus', 'allosaurus', 'brachiosaurus', 'tyrannosaurus'],
        specialFeatures: ['legendary_finds', 'extreme_conditions'],
        discoveryBonus: 10000
    },
    
    volcanic_caverns: {
        name: "Volcanic Caverns", 
        description: "Deep caves with perfectly preserved giants",
        background: "linear-gradient(145deg, #8b0000, #ff4500)",
        fossilMultiplier: 100,
        unlockRequirement: { expeditions: 50, paleontologists: 3 },
        availableSkeletons: ['giganotosaurus'],
        specialFeatures: ['mythical_discoveries', 'extreme_heat'],
        discoveryBonus: 50000
    }
};

// Digsite special features effects
const DIGSITE_FEATURES = {
    increased_skeleton_chance: {
        name: "Rich Fossil Beds",
        effect: (baseChance) => baseChance * 1.5,
        description: "+50% skeleton piece chance"
    },
    rare_fossil_boost: {
        name: "Exposed Strata", 
        effect: (baseValue) => baseValue * 1.25,
        description: "+25% fossil value"
    },
    perfect_preservation: {
        name: "Amber Preservation",
        effect: (pieces) => pieces.length > 0 ? pieces.concat(['amber_bonus']) : pieces,
        description: "Chance for bonus amber pieces"
    },
    legendary_finds: {
        name: "Ancient Hunting Grounds",
        effect: (rarity) => rarity === 'legendary' ? 2.0 : 1.0,
        description: "2x chance for legendary skeleton pieces"
    },
    mythical_discoveries: {
        name: "Primordial Depths",
        effect: (skeleton) => skeleton === 'giganotosaurus' ? 3.0 : 0.1,
        description: "Exclusive access to mythical specimens"
    }
};
