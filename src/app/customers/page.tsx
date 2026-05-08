'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  ChevronRight, 
  MoreHorizontal,
  Plus,
  CreditCard,
  Edit2,
  Trash2,
  Eye,
  Loader2,
  ExternalLink,
  UserCheck,
  UserX,
  Star,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AddCustomerModal from '@/components/AddCustomerModal';
import { rtdb } from '@/lib/firebase';
import { ref, onValue, remove } from 'firebase/database';
import { cn } from '@/lib/utils';
import CustomerDetailModal from '@/components/CustomerDetailModal';

interface CustomerData {
  id: string;
  nameKH: string;
  nameEN: string;
  gender: string;
  phone: string;
  email: string;
  telegram: string;
  province: string;
  district: string;
  commune: string;
  village: string;
  houseNo: string;
  status: string;
  createdAt: string;
  idFrontImage?: string;
  riskLevel?: string;
  creditScore?: string;
}

const statusStyles = {
  'New Customer': 'bg-blue-100 text-blue-600 border-blue-200',
  'Active': 'bg-emerald-100 text-emerald-600 border-emerald-200',
  'VIP': 'bg-amber-100 text-amber-600 border-amber-200',
  'Blacklist': 'bg-rose-100 text-rose-600 border-rose-200',
  'Late Payment': 'bg-orange-100 text-orange-600 border-orange-200',
};

const statusIcons = {
  'New Customer': Star,
  'Active': UserCheck,
  'VIP': ShieldAlert,
  'Blacklist': UserX,
  'Late Payment': CreditCard,
};

export default function CustomersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const customersRef = ref(rtdb, 'customers');
    const unsubscribe = onValue(customersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list: CustomerData[] = Object.entries(data).map(([id, value]: [string, any]) => ({
          id,
          ...value,
        })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setCustomers(list);
      } else {
        setCustomers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`តើអ្នកប្រាកដថាចង់លុបអតិថិជន "${name}" នេះមែនទេ?`)) {
      try {
        await remove(ref(rtdb, `customers/${id}`));
      } catch (error) {
        console.error("Error deleting customer:", error);
        alert("មិនអាចលុបទិន្នន័យបានទេ!");
      }
    }
  };

  const handleEdit = (customer: CustomerData) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleView = (customer: CustomerData) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  const closeModals = () => {
    setIsModalOpen(false);
    setIsDetailOpen(false);
    setSelectedCustomer(null);
  };

  const filteredCustomers = customers.filter(c => 
    c.nameKH?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.nameEN?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.includes(searchTerm) ||
    (c as any).idNumber?.includes(searchTerm)
  );

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'Active' || c.status === 'VIP').length,
    overdue: customers.filter(c => c.status === 'Late Payment' || c.status === 'Blacklist').length,
    vip: customers.filter(c => c.status === 'VIP').length,
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="អតិថិជនសរុប" value={stats.total} icon={Users} color="indigo" subtitle="Total Customers" />
        <StatCard title="អតិថិជនសកម្ម" value={stats.active} icon={UserCheck} color="emerald" subtitle="Active Customers" />
        <StatCard title="បង់យឺត / Blacklist" value={stats.overdue} icon={ShieldAlert} color="rose" subtitle="Overdue / Risk" />
        <StatCard title="អតិថិជន VIP" value={stats.vip} icon={Star} color="amber" subtitle="VIP Premium" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 font-kantumruy">គ្រប់គ្រងអតិថិជន</h2>
          <p className="text-gray-500 mt-1 font-kantumruy">គ្រប់គ្រងព័ត៌មានអតិថិជន ឥណទាន និងការតាមដាន</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 font-kantumruy"
        >
          <Plus size={20} />
          <span>បន្ថែមអតិថិជន</span>
        </button>
      </div>

      <AddCustomerModal 
        isOpen={isModalOpen} 
        onClose={closeModals} 
        customerToEdit={selectedCustomer}
      />

      <CustomerDetailModal
        isOpen={isDetailOpen}
        onClose={closeModals}
        customer={selectedCustomer}
      />

      {/* Filters */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ស្វែងរកតាម ឈ្មោះ, លេខទូរស័ព្ទ, លេខអត្តសញ្ញាណប័ណ្ណ..." 
            className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none font-kantumruy"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
        <div className="table-responsive">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 font-kantumruy">ឈ្មោះអតិថិជន</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 font-kantumruy">ទំនាក់ទំនង</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 font-kantumruy">អាសយដ្ឋាន</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 font-kantumruy">ស្ថានភាព</th>
                <th className="px-8 py-6 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 text-right font-kantumruy">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="animate-spin text-indigo-600" size={40} />
                      <p className="text-gray-500 font-bold font-kantumruy">កំពុងទាញយកទិន្នន័យ...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredCustomers.length > 0 ? (
                <AnimatePresence>
                  {filteredCustomers.map((customer, i) => (
                    <motion.tr 
                      key={customer.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group hover:bg-indigo-50/30 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg border border-indigo-100 shadow-sm overflow-hidden">
                            {customer.idFrontImage ? (
                              <img src={customer.idFrontImage} className="w-full h-full object-cover" />
                            ) : (
                              customer.nameKH?.charAt(0) || customer.nameEN?.charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="font-black text-gray-900 font-kantumruy text-base">{customer.nameKH}</p>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{customer.nameEN}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                              <Phone size={14} />
                            </div>
                            <span>{customer.phone}</span>
                          </div>
                          {customer.telegram && (
                            <div className="flex items-center gap-2 text-xs font-bold text-indigo-500 bg-indigo-50 w-fit px-2 py-1 rounded-md">
                              <span>@{customer.telegram}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-start gap-3">
                          <MapPin size={18} className="text-rose-400 mt-0.5 shrink-0" />
                          <div className="text-sm">
                            <p className="font-bold text-gray-700 font-kantumruy">{customer.province}</p>
                            <p className="text-xs text-gray-400 font-bold mt-0.5">{customer.district}, {customer.commune}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl border w-fit font-black text-[10px] uppercase tracking-widest shadow-sm",
                          statusStyles[customer.status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-500 border-gray-200'
                        )}>
                          {React.createElement(statusIcons[customer.status as keyof typeof statusIcons] || Star, { size: 14 })}
                          {customer.status}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleView(customer)}
                            className="w-10 h-10 flex items-center justify-center bg-white text-indigo-600 rounded-xl shadow-sm border border-gray-100 hover:bg-indigo-600 hover:text-white transition-all" 
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => handleEdit(customer)}
                            className="w-10 h-10 flex items-center justify-center bg-white text-emerald-600 rounded-xl shadow-sm border border-gray-100 hover:bg-emerald-600 hover:text-white transition-all"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDelete(customer.id, customer.nameKH)}
                            className="w-10 h-10 flex items-center justify-center bg-white text-rose-500 rounded-xl shadow-sm border border-gray-100 hover:bg-rose-600 hover:text-white transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                        <Users size={40} />
                      </div>
                      <div>
                        <p className="text-xl font-black text-gray-400 font-kantumruy">មិនទាន់មានទិន្នន័យអតិថិជន</p>
                        <p className="text-sm text-gray-400 font-kantumruy mt-1">សូមចុចប៊ូតុង "បន្ថែមអតិថិជន" ដើម្បីចាប់ផ្តើម</p>
                      </div>
                    </div>
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

function StatCard({ title, value, icon: Icon, color, subtitle }: any) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-100/50',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-100/50',
    rose: 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-100/50',
    amber: 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-100/50',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform group-hover:scale-110", colors[color as keyof typeof colors])}>
          <Icon size={28} />
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-kantumruy">{title}</p>
          <h4 className="text-2xl font-black text-gray-900 leading-none my-1">{value}</h4>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{subtitle}</p>
        </div>
      </div>
    </motion.div>
  );
}
