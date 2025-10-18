import { useEffect, useState } from 'react';
import { fetchCurrentUser } from '@/api/services';
import { useLocation } from 'wouter';
import { Skeleton } from './ui/skeleton'; // Optional loading UI

interface PublicRouteProps {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const [, navigate] = useLocation();
  const [loading, setLoading] = useState(true);
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetchCurrentUser();

        if (res.status === 200 && res.data?.user) {
          // If authenticated, redirect to home or dashboard
          navigate('/');
        } else {
          setIsPublic(true);
        }
      } catch {
        setIsPublic(true); // treat as not logged in
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <Skeleton />;

  return isPublic ? <>{children}</> : null;
}
