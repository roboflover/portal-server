  export interface OrderDetails {
    id: number;
    orderNumber?: number;          
    quantity: number; 
    summa: number;
    fileSize: number;
    fileName: string;
    material: string;
    width: number;
    length: number;
    height: number;
    volume: number;
    color: number;
    orderDetails?: string;
    deliveryCity?: string;
    deliveryAddress?: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    orderStatus: string;
    comment?: string;
    modelUrl?: string;
    disable?: boolean;
    paymentId?: string;
  }