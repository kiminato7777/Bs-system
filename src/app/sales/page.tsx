'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  DollarSign, 
  User, 
  Calendar, 
  FileText, 
  Check, 
  ChevronRight,
  Info
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function SalesPage() {
  const [saleType, setSaleType] = useState<'cash' | 'installment'>('cash');
  
  // Installment state
  const [price, setPrice] = useState(25000);
  const [downPayment, setDownPayment] = useState(5000);
  const [interestRate, setInterestRate] = useState(1.2); // per month
  const [duration, setDuration] = useState(36); // months
  const [monthlyPayment, setMonthlyPayment] = useState(0);

  useEffect(() => {
    if (saleType === 'installment') {
      const loanAmount = price - downPayment;
      const totalInterest = (loanAmount * (interestRate / 100)) * duration;
      const totalPayable = loanAmount + totalInterest;
      setMonthlyPayment(totalPayable / duration);
    }
  }, [price, downPayment, interestRate, duration, saleType]);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-bold text-gray-900 font-kantumruy">ប្រព័ន្ធលក់ឡាន</h2>
        <p className="text-gray-500">ជ្រើសរើសប្រភេទនៃការលក់ និងបំពេញព័ត៌មាន</p>
      </div>

      {/* Sale Type Switcher */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1.5 rounded-[24px] flex items-center gap-1">
          <button 
            onClick={() => setSaleType('cash')}
            className={cn(
              "px-8 py-3 rounded-2xl font-bold text-sm transition-all",
              saleType === 'cash' ? "bg-white text-indigo-600 shadow-md" : "text-gray-500 hover:text-gray-700"
            )}
          >
            លក់ដាច់ (Cash)
          </button>
          <button 
            onClick={() => setSaleType('installment')}
            className={cn(
              "px-8 py-3 rounded-2xl font-bold text-sm transition-all",
              saleType === 'installment' ? "bg-white text-indigo-600 shadow-md" : "text-gray-500 hover:text-gray-700"
            )}
          >
            លក់បង់រំលស់ (Installment)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                <User size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-kantumruy">ព័ត៌មានអតិថិជន</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">ឈ្មោះអតិថិជន</label>
                <input type="text" placeholder="បញ្ចូលឈ្មោះ..." className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/10" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">លេខទូរស័ព្ទ</label>
                <input type="text" placeholder="012 345 678" className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/10" />
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Calculator size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-kantumruy">ព័ត៌មានការលក់</h3>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">តម្លៃឡាន (USD)</label>
                  <input 
                    type="number" 
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/10 font-bold text-lg" 
                  />
                </div>
                {saleType === 'installment' && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">ប្រាក់កក់មុន (Down Payment)</label>
                    <input 
                      type="number" 
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/10 font-bold text-lg text-emerald-600" 
                    />
                  </div>
                )}
              </div>

              {saleType === 'installment' && (
                <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">អត្រាការប្រាក់ (% ក្នុងខែ)</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/10" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">រយៈពេលបង់ (ខែ)</label>
                    <select 
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 outline-none focus:ring-2 focus:ring-indigo-500/10"
                    >
                      <option value={12}>12 ខែ (1 ឆ្នាំ)</option>
                      <option value={24}>24 ខែ (2 ឆ្នាំ)</option>
                      <option value={36}>36 ខែ (3 ឆ្នាំ)</option>
                      <option value={48}>48 ខែ (4 ឆ្នាំ)</option>
                      <option value={60}>60 ខែ (5 ឆ្នាំ)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 pt-6">
                  <h4 className="font-bold text-gray-900 font-kantumruy flex items-center gap-2">
                    <Calendar size={18} className="text-indigo-500" />
                    កាលវិភាគបង់ប្រាក់ (Schedule)
                  </h4>
                  <div className="bg-gray-50 rounded-[32px] overflow-hidden border border-gray-100">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-100/50">
                        <tr>
                          <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px]">ខែទី</th>
                          <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px]">កាលបរិច្ឆេទ</th>
                          <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px]">ចំនួនទឹកប្រាក់</th>
                          <th className="px-6 py-4 font-bold text-gray-500 uppercase text-[10px]">សមតុល្យនៅសល់</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200/50">
                        {[1, 2, 3, 4, 5].map((month) => {
                          const remaining = (price - downPayment) * (1 - (month / duration));
                          return (
                            <tr key={month} className="hover:bg-white/50 transition-colors">
                              <td className="px-6 py-3 font-bold text-gray-400">{month}</td>
                              <td className="px-6 py-3 text-gray-600">08 {['Jun', 'Jul', 'Aug', 'Sep', 'Oct'][month-1]} 2026</td>
                              <td className="px-6 py-3 font-bold text-gray-900">${monthlyPayment.toFixed(2)}</td>
                              <td className="px-6 py-3 text-gray-500">${remaining > 0 ? remaining.toLocaleString(undefined, {maximumFractionDigits: 0}) : '0'}</td>
                            </tr>
                          );
                        })}
                        <tr>
                          <td colSpan={4} className="px-6 py-3 text-center text-xs text-gray-400 italic">
                            ... and {duration - 5} more months
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                </>
              )}
            </div>
          </section>
        </div>

        {/* Summary Card */}
        <div className="space-y-6">
          <div className="bg-[#3b3086] text-white p-8 rounded-[40px] shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <h3 className="text-xl font-bold font-kantumruy opacity-80">សេចក្តីសង្ខេប</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center opacity-70">
                  <span className="text-sm">តម្លៃសរុប</span>
                  <span className="font-bold">${price.toLocaleString()}</span>
                </div>
                {saleType === 'installment' && (
                  <>
                    <div className="flex justify-between items-center opacity-70">
                      <span className="text-sm">ប្រាក់កក់មុន</span>
                      <span className="font-bold">-${downPayment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center opacity-70">
                      <span className="text-sm">ប្រាក់ជំពាក់សរុប</span>
                      <span className="font-bold">${(price - downPayment).toLocaleString()}</span>
                    </div>
                    <div className="h-px bg-white/10 my-4"></div>
                    <div className="space-y-1">
                      <p className="text-xs opacity-60">ប្រាក់បង់ប្រចាំខែ</p>
                      <p className="text-4xl font-black">${monthlyPayment.toFixed(2)}</p>
                    </div>
                  </>
                )}
                {saleType === 'cash' && (
                  <div className="space-y-1 pt-4">
                    <p className="text-xs opacity-60">តម្លៃត្រូវបង់</p>
                    <p className="text-4xl font-black">${price.toLocaleString()}</p>
                  </div>
                )}
              </div>

              <button className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-95 transition-all shadow-lg mt-4">
                <Check size={20} />
                បញ្ជាក់ការលក់
              </button>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
          </div>

          <div className="bg-amber-50 border border-amber-100 p-6 rounded-[32px] flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0">
              <Info size={20} />
            </div>
            <div className="text-sm">
              <p className="font-bold text-amber-800 mb-1 font-kantumruy">ចំណាំ</p>
              <p className="text-amber-700 leading-relaxed opacity-80">សូមត្រួតពិនិត្យព័ត៌មានអតិថិជន និងលក្ខខណ្ឌបង់ប្រាក់អោយបានច្បាស់លាស់មុនពេលបញ្ជាក់ការលក់។</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
