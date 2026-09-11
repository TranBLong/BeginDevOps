'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

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

const defaultProducts: Product[] = [
  { id: 1, name: 'Laptop Gaming Pro', price: 25000000, img: '💻' },
  { id: 2, name: 'Điện thoại Smartphone X', price: 15000000, img: '📱' },
  { id: 3, name: 'Tai nghe Bluetooth', price: 2000000, img: '🎧' }
];

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

    requestAnimationFrame(() => {
      setUser(currentUser);

      // Đã đổi sang Key 'products' đồng bộ chuẩn với Admin
      const savedProducts = localStorage.getItem('products');
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts));
      } else {
        localStorage.setItem('products', JSON.stringify(defaultProducts));
        setProducts(defaultProducts);
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
            <div style={{ height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
              {p.img && (p.img.startsWith('http://') || p.img.startsWith('https://')) ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={p.img} alt={p.name} style={{ maxHeight: '90px', maxWidth: '100%', objectFit: 'contain', borderRadius: '4px' }} />
              ) : (
                <span style={{ fontSize: '3rem' }}>{p.img || '📦'}</span>
              )}
            </div>
            
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