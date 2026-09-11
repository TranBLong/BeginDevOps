'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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

// Danh sách sản phẩm mặc định ban đầu
const initialProducts: Product[] = [
  { id: 1, name: 'Laptop Gaming Pro', price: 25000000, img: '💻' },
  { id: 2, name: 'Điện thoại Smartphone X', price: 15000000, img: '📱' },
  { id: 3, name: 'Tai nghe Bluetooth', price: 2000000, img: '🎧' }
];

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  
  // Các state phục vụ Form Thêm / Sửa
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    
    if (!user || user.role !== 'admin') {
      alert('Chỉ Admin mới có quyền truy cập trang này!');
      router.push('/');
    } else {
      // Đọc dữ liệu từ localStorage, nếu chưa có thì khởi tạo danh sách mặc định
      const savedProducts = localStorage.getItem('products');
      let productList: Product[] = initialProducts;

      if (savedProducts) {
        try {
          productList = JSON.parse(savedProducts);
        } catch (e) {
          console.error('Lỗi parse sản phẩm:', e);
        }
      } else {
        localStorage.setItem('products', JSON.stringify(initialProducts));
      }

      requestAnimationFrame(() => {
        setCurrentUser(user);
        setProducts(productList);
      });
    }
  }, [router]);

  // Reset form về trạng thái ban đầu
  const resetForm = () => {
    setName('');
    setPrice('');
    setImg('');
    setEditingId(null);
  };

  // Xử lý Thêm mới hoặc Cập nhật
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId !== null) {
      // Chế độ SỬA sản phẩm
      const updated = products.map(p => 
        p.id === editingId 
          ? { ...p, name, price: Number(price), img: img.trim() || '📦' }
          : p
      );
      setProducts(updated);
      localStorage.setItem('products', JSON.stringify(updated));
    } else {
      // Chế độ THÊM MỚI sản phẩm
      const newProd: Product = {
        id: Date.now(),
        name,
        price: Number(price),
        img: img.trim() || '📦'
      };
      const updated = [...products, newProd];
      setProducts(updated);
      localStorage.setItem('products', JSON.stringify(updated));
    }

    resetForm();
  };

  // Đưa dữ liệu sản phẩm lên Form để chỉnh sửa
  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setName(product.name);
    setPrice(String(product.price));
    setImg(product.img || '');
  };

  // Xóa sản phẩm
  const deleteProduct = (id: number) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
    if (editingId === id) resetForm();
  };

  if (!currentUser) return null;

  return (
    <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1>🛡️ Quản Lý Cửa Hàng (Admin Panel)</h1>
      
      {/* Form nhập liệu Thêm / Sửa */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1.5rem 0', background: '#f8fafc', padding: '1rem', borderRadius: '6px' }}>
        <h3 style={{ margin: 0 }}>{editingId !== null ? '✏️ Chỉnh sửa sản phẩm' : '➕ Thêm sản phẩm mới'}</h3>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="Tên sản phẩm" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
            style={{ flex: 2, padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} 
          />
          <input 
            type="number" 
            placeholder="Giá (VNĐ)" 
            value={price} 
            onChange={e => setPrice(e.target.value)} 
            required 
            style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} 
          />
          <input 
            type="text" 
            placeholder="Link ảnh (URL) hoặc Emoji (💻, 📱,...)" 
            value={img} 
            onChange={e => setImg(e.target.value)} 
            style={{ flex: 2, padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} 
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" style={{ background: editingId !== null ? '#eab308' : '#16a34a', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {editingId !== null ? 'Cập nhật' : 'Thêm sản phẩm'}
          </button>
          {editingId !== null && (
            <button type="button" onClick={resetForm} style={{ background: '#64748b', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Hủy
            </button>
          )}
        </div>
      </form>

      {/* Danh sách hiển thị sản phẩm */}
      <h3>Danh sách sản phẩm hiện tại ({products.length}):</h3>
      {products.length === 0 ? (
        <p style={{ color: '#64748b' }}>Chưa có sản phẩm nào trong hệ thống.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {products.map((p) => (
            <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {p.img && (p.img.startsWith('http://') || p.img.startsWith('https://')) ? (
                  <Image 
                    src={p.img} 
                    alt={p.name} 
                    width={40} 
                    height={40} 
                    unoptimized 
                    style={{ objectFit: 'cover', borderRadius: '4px' }} 
                  />
                ) : (
                  <span style={{ fontSize: '1.5rem' }}>{p.img || '📦'}</span>
                )}
                <span><b>{p.name}</b> - <span style={{ color: '#2563eb' }}>{p.price?.toLocaleString()} VNĐ</span></span>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleEditClick(p)} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.25rem 0.6rem', cursor: 'pointer' }}>
                  Sửa
                </button>
                <button onClick={() => deleteProduct(p.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.25rem 0.6rem', cursor: 'pointer' }}>
                  Xóa
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}