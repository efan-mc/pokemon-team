function parseFirstLine(line, pokemon) {
    const parts = line.split('@');
    const namepart = parts[0].trim();

    if (parts.length > 1) {
        pokemon.item = parts[1].trim();
    }

    if (namepart.includes('(') && namepart.includes(')')) {
        const openBra = namepart.indexOf('(');
        const closedBra = namepart.indexOf(')');

        pokemon.nickname = namepart.substring(0, openBra).trim();
        pokemon.species = namepart.substring(openBra + 1, closedBra).trim();
    } else {
        pokemon.species = namepart;
    }
}

function parseEvs(line) {
    const evs = {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0};
    const evsText = line.replace('EVs:', '').trim();

    const valPair = evsText.split('/');
    valPair.forEach(pair => {
        const parts = pair.trim().split(' ');
        const value = parseInt(parts[0])
        const stat = parts[1];

        if (stat === 'HP') evs.hp = value;
        if (stat === 'Atk') evs.atk = value;
        if (stat === 'Def') evs.def = value;
        if (stat === 'SpA') evs.spa = value;
        if (stat === 'SpD') evs.spd = value;
        if (stat === 'Spe') evs.spe = value;
    });

    return evs;
}

export function parseShowdownPokemon(showdownText) {
    return showdownText.trim().split('\n\n').map(mon => {
        const lines = mon.trim().split('\n');
        const pokemon = {species: "", nickname: null, item: null, ability: null, 
            nature: null, evs: null, moves: []
    };
        lines.forEach(line => {
            if (line.includes('@')) parseFirstLine(line, pokemon);
            else if (line.startsWith('Ability:')) pokemon.ability = line.replace('Ability:', '').trim();
            else if (line.startsWith('EVs:')) pokemon.evs = parseEvs(line);
            else if (line.includes('Nature')) pokemon.nature = line.replace('Nature', '').trim();
            else if (line.startsWith('-')) pokemon.moves.push(line.replace('- ', '').trim());
        });

        return pokemon;
    });
}