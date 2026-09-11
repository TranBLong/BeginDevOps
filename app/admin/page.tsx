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

interface SystemUser {
  id: number;
  username: string;
  role: 'admin' | 'user';
  status: 'Hoạt động' | 'Tạm khóa';
}

const initialProducts: Product[] = [
  { id: 1, name: 'Laptop Gaming Pro', price: 25000000, img: '💻' },
  { id: 2, name: 'Điện thoại Smartphone X', price: 15000000, img: '📱' },
  { id: 3, name: 'Tai nghe Bluetooth', price: 2000000, img: '🎧' }
];

const initialUsers: SystemUser[] = [
  { id: 1, username: 'admin', role: 'admin', status: 'Hoạt động' },
  { id: 2, username: 'user', role: 'user', status: 'Hoạt động' }
];

export default function AdminPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'products' | 'users'>('products');

  // --- STATE QUẢN LÝ SẢN PHẨM ---
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [img, setImg] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  // --- STATE QUẢN LÝ NGƯỜI DÙNG ---
  const [systemUsers, setSystemUsers] = useState<SystemUser[]>([]);
  const [newUsername, setNewUsername] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'user'>('user');

  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || 'null');

    if (!user || user.role !== 'admin') {
      alert('Chỉ Admin mới có quyền truy cập trang này!');
      router.push('/');
      return;
    }

    const savedProducts = localStorage.getItem('products');
    let productList = initialProducts;
    if (savedProducts) {
      try { productList = JSON.parse(savedProducts); } catch (e) { console.error(e); }
    } else {
      localStorage.setItem('products', JSON.stringify(initialProducts));
    }

    const savedUsers = localStorage.getItem('app_users');
    let userList = initialUsers;
    if (savedUsers) {
      try { userList = JSON.parse(savedUsers); } catch (e) { console.error(e); }
    } else {
      localStorage.setItem('app_users', JSON.stringify(initialUsers));
    }

    requestAnimationFrame(() => {
      setCurrentUser(user);
      setProducts(productList);
      setSystemUsers(userList);
    });
  }, [router]);

  // Lọc danh sách người dùng không phải Admin
  const regularUsers = systemUsers.filter((u) => u.role !== 'admin');

  // --- HÀM XỬ LÝ SẢN PHẨM ---
  const resetForm = () => {
    setName(''); setPrice(''); setImg(''); setEditingId(null);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updated: Product[];
    if (editingId !== null) {
      updated = products.map(p => p.id === editingId ? { ...p, name, price: Number(price), img: img.trim() || '📦' } : p);
    } else {
      const newProd: Product = { id: Date.now(), name, price: Number(price), img: img.trim() || '📦' };
      updated = [...products, newProd];
    }
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
    resetForm();
  };

  const deleteProduct = (id: number) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem('products', JSON.stringify(updated));
    if (editingId === id) resetForm();
  };

  // --- HÀM XỬ LÝ NGƯỜI DÙNG ---
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (systemUsers.some(u => u.username.toLowerCase() === newUsername.toLowerCase())) {
      alert('Tên tài khoản này đã tồn tại!');
      return;
    }
    const newUser: SystemUser = { id: Date.now(), username: newUsername, role: newRole, status: 'Hoạt động' };
    const updated = [...systemUsers, newUser];
    setSystemUsers(updated);
    localStorage.setItem('app_users', JSON.stringify(updated));
    setNewUsername('');
  };

  const toggleUserStatus = (id: number) => {
    const updated = systemUsers.map(u =>
      u.id === id ? { ...u, status: u.status === 'Hoạt động' ? 'Tạm khóa' : 'Hoạt động' } as SystemUser : u
    );
    setSystemUsers(updated);
    localStorage.setItem('app_users', JSON.stringify(updated));
  };

  const deleteUser = (id: number) => {
    const updated = systemUsers.filter(u => u.id !== id);
    setSystemUsers(updated);
    localStorage.setItem('app_users', JSON.stringify(updated));
  };

  if (!currentUser) return null;

  return (
    <div style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h1>🛡️ Quản Lý Hệ Thống (Admin Panel)</h1>

      {/* Thanh Menu Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e2e8f0', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('products')}
          style={{ padding: '0.75rem 1.5rem', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', borderBottom: activeTab === 'products' ? '3px solid #2563eb' : 'none', color: activeTab === 'products' ? '#2563eb' : '#64748b' }}
        >
          📦 Quản lý Sản phẩm ({products.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          style={{ padding: '0.75rem 1.5rem', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', borderBottom: activeTab === 'users' ? '3px solid #2563eb' : 'none', color: activeTab === 'users' ? '#2563eb' : '#64748b' }}
        >
          👥 Quản lý Người dùng ({regularUsers.length})
        </button>
      </div>

      {/* --- TAB 1: QUẢN LÝ SẢN PHẨM --- */}
      {activeTab === 'products' && (
        <div>
          <form onSubmit={handleProductSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '6px' }}>
            <h3 style={{ margin: 0 }}>{editingId !== null ? '✏️ Chỉnh sửa sản phẩm' : '➕ Thêm sản phẩm mới'}</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <input type="text" placeholder="Tên sản phẩm" value={name} onChange={e => setName(e.target.value)} required style={{ flex: 2, padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              <input type="number" placeholder="Giá (VNĐ)" value={price} onChange={e => setPrice(e.target.value)} required style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
              <input type="text" placeholder="Link ảnh hoặc Emoji (💻, 📱,...)" value={img} onChange={e => setImg(e.target.value)} style={{ flex: 2, padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
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

          <ul style={{ listStyle: 'none', padding: 0 }}>
            {products.map((p) => (
              <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {p.img && (p.img.startsWith('http://') || p.img.startsWith('https://')) ? (
                    <Image src={p.img} alt={p.name} width={40} height={40} unoptimized style={{ objectFit: 'cover', borderRadius: '4px' }} />
                  ) : (
                    <span style={{ fontSize: '1.5rem' }}>{p.img || '📦'}</span>
                  )}
                  <span><b>{p.name}</b> - <span style={{ color: '#2563eb' }}>{p.price?.toLocaleString()} VNĐ</span></span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => { setEditingId(p.id); setName(p.name); setPrice(String(p.price)); setImg(p.img || ''); }} style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.25rem 0.6rem', cursor: 'pointer' }}>Sửa</button>
                  <button onClick={() => deleteProduct(p.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.25rem 0.6rem', cursor: 'pointer' }}>Xóa</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* --- TAB 2: QUẢN LÝ NGƯỜI DÙNG --- */}
      {activeTab === 'users' && (
        <div>
          <form onSubmit={handleAddUser} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '1rem', borderRadius: '6px', alignItems: 'center' }}>
            <h3 style={{ margin: 0, minWidth: '180px' }}>➕ Thêm người dùng:</h3>
            <input type="text" placeholder="Tên tài khoản" value={newUsername} onChange={e => setNewUsername(e.target.value)} required style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }} />
            <select value={newRole} onChange={e => setNewRole(e.target.value as 'admin' | 'user')} style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" style={{ background: '#16a34a', color: '#fff', padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Thêm</button>
          </form>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '0.75rem', width: '80px' }}>STT</th>
                <th style={{ padding: '0.75rem' }}>Tài khoản</th>
                <th style={{ padding: '0.75rem' }}>Vai trò</th>
                <th style={{ padding: '0.75rem' }}>Trạng thái</th>
                <th style={{ padding: '0.75rem', textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {regularUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '1rem', textAlign: 'center', color: '#64748b' }}>Không có người dùng nào.</td>
                </tr>
              ) : (
                regularUsers.map((u, index) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '0.75rem', fontWeight: 'bold', color: '#64748b' }}>#{index + 1}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{u.username}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', background: '#e0f2fe', color: '#0369a1', fontSize: '0.85rem', fontWeight: 'bold' }}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', color: u.status === 'Hoạt động' ? '#16a34a' : '#dc2626', fontWeight: 'bold' }}>{u.status}</td>
                    <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button onClick={() => toggleUserStatus(u.id)} style={{ background: u.status === 'Hoạt động' ? '#eab308' : '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.25rem 0.6rem', cursor: 'pointer' }}>
                          {u.status === 'Hoạt động' ? 'Khóa' : 'Mở'}
                        </button>
                        <button onClick={() => deleteUser(u.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', padding: '0.25rem 0.6rem', cursor: 'pointer' }}>Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}