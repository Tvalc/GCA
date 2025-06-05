// Modified calculateDamage function to include weapon damage
// Replace your existing calculateDamage function with this one

calculateDamage(attacker, defender, isMagic = false) {
  if (!attacker || !defender) return { damage: 0, wasBlocked: false };

  // Get base stats
  const attackStat = isMagic ? attacker.intelligence : attacker.strength;
  
  // Get weapon damage from equipped items
  let weaponDamage = 0;
  let magicWeaponDamage = 0;
  
  // Check if attacker has equipment
  if (attacker.equipment) {
    // Look through all equipped items
    for (const [slot, item] of Object.entries(attacker.equipment)) {
      if (!item || !item.stats) continue;
      
      // Add physical damage from weapons
      if (item.stats.damage) {
        weaponDamage += item.stats.damage;
      }
      
      // Add magic damage from weapons
      if (item.stats.magicDamage) {
        magicWeaponDamage += item.stats.magicDamage;
      }
    }
  }

  // Ensure defender has derivedStats
  if (!defender.derivedStats) {
    defender.derivedStats = {
      defense: 0,
      magicDefense: 0,
      blockChance: 0,
    };
  }

  const defenseStat = isMagic ? defender.derivedStats.magicDefense : defender.derivedStats.defense;

  // Calculate base damage including weapon damage
  const weaponBonus = isMagic ? magicWeaponDamage : weaponDamage;
  const baseDamage = Math.max(1, attackStat + weaponBonus - defenseStat);
  const finalDamage = Math.floor(baseDamage * (0.8 + Math.random() * 0.4));

  // Check for block if physical damage
  if (!isMagic && defender.derivedStats.blockChance > 0) {
    if (Math.random() < defender.derivedStats.blockChance) {
      return {
        damage: Math.floor(finalDamage * 0.5),
        wasBlocked: true,
      };
    }
  }

  return {
    damage: finalDamage,
    wasBlocked: false,
  };
}
