'use client';

import React, { useState } from 'react';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  Users, 
  CreditCard, 
  Calendar,
  DollarSign,
  History,
  FileText,
  Star,
  ShieldAlert,
  FileUp,
  Map,
  Clock,
  MessageSquare,
  PhoneCall,
  GanttChartSquare,
  ShieldCheck as ShieldIcon,
  Wrench,
  Navigation,
  PenTool,
  Award,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Camera,
  Bell,
  Send,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CustomerDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
}

type ProfileTab = 'overview' | 'financial' | 'collection' | 'documents' | 'service' | 'tracking' | 'notes' | 'reminders';

export default function CustomerDetailModal({ isOpen, onClose, customer }: CustomerDetailModalProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  if (!isOpen || !customer) return null;

  const tabs: { id: ProfileTab; label: string; icon: any }[] = [
    { id: 'overview', label: 'ទិដ្ឋភាពទូទៅ', icon: User },
    { id: 'financial', label: 'ហិរញ្ញវត្ថុ & ទិញ', icon: DollarSign },
    { id: 'collection', label: 'ការប្រមូលបំណុល', icon: AlertTriangle },
    { id: 'documents', label: 'ឯកសារ & ហត្ថលេខា', icon: FileUp },
    { id: 'service', label: 'សេវាកម្ម & ធានារ៉ាប់រង', icon: Wrench },
    { id: 'tracking', label: 'GPS & តាមដាន', icon: Navigation },
    { id: 'notes', label: 'កំណត់ត្រា & ការហៅ', icon: MessageSquare },
    { id: 'reminders', label: 'ការជូនដំណឹង', icon: Bell },
  ];

  const generateContract = () => {
    alert("កំពុងរៀបចំទាញយកកិច្ចសន្យាជា PDF (A4 Khmer Standard)...");
    // In a real app, you'd use a library like jsPDF or a server-side route
  };

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
          className="relative bg-[#f8fafc] dark:bg-[#020617] w-full max-w-7xl rounded-[40px] shadow-2xl overflow-hidden max-h-[95vh] flex flex-col transition-colors duration-300"
        >
          {/* Header */}
          <div className="p-8 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-[28px] bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border-2 border-white dark:border-gray-800 shadow-xl overflow-hidden">
                  {customer.idFrontImage ? (
                    <img src={customer.idFrontImage} className="w-full h-full object-cover" />
                  ) : (
                    <User size={32} />
                  )}
                </div>
                {customer.status === 'VIP' && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full border-4 border-white dark:border-gray-900 flex items-center justify-center text-white shadow-lg">
                    <Award size={14} />
                  </div>
                )}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white font-kantumruy">{customer.nameKH}</h2>
                  <span className={cn(
                    "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm",
                    customer.riskLevel === 'High Risk' ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800' : 
                    customer.status === 'VIP' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' :
                    'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800'
                  )}>
                    {customer.status} • {customer.riskLevel}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-gray-400 text-sm font-bold font-kantumruy flex items-center gap-2">
                    <Calendar size={14} /> ចុះឈ្មោះ៖ {new Date(customer.createdAt).toLocaleDateString('km-KH')}
                  </p>
                  <p className="text-gray-400 text-sm font-bold font-kantumruy flex items-center gap-2">
                    <MapPin size={14} /> {customer.province}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={generateContract}
                className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 font-kantumruy"
              >
                <Printer size={18} /> បោះពុម្ពកិច្ចសន្យា (A4)
              </button>
              <button onClick={onClose} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all group">
                <X size={24} className="text-gray-400 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-72 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 p-6 space-y-2 overflow-y-auto hidden lg:block">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold text-sm",
                    activeTab === tab.id 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-indigo-600"
                  )}
                >
                  <tab.icon size={20} />
                  <span className="font-kantumruy text-left">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                    {/* Top Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <OverviewCard icon={DollarSign} label="សមតុល្យត្រូវបង់" value="$12,500.00" color="rose" />
                      <OverviewCard icon={TrendingUp} label="ប្រាក់ខែប្រចាំខែ" value={`$${Number(customer.salary).toLocaleString()}`} color="emerald" />
                      <OverviewCard icon={Award} label="ពិន្ទុឥណទាន" value={`${customer.creditScore} pts`} color="amber" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <section className="space-y-6">
                        <SectionTitle icon={User} title="ព័ត៌មានផ្ទាល់ខ្លួន" />
                        <div className="bg-white dark:bg-gray-900 p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                          <DetailRow label="ឈ្មោះអង់គ្លេស" value={customer.nameEN} />
                          <DetailRow label="ភេទ" value={customer.gender} />
                          <DetailRow label="ថ្ងៃខែឆ្នាំកំណើត" value={customer.dob} />
                          <DetailRow label="លេខអត្តសញ្ញាណ" value={customer.idNumber} />
                          <DetailRow label="មុខរបរ" value={customer.occupation} />
                          <DetailRow label="ក្រុមហ៊ុន" value={customer.company} />
                        </div>
                      </section>

                      <section className="space-y-6">
                        <SectionTitle icon={MapPin} title="អាសយដ្ឋាន & ទំនាក់ទំនង" />
                        <div className="bg-white dark:bg-gray-900 p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <ContactItem icon={Phone} label="លេខទូរស័ព្ទ" value={customer.phone} />
                            <ContactItem icon={Users} label="Telegram" value={customer.telegram || 'N/A'} />
                          </div>
                          <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">ទីតាំងបច្ចុប្បន្ន</p>
                            <p className="font-bold text-gray-700 dark:text-gray-300 font-kantumruy leading-relaxed">
                              ផ្ទះលេខ {customer.houseNo}, ភូមិ {customer.village}, ឃុំ/សង្កាត់ {customer.commune}, ស្រុក/ខណ្ឌ {customer.district}, ខេត្ត/ក្រុង {customer.province}
                            </p>
                          </div>
                          {customer.gpsLocation && (
                            <a 
                              href={customer.gpsLocation} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="w-full py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all font-kantumruy"
                            >
                              <Map size={18} /> មើលលើផែនទី (Google Map)
                            </a>
                          )}
                        </div>
                      </section>
                    </div>

                    {/* Biometric & Risk */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm col-span-2">
                        <SectionTitle icon={ShieldCheck} title="ការវាយតម្លៃឥណទាន (Credit Analysis)" />
                        <div className="mt-6 grid grid-cols-2 gap-8">
                          <RiskIndicator label="កម្រិតហានិភ័យ" value={customer.riskLevel} />
                          <RiskIndicator label="ស្ថានភាពបំណុល" value={customer.debtHistory || 'គ្មានបំណុលចាស់'} />
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm">
                        <SectionTitle icon={Camera} title="Biometric Verification" />
                        <div className="mt-4 flex flex-col items-center justify-center py-4 border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl gap-2">
                           <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                              <ShieldIcon size={32} />
                           </div>
                           <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Face Verified</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'financial' && (
                  <motion.div key="financial" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                    <SectionTitle icon={DollarSign} title="ប្រវត្តិទិញ និងការបង់ប្រាក់" />
                    <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800">
                          <tr>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">រថយន្ត</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">តម្លៃ</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ប្រភេទបង់</th>
                            <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">ស្ថានភាព</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                          <tr>
                            <td className="px-6 py-4 font-bold text-gray-900 dark:text-gray-200 font-kantumruy">Toyota Prius 2010 Option 4</td>
                            <td className="px-6 py-4 font-black text-indigo-600 dark:text-indigo-400">$18,500.00</td>
                            <td className="px-6 py-4 font-bold text-gray-600 dark:text-gray-400 font-kantumruy">បង់រំលស់ (Installment)</td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase">Active</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'collection' && (
                  <motion.div key="collection" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                    <div className="bg-rose-50 dark:bg-rose-900/10 p-6 rounded-[32px] border border-rose-100 dark:border-rose-900/30 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-sm">
                          <AlertTriangle size={28} />
                        </div>
                        <div>
                          <p className="text-lg font-black text-rose-700 dark:text-rose-400 font-kantumruy leading-none mb-1">ស្ថានភាពបំណុលបច្ចុប្បន្ន</p>
                          <p className="text-xs text-rose-500 font-bold font-kantumruy">យឺតយ៉ាវ ២ ខែ (Overdue 60 Days)</p>
                        </div>
                      </div>
                      <button className="bg-rose-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-rose-100 dark:shadow-none hover:bg-rose-700 transition-all font-kantumruy text-sm">
                        ចេញលិខិតជូនដំណឹង (Hard Reminder)
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <section className="space-y-4">
                          <SectionTitle icon={Calendar} title="តារាងជួបអតិថិជន (Visit Schedule)" />
                          <div className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                             <div>
                                <p className="font-bold text-gray-900 dark:text-gray-200 font-kantumruy">ជួបនៅផ្ទះផ្ទាល់</p>
                                <p className="text-xs text-gray-400 font-bold">១៥ ឧសភា ២០២៤ - ១០:០០ ព្រឹក</p>
                             </div>
                             <button className="text-indigo-600 dark:text-indigo-400 font-black text-xs uppercase tracking-widest">Edit Plan</button>
                          </div>
                       </section>
                       <section className="space-y-4">
                          <SectionTitle icon={DollarSign} title="Penalty & Fees" />
                          <div className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between">
                             <div>
                                <p className="font-bold text-gray-900 dark:text-gray-200 font-kantumruy">ការប្រាក់ពិន័យ (Penalty)</p>
                                <p className="text-xs text-rose-500 font-black">$45.00</p>
                             </div>
                             <CreditCard size={24} className="text-gray-300 dark:text-gray-600" />
                          </div>
                       </section>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'reminders' && (
                  <motion.div key="reminders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                    <SectionTitle icon={Bell} title="ប្រព័ន្ធជូនដំណឹង (Notification System)" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white dark:bg-gray-900 p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center">
                               <Send size={24} />
                            </div>
                            <div>
                               <p className="font-black text-gray-900 dark:text-white font-kantumruy">Telegram Reminder</p>
                               <p className="text-xs text-gray-400 font-bold">ផ្ញើសាររំលឹកទៅកាន់ Telegram</p>
                            </div>
                         </div>
                         <textarea 
                           className="w-full bg-gray-50 dark:bg-gray-950 border-none rounded-2xl p-4 text-sm font-bold text-gray-600 dark:text-gray-300 font-kantumruy min-h-[100px]"
                           defaultValue={`សូមជម្រាបថា ការបង់រំលស់របស់លោកអ្នកដល់ថ្ងៃកំណត់ហើយ (${customer.nameKH})`}
                         />
                         <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-100 dark:shadow-none hover:bg-blue-700 transition-all font-kantumruy">
                            ផ្ញើសារឥឡូវនេះ (Send Now)
                         </button>
                      </div>

                      <div className="bg-white dark:bg-gray-900 p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
                               <MessageSquare size={24} />
                            </div>
                            <div>
                               <p className="font-black text-gray-900 dark:text-white font-kantumruy">SMS Reminder</p>
                               <p className="text-xs text-gray-400 font-bold">ផ្ញើសាររំលឹកតាមរយៈ SMS</p>
                            </div>
                         </div>
                         <textarea 
                           className="w-full bg-gray-50 dark:bg-gray-950 border-none rounded-2xl p-4 text-sm font-bold text-gray-600 dark:text-gray-300 font-kantumruy min-h-[100px]"
                           defaultValue={`BS-CAR: ការបង់រំលស់របស់លោកអ្នកដល់ថ្ងៃកំណត់ហើយ។ សូមអរគុណ!`}
                         />
                         <button className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-100 dark:shadow-none hover:bg-emerald-700 transition-all font-kantumruy">
                            ផ្ញើ SMS (Send SMS)
                         </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'documents' && (
                  <motion.div key="documents" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                    <SectionTitle icon={FileUp} title="ឯកសារ និងហត្ថលេខាឌីជីថល" />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                      <DocBox label="កិច្ចសន្យា (Contract)" />
                      <DocBox label="វិក្កយបត្រ (Receipt)" />
                      <DocBox label="ID Card" />
                      <DocBox label="Salary Slip" />
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm">
                       <SectionTitle icon={PenTool} title="E-Signature Verification" />
                       <div className="mt-6 aspect-[3/1] bg-gray-50 dark:bg-gray-950 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl flex items-center justify-center">
                          <p className="text-gray-300 dark:text-gray-600 font-bold font-kantumruy">ហត្ថលេខាឌីជីថលត្រូវបានរក្សាទុក (Digital Signature Secured)</p>
                       </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'notes' && (
                  <motion.div key="notes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                    <div className="flex items-center justify-between">
                      <SectionTitle icon={MessageSquare} title="កំណត់ត្រា និងប្រវត្តិការហៅ" />
                      <button className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-xl font-bold text-xs font-kantumruy hover:bg-indigo-100 dark:hover:bg-indigo-900/40">+ បន្ថែមចំណាំ</button>
                    </div>
                    
                    <div className="space-y-4">
                      <NoteItem user="Admin" date="10 May 2024" content="ភ្ញៀវសន្យាបង់ប្រាក់នៅថ្ងៃទី ១៥ ខែនេះ" type="Promised to Pay" />
                      <NoteItem user="Sales Team" date="08 May 2024" content="បានតេទៅ តែគ្មានអ្នកទទួល (No Answer)" type="Call History" />
                      <NoteItem user="Collector" date="05 May 2024" content="បានទៅផ្ទាល់ ភ្ញៀវសុំពន្យារពេល ១ សប្តាហ៍" type="Visit Note" />
                    </div>
                  </motion.div>
                )}

                {activeTab === 'tracking' && (
                  <motion.div key="tracking" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                    <SectionTitle icon={Navigation} title="ប្រព័ន្ធតាមដាន GPS & រថយន្ត" />
                    <div className="bg-white dark:bg-gray-900 p-8 rounded-[40px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
                       <div className="aspect-video bg-gray-100 dark:bg-gray-950 rounded-[32px] flex items-center justify-center overflow-hidden border border-gray-200 dark:border-gray-800">
                          <div className="flex flex-col items-center gap-3">
                             <Map size={48} className="text-gray-300 dark:text-gray-700" />
                             <p className="text-gray-400 dark:text-gray-600 font-bold font-kantumruy">ផែនទី GPS របស់រថយន្ត (GPS Live Map)</p>
                          </div>
                       </div>
                       <div className="grid grid-cols-3 gap-6">
                          <TrackingStatus label="GPS Signal" value="Strong" color="emerald" />
                          <TrackingStatus label="Engine Status" value="Running" color="emerald" />
                          <TrackingStatus label="Battery" value="95%" color="emerald" />
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Online</p>
               </div>
               <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Ref: BS-CAR-{customer.id}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={onClose} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-8 py-3 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all font-kantumruy">បោះបង់</button>
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-none flex items-center gap-2 font-kantumruy">
                <History size={18} /> ទាញយករបាយការណ៍ (Full PDF)
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function SectionTitle({ icon: Icon, title }: { icon: any, title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-center text-indigo-600 dark:text-indigo-400">
        <Icon size={20} />
      </div>
      <h3 className="text-xl font-black text-gray-900 dark:text-white font-kantumruy">{title}</h3>
    </div>
  );
}

function DetailRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest font-kantumruy">{label}</p>
      <p className="font-black text-gray-700 dark:text-gray-300 font-kantumruy">{value}</p>
    </div>
  );
}

function ContactItem({ icon: Icon, label, value }: any) {
  return (
    <div className="bg-gray-50/50 dark:bg-gray-950/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={14} className="text-indigo-500" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
      </div>
      <p className="font-black text-gray-900 dark:text-white">{value}</p>
    </div>
  );
}

function OverviewCard({ icon: Icon, label, value, color }: any) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
    rose: 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400',
    emerald: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
  };
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm">
      <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", colors[color as keyof typeof colors])}>
        <Icon size={24} />
      </div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-kantumruy">{label}</p>
      <h4 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{value}</h4>
    </div>
  );
}

function RiskIndicator({ label, value }: any) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-kantumruy">{label}</p>
      <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-2xl font-black text-gray-700 dark:text-gray-300 font-kantumruy border border-gray-100 dark:border-gray-800">
        {value}
      </div>
    </div>
  );
}

function DocBox({ label }: { label: string }) {
  return (
    <div className="aspect-[3/4] bg-white dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center gap-2 p-4 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 group transition-all">
      <FileText size={32} className="text-gray-200 dark:text-gray-700 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
      <p className="text-[9px] font-black text-gray-400 dark:text-gray-500 text-center uppercase tracking-widest group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{label}</p>
    </div>
  );
}

function NoteItem({ user, date, content, type }: any) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-[28px] border border-gray-100 dark:border-gray-800 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-[10px]">{user.charAt(0)}</div>
          <div>
            <p className="text-xs font-black text-gray-900 dark:text-white">{user}</p>
            <p className="text-[10px] text-gray-400 font-bold">{date}</p>
          </div>
        </div>
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-md text-[9px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">{type}</span>
      </div>
      <p className="text-sm font-bold text-gray-600 dark:text-gray-400 font-kantumruy leading-relaxed">{content}</p>
    </div>
  );
}

function TrackingStatus({ label, value, color }: any) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800">
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
      <p className={cn("font-black text-lg", color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white')}>{value}</p>
    </div>
  );
}
