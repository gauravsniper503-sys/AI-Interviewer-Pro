'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {signInWithPopup} from 'firebase/auth';
import {auth, provider} from '@/lib/firebase';
import {useAuth} from '@/hooks/use-auth';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Sparkles} from 'lucide-react';

export default function LoginPage() {
  const {user, loading} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google', error);
    }
  };

  if (loading || user) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Sparkles className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm shadow-lg border-primary/20">
        <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
                <Sparkles className="w-8 h-8 text-primary" />
                <h1 className="text-3xl font-headline tracking-tight">
                    AI Interviewer
                </h1>
            </div>
          <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to continue to your personal interview coach.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSignIn} className="w-full">
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 64.5C308 95.6 282.2 81.6 248 81.6c-84.3 0-152.3 67.8-152.3 151.3s68 151.3 152.3 151.3c99.1 0 129.2-80.3 132.3-118.4H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
