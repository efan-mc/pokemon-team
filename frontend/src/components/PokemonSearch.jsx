import { useState, useEffect } from "react";

export default function PokemonSearch({ onSelect }) {
  const [searchText, setSearchText] = useState("");
  const [pokemonNames, setPokemonNames] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
    setSearchText(name);
    setShowResults(false);
    onSelect?.(name);
  };

  return (
    <div>
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onFocus={() => {
          setShowResults(true);
          fetchNames();
        }}
        placeholder="Search Pokémon..."
      />

      {isLoading && <div>Loading...</div>}

      {showResults && searchResults.length > 0 && (
        <div>
          {searchResults.map((name) => (
            <div
              key={name}
              onClick={() => handleSelect(name)}
              className="p-3 hover:bg-gray-700 cursor-pointer capitalize text-white"
            >
              {name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
