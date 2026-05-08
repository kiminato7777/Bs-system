'use client';

import React, { useState, useRef } from 'react';
import { 
  Settings,
  X, 
  Check, 
  Loader2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  FileText, 
  Camera,
  Upload,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Calendar,
  Building2,
  Users,
  CreditCard,
  History,
  Image as ImageIcon,
  FileUp,
  ShieldAlert,
  Star,
  FileSearch,
  Bell,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { rtdb, storage } from '@/lib/firebase';
import { ref as dbRef, push, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { cn } from '@/lib/utils';

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerToEdit?: any;
}

type TabType = 'basic' | 'address' | 'identity' | 'job' | 'guarantor' | 'documents' | 'risk' | 'others' | 'status';

export default function AddCustomerModal({ isOpen, onClose, customerToEdit }: AddCustomerModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('basic');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    // 1. Basic Information
    nameKH: '',
    nameEN: '',
    gender: 'Male',
    dob: '',
    phone: '',
    telegram: '',
    email: '',
    
    // 2. Address
    province: '',
    district: '',
    commune: '',
    village: '',
    houseNo: '',
    
    // 3. Identity Documents
    idType: 'ID Card',
    idNumber: '',
    idFrontImage: '',
    idBackImage: '',
    
    // 4. Job Information
    occupation: '',
    company: '',
    salary: '',
    workDuration: '',
    workLocation: '',
    
    // 5. Guarantor
    guarantorName: '',
    guarantorPhone: '',
    guarantorID: '',
    guarantorAddress: '',
    guarantorRelation: '',

    // 12. More Documents
    docSalarySlip: '',
    docContract: '',
    docHouseBook: '',
    docBankStatement: '',

    // 13. Risk & Credit
    riskLevel: 'Low Risk', // Low, Medium, High
    creditScore: '100',
    debtHistory: '',
    
    // 17. Follow Up
    followUpDate: '',
    followUpNote: '',

    // 23. GPS & Map
    gpsLocation: '',

    // 29. Referral
    referralName: '',
    referralCommission: '',

    // 32. Insurance
    insuranceCompany: '',
    insuranceExpireDate: '',
    
    // 6. Status
    status: 'New Customer', // New, Active, VIP, Blacklist, Late Payment
  });

  // Pre-fill form when customerToEdit changes
  React.useEffect(() => {
    if (customerToEdit) {
      setFormData({
        ...formData,
        ...customerToEdit,
      });
    } else {
      setFormData({
        nameKH: '',
        nameEN: '',
        gender: 'Male',
        dob: '',
        phone: '',
        telegram: '',
        email: '',
        province: '',
        district: '',
        commune: '',
        village: '',
        houseNo: '',
        idType: 'ID Card',
        idNumber: '',
        idFrontImage: '',
        idBackImage: '',
        occupation: '',
        company: '',
        salary: '',
        workDuration: '',
        workLocation: '',
        guarantorName: '',
        guarantorPhone: '',
        guarantorID: '',
        guarantorAddress: '',
        guarantorRelation: '',
        docSalarySlip: '',
        docContract: '',
        docHouseBook: '',
        docBankStatement: '',
        riskLevel: 'Low Risk',
        creditScore: '100',
        debtHistory: '',
        followUpDate: '',
        followUpNote: '',
        gpsLocation: '',
        referralName: '',
        referralCommission: '',
        insuranceCompany: '',
        insuranceExpireDate: '',
        status: 'New Customer',
      });
    }
  }, [customerToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(field);
    try {
      const fileName = `customers/${Date.now()}_${field}_${file.name}`;
      const imgRef = storageRef(storage, fileName);
      await uploadBytes(imgRef, file);
      const url = await getDownloadURL(imgRef);
      setFormData(prev => ({ ...prev, [field]: url }));
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploadingImage(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (customerToEdit) {
        const customerRef = dbRef(rtdb, `customers/${customerToEdit.id}`);
        await set(customerRef, {
          ...formData,
          updatedAt: new Date().toISOString(),
        });
      } else {
        const customersRef = dbRef(rtdb, 'customers');
        const newCustomerRef = push(customersRef);
        await set(newCustomerRef, {
          ...formData,
          purchaseHistory: [],
          installments: [],
          payments: [],
          createdAt: new Date().toISOString(),
        });
      }
      onClose();
    } catch (error) {
      console.error("Error saving customer:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'basic', label: 'ព័ត៌មានទូទៅ', icon: User },
    { id: 'address', label: 'អាសយដ្ឋាន', icon: MapPin },
    { id: 'identity', label: 'អត្តសញ្ញាណ', icon: ShieldCheck },
    { id: 'job', label: 'ការងារ', icon: Briefcase },
    { id: 'guarantor', label: 'អ្នកធានា', icon: Users },
    { id: 'documents', label: 'ឯកសាររថយន្ត', icon: FileUp },
    { id: 'risk', label: 'ឥណទាន', icon: ShieldAlert },
    { id: 'others', label: 'ផ្សេងៗ', icon: Star },
    { id: 'status', label: 'ស្ថានភាព', icon: Settings },
  ];

  const checkEligibility = () => {
    const salary = Number(formData.salary);
    let score = 100;
    let risk = 'Low Risk';

    if (salary < 500) {
      score = 60;
      risk = 'High Risk';
    } else if (salary < 800) {
      score = 80;
      risk = 'Medium Risk';
    }

    if (formData.debtHistory) {
      score -= 20;
    }

    setFormData(prev => ({ 
      ...prev, 
      creditScore: score.toString(), 
      riskLevel: risk 
    }));
    
    alert(`ការវាយតម្លៃដោយស្វ័យប្រវត្តិ៖\n- ពិន្ទុ៖ ${score}/100\n- កម្រិតហានិភ័យ៖ ${risk}`);
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
          className="relative bg-white w-full max-w-4xl rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 z-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
            
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-white rounded-[18px] shadow-xl shadow-indigo-100/50 flex items-center justify-center p-1.5 border border-gray-50 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                <img src="/img/LOGO.png" alt="BS-CAR LOGO" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white font-kantumruy">ចុះឈ្មោះអតិថិជន</h2>
                  <span className="bg-emerald-500 text-white text-[8px] font-black px-2 py-0.5 rounded-lg shadow-lg shadow-emerald-200 uppercase tracking-widest">
                    Standard
                  </span>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mt-0.5 font-kantumruy font-bold flex items-center gap-2 text-xs">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                  គ្រប់គ្រងព័ត៌មានអតិថិជន និងការបង់រំលស់
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all group relative z-10"
            >
              <X size={20} className="text-gray-400 group-hover:rotate-90 transition-transform duration-300" />
            </button>

            <div className="absolute bottom-0 left-0 h-1 bg-gray-100 dark:bg-gray-800 w-full">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(tabs.findIndex(t => t.id === activeTab) + 1) / tabs.length * 100}%` }}
                className="h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
              />
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Tabs */}
            <div className="w-56 bg-gray-50/50 dark:bg-gray-950/50 border-r border-gray-100 dark:border-gray-800 p-4 space-y-1.5 overflow-y-auto hidden md:block">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all font-bold text-xs",
                    activeTab === tab.id 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                      : "text-gray-500 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-indigo-600"
                  )}
                >
                  <tab.icon size={16} />
                  <span className="font-kantumruy text-left">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Form Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-white dark:bg-gray-900">
                <form id="add-customer-form" onSubmit={handleSave}>
                  <AnimatePresence mode="wait">
                    {activeTab === 'basic' && (
                      <motion.div key="basic" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <SectionHeading icon={User} title="ព័ត៌មានមូលដ្ឋាន (Basic Information)" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input label="ឈ្មោះខ្មែរ" name="nameKH" value={formData.nameKH} onChange={handleChange} placeholder="ឧ. កៅ បញ្ញា" required />
                          <Input label="ឈ្មោះអង់គ្លេស" name="nameEN" value={formData.nameEN} onChange={handleChange} placeholder="Panha Kao" required />
                          <Select label="ភេទ" name="gender" value={formData.gender} onChange={handleChange} options={['Male', 'Female', 'Other']} />
                          <Input label="ថ្ងៃខែឆ្នាំកំណើត" name="dob" type="date" value={formData.dob} onChange={handleChange} required />
                          <Input label="លេខទូរស័ព្ទ" name="phone" value={formData.phone} onChange={handleChange} placeholder="012 345 678" required />
                          <Input label="Telegram" name="telegram" value={formData.telegram} onChange={handleChange} placeholder="@username" />
                          <Input label="អ៊ីមែល" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="example@mail.com" />
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'address' && (
                      <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <SectionHeading icon={MapPin} title="អាសយដ្ឋានបច្ចុប្បន្ន (Address)" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input label="ខេត្ត / ក្រុង" name="province" value={formData.province} onChange={handleChange} placeholder="ឧ. ភ្នំពេញ" required />
                          <Input label="ស្រុក / ខណ្ឌ" name="district" value={formData.district} onChange={handleChange} placeholder="ឧ. ចំការមន" required />
                          <Input label="ឃុំ / សង្កាត់" name="commune" value={formData.commune} onChange={handleChange} placeholder="ឧ. បឹងកេងកង" required />
                          <Input label="ភូមិ" name="village" value={formData.village} onChange={handleChange} placeholder="ឧ. ភូមិ ១" required />
                          <Input label="ផ្ទះលេខ" name="houseNo" value={formData.houseNo} onChange={handleChange} placeholder="ឧ. 123A" required />
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'identity' && (
                      <motion.div key="identity" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <SectionHeading icon={ShieldCheck} title="ឯកសារសម្គាល់ខ្លួន (Identity Documents)" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Select label="ប្រភេទឯកសារ" name="idType" value={formData.idType} onChange={handleChange} options={['ID Card', 'Passport', 'Family Book', 'Driving License']} />
                          <Input label="លេខសម្កាល់" name="idNumber" value={formData.idNumber} onChange={handleChange} placeholder="លេខអត្តសញ្ញាណប័ណ្ណ ឬលិខិតឆ្លងដែន" required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                          <ImageUpload label="រូបភាពខាងមុខ (Front Image)" value={formData.idFrontImage} onUpload={(e: any) => handleImageUpload(e, 'idFrontImage')} isUploading={uploadingImage === 'idFrontImage'} />
                          <ImageUpload label="រូបភាពខាងក្រោយ (Back Image)" value={formData.idBackImage} onUpload={(e: any) => handleImageUpload(e, 'idBackImage')} isUploading={uploadingImage === 'idBackImage'} />
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'job' && (
                      <motion.div key="job" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <SectionHeading icon={Briefcase} title="ព័ត៌មានការងារ (Job Information)" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input label="មុខរបរ" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="ឧ. បុគ្គលិកក្រុមហ៊ុន" required />
                          <Input label="ក្រុមហ៊ុនធ្វើការ" name="company" value={formData.company} onChange={handleChange} placeholder="ឈ្មោះក្រុមហ៊ុន" required />
                          <Input label="ប្រាក់ខែ (USD)" name="salary" type="number" value={formData.salary} onChange={handleChange} placeholder="0.00" required />
                          <Input label="រយៈពេលធ្វើការ" name="workDuration" value={formData.workDuration} onChange={handleChange} placeholder="ឧ. ២ ឆ្នាំ" />
                          <Input label="ទីតាំងការងារ" name="workLocation" value={formData.workLocation} onChange={handleChange} placeholder="អាសយដ្ឋានកន្លែងធ្វើការ" />
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'guarantor' && (
                      <motion.div key="guarantor" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <SectionHeading icon={Users} title="អ្នកធានា (Guarantor Information)" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Input label="ឈ្មោះអ្នកធានា" name="guarantorName" value={formData.guarantorName} onChange={handleChange} placeholder="ឈ្មោះពេញ" />
                          <Input label="លេខទូរស័ព្ទ" name="guarantorPhone" value={formData.guarantorPhone} onChange={handleChange} placeholder="012 345 678" />
                          <Input label="លេខអត្តសញ្ញាណប័ណ្ណ" name="guarantorID" value={formData.guarantorID} onChange={handleChange} placeholder="លេខសម្គាល់អ្នកធានា" />
                          <Input label="ត្រូវជា (តួនាទី)" name="guarantorRelation" value={formData.guarantorRelation} onChange={handleChange} placeholder="ឧ. បងប្អូន, មិត្តភក្តិ..." />
                          <div className="md:col-span-2">
                            <Input label="អាសយដ្ឋានអ្នកធានា" name="guarantorAddress" value={formData.guarantorAddress} onChange={handleChange} placeholder="អាសយដ្ឋានលម្អិតរបស់អ្នកធានា" />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'documents' && (
                      <motion.div key="documents" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <SectionHeading icon={FileUp} title="ឯកសារបន្ថែម (Additional Documents)" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <ImageUpload label="លិខិតបញ្ជាក់ប្រាក់ខែ (Salary Slip)" value={formData.docSalarySlip} onUpload={(e: any) => handleImageUpload(e, 'docSalarySlip')} isUploading={uploadingImage === 'docSalarySlip'} />
                          <ImageUpload label="កិច្ចសន្យា (Contract)" value={formData.docContract} onUpload={(e: any) => handleImageUpload(e, 'docContract')} isUploading={uploadingImage === 'docContract'} />
                          <ImageUpload label="សៀវភៅស្នាក់នៅ/គ្រួសារ (House Book)" value={formData.docHouseBook} onUpload={(e: any) => handleImageUpload(e, 'docHouseBook')} isUploading={uploadingImage === 'docHouseBook'} />
                          <ImageUpload label="របាយការណ៍ធនាគារ (Bank Statement)" value={formData.docBankStatement} onUpload={(e: any) => handleImageUpload(e, 'docBankStatement')} isUploading={uploadingImage === 'docBankStatement'} />
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'risk' && (
                      <motion.div key="risk" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                          <SectionHeading icon={ShieldAlert} title="ការវាយតម្លៃឥណទាន (Credit & Risk)" />
                          <button 
                            type="button"
                            onClick={checkEligibility}
                            className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-emerald-100 transition-all font-kantumruy"
                          >
                            <ShieldCheck size={14} /> ពិនិត្យសេចក្តីអនុម័ត (Auto Approval)
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <Select label="កម្រិតហានិភ័យ (Risk Level)" name="riskLevel" value={formData.riskLevel} onChange={handleChange} options={['Low Risk', 'Medium Risk', 'High Risk']} />
                          <Input label="ពិន្ទុឥណទាន (Credit Score)" name="creditScore" type="number" value={formData.creditScore} onChange={handleChange} placeholder="0-100" />
                          <div className="md:col-span-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 font-kantumruy">ប្រវត្តិបំណុលចាស់ (Debt History)</label>
                            <textarea name="debtHistory" value={formData.debtHistory} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-950 border-2 border-transparent rounded-2xl p-4 focus:border-indigo-500/20 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all font-bold text-gray-700 dark:text-gray-200 font-kantumruy min-h-[80px]" placeholder="បញ្ជាក់ពីបំណុលចាស់ៗប្រសិនបើមាន..." />
                          </div>
                          <Input label="ថ្ងៃត្រូវតាមដានបន្ត (Follow Up Date)" name="followUpDate" type="date" value={formData.followUpDate} onChange={handleChange} />
                          <div className="md:col-span-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 font-kantumruy">ចំណាំ (Follow Up Note)</label>
                            <textarea name="followUpNote" value={formData.followUpNote} onChange={handleChange} className="w-full bg-gray-50 dark:bg-gray-950 border-2 border-transparent rounded-2xl p-4 focus:border-indigo-500/20 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all font-bold text-gray-700 dark:text-gray-200 font-kantumruy min-h-[80px]" placeholder="សរសេរចំណាំសម្រាប់ការតាមដាន..." />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'others' && (
                      <motion.div key="others" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <SectionHeading icon={Star} title="ព័ត៌មានផ្សេងៗ (Others)" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="md:col-span-2">
                            <Input label="ទីតាំង GPS (Google Map Link)" name="gpsLocation" value={formData.gpsLocation} onChange={handleChange} placeholder="https://goo.gl/maps/..." />
                          </div>
                          <div className="md:col-span-2 grid grid-cols-2 gap-4 bg-indigo-50/30 dark:bg-indigo-900/10 p-6 rounded-3xl">
                             <div className="col-span-2 mb-2"><SectionHeading icon={Users} title="ប្រព័ន្ធណែនាំ (Referral System)" /></div>
                             <Input label="ឈ្មោះអ្នកណែនាំ" name="referralName" value={formData.referralName} onChange={handleChange} placeholder="ឈ្មោះពេញ" />
                             <Input label="កម្រៃជើងសារ (Commission)" name="referralCommission" value={formData.referralCommission} onChange={handleChange} placeholder="$0.00" />
                          </div>
                          <div className="md:col-span-2 grid grid-cols-2 gap-4 bg-emerald-50/30 dark:bg-emerald-900/10 p-6 rounded-3xl">
                             <div className="col-span-2 mb-2"><SectionHeading icon={ShieldCheck} title="ធានារ៉ាប់រង (Insurance)" /></div>
                             <Input label="ក្រុមហ៊ុនធានារ៉ាប់រង" name="insuranceCompany" value={formData.insuranceCompany} onChange={handleChange} placeholder="ឈ្មោះក្រុមហ៊ុន" />
                             <Input label="ថ្ងៃផុតកំណត់" name="insuranceExpireDate" type="date" value={formData.insuranceExpireDate} onChange={handleChange} />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'status' && (
                      <motion.div key="status" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                        <SectionHeading icon={Settings} title="ស្ថានភាពអតិថិជន (Customer Status)" />
                        <div className="max-w-md space-y-6">
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">ស្ថានភាពបច្ចុប្បន្ន</label>
                            <div className="grid grid-cols-2 gap-3">
                              {['New Customer', 'Active', 'VIP', 'Blacklist', 'Late Payment'].map((status) => (
                                <button key={status} type="button" onClick={() => setFormData(prev => ({ ...prev, status }))} className={cn("p-4 rounded-2xl border-2 transition-all font-bold text-sm text-center", formData.status === status ? "border-indigo-600 bg-indigo-50 text-indigo-600 shadow-md" : "border-gray-100 text-gray-500 hover:border-gray-200")}>
                                  {status}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>

              {/* Action Bar */}
              <div className="p-8 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                <div className="flex gap-2">
                  <button type="button" onClick={() => { const currentIndex = tabs.findIndex(t => t.id === activeTab); if (currentIndex > 0) setActiveTab(tabs[currentIndex - 1].id); }} disabled={activeTab === 'basic'} className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-200 disabled:opacity-30 transition-all font-kantumruy">
                    <ChevronLeft size={20} /> ថយក្រោយ
                  </button>
                  <button type="button" onClick={() => { const currentIndex = tabs.findIndex(t => t.id === activeTab); if (currentIndex < tabs.length - 1) setActiveTab(tabs[currentIndex + 1].id); }} disabled={activeTab === 'status'} className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-indigo-600 hover:bg-indigo-100 disabled:opacity-30 transition-all font-kantumruy">
                    បន្ទាប់ <ChevronRight size={20} />
                  </button>
                </div>
                <div className="flex gap-3">
                  <button onClick={onClose} className="px-8 py-3 rounded-2xl font-bold text-gray-400 hover:text-gray-600 transition-all font-kantumruy">បោះបង់</button>
                  <button type="submit" form="add-customer-form" disabled={loading} className="bg-indigo-600 text-white px-10 py-4 rounded-[24px] font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2 min-w-[160px] justify-center active:scale-95 disabled:opacity-50 font-kantumruy">
                    {loading ? <Loader2 className="animate-spin" size={24} /> : <><Check size={24} /> រក្សាទុកទិន្នន័យ</>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function SectionHeading({ icon: Icon, title }: { icon: any, title: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Icon size={20} /></div>
      <h3 className="text-xl font-black text-gray-900 font-kantumruy">{title}</h3>
    </div>
  );
}

function Input({ label, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 font-kantumruy">{label}</label>
      <input {...props} className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 focus:border-indigo-500/20 focus:bg-white outline-none transition-all font-bold text-gray-700 font-kantumruy" />
    </div>
  );
}

function Select({ label, options, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 font-kantumruy">{label}</label>
      <select {...props} className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 focus:border-indigo-500/20 focus:bg-white outline-none transition-all font-bold text-gray-700 appearance-none">
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function ImageUpload({ label, value, onUpload, isUploading }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 font-kantumruy">{label}</label>
      <div onClick={() => fileInputRef.current?.click()} className={cn("aspect-video border-2 border-dashed rounded-[32px] flex flex-col items-center justify-center gap-3 cursor-pointer transition-all overflow-hidden relative group", value ? "border-emerald-500/50 bg-emerald-50/10" : "border-gray-100 hover:border-indigo-300 hover:bg-indigo-50/30")}>
        <input type="file" ref={fileInputRef} onChange={onUpload} className="hidden" accept="image/*,application/pdf" />
        {isUploading ? <Loader2 className="animate-spin text-indigo-600" size={32} /> : value ? <><img src={value} alt="Preview" className="w-full h-full object-cover" /><div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Camera className="text-white" size={32} /></div></> : <><div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:text-indigo-600 group-hover:scale-110 transition-all"><Upload size={28} /></div><p className="text-xs font-bold text-gray-400 group-hover:text-indigo-600 transition-colors font-kantumruy">ចុចដើម្បី Upload</p></>}
      </div>
    </div>
  );
}
