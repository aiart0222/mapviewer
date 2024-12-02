import { Loader } from '@googlemaps/js-api-loader';
import { normalizeJapaneseAddress, validateJapaneseAddress } from './addressUtils';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCviv4dQP4B3QfjTS5P0YIKy3XcXdbyF6Y';
const DEFAULT_MAP_IMAGE = '/map-not-found.png';

let geocoderPromise: Promise<google.maps.Geocoder> | null = null;
let mapsLoaded = false;

const initializeGoogleMaps = async (): Promise<google.maps.Geocoder> => {
  if (!mapsLoaded) {
    try {
      const loader = new Loader({
        apiKey: GOOGLE_MAPS_API_KEY,
        version: 'weekly',
        libraries: ['places', 'geocoding']
      });
      
      await loader.load();
      mapsLoaded = true;
    } catch (error) {
      console.error('Google Maps APIの読み込みに失敗しました:', error);
      throw error;
    }
  }

  if (!geocoderPromise) {
    geocoderPromise = Promise.resolve(new google.maps.Geocoder());
  }
  
  return geocoderPromise;
};

const createStaticMapUrl = (location: google.maps.LatLng): string => {
  const params = new URLSearchParams({
    center: `${location.lat()},${location.lng()}`,
    zoom: '19', // 建物の形がよく見えるように拡大（16から19に変更）
    size: '600x450', // より大きな画像サイズに変更
    scale: '2', // Retinaディスプレイ対応（実際の出力は1200x900）
    key: GOOGLE_MAPS_API_KEY,
    maptype: 'satellite', // 衛星写真モードに変更
    markers: `color:red|size:mid|${location.lat()},${location.lng()}`,
    language: 'ja',
    region: 'jp'
  });
  
  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
};

export const getStaticMapUrl = async (address: string): Promise<string> => {
  if (!address) {
    console.warn('住所が指定されていません');
    return DEFAULT_MAP_IMAGE;
  }

  try {
    const geocoder = await initializeGoogleMaps();
    const normalizedAddress = normalizeJapaneseAddress(address);

    if (!validateJapaneseAddress(normalizedAddress)) {
      console.warn('無効な日本の住所形式です:', address);
      return DEFAULT_MAP_IMAGE;
    }

    const response = await geocoder.geocode({
      address: normalizedAddress,
      region: 'jp',
      language: 'ja',
      componentRestrictions: {
        country: 'JP'
      }
    });
    
    if (!response.results?.length) {
      console.warn('住所が見つかりませんでした:', normalizedAddress);
      return DEFAULT_MAP_IMAGE;
    }

    const result = response.results[0];
    return createStaticMapUrl(result.geometry.location);
  } catch (error) {
    console.error('ジオコーディングエラー:', error);
    return DEFAULT_MAP_IMAGE;
  }
};