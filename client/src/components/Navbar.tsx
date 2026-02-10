import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Plus } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/dashboard"
            className="text-2xl font-bold text-primary-600"
          >
            WanderWise
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/onboarding"
              className="flex items-center gap-1 bg-primary-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-primary-700 transition-colors"
            >
              <Plus size={16} />
              <span>New Trip</span>
            </Link>
            {user && (
              <span className="text-sm text-gray-500 hidden sm:inline">
                {user.firstName || user.email}
              </span>
            )}
            <Link
              to="/profile"
              className="flex items-center gap-2 text-gray-700 hover:text-primary-600"
            >
              <User size={20} />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-700 hover:text-red-600"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
