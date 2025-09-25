import { useState } from "react";
import { usePokemonApi } from "./hooks/usePokemonApi";
import "./App.css";
import TeamGrid from "./components/TeamGrid";
import PokemonSearch from "./components/PokemonSearch";
import TeamCreationForm from "./components/TeamCreationForm";

function App() {
  const [team, setTeam] = useState(Array(6).fill(null));
  const { validatePokemon, isLoading, error } = usePokemonApi();
  const [showTeamForm, setShowTeamForm] = useState(false);

  const addPokemonToTeam = async (pokemonName) => {
    const emptySlot = team.findIndex((slot) => slot == null);
    if (emptySlot === -1) {
      alert("Team is full, remoev a Pokemon first");
      return;
    }

    try {
      const pokemonData = await validatePokemon(pokemonName);

      const newTeam = [...team];
      newTeam[emptySlot] = pokemonData;
      setTeam(newTeam);
    } catch (error) {
      alert(`Failed to add Pokemon: ${error.message}`);
    }
  };

  const removePokemon = (slotIndex) => {
    const newTeam = [...team];
    newTeam[slotIndex] = null;
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

        <TeamGrid team={team} onRemove={removePokemon} />

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
          {showTeamForm && (
            <TeamCreationForm
              team={team}
              onCreateTeam={(createdTeam) => {
                console.log("Team created:", createdTeam);
                // Optionally close form or keep it open
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
