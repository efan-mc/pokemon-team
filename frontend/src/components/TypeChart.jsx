import { useState } from "react";
import { TYPE_COLOURS } from "../utils/pokemonTypeColours";

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
    const resistCount = validValues.filter((val) => val < 1).length;
    const totalCoverage = Math.abs(weakCount - resistCount);
    return { weakCount, resistCount, totalCoverage };
  };

  const getCellColor = (value) => {
    if (value === null) return "bg-gray-900/50";
    if (value === 0) return "bg-gray-600";
    if (value === 0.25) return "bg-green-700 font-semibold";
    if (value === 0.5) return "bg-green-600";
    if (value === 1) return "bg-gray-800 text-gray-400";
    if (value === 2) return "bg-red-500";
    if (value === 4) return "bg-red-700";
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

  const getCoverageCellColour = (weakCount, resistCount) => {
    if (weakCount > resistCount) return "bg-red-700/95";
    if (resistCount > weakCount) return "bg-green-600/95";
    return "bg-gray-700";
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="overflow-x-auto">
      <h2 className="font-bold mb-4 text-2xl">Team Coverage Analysis</h2>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border border-gray-600 p-2 bg-gray-800 text-left sticky left-0 z-10">
              Type
            </th>
            {team.map((pokemon, index) => (
              <th
                key={index}
                className="border border-gray-600 p-3 bg-gray-800 text-left"
              >
                {pokemon ? (
                  <div className="flex flex-col items-center gap-1">
                    <img
                      src={pokemon.sprites}
                      alt={pokemon.name}
                      className="w-16
  h-16"
                    />
                    <span className="text-xs capitalize">{pokemon.name}</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Empty</span>
                )}
              </th>
            ))}
            <th className="border border-gray-600 p-3 bg-gray-800">Weak.</th>
            <th className="border border-gray-600 p-3 bg-gray-800">Resist.</th>
            <th className="border border-gray-600 p-3 bg-gray-800">
              Total Coverage
            </th>
          </tr>
        </thead>
        <tbody>
          {types.map((type) => {
            const typeRow = grid[type];
            const summary = calculateSummary(typeRow);

            return (
              <tr key={type}>
                <td
                  className="border-3 border-gray-800 p-2 bg-gray-700
  font-semibold uppercase"
                  style={{ backgroundColor: TYPE_COLOURS[type] }}
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
                <td
                  className={`border border-gray-600 p-2 text-center font-semibold ${getCoverageCellColour(
                    summary.weakCount,
                    summary.resistCount
                  )}`}
                >
                  {summary.totalCoverage}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
