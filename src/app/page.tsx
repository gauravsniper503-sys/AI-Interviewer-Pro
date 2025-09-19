'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/hooks/use-auth';
import {LoadingSpinner} from '@/components/shared/loading-spinner';

export default function RootPage() {
  const {user, loading} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/home');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  return <LoadingSpinner text="Initializing..." />;
}
