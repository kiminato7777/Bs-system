'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Download, FileText, Printer, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const data = [
  { name: 'Jan', sales: 4, revenue: 120000, profit: 12000 },
  { name: 'Feb', sales: 3, revenue: 95000, profit: 8500 },
  { name: 'Mar', sales: 6, revenue: 185000, profit: 15000 },
  { name: 'Apr', sales: 2, revenue: 65000, profit: 6000 },
  { name: 'May', sales: 5, revenue: 145000, profit: 13000 },
];

const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b'];

const pieData = [
  { name: 'Toyota', value: 45 },
  { name: 'Lexus', value: 30 },
  { name: 'Ford', value: 15 },
  { name: 'Other', value: 10 },
];

export default function ReportsPage() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 font-kantumruy">របាយការណ៍អាជីវកម្ម</h2>
          <p className="text-gray-500 mt-1">វិភាគការលក់ ចំណូល និងចំណេញរបស់អ្នក</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-50 transition-all">
            <Download size={18} /> Excel
          </button>
          <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
            <Printer size={18} /> Print PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-400 text-xs font-bold uppercase mb-1">ចំណូលសរុបឆ្នាំនេះ</p>
          <h3 className="text-3xl font-black text-gray-900 font-kantumruy">$610,000</h3>
          <p className="text-emerald-500 text-xs font-bold mt-2">+15.5% from last year</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-400 text-xs font-bold uppercase mb-1">ប្រាក់ចំណេញសុទ្ធ</p>
          <h3 className="text-3xl font-black text-indigo-600 font-kantumruy">$54,500</h3>
          <p className="text-emerald-500 text-xs font-bold mt-2">+12.3% margin</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <p className="text-gray-400 text-xs font-bold uppercase mb-1">ឡានលក់បានសរុប</p>
          <h3 className="text-3xl font-black text-gray-900 font-kantumruy">20 គ្រឿង</h3>
          <p className="text-gray-400 text-xs font-bold mt-2">Avg. 4 cars per month</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-8 font-kantumruy">ស្ថិតិនៃការលក់ប្រចាំខែ</h3>
          <div className="h-[300px] min-w-0 relative">
            {mounted && (
              <ResponsiveContainer width="100%" height={300} minWidth={0}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                  <Bar dataKey="revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-8 font-kantumruy">ប្រភេទឡានដែលលក់ដាច់បំផុត</h3>
          <div className="flex items-center justify-center h-[300px] min-w-0 relative">
            {mounted && (
              <ResponsiveContainer width="100%" height={300} minWidth={0}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                <span className="text-xs font-bold text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
