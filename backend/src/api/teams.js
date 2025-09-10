import { makeSlug } from "../services/slug.js";
import { createTeam } from "../services/createTeam.js"
import { getTeamBySlug } from "../services/getTeam.js";
import { validateTeam } from "../services/validatePokemon.js";

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

            const speciesArray = pokemon.map(mon => mon?.species || "");
            const validation = await validateTeam(speciesArray)

            if (!validation.valid) {
                return res.status(400).json({
                        error: 'Pokemon validation failed',
                        details: validation.errors
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

            const enrichedPokemon = pokemon.map((mon, index) => {
                const validationResult = validation.results[index];
                const apiData = validationResult.valid ? validationResult.data : null;

                return {
                    ...mon,
                    species: apiData?.name || mon.species,
                    types: apiData?.types || null,
                    spriteUrl: apiData?.sprites || null,
                    nickname: mon.nickname || null,
                    ability: mon.ability || null,
                    item: mon.item || null,
                    teraType: mon.tera || mon.teraType || null,
                    nature: mon.nature || null,
                    evs: mon.evs || null,
                    ivs: mon.ivs || null,
                    moves: mon.moves || null
                };
            });

            const slug = makeSlug();
            const newTeam = await createTeam({ name, pokemon: enrichedPokemon, format, slug });

            res.status(201).json({
                success: true, 
                data: newTeam
            });

        } catch (error) {
            console.error('Error creating team: ', error);
            return res.status(500).json({ error: 'failed to create team' });
        }
    });

    router.get('/teams/:slug', async (req, res) => {
        try {
            const { slug } = req.params

            if (!slug || slug.trim().length === 0) {
                return res.status(400).json({
                    error: 'Team slug parameter is required'
                });
            }

            const team = await getTeamBySlug(slug.trim());

            if (!team) {
                return res.status(404).json({
                    error: 'Team not found'
                });
            }

            res.status(200).json({
                success: true,
                data: team
            });

        } catch (error) {
            return res.status(500).json({ error: 'failed to fetch team'});
        }
    });
}