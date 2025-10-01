import { useState } from "react";
import { apiCall } from "../utils/api";

export function useTeamImport() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const importFromShowdown = async (showdownText, teamName, format) => {
        setIsLoading(true);
        setError(null);

        try {
              const result = await apiCall('/teams/import', {
                  method: 'POST',
                  body: { showdownText, teamName, format }
              });
              return result.data;
          } catch (err) {
              setError(err.message);
              throw err;
          } finally {
              setIsLoading(false);
          }
    };

    return { importFromShowdown, isLoading, error }
}   