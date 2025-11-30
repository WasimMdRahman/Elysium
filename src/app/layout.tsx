
'use client';
import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { FirebaseClientProvider } from "@/firebase/client-provider";
import {
  Sidebar,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarHeader,
  SidebarTrigger,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Settings,
  Shield,
  FileText,
  User as UserIcon,
  LogOut,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { ClientThemeToggle } from "./client-theme-toggle";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { SplashScreen } from './splash-screen';
import { useUser } from "@/firebase";
import { getAuth, signOut } from "firebase/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const menuItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", tooltip: "Dashboard" },
    { href: "/settings", icon: Settings, label: "Settings", tooltip: "Settings" },
    { href: "/privacy", icon: Shield, label: "Privacy Policy", tooltip: "Privacy Policy" },
    { href: "/terms", icon: FileText, label: "Terms of Service", tooltip: "Terms of Service" },
];

const APP_DOMAIN = "elysium.app";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const auth = getAuth();

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const currentPage = menuItems.find(item => pathname.startsWith(item.href)) || (pathname.startsWith('/login') ? { label: 'Sign In' } : null);
  const pageTitle = currentPage ? currentPage.label : "Elysium";
  
  // Custom logic to display username from "fake" email
  const displayUsername = user && !user.isAnonymous && user.email ? user.email.replace(`@${APP_DOMAIN}`, '') : 'Anonymous User';

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#F0F4F8" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <SidebarProvider defaultOpen={false}>
            <SplashScreen />
            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center gap-2">
                        <span className="text-3xl font-brand text-blue-500 group-data-[collapsible=icon]:hidden">elysium</span>
                    </div>
                </SidebarHeader>

                <SidebarMenu className="flex-1">
                {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild variant="default" size="default" tooltip={item.tooltip} isActive={pathname === item.href}>
                        <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                        </Link>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                </SidebarMenu>
                
                <SidebarFooter>
                <SidebarSeparator />
                {isUserLoading ? (
                    <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Loading user..." disabled>
                        <div className="h-6 w-6 rounded-full bg-muted animate-pulse" />
                        <span className="animate-pulse">Loading...</span>
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ) : user ? (
                    <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Log Out" onClick={handleSignOut}>
                        <Avatar className="h-6 w-6">
                        <AvatarFallback>{displayUsername.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="truncate">{displayUsername}</span>
                        <LogOut className="ml-auto h-4 w-4" />
                    </SidebarMenuButton>
                    </SidebarMenuItem>
                ) : (
                    <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Sign In" isActive={pathname === '/login'}>
                        <Link href="/login">
                        <UserIcon />
                        <span>Sign In</span>
                        </Link>
                    </SidebarMenuButton>
                    <p className="px-2 text-xs text-sidebar-foreground/50 group-data-[collapsible=icon]:hidden">
                        Sign in to securely back up and sync your data across devices.
                    </p>
                    </SidebarMenuItem>
                )}
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                <header className="flex h-14 items-center gap-4 border-b bg-background/50 backdrop-blur-sm px-6">
                    <SidebarTrigger>
                    <Menu />
                    </SidebarTrigger>
                    <div className="flex-1">
                        <h1 className="text-lg font-semibold font-headline">{pageTitle}</h1>
                    </div>
                    <ClientThemeToggle />
                </header>
                <motion.main
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="flex-1 overflow-auto p-4 md:p-6"
                >
                    {children}
                </motion.main>
            </SidebarInset>
            </SidebarProvider>
          </FirebaseClientProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
