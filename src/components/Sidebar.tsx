'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  CreditCard, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut,
  ChevronRight,
  ChevronDown,
  X,
  List,
  User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
  { icon: LayoutDashboard, label: 'ផ្ទាំងគ្រប់គ្រង', href: '/' },
  { 
    icon: Car, 
    label: 'ស្តុកឡាន', 
    href: '/inventory',
    subItems: [
      { icon: List, label: 'មើលទិន្នន័យថយន្ត', href: '/inventory' },
    ]
  },
  { icon: Users, label: 'អតិថិជន', href: '/customers' },
  { icon: CreditCard, label: 'ការបង់ប្រាក់', href: '/payments' },
  { icon: BarChart3, label: 'ចំណាយ', href: '/expenses' },
  { icon: BarChart3, label: 'របាយការណ៍', href: '/reports' },
  { icon: Bell, label: 'ការជូនដំណឹង', href: '/notifications', badge: 1 },
  { icon: Settings, label: 'ការកំណត់', href: '/settings' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [openSubMenu, setOpenSubMenu] = useState<string | null>('ស្តុកឡាន');
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleSubMenu = (label: string) => {
    setOpenSubMenu(openSubMenu === label ? null : label);
  };

  // Close sidebar on mobile when route changes
  useEffect(() => {
    onClose();
  }, [pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside className={cn(
        "w-72 bg-[var(--sidebar)] text-[var(--sidebar-foreground)] flex flex-col h-screen fixed lg:sticky top-0 z-50 transition-all duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="p-8 flex flex-col items-center justify-center relative">
          <button onClick={onClose} className="lg:hidden absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg">
            <X size={20} />
          </button>

          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-24 h-24 flex items-center justify-center transform transition-transform hover:scale-110 duration-500">
              <img src="/img/LOGO.png" alt="BS-CAR LOGO" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-black text-lg tracking-tight text-white font-kantumruy leading-tight">
                ប្រព័ន្ធគ្រប់គ្រង<br />ការលក់រថយន្ត
              </h1>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isSubMenuOpen = openSubMenu === item.label;
            const isActive = pathname === item.href || (hasSubItems && item.subItems?.some(sub => pathname === sub.href));

            return (
              <div key={item.label} className="space-y-1">
                {hasSubItems ? (
                  <button
                    onClick={() => toggleSubMenu(item.label)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 group",
                      isActive 
                        ? "bg-white/10 text-white shadow-lg backdrop-blur-md border border-white/10" 
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} className={cn(isActive ? "text-white" : "text-white/70 group-hover:text-white")} />
                      <span className="font-bold">{item.label}</span>
                    </div>
                    <ChevronDown size={16} className={cn("text-white/50 transition-transform duration-200", isSubMenuOpen && "rotate-180")} />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl transition-all duration-200 group",
                      isActive 
                        ? "bg-white/10 text-white shadow-lg backdrop-blur-md border border-white/10" 
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} className={cn(isActive ? "text-white" : "text-white/70 group-hover:text-white")} />
                      <span className="font-bold">{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ring-2 ring-[#3b3086]">
                        {item.badge}
                      </span>
                    ) : (
                      isActive && <ChevronRight size={16} className="text-white/50" />
                    )}
                  </Link>
                )}

                {/* Sub Menu Items */}
                <AnimatePresence>
                  {hasSubItems && isSubMenuOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-1 ml-4 border-l border-white/10"
                    >
                      {item.subItems?.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            className={cn(
                              "flex items-center gap-3 p-3 pl-6 rounded-xl transition-all duration-200 text-sm",
                              isSubActive 
                                ? "text-white font-bold" 
                                : "text-white/50 hover:text-white hover:bg-white/5"
                            )}
                          >
                            <sub.icon size={16} />
                            <span>{sub.label}</span>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold shadow-lg shadow-black/20">
                <User size={20} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="font-black truncate text-sm">
                  {user?.displayName || 'ឈឿន ឈុនលី'}
                </p>
                <p className="text-[10px] text-white/40 truncate font-bold">
                  {user?.email || 'admin@bscar.com'}
                </p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center justify-center gap-2 p-3 text-white/70 hover:text-white hover:bg-rose-500/10 hover:text-rose-200 rounded-xl transition-all font-bold group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>ចាកចេញ</span>
          </button>
        </div>
      </aside>
    </>
  );
}
