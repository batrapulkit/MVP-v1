// src/App.tsx

import { useEffect } from 'react';
import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { supabase } from '@/api/client';
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import MyTrips from "@/pages/MyTrips";
import ItineraryDetails from "@/pages/ItineraryDetails";
import DempItineraryDetails from "@/pages/DempItineraryDetails";
import Explore from "@/pages/Explore";
import LocationErrorBanner from "./components/LocationErrorBanner";
import AuthCallback from './pages/AuthCallback';
import Hotels from "@/pages/Hotels";
import Events from "@/pages/Events";
import Feed from "@/pages/Feed";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicRoute from "@/components/PublicRoute";
import SignIn from "@/pages/SignIn";
import useUserLocation from "@/components/hooks/useUserLocation";
import Profile from "@/pages/Profile";
import SignUp from "@/pages/SignUp";
import About from "@/pages/About";
import ARVR from "@/pages/ARVR";
import Pricing from "@/pages/Pricing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Blogs from "@/pages/blogs";
import BlogDetails from "@/pages/blogDetails";
import Flights from "@/pages/Flights";
import LiveChatbot from "@/components/LiveChatbot";
import ChatBot from "@/components/ChatBot";
import EditProfile from "./pages/EditProfile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/my-trips" component={MyTrips} />
      <Route path="/explore" component={Explore} />
      <Route path="/hotels" component={Hotels} />
      <Route path="/events" component={Events} />
      <Route path="/chatbot" component={ChatBot} />
      <Route path="/edit-profile" component={EditProfile} />
      <Route path="/blogs" component={Blogs} />
      <Route path="/blogs/:id" component={BlogDetails} />
      
      <Route path="/profile">
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      </Route>

      <Route path="/itinerary/:id">
        <ProtectedRoute>
          <ItineraryDetails />
        </ProtectedRoute>
      </Route>

      <Route path="/itinerary/details/:id">
        <ProtectedRoute>  
          <DempItineraryDetails />
        </ProtectedRoute>
      </Route>

      <Route path="/feed" component={Feed} />
      <Route path="/flights" component={Flights} />
      <Route path="/about" component={About} />
      <Route path="/ar-vr" component={ARVR} />
      <Route path="/pricing" component={Pricing} />
      
      <Route path="/signin">
        <PublicRoute>
          <SignIn />
        </PublicRoute>
      </Route>

      <Route path="/auth/callback">
        <PublicRoute>
          <AuthCallback />
        </PublicRoute>
      </Route>

      <Route path="/signup">
        <PublicRoute>
          <SignUp />
        </PublicRoute>
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { locationError } = useUserLocation();

  useEffect(() => {
    console.log('🚀 App initialized - Setting up Supabase auth listener');

    // Listen for Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔐 Supabase auth event:', event);
      
      if (event === 'SIGNED_IN') {
        console.log('✅ User signed in with Supabase');
      } else if (event === 'SIGNED_OUT') {
        console.log('🔓 User signed out from Supabase');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Supabase token refreshed');
      }
    });

    return () => {
      console.log('🧹 Cleaning up Supabase auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  return (
    <WouterRouter>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen flex flex-col font-inter text-dark">
          <Header />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
          <LiveChatbot />
        </div>
        <LocationErrorBanner message={locationError || ""} />
        <Toaster />
      </QueryClientProvider>
    </WouterRouter>
  );
}

export default App;
