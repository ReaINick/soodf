const SKELETON_DATA = {
    velociraptor: {
        name: "Velociraptor",
        scientificName: "Velociraptor mongoliensis",
        period: "Late Cretaceous",
        pieces: [
            'skull', 'spine', 'ribs', 'left_arm', 'right_arm', 
            'left_leg', 'right_leg', 'tail', 'claws'
        ],
        requiredForFirstExpedition: true,
        completionBonus: {
            type: 'skeleton_chance',
            value: 0.0005,
            description: '+0.05% skeleton piece chance'
        },
        description: "A swift predator from the Late Cretaceous period, smaller than portrayed in movies but incredibly intelligent.",
        facts: [
            "Only about 6.8 feet long",
            "Had a large brain relative to body size",
            "Likely had feathers for display"
        ],
        rarity: 'common',
        expeditionValue: 10
    },
    
    triceratops: {
        name: "Triceratops",
        scientificName: "Triceratops horridus",
        period: "Late Cretaceous",
        pieces: [
            'skull', 'frill', 'horns', 'spine', 'ribs', 
            'left_front_leg', 'right_front_leg', 'left_back_leg', 
            'right_back_leg', 'tail'
        ],
        unlockRequirement: { expeditions: 1 },
        completionBonus: {
            type: 'fossil_value',
            value: 1.5,
            description: '+50% fossil value'
        },
        description: "A heavily armored herbivore with distinctive three-horned face shield.",
        facts: [
            "Weighed up to 12 tons",
            "Frill was likely for display, not protection",
            "One of the last dinosaur species before extinction"
        ],
        rarity: 'uncommon',
        expeditionValue: 25
    },
    
    stegosaurus: {
        name: "Stegosaurus",
        scientificName: "Stegosaurus stenops",
        period: "Late Jurassic",
        pieces: [
            'skull', 'spine', 'plates_front', 'plates_middle', 
            'plates_back', 'ribs', 'left_front_leg', 'right_front_leg',
            'left_back_leg', 'right_back_leg', 'tail', 'tail_spikes'
        ],
        unlockRequirement: { expeditions: 3 },
        completionBonus: {
            type: 'dig_speed',
            value: 2.0,
            description: '+100% fossil spawn rate'
        },
        description: "Famous for its distinctive back plates and tail spikes, this herbivore used its thagomizer for defense.",
        facts: [
            "Brain was only walnut-sized",
            "Plates may have regulated body temperature",
            "Tail spikes are called a 'thagomizer'"
        ],
        rarity: 'uncommon',
        expeditionValue: 40
    },
    
    allosaurus: {
        name: "Allosaurus",
        scientificName: "Allosaurus fragilis",
        period: "Late Jurassic",
        pieces: [
            'skull', 'jaw', 'teeth', 'neck_vertebrae', 'spine_upper', 'spine_middle',
            'spine_lower', 'ribs_left', 'ribs_right', 'left_arm', 'right_arm',
            'left_leg_upper', 'left_leg_lower', 'right_leg_upper', 'right_leg_lower',
            'tail_base', 'tail_middle', 'tail_end', 'claws_hand', 'claws_foot'
        ],
        unlockRequirement: { expeditions: 8 },
        completionBonus: {
            type: 'expedition_points',
            value: 1.3,
            description: '+30% expedition points'
        },
        description: "A powerful predator of the Late Jurassic, known for its distinctive skull ridges.",
        facts: [
            "Up to 32 feet long",
            "Had distinctive horns above its eyes",
            "May have hunted in packs"
        ],
        rarity: 'rare',
        expeditionValue: 75
    },
    
    brachiosaurus: {
        name: "Brachiosaurus",
        scientificName: "Brachiosaurus altithorax",
        period: "Late Jurassic",
        pieces: [
            'skull', 'neck_1', 'neck_2', 'neck_3', 'neck_4', 'neck_5', 'neck_6',
            'spine_upper', 'spine_middle', 'spine_lower', 'ribs_front', 'ribs_middle', 'ribs_back',
            'left_front_leg_upper', 'left_front_leg_lower', 'left_front_foot',
            'right_front_leg_upper', 'right_front_leg_lower', 'right_front_foot',
            'left_back_leg_upper', 'left_back_leg_lower', 'left_back_foot',
            'right_back_leg_upper', 'right_back_leg_lower', 'right_back_foot',
            'tail_base', 'tail_middle', 'tail_end'
        ],
        unlockRequirement: { expeditions: 15 },
        completionBonus: {
            type: 'fossil_capacity',
            value: 2.0,
            description: '+100% fossil capacity'
        },
        description: "A massive sauropod with distinctively long front legs and neck reaching heights of 40+ feet.",
        facts: [
            "Weighed up to 80 tons",
            "Could reach vegetation 30+ feet high",
            "Heart was likely over 400 pounds"
        ],
        rarity: 'rare',
        expeditionValue: 120
    },
    
    tyrannosaurus: {
        name: "Tyrannosaurus Rex",
        scientificName: "Tyrannosaurus rex",
        period: "Late Cretaceous",
        pieces: [
            'skull', 'jaw_upper', 'jaw_lower', 'teeth_set_1', 'teeth_set_2',
            'neck_vertebrae_1', 'neck_vertebrae_2', 'spine_upper', 'spine_middle',
            'spine_lower', 'ribs_left_1', 'ribs_left_2', 'ribs_right_1', 'ribs_right_2',
            'left_arm_upper', 'left_arm_lower', 'left_claws', 'right_arm_upper',
            'right_arm_lower', 'right_claws', 'hip_bone', 'left_leg_upper',
            'left_leg_lower', 'left_foot', 'right_leg_upper', 'right_leg_lower',
            'right_foot', 'tail_base', 'tail_middle', 'tail_end'
        ],
        unlockRequirement: { expeditions: 25 },
        completionBonus: {
            type: 'skeleton_chance',
            value: 0.005,
            description: '+0.5% skeleton piece chance'
        },
        description: "The apex predator of the Late Cretaceous period, one of the largest land predators ever.",
        facts: [
            "Up to 40+ feet long and 12+ feet tall",
            "Bite force of 12,800 pounds per square inch",
            "Had excellent vision and sense of smell"
        ],
        rarity: 'legendary',
        expeditionValue: 200
    },
    
    // Mythical/Special skeletons unlocked very late
    giganotosaurus: {
        name: "Giganotosaurus",
        scientificName: "Giganotosaurus carolinii",
        period: "Middle Cretaceous",
        pieces: [
            'skull_front', 'skull_back', 'jaw_upper_left', 'jaw_upper_right', 
            'jaw_lower_left', 'jaw_lower_right', 'teeth_anterior', 'teeth_posterior',
            'atlas_vertebra', 'neck_vertebrae_1', 'neck_vertebrae_2', 'neck_vertebrae_3',
            'spine_cervical', 'spine_dorsal_1', 'spine_dorsal_2', 'spine_dorsal_3',
            'spine_lumbar', 'spine_sacral', 'ribs_cervical', 'ribs_dorsal_left',
            'ribs_dorsal_right', 'gastralia', 'shoulder_girdle', 'left_humerus',
            'left_radius', 'left_ulna', 'left_hand', 'right_humerus', 'right_radius',
            'right_ulna', 'right_hand', 'pelvic_girdle', 'left_femur', 'left_tibia',
            'left_fibula', 'left_foot', 'right_femur', 'right_tibia', 'right_fibula',
            'right_foot', 'tail_vertebrae_1', 'tail_vertebrae_2', 'tail_vertebrae_3'
        ],
        unlockRequirement: { expeditions: 50, paleontologists: 5 },
        completionBonus: {
            type: 'all_multiplier',
            value: 3.0,
            description: '+200% to all gains'
        },
        description: "Possibly the largest land predator ever discovered, even larger than T. rex.",
        facts: [
            "Up to 43+ feet long",
            "Likely hunted the massive sauropods",
            "Had a relatively large brain for its size"
        ],
        rarity: 'mythical',
        expeditionValue: 500
    }
};

// Skeleton rarity definitions
const SKELETON_RARITIES = {
    common: {
        color: '#95a5a6',
        dropChanceMultiplier: 1.0,
        expeditionPointBonus: 1.0
    },
    uncommon: {
        color: '#27ae60',
        dropChanceMultiplier: 0.7,
        expeditionPointBonus: 1.2
    },
    rare: {
        color: '#3498db',
        dropChanceMultiplier: 0.4,
        expeditionPointBonus: 1.5
    },
    legendary: {
        color: '#9b59b6',
        dropChanceMultiplier: 0.2,
        expeditionPointBonus: 2.0
    },
    mythical: {
        color: '#e67e22',
        dropChanceMultiplier: 0.05,
        expeditionPointBonus: 3.0
    }
};

// Export for Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SKELETON_DATA, SKELETON_RARITIES };
}
