'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UserAccount {
  username: string;
  password: string;
  role: 'admin' | 'user';
}

// Tài khoản mặc định ban đầu
const defaultUsers: UserAccount[] = [
  { username: 'admin', password: '123', role: 'admin' },
  { username: 'user', password: '123', role: 'user' },
];

export default function RootAuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Khởi tạo danh sách tài khoản nếu chưa có trong localStorage
    if (!localStorage.getItem('registeredUsers')) {
      localStorage.setItem('registeredUsers', JSON.stringify(defaultUsers));
    }

    // Nếu đã đăng nhập trước đó, tự động chuyển đến trang tương ứng
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser) {
      if (currentUser.role === 'admin') router.push('/admin');
      else router.push('/shop');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users: UserAccount[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    if (isRegister) {
      // 1. XỬ LÝ ĐĂNG KÝ (Tự động cấp quyền 'user')
      if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
        setError('Tên đăng nhập này đã tồn tại!');
        return;
      }

      const newUser: UserAccount = { username, password, role: 'user' };
      users.push(newUser);
      
      localStorage.setItem('registeredUsers', JSON.stringify(users));
      localStorage.setItem('currentUser', JSON.stringify({ username, role: 'user' }));

      alert('Đăng ký tài khoản thành công!');
      router.push('/shop');
    } else {
      // 2. XỬ LÝ ĐĂNG NHẬP
      const foundUser = users.find(
        (u) => u.username === username && u.password === password
      );

      if (!foundUser) {
        setError('Tài khoản hoặc mật khẩu không chính xác!');
        return;
      }

      // Lưu thông tin người dùng đang đăng nhập
      localStorage.setItem('currentUser', JSON.stringify({ username: foundUser.username, role: foundUser.role }));

      // Điều hướng theo Role
      if (foundUser.role === 'admin') {
        router.push('/admin'); // Chuyển đến trang Admin
      } else {
        router.push('/shop');  // Chuyển đến trang Mua sắm / Giỏ hàng
      }
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '4rem auto', padding: '2rem', background: '#fff', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#0f172a' }}>
        {isRegister ? '📝 Đăng Ký Tài Khoản' : '🔐 Đăng Nhập Hệ Thống'}
      </h2>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.6rem', borderRadius: '6px', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: '#334155' }}>Tên đăng nhập</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập tên đăng nhập"
            required
            style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.3rem', fontSize: '0.9rem', color: '#334155' }}>Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            required
            style={{ width: '100%', padding: '0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
          />
        </div>

        <button type="submit" style={{ background: isRegister ? '#16a34a' : '#2563eb', color: '#fff', padding: '0.75rem', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.5rem' }}>
          {isRegister ? 'Tạo Tài Khoản Mới' : 'Đăng Nhập'}
        </button>
      </form>

      {/* Nút chuyển đổi giữa Đăng nhập và Đăng ký */}
      <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
        {isRegister ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
        <span
          onClick={() => { setIsRegister(!isRegister); setError(''); }}
          style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
        >
          {isRegister ? 'Đăng nhập ngay' : 'Đăng ký ngay'}
        </span>
      </p>

      {/* Khung tài khoản test nhanh */}
      {!isRegister && (
        <div style={{ marginTop: '1.5rem', padding: '0.8rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#475569' }}>
          <p style={{ margin: '0 0 0.4rem 0', fontWeight: 'bold' }}>💡 Tài khoản mẫu (Mật khẩu: 123):</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
            <span>👑 Admin: <b>admin</b></span>
            <span style={{ color: '#2563eb' }}>➜ /admin</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>👤 User: <b>user</b></span>
            <span style={{ color: '#16a34a' }}>➜ /shop</span>
          </div>
        </div>
      )}
    </div>
  );
}