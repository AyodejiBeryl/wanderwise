import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Shield, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

interface Trip {
  id: string;
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  budget: number;
  currency: string;
  status: string;
  itinerary?: { id: string; generatedAt: string } | null;
  safetyReport?: { id: string; overallLevel: string } | null;
}

const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-700',
  PLANNED: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-green-100 text-green-700',
  COMPLETED: 'bg-purple-100 text-purple-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const safetyColors: Record<string, string> = {
  LOW: 'text-green-600',
  MODERATE: 'text-yellow-600',
  HIGH: 'text-orange-600',
  CRITICAL: 'text-red-600',
};

const TripCard = ({ trip }: { trip: Trip }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/trips/${trip.id}`)}
      className="card cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {trip.destination}
          </h3>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <MapPin size={14} />
            {trip.country}
          </p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[trip.status] || statusColors.DRAFT}`}
        >
          {trip.status.replace('_', ' ')}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar size={14} />
          <span>
            {format(new Date(trip.startDate), 'MMM d')} -{' '}
            {format(new Date(trip.endDate), 'MMM d, yyyy')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign size={14} />
          <span>
            {trip.budget.toLocaleString()} {trip.currency}
          </span>
        </div>
      </div>

      <div className="flex gap-3 mt-4 pt-3 border-t">
        <div
          className={`flex items-center gap-1 text-xs ${trip.itinerary ? 'text-primary-600' : 'text-gray-400'}`}
        >
          <Sparkles size={14} />
          <span>{trip.itinerary ? 'Itinerary ready' : 'No itinerary'}</span>
        </div>
        <div
          className={`flex items-center gap-1 text-xs ${
            trip.safetyReport
              ? safetyColors[trip.safetyReport.overallLevel] || 'text-gray-600'
              : 'text-gray-400'
          }`}
        >
          <Shield size={14} />
          <span>
            {trip.safetyReport
              ? `Safety: ${trip.safetyReport.overallLevel}`
              : 'No safety report'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
