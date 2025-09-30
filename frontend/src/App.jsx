import { useState } from "react";
import { usePokemonApi } from "./hooks/usePokemonApi";
import { usePokemonDetails } from "./hooks/usePokemonDetails";
import { useAnalysisApi } from "./hooks/useAnalysisApi";
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
