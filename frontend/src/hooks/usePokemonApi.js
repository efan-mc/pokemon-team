import { useState } from "react";

export function usePokemonApi() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const validatePokemon = async (species) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3000/api/v1/validate-pokemon', {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json' },
                body: JSON.stringify({ species: species.toLowerCase() })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Pokemon validation failed');
            }

            const pokemonData = await response.json();
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