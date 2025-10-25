
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

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
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
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        toast({
          title: "Notifications Enabled!",
          description: "You'll receive daily motivational quotes.",
        });
        scheduleDailyNotification();
      } else {
        toast({
          variant: "destructive",
          title: "Permission Denied",
          description: "You've blocked notifications. To enable them, check your browser settings.",
        });
      }
    } else {
      setNotificationsEnabled(false);
      // We can't "un-grant" permission, but we can stop scheduling new notifications.
      // For a full implementation, we'd need to manage subscriptions in a service worker.
      toast({
        title: "Notifications Disabled",
        description: "You will no longer receive daily quotes.",
      });
    }
  };

  const scheduleDailyNotification = () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        console.warn('Push messaging is not supported');
        // Fallback for browsers that support Notifications but not Push API (less common)
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        const showNotification = () => {
            new Notification("Your Daily Motivation ✨", {
                body: `"${randomQuote.quote}" - ${randomQuote.author}`,
                icon: "/icon-192x192.png",
            });
        };
        // This is a simple fallback and will only work if the tab is open.
        // A full PWA implementation would handle this in the service worker.
        setTimeout(showNotification, 1000 * 60 * 60 * 24); // 24 hours
        return;
    }

    navigator.serviceWorker.ready.then(registration => {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
      // This is a simplified example. A real-world app would likely use a backend
      // to send push notifications, but for a client-only PWA, we can show a local notification.
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
