import TypeIcons from "./TypeIcons";

export default function PokemonSlot({ index, pokemon, onRemove }) {
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
    </div>
  );
}
