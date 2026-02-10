import { Link } from 'react-router-dom'
import { MapPin, Shield, Sparkles } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <h1 className="text-3xl font-bold text-primary-600">WanderWise</h1>
          <div className="flex gap-4">
            <Link to="/login" className="btn-secondary">Login</Link>
            <Link to="/register" className="btn-primary">Get Started</Link>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Plan Your Perfect Trip with AI
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Safety-first travel planning for everyone. Get personalized itineraries 
            with comprehensive safety insights tailored to your needs.
          </p>
          <Link to="/register" className="btn-primary text-lg px-8 py-3 inline-block">
            Start Planning Free
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-24">
          <div className="card text-center">
            <Sparkles className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI-Powered Itineraries</h3>
            <p className="text-gray-600">
              Get personalized day-by-day plans optimized for your budget and preferences
            </p>
          </div>
          <div className="card text-center">
            <Shield className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Safety First</h3>
            <p className="text-gray-600">
              Comprehensive safety reports addressing your specific concerns and needs
            </p>
          </div>
          <div className="card text-center">
            <MapPin className="w-12 h-12 text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Discover Hidden Gems</h3>
            <p className="text-gray-600">
              Find authentic experiences beyond typical tourist attractions
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
