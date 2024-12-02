export interface OrderData {
  orderNumber: string;
  address: string;
  mapImage?: string;
}

export interface MapViewerProps {
  data: OrderData[];
}