import { useState, useEffect } from "react";
import TypeIcons from "./TypeIcons";
import AbilityDropdown from "./AbilityDropdown";
import NatureDropdown from "./NatureDropdown";
import MoveDropdown from "./MoveDropdown";
import { TYPE_COLOURS } from "../utils/pokemonTypeColours";

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
      <div
        className="border-2 border-dashed border-gray-600 bg-gray-800/30 rounded-2xl p-6
  flex items-center justify-center min-h-[280px] min-w-[280px]"
      >
        <div>
          <div className="text-gray-400">Empty Slot</div>
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

  const getCardBackground = () => {
    if (!pokemon.types || pokemon.types.length === 0) {
      return { background: "#9FA19F" };
    }

    const t1 = pokemon.types[0]?.toLowerCase() || "normal";
    const t2 = pokemon.types[1]?.toLowerCase() || t1;

    const c1 = TYPE_COLOURS[t1] || "#9FA19F";
    const c2 = TYPE_COLOURS[t2] || c1;

    const isDual = t1 !== t2;

    const bg = isDual
      ? `linear-gradient(135deg, ${c1} 40%, ${c2} 60%)`
      : `linear-gradient(135deg, ${c1} 0%, ${c1}cc 50%, ${c1}80 100%)`;

    return { background: bg };
  };

  return (
    <div
      className="relative bg-gray-800 border border-gray-700 rounded-2xl p-4 hover:border-gray-400"
      style={getCardBackground()}
    >
      <button
        onClick={handleRemove}
        className="absolute top-2 left-2 w-7 h-7 flex items-center justify-center
  text-red-400 rounded z-10 font-bold"
      >
        X
      </button>

      <div className="flex gap-4 mt-6 items-center">
        {pokemon.sprites && (
          <div
            className="w-24 h-24 rounded-full bg-gray-900/50 border border-gray-700 flex
  items-center justify-center"
          >
            <img
              src={pokemon.sprites}
              alt={pokemon.name}
              className="w-24 h-24 object-contain"
            />
          </div>
        )}
        <div className="bg-gray-900/50 border border-gray-700 px-4 py-2 flex rounded text-center">
          <span className="font-semibold capitalize">{pokemon.name}</span>
        </div>
      </div>

      <div className="absolute top-2 right-2 flex gap-1.5">
        <TypeIcons types={formattedTypes} size="small" />
      </div>

      <div className="flex gap-3 mt-2">
        <div className="flex-1 flex flex-col gap-1.5">
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
      </div>

      <div className="grid grid-cols-2">
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
    </div>
  );
}
