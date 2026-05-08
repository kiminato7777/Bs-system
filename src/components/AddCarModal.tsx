'use client';

import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  Check, 
  Loader2, 
  Car, 
  Hash, 
  Calendar, 
  Palette, 
  Tag, 
  DollarSign, 
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { rtdb, storage } from '@/lib/firebase';
import { ref as dbRef, push, set } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  carToEdit?: any;
}

export default function AddCarModal({ isOpen, onClose, carToEdit }: AddCarModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    plate: '',
    color: '',
    vin: '',
    purchasePrice: '',
    salePrice: '',
    status: 'Available',
    image: ''
  });

  // Load data if editing
  React.useEffect(() => {
    if (carToEdit) {
      setFormData({
        brand: carToEdit.brand || '',
        model: carToEdit.model || '',
        year: carToEdit.year || '',
        plate: carToEdit.plate || '',
        color: carToEdit.color || '',
        vin: carToEdit.vin || '',
        purchasePrice: carToEdit.purchasePrice?.toString() || '',
        salePrice: carToEdit.salePrice?.toString() || '',
        status: carToEdit.status || 'Available',
        image: carToEdit.image || ''
      });
    } else {
      setFormData({
        brand: '',
        model: '',
        year: '',
        plate: '',
        color: '',
        vin: '',
        purchasePrice: '',
        salePrice: '',
        status: 'Available',
        image: ''
      });
    }
  }, [carToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          let quality = 0.8;
          const getBlob = (q: number) => {
            canvas.toBlob((blob) => {
              if (blob) {
                if (blob.size > 500 * 1024 && q > 0.1) {
                  getBlob(q - 0.1);
                } else {
                  resolve(blob);
                }
              } else {
                reject(new Error('Canvas to Blob failed'));
              }
            }, 'image/jpeg', q);
          };
          getBlob(quality);
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const compressedBlob = await compressImage(file);
      const fileName = `cars/${Date.now()}_${file.name}`;
      const imageRef = storageRef(storage, fileName);
      
      await uploadBytes(imageRef, compressedBlob);
      const downloadURL = await getDownloadURL(imageRef);
      
      setFormData(prev => ({ ...prev, image: downloadURL }));
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (carToEdit) {
        // Update existing car
        const carRef = dbRef(rtdb, `inventory/${carToEdit.id}`);
        await set(carRef, {
          ...formData,
          purchasePrice: Number(formData.purchasePrice),
          salePrice: Number(formData.salePrice),
          updatedAt: new Date().toISOString(),
          createdAt: carToEdit.createdAt // Preserve creation date
        });
      } else {
        // Push new car
        const carsRef = dbRef(rtdb, 'inventory');
        const newCarRef = push(carsRef);
        await set(newCarRef, {
          ...formData,
          purchasePrice: Number(formData.purchasePrice),
          salePrice: Number(formData.salePrice),
          createdAt: new Date().toISOString(),
        });
      }
      
      onClose();
    } catch (error) {
      console.error("Error saving car:", error);
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
          className="absolute inset-0 bg-[#0f172a]/80 backdrop-blur-md"
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white w-full max-w-5xl rounded-[40px] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-white/20"
        >
          {/* Header */}
          <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 flex items-center justify-center overflow-hidden">
                <img src="/img/LOGO.png" alt="BS-CAR LOGO" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-gray-900 font-kantumruy">
                  {carToEdit ? 'កែប្រែព័ត៌មានឡាន' : 'បញ្ចូលឡានថ្មី'}
                </h2>
                <p className="text-gray-500 mt-1 font-kantumruy">
                  {carToEdit ? 'កែសម្រួលព័ត៌មានឡានដែលបានជ្រើសរើស' : 'សូមបំពេញព័ត៌មានឡានឱ្យបានត្រឹមត្រូវតាមស្តង់ដារ'}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-gray-100 rounded-2xl transition-all group"
            >
              <X size={24} className="text-gray-400 group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <form id="add-car-form" onSubmit={handleSave} className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Side: Image Upload */}
                <div className="lg:col-span-4">
                  <h3 className="font-bold text-gray-900 mb-4 font-kantumruy flex items-center gap-2">
                    <ImageIcon size={18} className="text-indigo-600" />
                    រូបភាពឡាន
                  </h3>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-[4/5] border-2 border-dashed border-gray-100 rounded-[40px] flex flex-col items-center justify-center gap-4 hover:border-indigo-500 hover:bg-indigo-50/30 transition-all cursor-pointer group relative overflow-hidden shadow-sm"
                  >
                    {uploadingImage ? (
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-sm font-bold text-indigo-600 font-kantumruy">កំពុងបញ្ចូល...</p>
                      </div>
                    ) : formData.image ? (
                      <>
                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white backdrop-blur-sm">
                          <div className="bg-white/20 p-4 rounded-full mb-2">
                            <Upload size={32} />
                          </div>
                          <p className="text-sm font-bold font-kantumruy">ប្តូររូបភាព</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-20 h-20 rounded-[32px] bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all duration-300">
                          <Upload size={40} />
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-700 font-kantumruy group-hover:text-indigo-600 transition-colors">ជ្រើសរើសរូបភាព</p>
                          <p className="text-xs text-gray-400 mt-1">JPG, PNG (Compress to 500KB)</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Right Side: General Info */}
                <div className="lg:col-span-8 space-y-10">
                  <section>
                    <h3 className="font-bold text-gray-900 mb-6 font-kantumruy flex items-center gap-2 text-lg">
                      <Car size={20} className="text-indigo-600" />
                      ព័ត៌មានទូទៅ
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">ម៉ាក (Brand)</label>
                        <div className="relative group">
                          <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                          <input 
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            placeholder="Toyota, Lexus, Ford..." 
                            required
                            className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 pl-12 focus:border-indigo-500/20 focus:bg-white outline-none transition-all font-bold text-gray-700" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">ម៉ូដែល (Model)</label>
                        <div className="relative group">
                          <Car className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                          <input 
                            name="model"
                            value={formData.model}
                            onChange={handleChange}
                            placeholder="Prius, RX350, Ranger..." 
                            required
                            className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 pl-12 focus:border-indigo-500/20 focus:bg-white outline-none transition-all font-bold text-gray-700" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">ឆ្នាំ (Year)</label>
                        <div className="relative group">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                          <input 
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            placeholder="2015, 2020..." 
                            required
                            className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 pl-12 focus:border-indigo-500/20 focus:bg-white outline-none transition-all font-bold text-gray-700" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">ផ្លាកលេខ (Plate)</label>
                        <div className="relative group">
                          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                          <input 
                            name="plate"
                            value={formData.plate}
                            onChange={handleChange}
                            placeholder="2A-1234, PP-5678..." 
                            required
                            className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 pl-12 focus:border-indigo-500/20 focus:bg-white outline-none transition-all font-bold text-gray-700" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1 font-kantumruy">ស្ថានភាព</label>
                        <select 
                          name="status"
                          value={formData.status}
                          onChange={handleChange}
                          className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 focus:border-indigo-500/20 focus:bg-white outline-none transition-all font-bold text-gray-700 appearance-none font-kantumruy"
                        >
                          <option value="Available">នៅទំនេរ</option>
                          <option value="Sold">បានលក់</option>
                          <option value="Reserved">បានកក់</option>
                          <option value="Maintenance">កំពុងជួសជុល</option>
                        </select>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="font-bold text-gray-900 mb-6 font-kantumruy flex items-center gap-2 text-lg">
                      <FileText size={20} className="text-indigo-600" />
                      បច្ចេកទេស និងតម្លៃ
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">ពណ៌ (Color)</label>
                        <div className="relative group">
                          <Palette className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                          <input 
                            name="color"
                            value={formData.color}
                            onChange={handleChange}
                            placeholder="ស, ខ្មៅ, ប្រផេះ..." 
                            required
                            className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 pl-12 focus:border-indigo-500/20 focus:bg-white outline-none transition-all font-bold text-gray-700" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">លេខតួ (VIN)</label>
                        <div className="relative group">
                          <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                          <input 
                            name="vin"
                            value={formData.vin}
                            onChange={handleChange}
                            placeholder="លេខតួឡាន ១៧ ខ្ទង់" 
                            required
                            className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 pl-12 focus:border-indigo-500/20 focus:bg-white outline-none transition-all font-bold text-gray-700" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">តម្លៃទិញ</label>
                        <div className="relative group">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                          <input 
                            type="number" 
                            name="purchasePrice"
                            value={formData.purchasePrice}
                            onChange={handleChange}
                            placeholder="0.00" 
                            required
                            className="w-full bg-gray-50 border-2 border-transparent rounded-2xl p-4 pl-12 focus:border-indigo-500/20 focus:bg-white outline-none transition-all font-bold text-gray-900" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">តម្លៃលក់</label>
                        <div className="relative group">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                          <input 
                            type="number" 
                            name="salePrice"
                            value={formData.salePrice}
                            onChange={handleChange}
                            placeholder="0.00" 
                            required
                            className="w-full bg-indigo-50/30 border-2 border-transparent rounded-2xl p-4 pl-12 focus:border-indigo-500/20 focus:bg-white outline-none transition-all font-bold text-indigo-600" 
                          />
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-gray-100 flex items-center justify-end gap-4 bg-gray-50/50">
            <button 
              onClick={onClose}
              className="px-10 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-200 transition-all font-kantumruy"
            >
              បោះបង់
            </button>
            <button 
              type="submit"
              form="add-car-form"
              disabled={loading || uploadingImage}
              className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center gap-3 min-w-[180px] justify-center active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed font-kantumruy"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <Check size={24} />
                  {carToEdit ? 'រក្សាទុកការកែប្រែ' : 'រក្សាទុក'}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
