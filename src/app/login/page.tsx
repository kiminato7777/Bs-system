'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Car, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err: any) {
      console.error(err);
      setError('អ៊ីមែល ឬលេខសម្ងាត់មិនត្រឹមត្រូវ! សូមព្យាយាមម្តងទៀត។');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 p-10 relative z-10 backdrop-blur-xl bg-white/80">
          <div className="text-center mb-10">
            <div className="w-32 h-32 flex items-center justify-center mx-auto mb-8 overflow-hidden">
              <img src="/img/LOGO.png" alt="BS-CAR LOGO" className="w-full h-full object-contain transform hover:scale-110 transition-transform duration-500" />
            </div>
            <h1 className="text-3xl font-black text-gray-900 font-kantumruy">BS-CAR</h1>
            <p className="text-gray-500 mt-2 font-kantumruy">ប្រព័ន្ធគ្រប់គ្រងការលក់ឡាន</p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold"
              >
                <AlertCircle size={18} />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">អាសយដ្ឋានអ៊ីមែល</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@bscar.com" 
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 pl-12 outline-none focus:border-indigo-500/20 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">លេខសម្ងាត់</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 pl-12 outline-none focus:border-indigo-500/20 focus:bg-white transition-all font-medium"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">ចងចាំខ្ញុំ</span>
              </label>
              <a href="#" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 transition-colors">ភ្លេចលេខសម្ងាត់?</a>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 relative overflow-hidden"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>ចូលប្រើប្រាស់</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-400 text-sm">
              មិនទាន់មានគណនី? <a href="#" className="text-indigo-600 font-bold hover:underline">ចុះឈ្មោះនៅទីនេះ</a>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-gray-400 text-xs">
          <p>© 2026 BS-CAR Management System. All rights reserved.</p>
        </div>
      </motion.div>
    </div>
  );
}
