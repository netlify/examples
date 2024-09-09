import { useState, useEffect } from 'react';

const store: Array<{ sku: string; quantity: number }> = [];

window.addEventListener('add-to-cart', (ev: CustomEvent) => {
  const { sku } = ev.detail;

  const item = store.find((m) => m.sku === sku);

  if (item) {
    item.quantity++;
  } else {
    store.push({ sku, quantity: 1 });
  }

  window.dispatchEvent(new CustomEvent('updated-cart'));
});

window.addEventListener('remove-from-cart', (ev: CustomEvent) => {
  const { sku } = ev.detail;

  const index = store.findIndex((m) => m.sku === sku);

  if (index >= 0) {
    store.splice(index, 1);
    window.dispatchEvent(new CustomEvent('updated-cart'));
  }
});

window.addEventListener('clear-cart', () => {
  store.splice(0, store.length);
  window.dispatchEvent(new CustomEvent('updated-cart'));
});

export function useLineItems() {
  const [items, setItems] = useState(store);

  useEffect(() => {
    const refresh = () => setItems([...store]);
    window.addEventListener('updated-cart', refresh);
    return () => {
      window.removeEventListener('updated-cart', refresh);
    };
  }, []);

  return items;
}
