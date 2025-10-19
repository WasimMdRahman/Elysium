
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { getAuth, signInAnonymously, createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthErrorCodes } from 'firebase/auth';
import { useUser } from '@/firebase';
import { Loader } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const { user, isUserLoading } = useUser();
    const auth = getAuth();

    // Redirect if user is already logged in
    if (isUserLoading) {
        return <div className="flex justify-center items-center h-full"><Loader className="animate-spin" /></div>;
    }

    if (user) {
        router.push('/dashboard');
        return null;
    }


    const handleAuthAction = async (action: 'login' | 'signup') => {
        if (!email || !password) {
            toast({ variant: 'destructive', title: 'Error', description: 'Email and password cannot be empty.' });
            return;
        }
        setIsLoading(true);
        try {
            if (action === 'signup') {
                await createUserWithEmailAndPassword(auth, email, password);
                toast({ title: 'Success', description: 'Account created successfully! Redirecting...' });
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                toast({ title: 'Success', description: 'Logged in successfully! Redirecting...' });
            }
            router.push('/dashboard');
        } catch (error: any) {
            let description = 'An unexpected error occurred.';
            if (error.code === AuthErrorCodes.EMAIL_EXISTS) {
                description = 'This email is already in use. Please try logging in.';
            } else if (error.code === AuthErrorCodes.WEAK_PASSWORD) {
                description = 'The password is too weak. Please use at least 6 characters.';
            } else if (error.code === AuthErrorCodes.INVALID_EMAIL) {
                description = 'The email address is not valid.';
            } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                 description = 'Invalid email or password.';
            }
            toast({ variant: 'destructive', title: 'Authentication Failed', description });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnonymousSignIn = async () => {
        setIsLoading(true);
        try {
            await signInAnonymously(auth);
            toast({ title: 'Signed in Anonymously', description: 'You can explore the app. Create an account to save your data.' });
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not sign in anonymously.' });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex justify-center items-center">
            <Tabs defaultValue="login" className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Welcome Back</CardTitle>
                            <CardDescription>Sign in to access your synced data.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="login-email">Email</Label>
                                <Input id="login-email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="login-password">Password</Label>
                                <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-4">
                            <Button onClick={() => handleAuthAction('login')} className="w-full" disabled={isLoading}>
                                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                                Login
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="signup">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create an Account</CardTitle>
                            <CardDescription>Sign up to save your progress and sync across devices.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="signup-email">Email</Label>
                                <Input id="signup-email" type="email" placeholder="m@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signup-password">Password</Label>
                                <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => handleAuthAction('signup')} className="w-full" disabled={isLoading}>
                                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                                Sign Up
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <div className="relative mt-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>
                 <div className="mt-6">
                    <Button variant="outline" className="w-full" onClick={handleAnonymousSignIn} disabled={isLoading}>
                        {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In Anonymously'}
                    </Button>
                 </div>
            </Tabs>
        </div>
    );
}
