'use client';

import { useEffect, useState } from 'react';

// Định nghĩa type để tránh lỗi "Unexpected any"
interface Product {
  id: number;
  name: string;
  price: number;
  img?: string;
}

const initialProducts: Product[] = [
  { id: 1, name: 'Laptop Gaming Pro', price: 25000000, img: '💻' },
  { id: 2, name: 'Điện thoại Smartphone X', price: 15000000, img: '📱' },
  { id: 3, name: 'Tai nghe Bluetooth', price: 2000000, img: '🎧' }
];

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        // Dùng requestAnimationFrame để tránh warning setState đồng bộ trong Effect
        requestAnimationFrame(() => {
          setProducts(parsed);
        });
      } catch (e) {
        console.error('Lỗi parse dữ liệu:', e);
      }
    } else {
      localStorage.setItem('products', JSON.stringify(initialProducts));
    }
  }, []);

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push(product);
    
    // Sửa đúng localStorage và JSON.stringify
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  return (
    <div>
      <h1 style={{ color: '#0f172a' }}>🛍️ Danh Sách Sản Phẩm</h1>
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