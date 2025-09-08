export async function validateSpecies(species) {
    if (!species || typeof species !== 'string') {
        return { valid: false, error: 'species name required' }
    };

    const cleanSpecies = species.toLowerCase().trim();

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${cleanSpecies}`);

        if (response.ok) {
            const pokemonData = await response.json();
            return {
                valid: true,
                data: {
                    id: pokemonData.id,
                    name: pokemonData.name,
                    types: pokemonData.types.map(t => t.type.name),
                    sprites: pokemonData.sprites,
                    height: pokemonData.height,
                    weight: pokemonData.weight
                }
            };
        } else if (response.status === 404) {
            return { valid: false, error: `Pokemon "${species}" not found`};
        } else {
            return { valid: false, error: `API Error: ${response.statusText}`};
        }
    } catch (error) {
        return { valid: false, error: 'Failed to validate pokemon'};
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