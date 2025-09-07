
import { Logo } from "@/components/logo";
import {
  Sidebar,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Settings,
  Shield,
  FileText,
  CreditCard,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import dynamic from "next/dynamic";

const menuItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", tooltip: "Dashboard" },
    { href: "/settings", icon: Settings, label: "Settings", tooltip: "Settings" },
    { href: "/pricing", icon: CreditCard, label: "Pricing", tooltip: "Pricing" },
    { href: "/privacy", icon: Shield, label: "Privacy Policy", tooltip: "Privacy Policy" },
    { href: "/terms", icon: FileText, label: "Terms of Service", tooltip: "Terms of Service" },
];

const ClientThemeToggle = dynamic(() => import('@/components/theme-toggle').then(m => m.ThemeToggle), { ssr: false });


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
            <div className="flex items-center gap-2">
                <Logo className="size-7 shrink-0" />
                <span className="text-lg font-semibold font-headline group-data-[collapsible=icon]:hidden">Zenith Mind</span>
            </div>
        </SidebarHeader>

        <SidebarMenu className="flex-1">
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild variant="default" size="default" tooltip={item.tooltip}>
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/50 backdrop-blur-sm px-6">
            <SidebarTrigger className="md:hidden" />
            <div className="flex-1">
                {/* Add search or other header items here */}
            </div>
            <ClientThemeToggle />
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
