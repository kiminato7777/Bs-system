'use client';

import React, { useState } from 'react';
import { X, Check, Loader2, DollarSign, Calendar, FileText, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { rtdb } from '@/lib/firebase';
import { ref, push, set } from 'firebase/database';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddExpenseModal({ isOpen, onClose }: AddExpenseModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: 'Repair',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Paid'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const expensesRef = ref(rtdb, 'expenses');
      const newExpenseRef = push(expensesRef);
      await set(newExpenseRef, {
        ...formData,
        amount: Number(formData.amount),
        createdAt: new Date().toISOString(),
      });
      
      onClose();
      // Reset form
      setFormData({
        type: 'Repair',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Paid'
      });
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("មានបញ្ហាក្នុងការរក្សាទុក! សូមព្យាយាមម្តងទៀត។");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-8 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-kantumruy">បញ្ចូលចំណាយថ្មី</h2>
              <p className="text-gray-500 text-sm">តាមដានការចំណាយអាជីវកម្មរបស់អ្នក</p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-gray-100 rounded-2xl transition-colors"
            >
              <X size={24} className="text-gray-400" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-8">
            <form id="add-expense-form" onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">ប្រភេទចំណាយ</label>
                <div className="relative">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <select 
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-rose-500/20 outline-none font-bold text-gray-700 appearance-none"
                  >
                    <option value="Repair">Repair (ជួសជុល)</option>
                    <option value="Transport">Transport (ដឹកជញ្ជូន)</option>
                    <option value="Salary">Salary (ប្រាក់ខែ)</option>
                    <option value="Marketing">Marketing (ផ្សព្វផ្សាយ)</option>
                    <option value="Utilities">Utilities (ទឹក ភ្លើង)</option>
                    <option value="Other">Other (ផ្សេងៗ)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">ចំនួនទឹកប្រាក់ ($)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="number" 
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0.00" 
                      required
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-rose-500/20 outline-none font-bold text-rose-600" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">កាលបរិច្ឆេទ</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="date" 
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-rose-500/20 outline-none" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">ការពិពណ៌នា</label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 text-gray-400" size={20} />
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="ឧ. ប្តូរប្រេងម៉ាស៊ីន និងជួសជុលហ្វ្រាំង..." 
                    required
                    rows={3}
                    className="w-full bg-gray-50 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-rose-500/20 outline-none"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/50">
            <button 
              onClick={onClose}
              className="px-8 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
            >
              បោះបង់
            </button>
            <button 
              type="submit"
              form="add-expense-form"
              disabled={loading}
              className="bg-rose-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 flex items-center gap-2 min-w-[140px] justify-center"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Check size={20} />
                  រក្សាទុក
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
