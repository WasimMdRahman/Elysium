
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, AuthErrorCodes, signInAnonymously } from 'firebase/auth';
import { useUser } from '@/firebase';
import { Loader, UserPlus, LogIn, Save } from 'lucide-react';

// Function to generate a unique, gamer-style username
const generateUsername = () => {
    const parts = [
        Math.random().toString(36).substring(2, 6),
        Math.random().toString(36).substring(2, 6),
        Math.random().toString(36).substring(2, 6),
    ];
    return `Elysium-${parts.join('-').toUpperCase()}`;
}

const APP_DOMAIN = "elysium.app"; // Our internal app domain

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newGeneratedUsername, setNewGeneratedUsername] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isGuestLoading, setGuestLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const { user, isUserLoading } = useUser();
    const auth = getAuth();

    useEffect(() => {
        setNewGeneratedUsername(generateUsername());
    }, []);

    // Redirect if user is already logged in
    if (isUserLoading) {
        return <div className="flex justify-center items-center h-full"><Loader className="animate-spin" /></div>;
    }

    if (user) {
        router.push('/dashboard');
        return null;
    }

    const handleCreateAccount = async () => {
        if (!password) {
            toast({ variant: 'destructive', title: 'Error', description: 'Password cannot be empty.' });
            return;
        }
        setIsLoading(true);
        const fakeEmail = `${newGeneratedUsername}@${APP_DOMAIN}`;
        try {
            await createUserWithEmailAndPassword(auth, fakeEmail, password);
            toast({ 
                title: 'Account Created!', 
                description: `Your username is ${newGeneratedUsername}. Keep it safe!`
            });
            router.push('/dashboard');
        } catch (error: any) {
            let description = 'An unexpected error occurred.';
            if (error.code === AuthErrorCodes.WEAK_PASSWORD) {
                description = 'The password is too weak. Please use at least 6 characters.';
            }
             toast({ variant: 'destructive', title: 'Creation Failed', description });
        } finally {
            setIsLoading(false);
        }
    }

    const handleRecoverAccount = async () => {
        if (!username || !password) {
            toast({ variant: 'destructive', title: 'Error', description: 'Username and password cannot be empty.' });
            return;
        }
        setIsLoading(true);
        const fakeEmail = `${username}@${APP_DOMAIN}`;
        try {
            await signInWithEmailAndPassword(auth, fakeEmail, password);
            toast({ title: 'Welcome Back!', description: 'Logged in successfully!' });
            router.push('/dashboard');
        } catch (error: any)
        {
            toast({ variant: 'destructive', title: 'Login Failed', description: 'Invalid username or password.' });
        } finally {
            setIsLoading(false);
        }
    }
    
    const handleAnonymousSignIn = async () => {
        setGuestLoading(true);
        try {
            await signInAnonymously(auth);
            toast({ title: 'Signed in Anonymously', description: 'You can explore the app. Create a full account to save your data permanently.' });
            router.push('/dashboard');
        } catch (error) {
            console.error(error);
            toast({ variant: 'destructive', title: 'Error', description: 'Could not sign in anonymously.' });
        } finally {
            setGuestLoading(false);
        }
    }


    return (
        <div className="flex justify-center items-center">
            <Tabs defaultValue="create" className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="create"><UserPlus className="mr-2 h-4 w-4"/> New Player</TabsTrigger>
                    <TabsTrigger value="recover"><LogIn className="mr-2 h-4 w-4"/> Recover Account</TabsTrigger>
                </TabsList>
                <TabsContent value="create">
                    <Card>
                        <CardHeader>
                            <CardTitle>Start Your Journey</CardTitle>
                            <CardDescription>We've generated a unique, private username for you. Set a password to secure your account and save your progress in the cloud.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="new-username">Your Unique Username</Label>
                                <Input id="new-username" type="text" value={newGeneratedUsername} disabled />
                                <p className="text-xs text-muted-foreground">Keep this username safe to recover your account later.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">Set Your Password</Label>
                                <Input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a secure password" disabled={isLoading} />
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-4">
                            <Button onClick={handleCreateAccount} className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Create & Secure Account
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="recover">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recover Your Account</CardTitle>
                            <CardDescription>Enter your unique username and password to sign in.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="recover-username">Username</Label>
                                <Input id="recover-username" type="text" placeholder="Elysium-XXXX-XXXX" value={username} onChange={(e) => setUsername(e.target.value)} disabled={isLoading} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="recover-password">Password</Label>
                                <Input id="recover-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleRecoverAccount} className="w-full" disabled={isLoading}>
                                {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
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
                            Or just exploring?
                        </span>
                    </div>
                </div>
                 <div className="mt-6">
                    <Button variant="outline" className="w-full" onClick={handleAnonymousSignIn} disabled={isGuestLoading}>
                        {isGuestLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : 'Continue as Guest'}
                    </Button>
                 </div>
            </Tabs>
        </div>
    );
}
