import { useState } from "react";
import { apiCall } from "../utils/api";

export function usePokemonApi() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const validatePokemon = async (species) => {
        setIsLoading(true);
        setError(null);

        try {
              const pokemonData = await apiCall('/validate-pokemon', {
                  method: 'POST',
                  body: { species: species.toLowerCase() }
              });
              return pokemonData;
          } catch (err) {
              setError(err.message);
              throw err;
          } finally {
              setIsLoading(false);
          }
    };

    return { validatePokemon, isLoading, error }
}   