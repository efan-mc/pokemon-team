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
      className="font-semibold bg-gray-700"
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
