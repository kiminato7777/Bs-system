'use client';

import React, { useState, useEffect } from 'react';
import { 
  Car, 
  TrendingUp, 
  AlertTriangle, 
  Calendar,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Loader2,
  TrendingDown
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { rtdb } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';
import { format, startOfMonth, endOfMonth, isWithinInterval, subMonths } from 'date-fns';

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);

    const inventoryRef = ref(rtdb, 'inventory');
    const expensesRef = ref(rtdb, 'expenses');

    let inventoryDone = false;
    let expensesDone = false;

    const unsubInventory = onValue(inventoryRef, (snapshot) => {
      const data = snapshot.val();
      setInventory(data ? Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val })) : []);
      inventoryDone = true;
      if (expensesDone) setLoading(false);
    });

    const unsubExpenses = onValue(expensesRef, (snapshot) => {
      const data = snapshot.val();
      setExpenses(data ? Object.entries(data).map(([id, val]: [string, any]) => ({ id, ...val })) : []);
      expensesDone = true;
      if (inventoryDone) setLoading(false);
    });

    return () => {
      unsubInventory();
      unsubExpenses();
    };
  }, []);

  // Calculate Stats
  const carsInStock = inventory.filter(car => car.status === 'Available').length;
  const carsSoldThisMonth = inventory.filter(car => {
    if (car.status !== 'Sold') return false;
    const date = new Date(car.updatedAt || car.createdAt);
    return isWithinInterval(date, { start: startOfMonth(new Date()), end: endOfMonth(new Date()) });
  }).length;

  const revenueThisMonth = inventory.filter(car => {
    if (car.status !== 'Sold') return false;
    const date = new Date(car.updatedAt || car.createdAt);
    return isWithinInterval(date, { start: startOfMonth(new Date()), end: endOfMonth(new Date()) });
  }).reduce((sum, car) => sum + (Number(car.salePrice) || 0), 0);

  const lowStock = inventory.filter(car => car.status === 'Available').length <= 5; // Simple rule

  const stats = [
    { 
      label: 'ចំនួនឡានក្នុងស្តុក', 
      value: carsInStock.toString(), 
      icon: Car, 
      color: 'blue', 
      trend: '+12%', 
      trendUp: true 
    },
    { 
      label: 'ចំនួនឡានលក់បាន (ខែនេះ)', 
      value: carsSoldThisMonth.toString(), 
      icon: TrendingUp, 
      color: 'green', 
      trend: '+5%', 
      trendUp: true 
    },
    { 
      label: 'ប្រាក់ចំណូលប្រចាំខែ', 
      value: `$${revenueThisMonth.toLocaleString()}`, 
      icon: Calendar, 
      color: 'purple', 
      trend: '+18%', 
      trendUp: true 
    },
    { 
      label: 'ឡានជិតអស់ស្តុក', 
      value: carsInStock <= 5 ? carsInStock.toString() : '0', 
      icon: AlertTriangle, 
      color: 'red', 
      trend: lowStock ? 'Attention' : 'Normal', 
      trendUp: !lowStock 
    },
  ];

  // Prepare Chart Data (Last 7 months)
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const date = subMonths(new Date(), 6 - i);
    const monthName = format(date, 'MMM');
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);

    const monthIncome = inventory.filter(car => {
      if (car.status !== 'Sold') return false;
      const d = new Date(car.updatedAt || car.createdAt);
      return isWithinInterval(d, { start: monthStart, end: monthEnd });
    }).reduce((sum, car) => sum + (Number(car.salePrice) || 0), 0);

    const monthExpense = expenses.filter(exp => {
      const d = new Date(exp.date);
      return isWithinInterval(d, { start: monthStart, end: monthEnd });
    }).reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0);

    return { name: monthName, income: monthIncome, expense: monthExpense };
  });

  // Recent Activity (Merge inventory and expenses)
  const recentActivity = [
    ...inventory.map(car => ({ ...car, activityType: 'inventory', date: new Date(car.createdAt) })),
    ...expenses.map(exp => ({ ...exp, activityType: 'expense', date: new Date(exp.createdAt || exp.date) }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, 5);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-gray-500 font-bold font-kantumruy">កំពុងទាញយកទិន្នន័យផ្ទាំងគ្រប់គ្រង...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 font-kantumruy">ផ្ទាំងគ្រប់គ្រង</h2>
          <p className="text-gray-500 mt-1 font-kantumruy">Welcome back, Admin 👋</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-2xl shadow-sm border border-gray-100">
          <Calendar size={20} className="text-indigo-500" />
          <div className="text-sm">
            <p className="text-gray-400 text-xs">Today</p>
            <p className="font-bold text-gray-700">{format(new Date(), 'dd MMM yyyy')}</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div>
              <p className="text-gray-500 text-sm font-bold font-kantumruy">{stat.label}</p>
              <h3 className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</h3>
              <div className="flex items-center gap-1 mt-2">
                {stat.trendUp ? (
                  <ArrowUpRight size={14} className="text-emerald-500" />
                ) : (
                  <ArrowDownRight size={14} className="text-rose-500" />
                )}
                <span className={stat.trendUp ? "text-emerald-500 text-xs font-bold" : "text-rose-500 text-xs font-bold"}>
                  {stat.trend}
                </span>
                <span className="text-gray-400 text-[10px]">vs last month</span>
              </div>
            </div>
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-lg",
              stat.color === 'blue' ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" :
              stat.color === 'green' ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white" :
              stat.color === 'purple' ? "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white" :
              "bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white"
            )}>
              <stat.icon size={28} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 font-kantumruy">របាយការណ៍ប្រចាំខែ</h3>
              <p className="text-gray-400 text-sm">2026 — Income overview and trends</p>
            </div>
            <select className="bg-gray-50 border-none rounded-xl text-sm p-2 outline-none font-kantumruy">
              <option>This Year</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[350px] w-full min-w-0 relative">
            {mounted && (
              <ResponsiveContainer width="100%" height={350} minWidth={0}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="income" name="ចំណូល" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar dataKey="expense" name="ចំណាយ" fill="#fb7185" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Right Section: Recent Activity or Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4 font-kantumruy">សកម្មភាពថ្មីៗ</h3>
            <div className="space-y-4">
              {recentActivity.length > 0 ? recentActivity.map((activity, i) => (
                <div key={activity.id} className="flex items-start gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                    activity.activityType === 'inventory' ? "bg-indigo-50 text-indigo-600" : "bg-rose-50 text-rose-600"
                  )}>
                    {activity.activityType === 'inventory' ? <Car size={18} /> : <TrendingDown size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate font-kantumruy">
                      {activity.activityType === 'inventory' ? `${activity.brand} ${activity.model}` : activity.description}
                    </p>
                    <p className="text-xs text-gray-500 font-kantumruy">
                      {activity.activityType === 'inventory' ? (activity.status === 'Sold' ? 'បានលក់ចេញ' : 'បានបញ្ជូលថ្មី') : `ចំណាយលើ ${activity.type}`}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">{format(activity.date, 'dd MMM, HH:mm')}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-sm font-bold",
                      activity.activityType === 'inventory' && activity.status === 'Sold' ? "text-emerald-600" : 
                      activity.activityType === 'expense' ? "text-rose-600" : "text-gray-600"
                    )}>
                      {activity.activityType === 'inventory' ? (activity.status === 'Sold' ? `+$${Number(activity.salePrice).toLocaleString()}` : '') : `-$${Number(activity.amount).toLocaleString()}`}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="py-10 text-center text-gray-400 font-kantumruy">មិនទាន់មានសកម្មភាព</div>
              )}
            </div>
            <button className="w-full mt-6 py-3 border border-dashed border-gray-200 rounded-2xl text-sm text-gray-500 hover:bg-gray-50 hover:border-indigo-200 hover:text-indigo-600 transition-all font-medium flex items-center justify-center gap-2 font-kantumruy">
              View All Activities <ChevronRight size={16} />
            </button>
          </div>

          <div className="bg-gradient-to-br from-[#3b3086] to-[#6366f1] p-6 rounded-3xl shadow-lg text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2 font-kantumruy">បង់រំលស់ជិតដល់ថ្ងៃ</h3>
              <p className="text-white/70 text-xs mb-4 font-kantumruy">មានអតិថិជនចំនួន ៥ នាក់ដែលត្រូវបង់ប្រាក់នៅថ្ងៃស្អែក</p>
              <button className="bg-white text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-opacity-90 transition-all font-kantumruy">
                ពិនិត្យមើលបញ្ជី
              </button>
            </div>
            <Bell className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32 rotate-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
