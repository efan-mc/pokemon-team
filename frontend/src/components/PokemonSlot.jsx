import TypeIcons from "./TypeIcons";
import AbilityDropdown from "./AbilityDropdown";
import NatureDropdown from "./NatureDropdown";

export default function PokemonSlot({
  index,
  pokemon,
  onRemove,
  onUpdatePokemon,
}) {
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

      <button onClick={handleRemove}>Remove</button>
    </div>
  );
}
