'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Car, 
  Eye, 
  Edit2, 
  Trash2,
  CheckCircle,
  Clock,
  Ban,
  Settings,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import AddCarModal from '@/components/AddCarModal';
import CarDetailModal from '@/components/CarDetailModal';
import { rtdb } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';

interface CarData {
  id: string;
  brand: string;
  model: string;
  year: string;
  plate: string;
  color: string;
  vin: string;
  purchasePrice: number;
  salePrice: number;
  status: string;
  image: string;
  createdAt: string;
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

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<CarData | null>(null);
  const [carToEdit, setCarToEdit] = useState<CarData | null>(null);
  const [cars, setCars] = useState<CarData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carsRef = ref(rtdb, 'inventory');
    const unsubscribe = onValue(carsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const carList: CarData[] = Object.entries(data).map(([id, value]: [string, any]) => ({
          id,
          ...value,
        })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setCars(carList);
      } else {
        setCars([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const openDetails = (car: CarData) => {
    setSelectedCar(car);
    setIsDetailOpen(true);
  };

  const openEditModal = (car: CarData) => {
    setCarToEdit(car);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCarToEdit(null);
  };

  const filteredCars = cars.filter(car => 
    car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.plate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 font-kantumruy">គ្រប់គ្រងស្តុកឡាន</h2>
          <p className="text-gray-500 mt-1 font-kantumruy">គ្រប់គ្រងព័ត៌មានឡាន និងស្តុករបស់អ្នក</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-kantumruy"
        >
          <Plus size={20} />
          <span>បញ្ចូលឡានថ្មី</span>
        </button>
      </div>

      <AddCarModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <AddCarModal 
        isOpen={isEditModalOpen} 
        onClose={closeEditModal} 
        carToEdit={carToEdit} 
      />
      <CarDetailModal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        car={selectedCar} 
      />

      {/* Filters */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="ស្វែងរកតាម ម៉ាក, ម៉ូដែល, ផ្លាកលេខ..." 
            className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none font-kantumruy"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 transition-colors font-bold font-kantumruy">
            <Filter size={18} />
            <span>តម្រង</span>
          </button>
          <select className="bg-gray-50 text-gray-600 rounded-xl px-4 py-2 outline-none border-none font-bold font-kantumruy">
            <option>ស្ថានភាពទាំងអស់</option>
            <option value="Available">នៅទំនេរ</option>
            <option value="Sold">បានលក់</option>
            <option value="Reserved">បានកក់</option>
            <option value="Maintenance">កំពុងជួសជុល</option>
          </select>
        </div>
      </div>

      {/* Car Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-indigo-600" size={48} />
          <p className="text-gray-500 font-bold font-kantumruy">កំពុងទាញយកទិន្នន័យ...</p>
        </div>
      ) : filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredCars.map((car, i) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={car.image || 'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=2069&auto=format&fit=crop'} 
                  alt={car.brand} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={cn(
                  "absolute top-4 right-4 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 backdrop-blur-md shadow-sm font-kantumruy",
                  statusColors[car.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-600'
                )}>
                  {React.createElement(statusIcons[car.status as keyof typeof statusIcons] || Car, { size: 14 })}
                  {statusLabels[car.status as keyof typeof statusLabels] || car.status}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{car.brand} {car.model}</h3>
                    <p className="text-gray-500 text-sm font-bold">{car.year} • {car.color}</p>
                  </div>
                  <div className="p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <MoreVertical size={18} className="text-gray-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-2xl">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider ml-1 font-kantumruy">ផ្លាកលេខ</p>
                    <p className="font-bold text-gray-700">{car.plate}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-2xl">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider ml-1 font-kantumruy">តម្លៃលក់</p>
                    <p className="font-bold text-indigo-600">${Number(car.salePrice).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => openDetails(car)}
                    className="flex-1 bg-gray-50 text-gray-600 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 font-kantumruy"
                  >
                    <Eye size={16} /> លម្អិត
                  </button>
                  <button 
                    onClick={() => openEditModal(car)}
                    className="flex-1 bg-indigo-50 text-indigo-600 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2 font-kantumruy"
                  >
                    <Edit2 size={16} /> កែប្រែ
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[40px] p-20 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
            <Car size={40} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 font-kantumruy">មិនទាន់មានទិន្នន័យឡាន</h3>
          <p className="text-gray-500 mt-2 font-kantumruy">សូមចុចប៊ូតុង "បញ្ចូលឡានថ្មី" ដើម្បីចាប់ផ្តើម</p>
        </div>
      )}
    </div>
  );
}

