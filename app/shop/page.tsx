'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Định nghĩa kiểu dữ liệu để sửa lỗi "Unexpected any"
interface User {
  username: string;
  role: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  img?: string;
}

export default function ShopPage() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (!currentUser) {
      router.push('/');
      return;
    }

    // Bọc trong requestAnimationFrame để xử lý bất đồng bộ, hết báo đỏ setState
    requestAnimationFrame(() => {
      setUser(currentUser);

      const savedProducts = JSON.parse(localStorage.getItem('app_products') || '[]');
      if (savedProducts.length === 0) {
        const defaultProducts: Product[] = [
          { id: 1, name: 'Laptop Gaming Pro', price: 25000000, img: '💻' },
          { id: 2, name: 'Điện thoại Smartphone X', price: 15000000, img: '📱' },
          { id: 3, name: 'Tai nghe Bluetooth', price: 2000000, img: '🎧' }
        ];
        localStorage.setItem('app_products', JSON.stringify(defaultProducts));
        setProducts(defaultProducts);
      } else {
        setProducts(savedProducts);
      }
    });
  }, [router]);

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  if (!user) return null;

  return (
    <div>
      <h1 style={{ color: '#0f172a' }}>🛍️ Cửa Hàng</h1>
      <p>Xin chào, <b>{user.username}</b>!</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
        {products.map((p) => (
          <div key={p.id} style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem' }}>{p.img || '📦'}</div>
            <h3 style={{ margin: '0.5rem 0' }}>{p.name}</h3>
            <p style={{ color: '#2563eb', fontWeight: 'bold' }}>{p.price.toLocaleString()} VNĐ</p>
            <button onClick={() => addToCart(p)} style={{ background: '#0f172a', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Thêm vào giỏ
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}