import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Users, UserPlus, X, Loader2, Mail } from 'lucide-react';
import api from '../services/api';

interface TripCollaboratorsProps {
  tripId: string;
}

const TripCollaborators = ({ tripId }: TripCollaboratorsProps) => {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer');
  const [error, setError] = useState('');

  const { data: collaborators, isLoading } = useQuery(
    ['collaborators', tripId],
    async () => {
      const res = await api.getCollaborators(tripId);
      return res.data.collaborators;
    }
  );

  const inviteMutation = useMutation(
    async () => {
      await api.inviteCollaborator(tripId, { email, role });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['collaborators', tripId]);
        setEmail('');
        setError('');
      },
      onError: (err: any) => {
        setError(err.response?.data?.message || 'Failed to invite');
      },
    }
  );

  const removeMutation = useMutation(
    async (collaboratorId: string) => {
      await api.removeCollaborator(tripId, collaboratorId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['collaborators', tripId]);
      },
    }
  );

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError('');
    inviteMutation.mutate();
  };

  return (
    <div className="card mb-6">
      <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
        <Users className="text-primary-600" size={22} />
        Trip Collaborators
      </h2>

      {/* Invite form */}
      <form onSubmit={handleInvite} className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="friend@example.com"
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-500"
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border border-gray-300 rounded-lg px-2 py-2 text-sm"
        >
          <option value="viewer">Viewer</option>
          <option value="editor">Editor</option>
        </select>
        <button
          type="submit"
          disabled={inviteMutation.isLoading || !email.trim()}
          className="btn-primary text-sm flex items-center gap-1"
        >
          {inviteMutation.isLoading ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <UserPlus size={14} />
          )}
          Invite
        </button>
      </form>

      {error && (
        <p className="text-red-600 text-sm mb-3">{error}</p>
      )}

      {/* Collaborator list */}
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 size={20} className="animate-spin text-gray-400" />
        </div>
      ) : collaborators?.length > 0 ? (
        <div className="space-y-2">
          {collaborators.map((c: any) => (
            <div key={c.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-medium">
                  {c.email[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{c.email}</p>
                  <div className="flex gap-2">
                    <span className="text-xs text-gray-500 capitalize">{c.role}</span>
                    <span className={`text-xs px-1.5 rounded ${
                      c.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeMutation.mutate(c.id)}
                className="p-1 text-gray-400 hover:text-red-500 rounded"
                title="Remove"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 text-center py-3">
          No collaborators yet. Invite friends to share this trip!
        </p>
      )}
    </div>
  );
};

export default TripCollaborators;
