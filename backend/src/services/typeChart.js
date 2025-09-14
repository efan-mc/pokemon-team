export const POKEMON_TYPES = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
]

export const TYPE_EFFECTIVENESS = {
  normal: {
    weakTo: ['fighting'],
    resistantTo: [],
    immuneTo: ['ghost'],
    superEffectiveAgainst: [],
    notVeryEffectiveAgainst: ['rock', 'steel'],
    noEffectAgainst: ['ghost']
  },
  fire: {
    weakTo: ['water', 'ground', 'rock'],
    resistantTo: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'],
    immuneTo: [],
    superEffectiveAgainst: ['grass', 'ice', 'bug', 'steel'],
    notVeryEffectiveAgainst: ['fire', 'water', 'rock', 'dragon'],
    noEffectAgainst: []
  },
  water: {
    weakTo: ['electric', 'grass'],
    resistantTo: ['fire', 'water', 'ice', 'steel'],
    immuneTo: [],
    superEffectiveAgainst: ['fire', 'ground', 'rock'],
    notVeryEffectiveAgainst: ['water', 'grass', 'dragon'],
    noEffectAgainst: []
  },
  electric: {
    weakTo: ['ground'],
    resistantTo: ['electric', 'flying', 'steel'],
    immuneTo: [],
    superEffectiveAgainst: ['water', 'flying'],
    notVeryEffectiveAgainst: ['electric', 'grass', 'dragon'],
    noEffectAgainst: ['ground']
  },
  grass: {
    weakTo: ['fire', 'ice', 'poison', 'flying', 'bug'],
    resistantTo: ['water', 'electric', 'grass', 'ground'],
    immuneTo: [],
    superEffectiveAgainst: ['water', 'ground', 'rock'],
    notVeryEffectiveAgainst: [
      'fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'
    ],
    noEffectAgainst: []
  },
  ice: {
    weakTo: ['fire', 'fighting', 'rock', 'steel'],
    resistantTo: ['ice'],
    immuneTo: [],
    superEffectiveAgainst: ['grass', 'ground', 'flying', 'dragon'],
    notVeryEffectiveAgainst: ['fire', 'water', 'ice', 'steel'],
    noEffectAgainst: []
  },
  fighting: {
    weakTo: ['flying', 'psychic', 'fairy'],
    resistantTo: ['bug', 'rock', 'dark'],
    immuneTo: [],
    superEffectiveAgainst: ['normal', 'ice', 'rock', 'dark', 'steel'],
    notVeryEffectiveAgainst: ['poison', 'flying', 'psychic', 'bug', 'fairy'],
    noEffectAgainst: ['ghost']
  },
  poison: {
    weakTo: ['ground', 'psychic'],
    resistantTo: ['grass', 'fighting', 'poison', 'bug', 'fairy'],
    immuneTo: [],
    superEffectiveAgainst: ['grass', 'fairy'],
    notVeryEffectiveAgainst: ['poison', 'ground', 'rock', 'ghost'],
    noEffectAgainst: ['steel']
  },
  ground: {
    weakTo: ['water', 'grass', 'ice'],
    resistantTo: ['poison', 'rock'],
    immuneTo: ['electric'],
    superEffectiveAgainst: ['fire', 'electric', 'poison', 'rock', 'steel'],
    notVeryEffectiveAgainst: ['grass', 'bug'],
    noEffectAgainst: ['flying']
  },
  flying: {
    weakTo: ['electric', 'ice', 'rock'],
    resistantTo: ['grass', 'fighting', 'bug'],
    immuneTo: ['ground'],
    superEffectiveAgainst: ['grass', 'fighting', 'bug'],
    notVeryEffectiveAgainst: ['electric', 'rock', 'steel'],
    noEffectAgainst: []
  },
  psychic: {
    weakTo: ['bug', 'ghost', 'dark'],
    resistantTo: ['fighting', 'psychic'],
    immuneTo: [],
    superEffectiveAgainst: ['fighting', 'poison'],
    notVeryEffectiveAgainst: ['psychic', 'steel'],
    noEffectAgainst: ['dark']
  },
  bug: {
    weakTo: ['fire', 'flying', 'rock'],
    resistantTo: ['grass', 'fighting', 'ground'],
    immuneTo: [],
    superEffectiveAgainst: ['grass', 'psychic', 'dark'],
    notVeryEffectiveAgainst: [
      'fire', 'fighting', 'poison', 'flying', 'ghost', 'steel', 'fairy'
    ],
    noEffectAgainst: []
  },
  rock: {
    weakTo: ['water', 'grass', 'fighting', 'ground', 'steel'],
    resistantTo: ['normal', 'fire', 'poison', 'flying'],
    immuneTo: [],
    superEffectiveAgainst: ['fire', 'ice', 'flying', 'bug'],
    notVeryEffectiveAgainst: ['fighting', 'ground', 'steel'],
    noEffectAgainst: []
  },
  ghost: {
    weakTo: ['ghost', 'dark'],
    resistantTo: ['poison', 'bug'],
    immuneTo: ['normal', 'fighting'],
    superEffectiveAgainst: ['psychic', 'ghost'],
    notVeryEffectiveAgainst: ['dark'],
    noEffectAgainst: ['normal']
  },
  dragon: {
    weakTo: ['ice', 'dragon', 'fairy'],
    resistantTo: ['fire', 'water', 'electric', 'grass'],
    immuneTo: [],
    superEffectiveAgainst: ['dragon'],
    notVeryEffectiveAgainst: ['steel'],
    noEffectAgainst: ['fairy']
  },
  dark: {
    weakTo: ['fighting', 'bug', 'fairy'],
    resistantTo: ['ghost', 'dark'],
    immuneTo: ['psychic'],
    superEffectiveAgainst: ['psychic', 'ghost'],
    notVeryEffectiveAgainst: ['fighting', 'dark', 'fairy'],
    noEffectAgainst: []
  },
  steel: {
    weakTo: ['fire', 'fighting', 'ground'],
    resistantTo: [
      'normal', 'grass', 'ice', 'flying', 'psychic', 'bug',
      'rock', 'dragon', 'steel', 'fairy'
    ],
    immuneTo: ['poison'],
    superEffectiveAgainst: ['ice', 'rock', 'fairy'],
    notVeryEffectiveAgainst: ['fire', 'water', 'electric', 'steel'],
    noEffectAgainst: []
  },
  fairy: {
    weakTo: ['poison', 'steel'],
    resistantTo: ['fighting', 'bug', 'dark'],
    immuneTo: ['dragon'],
    superEffectiveAgainst: ['fighting', 'dragon', 'dark'],
    notVeryEffectiveAgainst: ['fire', 'poison', 'steel'],
    noEffectAgainst: []
  }
};

export function calculatePokemonWeaknesses(pkmnTypes) {
    if (!Array.isArray(pkmnTypes)) {
        throw new Error(`Pokemon types must be an array`);
    }

    for (const type of pkmnTypes) {
        if (!POKEMON_TYPES.includes(type)) {
            throw new Error(`Invalid pokemon type: ${type}`);
        }
    }

    const weaknesses = {}

    for (const attackingType of POKEMON_TYPES) {
        let effectiveness = 1;

        for (const defendingType of pkmnTypes) {
            if (TYPE_EFFECTIVENESS[attackingType].superEffectiveAgainst?.includes(defendingType)) {
                effectiveness *= 2;
            } else if (TYPE_EFFECTIVENESS[attackingType].notVeryEffectiveAgainst?.includes(defendingType)) {
                effectiveness *= 0.5;
            } else if (TYPE_EFFECTIVENESS[attackingType].noEffectAgainst?.includes(defendingType)) {
                effectiveness *= 0;
            }
        }

        if (effectiveness !== 1) {
            weaknesses[attackingType] = effectiveness;
        }
    }

    return weaknesses;
}

export function calculateTeamWeaknesses(pkmnTeam) {
    if (!Array.isArray(pkmnTeam)) {
        throw new Error(`Pokemon team must be an array`);
    }

    const weaknessCount = {};

    pkmnTeam.forEach(pokemon => {
      if (!POKEMON_TYPES.includes(type)) {
          throw new Error(`Invalid pokemon type: ${type}`);
      }

      const weaknesses = calculatePokemonWeaknesses(pokemon);

      Object.entries(weaknesses).forEach(([attackingType, effectiveness]) => {
        if (!weaknessCount[attackingType]) {
          weaknessCount[attackingType] = [];
        }
    })
    });

}