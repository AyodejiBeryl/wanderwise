import { useQuery } from 'react-query';
import { Cloud, Sun, CloudRain, Snowflake, CloudFog, Loader2, Droplets, ThermometerSun } from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';

interface TripWeatherProps {
  tripId: string;
}

function weatherIcon(code: number | null) {
  if (code === null) return <Sun size={20} className="text-yellow-500" />;
  if (code <= 1) return <Sun size={20} className="text-yellow-500" />;
  if (code <= 3) return <Cloud size={20} className="text-gray-400" />;
  if (code <= 49) return <CloudFog size={20} className="text-gray-400" />;
  if (code <= 69) return <CloudRain size={20} className="text-blue-500" />;
  if (code <= 79) return <Snowflake size={20} className="text-blue-300" />;
  if (code <= 99) return <CloudRain size={20} className="text-blue-700" />;
  return <Cloud size={20} className="text-gray-400" />;
}

const TripWeather = ({ tripId }: TripWeatherProps) => {
  const { data, isLoading, error } = useQuery(
    ['weather', tripId],
    async () => {
      const res = await api.getWeather(tripId);
      return res.data;
    },
    { retry: 1, staleTime: 1000 * 60 * 30 } // Cache for 30 min
  );

  if (isLoading) {
    return (
      <div className="card mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
          <ThermometerSun className="text-primary-600" size={22} />
          Weather
        </h2>
        <div className="flex justify-center py-6">
          <Loader2 size={20} className="animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return null; // Silently hide if weather unavailable
  }

  return (
    <div className="card mb-6">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-1">
        <ThermometerSun className="text-primary-600" size={22} />
        Weather — {data.location}
      </h2>
      <p className="text-xs text-gray-400 mb-4">
        {data.dataType === 'forecast'
          ? 'Live forecast'
          : 'Historical climate averages (trip is too far ahead for a live forecast)'}
      </p>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {data.days.map((day: any) => (
          <div
            key={day.date}
            className="flex-shrink-0 bg-gray-50 rounded-lg p-3 text-center min-w-[90px]"
          >
            <p className="text-xs text-gray-500 mb-1">
              {format(new Date(day.date + 'T12:00:00'), 'EEE')}
            </p>
            <p className="text-xs text-gray-400 mb-2">
              {format(new Date(day.date + 'T12:00:00'), 'MMM d')}
            </p>
            <div className="flex justify-center mb-2">
              {weatherIcon(day.weatherCode)}
            </div>
            <p className="text-sm font-semibold text-gray-900">
              {day.tempMax}&deg;
            </p>
            <p className="text-xs text-gray-500">
              {day.tempMin}&deg;
            </p>
            {day.precipChance != null && (
              <p className="text-xs text-blue-500 flex items-center justify-center gap-0.5 mt-1">
                <Droplets size={10} />
                {day.precipChance}%
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripWeather;
