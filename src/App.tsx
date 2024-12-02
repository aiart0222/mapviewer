import React, { useState } from 'react';
import { CSVUploader } from './components/CSVUploader';
import { MapViewer } from './components/MapViewer';
import { OrderData } from './types';
import { getStaticMapUrl } from './utils/mapUtils';

function App() {
  const [orderData, setOrderData] = useState<OrderData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleDataLoaded = async (data: OrderData[]) => {
    setIsLoading(true);
    setOrderData(data.map(item => ({ ...item, mapImage: '' })));

    const dataWithMaps = await Promise.all(
      data.map(async (item) => ({
        ...item,
        mapImage: await getStaticMapUrl(item.address),
      }))
    );

    setOrderData(dataWithMaps);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          住所画像表示システム
        </h1>
        <CSVUploader onDataLoaded={handleDataLoaded} />
        {isLoading && (
          <p className="text-center mt-4 text-gray-600">
            地図データを読み込み中...
          </p>
        )}
        <MapViewer data={orderData} />
      </div>
    </div>
  );
}

export default App;