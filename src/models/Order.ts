export interface OrderItem {
  itemName: string;
  price: number;
  quentity: number;
  imageUrl?: string;
}
export interface Order {
  customerName: string;
  customerPhone: string;
  tableNumber: string;
  orderItem: OrderItem[];
  status: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
