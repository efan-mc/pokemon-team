import { calculateTeamWeaknesses, calculateTeamSummary, getWeaknessBreakdown } from "../services/typeChart.js";
import { parseShowdownPokemon } from "../services/showdownParser.js";

export function registerAnalysisRoutes(router) {
    router.post('/team-analysis', async (req, res) => {
        try {
            const { team } = req.body;

            if (!team || !Array.isArray(team)) {
                return res.status(400).json({
                    error: 'Team must be an array   '
                });
            }

            if (team.length === 0 || team.length > 6) {
                return res.status(400).json({
                    error: 'Team cannot exceed 6'
                });
            }

            const teamWeaknesses = calculateTeamWeaknesses(team);
            const summary = calculateTeamSummary(teamWeaknesses);
            const topRisks = getWeaknessBreakdown(summary);

            res.json({
                teamWeaknesses,
                summary,
                topRisks
            });
            
        } catch (error) {
            console.log('Error with analysis: ', error);
            return res.status(500).json({ error: 'failed to analyse' });
        }
    });

    router.post('/test-parser', (req, res) => {
        try {
            const { showdownText } = req.body;
            const result = parseShowdownPokemon(showdownText);

            res.json({ success: true, parsed: result });
        } catch (error) {
            res.status(500).json({ error: error.message })
        }
    })
}