import { useCallback, useEffect, useState } from "react";
import { Item } from "@/types/item";

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/common/items");
      const json = await res.json();

      if (!json.ok) throw new Error(json.error);
      setItems(json.items);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { items, loading, error, refetch: fetchItems };
}
