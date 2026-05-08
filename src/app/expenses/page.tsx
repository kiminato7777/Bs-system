'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  TrendingDown, 
  Wrench, 
  Truck, 
  Users, 
  Megaphone,
  MoreVertical,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AddExpenseModal from '@/components/AddExpenseModal';
import { rtdb } from '@/lib/firebase';
import { ref, onValue, remove } from 'firebase/database';
import { format } from 'date-fns';

interface ExpenseData {
  id: string;
  type: string;
  description: string;
  amount: number;
  date: string;
  status: string;
  createdAt: string;
}

const typeIcons = {
  Repair: Wrench,
  Transport: Truck,
  Salary: Users,
  Marketing: Megaphone,
  Utilities: AlertCircle,
  Other: MoreVertical,
};

const typeColors = {
  Repair: 'bg-blue-50 text-blue-600',
  Transport: 'bg-amber-50 text-amber-600',
  Salary: 'bg-purple-50 text-purple-600',
  Marketing: 'bg-rose-50 text-rose-600',
  Utilities: 'bg-indigo-50 text-indigo-600',
  Other: 'bg-gray-50 text-gray-600',
};

export default function ExpensesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expenses, setExpenses] = useState<ExpenseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const expensesRef = ref(rtdb, 'expenses');
    const unsubscribe = onValue(expensesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: ExpenseData[] = Object.entries(data).map(([id, value]: [string, any]) => ({
          id,
          ...value,
        })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setExpenses(list);
      } else {
        setExpenses([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('តើអ្នកប្រាកដថាចង់លុបចំណាយនេះមែនទេ?')) {
      try {
        await remove(ref(rtdb, `expenses/${id}`));
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  };

  const filteredExpenses = expenses.filter(exp => 
    exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exp.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalThisMonth = expenses
    .filter(exp => {
      const expDate = new Date(exp.date);
      const now = new Date();
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 font-kantumruy">គ្រប់គ្រងចំណាយ</h2>
          <p className="text-gray-500 mt-1 font-kantumruy">តាមដានរាល់ការចំណាយលើការជួសជុល ដឹកជញ្ជូន និងបុគ្គលិក</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-rose-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-rose-700 transition-all shadow-lg shadow-rose-100 font-kantumruy"
        >
          <Plus size={20} />
          <span>បញ្ចូលចំណាយថ្មី</span>
        </button>
      </div>

      <AddExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <TrendingDown size={28} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-bold font-kantumruy">ចំណាយសរុបខែនេះ</p>
            <h3 className="text-2xl font-bold text-gray-900">${totalThisMonth.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="ស្វែងរកតាម ការពិពណ៌នា..." 
            className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-rose-500/20 transition-all outline-none font-kantumruy"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider font-kantumruy">ប្រភេទចំណាយ</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider font-kantumruy">ការពិពណ៌នា</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider font-kantumruy">កាលបរិច្ឆេទ</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider font-kantumruy">ចំនួនទឹកប្រាក់</th>
                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider text-right font-kantumruy">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="animate-spin text-rose-600" size={40} />
                      <p className="text-gray-500 font-bold font-kantumruy">កំពុងទាញយកទិន្នន័យ...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredExpenses.length > 0 ? (
                <AnimatePresence>
                  {filteredExpenses.map((expense, i) => (
                    <motion.tr 
                      key={expense.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeColors[expense.type as keyof typeof typeColors] || typeColors.Other}`}>
                            {React.createElement(typeIcons[expense.type as keyof typeof typeIcons] || typeIcons.Other, { size: 18 })}
                          </div>
                          <span className="font-bold text-gray-700">{expense.type}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm text-gray-600 font-kantumruy">{expense.description}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="text-sm text-gray-500">{expense.date}</p>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-rose-600">${expense.amount.toLocaleString()}</p>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => handleDelete(expense.id)}
                          className="p-2 hover:bg-rose-50 text-gray-400 hover:text-rose-600 rounded-lg transition-colors"
                        >
                          <MoreVertical size={18} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <p className="text-gray-400 font-bold font-kantumruy">មិនទាន់មានទិន្នន័យចំណាយ</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
