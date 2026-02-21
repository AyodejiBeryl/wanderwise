import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Users,
  Loader2,
  Sparkles,
  Tag,
} from 'lucide-react';
import api from '../services/api';

const CATEGORY_COLORS: Record<string, string> = {
  'Food-focused': 'bg-orange-100 text-orange-700',
  'Adventure': 'bg-green-100 text-green-700',
  'Cultural exploration': 'bg-purple-100 text-purple-700',
  'Relaxation': 'bg-blue-100 text-blue-700',
};

const TemplatesPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All');

  const { data: templates, isLoading } = useQuery(
    'templates',
    async () => {
      const res = await api.getTemplates();
      return res.data.templates;
    }
  );

  const categorySet = new Set<string>((templates || []).map((t: any) => t.category));
  const categories = ['All', ...categorySet];
  const filtered = filter === 'All'
    ? templates
    : templates?.filter((t: any) => t.category === filter);

  const useTemplate = (template: any) => {
    const params = new URLSearchParams({
      destination: template.destination,
      country: template.country,
      city: template.city || '',
      budget: template.estimatedBudget.toString(),
      currency: template.currency,
      numberOfTravelers: template.numberOfTravelers.toString(),
      durationDays: template.durationDays.toString(),
    });
    navigate(`/onboarding?${params.toString()}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-primary-600" size={32} />
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={18} />
        Back to Dashboard
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Sparkles className="text-primary-600" size={28} />
          Trip Templates
        </h1>
        <p className="text-gray-600 mt-1">
          Start from a curated template and customize it to your liking.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat: string) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === cat
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered?.map((template: any) => (
          <div key={template.id} className="card hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-gray-900 text-lg leading-tight">
                {template.title}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ml-2 ${
                CATEGORY_COLORS[template.category] || 'bg-gray-100 text-gray-700'
              }`}>
                {template.category}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4">{template.description}</p>

            <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <MapPin size={12} />
                {template.destination}, {template.country}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {template.durationDays} days
              </span>
              <span className="flex items-center gap-1">
                <DollarSign size={12} />
                ~{template.estimatedBudget} {template.currency}
              </span>
              <span className="flex items-center gap-1">
                <Users size={12} />
                {template.numberOfTravelers}
              </span>
            </div>

            {/* Highlights */}
            <div className="mb-4">
              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Highlights</p>
              <div className="flex flex-wrap gap-1.5">
                {template.highlights.map((h: string, i: number) => (
                  <span key={i} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded">
                    {h}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Tag size={12} />
                Best: {template.bestSeason}
              </span>
              <button
                onClick={() => useTemplate(template)}
                className="btn-primary text-sm"
              >
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesPage;
