import "./TypeIcons.css";
import { TYPE_ICONS } from "../utilities/pokemonTypes";

// Renders type icons for Pokemon Type
export default function TypeIcons({ types = [] }) {
  return (
    <div className="flex gap-5 justify-center mt-8">
      {/* Map types to styled icon elements */}
      {types.map((t) => (
        <div key={t.type.name} className={`icon ${t.type.name}`}>
          {/* Type icon image */}
          <img src={TYPE_ICONS[t.type.name]} alt={t.type.name} loading="lazy" />
        </div>
      ))}
    </div>
  );
}
