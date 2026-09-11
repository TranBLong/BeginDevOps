'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Khai báo Type để sửa lỗi "Unexpected any"
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

export default function UserPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user) {
      router.push('/');
    } else {
      // Bọc setState trong requestAnimationFrame để xử lý bất đồng bộ
      requestAnimationFrame(() => {
        setCurrentUser(user);
        setCart(JSON.parse(localStorage.getItem('cart') || '[]'));
      });
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    router.push('/');
  };

  if (!currentUser) return null;

  return (
    <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>👤 Trang Cá Nhân</h1>
        <button onClick={handleLogout} style={{ background: '#ef4444', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Đăng xuất
        </button>
      </div>
      <p>Xin chào, <b>{currentUser.username}</b>! Vai trò: <code>{currentUser.role}</code></p>

      <hr style={{ margin: '1.5rem 0', border: 'none', borderTop: '1px solid #e2e8f0' }} />

      <h3>🛒 Giỏ hàng của bạn ({cart.length} sản phẩm)</h3>
      {cart.length === 0 ? (
        <p style={{ color: '#64748b' }}>Giỏ hàng đang trống.</p>
      ) : (
        <ul>
          {cart.map((item, index) => (
            <li key={index} style={{ marginBottom: '0.5rem' }}>
              {item.name} - <b>{item.price?.toLocaleString()} VNĐ</b>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}