'use client';

import React from 'react';
import { 
  X, 
  Car, 
  Hash, 
  Calendar, 
  Palette, 
  Tag, 
  DollarSign, 
  FileText,
  Clock,
  CheckCircle,
  Ban,
  Settings,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CarDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: any;
}

const statusColors = {
  Available: 'bg-emerald-100 text-emerald-600',
  Sold: 'bg-rose-100 text-rose-600',
  Reserved: 'bg-amber-100 text-amber-600',
  Maintenance: 'bg-blue-100 text-blue-600',
};

const statusIcons = {
  Available: CheckCircle,
  Sold: Ban,
  Reserved: Clock,
  Maintenance: Settings,
};

const statusLabels = {
  Available: 'នៅទំនេរ',
  Sold: 'បានលក់',
  Reserved: 'បានកក់',
  Maintenance: 'កំពុងជួសជុល',
};

export default function CarDetailModal({ isOpen, onClose, car }: CarDetailModalProps) {
  if (!isOpen || !car) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 flex items-center justify-center overflow-hidden">
                <img src="/img/LOGO.png" alt="BS-CAR LOGO" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900 font-kantumruy">{car.brand} {car.model}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-kantumruy",
                    statusColors[car.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-600'
                  )}>
                    {statusLabels[car.status as keyof typeof statusLabels] || car.status}
                  </span>
                  <span className="text-gray-400 text-xs font-bold">• បញ្ចូលនៅថ្ងៃទី {new Date(car.createdAt).toLocaleDateString('km-KH')}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-gray-100 rounded-2xl transition-all group"
            >
              <X size={24} className="text-gray-400 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Side: Image Gallery */}
              <div className="lg:col-span-5 space-y-6">
                <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-xl border border-gray-100">
                  <img 
                    src={car.image || 'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=2069&auto=format&fit=crop'} 
                    alt={car.brand} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
                
                <div className="bg-indigo-600 rounded-[32px] p-6 text-white shadow-lg shadow-indigo-100 overflow-hidden relative group">
                  <Zap className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
                  <p className="text-indigo-100 text-sm font-bold mb-1 opacity-80 uppercase tracking-widest font-kantumruy">តម្លៃលក់បច្ចុប្បន្ន</p>
                  <h3 className="text-4xl font-black">${Number(car.salePrice).toLocaleString()}</h3>
                  <div className="mt-4 flex items-center gap-2 text-xs font-bold bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm font-kantumruy">
                    <ShieldCheck size={14} /> ធានាគុណភាព និងតម្លៃ
                  </div>
                </div>
              </div>

              {/* Right Side: Details Grid */}
              <div className="lg:col-span-7 space-y-8">
                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-6 font-kantumruy flex items-center gap-2">
                    <FileText size={20} className="text-indigo-600" />
                    ព័ត៌មានលម្អិតបច្ចេកទេស
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <DetailItem icon={Tag} label="ម៉ាក" value={car.brand} />
                    <DetailItem icon={Car} label="ម៉ូដែល" value={car.model} />
                    <DetailItem icon={Calendar} label="ឆ្នាំផលិត" value={car.year} />
                    <DetailItem icon={Palette} label="ពណ៌" value={car.color} />
                    <DetailItem icon={Hash} label="ផ្លាកលេខ" value={car.plate} />
                    <DetailItem icon={ShieldCheck} label="លេខតួ (VIN)" value={car.vin} />
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-6 font-kantumruy flex items-center gap-2">
                    <DollarSign size={20} className="text-indigo-600" />
                    ព័ត៌មានផ្នែកហិរញ្ញវត្ថុ
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50/50 p-6 rounded-[32px] border border-gray-100">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 font-kantumruy">តម្លៃទិញចូល</p>
                      <p className="text-2xl font-black text-gray-700">${Number(car.purchasePrice).toLocaleString()}</p>
                    </div>
                    <div className="bg-indigo-50/30 p-6 rounded-[32px] border border-indigo-100/50">
                      <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 font-kantumruy">តម្លៃលក់ចេញ</p>
                      <p className="text-2xl font-black text-indigo-600">${Number(car.salePrice).toLocaleString()}</p>
                    </div>
                  </div>
                </section>

                <section className="bg-emerald-50/50 p-6 rounded-[32px] border border-emerald-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckCircle size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-emerald-900 font-kantumruy">ស្ថានភាពរថយន្ត</p>
                      <p className="text-sm text-emerald-600 font-bold uppercase font-kantumruy">{statusLabels[car.status as keyof typeof statusLabels] || car.status}</p>
                    </div>
                  </div>
                  <button className="bg-white text-emerald-600 px-6 py-2 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all">
                    កែប្រែស្ថានភាព
                  </button>
                </section>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">ID: {car.id}</p>
            <div className="flex gap-3">
              <button 
                onClick={onClose}
                className="px-8 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-200 transition-all font-kantumruy"
              >
                បិទ
              </button>
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 font-kantumruy">
                បោះពុម្ពព័ត៌មាន
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function DetailItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100 group hover:bg-white hover:shadow-md transition-all">
      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-gray-400 group-hover:text-indigo-600 group-hover:scale-110 transition-all shadow-sm">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="font-bold text-gray-700">{value}</p>
      </div>
    </div>
  );
}
