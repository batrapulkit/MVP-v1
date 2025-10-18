import { useEffect, useState } from 'react';
import { fetchCurrentUser } from '@/api/services';
import { useLocation } from 'wouter';
import { Skeleton } from './ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [location, navigate] = useLocation();  // current route and navigate
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetchCurrentUser();

        if (res.status === 200 && res.data?.user) {
          setAuthorized(true);
        } else {
          navigate(`/signin?redirect=${encodeURIComponent(location)}`);
        }
      } catch (err) {
        navigate(`/signin?redirect=${encodeURIComponent(location)}`);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [location, navigate]);

  if (loading) return <Skeleton />;

  return authorized ? <>{children}</> : null;
}
