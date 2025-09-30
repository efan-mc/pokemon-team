import { useState } from "react";

const types = [
  "bug",
  "dark",
  "dragon",
  "electric",
  "fairy",
  "fighting",
  "fire",
  "flying",
  "ghost",
  "grass",
  "ground",
  "ice",
  "normal",
  "poison",
  "psychic",
  "rock",
  "steel",
  "water",
];

export default function TypeChart({ team, analysisData }) {
  if (!analysisData || !team) {
    return null;
  }

  const buildGrid = () => {
    const grid = {};

    types.forEach((type) => {
      grid[type] = [];

      team.forEach((pokemon) => {
        if (!pokemon) {
          grid[type].push(null);
          return;
        }

        const matchup = analysisData.teamWeaknesses[type]?.find(
          (w) => w.pokemon === pokemon.name
        );

        grid[type].push(matchup ? matchup.effectiveness : 1);
      });
    });

    return grid;
  };

  const grid = buildGrid();

  const calculateSummary = (typeRow) => {
    const validValues = typeRow.filter((val) => val !== null);
    const weakCount = validValues.filter((val) => val > 1).length;
    const resistCount = validValues.filter((val) => val > 0 && val < 1).length;
    return { weakCount, resistCount };
  };

  const getCellColor = (value) => {
    if (value === null) return "bg-gray-900";
    if (value === 0) return "bg-gray-500";
    if (value === 0.25) return "bg-green-600";
    if (value === 0.5) return "bg-green-500";
    if (value === 1) return "bg-gray-800";
    if (value === 2) return "bg-red-500";
    if (value === 4) return "bg-red-600";
    return "bg-gray-800";
  };

  const formatEffectiveness = (value) => {
    if (value === null) return "";
    if (value === 0) return "IMMUNE";
    if (value === 0.25) return "1/4 x";
    if (value === 0.5) return "1/2 x";
    if (value === 1) return "1";
    if (value === 2) return "2 x";
    if (value === 4) return "4 x";
    return value;
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-gray-600 p-2 bg-gray-800">Type</th>
            {team.map((pokemon, index) => (
              <th
                key={index}
                className="border border-gray-600 p-2 bg-gray-800"
              >
                {pokemon ? (
                  <div className="flex items-center">
                    <img
                      src={pokemon.sprites}
                      alt={pokemon.name}
                      className="w-16
  h-16"
                    />
                    <span className="text-xs">{pokemon.name}</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Empty</span>
                )}
              </th>
            ))}
            <th className="border border-gray-600 p-2 bg-gray-800">Weak.</th>
            <th className="border border-gray-600 p-2 bg-gray-800">Resist.</th>
          </tr>
        </thead>
        <tbody>
          {types.map((type) => {
            const typeRow = grid[type];
            const summary = calculateSummary(typeRow);

            return (
              <tr key={type}>
                <td
                  className="border border-gray-600 p-2 bg-gray-700
  font-semibold uppercase"
                >
                  {capitalize(type)}
                </td>
                {typeRow.map((effectiveness, index) => (
                  <td
                    key={index}
                    className={`border border-gray-600 p-2
  text-center ${getCellColor(effectiveness)}`}
                  >
                    {formatEffectiveness(effectiveness)}
                  </td>
                ))}
                <td
                  className="border border-gray-600 p-2 text-center
  bg-gray-700"
                >
                  {summary.weakCount}
                </td>
                <td
                  className="border border-gray-600 p-2 text-center
  bg-gray-700"
                >
                  {summary.resistCount}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
