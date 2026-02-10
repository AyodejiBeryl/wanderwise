import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../services/api';

export const useSafetyReport = (tripId: string) => {
  return useQuery(
    ['safetyReport', tripId],
    async () => {
      const response = await api.getSafetyReport(tripId);
      return response.data.safetyReport;
    },
    {
      enabled: !!tripId,
      retry: false,
    }
  );
};

export const useGenerateSafetyReport = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (tripId: string) => {
      const response = await api.generateSafetyReport({ tripId });
      return response.data.safetyReport;
    },
    {
      onSuccess: (_data, tripId) => {
        queryClient.invalidateQueries(['safetyReport', tripId]);
        queryClient.invalidateQueries(['trip', tripId]);
        queryClient.invalidateQueries('trips');
      },
    }
  );
};
