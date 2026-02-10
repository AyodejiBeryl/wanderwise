import { useMutation, useQueryClient } from 'react-query';
import api from '../services/api';

export const useGenerateHotelSuggestions = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (tripId: string) => {
      const response = await api.generateHotelSuggestions({ tripId });
      return response.data.hotelSuggestions;
    },
    {
      onSuccess: (_data, tripId) => {
        queryClient.invalidateQueries(['trip', tripId]);
        queryClient.invalidateQueries('trips');
      },
    }
  );
};

export const useGenerateFlightSuggestions = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (tripId: string) => {
      const response = await api.generateFlightSuggestions({ tripId });
      return response.data.flightSuggestions;
    },
    {
      onSuccess: (_data, tripId) => {
        queryClient.invalidateQueries(['trip', tripId]);
        queryClient.invalidateQueries('trips');
      },
    }
  );
};
