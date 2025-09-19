'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/hooks/use-auth';
import {LoadingSpinner} from '@/components/shared/loading-spinner';
import {Header} from '@/components/shared/header';

export default function MainLayout({children}: {children: React.ReactNode}) {
  const {user, loading} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner text="Authenticating..." />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex flex-col items-center p-4 sm:p-6 md:p-8">
        {children}
      </main>
    </>
  );
}
