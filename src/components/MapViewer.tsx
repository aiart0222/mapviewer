import React from 'react';
import { MapViewerProps } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import { AlertCircle } from 'lucide-react';

export const MapViewer: React.FC<MapViewerProps> = ({ data }) => {
  if (!data.length) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4">
      {data.map((item) => (
        <div key={item.orderNumber} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-[450px]"> {/* 高さを調整 */}
            {item.mapImage ? (
              item.mapImage === '/map-not-found.png' ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-500">
                  <AlertCircle className="w-8 h-8 mb-2" />
                  <p className="text-sm">住所が見つかりませんでした</p>
                </div>
              ) : (
                <img
                  src={item.mapImage}
                  alt={`${item.address}の地図`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100">
                <LoadingSpinner />
              </div>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-2">受注番号: {item.orderNumber}</h3>
            <p className="text-gray-600 break-words">{item.address}</p>
          </div>
        </div>
      ))}
    </div>
  );
};