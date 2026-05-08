'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Globe, 
  User, 
  Menu, 
  ChevronDown, 
  Check, 
  LogOut, 
  Settings as SettingsIcon,
  UserCircle,
  Moon,
  Sun
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTheme } from './ThemeProvider';

const languages = [
  { code: 'KH', name: 'ភាសាខ្មែរ', flag: '🇰🇭' },
  { code: 'EN', name: 'English', flag: '🇺🇸' },
  { code: 'ZH', name: '中文', flag: '🇨🇳' },
];

interface TopbarProps {
  onMenuClick: () => void;
}

export default function Topbar({ onMenuClick }: TopbarProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languages[0]);
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

  return (
    <header className="h-20 bg-white/70 dark:bg-[#020617]/70 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors text-gray-600 dark:text-gray-400"
        >
          <Menu size={24} />
        </button>

        <div className="relative group flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="ស្វែងរក..." 
            className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-2xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none text-sm md:text-base font-kantumruy dark:text-gray-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4 ml-4">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 md:p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all active:scale-95 text-gray-600 dark:text-gray-400"
        >
          <AnimatePresence mode="wait">
            {theme === 'dark' ? (
              <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Sun size={20} />
              </motion.div>
            ) : (
              <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Moon size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </button>

        {/* Notifications */}
        <button className="p-2 md:p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors relative">
          <Bell size={20} className="text-gray-600 dark:text-gray-400" />
          <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-[#020617]"></span>
        </button>

        {/* Language Switcher */}
        <div className="relative">
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 p-2 px-3 hover:bg-gray-100 rounded-xl transition-all active:scale-95 bg-white border border-transparent hover:border-gray-100"
          >
            <span className="text-xl">{selectedLang.flag}</span>
            <span className="text-sm font-bold text-gray-700 hidden sm:block">{selectedLang.code}</span>
            <ChevronDown size={14} className={cn("text-gray-400 transition-transform duration-200", isLangOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isLangOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsLangOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-20 p-2"
                >
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 py-2">ជ្រើសរើសភាសា</p>
                  <div className="space-y-1">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLang(lang);
                          setIsLangOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-xl transition-all text-sm font-bold",
                          selectedLang.code === lang.code 
                            ? "bg-indigo-50 text-indigo-600" 
                            : "text-gray-600 hover:bg-gray-50"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{lang.flag}</span>
                          <span className={cn(lang.code === 'KH' && "font-kantumruy")}>{lang.name}</span>
                        </div>
                        {selectedLang.code === lang.code && <Check size={16} />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        <div className="h-8 w-px bg-gray-200 mx-1 md:mx-2"></div>

        {/* User Profile */}
        <div className="relative">
          <button 
            onClick={() => setIsUserOpen(!isUserOpen)}
            className="flex items-center gap-3 pl-1 md:pl-2 p-1 hover:bg-gray-50 rounded-2xl transition-all group active:scale-95"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-black text-gray-900 leading-tight">Admin</p>
              <p className="text-[11px] text-gray-400 font-bold font-kantumruy truncate max-w-[100px]">
                {user?.email?.split('@')[0] || 'ឈឿន ឈុនលី'}
              </p>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 group-hover:rotate-6 transition-transform">
              <User size={22} />
            </div>
            <ChevronDown size={14} className={cn("text-gray-400 transition-transform duration-200", isUserOpen && "rotate-180")} />
          </button>

          <AnimatePresence>
            {isUserOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsUserOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-72 bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden z-20 p-3"
                >
                  {/* Current Account Info */}
                  <div className="p-5 bg-[#f8faff] rounded-[24px] mb-3">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1 font-kantumruy">គណនីបច្ចុប្បន្ន</p>
                    <p className="text-lg font-black text-gray-900 truncate leading-none mb-1">{user?.email || 'adminbc@gmail.com'}</p>
                    <p className="text-xs text-indigo-600 font-bold font-kantumruy">អ្នកគ្រប់គ្រងប្រព័ន្ធ</p>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="space-y-1">
                    <button className="w-full flex items-center gap-4 p-3.5 rounded-2xl hover:bg-gray-50 text-gray-700 transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all">
                        <UserCircle size={20} />
                      </div>
                      <span className="font-bold text-sm font-kantumruy">ព័ត៌មានផ្ទាល់ខ្លួន</span>
                    </button>
                    
                    <button className="w-full flex items-center gap-4 p-3.5 rounded-2xl hover:bg-gray-50 text-gray-700 transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all">
                        <SettingsIcon size={20} />
                      </div>
                      <span className="font-bold text-sm font-kantumruy">ការកំណត់</span>
                    </button>
                    
                    <div className="h-px bg-gray-100/80 mx-2 my-2"></div>
                    
                    <button 
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-4 p-3.5 rounded-2xl hover:bg-rose-50 text-rose-600 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-rose-100 flex items-center justify-center text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all">
                        <LogOut size={20} />
                      </div>
                      <span className="font-black text-sm font-kantumruy">ចាកចេញ</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

