import "./TypeIcons.css";
import { TYPE_ICONS } from "../utils/pokemonTypes";

// Renders type icons for Pokemon Type
export default function TypeIcons({ types = [], size = "normal" }) {
  const sizeClasses = {
    small: "h-[40px] w-[40px]",
    normal: "h-[75px] w-[75px]",
    large: "h-20 w-20",
  };

  const gapClasses = {
    small: "gap-1",
    normal: "gap-5",
    large: "gap-6",
  };

  return (
    <div className={`flex ${gapClasses[size]} justify-center`}>
      {/* Map types to styled icon elements */}
      {types.map((t) => (
        <div
          key={t.type.name}
          className={`icon ${t.type.name} ${sizeClasses[size]} flex items-center justify-center`}
        >
          {/* Type icon image */}
          <img
            src={TYPE_ICONS[t.type.name]}
            alt={t.type.name}
            loading="lazy"
            className="w-3/5 h-3/5 object-contain"
          />
        </div>
      ))}
    </div>
  );
}
