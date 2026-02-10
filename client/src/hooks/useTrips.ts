import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../services/api';

export const useTrips = () => {
  return useQuery('trips', async () => {
    const response = await api.getTrips();
    return response.data.trips;
  });
};

export const useTrip = (id: string) => {
  return useQuery(
    ['trip', id],
    async () => {
      const response = await api.getTrip(id);
      return response.data.trip;
    },
    { enabled: !!id }
  );
};

export const useCreateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (data: {
      destination: string;
      country: string;
      city?: string;
      startDate: string;
      endDate: string;
      budget: number;
      currency: string;
      numberOfTravelers: number;
    }) => {
      const response = await api.createTrip(data);
      return response.data.trip;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('trips');
      },
    }
  );
};

export const useUpdateTrip = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      const response = await api.updateTrip(id, data);
      return response.data.trip;
    },
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries('trips');
        queryClient.invalidateQueries(['trip', variables.id]);
      },
    }
  );
};

export const useDeleteTrip = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: string) => {
      await api.deleteTrip(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('trips');
      },
    }
  );
};
