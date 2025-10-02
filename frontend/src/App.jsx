import { useState } from "react";
import { usePokemonApi } from "./hooks/usePokemonApi";
import { usePokemonDetails } from "./hooks/usePokemonDetails";
import { useAnalysisApi } from "./hooks/useAnalysisApi";
import { apiCall } from "./utils/api";
import { useTeamLoader } from "./hooks/useTeamLoader";
import "./App.css";
import TeamGrid from "./components/TeamGrid";
import PokemonSearch from "./components/PokemonSearch";
import TeamCreationForm from "./components/TeamCreationForm";
import TypeChart from "./components/TypeChart";

function App() {
  const [team, setTeam] = useState(Array(6).fill(null));
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
  const { loadTeamBySlug } = useTeamLoader();
  const [teamSlug, setTeamSlug] = useState("");

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
      const { parsed } = await apiCall("/test-parser", {
        method: "POST",
        body: { showdownText: importText },
      });

      const importedTeam = await Promise.all(
        parsed.map(async (mon) => {
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
    <div>
      <div>
        <h1>Place Holder Title</h1>

        <div>
          <PokemonSearch onAdd={addPokemonToTeam} />
          {isLoading && <div>Adding Pokemon to team...</div>}
          {error && <div>Error: {error}</div>}
        </div>

        <div>
          <button onClick={() => setShowImportBox(!showImportBox)}>
            Show Import
          </button>
        </div>

        <div>
          <input
            type="text"
            value={teamSlug}
            onChange={(e) => setTeamSlug(e.target.value)}
            placeholder="Enter a team code"
          />
          <button onClick={handleLoadTeam}>Load Team</button>
        </div>

        {showImportBox && (
          <div>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste your Showdown team here..."
              rows={15}
              cols={60}
            />
            <button onClick={handleImportShowdown}>Import Team</button>
          </div>
        )}

        <TeamGrid
          team={team}
          onRemove={removePokemon}
          onUpdatePokemon={updatePokemon}
        />

        {/* Bug Testing */}
        <div className="bg-gray-800">
          <h3>Current Team:</h3>
          {team.map((pokemon, index) => (
            <div key={index}>
              Slot {index + 1}:{" "}
              {pokemon
                ? `${pokemon.name}
                  (${pokemon.types.join("/")})`
                : "Empty"}
            </div>
          ))}
        </div>

        <div>
          <button onClick={() => setShowTeamForm(true)}>Save Team</button>
        </div>

        <div>
          <button onClick={handleAnalyse}>Analyse Team</button>
          {analysisLoading && <div>Analysing team...</div>}
          {analysisError && <div>Error: {analysisError}</div>}
        </div>

        <div>
          {showTeamForm && (
            <TeamCreationForm
              team={team}
              onCreateTeam={(createdTeam) => {
                console.log("Team created:", createdTeam);
              }}
              onClear={() => setTeam(Array(6).fill(null))}
            />
          )}
        </div>

        <div>
          <TypeChart team={team} analysisData={analysisData} />
        </div>
      </div>
    </div>
  );
}

export default App;
