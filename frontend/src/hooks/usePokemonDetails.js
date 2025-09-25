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

        const moves = pokemonData.moves.map(moveEntry => ({
          name: moveEntry.move.name,
          url: moveEntry.move.url,
          learnMethods: moveEntry.version_group_details
        }));

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