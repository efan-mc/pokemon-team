const VALID_NATURES = [
    'hardy', 'lonely', 'brave', 'adamant', 'naughty',
    'bold', 'docile', 'relaxed', 'impish', 'lax',
    'timid', 'hasty', 'serious', 'jolly', 'naive',
    'modest', 'mild', 'quiet', 'bashful', 'rash',
    'calm', 'gentle', 'sassy', 'careful', 'quirky'
];

export async function validateSpecies(species) {
    if (!species || typeof species !== 'string') {
        return { valid: false, error: 'species name required' }
    };

    const cleanSpecies = species.toLowerCase().trim();

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${cleanSpecies}`);

        if (response.ok) {
            const pokemonData = await response.json();
            result = {
                valid: true,
                data: {
                    id: pokemonData.id,
                    name: pokemonData.name,
                    types: pokemonData.types.map(t => t.type.name),
                    abilities: pokemonData.abilitiy.map(a => ({
                        name: a.abilities.name,
                        isHidden: a.is_hidden
                    })),
                    sprites: pokemonData.sprites?.front_default,
                    height: pokemonData.height,
                    weight: pokemonData.weight,
                    stats: pokemonData.stats.map(s => ({
                        name: s.stat.name,
                        baseStat: s.base_stat
                    }))
                }
            };
        } else if (response.status === 404) {
            return { valid: false, error: `Pokemon "${species}" not found`};
        } else {
            return { valid: false, error: `API Error: ${response.statusText}`};
        }

        return result;
    } catch (error) {
        return { valid: false, error: 'Failed to validate pokemon'};
    }
}

export async function validateMove(moveName) {
    if (!moveName || typeof moveName !== 'string') {
        return { valid: false, error: 'Move name required' };
    }
    
    const cleanMove = moveName.toLowerCase().trim().replace(/\s+/g, '-');
    
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/move/${cleanMove}`);
        
        let result;
        if (response.ok) {
            const moveData = await response.json();
            result = {
                valid: true,
                data: {
                    name: moveData.name,
                    type: moveData.type.name,
                    power: moveData.power,
                    accuracy: moveData.accuracy,
                    pp: moveData.pp
                }
            };
        } else if (response.status === 404) {
            result = { valid: false, error: `Move "${moveName}" not found` };
        } else {
            result = { valid: false, error: `API Error: ${response.status} ${response.statusText}` };
        }
        
        return result;
    } catch (error) {
        console.error('Move validation error:', error);
        return { valid: false, error: 'Failed to validate move' };
    }
}

export async function validateType(type) {
    if (!type || typeof type !== 'string') {
        return { valid: false, error: 'type required' }
    };

    const cleanType = type.toLowerCase().trim();

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/type/${cleanType}`);

        if (response.ok) {
            const typeData = await response.json();
            return {
                valid: true,
                data: {
                    name: typeData.name,
                    weaknesses: typeData.damage_relations.double_damage_from.map(t => t.name),
                    resistances: typeData.damage_relations.half_damage_from.map(t => t.name),
                    immunities: typeData.damage_relations.no_damage_from.map(t => t.name),
                }
            }
        } else if (response.status === 404) {
            return { valid: false, error: `Type "${type}" not found`};
        } else {
            return { valid: false, error: `API Error: ${response.status}`};
        }
    } catch (error) {
        return { valid: false, error: 'Failed to validate type'};
    }
}

export async function validateTeam(team) {
    if (!Array.isArray(team)) {
        return { valid: false, error: 'Team must be an array', results: [] }
    }
    if (team.length === 0) {
    return { valid: false, error: 'team cannot be empty', results: [] };
    }
    if (team.length > 6) {
        return { valid: false, error: 'team cannot exceed 6 members', results: [] };
    }

    const results = [];
    const errors = [];

    for (let i = 0; i < team.length; i++) {
        const species = team[i];

        try {
            const result = await validateSpecies(species);
            results.push({ species, ...result});

            if (!result.valid) {
                errors.push(`Pokemon ${i + 1}: ${result.error}`);
            }
        } catch (error) {
            errors.push(`Pokemon ${i + 1}: Validation failed`);
            results.push({ species, valid: false, error: 'Validation failed' });
        }
    }

    return {
        valid: errors.length === 0,
        results,
        errors
    }
}