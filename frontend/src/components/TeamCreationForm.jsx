import { useState } from "react";
import { useTeamApi } from "../hooks/useTeamApi";

export default function TeamCreationForm({ team, onCreateTeam, onClear }) {
  const [teamName, setTeamName] = useState("");
  const [format, setFormat] = useState("singles");
  const [createdTeam, setCreatedTeam] = useState(null);
  const { createTeam, isLoading, error } = useTeamApi();

  const formats = [
    { value: "VGC", label: "VGC (Video Game Championships)" },
    { value: "Ubers", label: "Ubers" },
    { value: "Singles", label: "Singles OU" },
    { value: "Doubles", label: "Doubles OU" },
    { value: "UU", label: "UnderUsed (UU)" },
    { value: "RU", label: "RarelyUsed (RU)" },
    { value: "NU", label: "NeverUsed (NU)" },
    { value: "Little Cup", label: "Little Cup" },
    { value: "Monotype", label: "Monotype" },
    { value: "Custom", label: "Custom Format" },
  ];

  const transformTeamForApi = (team, teamName, format) => {
    const pokemon = team
      .filter((mon) => mon !== null)
      .map((mon) => ({
        species: mon.name,
        ability: mon.selectedAbility,
        nature: mon.selectedNature,
        moves:
          mon.selectedMoves
            ?.filter((move) => move !== null)
            .map((move) => move.name) || null,
      }));

    return {
      name: teamName,
      pokemon,
      format: format || undefined,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) {
      alert("Please enter a team name");
      return;
    }

    const teamData = transformTeamForApi(team, teamName, format);

    try {
      const result = await createTeam(teamData);
      setCreatedTeam(result);
      onCreateTeam?.(result);
    } catch (error) {}
  };

  const handleCreateAnother = () => {
    setCreatedTeam(null);
    setTeamName("");
    setFormat("VGC");
    onClear?.();
  };

  if (createdTeam) {
    return (
      <div>
        <div className="text-center">
          <h2>Team Created</h2>
        </div>

        <div>
          <div>
            <span>Team Name:</span> {createdTeam.name}
          </div>
          <div>
            <span>Format:</span> {createdTeam.format}
          </div>
          <div>
            <span>Team Code:</span>
            <div>{createdTeam.slug}</div>
          </div>
        </div>

        <button onClick={handleCreateAnother}>Create Another Team</button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Save Current Team</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="teamName">Team Name</label>
          <input
            type="text"
            id="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            maxLength={50}
            required
            className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-2xl"
          />
        </div>

        <div>
          <label htmlFor="format">Format</label>
          <select
            id="format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-2xl"
          >
            {formats.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="text-red-500">Error: {error}</div>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-2xl"
        >
          {isLoading ? "Creating Team..." : "Save Team"}
        </button>
      </form>
    </div>
  );
}
