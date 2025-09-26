import { useState } from "react";

export function usePokemonDetails() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPokemonDetails = async (pokemonName) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName.toLowerCase()}`);

        if (!response.ok) {
          throw new Error('Failed to fetch Pokemon details');
        }

        const pokemonData = await response.json();

        const moves = await Promise.all(
          pokemonData.moves.slice(0, 50).map(async (moveEntry) => {
          try {
            const moveResponse = await fetch(moveEntry.move.url);
            const moveData = await moveResponse.json();
            return {
              name: moveEntry.move.name,
              type: moveData.type?.name,
              power: moveData.power,
              pp: moveData.pp,
              accuracy: moveData.accuracy,
            };
            } catch (error) {
                return {
                  name: moveEntry.move.name,
                  type: null,
                  power: null,
                  pp: null,
                  accuracy: null,
                };
              }})
            );

        const abilities = pokemonData.abilities.map(abilityEntry => ({
          name: abilityEntry.ability.name,
          isHidden: abilityEntry.is_hidden,
          slot: abilityEntry.slot
        }));

        return {
          moves: moves,
          abilities: abilities,
          stats: pokemonData.stats,
        };

      } catch (err) {
        setError(err.message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    };

    return { fetchPokemonDetails, isLoading, error };
}