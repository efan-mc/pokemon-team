import { useState } from "react";
import PokemonSlot from "./PokemonSlot";

export default function TeamGrid({ team, onRemove, onUpdatePokemon }) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((pokemon, index) => (
          <PokemonSlot
            key={index}
            index={index}
            pokemon={pokemon}
            onRemove={onRemove}
            onUpdatePokemon={onUpdatePokemon}
          />
        ))}
      </div>
    </div>
  );
}
