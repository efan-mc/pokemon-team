import { useState } from "react";
import { apiCall } from "../utils/api";

export function useTeamLoader() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadTeamBySlug = async (slug) => {
        setIsLoading(true);
        setError(null);

        try {
            const result = await apiCall(`/teams/${slug}`, {
                method: 'GET'
            })
            return result.data;
        } catch (error) {
            setError(error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return { loadTeamBySlug, isLoading, error };
}