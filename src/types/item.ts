export type Item = {
  _id?: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  imageUrl?: string | null;
  available: boolean;
};