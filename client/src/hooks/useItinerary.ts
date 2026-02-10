import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../services/api';

export const useItinerary = (tripId: string) => {
  return useQuery(
    ['itinerary', tripId],
    async () => {
      const response = await api.getItinerary(tripId);
      return response.data.itinerary;
    },
    {
      enabled: !!tripId,
      retry: false,
    }
  );
};

export const useGenerateItinerary = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (input: {
      tripId: string;
      preferences?: {
        activities?: string[];
        pacePreference?: 'relaxed' | 'moderate' | 'packed';
        includeDowntime?: boolean;
      };
    }) => {
      const response = await api.generateItinerary(input);
      return response.data.itinerary;
    },
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries(['itinerary', variables.tripId]);
        queryClient.invalidateQueries(['trip', variables.tripId]);
        queryClient.invalidateQueries('trips');
      },
    }
  );
};
