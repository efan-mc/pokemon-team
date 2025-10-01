import { useState, useEffect } from "react";
import TypeIcons from "./TypeIcons";
import AbilityDropdown from "./AbilityDropdown";
import NatureDropdown from "./NatureDropdown";
import MoveDropdown from "./MoveDropdown";

export default function PokemonSlot({
  index,
  pokemon,
  onRemove,
  onUpdatePokemon,
}) {
  const [selectedMoves, setSelectedMoves] = useState([null, null, null, null]);

  useEffect(() => {
    if (pokemon?.selectedMoves) {
      setSelectedMoves(pokemon.selectedMoves);
    }
  }, [pokemon]);

  const handleRemove = () => {
    if (onRemove) {
      onRemove(index);
    }
  };

  if (!pokemon) {
    return (
      <div className="border-gray-600 rounded-2xl">
        <div>
          <div>Empty Slot</div>
        </div>
      </div>
    );
  }

  const formattedTypes =
    pokemon.types?.map((type) => ({
      type: { name: type },
    })) || [];

  const handleMoveSelect = (moveIndex, move) => {
    const newMoves = [...selectedMoves];
    newMoves[moveIndex] = move;
    setSelectedMoves(newMoves);

    onUpdatePokemon(index, {
      ...pokemon,
      selectedMoves: newMoves,
    });
  };

  const handleAbilityChange = (newAbility) => {
    onUpdatePokemon?.(index, { ...pokemon, selectedAbility: newAbility });
  };

  const handleNatureChange = (newNature) => {
    onUpdatePokemon?.(index, { ...pokemon, selectedNature: newNature });
  };

  return (
    <div className="border-gray-600 bg-grey-800 rounded-2xl">
      <div className="text-center">
        {pokemon.sprites && (
          <img
            src={pokemon.sprites}
            alt={pokemon.name}
            className="w-24 h-24 mx-auto"
          />
        )}
      </div>
      <div className="font-semibold">{pokemon.name}</div>
      <TypeIcons types={formattedTypes} />

      <div>
        <AbilityDropdown
          abilities={pokemon.availableAbilities || []}
          selectedAbility={pokemon.selectedAbility}
          onAbilityChange={handleAbilityChange}
        />
        <NatureDropdown
          selectedNature={pokemon.selectedNature}
          onNatureChange={handleNatureChange}
        />
      </div>

      <div>
        {[0, 1, 2, 3].map((moveIndex) => {
          return (
            <MoveDropdown
              key={moveIndex}
              moves={pokemon.availableMoves || []}
              selectedMove={selectedMoves[moveIndex]}
              onSelect={(move) => handleMoveSelect(moveIndex, move)}
            />
          );
        })}
      </div>

      <button onClick={handleRemove}>Remove</button>
    </div>
  );
}
