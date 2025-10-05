export default function AbilityDropdown({
  abilities = [],
  selectedAbility,
  onAbilityChange,
  placeholder = "Select Ability",
  disabled = false,
}) {
  return (
    <select
      value={selectedAbility || ""}
      onChange={(e) => onAbilityChange(e.target.value || null)}
      disabled={disabled || abilities.length === 0}
      className="font-semibold w-full px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-2xl capitalize 
      text-sm hover:border-gray-500 transition-colors cursor-pointer text-gray-200"
    >
      <option value="">{placeholder}</option>
      {abilities.map((ability) => (
        <option key={ability.name} value={ability.name}>
          {ability.name.replace("-", " ")}
          {ability.isHidden ? " (Hidden)" : ""}
        </option>
      ))}
    </select>
  );
}
