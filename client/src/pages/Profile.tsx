import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/useUserStore";
import { fetchCurrentUser } from "@/api/services";
import { Button } from "@/components/ui/button";
import { User, Settings, Activity, Edit3, Mail, Shield, Hash, Calendar, MapPin, Phone, UserCheck, Clock, Key, Plane, DollarSign, Users } from "lucide-react";

type UserProfile = {
  user_id: string;
  user_name: string;
  full_name: string;
  first_name: string;
  last_name: string;
  phone: string;
  city: string;
  state: string;
  pincode: string;
  email: string;
  age: number;
  status: string;
  role_type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  auth_type: string;
};

function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { updated } = useUserStore();

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchCurrentUser();
        if (res.status === 200 && res.data?.user) {
          setUser(res.data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error loading user profile", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [updated]);

  const getRoleColor = (role: string) => {
    const colors = {
      admin: "bg-red-100 text-red-800 border-red-200",
      manager: "bg-blue-100 text-blue-800 border-blue-200",
      user: "bg-green-100 text-green-800 border-green-200",
      moderator: "bg-purple-100 text-purple-800 border-purple-200",
    };
    return colors[role.toLowerCase() as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800 border-green-200",
      inactive: "bg-red-100 text-red-800 border-red-200",
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return colors[status.toLowerCase() as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getAllItineraries = () => {
    const itineraries = [];
    
    // Loop through all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      
      // Find keys that match our chat history pattern
      if (key && key.startsWith('chatHistory-plan-')) {
        try {
          const data = localStorage.getItem(key);
          if (data) {
            const parsed = JSON.parse(data);
            const lastEntry = parsed[parsed.length - 1];
            
            if (lastEntry?.geminiResponse?.detailedPlan) {
              const planId = key.replace('chatHistory-', '');
              itineraries.push({
                planId: planId,
                destination: lastEntry.geminiResponse.detailedPlan.destination,
                thumbnail: lastEntry.geminiResponse.detailedPlan.thumbnail,
                duration: lastEntry.geminiResponse.detailedPlan.duration,
                budget: lastEntry.geminiResponse.detailedPlan.budget,
                travelers: lastEntry.geminiResponse.detailedPlan.travelers,
                totalDays: lastEntry.geminiResponse.detailedPlan.dailyPlan?.length || 0,
                createdAt: lastEntry.timestamp || new Date().toISOString(),
                userPrompt: lastEntry.userPrompt || '',
                interest: lastEntry.geminiResponse.detailedPlan.interest,
              });
            }
          }
        } catch (error) {
          console.error('Error parsing itinerary:', error);
        }
      }
    }
    
    // Sort by creation date (newest first)
    return itineraries.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "activity", label: "My Itineraries", icon: Plane },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent mb-4"></div>
          <p className="text-lg text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg border border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">User Not Found</h2>
          <p className="text-gray-600">We couldn't load your profile information.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 flex items-center justify-center text-4xl font-bold text-white shadow-2xl">
                {user.first_name?.charAt(0).toUpperCase()}{user.last_name?.charAt(0).toUpperCase()}
              </div>
              <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full border-4 border-white flex items-center justify-center ${
                user.is_active ? 'bg-green-500' : 'bg-gray-400'
              }`}>
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-3">
                {user.full_name}
              </h1>
              <p className="text-xl text-indigo-100 mb-2 flex items-center justify-center lg:justify-start gap-2">
                <User className="h-5 w-5" />
                @{user.user_name}
              </p>
              <p className="text-lg text-indigo-100 mb-4 flex items-center justify-center lg:justify-start gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <div className="inline-flex items-center gap-2">
                  <Shield className="h-5 w-5 text-indigo-200" />
                  <span className={`px-4 py-2 rounded-full border text-sm font-medium ${getRoleColor(user.role_type)} bg-white/90`}>
                    {user.role_type.charAt(0).toUpperCase() + user.role_type.slice(1)}
                  </span>
                </div>
                <span className={`px-4 py-2 rounded-full border text-sm font-medium ${getStatusColor(user.status)} bg-white/90`}>
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                onClick={() => window.location.href = "/edit-profile"}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-10">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 mb-8">
          <nav className="flex space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-indigo-600 text-white shadow-lg transform scale-105"
                      : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === "overview" && (
              <>
                {/* Profile Information Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                      <User className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
                      <p className="text-gray-600">Your personal details and account information</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <User className="h-5 w-5 text-gray-600 mt-0.5" />
                        <div>
                          <dt className="text-sm font-medium text-gray-500 mb-1">Full Name</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {user.full_name}
                          </dd>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <UserCheck className="h-5 w-5 text-gray-600 mt-0.5" />
                        <div>
                          <dt className="text-sm font-medium text-gray-500 mb-1">Username</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            @{user.user_name}
                          </dd>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <Mail className="h-5 w-5 text-gray-600 mt-0.5" />
                        <div>
                          <dt className="text-sm font-medium text-gray-500 mb-1">Email Address</dt>
                          <dd className="text-lg font-semibold text-gray-900 break-all">
                            {user.email}
                          </dd>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <Phone className="h-5 w-5 text-gray-600 mt-0.5" />
                        <div>
                          <dt className="text-sm font-medium text-gray-500 mb-1">Phone Number</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            +91 {user.phone}
                          </dd>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <Calendar className="h-5 w-5 text-gray-600 mt-0.5" />
                        <div>
                          <dt className="text-sm font-medium text-gray-500 mb-1">Age</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {user.age} years old
                          </dd>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                        <div>
                          <dt className="text-sm font-medium text-gray-500 mb-1">Location</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {user.city}, {user.state}
                          </dd>
                          <dd className="text-sm text-gray-600 mt-1">
                            PIN: {user.pincode}
                          </dd>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <Hash className="h-5 w-5 text-gray-600 mt-0.5" />
                        <div>
                          <dt className="text-sm font-medium text-gray-500 mb-1">User ID</dt>
                          <dd className="text-sm font-mono font-semibold text-gray-900 break-all">
                            {user.user_id}
                          </dd>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <Shield className="h-5 w-5 text-gray-600 mt-0.5" />
                        <div>
                          <dt className="text-sm font-medium text-gray-500 mb-1">Account Role</dt>
                          <dd className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(user.role_type)}`}>
                            {user.role_type.charAt(0).toUpperCase() + user.role_type.slice(1)}
                          </dd>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <Key className="h-5 w-5 text-gray-600 mt-0.5" />
                        <div>
                          <dt className="text-sm font-medium text-gray-500 mb-1">Authentication</dt>
                          <dd className="text-lg font-semibold text-gray-900 capitalize">
                            {user.auth_type} Login
                          </dd>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                        <Clock className="h-5 w-5 text-gray-600 mt-0.5" />
                        <div>
                          <dt className="text-sm font-medium text-gray-500 mb-1">Member Since</dt>
                          <dd className="text-lg font-semibold text-gray-900">
                            {formatDate(user.created_at)}
                          </dd>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-14 justify-start gap-3 text-left" onClick={() => window.location.href = "/edit-profile"}>
                      <Edit3 className="h-5 w-5 text-indigo-600" />
                      <div>
                        <div className="font-medium">Update Profile</div>
                        <div className="text-sm text-gray-500">Edit your personal information</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="h-14 justify-start gap-3 text-left" onClick={() => setActiveTab("activity")}>
                      <Plane className="h-5 w-5 text-indigo-600" />
                      <div>
                        <div className="font-medium">View Itineraries</div>
                        <div className="text-sm text-gray-500">See all your travel plans</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </>
            )}

            {activeTab === "activity" && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Plane className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Your Itineraries</h3>
                      <p className="text-gray-600">All your travel plans in one place</p>
                    </div>
                  </div>
                  <Button 
                    onClick={() => window.location.href = "/"}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                  >
                    <Plane className="h-4 w-4 mr-2" />
                    New Trip
                  </Button>
                </div>

                {(() => {
                  const itineraries = getAllItineraries();
                  
                  if (itineraries.length === 0) {
                    return (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Plane className="h-12 w-12 text-indigo-600" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-3">No Itineraries Yet</h4>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                          Start planning your first adventure! Create a personalized travel itinerary with our AI-powered planner.
                        </p>
                        <Button 
                          onClick={() => window.location.href = "/"}
                          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg px-8 py-6 text-lg"
                        >
                          <Plane className="h-5 w-5 mr-2" />
                          Create Your First Itinerary
                        </Button>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-4">
                      <div className="mb-4 text-sm text-gray-600">
                        Showing {itineraries.length} itinerary{itineraries.length !== 1 ? 's' : ''}
                      </div>
                      
                      {itineraries.map((itinerary, index) => (
                        <div
                          key={itinerary.planId}
                          className="group relative border-2 border-gray-200 rounded-2xl p-6 hover:border-indigo-400 hover:shadow-2xl transition-all duration-300 cursor-pointer bg-gradient-to-br from-white to-gray-50"
                          onClick={() => window.location.href = `/itinerary/${itinerary.planId.replace('plan-', '')}`}
                        >
                          {/* Gradient overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          <div className="relative flex items-start gap-4">
                            {/* Number Badge with Gradient */}
                            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                              {index + 1}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-4 mb-3">
                                <div className="flex-1">
                                  <h4 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-1">
                                    {itinerary.destination}
                                  </h4>
                                  <p className="text-sm text-gray-500 flex items-center gap-1.5">
                                    <Clock className="h-3.5 w-3.5" />
                                    Created {formatDate(itinerary.createdAt)}
                                  </p>
                                </div>
                                <Button
                                  size="sm"
                                  className="flex-shrink-0 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.location.href = `/itinerary/${itinerary.planId.replace('plan-', '')}`;
                                  }}
                                >
                                  View Plan
                                </Button>
                              </div>

                              {/* Details Grid */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                <div className="flex items-center gap-2 text-sm bg-white rounded-lg px-3 py-2 border border-gray-200">
                                  <Calendar className="h-4 w-4 text-indigo-600" />
                                  <span className="font-medium text-gray-700">{itinerary.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm bg-white rounded-lg px-3 py-2 border border-gray-200">
                                  <Users className="h-4 w-4 text-purple-600" />
                                  <span className="font-medium text-gray-700">
                                    {itinerary.travelers} traveler{itinerary.travelers > 1 ? 's' : ''}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm bg-white rounded-lg px-3 py-2 border border-gray-200">
                                  <Activity className="h-4 w-4 text-green-600" />
                                  <span className="font-medium text-gray-700">
                                    {itinerary.totalDays} day{itinerary.totalDays > 1 ? 's' : ''}
                                  </span>
                                </div>
                                {itinerary.budget && (
                                  <div className="flex items-center gap-2 text-sm bg-white rounded-lg px-3 py-2 border border-gray-200">
                                    <DollarSign className="h-4 w-4 text-yellow-600" />
                                    <span className="font-medium text-gray-700 truncate">
                                      {itinerary.budget}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-2">
                                {itinerary.thumbnail && (
                                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-200">
                                    <MapPin className="h-3 w-3" />
                                    {itinerary.thumbnail}
                                  </div>
                                )}
                                {itinerary.interest && (
                                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 rounded-full text-xs font-medium border border-purple-200">
                                    <Activity className="h-3 w-3" />
                                    {itinerary.interest}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Hover arrow indicator */}
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h3>
                <p className="text-gray-600">Settings panel coming soon...</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Travel Stats */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plane className="h-5 w-5" />
                Travel Stats
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-white/10 backdrop-blur rounded-lg px-4 py-3">
                  <span className="text-sm">Total Itineraries</span>
                  <span className="text-2xl font-bold">{getAllItineraries().length}</span>
                </div>
                <div className="flex items-center justify-between bg-white/10 backdrop-blur rounded-lg px-4 py-3">
                  <span className="text-sm">This Month</span>
                  <span className="text-2xl font-bold">
                    {getAllItineraries().filter(it => {
                      const created = new Date(it.createdAt);
                      const now = new Date();
                      return created.getMonth() === now.getMonth() && 
                             created.getFullYear() === now.getFullYear();
                    }).length}
                  </span>
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(user.status)}`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Account Active</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.is_active ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="text-gray-900 font-medium">
                    {formatDate(user.created_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="text-gray-900 font-medium">
                    {formatDate(user.updated_at)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Auth Method</span>
                  <span className="text-gray-900 font-medium capitalize">
                    {user.auth_type}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Profile Completion</h4>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-indigo-600 font-medium">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Complete your profile to unlock all features and improve your experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
