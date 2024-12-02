import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import Papa from 'papaparse';
import { OrderData } from '../types';
import { normalizeJapaneseAddress } from '../utils/addressUtils';

interface CSVUploaderProps {
  onDataLoaded: (data: OrderData[]) => void;
}

export const CSVUploader: React.FC<CSVUploaderProps> = ({ onDataLoaded }) => {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      complete: (results) => {
        try {
          const parsedData: OrderData[] = results.data
            .filter((row: any) => {
              // 必須フィールドの存在チェック
              const hasOrderNumber = row.orderNumber || row['受注番号'];
              const hasAddress = row.address || row['住所'];
              const hasRequiredFields = hasOrderNumber && hasAddress;
              
              if (!hasRequiredFields) {
                console.warn('必須フィールドが不足しているため、行をスキップします:', row);
              }
              return hasRequiredFields;
            })
            .map((row: any) => ({
              orderNumber: String(row.orderNumber || row['受注番号']).trim(),
              address: normalizeJapaneseAddress(String(row.address || row['住所']).trim())
            }));

          if (parsedData.length === 0) {
            alert('有効なデータが見つかりませんでした。CSVファイルを確認してください。');
            return;
          }

          onDataLoaded(parsedData);
        } catch (error) {
          console.error('データ処理エラー:', error);
          alert('データの処理中にエラーが発生しました。');
        }
      },
      header: true,
      skipEmptyLines: true,
      encoding: 'Shift-JIS', // エンコーディングをShift-JISに変更
      error: (error) => {
        console.error('CSV解析エラー:', error);
        alert('CSVファイルの読み込み中にエラーが発生しました。');
      }
    });

    event.target.value = '';
  }, [onDataLoaded]);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <label className="flex flex-col items-center px-4 py-6 bg-white rounded-lg shadow-lg tracking-wide border border-blue-500 cursor-pointer hover:bg-blue-500 hover:text-white transition-colors">
        <Upload className="w-8 h-8" />
        <span className="mt-2 text-base">CSVファイルを選択</span>
        <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
      </label>
      <p className="text-sm text-gray-600 mt-2 text-center">
        CSVファイルには「orderNumber（受注番号）」と「address（住所）」の列が必要です
      </p>
      <p className="text-sm text-gray-600 mt-1 text-center">
        住所は「都道府県市区町村番地」の形式で入力してください
      </p>
    </div>
  );
};