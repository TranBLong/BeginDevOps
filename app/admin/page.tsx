'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Định nghĩa Interface để loại bỏ hoàn toàn lỗi "Unexpected any"
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

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!user || user.role !== 'admin') {
      alert('Chỉ Admin mới có quyền truy cập trang này!');
      router.push('/login');
    } else {
      // Bọc trong requestAnimationFrame để xử lý bất đồng bộ, hết cảnh báo đỏ setState
      requestAnimationFrame(() => {
        setCurrentUser(user);
        setProducts(JSON.parse(localStorage.getItem('products') || '[]'));
      });
    }
  }, [router]);

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProd: Product = { id: Date.now(), name, price: Number(price), img: '📦' };
    const updated = [...products, newProd];
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
    setName('');
    setPrice('');
  };

  const deleteProduct = (id: number) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
  };

  if (!currentUser) return null;

  return (
    <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1>🛡️ Quản Lý Cửa Hàng (Admin Panel)</h1>
      
      <form onSubmit={addProduct} style={{ display: 'flex', gap: '1rem', margin: '1.5rem 0' }}>
        <input type="text" placeholder="Tên sản phẩm" value={name} onChange={e => setName(e.target.value)} required style={{ flex: 1, padding: '0.5rem' }} />
        <input type="number" placeholder="Giá (VNĐ)" value={price} onChange={e => setPrice(e.target.value)} required style={{ flex: 1, padding: '0.5rem' }} />
        <button type="submit" style={{ background: '#16a34a', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Thêm sản phẩm</button>
      </form>

      <h3>Danh sách sản phẩm hiện tại:</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {products.map((p) => (
          <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
            <span>{p.name} - <b>{p.price?.toLocaleString()} VNĐ</b></span>
            <button onClick={() => deleteProduct(p.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.25rem 0.5rem', cursor: 'pointer' }}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
}