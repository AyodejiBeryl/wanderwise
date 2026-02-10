import { useNavigate } from 'react-router-dom';
import { Plus, MapPin, Loader2 } from 'lucide-react';
import { useTrips } from '../hooks/useTrips';
import TripCard from '../components/TripCard';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { data: trips, isLoading, error } = useTrips();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Failed to load trips. Please try again.
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Trips</h1>
          <p className="text-gray-600 mt-1">
            {trips && trips.length > 0
              ? `You have ${trips.length} trip${trips.length > 1 ? 's' : ''}`
              : 'Plan your first adventure'}
          </p>
        </div>
        <button
          onClick={() => navigate('/onboarding')}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Plan New Trip
        </button>
      </div>

      {!trips || trips.length === 0 ? (
        <div className="card text-center py-16">
          <MapPin className="mx-auto text-gray-300 mb-4" size={64} />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No trips yet
          </h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Start by creating your first trip. Our AI will generate a
            personalized itinerary and safety report tailored to your needs.
          </p>
          <button
            onClick={() => navigate('/onboarding')}
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus size={18} />
            Plan Your First Trip
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip: any) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
