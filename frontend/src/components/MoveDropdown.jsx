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

  const handleInputChange = (e) => {
    setSearchText(e.target.value);
    setShowResults(e.target.value.trim().length > 0);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (filteredMoves.length > 0) {
        setSearchText(capitalize(filteredMoves[0].name));
        setShowResults(false);
        onSelect?.(filteredMoves[0]);
      } else if (searchText.trim()) {
        onAdd?.(searchText.trim());
        setSearchText("");
        setShowResults(false);
      }
    } else if (e.key === "Escape") {
      setShowResults(false);
      setSearchText("");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchText}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setShowResults(searchText.trim().length > 0)}
        placeholder={selectedMove ? capitalize(selectedMove.name) : "Move"}
      />
      {showResults && filteredMoves.length > 0 && (
        <div>
          {filteredMoves.map((move, index) => (
            <div key={move.name || index} onClick={() => handleSelect(move)}>
              {capitalize(move.name)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
