import { useState } from "react";
import { useTeamApi } from "../hooks/useTeamApi";

export default function TeamCreationForm({ team, onCreateTeam }) {
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
    <div>
      <h2>Save Current Team</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="teamName">Team Name</label>
          <input
            type="text"
            id="teamName"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            maxLength={50}
            required
          />
        </div>

        <div>
          <label htmlFor="format">Format</label>
          <select
            id="format"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
            {formats.map((f) => {
              <option key={f.value} value={f.value}>
                {f.label}
              </option>;
            })}
          </select>
        </div>

        {error && <div className="text-red-500">Error: {error}</div>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? "Creating Team..." : "Save Team"}
        </button>
      </form>
    </div>
  );
}
