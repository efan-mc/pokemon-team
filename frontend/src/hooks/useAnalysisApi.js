import { useState } from "react";
import { apiCall } from "../utils/api";

export function useAnalysisApi() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const analyseTeam = async (team) => {
        setIsLoading(true);
        setError(null);

        try {
              const result = await apiCall('/team-analysis', {
                  method: 'POST',
                  body: { team }
              });
              return result;
          } catch (err) {
              setError(err.message);
              throw err;
          } finally {
              setIsLoading(false);
          }
    };

    return { analyseTeam, isLoading, error }
}   