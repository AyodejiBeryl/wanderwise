import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateTrip } from '../hooks/useTrips';
import {
  MapPin,
  Calendar,
  DollarSign,
  ArrowLeft,
  ArrowRight,
  Loader2,
} from 'lucide-react';

const tripSchema = z
  .object({
    destination: z.string().min(1, 'Destination is required'),
    country: z.string().min(1, 'Country is required'),
    city: z.string().optional(),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    budget: z
      .number({ invalid_type_error: 'Budget is required' })
      .positive('Budget must be positive'),
    currency: z.string().default('USD'),
    numberOfTravelers: z
      .number({ invalid_type_error: 'Required' })
      .int()
      .positive()
      .default(1),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: 'End date must be after start date',
    path: ['endDate'],
  });

type TripFormData = z.infer<typeof tripSchema>;

const STEPS = [
  { title: 'Destination', icon: MapPin, description: 'Where are you going?' },
  { title: 'Dates', icon: Calendar, description: 'When are you traveling?' },
  {
    title: 'Budget',
    icon: DollarSign,
    description: 'How much do you want to spend?',
  },
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const createTrip = useCreateTrip();

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<TripFormData>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      currency: 'USD',
      numberOfTravelers: 1,
    },
  });

  const stepFields: (keyof TripFormData)[][] = [
    ['destination', 'country', 'city'],
    ['startDate', 'endDate'],
    ['budget', 'currency', 'numberOfTravelers'],
  ];

  const handleNext = async () => {
    const isValid = await trigger(stepFields[step]);
    if (isValid) {
      setStep((s) => s + 1);
    }
  };

  const onSubmit = async (data: TripFormData) => {
    try {
      const trip = await createTrip.mutateAsync({
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      });
      navigate(`/trips/${trip.id}`);
    } catch {
      // Error handled by mutation
    }
  };

  const StepIcon = STEPS[step].icon;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((s, i) => (
          <div key={s.title} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                i <= step
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`ml-2 text-sm hidden sm:inline ${
                i <= step ? 'text-primary-600 font-medium' : 'text-gray-400'
              }`}
            >
              {s.title}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={`w-12 sm:w-24 h-0.5 mx-2 ${
                  i < step ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step header */}
      <div className="text-center mb-8">
        <StepIcon className="mx-auto text-primary-600 mb-3" size={40} />
        <h1 className="text-3xl font-bold text-gray-900">
          {STEPS[step].title}
        </h1>
        <p className="text-gray-600 mt-1">{STEPS[step].description}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card">
          {/* Step 1: Destination */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Destination
                </label>
                <input
                  {...register('destination')}
                  className="input-field"
                  placeholder="e.g., Tokyo, Japan"
                />
                {errors.destination && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.destination.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Country
                </label>
                <input
                  {...register('country')}
                  className="input-field"
                  placeholder="e.g., Japan"
                />
                {errors.country && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.country.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  City <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  {...register('city')}
                  className="input-field"
                  placeholder="e.g., Tokyo"
                />
              </div>
            </div>
          )}

          {/* Step 2: Dates */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  {...register('startDate')}
                  className="input-field"
                />
                {errors.startDate && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  {...register('endDate')}
                  className="input-field"
                />
                {errors.endDate && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Budget */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Total Budget
                </label>
                <input
                  type="number"
                  {...register('budget', { valueAsNumber: true })}
                  className="input-field"
                  placeholder="3000"
                />
                {errors.budget && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.budget.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Currency
                </label>
                <select {...register('currency')} className="input-field">
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="NGN">NGN - Nigerian Naira</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Number of Travelers
                </label>
                <input
                  type="number"
                  {...register('numberOfTravelers', { valueAsNumber: true })}
                  className="input-field"
                  min="1"
                />
                {errors.numberOfTravelers && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.numberOfTravelers.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() =>
              step === 0 ? navigate('/dashboard') : setStep((s) => s - 1)
            }
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={18} />
            {step === 0 ? 'Back to Dashboard' : 'Back'}
          </button>

          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="btn-primary flex items-center gap-2"
            >
              Next
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={createTrip.isLoading}
              className="btn-primary flex items-center gap-2"
            >
              {createTrip.isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Trip'
              )}
            </button>
          )}
        </div>

        {createTrip.isError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mt-4 text-sm">
            Failed to create trip. Please try again.
          </div>
        )}
      </form>
    </div>
  );
};

export default OnboardingPage;
