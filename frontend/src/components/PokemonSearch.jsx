import { useState, useEffect } from "react";

export default function PokemonSearch({ onSelect, onAdd }) {
  const [searchText, setSearchText] = useState("");
  const [pokemonNames, setPokemonNames] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const fetchNames = async () => {
    if (pokemonNames.length > 0) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=1010"
      );
      const data = await response.json();
      setPokemonNames(data.results.map((p) => p.name));
    } catch (error) {
      console.log("Failed to load Pokemon: ", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!searchText.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(() => {
      const matches = pokemonNames
        .filter((name) => name.toLowerCase().includes(searchText.toLowerCase()))
        .slice(0, 8);
      setSearchResults(matches);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText, pokemonNames]);

  const handleSelect = (name) => {
    const result = capitalize(name);
    setSearchText(result);
    setShowResults(false);
    onSelect?.(result);
  };

  const handleAdd = () => {
    if (searchText.trim() && onAdd) {
      onAdd(searchText.trim());
      setSearchText("");
      setShowResults(false);
    }
  };

  return (
    <div className="gap-2 w-[600px] flex">
      <div className="relative flex-1">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onFocus={() => {
            setShowResults(true);
            fetchNames();
          }}
          placeholder="Search Pokémon..."
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 
            rounded-2xl"
        />

        {isLoading && <div>Loading...</div>}

        {showResults && searchResults.length > 0 && (
          <div className="absolute z-20 w-full mt-1 bg-gray-800 border border-gray-700 rounded max-h-60 overflow-y-auto">
            {searchResults.map((name) => (
              <div
                key={name}
                onClick={() => handleSelect(name)}
                className="px-4 py-2 hover:bg-gray-700 cursor-pointer capitalize text-white"
              >
                {capitalize(name)}
              </div>
            ))}
          </div>
        )}

        {showResults &&
          !isLoading &&
          searchText.trim() &&
          searchResults.length == 0 && (
            <div className="absolute z-20 w-full mt-1 bg-gray-800 border border-gray-700 rounded p-4">
              <h3>No Pokémon found</h3>
            </div>
          )}
      </div>

      <button
        onClick={handleAdd}
        disabled={!searchText.trim()}
        className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded font-medium
  transition-colors"
      >
        Add
      </button>
    </div>
  );
}
