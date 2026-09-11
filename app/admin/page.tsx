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
  password?: string;
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
  const [newPassword, setNewPassword] = useState('');
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
    if (Number(price) <= 0) {
      alert('Giá sản phẩm phải lớn hơn 0!');
      return;
    }
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
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
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
    if (newPassword.length < 6) {
      alert('Mật khẩu phải từ 6 ký tự trở lên!');
      return;
    }
    const newUser: SystemUser = { id: Date.now(), username: newUsername, password: newPassword, role: newRole, status: 'Hoạt động' };
    const updated = [...systemUsers, newUser];
    setSystemUsers(updated);
    localStorage.setItem('app_users', JSON.stringify(updated));
    setNewUsername('');
    setNewPassword('');
  };

  const toggleUserStatus = (id: number) => {
    const updated = systemUsers.map(u =>
      u.id === id ? { ...u, status: u.status === 'Hoạt động' ? 'Tạm khóa' : 'Hoạt động' } as SystemUser : u
    );
    setSystemUsers(updated);
    localStorage.setItem('app_users', JSON.stringify(updated));
  };

  const deleteUser = (id: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
    const updated = systemUsers.filter(u => u.id !== id);
    setSystemUsers(updated);
    localStorage.setItem('app_users', JSON.stringify(updated));
  };

  if (!currentUser) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1100px', margin: '0 auto' }}>

      {/* 1. Admin Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        borderRadius: '16px',
        padding: '2rem',
        color: '#ffffff',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <span style={{
            background: 'rgba(56, 189, 248, 0.15)',
            color: '#38bdf8',
            padding: '0.3rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Admin Control Center
          </span>
          <h1 style={{ margin: '0.5rem 0 0.25rem 0', fontSize: '1.75rem', fontWeight: '800' }}>
            🛡️ Bảng Quản Trị Hệ Thống
          </h1>
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
            Xin chào Quản trị viên <b style={{ color: '#38bdf8' }}>{currentUser.username}</b>
          </p>
        </div>

        {/* Segmented Control Tabs */}
        <div style={{
          background: '#0f172a',
          padding: '0.35rem',
          borderRadius: '12px',
          border: '1px solid #334155',
          display: 'flex',
          gap: '0.35rem'
        }}>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '0.6rem 1.2rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.875rem',
              transition: 'all 0.2s',
              background: activeTab === 'products' ? '#2563eb' : 'transparent',
              color: activeTab === 'products' ? '#ffffff' : '#94a3b8'
            }}
          >
            📦 Sản Phẩm ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '0.6rem 1.2rem',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '700',
              fontSize: '0.875rem',
              transition: 'all 0.2s',
              background: activeTab === 'users' ? '#2563eb' : 'transparent',
              color: activeTab === 'users' ? '#ffffff' : '#94a3b8'
            }}
          >
            👥 Người Dùng ({regularUsers.length})
          </button>
        </div>
      </div>

      {/* --- TAB 1: QUẢN LÝ SẢN PHẨM --- */}
      {activeTab === 'products' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Form Thêm/Sửa Sản phẩm */}
          <form
            onSubmit={handleProductSubmit}
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)'
            }}
          >
            <h3 style={{ margin: '0 0 1rem 0', color: '#0f172a', fontSize: '1.1rem', fontWeight: '700' }}>
              {editingId !== null ? '✏️ Cập Nhật Sản Phẩm' : '➕ Thêm Sản Phẩm Mới'}
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '0.35rem' }}>Tên sản phẩm</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Bàn phím cơ RGB"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '0.35rem' }}>Giá bán (VNĐ)</label>
                <input
                  type="number"
                  placeholder="Ví dụ: 1500000"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '0.35rem' }}>Ảnh (URL hoặc Emoji)</label>
                <input
                  type="text"
                  placeholder="💻 hoặc https://..."
                  value={img}
                  onChange={e => setImg(e.target.value)}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="submit"
                style={{
                  background: editingId !== null ? '#eab308' : '#16a34a',
                  color: '#ffffff',
                  padding: '0.65rem 1.25rem',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                {editingId !== null ? '💾 Cập nhật' : '➕ Thêm vào cửa hàng'}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    background: '#64748b',
                    color: '#ffffff',
                    padding: '0.65rem 1.25rem',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Hủy bỏ
                </button>
              )}
            </div>
          </form>

          {/* Danh Sách Sản Phẩm */}
          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#0f172a', fontSize: '1.1rem', fontWeight: '700' }}>
              📋 Danh Sách Sản Phẩm Hiện Tại
            </h3>

            {products.length === 0 ? (
              <p style={{ color: '#64748b', margin: 0, padding: '1rem 0' }}>Chưa có sản phẩm nào trong hệ thống.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {products.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.85rem 1rem',
                      background: '#f8fafc',
                      borderRadius: '10px',
                      border: '1px solid #f1f5f9'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '45px', height: '45px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {p.img && (p.img.startsWith('http://') || p.img.startsWith('https://')) ? (
                          <Image src={p.img} alt={p.name} width={32} height={32} unoptimized style={{ objectFit: 'contain' }} />
                        ) : (
                          <span style={{ fontSize: '1.5rem' }}>{p.img || '📦'}</span>
                        )}
                      </div>
                      <div>
                        <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '0.95rem' }}>{p.name}</div>
                        <div style={{ color: '#2563eb', fontWeight: '800', fontSize: '0.875rem' }}>{p.price?.toLocaleString()} VNĐ</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => { setEditingId(p.id); setName(p.name); setPrice(String(p.price)); setImg(p.img || ''); }}
                        style={{ background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer', fontWeight: '600', fontSize: '0.8rem' }}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 2: QUẢN LÝ NGƯỜI DÙNG --- */}
      {activeTab === 'users' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

          {/* Form Thêm Người Dùng */}
          <form
            onSubmit={handleAddUser}
            style={{
              background: '#ffffff',
              borderRadius: '14px',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)'
            }}
          >
            <h3 style={{ margin: '0 0 1rem 0', color: '#0f172a', fontSize: '1.1rem', fontWeight: '700' }}>
              ➕ Cấp Tài Khoản Mới
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '0.35rem' }}>Tên tài khoản</label>
                <input
                  type="text"
                  placeholder="Tên đăng nhập"
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '0.35rem' }}>Mật khẩu</label>
                <input
                  type="password"
                  placeholder="Mật khẩu (≥ 6 ký tự)"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', color: '#475569', marginBottom: '0.35rem' }}>Vai trò</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as 'admin' | 'user')}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.9rem', outline: 'none', background: '#ffffff', boxSizing: 'border-box' }}
                >
                  <option value="user">User (Khách hàng)</option>
                  <option value="admin">Admin (Quản trị)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              style={{
                background: '#16a34a',
                color: '#ffffff',
                padding: '0.65rem 1.25rem',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '0.875rem',
                cursor: 'pointer'
              }}
            >
              ➕ Tạo tài khoản
            </button>
          </form>

          {/* Bảng Danh Sách Người Dùng */}
          <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(15, 23, 42, 0.03)', overflow: 'hidden' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem', fontWeight: '700' }}>
                👥 Danh Sách Tài Khoản Người Dùng
              </h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#ffffff', borderBottom: '2px solid #f1f5f9' }}>
                    <th style={{ padding: '0.85rem 1.25rem', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', width: '60px' }}>STT</th>
                    <th style={{ padding: '0.85rem 1.25rem', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Tài khoản</th>
                    <th style={{ padding: '0.85rem 1.25rem', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Vai trò</th>
                    <th style={{ padding: '0.85rem 1.25rem', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase' }}>Trạng thái</th>
                    <th style={{ padding: '0.85rem 1.25rem', color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'right' }}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {regularUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                        Không có người dùng nào.
                      </td>
                    </tr>
                  ) : (
                    regularUsers.map((u, index) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.85rem 1.25rem', fontWeight: '700', color: '#94a3b8' }}>#{index + 1}</td>
                        <td style={{ padding: '0.85rem 1.25rem', fontWeight: '700', color: '#0f172a' }}>{u.username}</td>
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <span style={{
                            padding: '0.25rem 0.6rem',
                            borderRadius: '6px',
                            background: u.role === 'admin' ? '#fef3c7' : '#e0f2fe',
                            color: u.role === 'admin' ? '#d97706' : '#0369a1',
                            fontSize: '0.75rem',
                            fontWeight: '800'
                          }}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem' }}>
                          <span style={{
                            padding: '0.25rem 0.6rem',
                            borderRadius: '6px',
                            background: u.status === 'Hoạt động' ? '#dcfce7' : '#fee2e2',
                            color: u.status === 'Hoạt động' ? '#15803d' : '#b91c1c',
                            fontSize: '0.75rem',
                            fontWeight: '800'
                          }}>
                            {u.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              onClick={() => toggleUserStatus(u.id)}
                              style={{
                                background: u.status === 'Hoạt động' ? '#eab308' : '#16a34a',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.4rem 0.75rem',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.8rem'
                              }}
                            >
                              {u.status === 'Hoạt động' ? '🔒 Khóa' : '🔓 Mở'}
                            </button>
                            <button
                              onClick={() => deleteUser(u.id)}
                              style={{
                                background: '#ef4444',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                padding: '0.4rem 0.75rem',
                                cursor: 'pointer',
                                fontWeight: '600',
                                fontSize: '0.8rem'
                              }}
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}