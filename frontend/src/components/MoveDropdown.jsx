import { useEffect, useState } from "react";

export default function MoveDropdown({
  moves = [],
  onSelect,
  onAdd,
  placeholder = "Select Move",
  selectedMove = null,
}) {
  const [searchText, setSearchText] = useState("");
  const [filteredMoves, setFilteredMoves] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  useEffect(() => {
    if (!searchText.trim()) {
      setFilteredMoves([]);
      return;
    }

    const timer = setTimeout(() => {
      const matches = moves
        .filter((move) =>
          move.name.toLowerCase().includes(searchText.toLowerCase())
        )
        .slice(0, 8);
      setFilteredMoves(matches);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText, moves]);

  const handleSelect = (move) => {
    setSearchText("");
    setShowResults(false);
    onSelect?.(move);
  };

  const handleKeyDown = (e) => {
    if (!showResults || filteredMoves.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredMoves.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredMoves[highlightedIndex]) {
        handleSelect(filteredMoves[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setShowResults(false);
      setSearchText("");
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          setShowResults(e.target.value.trim().length > 0);
        }}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowResults(searchText.trim().length > 0)}
        placeholder={selectedMove ? capitalize(selectedMove.name) : "Move"}
        className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-2xl capitalize
        text-sm font-semibold placeholder:text-gray-200 hover:border-gray-500 transition-colors cursor-text"
      />
      {showResults && filteredMoves.length > 0 && (
        <div
          className="absolute z-20 w-full bg-gray-800/80 border border-gray-700 rounded
 max-h-40 capitalize overflow-y-auto"
        >
          {filteredMoves.map((move, index) => (
            <div
              key={move.name || index}
              onClick={() => handleSelect(move)}
              className="w-full px-2 py-1.5 capitalize cursor-pointer hover:bg-gray-700
  text-gray-100 text-xs"
            >
              {capitalize(move.name)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
