import { useState, useEffect } from "react";
import { usePokemonApi } from "../hooks/usePokemonApi";
import { usePokemonDetails } from "../hooks/usePokemonDetails";
import { useAnalysisApi } from "../hooks/useAnalysisApi";
import { useTeamLoader } from "../hooks/useTeamLoader";
import { useTeamImport } from "../hooks/useTeamImport";
import "../App.css";
import TeamGrid from "../components/TeamGrid";
import PokemonSearch from "../components/PokemonSearch";
import TeamCreationForm from "../components/TeamCreationForm";
import TypeChart from "../components/TypeChart";

function TeamBuilder() {
  const [team, setTeam] = useState(() => {
    const saved = localStorage.getItem("tempTeam");
    return saved ? JSON.parse(saved) : Array(6).fill(null);
  });
  const { validatePokemon, isLoading, error } = usePokemonApi();
  const { fetchPokemonDetails } = usePokemonDetails();
  const [showTeamForm, setShowTeamForm] = useState(false);
  const {
    analyseTeam,
    isLoading: analysisLoading,
    error: analysisError,
  } = useAnalysisApi();
  const [analysisData, setAnalysisData] = useState(null);
  const [showImportBox, setShowImportBox] = useState(false);
  const [importText, setImportText] = useState("");
  const [teamSlug, setTeamSlug] = useState("");
  const [savedTeamSlug, setSavedTeamSlug] = useState(null);
  const { loadTeamBySlug } = useTeamLoader();
  const { importFromShowdown } = useTeamImport();

  useEffect(() => {
    localStorage.setItem("tempTeam", JSON.stringify(team));
  }, [team]);

  const addPokemonToTeam = async (pokemonName) => {
    const emptySlot = team.findIndex((slot) => slot == null);
    if (emptySlot === -1) {
      alert("Team is full, remove a Pokemon first");
      return;
    }

    try {
      const pokemonData = await validatePokemon(pokemonName);
      const pokemonDetails = await fetchPokemonDetails(pokemonName);

      const newTeam = [...team];
      newTeam[emptySlot] = {
        ...pokemonData,
        availableAbilities: pokemonDetails.abilities,
        selectedAbility: null,
        selectedNature: null,
        availableMoves: pokemonDetails.moves,
      };
      setTeam(newTeam);
    } catch (error) {
      alert(`Failed to add Pokemon: ${error.message}`);
    }
  };

  const handleAnalyse = async () => {
    const formattedTeam = team
      .filter((pokemon) => pokemon !== null)
      .map((pokemon) => ({
        name: pokemon.name,
        types: pokemon.types,
      }));

    try {
      const result = await analyseTeam(formattedTeam);
      setAnalysisData(result);
    } catch (error) {
      console.log("Analysis failed: ", error);
    }
  };

  const handleImportShowdown = async () => {
    if (!importText.trim()) {
      alert("Please paste Showdown text");
      return;
    }

    try {
      const teamData = await importFromShowdown(
        importText,
        "Imported Team",
        "OU"
      );

      const importedTeam = await Promise.all(
        teamData.members.map(async (mon) => {
          const formatName = (name) =>
            name.toLowerCase().trim().split(" ").join("-");

          const parseNameFront = formatName(mon.species);

          const pokemonData = await validatePokemon(parseNameFront);
          const pokemonDetails = await fetchPokemonDetails(parseNameFront);

          const selectedMoves = [null, null, null, null];
          if (mon.moves) {
            mon.moves.forEach((moveName, index) => {
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
            selectedAbility: formatName(mon.ability) || null,
            selectedNature: formatName(mon.nature) || null,
            availableMoves: pokemonDetails.moves,
            selectedMoves: selectedMoves,
          };
        })
      );

      setTeam([...importedTeam, ...Array(6 - importedTeam.length).fill(null)]);
      setImportText("");
      setShowImportBox(false);
    } catch (error) {
      alert(`Import failed: ${error.message}`);
    }
  };

  const handleLoadTeam = async () => {
    if (!teamSlug.trim()) {
      alert("Please enter a team code");
      return;
    }

    try {
      const teamData = await loadTeamBySlug(teamSlug);

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
            selectedAbility: formatName(member.ability) || null,
            selectedNature: formatName(member.nature) || null,
            availableMoves: pokemonDetails.moves,
            selectedMoves: selectedMoves,
          };
        })
      );

      setTeam([...loadedTeam, ...Array(6 - loadedTeam.length).fill(null)]);
      setTeamSlug("");
    } catch (error) {
      alert(`Failed to load team: ${error.message}`);
    }
  };

  const removePokemon = (slotIndex) => {
    const newTeam = [...team];
    newTeam[slotIndex] = null;
    setTeam(newTeam);
  };

  const updatePokemon = (slotIndex, updatedPokemon) => {
    const newTeam = [...team];
    newTeam[slotIndex] = updatedPokemon;
    setTeam(newTeam);
  };

  return (
    <div className="min-h-screen bg-gray-800 text-gray-100 p-6">
      <div className="max-w-7xl justify-between">
        <h1 className="text-4xl font-bold mb-6">Pokémon Team Builder</h1>

        {/* Action Button */}
        <div className="flex gap-3 mb-8 justify-center">
          <button
            onClick={() => setShowImportBox(!showImportBox)}
            className="px-4 py-2 rounded font-medium bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            Import
          </button>

          <button
            onClick={() => setShowTeamForm(true)}
            className="px-4 py-2 rounded font-medium bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            Save Team
          </button>
        </div>

        {/* Import Button */}

        {showImportBox && (
          <div className="mb-8">
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste your Showdown team here..."
              rows={15}
              className="w-full p-3 bg-gray-900 border border-gray-700 rounded-2xl"
            />
            <button
              onClick={handleImportShowdown}
              className="px-4 py-2 rounded font-medium bg-blue-600 hover:bg-blue-500 transition-colors"
            >
              Import Team
            </button>
          </div>
        )}

        {/* Pokemon Search */}

        <div className="mb-6">
          <PokemonSearch onAdd={addPokemonToTeam} />
          {isLoading && (
            <div className="text-yellow-200">Adding Pokemon to team...</div>
          )}
          {error && <div className="text-red-500">Error: {error}</div>}
        </div>

        {/* Load Team */}

        <div className="mb-8">
          <input
            type="text"
            value={teamSlug}
            onChange={(e) => setTeamSlug(e.target.value)}
            placeholder="Enter a team code"
            className="flex-1 max-w-sm px-3 py-2 bg-gray-800 border border-gray-700 
            rounded-2xl"
          />
          <button
            onClick={handleLoadTeam}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium
  transition-colors"
          >
            Load Team
          </button>
        </div>

        {/* Team Grid */}

        <TeamGrid
          team={team}
          onRemove={removePokemon}
          onUpdatePokemon={updatePokemon}
        />

        {/* Analysis */}

        <div className="mb-8">
          <button
            onClick={handleAnalyse}
            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500 text-white rounded-lg font-semibold
  transition-colors"
          >
            Analyse Team
          </button>
          {analysisLoading && <div>Analysing team...</div>}
          {analysisError && <div>Error: {analysisError}</div>}
        </div>

        {/* Team Creation Confirm */}

        <div className="mb-8">
          {showTeamForm && (
            <TeamCreationForm
              team={team}
              onCreateTeam={(createdTeam) => {
                console.log("Team created:", createdTeam);
                setSavedTeamSlug(createdTeam.slug);
                localStorage.removeItem("tempTeam");
              }}
              onClear={() => setTeam(Array(6).fill(null))}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-medium
  transition-colors"
            />
          )}
        </div>

        {savedTeamSlug && (
          <div className="mb-6 p-4 bg-green/30 border border-green-700 rounded-2xl items-center justify-between">
            Team saved! Share code: {savedTeamSlug}
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `http://localhost:5173/t/${savedTeamSlug}`
                );
              }}
              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded font-medium
  transition-colors"
            >
              Copy Link
            </button>
          </div>
        )}

        {/* Type Chart */}

        <div className="mt-8">
          <TypeChart team={team} analysisData={analysisData} />
        </div>
      </div>
    </div>
  );
}

export default TeamBuilder;
