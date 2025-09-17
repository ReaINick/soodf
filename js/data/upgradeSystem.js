class UpgradeSystem {
    constructor(game) {
        this.game = game;
        this.upgradeCategories = ['basic', 'expedition', 'paleontologist'];
    }
    
    buyUpgrade(category, upgradeId) {
        const upgradeData = UPGRADE_DATA[category][upgradeId];
        const currentLevel = this.getUpgradeLevel(category, upgradeId);
        
        if (currentLevel >= upgradeData.maxLevel) return false;
        
        const cost = this.getUpgradeCost(upgradeData, currentLevel);
        const canAfford = this.checkAffordability(category, cost);
        
        if (canAfford) {
            this.deductCurrency(category, cost);
            this.incrementUpgradeLevel(category, upgradeId);
            this.applyUpgradeEffect(category, upgradeId, currentLevel + 1);
            return true;
        }
        return false;
    }
    
    checkAffordability(category, cost) {
        switch(category) {
            case 'basic': return GAME_DATA.player.fossils >= cost;
            case 'expedition': return GAME_DATA.player.expeditionPoints >= cost;
            case 'paleontologist': return GAME_DATA.player.paleontologists >= cost;
            default: return false;
        }
    }
    
    applyUpgradeEffect(category, upgradeId, newLevel) {
        const upgradeData = UPGRADE_DATA[category][upgradeId];
        const effect = upgradeData.effect(newLevel);
        
        // Apply effects based on upgrade type [web:10][web:11]
        if (upgradeId === 'digSpeed') {
            GAME_DATA.player.digSpeed = effect;
        } else if (upgradeId === 'fossilQuality') {
            GAME_DATA.player.fossilQuality = effect;
        } else if (upgradeId === 'fossilCapacity') {
            GAME_DATA.player.fossilCapacity = effect;
        }
        // Add other upgrade effects...
    }
    
    applyAllUpgrades() {
        // Reapply all purchased upgrades (used after loading/rebirth)
        for (const category of this.upgradeCategories) {
            for (const upgradeId of Object.keys(UPGRADE_DATA[category])) {
                const level = this.getUpgradeLevel(category, upgradeId);
                if (level > 0) {
                    this.applyUpgradeEffect(category, upgradeId, level);
                }
            }
        }
    }
}
