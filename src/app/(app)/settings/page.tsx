
'use client';
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { quotes } from "@/lib/quotes";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { toast } = useToast();
  const [siteUrl, setSiteUrl] = useState('');

  useEffect(() => {
    // This ensures window is defined, so it runs only on the client
    setSiteUrl(window.location.origin);

    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setNotificationsEnabled(true);
      }
    }
  }, []);

  const handleNotificationToggle = async (enabled: boolean) => {
    if (!('Notification' in window)) {
      toast({
        variant: "destructive",
        title: "Unsupported Browser",
        description: "This browser does not support desktop notifications.",
      });
      return;
    }

    if (enabled) {
      if (Notification.permission === 'denied') {
        toast({
          title: "Notifications Blocked",
          description: "You've previously blocked notifications. Please enable them in your browser settings to receive daily quotes.",
          action: (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="mt-2">How?</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>How to Enable Notifications</AlertDialogTitle>
                  <AlertDialogDescription className="text-left pt-2">
                    <p className="font-bold">Google Chrome:</p>
                    <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                      <li>Go to Settings {'>'} Privacy and security {'>'} Site Settings {'>'} Notifications.</li>
                      <li>Under `Allowed to send notifications`, click `Add`.</li>
                      <li>Enter the site URL: <code className="bg-muted p-1 rounded-sm text-xs">{siteUrl || 'studio-7201398695-e1d01.firebaseapp.com'}</code> and click `Add`.</li>
                    </ol>
                    <p className="font-bold mt-4">Mozilla Firefox:</p>
                    <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                      <li>Click the padlock icon in the address bar.</li>
                      <li>Find "Permissions" and change "Send Notifications" from "Blocked" to "Allow".</li>
                    </ol>
                    <p className="font-bold mt-4">Safari:</p>
                     <ol className="list-decimal list-inside text-muted-foreground space-y-1">
                      <li>Go to Safari {'>'} Settings {'>'} Websites tab.</li>
                      <li>Select "Notifications" from the sidebar.</li>
                      <li>Find this site (<code className="bg-muted p-1 rounded-sm text-xs">{siteUrl || 'studio-7201398695-e1d01.firebaseapp.com'}</code>) and set the permission to "Allow".</li>
                    </ol>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction>Got it</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ),
        });
        return;
      }
        
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        toast({
          title: "Notifications Enabled!",
          description: "You'll receive daily motivational quotes.",
        });
        scheduleDailyNotification();
      } else {
        setNotificationsEnabled(false); 
        toast({
          title: "Permission Not Granted",
          description: "You can enable notifications anytime from settings.",
        });
      }
    } else {
      setNotificationsEnabled(false);
      toast({
        title: "Notifications Disabled",
        description: "You will no longer receive daily quotes.",
      });
    }
  };

  const scheduleDailyNotification = () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push messaging is not supported');
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        const showNotification = () => {
            new Notification("Your Daily Motivation ✨", {
                body: `"${randomQuote.quote}" - ${randomQuote.author}`,
                icon: "/icon-192x192.png",
            });
        };
        setTimeout(showNotification, 1000 * 60 * 60 * 24);
        return;
    }

    navigator.serviceWorker.ready.then(registration => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      registration.showNotification("Your Daily Motivation ✨", {
        body: `"${randomQuote.quote}" - ${randomQuote.author}`,
        icon: "/icon-192x192.png",
        tag: 'daily-motivation-quote',
      });
    });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <Button asChild variant="ghost" size="icon">
             <Link href="/dashboard"><ArrowLeft /></Link>
        </Button>
        <CardTitle className="font-headline">Settings</CardTitle>
        <CardDescription>Manage your account and app preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable dark mode for the application.
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
        </div>
         <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="notifications" className="text-base">Daily Motivation</Label>
              <p className="text-sm text-muted-foreground">
                Receive a daily motivational quote to start your day right.
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={handleNotificationToggle}
            />
        </div>
      </CardContent>
    </Card>
  );
}
