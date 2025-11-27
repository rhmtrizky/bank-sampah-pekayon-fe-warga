/**
 * Price Item Card component
 * Displays price information for waste types
 */

"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { PriceItem } from "@/types";
import { formatCurrency } from "@/utils/formatCurrency";

interface PriceItemCardProps {
  priceItem: PriceItem;
}

export const PriceItemCard: React.FC<PriceItemCardProps> = ({ priceItem }) => {
  return (
    <Card hover>
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0 text-white font-bold text-xl">
          {priceItem.jenis_sampah.charAt(0).toUpperCase()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">
            {priceItem.jenis_sampah}
          </h3>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-green-600">
              {formatCurrency(priceItem.harga_per_kg)}
            </span>
            <span className="text-sm text-gray-500">/kg</span>
          </div>
        </div>

        {/* Badge */}
        <div className="text-right">
          <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            Aktif
          </div>
        </div>
      </div>
    </Card>
  );
};
