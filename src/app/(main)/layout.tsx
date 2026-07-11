'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, HelpCircle, Home, Phone, Users } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';

const navItems = [
  { href: '/', icon: Home, label: 'AI Counselor' },
  { href: '/courses', icon: BookOpen, label: 'Courses' },
  { href: '/faq', icon: HelpCircle, label: 'FAQ' },
  { href: '/contact', icon: Phone, label: 'Contact' },
  { href: '/leads', icon: Users, label: 'Leads' },
];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo className="group-data-[collapsible=icon]:hidden" />
          <Logo className="hidden group-data-[collapsible=icon]:flex" hideText />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-card px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
           <SidebarTrigger className="md:hidden" />
           <h1 className="flex-1 text-lg font-semibold md:text-2xl">{navItems.find(item => item.href === pathname)?.label || 'CampusConnect AI'}</h1>
           <ThemeToggle />
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 animate-fade-in-up">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
