import { useState } from "react";
import { apiCall } from "../utils/api";

export function useTeamApi() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const createTeam = async (teamData) => {
        setIsLoading(true);
        setError(null);

        try {
              const result = await apiCall('/teams', {
                  method: 'POST',
                  body: teamData
              });
              return result.data;
          } catch (err) {
              setError(err.message);
              throw err;
          } finally {
              setIsLoading(false);
          }
    };

    return { createTeam, isLoading, error }
}   