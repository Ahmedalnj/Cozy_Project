"use client";

import { useState } from "react";
import { FaDollarSign } from "react-icons/fa";

interface PriceRangeProps {
  minPrice: number;
  maxPrice: number;
  onChange: (minPrice: number, maxPrice: number) => void;
}

const PriceRange = ({ minPrice, maxPrice, onChange }: PriceRangeProps) => {
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  const handleMinPriceChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setLocalMinPrice(numValue);
    onChange(numValue, localMaxPrice);
  };

  const handleMaxPriceChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setLocalMaxPrice(numValue);
    onChange(localMinPrice, numValue);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <FaDollarSign className="text-gray-600" />
        <span className="text-sm font-medium text-gray-700">نطاق السعر</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-sm text-gray-600 mb-1 block">السعر الأدنى</label>
          <input
            type="number"
            value={localMinPrice}
            onChange={(e) => handleMinPriceChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
            min="0"
          />
        </div>
        
        <div className="text-gray-400">-</div>
        
        <div className="flex-1">
          <label className="text-sm text-gray-600 mb-1 block">السعر الأقصى</label>
          <input
            type="number"
            value={localMaxPrice}
            onChange={(e) => handleMaxPriceChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="1000"
            min="0"
          />
        </div>
      </div>
      
      <div className="flex justify-between text-xs text-gray-500">
        <span>${localMinPrice}</span>
        <span>${localMaxPrice}</span>
      </div>
    </div>
  );
};

export default PriceRange;
