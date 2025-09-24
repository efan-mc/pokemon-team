import { validateSpecies } from '../services/validatePokemon.js';

export function registerPokemonRoutes(router) {
    router.post('/validate-pokemon', async (req, res) => {
        try {
            const { species } = req.body;
            const result = await validateSpecies(species);

            if (result.valid) {
                res.json(result.data);
            } else {
                res.status(400).json({ error: result.error });
            }
        } catch (error) {
            res.status(500).json({ error: 'Validation error' });
        }   
    });
}