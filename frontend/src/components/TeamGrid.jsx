import { useState } from "react";
import PokemonSlot from "./PokemonSlot";

export default function TeamGrid() {
  const [team, setTeam] = useState(Array(6).fill(null));

  const updateSlot = (index, pokemon) => {
    const newTeam = [...team];
    newTeam[index] = pokemon;
    setTeam(newTeam);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* 6-slot grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map((pokemon, index) => (
          <PokemonSlot
            key={index}
            index={index}
            pokemon={pokemon}
            onUpdate={(pokemon) => updateSlot(index, pokemon)}
          />
        ))}
      </div>
    </div>
  );
}
