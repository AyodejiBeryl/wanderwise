import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTrip, useDeleteTrip } from '../hooks/useTrips';
import { useGenerateItinerary } from '../hooks/useItinerary';
import { useGenerateSafetyReport } from '../hooks/useSafety';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  MapPin,
  Users,
  Loader2,
  Sparkles,
  Shield,
  Clock,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from 'lucide-react';
import { format } from 'date-fns';

const SAFETY_COLORS: Record<string, string> = {
  LOW: 'bg-green-100 text-green-800',
  MODERATE: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800',
};

const TripDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: trip, isLoading, error } = useTrip(id!);
  const generateItinerary = useGenerateItinerary();
  const generateSafetyReport = useGenerateSafetyReport();
  const deleteTrip = useDeleteTrip();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDelete = async () => {
    if (!id) return;
    try {
      await deleteTrip.mutateAsync(id);
      navigate('/dashboard');
    } catch {
      // Error handled by mutation
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Trip not found or failed to load.
        <button
          onClick={() => navigate('/dashboard')}
          className="ml-2 underline"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const startDate = new Date(trip.startDate);
  const endDate = new Date(trip.endDate);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {trip.destination}
          </h1>
          <p className="text-gray-600 mt-1">{trip.country}</p>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              trip.status === 'PLANNED'
                ? 'bg-green-100 text-green-700'
                : trip.status === 'DRAFT'
                  ? 'bg-gray-100 text-gray-700'
                  : trip.status === 'IN_PROGRESS'
                    ? 'bg-blue-100 text-blue-700'
                    : trip.status === 'COMPLETED'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-red-100 text-red-700'
            }`}
          >
            {trip.status}
          </span>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            title="Delete trip"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-lg mb-6">
          <p className="text-red-800 font-medium mb-3">
            Are you sure you want to delete this trip? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={deleteTrip.isLoading}
              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700"
            >
              {deleteTrip.isLoading ? 'Deleting...' : 'Yes, Delete'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Trip info cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="card flex items-center gap-3">
          <Calendar className="text-primary-600" size={20} />
          <div>
            <p className="text-xs text-gray-500">Dates</p>
            <p className="text-sm font-medium">
              {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <DollarSign className="text-primary-600" size={20} />
          <div>
            <p className="text-xs text-gray-500">Budget</p>
            <p className="text-sm font-medium">
              {trip.budget.toLocaleString()} {trip.currency}
            </p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <Users className="text-primary-600" size={20} />
          <div>
            <p className="text-xs text-gray-500">Travelers</p>
            <p className="text-sm font-medium">{trip.numberOfTravelers}</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <MapPin className="text-primary-600" size={20} />
          <div>
            <p className="text-xs text-gray-500">City</p>
            <p className="text-sm font-medium">{trip.city || 'Not set'}</p>
          </div>
        </div>
      </div>

      {/* Itinerary Section */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="text-primary-600" size={22} />
            Itinerary
          </h2>
          <button
            onClick={() => generateItinerary.mutate({ tripId: id! })}
            disabled={generateItinerary.isLoading}
            className="btn-primary text-sm flex items-center gap-2"
          >
            {generateItinerary.isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating...
              </>
            ) : trip.itinerary ? (
              'Regenerate'
            ) : (
              'Generate Itinerary'
            )}
          </button>
        </div>

        {generateItinerary.isError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            Failed to generate itinerary. Please try again.
          </div>
        )}

        {trip.itinerary ? (
          <div className="space-y-6">
            {trip.itinerary.days?.map((day: any) => (
              <div key={day.id} className="border-l-2 border-primary-200 pl-4">
                <h3 className="font-semibold text-gray-900">
                  Day {day.dayNumber}
                  {day.theme && (
                    <span className="text-primary-600 font-normal ml-2">
                      — {day.theme}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-gray-500 mb-3">
                  {format(new Date(day.date), 'EEEE, MMMM d, yyyy')}
                </p>
                <div className="space-y-3">
                  {day.activities?.map((activity: any) => (
                    <div
                      key={activity.id}
                      className="bg-gray-50 rounded-lg p-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">
                            {activity.name}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {activity.description}
                          </p>
                        </div>
                        <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full whitespace-nowrap">
                          {activity.category}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                        {activity.startTime && (
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {activity.startTime}
                          </span>
                        )}
                        {activity.duration && (
                          <span>{activity.duration} min</span>
                        )}
                        {activity.estimatedCost != null && (
                          <span>
                            {activity.estimatedCost} {activity.currency}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {activity.location}
                        </span>
                      </div>
                      {activity.safetyNotes && (
                        <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded mt-2 flex items-start gap-1">
                          <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                          {activity.safetyNotes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="mx-auto text-gray-300 mb-3" size={40} />
            <p>No itinerary yet. Click "Generate Itinerary" to create one.</p>
            <p className="text-xs mt-1">
              Our AI will create a personalized day-by-day plan for your trip.
            </p>
          </div>
        )}
      </div>

      {/* Safety Report Section */}
      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="text-primary-600" size={22} />
            Safety Report
          </h2>
          <button
            onClick={() => generateSafetyReport.mutate(id!)}
            disabled={generateSafetyReport.isLoading}
            className="btn-primary text-sm flex items-center gap-2"
          >
            {generateSafetyReport.isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Generating...
              </>
            ) : trip.safetyReport ? (
              'Regenerate'
            ) : (
              'Generate Safety Report'
            )}
          </button>
        </div>

        {generateSafetyReport.isError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            Failed to generate safety report. Please try again.
          </div>
        )}

        {trip.safetyReport ? (
          <div>
            {/* Overall assessment */}
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${SAFETY_COLORS[trip.safetyReport.overallLevel] || SAFETY_COLORS.MODERATE}`}
              >
                {trip.safetyReport.overallLevel} RISK
              </span>
            </div>
            <p className="text-gray-700 mb-6">{trip.safetyReport.summary}</p>

            {/* Sections */}
            <div className="space-y-3">
              {trip.safetyReport.sections?.map((section: any) => (
                <div
                  key={section.id}
                  className="border border-gray-200 rounded-lg"
                >
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          section.level === 'LOW'
                            ? 'bg-green-500'
                            : section.level === 'MODERATE'
                              ? 'bg-yellow-500'
                              : section.level === 'HIGH'
                                ? 'bg-orange-500'
                                : 'bg-red-500'
                        }`}
                      />
                      <span className="font-medium text-gray-900">
                        {section.title}
                      </span>
                    </div>
                    {expandedSections.has(section.id) ? (
                      <ChevronUp size={18} className="text-gray-400" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-400" />
                    )}
                  </button>
                  {expandedSections.has(section.id) && (
                    <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                      <p className="text-gray-700 text-sm mb-3">
                        {section.content}
                      </p>
                      {section.tips?.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                            Tips
                          </p>
                          <ul className="space-y-1">
                            {section.tips.map((tip: string, i: number) => (
                              <li
                                key={i}
                                className="text-sm text-gray-600 flex items-start gap-2"
                              >
                                <span className="text-primary-500 mt-1">
                                  •
                                </span>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {section.resources?.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-gray-500 uppercase mb-2">
                            Resources
                          </p>
                          <ul className="space-y-1">
                            {section.resources.map(
                              (resource: string, i: number) => (
                                <li
                                  key={i}
                                  className="text-sm text-primary-600"
                                >
                                  {resource}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Shield className="mx-auto text-gray-300 mb-3" size={40} />
            <p>
              No safety report yet. Click "Generate Safety Report" to create
              one.
            </p>
            <p className="text-xs mt-1">
              Get personalized safety tips based on your traveler profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetailPage;
