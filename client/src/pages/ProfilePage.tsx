import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Shield, Loader2, Save, Check } from 'lucide-react';
import api from '../services/api';

const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
});

const safetyProfileSchema = z.object({
  isLGBTQ: z.boolean(),
  isSoloFemale: z.boolean(),
  hasAccessibilityNeeds: z.boolean(),
  religiousMinority: z.boolean(),
  dietaryRestrictions: z.string(),
  languageBarriers: z.string(),
  preferredBudgetLevel: z.string(),
  travelStyle: z.string(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type SafetyFormData = z.infer<typeof safetyProfileSchema>;

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [profileSaved, setProfileSaved] = useState(false);
  const [safetySaved, setSafetySaved] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [safetySaving, setSafetySaving] = useState(false);
  const [error, setError] = useState('');

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  const {
    register: registerSafety,
    handleSubmit: handleSafetySubmit,
    reset: resetSafety,
  } = useForm<SafetyFormData>({
    defaultValues: {
      isLGBTQ: false,
      isSoloFemale: false,
      hasAccessibilityNeeds: false,
      religiousMinority: false,
      dietaryRestrictions: '',
      languageBarriers: '',
      preferredBudgetLevel: '',
      travelStyle: '',
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.getUserProfile();
        const user = response.data.user;

        resetProfile({
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phone: user.phone || '',
        });

        if (user.safetyProfile) {
          resetSafety({
            isLGBTQ: user.safetyProfile.isLGBTQ || false,
            isSoloFemale: user.safetyProfile.isSoloFemale || false,
            hasAccessibilityNeeds:
              user.safetyProfile.hasAccessibilityNeeds || false,
            religiousMinority:
              user.safetyProfile.religiousMinority || false,
            dietaryRestrictions:
              (user.safetyProfile.dietaryRestrictions || []).join(', '),
            languageBarriers:
              (user.safetyProfile.languageBarriers || []).join(', '),
            preferredBudgetLevel:
              user.safetyProfile.preferredBudgetLevel || '',
            travelStyle: user.safetyProfile.travelStyle || '',
          });
        }
      } catch {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [resetProfile, resetSafety]);

  const onProfileSubmit = async (data: ProfileFormData) => {
    try {
      setProfileSaving(true);
      setError('');
      await api.updateUserProfile(data);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch {
      setError('Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const onSafetySubmit = async (data: SafetyFormData) => {
    try {
      setSafetySaving(true);
      setError('');
      await api.updateSafetyProfile({
        isLGBTQ: data.isLGBTQ,
        isSoloFemale: data.isSoloFemale,
        hasAccessibilityNeeds: data.hasAccessibilityNeeds,
        religiousMinority: data.religiousMinority,
        dietaryRestrictions: data.dietaryRestrictions
          ? data.dietaryRestrictions
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        languageBarriers: data.languageBarriers
          ? data.languageBarriers
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
        preferredBudgetLevel: data.preferredBudgetLevel || null,
        travelStyle: data.travelStyle || null,
      });
      setSafetySaved(true);
      setTimeout(() => setSafetySaved(false), 2000);
    } catch {
      setError('Failed to update safety profile.');
    } finally {
      setSafetySaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Personal Info */}
      <div className="card mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
          <User className="text-primary-600" size={22} />
          Personal Information
        </h2>

        <form
          onSubmit={handleProfileSubmit(onProfileSubmit)}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First Name
              </label>
              <input
                {...registerProfile('firstName')}
                className="input-field"
                placeholder="First name"
              />
              {profileErrors.firstName && (
                <p className="text-red-600 text-sm mt-1">
                  {profileErrors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Last Name
              </label>
              <input
                {...registerProfile('lastName')}
                className="input-field"
                placeholder="Last name"
              />
              {profileErrors.lastName && (
                <p className="text-red-600 text-sm mt-1">
                  {profileErrors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              {...registerProfile('phone')}
              className="input-field"
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <button
            type="submit"
            disabled={profileSaving}
            className="btn-primary flex items-center gap-2"
          >
            {profileSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : profileSaved ? (
              <Check size={16} />
            ) : (
              <Save size={16} />
            )}
            {profileSaved ? 'Saved!' : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* Safety Profile */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
          <Shield className="text-primary-600" size={22} />
          Safety Profile
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          This information personalizes your safety reports. All data is kept
          private.
        </p>

        <form
          onSubmit={handleSafetySubmit(onSafetySubmit)}
          className="space-y-4"
        >
          {/* Checkboxes */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...registerSafety('isLGBTQ')}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-sm">LGBTQ+ Traveler</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...registerSafety('isSoloFemale')}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-sm">Solo Female Traveler</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...registerSafety('hasAccessibilityNeeds')}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-sm">Accessibility Needs</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                {...registerSafety('religiousMinority')}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-sm">Religious Minority</span>
            </label>
          </div>

          {/* Text inputs */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Dietary Restrictions
            </label>
            <input
              {...registerSafety('dietaryRestrictions')}
              className="input-field"
              placeholder="e.g., Halal, Vegan, Gluten-free (comma separated)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Language Barriers
            </label>
            <input
              {...registerSafety('languageBarriers')}
              className="input-field"
              placeholder="e.g., No Japanese, Basic Spanish (comma separated)"
            />
          </div>

          {/* Selects */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Budget Level
              </label>
              <select
                {...registerSafety('preferredBudgetLevel')}
                className="input-field"
              >
                <option value="">Select...</option>
                <option value="budget">Budget</option>
                <option value="moderate">Moderate</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Travel Style
              </label>
              <select
                {...registerSafety('travelStyle')}
                className="input-field"
              >
                <option value="">Select...</option>
                <option value="adventurous">Adventurous</option>
                <option value="relaxed">Relaxed</option>
                <option value="cultural">Cultural</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={safetySaving}
            className="btn-primary flex items-center gap-2"
          >
            {safetySaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : safetySaved ? (
              <Check size={16} />
            ) : (
              <Save size={16} />
            )}
            {safetySaved ? 'Saved!' : 'Save Safety Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
