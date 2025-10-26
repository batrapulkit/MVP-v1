// src/components/ProtectedRoute.tsx

import { useEffect, useState } from 'react';
import { fetchCurrentUser } from '@/api/services';
import { useLocation } from 'wouter';
import { Skeleton } from './ui/skeleton';
import { supabase } from '@/api/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [location, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        console.log('🔒 ProtectedRoute: Checking authentication...');

        // First, check if we have a Supabase session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError || !session) {
          console.log('❌ No Supabase session found, redirecting to signin');
          navigate(`/signin?redirect=${encodeURIComponent(location)}`);
          setLoading(false);
          return;
        }

        console.log('✅ Supabase session found, verifying with backend...');

        // Then verify with backend
        const res = await fetchCurrentUser();

        if (res.status === 200 && res.data?.user) {
          console.log('✅ User authorized:', res.data.user.email);
          setAuthorized(true);
        } else {
          console.log('❌ Backend verification failed, redirecting to signin');
          navigate(`/signin?redirect=${encodeURIComponent(location)}`);
        }
      } catch (err: any) {
        console.error('❌ ProtectedRoute error:', err.message);
        
        // If backend returns 401, sign out from Supabase
        if (err.response?.status === 401) {
          console.log('🔓 Signing out from Supabase due to 401');
          await supabase.auth.signOut();
        }
        
        navigate(`/signin?redirect=${encodeURIComponent(location)}`);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}
