export default function NatureDropdown({
  selectedNature,
  onNatureChange,
  placeholder = "Select Nature",
}) {
  const natures = [
    "adamant",
    "bashful",
    "bold",
    "brave",
    "calm",
    "careful",
    "docile",
    "gentle",
    "hardy",
    "hasty",
    "impish",
    "jolly",
    "lax",
    "lonely",
    "mild",
    "modest",
    "naive",
    "naughty",
    "quiet",
    "quirky",
    "rash",
    "relaxed",
    "sassy",
    "serious",
    "timid",
  ];

  return (
    <select
      value={selectedNature || ""}
      onChange={(e) => onNatureChange(e.target.value || null)}
      className="font-semibold w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-2xl capitalize 
      text-sm hover:border-gray-500 transition-colors cursor-pointer"
    >
      <option value="">{placeholder}</option>
      {natures.map((nature) => (
        <option key={nature} value={nature}>
          {nature.charAt(0).toUpperCase() + nature.slice(1)}
        </option>
      ))}
    </select>
  );
}
