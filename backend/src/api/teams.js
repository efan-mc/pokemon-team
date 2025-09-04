import { makeSlug } from "../services/slug.js";
import { createTeam } from "../services/createTeam.js"

export function registerTeamRoutes(router) {
    router.post('/teams', async (req, res) => {
        try {
            const { name, pokemon, format } = req.body;

            if (!name || !pokemon) {
                return res.status(400).json({
                    error: 'Missing required fields: name and pokemon'
                });
            }

            if (!Array.isArray(pokemon) || pokemon.length === 0) {
                return res.status(400).json({
                    error: 'Pokemon array cannot be empty'
                });
            }

            if (pokemon.length > 6) {
                return res.status(400).json({
                    error: 'Pokemon Team cannot exceed 6 members'
                });
            }

            for (let i = 0; i < pokemon.length; i++) {
                const mon = pokemon[i];

                if (!mon || typeof mon.species !== 'string' || mon.species.trim().length === 0) {
                    return res.status(400).json({
                        error: `member ${i + 1}: species is required`
                    })
                }

                if (mon.moves) {
                    if (!Array.isArray(mon.moves) || mon.moves.length > 4 || mon.moves.length < 1) {
                        return res.status(400).json({ 
                            error: `member ${i + 1}: moves must be between 1 and 4`
                        })
                    }
                }
            }

            const slug = makeSlug();
            const newTeam = await createTeam({ name, pokemon, format, slug });

            res.status(201).json({
                success: true, 
                data: newTeam
            });

        } catch (error) {
            console.error('Error creating team: ', error);
            return res.status(500).json({ error: 'failed to create team' });
        }
    });
}