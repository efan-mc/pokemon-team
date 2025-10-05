import { useState, useEffect } from "react";
import { usePokemonApi } from "../hooks/usePokemonApi";
import { usePokemonDetails } from "../hooks/usePokemonDetails";
import { useAnalysisApi } from "../hooks/useAnalysisApi";
import { useTeamLoader } from "../hooks/useTeamLoader";
import "../App.css";
import TeamGrid from "../components/TeamGrid";
import TypeChart from "../components/TypeChart";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";

function TeamView() {
  const { slug } = useParams();
  const [team, setTeam] = useState(Array(6).fill(null));
  const { validatePokemon, error } = usePokemonApi();
  const { fetchPokemonDetails } = usePokemonDetails();
  const {
    analyseTeam,
    isLoading: analysisLoading,
    error: analysisError,
  } = useAnalysisApi();
  const [analysisData, setAnalysisData] = useState(null);
  const { loadTeamBySlug } = useTeamLoader();
  const [teamName, setTeamName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTeam = async () => {
      if (!slug) return;

      try {
        setIsLoading(true);
        const teamData = await loadTeamBySlug(slug);
        setTeamName(teamData.name);

        const loadedTeam = await Promise.all(
          teamData.members.map(async (member) => {
            const formatName = (name) =>
              name.toLowerCase().trim().split(" ").join("-");

            const pokemonData = await validatePokemon(member.species);
            const pokemonDetails = await fetchPokemonDetails(member.species);

            const selectedMoves = [null, null, null, null];
            if (member.moves) {
              member.moves.forEach((moveName, index) => {
                const formattedMove = formatName(moveName);
                const matchingMove = pokemonDetails.moves.find(
                  (m) => m.name === formattedMove
                );
                if (matchingMove) {
                  selectedMoves[index] = matchingMove;
                }
              });
            }

            return {
              ...pokemonData,
              availableAbilities: pokemonDetails.abilities,
              selectedAbility: member.ability
                ? formatName(member.ability)
                : null,
              selectedNature: member.nature ? formatName(member.nature) : null,
              availableMoves: pokemonDetails.moves,
              selectedMoves: selectedMoves,
            };
          })
        );

        setTeam([...loadedTeam, ...Array(6 - loadedTeam.length).fill(null)]);

        const formattedTeam = loadedTeam.map((pokemon) => ({
          name: pokemon.name,
          types: pokemon.types,
        }));
        const result = await analyseTeam(formattedTeam);
        setAnalysisData(result);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeam();
  }, [slug]);

  if (isLoading) {
    return <div className="text-center">Loading team...</div>;
  }

  if (error) {
    return <div className="text-center">Error</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-6 flex-1">
        <h1 className="text-3xl font-bold mb-4">{teamName || "Shared Team"}</h1>
        <p className="mb-6">Team Code: {slug}</p>

        <TeamGrid team={team} onRemove={null} onUpdatePokemon={null} />

        <div className="mt-8">
          <TypeChart team={team} analysisData={analysisData} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TeamView;
